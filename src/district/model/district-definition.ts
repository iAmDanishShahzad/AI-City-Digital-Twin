import type { AreaId, DistrictId, EdgeId, NodeId, ProbeId, VehicleId } from '@/core';

export type DistrictPosition = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export type RoadNode = {
  readonly id: NodeId;
  readonly position?: DistrictPosition;
};

export type RoadEdge = {
  readonly id: EdgeId;
  readonly fromNodeId: NodeId;
  readonly toNodeId: NodeId;
  readonly length: number;
  readonly capacity: number;
  readonly isClosable: boolean;
};

export type DistrictArea = {
  readonly id: AreaId;
  readonly label: string;
  readonly position: DistrictPosition;
};

export type VehicleDefinition = {
  readonly id: VehicleId;
  readonly originNodeId: NodeId;
  readonly destinationNodeId: NodeId;
  readonly spawnTick: number;
  readonly baseSpeed: number;
};

export type RouteProbe = {
  readonly id: ProbeId;
  readonly originNodeId: NodeId;
  readonly destinationNodeId: NodeId;
};

export type DistrictDisplayMetadata = {
  readonly label: string;
  readonly areas: readonly DistrictArea[];
};

export type DistrictDefinition = {
  readonly id: DistrictId;
  readonly nodes: readonly RoadNode[];
  readonly edges: readonly RoadEdge[];
  readonly display: DistrictDisplayMetadata;
  readonly baselineVehicles: readonly VehicleDefinition[];
  readonly emergencyAccessProbe: RouteProbe;
  readonly deliveryAccessProbe: RouteProbe;
};
