import { compareText, type EdgeId, type NodeId, type Result } from '@/core';
import type { DistrictDefinition, RoadEdge } from '@/district';

export type RouteSelectionInput = {
  readonly district: DistrictDefinition;
  readonly originNodeId: NodeId;
  readonly destinationNodeId: NodeId;
  readonly blockedEdgeIds?: ReadonlySet<EdgeId>;
  readonly congestionMultipliers?: ReadonlyMap<EdgeId, number>;
};

export type SelectedRoute = {
  readonly edgeIds: readonly EdgeId[];
  readonly nodeIds: readonly NodeId[];
  readonly totalCost: number;
};

export type NoRouteError = {
  readonly code: 'no-route';
  readonly originNodeId: NodeId;
  readonly destinationNodeId: NodeId;
};

export type RouteSelectionResult = Result<SelectedRoute, NoRouteError>;

type RouteCandidate = {
  readonly edgeIds: readonly EdgeId[];
  readonly nodeIds: readonly NodeId[];
  readonly totalCost: number;
};

/**
 * Selects the lowest-cost directed route with deterministic lexicographic tie-breaking.
 */
export function selectShortestRoute(input: RouteSelectionInput): RouteSelectionResult {
  if (
    !containsNode(input.district, input.originNodeId) ||
    !containsNode(input.district, input.destinationNodeId)
  ) {
    return noRoute(input.originNodeId, input.destinationNodeId);
  }

  const initialCandidate: RouteCandidate = {
    edgeIds: [],
    nodeIds: [input.originNodeId],
    totalCost: 0,
  };

  const bestCandidates = new Map<NodeId, RouteCandidate>([[input.originNodeId, initialCandidate]]);
  const frontier: RouteCandidate[] = [initialCandidate];
  const allowedEdgesByOrigin = groupAllowedEdges(input.district.edges, input.blockedEdgeIds);

  while (frontier.length > 0) {
    frontier.sort(compareCandidates);
    const currentCandidate = frontier.shift();

    if (currentCandidate === undefined) {
      break;
    }

    const currentNodeId = currentCandidate.nodeIds.at(-1);

    if (currentNodeId === undefined || bestCandidates.get(currentNodeId) !== currentCandidate) {
      continue;
    }

    if (currentNodeId === input.destinationNodeId) {
      return {
        ok: true,
        value: freezeSelectedRoute(currentCandidate),
      };
    }

    const outgoingEdges = allowedEdgesByOrigin.get(currentNodeId) ?? [];

    for (const edge of outgoingEdges) {
      const nextCandidate = createCandidate(currentCandidate, edge, input.congestionMultipliers);
      const existingCandidate = bestCandidates.get(edge.toNodeId);

      if (
        existingCandidate === undefined ||
        compareCandidates(nextCandidate, existingCandidate) < 0
      ) {
        bestCandidates.set(edge.toNodeId, nextCandidate);
        frontier.push(nextCandidate);
      }
    }
  }

  return noRoute(input.originNodeId, input.destinationNodeId);
}

function containsNode(district: DistrictDefinition, nodeId: NodeId): boolean {
  return district.nodes.some((node) => node.id === nodeId);
}

function groupAllowedEdges(
  edges: readonly RoadEdge[],
  blockedEdgeIds: ReadonlySet<EdgeId> | undefined,
): ReadonlyMap<NodeId, readonly RoadEdge[]> {
  const edgesByOrigin = new Map<NodeId, RoadEdge[]>();

  for (const edge of edges) {
    if (blockedEdgeIds?.has(edge.id) === true) {
      continue;
    }

    const outgoingEdges = edgesByOrigin.get(edge.fromNodeId) ?? [];
    outgoingEdges.push(edge);
    edgesByOrigin.set(edge.fromNodeId, outgoingEdges);
  }

  for (const outgoingEdges of edgesByOrigin.values()) {
    outgoingEdges.sort((first, second) => compareText(first.id, second.id));
  }

  return edgesByOrigin;
}

function createCandidate(
  currentCandidate: RouteCandidate,
  edge: RoadEdge,
  congestionMultipliers: ReadonlyMap<EdgeId, number> | undefined,
): RouteCandidate {
  const congestionMultiplier = congestionMultipliers?.get(edge.id) ?? 1;

  return {
    edgeIds: [...currentCandidate.edgeIds, edge.id],
    nodeIds: [...currentCandidate.nodeIds, edge.toNodeId],
    totalCost: currentCandidate.totalCost + edge.length * congestionMultiplier,
  };
}

function compareCandidates(first: RouteCandidate, second: RouteCandidate): number {
  if (first.totalCost !== second.totalCost) {
    return first.totalCost < second.totalCost ? -1 : 1;
  }

  const edgeSequenceComparison = compareEdgeSequences(first.edgeIds, second.edgeIds);

  if (edgeSequenceComparison !== 0) {
    return edgeSequenceComparison;
  }

  return compareText(lastNodeId(first), lastNodeId(second));
}

function compareEdgeSequences(first: readonly EdgeId[], second: readonly EdgeId[]): number {
  const sharedLength = Math.min(first.length, second.length);

  for (let index = 0; index < sharedLength; index += 1) {
    const comparison = compareText(first[index], second[index]);

    if (comparison !== 0) {
      return comparison;
    }
  }

  return first.length - second.length;
}

function lastNodeId(candidate: RouteCandidate): NodeId {
  return candidate.nodeIds[candidate.nodeIds.length - 1] ?? '';
}

function freezeSelectedRoute(candidate: RouteCandidate): SelectedRoute {
  return Object.freeze({
    edgeIds: Object.freeze([...candidate.edgeIds]),
    nodeIds: Object.freeze([...candidate.nodeIds]),
    totalCost: candidate.totalCost,
  });
}

function noRoute(originNodeId: NodeId, destinationNodeId: NodeId): RouteSelectionResult {
  return {
    ok: false,
    error: Object.freeze({
      code: 'no-route',
      originNodeId,
      destinationNodeId,
    }),
  };
}
