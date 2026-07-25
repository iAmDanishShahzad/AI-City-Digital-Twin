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
});
