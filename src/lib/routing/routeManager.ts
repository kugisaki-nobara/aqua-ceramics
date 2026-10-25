import { Intersection, TrafficSegment, DirectionKey } from '@/types';
import { calculateDistanceMeters, INITIAL_INTERSECTIONS } from '../simulation/cityData';

export interface RouteResult {
  geometry: [number, number][]; // Array of [lat, lng]
  distanceMeters: number;
  durationSeconds: number;
  intersectionIds: string[];
  isFallback: boolean;
}

/**
 * Fetch real road route from OSRM (OpenStreetMap Routing Engine).
 * Falls back to a realistic local road geometry calculation if network/OSRM fails.
 */
export async function calculateRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  allIntersections: Intersection[] = INITIAL_INTERSECTIONS
): Promise<RouteResult> {
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout safeguard

    const res = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // OSRM returns coordinates as [lng, lat], convert to [lat, lng]
        const rawCoords: [number, number][] = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);

        const distanceMeters = route.distance;
        const durationSeconds = route.duration;

        // Derive upcoming intersections along the OSRM geometry
        const intersectionIds = deriveRouteIntersections(rawCoords, allIntersections);

        return {
          geometry: rawCoords,
          distanceMeters,
          durationSeconds,
          intersectionIds,
          isFallback: false,
        };
      }
    }
  } catch (err) {
    console.warn('OSRM API call failed or timed out, using safe local road fallback:', err);
  }

  // Safe Local Fallback Route Generator
  return generateLocalFallbackRoute(origin, destination, allIntersections);
}

/**
 * Generate a smooth multi-segment local fallback road geometry between origin and destination.
 */
export function generateLocalFallbackRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  allIntersections: Intersection[]
): RouteResult {
  // Find intersections sorted by distance from origin towards destination
  const distOriginToDest = calculateDistanceMeters(origin.lat, origin.lng, destination.lat, destination.lng);

  const matchedInts = allIntersections
    .map(int => {
      const distFromOrigin = calculateDistanceMeters(origin.lat, origin.lng, int.lat, int.lng);
      const distToDest = calculateDistanceMeters(int.lat, int.lng, destination.lat, destination.lng);
      return { int, distFromOrigin, distToDest, score: distFromOrigin + distToDest };
    })
    .filter(item => item.distFromOrigin < distOriginToDest * 1.3)
    .sort((a, b) => a.distFromOrigin - b.distFromOrigin);

  const routeIntIds = matchedInts.slice(0, 5).map(m => m.int.id);

  // Generate intermediate road waypoints
  const waypoints: [number, number][] = [[origin.lat, origin.lng]];

  matchedInts.slice(0, 5).forEach(m => {
    // Add small curve waypoint to simulate realistic road geometry
    const prev = waypoints[waypoints.length - 1];
    const midLat = (prev[0] + m.int.lat) / 2 + (Math.random() * 0.001 - 0.0005);
    const midLng = (prev[1] + m.int.lng) / 2 + (Math.random() * 0.001 - 0.0005);
    waypoints.push([midLat, midLng]);
    waypoints.push([m.int.lat, m.int.lng]);
  });

  waypoints.push([destination.lat, destination.lng]);

  const durationSecs = Math.round(distOriginToDest / 12); // ~40km/h average emergency speed

  return {
    geometry: waypoints,
    distanceMeters: Math.round(distOriginToDest * 1.15),
    durationSeconds: durationSecs,
    intersectionIds: routeIntIds.length > 0 ? routeIntIds : ['INT-BLR-01', 'INT-BLR-03', 'INT-BLR-07'],
    isFallback: true,
  };
}

/**
 * Match a geometry polyline against known intersections to determine which intersections lie along the route.
 */
function deriveRouteIntersections(geometry: [number, number][], allIntersections: Intersection[]): string[] {
  const matchedIds: string[] = [];

  allIntersections.forEach(int => {
    // Check if intersection lies within 180m of any point in geometry
    const isNearRoute = geometry.some(([lat, lng]) => calculateDistanceMeters(lat, lng, int.lat, int.lng) < 180);
    if (isNearRoute) {
      matchedIds.push(int.id);
    }
  });

  return matchedIds.length > 0 ? matchedIds : allIntersections.slice(0, 4).map(i => i.id);
}

/**
 * Off-route check: Determine if ambulance's current location has deviated significantly from planned route geometry.
 */
export function isOffRoute(
  currentLocation: { lat: number; lng: number },
  routeGeometry: [number, number][],
  thresholdMeters = 150
): boolean {
  if (routeGeometry.length === 0) return false;

  let minDistance = Infinity;
  for (const [lat, lng] of routeGeometry) {
    const dist = calculateDistanceMeters(currentLocation.lat, currentLocation.lng, lat, lng);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }

  return minDistance > thresholdMeters;
}

/**
 * Determine if alternative route is significantly faster than current route (e.g. 180+ seconds faster).
 */
export function shouldReroute(
  currentRouteDurationSecs: number,
  alternativeRouteDurationSecs: number,
  timeSavedThresholdSecs = 120
): boolean {
  return currentRouteDurationSecs - alternativeRouteDurationSecs >= timeSavedThresholdSecs;
}

/**
 * Cancel old signal preemptions on abandoned intersections when route changes.
 */
export function cancelOldSignalPreemptions(
  oldRouteIds: string[],
  newRouteIds: string[],
  intersections: Intersection[]
): Intersection[] {
  const abandonedIds = oldRouteIds.filter(id => !newRouteIds.includes(id));

  return intersections.map(int => {
    if (abandonedIds.includes(int.id) && int.mode === 'PREEMPTION') {
      return {
        ...int,
        mode: 'NORMAL',
        preemptedDirection: null,
        preemptedForVehicleId: null,
      };
    }
    return int;
  });
}
