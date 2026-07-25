import { describe, expect, it } from 'vitest';

import { centralDistrictDefinition, validateDistrictDefinition } from '@/district';

describe('validateDistrictDefinition', () => {
  it('accepts the immutable central district catalog', () => {
    const result = validateDistrictDefinition(centralDistrictDefinition);

    expect(result).toEqual({ ok: true, value: centralDistrictDefinition });
    expect(Object.isFrozen(centralDistrictDefinition)).toBe(true);
    expect(Object.isFrozen(centralDistrictDefinition.nodes)).toBe(true);
    expect(Object.isFrozen(centralDistrictDefinition.edges)).toBe(true);
    expect(Object.isFrozen(centralDistrictDefinition.baselineVehicles)).toBe(true);
  });

  it.each([
    [
      'duplicate node IDs',
      {
        ...centralDistrictDefinition,
        nodes: [...centralDistrictDefinition.nodes, centralDistrictDefinition.nodes[0]],
      },
      'duplicate-node-id',
    ],
    [
      'missing edge node references',
      {
        ...centralDistrictDefinition,
        edges: [
          { ...centralDistrictDefinition.edges[0], toNodeId: 'missing-node' },
          ...centralDistrictDefinition.edges.slice(1),
        ],
      },
      'missing-edge-node-reference',
    ],
    [
      'non-positive edge lengths',
      {
        ...centralDistrictDefinition,
        edges: [
          { ...centralDistrictDefinition.edges[0], length: 0 },
          ...centralDistrictDefinition.edges.slice(1),
        ],
      },
      'invalid-edge-length',
    ],
    [
      'non-positive edge capacities',
      {
        ...centralDistrictDefinition,
        edges: [
          { ...centralDistrictDefinition.edges[0], capacity: 0 },
          ...centralDistrictDefinition.edges.slice(1),
        ],
      },
      'invalid-edge-capacity',
    ],
    [
      'invalid vehicle definitions',
      {
        ...centralDistrictDefinition,
        baselineVehicles: [
          { ...centralDistrictDefinition.baselineVehicles[0], spawnTick: 30 },
          ...centralDistrictDefinition.baselineVehicles.slice(1),
        ],
      },
      'invalid-vehicle-definition',
    ],
    [
      'invalid probe definitions',
      {
        ...centralDistrictDefinition,
        emergencyAccessProbe: {
          ...centralDistrictDefinition.emergencyAccessProbe,
          destinationNodeId: 'missing-node',
        },
      },
      'invalid-probe-node-reference',
    ],
    [
      'missing alternate routes',
      {
        ...centralDistrictDefinition,
        edges: centralDistrictDefinition.edges.filter(
          (edge) =>
            edge.id !== 'civic-square-to-riverside' && edge.id !== 'civic-square-to-south-gate',
        ),
        baselineVehicles: centralDistrictDefinition.baselineVehicles.map((vehicle) => ({
          ...vehicle,
          originNodeId: 'north-gate',
          destinationNodeId: 'east-hub',
        })),
      },
      'missing-alternate-route',
    ],
  ] as const)('rejects %s', (_description, district, expectedCode) => {
    const result = validateDistrictDefinition(district);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.map((error) => error.code)).toContain(expectedCode);
    }
  });
});
