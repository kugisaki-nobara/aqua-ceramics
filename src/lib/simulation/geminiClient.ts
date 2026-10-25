import { AIDecision, EmergencyVehicle, Intersection } from '@/types';

export async function fetchAIDecision(
  vehicle: EmergencyVehicle,
  currentIntersection: Intersection | null,
  upcomingIntersections: Intersection[],
  trafficDensity: string,
  distanceToNext: number
): Promise<AIDecision> {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicle,
        currentIntersection,
        upcomingIntersections: upcomingIntersections.map(i => i.id),
        trafficDensity,
        distanceToNext,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: AIDecision = await res.json();
    return data;
  } catch (err) {
    console.warn('Falling back to local AI decision engine:', err);
    const nextIntId = currentIntersection?.id || upcomingIntersections[0]?.id || 'INT-01';
    return {
      priority: vehicle.priority,
      recommended_route: vehicle.routeIntersectionIds,
      next_intersection: nextIntId,
      action: 'PREEMPT_SIGNAL',
      reason: `LOCAL SAFE FALLBACK: ${vehicle.id} detected ${distanceToNext}m from ${nextIntId}. Preempting signals for priority transit.`,
      estimated_time_saved: 44,
      confidence: 94,
      isFallback: true,
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}
