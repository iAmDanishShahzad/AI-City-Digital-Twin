export type {
  EdgeOccupancy,
  EdgeTraffic,
  EdgeTrafficClassification,
  EdgeTrafficCondition,
  MovingVehicleState,
  Route,
  ScenarioEvent,
  ScheduledVehicleState,
  SimulationSnapshot,
  VehicleState,
  WaitingReason,
  WaitingVehicleState,
} from './model/simulation-snapshot';
export { selectShortestRoute } from './routing/shortest-path';
export type {
  NoRouteError,
  RouteSelectionInput,
  RouteSelectionResult,
  SelectedRoute,
} from './routing/shortest-path';
export { advanceSimulation } from './engine/advance-simulation';
export type { SimulationAdvanceInput } from './engine/advance-simulation';
export { createInitialSimulationSnapshot } from './engine/create-initial-simulation-snapshot';
export { resetSimulation } from './engine/reset-simulation';
export { scheduleRoadClosure } from './engine/schedule-road-closure';
export type { RoadClosureScheduleInput } from './engine/schedule-road-closure';
export { deriveEdgeTraffic } from './traffic/derive-edge-traffic';
export type { EdgeTrafficData, EdgeTrafficInput } from './traffic/derive-edge-traffic';
