import type { EdgeId, NodeId, ScenarioEventId, ScenarioId, ScenarioState, VehicleId } from '@/core';

export type Route = {
  readonly edgeIds: readonly EdgeId[];
};

export type ScheduledVehicleState = {
  readonly kind: 'scheduled';
  readonly vehicleId: VehicleId;
  readonly nextSpawnTick: number;
};

export type MovingVehicleState = {
  readonly kind: 'moving';
  readonly vehicleId: VehicleId;
  readonly currentEdgeId: EdgeId;
  readonly edgeProgress: number;
  readonly route: Route;
  readonly routePosition: number;
};

export type WaitingReason = 'destination-reached' | 'no-route';

export type WaitingVehicleState = {
  readonly kind: 'waiting';
  readonly vehicleId: VehicleId;
  readonly nodeId: NodeId;
  readonly route: Route | null;
  readonly remainingWaitTicks: number;
  readonly reason: WaitingReason;
};

export type VehicleState = ScheduledVehicleState | MovingVehicleState | WaitingVehicleState;

export type ScenarioEvent = {
  readonly id: ScenarioEventId;
  readonly scenarioId: ScenarioId;
  readonly scheduledTick: number;
  readonly appliedTick: number | null;
};

export type EdgeOccupancy = Readonly<Record<EdgeId, number>>;

export type SimulationSnapshot = {
  readonly tick: number;
  readonly scenarioState: ScenarioState;
  readonly vehicles: readonly VehicleState[];
  readonly edgeOccupancy: EdgeOccupancy;
  readonly scenarioEvents: readonly ScenarioEvent[];
};
