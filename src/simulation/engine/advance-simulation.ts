import { compareText, type EdgeId, type NodeId, type ScenarioState, type VehicleId } from '@/core';
import type { DistrictDefinition, RoadEdge, VehicleDefinition } from '@/district';

import type {
  EdgeOccupancy,
  MovingVehicleState,
  Route,
  ScenarioEvent,
  SimulationSnapshot,
  VehicleState,
  WaitingVehicleState,
} from '../model/simulation-snapshot';
import { selectShortestRoute } from '../routing/shortest-path';
import { simulationConstants } from './simulation-constants';

export type SimulationAdvanceInput = {
  readonly district: DistrictDefinition;
  readonly snapshot: SimulationSnapshot;
};

type PlannedVehicle = {
  readonly vehicle: VehicleState;
  readonly decrementsWait: boolean;
};

type MovementResult =
  | {
      readonly kind: 'unchanged';
      readonly vehicle: VehicleState;
      readonly decrementsWait: boolean;
    }
  | {
      readonly kind: 'edge-complete';
      readonly vehicle: MovingVehicleState;
      readonly edge: RoadEdge;
      readonly destinationNodeId: NodeId;
    };

/** Advances one complete fixed logical tick without rendering or wall-clock dependencies. */
export function advanceSimulation(input: SimulationAdvanceInput): SimulationSnapshot {
  const vehicleDefinitionsById = new Map(
    input.district.baselineVehicles.map((vehicle) => [vehicle.id, vehicle] as const),
  );
  const edgesById = new Map(input.district.edges.map((edge) => [edge.id, edge] as const));

  // M06 has no scenario effect. This phase preserves the immutable event state for M08.
  const scenarioState = input.snapshot.scenarioState;
  const scenarioEvents = input.snapshot.scenarioEvents;

  // M07 will replace the flat multipliers with a calculation based on this occupancy.
  const previousEdgeOccupancy = calculateEdgeOccupancy(input.district, input.snapshot.vehicles);
  const congestionMultipliers = createFlatCongestionMultipliers(previousEdgeOccupancy);

  const plannedVehicles = [...input.snapshot.vehicles]
    .sort((first, second) => compareText(first.vehicleId, second.vehicleId))
    .map((vehicle) =>
      planVehicle(
        vehicle,
        input.snapshot.tick,
        input.district,
        vehicleDefinitionsById,
        congestionMultipliers,
      ),
    );

  const movementResults = plannedVehicles.map((plannedVehicle) =>
    moveVehicle(plannedVehicle, vehicleDefinitionsById, edgesById, congestionMultipliers),
  );
  const resolvedVehicles = movementResults.map(resolveCompletedEdgeArrival);
  const nextVehicles = resolvedVehicles.map(applyWaitingTransition);

  return freezeSnapshot({
    tick: input.snapshot.tick + 1,
    scenarioState,
    vehicles: nextVehicles,
    edgeOccupancy: calculateEdgeOccupancy(input.district, nextVehicles),
    scenarioEvents,
  });
}

function planVehicle(
  vehicle: VehicleState,
  currentTick: number,
  district: DistrictDefinition,
  vehicleDefinitionsById: ReadonlyMap<VehicleId, VehicleDefinition>,
  congestionMultipliers: ReadonlyMap<EdgeId, number>,
): PlannedVehicle {
  const definition = vehicleDefinitionsById.get(vehicle.vehicleId);

  if (definition === undefined) {
    return { vehicle, decrementsWait: false };
  }

  if (vehicle.kind === 'scheduled') {
    return {
      vehicle:
        vehicle.nextSpawnTick === currentTick
          ? planRoute(definition, definition.originNodeId, district, congestionMultipliers)
          : vehicle,
      decrementsWait: false,
    };
  }

  if (vehicle.kind === 'moving') {
    return { vehicle, decrementsWait: false };
  }

  if (vehicle.reason === 'node-arrival') {
    return {
      vehicle: planRoute(definition, vehicle.nodeId, district, congestionMultipliers),
      decrementsWait: false,
    };
  }

  if (vehicle.remainingWaitTicks === 0) {
    const originNodeId =
      vehicle.reason === 'destination-reached' ? definition.originNodeId : vehicle.nodeId;

    return {
      vehicle: planRoute(definition, originNodeId, district, congestionMultipliers),
      decrementsWait: false,
    };
  }

  return { vehicle, decrementsWait: true };
}

function moveVehicle(
  plannedVehicle: PlannedVehicle,
  vehicleDefinitionsById: ReadonlyMap<VehicleId, VehicleDefinition>,
  edgesById: ReadonlyMap<EdgeId, RoadEdge>,
  congestionMultipliers: ReadonlyMap<EdgeId, number>,
): MovementResult {
  if (plannedVehicle.vehicle.kind !== 'moving') {
    return {
      kind: 'unchanged',
      vehicle: plannedVehicle.vehicle,
      decrementsWait: plannedVehicle.decrementsWait,
    };
  }

  const definition = vehicleDefinitionsById.get(plannedVehicle.vehicle.vehicleId);
  const currentEdge = edgesById.get(plannedVehicle.vehicle.currentEdgeId);

  if (definition === undefined || currentEdge === undefined) {
    return { kind: 'unchanged', vehicle: plannedVehicle.vehicle, decrementsWait: false };
  }

  const congestionMultiplier = congestionMultipliers.get(currentEdge.id) ?? 1;
  const progressIncrease =
    ((definition.baseSpeed / congestionMultiplier) * simulationConstants.tickDurationSeconds) /
    currentEdge.length;
  const nextProgress = plannedVehicle.vehicle.edgeProgress + progressIncrease;

  if (nextProgress < 1) {
    return {
      kind: 'unchanged',
      vehicle: Object.freeze({
        ...plannedVehicle.vehicle,
        route: freezeRoute(plannedVehicle.vehicle.route),
        edgeProgress: nextProgress,
      }),
      decrementsWait: false,
    };
  }

  return {
    kind: 'edge-complete',
    vehicle: plannedVehicle.vehicle,
    edge: currentEdge,
    destinationNodeId: definition.destinationNodeId,
  };
}

function resolveCompletedEdgeArrival(movementResult: MovementResult): PlannedVehicle {
  if (movementResult.kind === 'unchanged') {
    return {
      vehicle: movementResult.vehicle,
      decrementsWait: movementResult.decrementsWait,
    };
  }

  const vehicle = movementResult.vehicle;

  if (movementResult.edge.toNodeId === movementResult.destinationNodeId) {
    return {
      vehicle: createDestinationWait(
        vehicle.vehicleId,
        movementResult.edge.toNodeId,
        vehicle.route,
      ),
      decrementsWait: false,
    };
  }

  return {
    vehicle: createNodeArrivalWait(vehicle.vehicleId, movementResult.edge.toNodeId),
    decrementsWait: false,
  };
}

function applyWaitingTransition(plannedVehicle: PlannedVehicle): VehicleState {
  if (!plannedVehicle.decrementsWait || plannedVehicle.vehicle.kind !== 'waiting') {
    return plannedVehicle.vehicle;
  }

  return Object.freeze({
    ...plannedVehicle.vehicle,
    route: freezeOptionalRoute(plannedVehicle.vehicle.route),
    remainingWaitTicks: plannedVehicle.vehicle.remainingWaitTicks - 1,
  });
}

function planRoute(
  definition: VehicleDefinition,
  originNodeId: NodeId,
  district: DistrictDefinition,
  congestionMultipliers: ReadonlyMap<EdgeId, number>,
): VehicleState {
  const routeResult = selectShortestRoute({
    district,
    originNodeId,
    destinationNodeId: definition.destinationNodeId,
    congestionMultipliers,
  });

  if (!routeResult.ok) {
    return createNoRouteWait(definition.id, originNodeId);
  }

  const currentEdgeId = routeResult.value.edgeIds[0];

  if (currentEdgeId === undefined) {
    return createDestinationWait(
      definition.id,
      definition.destinationNodeId,
      Object.freeze({ edgeIds: Object.freeze([]) }),
    );
  }

  return Object.freeze({
    kind: 'moving',
    vehicleId: definition.id,
    currentEdgeId,
    edgeProgress: 0,
    route: Object.freeze({ edgeIds: Object.freeze([...routeResult.value.edgeIds]) }),
    routePosition: 0,
  });
}

function createNoRouteWait(vehicleId: VehicleId, nodeId: NodeId): WaitingVehicleState {
  return Object.freeze({
    kind: 'waiting',
    vehicleId,
    nodeId,
    route: null,
    remainingWaitTicks: simulationConstants.noRouteRetryTicks,
    reason: 'no-route',
  });
}

function createDestinationWait(
  vehicleId: VehicleId,
  nodeId: NodeId,
  route: Route,
): WaitingVehicleState {
  return Object.freeze({
    kind: 'waiting',
    vehicleId,
    nodeId,
    route: freezeRoute(route),
    remainingWaitTicks: simulationConstants.destinationWaitTicks,
    reason: 'destination-reached',
  });
}

function createNodeArrivalWait(vehicleId: VehicleId, nodeId: NodeId): WaitingVehicleState {
  return Object.freeze({
    kind: 'waiting',
    vehicleId,
    nodeId,
    route: null,
    remainingWaitTicks: 0,
    reason: 'node-arrival',
  });
}

function calculateEdgeOccupancy(
  district: DistrictDefinition,
  vehicles: readonly VehicleState[],
): EdgeOccupancy {
  const occupancy: Record<string, number> = {};

  for (const edge of district.edges) {
    occupancy[edge.id] = 0;
  }

  for (const vehicle of vehicles) {
    if (vehicle.kind === 'moving') {
      occupancy[vehicle.currentEdgeId] = (occupancy[vehicle.currentEdgeId] ?? 0) + 1;
    }
  }

  return Object.freeze(occupancy);
}

function createFlatCongestionMultipliers(
  previousEdgeOccupancy: EdgeOccupancy,
): ReadonlyMap<EdgeId, number> {
  return new Map(
    Object.keys(previousEdgeOccupancy)
      .sort(compareText)
      .map((edgeId) => [edgeId, 1] as const),
  );
}

function freezeSnapshot(snapshot: SimulationSnapshot): SimulationSnapshot {
  return Object.freeze({
    tick: snapshot.tick,
    scenarioState: freezeScenarioState(snapshot.scenarioState),
    vehicles: Object.freeze(snapshot.vehicles.map(freezeVehicle)),
    edgeOccupancy: Object.freeze({ ...snapshot.edgeOccupancy }),
    scenarioEvents: Object.freeze(snapshot.scenarioEvents.map(freezeScenarioEvent)),
  });
}

function freezeVehicle(vehicle: VehicleState): VehicleState {
  if (vehicle.kind === 'scheduled') {
    return Object.freeze({ ...vehicle });
  }

  if (vehicle.kind === 'moving') {
    return Object.freeze({ ...vehicle, route: freezeRoute(vehicle.route) });
  }

  return Object.freeze({ ...vehicle, route: freezeOptionalRoute(vehicle.route) });
}

function freezeRoute(route: Route): Route {
  return Object.freeze({ edgeIds: Object.freeze([...route.edgeIds]) });
}

function freezeOptionalRoute(route: Route | null): Route | null {
  return route === null ? null : freezeRoute(route);
}

function freezeScenarioState(scenarioState: ScenarioState): ScenarioState {
  return Object.freeze({ ...scenarioState });
}

function freezeScenarioEvent(event: ScenarioEvent): ScenarioEvent {
  return Object.freeze({ ...event });
}
