import { describe, expect, it } from 'vitest';

import { centralDistrictDefinition } from '@/district';
import { selectShortestRoute } from '@/simulation';

const northGateToEastHub = {
  district: centralDistrictDefinition,
  originNodeId: 'north-gate',
  destinationNodeId: 'east-hub',
} as const;

describe('selectShortestRoute', () => {
  it('selects the baseline route through the closable edge', () => {
    const result = selectShortestRoute(northGateToEastHub);

    expect(result).toEqual({
      ok: true,
      value: {
        edgeIds: [
          'north-gate-to-civic-square',
          'civic-square-to-market',
          'market-to-hospital',
          'hospital-to-east-hub',
        ],
        nodeIds: ['north-gate', 'civic-square', 'market', 'hospital', 'east-hub'],
        totalCost: 32,
      },
    });
  });

  it('selects the documented alternate route when the closable edge is blocked', () => {
    const result = selectShortestRoute({
      ...northGateToEastHub,
      blockedEdgeIds: new Set(['civic-square-to-market']),
    });

    expect(result).toEqual({
      ok: true,
      value: {
        edgeIds: [
          'north-gate-to-civic-square',
          'civic-square-to-riverside',
          'riverside-to-warehouse',
          'warehouse-to-east-hub',
        ],
        nodeIds: ['north-gate', 'civic-square', 'riverside', 'warehouse', 'east-hub'],
        totalCost: 44,
      },
    });
  });

  it('uses lexicographic edge-ID tie-breaking independently of edge insertion order', () => {
    const district = {
      ...centralDistrictDefinition,
      nodes: [{ id: 'origin' }, { id: 'left' }, { id: 'right' }, { id: 'destination' }],
      edges: [
        {
          id: 'route-z-origin-right',
          fromNodeId: 'origin',
          toNodeId: 'right',
          length: 1,
          capacity: 1,
          isClosable: false,
        },
        {
          id: 'route-z-right-destination',
          fromNodeId: 'right',
          toNodeId: 'destination',
          length: 1,
          capacity: 1,
          isClosable: false,
        },
        {
          id: 'route-a-origin-left',
          fromNodeId: 'origin',
          toNodeId: 'left',
          length: 1,
          capacity: 1,
          isClosable: false,
        },
        {
          id: 'route-a-left-destination',
          fromNodeId: 'left',
          toNodeId: 'destination',
          length: 1,
          capacity: 1,
          isClosable: false,
        },
      ],
    } as const;

    const result = selectShortestRoute({
      district,
      originNodeId: 'origin',
      destinationNodeId: 'destination',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        edgeIds: ['route-a-origin-left', 'route-a-left-destination'],
        nodeIds: ['origin', 'left', 'destination'],
        totalCost: 2,
      },
    });
  });

  it('returns a typed no-route result for disconnected nodes', () => {
    const result = selectShortestRoute({
      ...northGateToEastHub,
      blockedEdgeIds: new Set(['north-gate-to-civic-square']),
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'no-route',
        originNodeId: 'north-gate',
        destinationNodeId: 'east-hub',
      },
    });
  });

  it('excludes every blocked edge from the selected route', () => {
    const blockedEdgeIds = new Set(['civic-square-to-market', 'civic-square-to-south-gate']);
    const result = selectShortestRoute({ ...northGateToEastHub, blockedEdgeIds });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.edgeIds).not.toContain('civic-square-to-market');
      expect(result.value.edgeIds).not.toContain('civic-square-to-south-gate');
    }
  });

  it('uses supplied congestion multipliers to choose the lower-cost route', () => {
    const result = selectShortestRoute({
      ...northGateToEastHub,
      congestionMultipliers: new Map([['civic-square-to-market', 3]]),
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        edgeIds: [
          'north-gate-to-civic-square',
          'civic-square-to-riverside',
          'riverside-to-warehouse',
          'warehouse-to-east-hub',
        ],
        totalCost: 44,
      },
    });
  });

  it('does not mutate the district catalog or supplied routing inputs', () => {
    const blockedEdgeIds = new Set(['hospital-to-warehouse']);
    const congestionMultipliers = new Map([['civic-square-to-market', 1]]);
    const districtBefore = JSON.stringify(centralDistrictDefinition);
    const blockedEdgesBefore = [...blockedEdgeIds];
    const multipliersBefore = [...congestionMultipliers];

    selectShortestRoute({
      ...northGateToEastHub,
      blockedEdgeIds,
      congestionMultipliers,
    });

    expect(JSON.stringify(centralDistrictDefinition)).toBe(districtBefore);
    expect([...blockedEdgeIds]).toEqual(blockedEdgesBefore);
    expect([...congestionMultipliers]).toEqual(multipliersBefore);
    expect(Object.isFrozen(centralDistrictDefinition)).toBe(true);
  });

  it('returns the same result for repeated identical calls', () => {
    const input = {
      ...northGateToEastHub,
      blockedEdgeIds: new Set(['civic-square-to-market']),
      congestionMultipliers: new Map([['riverside-to-warehouse', 2]]),
    };

    expect(selectShortestRoute(input)).toEqual(selectShortestRoute(input));
  });
});
