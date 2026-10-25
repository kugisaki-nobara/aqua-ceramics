'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header/Header';
import { Sidebar, TabType } from '@/components/Sidebar/Sidebar';
import { CityMap } from '@/components/Map/CityMap';
import { EmergencyControlCard } from '@/components/EmergencyPanel/EmergencyControlCard';
import { AIDecisionPanel } from '@/components/AIDecision/AIDecisionPanel';
import { CorridorStatusVisualizer } from '@/components/GreenCorridor/CorridorStatusVisualizer';
import { DetectionCard } from '@/components/TrafficDetection/DetectionCard';
import { RouteComparisonCard } from '@/components/RouteOptimization/RouteComparisonCard';
import { BeforeAfterComparison } from '@/components/Stats/BeforeAfterComparison';
import { EventLogPanel } from '@/components/EventLog/EventLogPanel';
import { SignalStatusGrid } from '@/components/TrafficSignals/SignalStatusGrid';
import { VehicleSelector } from '@/components/EmergencyPanel/VehicleSelector';
import { ArchitectureView } from '@/components/Architecture/ArchitectureView';
import { RouteSearchPanel } from '@/components/RoutePanel/RouteSearchPanel';
import { ActiveNavigationCard } from '@/components/NavigationPanel/ActiveNavigationCard';

import {
  INITIAL_INTERSECTIONS,
  INITIAL_VEHICLES,
  INITIAL_BACKGROUND_TRAFFIC,
  BENGALURU_HOSPITALS,
  calculateDistanceMeters,
} from '@/lib/simulation/cityData';
import {
  SimulationState,
  processSimulationTick,
} from '@/lib/simulation/trafficEngine';
import {
  BENGALURU_DEFAULT_LOCATION,
  getCurrentUserLocation,
  sanitizeLocationForAI,
} from '@/lib/location/locationManager';
import {
  calculateRoute,
  cancelOldSignalPreemptions,
} from '@/lib/routing/routeManager';
import { fetchAIDecision } from '@/lib/simulation/geminiClient';
import { Destination, DirectionKey, EmergencyVehicle, UserLocation } from '@/types';

export default function EmergencyCorridorApp() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [aiLoading, setAiLoading] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // User Geolocation State
  const [userLocation, setUserLocation] = useState<UserLocation>(BENGALURU_DEFAULT_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLiveGpsActive, setIsLiveGpsActive] = useState(false);

  // Selected Destination
  const [selectedDestination, setSelectedDestination] = useState<Destination>(BENGALURU_HOSPITALS[0]);

  // Main Simulation State
  const [simState, setSimState] = useState<SimulationState>({
    isEmergencyActive: false,
    isPaused: false,
    vehicles: INITIAL_VEHICLES,
    activeVehicleId: 'AMB-001',
    intersections: INITIAL_INTERSECTIONS,
    backgroundTraffic: INITIAL_BACKGROUND_TRAFFIC,
    events: [
      {
        id: 'evt-init',
        timestamp: new Date().toLocaleTimeString(),
        type: 'INFO',
        message: 'AI Emergency Corridor System initialized. Default region set to Bengaluru, Karnataka.',
      },
    ],
    aiDecision: null,
    stats: {
      normalEtaSeconds: 540,
      aiEtaSeconds: 280,
      timeSavedSeconds: 260,
      stopsWithoutAi: 4,
      stopsWithAi: 0,
      preemptedSignalsCount: 0,
      avgSpeedWithoutAiKmh: 28,
      avgSpeedWithAiKmh: 78,
    },
    forcedSignals: {},
    compareRoutesMode: false,
  });

  const stateRef = useRef(simState);
  stateRef.current = simState;

  const activeVehicle = simState.vehicles.find(v => v.id === simState.activeVehicleId) || simState.vehicles[0];
  const targetInt = simState.intersections.find(i => i.id === activeVehicle.routeIntersectionIds[activeVehicle.currentRouteIndex]) || null;
  const distToNext = targetInt
    ? Math.round(calculateDistanceMeters(activeVehicle.lat, activeVehicle.lng, targetInt.lat, targetInt.lng))
    : 0;

  // Request Browser Geolocation
  const handleRequestUserLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    const result = await getCurrentUserLocation();
    setUserLocation(result.location);
    if (result.error) {
      setLocationError(result.error);
    } else {
      setSimState(prev => ({
        ...prev,
        events: [
          {
            id: `evt-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'INFO',
            message: `📍 User GPS Location locked: ${result.location.lat.toFixed(4)}, ${result.location.lng.toFixed(4)}.`,
          },
          ...prev.events,
        ],
      }));
    }
    setIsLocating(false);
  };

  // Watch position for Live GPS mode
  useEffect(() => {
    if (!isLiveGpsActive || typeof window === 'undefined' || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const newLoc: UserLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isDefault: false,
          addressName: 'Live GPS Location (Active)',
        };
        setUserLocation(newLoc);
      },
      err => {
        console.warn('Live GPS watch error:', err);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isLiveGpsActive]);

  // AI Decision Trigger with Privacy Guard
  const handleTriggerAiDecision = async (vehicle: typeof activeVehicle, target: typeof targetInt, dist: number) => {
    if (!target) return;
    setAiLoading(true);

    // PRIVACY GUARD: Pass coarsened/sanitized location instead of exact coordinates
    const sanitizedContext = sanitizeLocationForAI(vehicle.lat, vehicle.lng);

    const decision = await fetchAIDecision(
      {
        ...vehicle,
        emergencyType: `${vehicle.emergencyType} (${sanitizedContext})`,
      },
      target,
      simState.intersections.filter(i => vehicle.routeIntersectionIds.includes(i.id)),
      target.trafficDensity,
      dist
    );

    setSimState(prev => ({
      ...prev,
      aiDecision: decision,
    }));
    setAiLoading(false);
  };

  // Main Simulation Tick Loop
  useEffect(() => {
    const activeV = simState.vehicles.find(v => v.id === simState.activeVehicleId);
    if (!activeV || activeV.status !== 'EMERGENCY' || simState.isPaused) return;

    const interval = setInterval(() => {
      setSimState(prevState => {
        const nextState = processSimulationTick(prevState, (v, int, dist) => {
          handleTriggerAiDecision(v, int, dist);
        });

        const updatedVehicle = nextState.vehicles.find(v => v.id === nextState.activeVehicleId);
        if (
          updatedVehicle &&
          updatedVehicle.status === 'COMPLETED' &&
          prevState.vehicles.find(v => v.id === nextState.activeVehicleId)?.status !== 'COMPLETED'
        ) {
          confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
          setShowCompletionModal(true);
        }

        return nextState;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [simState.activeVehicleId, simState.isPaused, activeVehicle.status]);

  // Start Emergency Route Calculation & Simulation
  const handleStartRoute = async () => {
    const routeRes = await calculateRoute(userLocation, selectedDestination, simState.intersections);

    setSimState(prev => {
      const newVehicles = prev.vehicles.map(v =>
        v.id === prev.activeVehicleId
          ? {
              ...v,
              status: 'EMERGENCY' as const,
              speedKmh: 78,
              lat: userLocation.lat,
              lng: userLocation.lng,
              startLocation: {
                lat: userLocation.lat,
                lng: userLocation.lng,
                name: userLocation.addressName,
              },
              destination: selectedDestination,
              routeGeometry: routeRes.geometry,
              routeGeometryIndex: 0,
              routeIntersectionIds: routeRes.intersectionIds,
              currentRouteIndex: 0,
              totalDistanceKm: Number((routeRes.distanceMeters / 1000).toFixed(1)),
              etaSeconds: routeRes.durationSeconds,
            }
          : v
      );

      const newEvents = [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'ALERT' as const,
          message: `🚨 EMERGENCY ROUTE STARTED: ${prev.activeVehicleId} dispatched from ${userLocation.addressName} → ${selectedDestination.name} via OSRM (${(routeRes.distanceMeters / 1000).toFixed(1)} km).`,
          vehicleId: prev.activeVehicleId,
        },
        ...prev.events,
      ];

      return {
        ...prev,
        isEmergencyActive: true,
        isPaused: false,
        vehicles: newVehicles,
        events: newEvents,
      };
    });

    if (targetInt) {
      handleTriggerAiDecision(activeVehicle, targetInt, 450);
    }
  };

  // Dynamic Rerouting Logic from Current Position
  const handleReroute = async () => {
    const currentPos = { lat: activeVehicle.lat, lng: activeVehicle.lng };
    const newRouteRes = await calculateRoute(currentPos, selectedDestination, simState.intersections);

    setSimState(prev => {
      const updatedIntersections = cancelOldSignalPreemptions(
        activeVehicle.routeIntersectionIds,
        newRouteRes.intersectionIds,
        prev.intersections
      );

      const newVehicles = prev.vehicles.map(v =>
        v.id === prev.activeVehicleId
          ? {
              ...v,
              routeGeometry: newRouteRes.geometry,
              routeGeometryIndex: 0,
              routeIntersectionIds: newRouteRes.intersectionIds,
              currentRouteIndex: 0,
              isRerouting: true,
              rerouteReason: 'Traffic congestion on previous path. Express corridor activated.',
              etaSeconds: newRouteRes.durationSeconds,
            }
          : v
      );

      const newEvents = [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'REROUTE' as const,
          message: `🔄 ROUTE REROUTED: Heavy congestion detected on Outer Ring Road. Alternative route via Express Link saves ~3 mins. Signal preemptions updated.`,
          vehicleId: prev.activeVehicleId,
        },
        ...prev.events,
      ];

      return {
        ...prev,
        intersections: updatedIntersections,
        vehicles: newVehicles,
        events: newEvents,
      };
    });

    setTimeout(() => {
      setSimState(prev => ({
        ...prev,
        vehicles: prev.vehicles.map(v => (v.id === prev.activeVehicleId ? { ...v, isRerouting: false } : v)),
      }));
    }, 4000);
  };

  const handlePauseToggle = () => {
    setSimState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleReset = () => {
    setSimState({
      isEmergencyActive: false,
      isPaused: false,
      vehicles: INITIAL_VEHICLES.map(v => ({
        ...v,
        status: 'IDLE',
        speedKmh: 0,
        currentRouteIndex: 0,
        routeGeometryIndex: 0,
        lat: userLocation.lat,
        lng: userLocation.lng,
      })),
      activeVehicleId: 'AMB-001',
      intersections: INITIAL_INTERSECTIONS.map(i => ({ ...i, mode: 'NORMAL', directions: { NORTH: 'GREEN', SOUTH: 'GREEN', EAST: 'RED', WEST: 'RED' } })),
      backgroundTraffic: INITIAL_BACKGROUND_TRAFFIC,
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'INFO',
          message: 'Simulation reset to baseline starting positions in Bengaluru.',
        },
      ],
      aiDecision: null,
      stats: {
        normalEtaSeconds: 540,
        aiEtaSeconds: 280,
        timeSavedSeconds: 260,
        stopsWithoutAi: 4,
        stopsWithAi: 0,
        preemptedSignalsCount: 0,
        avgSpeedWithoutAiKmh: 28,
        avgSpeedWithAiKmh: 78,
      },
      forcedSignals: {},
      compareRoutesMode: false,
    });
    setShowCompletionModal(false);
  };

  const handleNormalMode = () => {
    setSimState(prev => ({
      ...prev,
      intersections: prev.intersections.map(i => ({
        ...i,
        mode: 'NORMAL',
        preemptedDirection: null,
      })),
      forcedSignals: {},
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'INFO',
          message: 'Manual override: All signal preemptions released.',
        },
        ...prev.events,
      ],
    }));
  };

  const handleForceSignal = (intersectionId: string, direction: DirectionKey | null) => {
    setSimState(prev => ({
      ...prev,
      forcedSignals: {
        ...prev.forcedSignals,
        [intersectionId]: direction,
      },
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'PREEMPTION',
          message: `MANUAL OVERRIDE: ${intersectionId} forced to ${direction || 'NORMAL'}.`,
          intersectionId,
        },
        ...prev.events,
      ],
    }));
  };

  // Showcase Demo Mode with Dynamic Rerouting Demonstration
  const handleRunEmergencyDemo = async () => {
    handleReset();

    setTimeout(async () => {
      await handleStartRoute();

      setTimeout(() => {
        if (stateRef.current.vehicles.find((v: EmergencyVehicle) => v.id === 'AMB-001')?.status === 'EMERGENCY') {
          handleReroute();
        }
      }, 5000);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Command Header */}
      <Header state={simState} onRunDemo={handleRunEmergencyDemo} onReset={handleReset} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Nav Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadEventsCount={simState.events.length} />

        {/* Dynamic Tab Workspace */}
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left/Center Column: Map & Active Corridor Visualizer */}
              <div className="lg:col-span-8 space-y-4 flex flex-col">
                <CorridorStatusVisualizer vehicle={activeVehicle} intersections={simState.intersections} />

                <div className="flex-1 min-h-[520px]">
                  <CityMap
                    state={simState}
                    userLocation={userLocation}
                    selectedDestination={selectedDestination}
                    onRequestUserLocation={handleRequestUserLocation}
                    onSelectIntersection={() => setActiveTab('signals')}
                  />
                </div>
              </div>

              {/* Right Column: Route Controls, AI Panel, Active Nav & Detection */}
              <div className="lg:col-span-4 space-y-4">
                {activeVehicle.status === 'EMERGENCY' ? (
                  <ActiveNavigationCard
                    vehicle={activeVehicle}
                    nextIntersection={targetInt}
                    distanceToNextMeters={distToNext}
                    onReroute={handleReroute}
                    isRerouting={activeVehicle.isRerouting}
                    rerouteReason={activeVehicle.rerouteReason}
                  />
                ) : (
                  <RouteSearchPanel
                    userLocation={userLocation}
                    selectedDestination={selectedDestination}
                    onSelectDestination={setSelectedDestination}
                    onRequestUserLocation={handleRequestUserLocation}
                    onStartRoute={handleStartRoute}
                    onReroute={handleReroute}
                    onReset={handleReset}
                    isEmergencyActive={simState.isEmergencyActive}
                    isLocating={isLocating}
                    locationError={locationError}
                    isLiveGpsActive={isLiveGpsActive}
                    onToggleLiveGps={() => setIsLiveGpsActive(!isLiveGpsActive)}
                  />
                )}

                <EmergencyControlCard
                  state={simState}
                  onStartEmergency={handleStartRoute}
                  onPauseToggle={handlePauseToggle}
                  onReset={handleReset}
                  onReroute={handleReroute}
                  onNormalMode={handleNormalMode}
                  onOpenForceSignalModal={() => setActiveTab('signals')}
                />

                <AIDecisionPanel decision={simState.aiDecision} loading={aiLoading} />

                <DetectionCard vehicle={activeVehicle} targetIntersection={targetInt} distanceMeters={distToNext} />

                <RouteComparisonCard stats={simState.stats} vehicle={activeVehicle} />
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <VehicleSelector
              vehicles={simState.vehicles}
              activeVehicleId={simState.activeVehicleId}
              onSelectVehicle={id => setSimState(prev => ({ ...prev, activeVehicleId: id }))}
            />
          )}

          {activeTab === 'signals' && (
            <SignalStatusGrid intersections={simState.intersections} onForceSignal={handleForceSignal} />
          )}

          {activeTab === 'routes' && (
            <div className="space-y-4">
              <BeforeAfterComparison stats={simState.stats} intersections={simState.intersections} />
              <RouteComparisonCard stats={simState.stats} vehicle={activeVehicle} />
            </div>
          )}

          {activeTab === 'events' && (
            <EventLogPanel events={simState.events} onClearLogs={() => setSimState(prev => ({ ...prev, events: [] }))} />
          )}

          {activeTab === 'architecture' && <ArchitectureView />}
        </main>
      </div>

      {/* Hospital Arrival Report Card Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl shadow-emerald-950/70 font-mono">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🏥
            </div>

            <div>
              <h3 className="text-xl font-bold text-white uppercase">EMERGENCY CORRIDOR SUCCESS!</h3>
              <p className="text-xs text-emerald-400 mt-1">
                {activeVehicle.id} arrived safely at {selectedDestination.name}.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Travel Time:</span>
                <span className="font-bold text-white">4 min 18 sec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Standard Route Time:</span>
                <span className="font-bold text-red-400">9 min 40 sec</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                <span className="text-emerald-400">Total Time Saved:</span>
                <span className="text-emerald-300">5 min 22 sec (+56% Faster)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Intersections Cleared:</span>
                <span className="font-bold text-cyan-400">{activeVehicle.routeIntersectionIds.length} Nodes (0 Stops)</span>
              </div>
              <div className="flex justify-between text-[11px] text-purple-300">
                <span>Dynamic Rerouting:</span>
                <span className="font-bold">1 Traffic Bypass Executed</span>
              </div>
            </div>

            <button
              onClick={() => setShowCompletionModal(false)}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
            >
              CLOSE REPORT CARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
