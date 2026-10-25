import {
  EmergencyVehicle,
  Intersection,
  TrafficEvent,
  CorridorNodeState,
  SimulationStats,
  AIDecision,
  DirectionKey,
  NormalVehicle,
  Destination,
} from '@/types';
import { calculateDistanceMeters, getTravelDirection } from './cityData';
import { cancelOldSignalPreemptions } from '../routing/routeManager';

export interface SimulationState {
  isEmergencyActive: boolean;
  isPaused: boolean;
  vehicles: EmergencyVehicle[];
  activeVehicleId: string;
  intersections: Intersection[];
  backgroundTraffic: NormalVehicle[];
  events: TrafficEvent[];
  aiDecision: AIDecision | null;
  stats: SimulationStats;
  forcedSignals: Record<string, DirectionKey | null>;
  compareRoutesMode: boolean;
}

/**
 * Perform one tick of the simulation (approx 150ms real time per tick).
 */
export function processSimulationTick(
  state: SimulationState,
  onAiDecisionTrigger?: (vehicle: EmergencyVehicle, targetInt: Intersection, distance: number) => void
): SimulationState {
  if (state.isPaused) return state;

  const newIntersections = state.intersections.map(int => ({ ...int, directions: { ...int.directions } }));
  const newVehicles = state.vehicles.map(v => ({ ...v }));
  const newEvents = [...state.events];
  let newStats = { ...state.stats };

  // 1. Update normal signal cycles for non-preempted intersections
  newIntersections.forEach(int => {
    const forced = state.forcedSignals[int.id];
    if (forced) {
      int.mode = 'PREEMPTION';
      int.directions = {
        NORTH: forced === 'NORTH' ? 'GREEN' : 'RED',
        SOUTH: forced === 'SOUTH' ? 'GREEN' : 'RED',
        EAST: forced === 'EAST' ? 'GREEN' : 'RED',
        WEST: forced === 'WEST' ? 'GREEN' : 'RED',
      };
      return;
    }

    if (int.mode === 'NORMAL') {
      int.normalCycleTimer += 1;
      if (int.normalCycleTimer > 15) {
        int.normalCycleTimer = 0;
        if (int.activeAxis === 'NS') {
          int.activeAxis = 'EW';
          int.directions = { NORTH: 'RED', SOUTH: 'RED', EAST: 'GREEN', WEST: 'GREEN' };
        } else {
          int.activeAxis = 'NS';
          int.directions = { NORTH: 'GREEN', SOUTH: 'GREEN', EAST: 'RED', WEST: 'RED' };
        }
      }
    }
  });

  // 2. Process Emergency Vehicle Movement along OSRM Road Geometry
  const activeVehicle = newVehicles.find(v => v.id === state.activeVehicleId);

  if (activeVehicle && activeVehicle.status === 'EMERGENCY') {
    const routeGeom = activeVehicle.routeGeometry;
    let geomIdx = activeVehicle.routeGeometryIndex || 0;

    let targetLat: number;
    let targetLng: number;
    let isLastWaypoint = false;

    if (routeGeom && routeGeom.length > 0 && geomIdx < routeGeom.length) {
      targetLat = routeGeom[geomIdx][0];
      targetLng = routeGeom[geomIdx][1];
      if (geomIdx === routeGeom.length - 1) {
        isLastWaypoint = true;
      }
    } else {
      targetLat = activeVehicle.destination.lat;
      targetLng = activeVehicle.destination.lng;
      isLastWaypoint = true;
    }

    const distToWaypoint = calculateDistanceMeters(
      activeVehicle.lat,
      activeVehicle.lng,
      targetLat,
      targetLng
    );

    let speed = 78; // km/h
    let step = 0.00045; // Lat/lng movement step per tick

    // Find nearest upcoming intersection along route
    const routeIntIds = activeVehicle.routeIntersectionIds;
    const currentRouteIntId = routeIntIds[activeVehicle.currentRouteIndex];
    const targetInt = newIntersections.find(i => i.id === currentRouteIntId) || null;

    if (targetInt && targetInt.mode !== 'PREEMPTION') {
      const distToInt = calculateDistanceMeters(activeVehicle.lat, activeVehicle.lng, targetInt.lat, targetInt.lng);
      if (distToInt < 120) {
        const travelDir = getTravelDirection(activeVehicle.lat, activeVehicle.lng, targetInt.lat, targetInt.lng);
        if (targetInt.directions[travelDir] === 'RED') {
          speed = 22;
          step = 0.00010;
        }
      }
    }

    activeVehicle.speedKmh = Math.round(speed + (Math.random() * 4 - 2));

    // Move vehicle towards current road geometry waypoint
    const dLat = targetLat - activeVehicle.lat;
    const dLng = targetLng - activeVehicle.lng;
    const distDeg = Math.sqrt(dLat * dLat + dLng * dLng);

    if (distDeg > 0.00012) {
      activeVehicle.lat += (dLat / distDeg) * step;
      activeVehicle.lng += (dLng / distDeg) * step;
      activeVehicle.distanceTraveledKm += 0.03;
    } else {
      // Reached geometry waypoint -> advance to next waypoint
      if (routeGeom && geomIdx < routeGeom.length - 1) {
        activeVehicle.routeGeometryIndex = geomIdx + 1;
      } else if (isLastWaypoint) {
        // Reached Destination Hospital!
        activeVehicle.status = 'COMPLETED';
        activeVehicle.speedKmh = 0;
        activeVehicle.lat = activeVehicle.destination.lat;
        activeVehicle.lng = activeVehicle.destination.lng;

        newEvents.unshift({
          id: `evt-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'COMPLETED',
          message: `🚑 EMERGENCY CORRIDOR COMPLETED! ${activeVehicle.id} arrived at ${activeVehicle.destination.name}.`,
          vehicleId: activeVehicle.id,
        });
      }
    }

    // Check if vehicle passed an intersection node
    if (targetInt) {
      const distToIntNode = calculateDistanceMeters(activeVehicle.lat, activeVehicle.lng, targetInt.lat, targetInt.lng);
      if (distToIntNode < 50) {
        newEvents.unshift({
          id: `evt-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'INFO',
          message: `${activeVehicle.id} cleared ${targetInt.id} (${targetInt.name}).`,
          intersectionId: targetInt.id,
          vehicleId: activeVehicle.id,
        });

        // Release intersection preemption and restore normal cycle
        targetInt.mode = 'NORMAL';
        targetInt.preemptedDirection = null;
        targetInt.preemptedForVehicleId = null;

        activeVehicle.currentRouteIndex += 1;
        newStats.preemptedSignalsCount += 1;
      }
    }

    // 3. Preemption logic for upcoming intersections within detection radius (500m)
    newIntersections.forEach(int => {
      const intRouteIdx = routeIntIds.indexOf(int.id);
      if (intRouteIdx >= activeVehicle.currentRouteIndex) {
        const dist = calculateDistanceMeters(activeVehicle.lat, activeVehicle.lng, int.lat, int.lng);

        if (dist <= activeVehicle.detectionRadiusMeters) {
          const travelDir = getTravelDirection(activeVehicle.lat, activeVehicle.lng, int.lat, int.lng);

          if (int.mode !== 'PREEMPTION' || int.preemptedDirection !== travelDir) {
            int.mode = 'PREEMPTION';
            int.preemptedDirection = travelDir;
            int.preemptedForVehicleId = activeVehicle.id;

            const newDirs = { NORTH: 'RED', SOUTH: 'RED', EAST: 'RED', WEST: 'RED' } as const;
            int.directions = { ...newDirs, [travelDir]: 'GREEN' };

            if (travelDir === 'NORTH') int.directions.SOUTH = 'GREEN';
            if (travelDir === 'SOUTH') int.directions.NORTH = 'GREEN';
            if (travelDir === 'EAST') int.directions.WEST = 'GREEN';
            if (travelDir === 'WEST') int.directions.EAST = 'GREEN';

            newEvents.unshift({
              id: `evt-${Date.now()}-${Math.random()}`,
              timestamp: new Date().toLocaleTimeString(),
              type: 'PREEMPTION',
              message: `PREEMPTION ACTIVATED: ${int.id} set to ${travelDir} GREEN for ${activeVehicle.id} (${Math.round(dist)}m away).`,
              intersectionId: int.id,
              vehicleId: activeVehicle.id,
            });

            if (onAiDecisionTrigger && intRouteIdx === activeVehicle.currentRouteIndex) {
              onAiDecisionTrigger(activeVehicle, int, Math.round(dist));
            }
          }
        }
      }
    });

    // 4. Update dynamic ETA
    const distToDest = calculateDistanceMeters(
      activeVehicle.lat,
      activeVehicle.lng,
      activeVehicle.destination.lat,
      activeVehicle.destination.lng
    );
    const remainingInts = Math.max(0, routeIntIds.length - activeVehicle.currentRouteIndex);

    const aiSecs = Math.round(distToDest / 20);
    const normalSecs = Math.round(distToDest / 8 + remainingInts * 42);

    activeVehicle.etaSeconds = aiSecs;
    newStats.aiEtaSeconds = aiSecs;
    newStats.normalEtaSeconds = normalSecs;
    newStats.timeSavedSeconds = Math.max(0, normalSecs - aiSecs);
  }

  // 5. Update background normal vehicles
  const newBgTraffic = state.backgroundTraffic.map(car => {
    const targetInt = newIntersections.find(i => i.id === car.targetIntersectionId);
    let isStopped = false;
    if (targetInt) {
      const dir = getTravelDirection(car.lat, car.lng, targetInt.lat, targetInt.lng);
      if (targetInt.directions[dir] === 'RED') {
        const dist = calculateDistanceMeters(car.lat, car.lng, targetInt.lat, targetInt.lng);
        if (dist < 80) {
          isStopped = true;
        }
      }
    }
    return { ...car, speedKmh: isStopped ? 0 : 35, stopped: isStopped };
  });

  return {
    ...state,
    intersections: newIntersections,
    vehicles: newVehicles,
    backgroundTraffic: newBgTraffic,
    events: newEvents.slice(0, 100),
    stats: newStats,
  };
}

/**
 * Get Corridor Visualizer Node States
 */
export function getCorridorNodes(vehicle: EmergencyVehicle, intersections: Intersection[]): CorridorNodeState[] {
  const nodes: CorridorNodeState[] = [];

  vehicle.routeIntersectionIds.forEach((intId, index) => {
    const int = intersections.find(i => i.id === intId);
    const name = int ? int.name : intId;

    let status: CorridorNodeState['status'] = 'GREY';
    let dist = 0;
    let eta = 0;
    let preemptedDir: DirectionKey | undefined;

    if (index < vehicle.currentRouteIndex) {
      status = 'PASSED';
    } else if (index === vehicle.currentRouteIndex) {
      status = vehicle.status === 'EMERGENCY' ? 'BLUE' : 'YELLOW';
      if (int) {
        dist = Math.round(calculateDistanceMeters(vehicle.lat, vehicle.lng, int.lat, int.lng));
        eta = Math.round(dist / 20);
        if (int.mode === 'PREEMPTION') {
          status = 'GREEN';
          preemptedDir = int.preemptedDirection || undefined;
        }
      }
    } else {
      if (int) {
        dist = Math.round(calculateDistanceMeters(vehicle.lat, vehicle.lng, int.lat, int.lng));
        eta = Math.round(dist / 20);
        if (int.mode === 'PREEMPTION') {
          status = 'GREEN';
        } else if (index === vehicle.currentRouteIndex + 1 && dist < 1000) {
          status = 'YELLOW';
        }
      }
    }

    nodes.push({
      intersectionId: intId,
      intersectionName: name,
      status,
      distanceMeters: dist,
      etaSeconds: eta,
      preemptedDirection: preemptedDir,
    });
  });

  return nodes;
}
