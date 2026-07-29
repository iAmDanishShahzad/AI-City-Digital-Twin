import { describe, expect, it } from 'vitest';

import { centralDistrictDefinition } from '@/district';
import {
  advanceSimulation,
  type MovingVehicleState,
  type Route,
  type SimulationSnapshot,
  type VehicleState,
} from '@/simulation';

function createRoute(edgeIds: readonly string[]): Route {
  return { edgeIds };
}

function createMovingVehicle(
  vehicleId: string,
  currentEdgeId: string,
  edgeProgress = 0,
): MovingVehicleState {
  return {
    kind: 'moving',
    vehicleId,
    currentEdgeId,
    edgeProgress,
    route: createRoute([currentEdgeId]),
    routePosition: 0,
  };
}

function createScheduledVehicle(vehicleId: string): VehicleState {
  return { kind: 'scheduled', vehicleId, nextSpawnTick: 0 };
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

describe('advanceSimulation congestion integration', () => {
  it('uses only pre-movement occupancy for the current tick movement speed', () => {
    const snapshot = createSnapshot([
      createMovingVehicle('vehicle-01', 'north-gate-to-civic-square'),
      createMovingVehicle('traffic-vehicle-01', 'north-gate-to-civic-square'),
      createMovingVehicle('traffic-vehicle-02', 'north-gate-to-civic-square'),
      createMovingVehicle('traffic-vehicle-03', 'north-gate-to-civic-square'),
    ]);

    const nextSnapshot = advanceSimulation({ district: centralDistrictDefinition, snapshot });
    const vehicle = getVehicle(nextSnapshot, 'vehicle-01');

    expect(vehicle.kind).toBe('moving');
    if (vehicle.kind === 'moving') {
      expect(vehicle.edgeProgress).toBeCloseTo(0.0375);
    }
    expect(nextSnapshot.edgeTraffic['north-gate-to-civic-square']).toEqual({
      occupancyRatio: 1,
      congestionMultiplier: 2,
      classification: 'busy',
    });
  });

  it('publishes post-movement occupancy and the pre-movement traffic data used for the tick', () => {
    const snapshot = createSnapshot([
      createMovingVehicle('vehicle-01', 'north-gate-to-civic-square', 0.95),
    ]);

    const nextSnapshot = advanceSimulation({ district: centralDistrictDefinition, snapshot });

    expect(getVehicle(nextSnapshot, 'vehicle-01')).toMatchObject({
      kind: 'waiting',
      nodeId: 'civic-square',
      reason: 'node-arrival',
    });
    expect(nextSnapshot.edgeOccupancy['north-gate-to-civic-square']).toBe(0);
    expect(nextSnapshot.edgeTraffic['north-gate-to-civic-square']).toEqual({
      occupancyRatio: 0.25,
      congestionMultiplier: 1.25,
      classification: 'free-flowing',
    });
  });

  it('uses the same pre-movement multiplier for spawning route selection', () => {
    const snapshot = createSnapshot([
      createScheduledVehicle('vehicle-01'),
      createMovingVehicle('traffic-vehicle-01', 'civic-square-to-market'),
      createMovingVehicle('traffic-vehicle-02', 'civic-square-to-market'),
      createMovingVehicle('traffic-vehicle-03', 'civic-square-to-market'),
      createMovingVehicle('traffic-vehicle-04', 'market-to-hospital'),
      createMovingVehicle('traffic-vehicle-05', 'market-to-hospital'),
      createMovingVehicle('traffic-vehicle-06', 'market-to-hospital'),
      createMovingVehicle('traffic-vehicle-07', 'hospital-to-east-hub'),
      createMovingVehicle('traffic-vehicle-08', 'hospital-to-east-hub'),
      createMovingVehicle('traffic-vehicle-09', 'hospital-to-east-hub'),
    ]);

    const nextSnapshot = advanceSimulation({ district: centralDistrictDefinition, snapshot });
    const vehicle = getVehicle(nextSnapshot, 'vehicle-01');

    expect(vehicle.kind).toBe('moving');
    if (vehicle.kind === 'moving') {
      expect(vehicle.route.edgeIds).toEqual([
        'north-gate-to-civic-square',
        'civic-square-to-riverside',
        'riverside-to-warehouse',
        'warehouse-to-east-hub',
      ]);
      expect(vehicle.edgeProgress).toBeCloseTo(0.075);
    }
  });

  it('is replayable, preserves stable vehicle ordering, and does not mutate the source snapshot', () => {
    const vehicles = [
      createMovingVehicle('traffic-vehicle-b', 'north-gate-to-civic-square'),
      createMovingVehicle('vehicle-01', 'north-gate-to-civic-square'),
      createMovingVehicle('traffic-vehicle-a', 'north-gate-to-civic-square'),
    ] as const;
    const snapshot = createSnapshot(vehicles);
    const sourceSnapshot = JSON.stringify(snapshot);

    const first = advanceSimulation({ district: centralDistrictDefinition, snapshot });
    const second = advanceSimulation({ district: centralDistrictDefinition, snapshot });

    expect(second).toEqual(first);
    expect(first.vehicles.map((vehicle) => vehicle.vehicleId)).toEqual([
      'traffic-vehicle-a',
      'traffic-vehicle-b',
      'vehicle-01',
    ]);
    expect(JSON.stringify(snapshot)).toBe(sourceSnapshot);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.vehicles)).toBe(true);
    expect(Object.isFrozen(first.edgeOccupancy)).toBe(true);
    expect(Object.isFrozen(first.edgeTraffic)).toBe(true);
  });
});
