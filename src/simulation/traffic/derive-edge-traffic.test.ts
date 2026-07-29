import { describe, expect, it } from 'vitest';

import { centralDistrictDefinition } from '@/district';
import type { MovingVehicleState, Route, VehicleState } from '@/simulation';

import { deriveEdgeTraffic } from './derive-edge-traffic';

function createRoute(edgeId: string): Route {
  return { edgeIds: [edgeId] };
}

function createMovingVehicle(vehicleId: string, edgeId: string): MovingVehicleState {
  return {
    kind: 'moving',
    vehicleId,
    currentEdgeId: edgeId,
    edgeProgress: 0,
    route: createRoute(edgeId),
    routePosition: 0,
  };
}

function createVehicles(edgeId: string, count: number): readonly VehicleState[] {
  return Array.from({ length: count }, (_, index) =>
    createMovingVehicle(`traffic-vehicle-${index + 1}`, edgeId),
  );
}

describe('deriveEdgeTraffic', () => {
  it('reports free-flowing traffic with a multiplier of one for zero occupancy', () => {
    const traffic = deriveEdgeTraffic({ district: centralDistrictDefinition, vehicles: [] });

    expect(traffic.edgeOccupancy['north-gate-to-civic-square']).toBe(0);
    expect(traffic.edgeTraffic['north-gate-to-civic-square']).toEqual({
      occupancyRatio: 0,
      congestionMultiplier: 1,
      classification: 'free-flowing',
    });
  });

  it('derives the documented ratio and multiplier at half capacity', () => {
    const traffic = deriveEdgeTraffic({
      district: centralDistrictDefinition,
      vehicles: createVehicles('north-gate-to-civic-square', 2),
    });

    expect(traffic.edgeTraffic['north-gate-to-civic-square']).toEqual({
      occupancyRatio: 0.5,
      congestionMultiplier: 1.5,
      classification: 'free-flowing',
    });
  });

  it('classifies a full edge as busy and calculates its multiplier from capacity', () => {
    const traffic = deriveEdgeTraffic({
      district: centralDistrictDefinition,
      vehicles: createVehicles('civic-square-to-market', 3),
    });

    expect(traffic.edgeTraffic['civic-square-to-market']).toEqual({
      occupancyRatio: 1,
      congestionMultiplier: 2,
      classification: 'busy',
    });
  });

  it('uses the documented busy and congested classification boundaries', () => {
    const atBusyThreshold = deriveEdgeTraffic({
      district: centralDistrictDefinition,
      vehicles: createVehicles('north-gate-to-civic-square', 3),
    });
    const aboveCongestedThreshold = deriveEdgeTraffic({
      district: centralDistrictDefinition,
      vehicles: createVehicles('civic-square-to-market', 4),
    });

    expect(atBusyThreshold.edgeTraffic['north-gate-to-civic-square'].classification).toBe('busy');
    expect(aboveCongestedThreshold.edgeTraffic['civic-square-to-market'].classification).toBe(
      'congested',
    );
  });

  it('caps the congestion multiplier at three and classifies over-capacity traffic as congested', () => {
    const traffic = deriveEdgeTraffic({
      district: centralDistrictDefinition,
      vehicles: createVehicles('civic-square-to-market', 9),
    });

    expect(traffic.edgeTraffic['civic-square-to-market']).toEqual({
      occupancyRatio: 3,
      congestionMultiplier: 3,
      classification: 'congested',
    });
  });

  it('is immutable and independent of vehicle collection order', () => {
    const vehicles = [
      createMovingVehicle('traffic-vehicle-b', 'civic-square-to-market'),
      createMovingVehicle('traffic-vehicle-a', 'civic-square-to-market'),
      createMovingVehicle('traffic-vehicle-c', 'north-gate-to-civic-square'),
    ] as const;
    const originalVehicles = JSON.stringify(vehicles);

    const first = deriveEdgeTraffic({ district: centralDistrictDefinition, vehicles });
    const second = deriveEdgeTraffic({
      district: centralDistrictDefinition,
      vehicles: [...vehicles].reverse(),
    });

    expect(second).toEqual(first);
    expect(JSON.stringify(vehicles)).toBe(originalVehicles);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.edgeOccupancy)).toBe(true);
    expect(Object.isFrozen(first.edgeTraffic)).toBe(true);
    expect(Object.isFrozen(first.edgeTraffic['civic-square-to-market'])).toBe(true);
  });
});
