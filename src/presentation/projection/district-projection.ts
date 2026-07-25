import type { Result } from '@/core';
import type { DistrictDefinition, DistrictPosition } from '@/district';

const roadLaneOffset = 0.28;
const roadWidth = 1.1;
const minimumRoadLength = 0.01;
const landmarkBaseHeight = 3.25;
const landmarkHeightStep = 0.8;

export type ProjectedPosition = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export type ProjectedIntersection = {
  readonly id: string;
  readonly position: ProjectedPosition;
};

export type ProjectedRoad = {
  readonly id: string;
  readonly center: ProjectedPosition;
  readonly length: number;
  readonly rotationY: number;
  readonly width: number;
};

export type ProjectedLandmark = {
  readonly id: string;
  readonly label: string;
  readonly position: ProjectedPosition;
  readonly height: number;
};

export type DistrictProjection = {
  readonly label: string;
  readonly intersections: readonly ProjectedIntersection[];
  readonly roads: readonly ProjectedRoad[];
  readonly landmarks: readonly ProjectedLandmark[];
};

export type DistrictProjectionError = {
  readonly code: 'missing-node-position' | 'missing-road-endpoint' | 'zero-length-road';
  readonly message: string;
};

export function projectDistrict(
  district: DistrictDefinition,
): Result<DistrictProjection, DistrictProjectionError> {
  const nodePositions = new Map(
    district.nodes.flatMap((node) =>
      node.position === undefined ? [] : [[node.id, node.position] as const],
    ),
  );

  const missingPositionNode = district.nodes.find((node) => node.position === undefined);

  if (missingPositionNode !== undefined) {
    return {
      ok: false,
      error: {
        code: 'missing-node-position',
        message: `Node ${missingPositionNode.id} requires a position for scene projection.`,
      },
    };
  }

  const roads: ProjectedRoad[] = [];

  for (const edge of district.edges) {
    const from = nodePositions.get(edge.fromNodeId);
    const to = nodePositions.get(edge.toNodeId);

    if (from === undefined || to === undefined) {
      return {
        ok: false,
        error: {
          code: 'missing-road-endpoint',
          message: `Road ${edge.id} references a node without a scene position.`,
        },
      };
    }

    const road = projectRoad(edge.id, edge.fromNodeId, edge.toNodeId, from, to);

    if (road === undefined) {
      return {
        ok: false,
        error: {
          code: 'zero-length-road',
          message: `Road ${edge.id} cannot be projected because its endpoints overlap.`,
        },
      };
    }

    roads.push(road);
  }

  return {
    ok: true,
    value: Object.freeze({
      label: district.display.label,
      intersections: Object.freeze(
        district.nodes.map((node) =>
          Object.freeze({
            id: node.id,
            position: copyPosition(node.position),
          }),
        ),
      ),
      roads: Object.freeze(roads),
      landmarks: Object.freeze(
        district.display.areas.map((area, index) =>
          Object.freeze({
            id: area.id,
            label: area.label,
            position: copyPosition(area.position),
            height: landmarkBaseHeight + index * landmarkHeightStep,
          }),
        ),
      ),
    }),
  };
}

function projectRoad(
  id: string,
  fromNodeId: string,
  toNodeId: string,
  from: DistrictPosition,
  to: DistrictPosition,
): ProjectedRoad | undefined {
  const deltaX = to.x - from.x;
  const deltaZ = to.z - from.z;
  const length = Math.hypot(deltaX, deltaZ);

  if (length < minimumRoadLength) {
    return undefined;
  }

  const directionOffset = fromNodeId < toNodeId ? roadLaneOffset : -roadLaneOffset;
  const perpendicularX = (-deltaZ / length) * directionOffset;
  const perpendicularZ = (deltaX / length) * directionOffset;

  return Object.freeze({
    id,
    center: Object.freeze({
      x: (from.x + to.x) / 2 + perpendicularX,
      y: (from.y + to.y) / 2,
      z: (from.z + to.z) / 2 + perpendicularZ,
    }),
    length,
    rotationY: Math.atan2(deltaZ, deltaX),
    width: roadWidth,
  });
}

function copyPosition(position: DistrictPosition | undefined): ProjectedPosition {
  if (position === undefined) {
    return Object.freeze({ x: 0, y: 0, z: 0 });
  }

  return Object.freeze({ x: position.x, y: position.y, z: position.z });
}
