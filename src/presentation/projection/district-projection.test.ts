import { centralDistrictDefinition } from '@/district';

import { projectDistrict } from './district-projection';

describe('projectDistrict', () => {
  it('creates an immutable, display-ready projection for every node and edge', () => {
    const result = projectDistrict(centralDistrictDefinition);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value.intersections).toHaveLength(centralDistrictDefinition.nodes.length);
    expect(result.value.roads).toHaveLength(centralDistrictDefinition.edges.length);
    expect(result.value.landmarks).toHaveLength(centralDistrictDefinition.display.areas.length);
    expect(result.value.intersections.map((intersection) => intersection.id)).toEqual(
      centralDistrictDefinition.nodes.map((node) => node.id),
    );
    expect(result.value.roads.map((road) => road.id)).toEqual(
      centralDistrictDefinition.edges.map((edge) => edge.id),
    );
    expect(result.value.intersections.map((intersection) => intersection.label)).toContain(
      'North Gate',
    );
    expect(result.value.roads.some((road) => road.category === 'primary')).toBe(true);
    expect(result.value.roads.some((road) => road.category === 'secondary')).toBe(true);
    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.roads)).toBe(true);
  });

  it('returns a typed error when a node lacks a renderable position', () => {
    const districtWithoutPosition = {
      ...centralDistrictDefinition,
      nodes: centralDistrictDefinition.nodes.map((node, index) =>
        index === 0 ? { ...node, position: undefined } : node,
      ),
    };

    const result = projectDistrict(districtWithoutPosition);

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'missing-node-position',
        message: 'Node north-gate requires a position for scene projection.',
      },
    });
  });

  it('lays out the graph-reference main corridor and alternative route north-up', () => {
    const positions = new Map(
      centralDistrictDefinition.nodes.flatMap((node) =>
        node.position === undefined ? [] : [[node.id, node.position] as const],
      ),
    );
    const northGate = positions.get('north-gate');
    const civicSquare = positions.get('civic-square');
    const market = positions.get('market');
    const hospital = positions.get('hospital');
    const eastHub = positions.get('east-hub');
    const riverside = positions.get('riverside');
    const warehouse = positions.get('warehouse');

    expect(northGate).toBeDefined();
    expect(civicSquare).toBeDefined();
    expect(market).toBeDefined();
    expect(hospital).toBeDefined();
    expect(eastHub).toBeDefined();
    expect(riverside).toBeDefined();
    expect(warehouse).toBeDefined();

    if (
      northGate === undefined ||
      civicSquare === undefined ||
      market === undefined ||
      hospital === undefined ||
      eastHub === undefined ||
      riverside === undefined ||
      warehouse === undefined
    ) {
      return;
    }

    expect(northGate.z).toBeLessThan(civicSquare.z);
    expect([civicSquare.z, market.z, hospital.z, eastHub.z]).toEqual([
      civicSquare.z,
      civicSquare.z,
      civicSquare.z,
      civicSquare.z,
    ]);
    expect(market.x).toBeGreaterThan(civicSquare.x);
    expect(hospital.x).toBeGreaterThan(market.x);
    expect(eastHub.x).toBeGreaterThan(hospital.x);
    expect(warehouse.z).toBe(riverside.z);
    expect(warehouse.x).toBeGreaterThan(riverside.x);
    expect(riverside.z).toBeGreaterThan(civicSquare.z);
  });
});
