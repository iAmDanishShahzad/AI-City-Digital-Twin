import type { Failure, Result } from '@/core';

import type { DistrictDefinition, RoadEdge } from '../model/district-definition';
import type { DistrictValidationError } from '../model/district-validation';
import { districtConstraints } from './district-constraints';

function hasDuplicateId(items: readonly { readonly id: string }[]): boolean {
  return new Set(items.map((item) => item.id)).size !== items.length;
}

function hasPath(
  edges: readonly RoadEdge[],
  originNodeId: string,
  destinationNodeId: string,
): boolean {
  const reachableNodeIds = new Set([originNodeId]);
  const pendingNodeIds = [originNodeId];

  while (pendingNodeIds.length > 0) {
    const currentNodeId = pendingNodeIds.shift();

    if (currentNodeId === undefined) {
      continue;
    }

    for (const edge of edges) {
      if (edge.fromNodeId !== currentNodeId || reachableNodeIds.has(edge.toNodeId)) {
        continue;
      }

      if (edge.toNodeId === destinationNodeId) {
        return true;
      }

      reachableNodeIds.add(edge.toNodeId);
      pendingNodeIds.push(edge.toNodeId);
    }
  }

  return originNodeId === destinationNodeId;
}

function hasRequiredAlternateRoute(district: DistrictDefinition, closableEdge: RoadEdge): boolean {
  const allowedEdges = district.edges.filter((edge) => edge.id !== closableEdge.id);

  return district.baselineVehicles.some((vehicle) => {
    const hasPathToClosure = hasPath(allowedEdges, vehicle.originNodeId, closableEdge.fromNodeId);
    const hasPathFromClosure = hasPath(
      allowedEdges,
      closableEdge.toNodeId,
      vehicle.destinationNodeId,
    );
    const hasAlternatePath = hasPath(allowedEdges, vehicle.originNodeId, vehicle.destinationNodeId);

    return hasPathToClosure && hasPathFromClosure && hasAlternatePath;
  });
}

function createFailure(
  errors: readonly DistrictValidationError[],
): Failure<readonly DistrictValidationError[]> {
  return {
    ok: false,
    error: Object.freeze([...errors]),
  };
}

export function validateDistrictDefinition(
  district: DistrictDefinition,
): Result<DistrictDefinition, readonly DistrictValidationError[]> {
  const errors: DistrictValidationError[] = [];
  const nodeIds = new Set(district.nodes.map((node) => node.id));
  const closableEdges = district.edges.filter((edge) => edge.isClosable);

  if (district.id.trim().length === 0) {
    errors.push({ code: 'invalid-district-id', message: 'District ID must not be empty.' });
  }

  if (district.display.label.trim().length === 0 || district.display.areas.length === 0) {
    errors.push({
      code: 'invalid-display-metadata',
      message: 'District display metadata requires a label and at least one named area.',
    });
  }

  if (
    district.nodes.length < districtConstraints.minimumNodeCount ||
    district.nodes.length > districtConstraints.maximumNodeCount
  ) {
    errors.push({
      code: 'invalid-node-count',
      message: 'District must contain between 8 and 12 nodes.',
    });
  }

  if (
    district.edges.length < districtConstraints.minimumDirectedEdgeCount ||
    district.edges.length > districtConstraints.maximumDirectedEdgeCount
  ) {
    errors.push({
      code: 'invalid-edge-count',
      message: 'District must contain between 12 and 20 directed edges.',
    });
  }

  if (
    district.baselineVehicles.length < districtConstraints.minimumVehicleCount ||
    district.baselineVehicles.length > districtConstraints.maximumVehicleCount
  ) {
    errors.push({
      code: 'invalid-vehicle-count',
      message: 'District must contain between 8 and 12 baseline vehicles.',
    });
  }

  if (hasDuplicateId(district.nodes)) {
    errors.push({ code: 'duplicate-node-id', message: 'District node IDs must be unique.' });
  }

  if (hasDuplicateId(district.edges)) {
    errors.push({ code: 'duplicate-edge-id', message: 'District edge IDs must be unique.' });
  }

  if (hasDuplicateId(district.baselineVehicles)) {
    errors.push({ code: 'duplicate-vehicle-id', message: 'District vehicle IDs must be unique.' });
  }

  if (hasDuplicateId(district.display.areas)) {
    errors.push({ code: 'duplicate-area-id', message: 'District area IDs must be unique.' });
  }

  if (district.emergencyAccessProbe.id === district.deliveryAccessProbe.id) {
    errors.push({ code: 'duplicate-probe-id', message: 'District probe IDs must be unique.' });
  }

  for (const area of district.display.areas) {
    const positionValues = [area.position.x, area.position.y, area.position.z];

    if (
      area.id.trim().length === 0 ||
      area.label.trim().length === 0 ||
      positionValues.some((value) => !Number.isFinite(value))
    ) {
      errors.push({
        code: 'invalid-area',
        message: 'Each area requires an ID, label, and finite position.',
      });
    }
  }

  for (const edge of district.edges) {
    if (!nodeIds.has(edge.fromNodeId) || !nodeIds.has(edge.toNodeId)) {
      errors.push({
        code: 'missing-edge-node-reference',
        message: `Edge ${edge.id} must reference existing nodes.`,
      });
    }

    if (!Number.isFinite(edge.length) || edge.length <= 0) {
      errors.push({
        code: 'invalid-edge-length',
        message: `Edge ${edge.id} must have a positive length.`,
      });
    }

    if (!Number.isInteger(edge.capacity) || edge.capacity <= 0) {
      errors.push({
        code: 'invalid-edge-capacity',
        message: `Edge ${edge.id} must have a positive integer capacity.`,
      });
    }
  }

  if (closableEdges.length !== districtConstraints.requiredClosableEdgeCount) {
    errors.push({
      code: 'invalid-closable-edge-count',
      message: 'District must contain exactly one closable edge.',
    });
  }

  for (const vehicle of district.baselineVehicles) {
    if (!nodeIds.has(vehicle.originNodeId) || !nodeIds.has(vehicle.destinationNodeId)) {
      errors.push({
        code: 'invalid-vehicle-node-reference',
        message: `Vehicle ${vehicle.id} must reference existing origin and destination nodes.`,
      });
    }

    if (
      vehicle.id.trim().length === 0 ||
      vehicle.originNodeId === vehicle.destinationNodeId ||
      !Number.isInteger(vehicle.spawnTick) ||
      vehicle.spawnTick < districtConstraints.minimumSpawnTick ||
      vehicle.spawnTick > districtConstraints.maximumSpawnTick ||
      vehicle.baseSpeed !== districtConstraints.baseVehicleSpeed
    ) {
      errors.push({
        code: 'invalid-vehicle-definition',
        message: `Vehicle ${vehicle.id} must use a valid route, spawn tick, and base speed.`,
      });
    }
  }

  const probes = [district.emergencyAccessProbe, district.deliveryAccessProbe];

  for (const probe of probes) {
    if (!nodeIds.has(probe.originNodeId) || !nodeIds.has(probe.destinationNodeId)) {
      errors.push({
        code: 'invalid-probe-node-reference',
        message: `Probe ${probe.id} must reference existing origin and destination nodes.`,
      });
    }

    if (probe.id.trim().length === 0 || probe.originNodeId === probe.destinationNodeId) {
      errors.push({
        code: 'invalid-probe-definition',
        message: `Probe ${probe.id} must define distinct origin and destination nodes.`,
      });
    }
  }

  const closableEdge = closableEdges[0];

  if (
    closableEdges.length === districtConstraints.requiredClosableEdgeCount &&
    closableEdge !== undefined
  ) {
    if (!hasRequiredAlternateRoute(district, closableEdge)) {
      errors.push({
        code: 'missing-alternate-route',
        message:
          'A baseline vehicle route must use the closable edge and retain an alternate path.',
      });
    }
  }

  return errors.length === 0 ? { ok: true, value: district } : createFailure(errors);
}
