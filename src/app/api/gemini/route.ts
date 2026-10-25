import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { AIDecision } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicle, currentIntersection, upcomingIntersections, trafficDensity, distanceToNext } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback response generator if API Key is absent or fails
    const generateFallbackDecision = (reasonMsg = 'AI SERVICE UNAVAILABLE — RUNNING SAFE LOCAL FALLBACK'): AIDecision => {
      const nextIntId = currentIntersection?.id || upcomingIntersections?.[0]?.id || 'INT-01';
      return {
        priority: vehicle?.priority || 'CRITICAL',
        recommended_route: vehicle?.routeIntersectionIds || ['INT-01', 'INT-02', 'INT-03', 'INT-04', 'INT-05'],
        next_intersection: nextIntId,
        action: 'PREEMPT_SIGNAL',
        reason: `${reasonMsg}: Preempting ${nextIntId} for incoming ${vehicle?.id || 'AMB-001'} (${distanceToNext || 420}m away).`,
        estimated_time_saved: Math.round(45 + Math.random() * 15),
        confidence: 96,
        isFallback: true,
        timestamp: new Date().toLocaleTimeString(),
      };
    };

    if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return NextResponse.json(generateFallbackDecision('DEMO MODE (NO API KEY)'));
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are the AI Traffic Controller for an Emergency Green Corridor System.
Analyze the following live emergency vehicle telemetry and city intersection traffic status:

Vehicle ID: ${vehicle?.id || 'AMB-001'} (${vehicle?.emergencyType || 'Cardiac Emergency'})
Current Speed: ${vehicle?.speedKmh || 65} km/h
Current Priority: ${vehicle?.priority || 'CRITICAL'}
Approaching Intersection: ${currentIntersection?.name || 'Upcoming Crossing'} (ID: ${currentIntersection?.id || 'INT-01'})
Distance to Intersection: ${distanceToNext || 420} meters
Traffic Density at Target: ${trafficDensity || 'HIGH'}
Remaining Route Intersections: ${JSON.stringify(upcomingIntersections || ['INT-01', 'INT-02', 'INT-03'])}

Task:
Determine the safest and fastest preemption strategy for the approaching ambulance. Calculate estimated time saved and explain your reasoning concisely.

Return ONLY a JSON object with this exact JSON structure:
{
  "priority": "CRITICAL",
  "recommended_route": ["INT-01", "INT-02", "INT-03"],
  "next_intersection": "INT-01",
  "action": "PREEMPT_SIGNAL",
  "reason": "Ambulance approaching INT-01 within 420m radius. Heavy East-West congestion detected. Preempting NS green line immediately.",
  "estimated_time_saved": 48,
  "confidence": 98
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              priority: { type: Type.STRING },
              recommended_route: { type: Type.ARRAY, items: { type: Type.STRING } },
              next_intersection: { type: Type.STRING },
              action: { type: Type.STRING },
              reason: { type: Type.STRING },
              estimated_time_saved: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
            },
            required: ['priority', 'recommended_route', 'next_intersection', 'action', 'reason', 'estimated_time_saved', 'confidence'],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(text);
      const decision: AIDecision = {
        priority: parsed.priority || 'CRITICAL',
        recommended_route: parsed.recommended_route || vehicle?.routeIntersectionIds || [],
        next_intersection: parsed.next_intersection || currentIntersection?.id || 'INT-01',
        action: parsed.action || 'PREEMPT_SIGNAL',
        reason: parsed.reason || 'Gemini AI preemption recommendation active.',
        estimated_time_saved: typeof parsed.estimated_time_saved === 'number' ? parsed.estimated_time_saved : 45,
        confidence: typeof parsed.confidence === 'number' ? Math.min(100, Math.max(70, parsed.confidence)) : 95,
        isFallback: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      return NextResponse.json(decision);
    } catch (geminiError: any) {
      console.warn('Gemini API Error, using deterministic fallback:', geminiError.message || geminiError);
      return NextResponse.json(generateFallbackDecision(`GEMINI ERROR: ${geminiError.message || 'API Call Failed'}`));
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
