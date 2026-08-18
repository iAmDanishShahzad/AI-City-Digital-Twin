import { describe, expect, it } from 'vitest';

import { centralDistrictDefinition } from '@/district';
import {
  centralRoadClosureScenario,
  createScenarioEffect,
  validateScenarioDefinition,
} from '@/scenarios';
import {
  advanceSimulation,
  createInitialSimulationSnapshot,
  resetSimulation,
  scheduleRoadClosure,
  type MovingVehicleState,
  type SimulationSnapshot,
  type VehicleState,
} from '@/simulation';

const closureEffect = createScenarioEffect(centralRoadClosureScenario);

function scheduleClosure(snapshot: SimulationSnapshot): SimulationSnapshot {
  return scheduleRoadClosure({
    district: centralDistrictDefinition,
    snapshot,
    scenarioId: centralRoadClosureScenario.id,
    closedEdgeId: closureEffect.closedEdgeId,
  });
}

function createMovingVehicle(
  vehicleId: string,
  currentEdgeId: string,
  edgeProgress: number,
  routeEdgeIds: readonly string[],
): MovingVehicleState {
  return {
    kind: 'moving',
    vehicleId,
    currentEdgeId,
    edgeProgress,
    route: { edgeIds: routeEdgeIds },
    routePosition: 0,
  };
}

function createSnapshot(vehicles: readonly VehicleState[]): SimulationSnapshot {
  return {
    tick: 0,
    scenarioState: { kind: 'normal' },
    vehicles,
    edgeOccupancy: {},
    edgeTraffic: {},
    scenarioEvents: [],
  };
}

function getVehicle(snapshot: SimulationSnapshot, vehicleId: string): VehicleState {
  const vehicle = snapshot.vehicles.find((candidate) => candidate.vehicleId === vehicleId);

  if (vehicle === undefined) {
    throw new Error(`Missing vehicle ${vehicleId}.`);
  }

  return vehicle;
}

describe('road-closure scenario', () => {
  it('validates the configured closure and schedules it for exactly the next logical tick', () => {
    expect(validateScenarioDefinition(centralRoadClosureScenario)).toEqual({
      ok: true,
      value: centralRoadClosureScenario,
    });

    const initial = createInitialSimulationSnapshot(centralDistrictDefinition);
    const scheduled = scheduleClosure(initial);

    expect(scheduled.scenarioState).toEqual({ kind: 'normal' });
    expect(scheduled.scenarioEvents).toEqual([
      {
        id: 'central-road-closure@1',
        scenarioId: 'central-road-closure',
        closedEdgeId: 'civic-square-to-market',
        scheduledTick: 1,
        appliedTick: null,
      },
    ]);

    const activated = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: scheduled,
    });

    expect(activated.tick).toBe(1);
    expect(activated.scenarioState).toEqual({
      kind: 'road-closure',
      scenarioId: 'central-road-closure',
      closedEdgeId: 'civic-square-to-market',
    });
    expect(activated.scenarioEvents[0]).toMatchObject({ appliedTick: 1 });
  });

  it('treats a duplicate pending or active closure selection as a no-op', () => {
    const scheduled = scheduleClosure(createInitialSimulationSnapshot(centralDistrictDefinition));

    expect(scheduleClosure(scheduled)).toBe(scheduled);

    const activated = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: scheduled,
    });

    expect(scheduleClosure(activated)).toBe(activated);
    expect(activated.scenarioEvents).toHaveLength(1);
  });

  it('allows a vehicle already on the closed edge to finish normally', () => {
    const snapshot = scheduleClosure(
      createSnapshot([
        createMovingVehicle('vehicle-01', 'civic-square-to-market', 0.95, [
          'civic-square-to-market',
          'market-to-hospital',
          'hospital-to-east-hub',
        ]),
      ]),
    );

    const activated = advanceSimulation({ district: centralDistrictDefinition, snapshot });

    expect(getVehicle(activated, 'vehicle-01')).toEqual({
      kind: 'waiting',
      vehicleId: 'vehicle-01',
      nodeId: 'market',
      route: null,
      remainingWaitTicks: 0,
      reason: 'node-arrival',
    });
  });

  it('discards an approaching route and replans only after the vehicle reaches its next node', () => {
    const snapshot = scheduleClosure(
      createSnapshot([
        createMovingVehicle('vehicle-01', 'north-gate-to-civic-square', 0.95, [
          'north-gate-to-civic-square',
          'civic-square-to-market',
          'market-to-hospital',
          'hospital-to-east-hub',
        ]),
      ]),
    );

    const arrived = advanceSimulation({ district: centralDistrictDefinition, snapshot });
    const replanned = advanceSimulation({ district: centralDistrictDefinition, snapshot: arrived });

    expect(getVehicle(arrived, 'vehicle-01')).toMatchObject({
      kind: 'waiting',
      nodeId: 'civic-square',
      reason: 'node-arrival',
    });
    expect(getVehicle(replanned, 'vehicle-01')).toMatchObject({
      kind: 'moving',
      currentEdgeId: 'civic-square-to-riverside',
      route: {
        edgeIds: ['civic-square-to-riverside', 'riverside-to-warehouse', 'warehouse-to-east-hub'],
      },
    });
  });

  it('places a vehicle into the existing no-route wait when the closure disconnects its node', () => {
    const disconnectedDistrict = {
      ...centralDistrictDefinition,
      edges: centralDistrictDefinition.edges.filter(
        (edge) => edge.fromNodeId !== 'civic-square' || edge.id === 'civic-square-to-market',
      ),
    };
    const snapshot = scheduleRoadClosure({
      district: disconnectedDistrict,
      snapshot: createSnapshot([{ kind: 'scheduled', vehicleId: 'vehicle-04', nextSpawnTick: 0 }]),
      scenarioId: centralRoadClosureScenario.id,
      closedEdgeId: closureEffect.closedEdgeId,
    });

    const activated = advanceSimulation({ district: disconnectedDistrict, snapshot });

    expect(getVehicle(activated, 'vehicle-04')).toEqual({
      kind: 'waiting',
      vehicleId: 'vehicle-04',
      nodeId: 'civic-square',
      route: null,
      remainingWaitTicks: 10,
      reason: 'no-route',
    });
  });

  it('resets to a fresh normal snapshot and replays deterministically', () => {
    const initial = createInitialSimulationSnapshot(centralDistrictDefinition);
    const activated = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: scheduleClosure(initial),
    });
    const reset = resetSimulation(centralDistrictDefinition);
    const replay = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: scheduleClosure(reset),
    });

    expect(reset).toEqual(initial);
    expect(reset).not.toBe(initial);
    expect(reset.vehicles).not.toBe(initial.vehicles);
    expect(reset.scenarioEvents).toEqual([]);
    expect(replay).toEqual(activated);
  });

  it('publishes immutable scenario scheduling and activation snapshots', () => {
    const scheduled = scheduleClosure(createInitialSimulationSnapshot(centralDistrictDefinition));
    const activated = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: scheduled,
    });

    expect(Object.isFrozen(scheduled)).toBe(true);
    expect(Object.isFrozen(scheduled.scenarioEvents)).toBe(true);
    expect(Object.isFrozen(scheduled.scenarioEvents[0])).toBe(true);
    expect(Object.isFrozen(activated)).toBe(true);
    expect(Object.isFrozen(activated.scenarioState)).toBe(true);
    expect(Object.isFrozen(activated.scenarioEvents)).toBe(true);
    expect(Object.isFrozen(activated.scenarioEvents[0])).toBe(true);
  });
});
