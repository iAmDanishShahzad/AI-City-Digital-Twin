import { compareText, type EdgeId } from '@/core';
import type { DistrictDefinition } from '@/district';

import type {
  EdgeOccupancy,
  EdgeTraffic,
  EdgeTrafficCondition,
  EdgeTrafficClassification,
  VehicleState,
} from '../model/simulation-snapshot';

const trafficConstants = Object.freeze({
  baseCongestionMultiplier: 1,
  maximumCongestionContribution: 2,
  freeFlowThreshold: 0.75,
  congestedThreshold: 1.25,
});

export type EdgeTrafficInput = {
  readonly district: DistrictDefinition;
  readonly vehicles: readonly VehicleState[];
};

export type EdgeTrafficData = {
  readonly edgeOccupancy: EdgeOccupancy;
  readonly edgeTraffic: EdgeTraffic;
};

/** Derives immutable occupancy, slowdown, and display data from one vehicle snapshot. */
export function deriveEdgeTraffic(input: EdgeTrafficInput): EdgeTrafficData {
  const edges = [...input.district.edges].sort((first, second) => compareText(first.id, second.id));
  const occupancy = deriveEdgeOccupancyFromEdges(edges, input.vehicles);

  const edgeTraffic: Record<string, EdgeTrafficCondition> = {};

  for (const edge of edges) {
    const occupancyRatio = occupancy[edge.id] / edge.capacity;
    const congestionMultiplier =
      trafficConstants.baseCongestionMultiplier +
      Math.min(trafficConstants.maximumCongestionContribution, occupancyRatio);

    edgeTraffic[edge.id] = Object.freeze({
      occupancyRatio,
      congestionMultiplier,
      classification: classifyEdgeTraffic(occupancyRatio),
    });
  }

  return Object.freeze({
    edgeOccupancy: occupancy,
    edgeTraffic: Object.freeze(edgeTraffic),
  });
}

/** Derives immutable edge counts only; it does not calculate traffic conditions. */
export function deriveEdgeOccupancy(input: EdgeTrafficInput): EdgeOccupancy {
  const edges = [...input.district.edges].sort((first, second) => compareText(first.id, second.id));

  return deriveEdgeOccupancyFromEdges(edges, input.vehicles);
}

function deriveEdgeOccupancyFromEdges(
  edges: readonly DistrictDefinition['edges'][number][],
  vehicles: readonly VehicleState[],
): EdgeOccupancy {
  const occupancy: Record<string, number> = {};

  for (const edge of edges) {
    occupancy[edge.id] = 0;
  }

  for (const vehicle of [...vehicles].sort((first, second) =>
    compareText(first.vehicleId, second.vehicleId),
  )) {
    if (vehicle.kind !== 'moving' || occupancy[vehicle.currentEdgeId] === undefined) {
      continue;
    }

    occupancy[vehicle.currentEdgeId] += 1;
  }

  return Object.freeze(occupancy);
}

function classifyEdgeTraffic(occupancyRatio: number): EdgeTrafficClassification {
  if (occupancyRatio < trafficConstants.freeFlowThreshold) {
    return 'free-flowing';
  }

  return occupancyRatio < trafficConstants.congestedThreshold ? 'busy' : 'congested';
}

export function createCongestionMultiplierMap(
  edgeTraffic: EdgeTraffic,
): ReadonlyMap<EdgeId, number> {
  return new Map(
    Object.keys(edgeTraffic)
      .sort(compareText)
      .map((edgeId) => [edgeId, edgeTraffic[edgeId].congestionMultiplier] as const),
  );
}
