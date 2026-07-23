import type { EdgeId } from '@/core';

export type TrafficImpact = 'low' | 'moderate' | 'high';
export type AccessProbeImpact = 'unchanged' | 'delayed' | 'unavailable';

export type AccessProbeSummary = {
  readonly impact: AccessProbeImpact;
  readonly baselineRouteCost: number | null;
  readonly scenarioRouteCost: number | null;
  readonly isSimulationProxy: true;
};

export type AnalyticsSummary = {
  readonly reroutedVehicleCount: number;
  readonly waitingVehicleCount: number;
  readonly congestedEdgeCount: number;
  readonly trafficImpact: TrafficImpact;
  readonly affectedEdgeIds: readonly EdgeId[];
  readonly emergencyAccess: AccessProbeSummary;
  readonly deliveryAccess: AccessProbeSummary;
};
