import { describe, expect, it } from 'vitest';

import { centralDistrictDefinition } from '@/district';
import {
  advanceSimulation,
  createInitialSimulationSnapshot,
  type MovingVehicleState,
  type Route,
  type SimulationSnapshot,
  type VehicleState,
  type WaitingVehicleState,
} from '@/simulation';

function createRoute(edgeIds: readonly string[]): Route {
  return { edgeIds };
}

function createMovingVehicle(
  vehicleId: string,
  currentEdgeId: string,
  edgeProgress: number,
  route: Route,
): MovingVehicleState {
  return {
    kind: 'moving',
    vehicleId,
    currentEdgeId,
    edgeProgress,
    route,
    routePosition: 0,
  };
}

function createWaitingVehicle(
  vehicleId: string,
  nodeId: string,
  remainingWaitTicks: number,
  reason: WaitingVehicleState['reason'],
  route: Route | null,
): WaitingVehicleState {
  return {
    kind: 'waiting',
    vehicleId,
    nodeId,
    route,
    remainingWaitTicks,
    reason,
  };
}

function createSnapshot(tick: number, vehicles: readonly VehicleState[]): SimulationSnapshot {
  return {
    tick,
    scenarioState: { kind: 'normal' },
    vehicles,
    edgeOccupancy: {},
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

function advanceTicks(snapshot: SimulationSnapshot, count: number): SimulationSnapshot {
  let currentSnapshot = snapshot;

  for (let index = 0; index < count; index += 1) {
    currentSnapshot = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: currentSnapshot,
    });
  }

  return currentSnapshot;
}

describe('createInitialSimulationSnapshot', () => {
  it('creates an immutable tick-zero snapshot with the deterministic scheduled roster', () => {
    const snapshot = createInitialSimulationSnapshot(centralDistrictDefinition);

    expect(snapshot.tick).toBe(0);
    expect(snapshot.scenarioState).toEqual({ kind: 'normal' });
    expect(snapshot.vehicles.map((vehicle) => vehicle.vehicleId)).toEqual([
      'vehicle-01',
      'vehicle-02',
      'vehicle-03',
      'vehicle-04',
      'vehicle-05',
      'vehicle-06',
      'vehicle-07',
      'vehicle-08',
      'vehicle-09',
      'vehicle-10',
    ]);
    expect(snapshot.vehicles.every((vehicle) => vehicle.kind === 'scheduled')).toBe(true);
    expect(snapshot.edgeOccupancy).toEqual(
      Object.fromEntries(centralDistrictDefinition.edges.map((edge) => [edge.id, 0])),
    );
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.vehicles)).toBe(true);
    expect(Object.isFrozen(snapshot.edgeOccupancy)).toBe(true);
  });
});

describe('advanceSimulation', () => {
  it('spawns a scheduled vehicle exactly on its configured tick', () => {
    const nextSnapshot = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: createInitialSimulationSnapshot(centralDistrictDefinition),
    });
    const firstVehicle = getVehicle(nextSnapshot, 'vehicle-01');
    const secondVehicle = getVehicle(nextSnapshot, 'vehicle-02');

    expect(nextSnapshot.tick).toBe(1);
    expect(firstVehicle).toEqual({
      kind: 'moving',
      vehicleId: 'vehicle-01',
      currentEdgeId: 'north-gate-to-civic-square',
      edgeProgress: 0.07500000000000001,
      route: {
        edgeIds: [
          'north-gate-to-civic-square',
          'civic-square-to-market',
          'market-to-hospital',
          'hospital-to-east-hub',
        ],
      },
      routePosition: 0,
    });
    expect(secondVehicle).toEqual({
      kind: 'scheduled',
      vehicleId: 'vehicle-02',
      nextSpawnTick: 3,
    });
  });

  it('moves a vehicle by its base speed over the fixed 0.1-second tick duration', () => {
    const afterSpawn = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: createInitialSimulationSnapshot(centralDistrictDefinition),
    });
    const afterSecondTick = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: afterSpawn,
    });
    const firstVehicle = getVehicle(afterSecondTick, 'vehicle-01');

    expect(firstVehicle.kind).toBe('moving');

    if (firstVehicle.kind === 'moving') {
      expect(firstVehicle.edgeProgress).toBeCloseTo(0.15);
      expect(firstVehicle.edgeProgress).toBeGreaterThan(0);
      expect(firstVehicle.edgeProgress).toBeLessThan(1);
    }
  });

  it('resolves edge completion into a node-arrival state before the next planning phase', () => {
    const snapshot = createSnapshot(0, [
      createMovingVehicle(
        'vehicle-01',
        'north-gate-to-civic-square',
        0.95,
        createRoute([
          'north-gate-to-civic-square',
          'civic-square-to-market',
          'market-to-hospital',
          'hospital-to-east-hub',
        ]),
      ),
    ]);

    const arrivedSnapshot = advanceSimulation({ district: centralDistrictDefinition, snapshot });
    const replannedSnapshot = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: arrivedSnapshot,
    });

    expect(getVehicle(arrivedSnapshot, 'vehicle-01')).toEqual({
      kind: 'waiting',
      vehicleId: 'vehicle-01',
      nodeId: 'civic-square',
      route: null,
      remainingWaitTicks: 0,
      reason: 'node-arrival',
    });
    expect(getVehicle(replannedSnapshot, 'vehicle-01')).toEqual({
      kind: 'moving',
      vehicleId: 'vehicle-01',
      currentEdgeId: 'civic-square-to-market',
      edgeProgress: 0.07500000000000001,
      route: {
        edgeIds: ['civic-square-to-market', 'market-to-hospital', 'hospital-to-east-hub'],
      },
      routePosition: 0,
    });
  });

  it('moves a vehicle that reaches its destination into the fixed destination wait', () => {
    const snapshot = createSnapshot(0, [
      createMovingVehicle(
        'vehicle-01',
        'hospital-to-east-hub',
        0.95,
        createRoute(['hospital-to-east-hub']),
      ),
    ]);

    const nextSnapshot = advanceSimulation({ district: centralDistrictDefinition, snapshot });

    expect(getVehicle(nextSnapshot, 'vehicle-01')).toEqual({
      kind: 'waiting',
      vehicleId: 'vehicle-01',
      nodeId: 'east-hub',
      route: { edgeIds: ['hospital-to-east-hub'] },
      remainingWaitTicks: 20,
      reason: 'destination-reached',
    });
  });

  it('waits 20 ticks after destination arrival and then respawns on the following configured tick', () => {
    const destinationWait = createSnapshot(0, [
      createWaitingVehicle(
        'vehicle-01',
        'east-hub',
        20,
        'destination-reached',
        createRoute(['hospital-to-east-hub']),
      ),
    ]);
    const beforeRespawn = advanceTicks(destinationWait, 19);

    const waitEndedSnapshot = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: beforeRespawn,
    });
    const respawnedSnapshot = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: waitEndedSnapshot,
    });

    expect(getVehicle(beforeRespawn, 'vehicle-01')).toMatchObject({
      kind: 'waiting',
      remainingWaitTicks: 1,
      reason: 'destination-reached',
    });
    expect(getVehicle(waitEndedSnapshot, 'vehicle-01')).toMatchObject({
      kind: 'waiting',
      remainingWaitTicks: 0,
      reason: 'destination-reached',
    });
    expect(getVehicle(respawnedSnapshot, 'vehicle-01')).toMatchObject({
      kind: 'moving',
      currentEdgeId: 'north-gate-to-civic-square',
      edgeProgress: 0.07500000000000001,
    });
  });

  it('waits for a typed no-route result and retries after ten ticks', () => {
    const disconnectedDistrict = {
      ...centralDistrictDefinition,
      edges: centralDistrictDefinition.edges.filter(
        (edge) => edge.id !== 'north-gate-to-civic-square',
      ),
    };
    const firstAttempt = advanceSimulation({
      district: disconnectedDistrict,
      snapshot: createSnapshot(0, [
        { kind: 'scheduled', vehicleId: 'vehicle-01', nextSpawnTick: 0 },
      ]),
    });
    const beforeRetry = advanceTicks(firstAttempt, 9);
    const retriedWithoutRoute = advanceSimulation({
      district: disconnectedDistrict,
      snapshot: beforeRetry,
    });
    const repeatedNoRoute = advanceSimulation({
      district: disconnectedDistrict,
      snapshot: retriedWithoutRoute,
    });
    const readyToRetryWithRoute = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: createSnapshot(10, [
        createWaitingVehicle('vehicle-01', 'north-gate', 1, 'no-route', null),
      ]),
    });
    const retriedWithRoute = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: readyToRetryWithRoute,
    });

    expect(getVehicle(firstAttempt, 'vehicle-01')).toMatchObject({
      kind: 'waiting',
      nodeId: 'north-gate',
      remainingWaitTicks: 10,
      reason: 'no-route',
    });
    expect(getVehicle(beforeRetry, 'vehicle-01')).toMatchObject({
      kind: 'waiting',
      remainingWaitTicks: 1,
      reason: 'no-route',
    });
    expect(getVehicle(retriedWithoutRoute, 'vehicle-01')).toMatchObject({
      kind: 'waiting',
      remainingWaitTicks: 0,
      reason: 'no-route',
    });
    expect(getVehicle(repeatedNoRoute, 'vehicle-01')).toMatchObject({
      kind: 'waiting',
      remainingWaitTicks: 10,
      reason: 'no-route',
    });
    expect(getVehicle(retriedWithRoute, 'vehicle-01')).toMatchObject({
      kind: 'moving',
      currentEdgeId: 'north-gate-to-civic-square',
      edgeProgress: 0.07500000000000001,
    });
  });

  it('calculates immutable occupancy from the next snapshot moving vehicles', () => {
    const snapshot = createSnapshot(0, [
      createMovingVehicle(
        'vehicle-02',
        'civic-square-to-market',
        0,
        createRoute(['civic-square-to-market', 'market-to-hospital']),
      ),
      createMovingVehicle(
        'vehicle-01',
        'north-gate-to-civic-square',
        0,
        createRoute(['north-gate-to-civic-square', 'civic-square-to-market']),
      ),
    ]);

    const nextSnapshot = advanceSimulation({ district: centralDistrictDefinition, snapshot });

    expect(nextSnapshot.edgeOccupancy['north-gate-to-civic-square']).toBe(1);
    expect(nextSnapshot.edgeOccupancy['civic-square-to-market']).toBe(1);
    expect(nextSnapshot.edgeOccupancy['warehouse-to-east-hub']).toBe(0);
    expect(Object.isFrozen(nextSnapshot.edgeOccupancy)).toBe(true);
  });

  it('processes vehicles in ascending identifier order and preserves immutable inputs', () => {
    const initialSnapshot = createInitialSimulationSnapshot(centralDistrictDefinition);
    const reversedSnapshot = {
      ...initialSnapshot,
      vehicles: [...initialSnapshot.vehicles].reverse(),
    };
    const inputBefore = JSON.stringify(reversedSnapshot);
    const nextSnapshot = advanceSimulation({
      district: centralDistrictDefinition,
      snapshot: reversedSnapshot,
    });

    expect(nextSnapshot.vehicles.map((vehicle) => vehicle.vehicleId)).toEqual([
      'vehicle-01',
      'vehicle-02',
      'vehicle-03',
      'vehicle-04',
      'vehicle-05',
      'vehicle-06',
      'vehicle-07',
      'vehicle-08',
      'vehicle-09',
      'vehicle-10',
    ]);
    expect(JSON.stringify(reversedSnapshot)).toBe(inputBefore);
    expect(Object.isFrozen(nextSnapshot)).toBe(true);
    expect(Object.isFrozen(nextSnapshot.vehicles)).toBe(true);
    expect(Object.isFrozen(nextSnapshot.vehicles[0])).toBe(true);
  });

  it('produces identical snapshots for repeated deterministic replays', () => {
    const firstRun = advanceTicks(createInitialSimulationSnapshot(centralDistrictDefinition), 12);
    const secondRun = advanceTicks(createInitialSimulationSnapshot(centralDistrictDefinition), 12);

    expect(firstRun).toEqual(secondRun);
  });
});
