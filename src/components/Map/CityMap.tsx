'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SimulationState } from '@/lib/simulation/trafficEngine';
import { UserLocation, Destination } from '@/types';
import { Crosshair } from 'lucide-react';

interface CityMapProps {
  state: SimulationState;
  userLocation: UserLocation;
  selectedDestination: Destination;
  onRequestUserLocation: () => void;
  onSelectIntersection?: (id: string) => void;
}

// Dynamically import Leaflet components for Next.js App Router client rendering
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });

export const CityMap: React.FC<CityMapProps> = ({
  state,
  userLocation,
  selectedDestination,
  onRequestUserLocation,
  onSelectIntersection,
}) => {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then(leaflet => {
      setL(leaflet.default || leaflet);
    });
  }, []);

  if (!mounted || !L) {
    return (
      <div className="w-full h-full min-h-[480px] bg-slate-950 flex flex-col items-center justify-center border border-slate-900 rounded-2xl p-6 text-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <div className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider">
          Loading Bengaluru GIS Control Room Map...
        </div>
        <p className="text-xs text-slate-500 mt-1">Initializing OpenStreetMap Leaflet layers</p>
      </div>
    );
  }

  const activeVehicle = state.vehicles.find(v => v.id === state.activeVehicleId);
  const isEmergency = activeVehicle?.status === 'EMERGENCY';

  // Build route path coordinates from OSRM road geometry or intersection waypoints
  const corridorCoords: [number, number][] = activeVehicle?.routeGeometry && activeVehicle.routeGeometry.length > 0
    ? activeVehicle.routeGeometry
    : [
        [activeVehicle?.lat || userLocation.lat, activeVehicle?.lng || userLocation.lng],
        [selectedDestination.lat, selectedDestination.lng],
      ];

  // Custom HTML Icons
  const createUserLocationIcon = () =>
    L.divIcon({
      className: 'custom-user-loc-icon',
      html: `
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></div>
          <div className="absolute w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          </div>
          <div className="absolute -bottom-4 bg-slate-950/90 text-[9px] font-mono font-bold text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800 whitespace-nowrap shadow-md">
            📍 YOU ARE HERE
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

  const createAmbulanceIcon = (speed: number) =>
    L.divIcon({
      className: 'custom-amb-icon',
      html: `
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full ${isEmergency ? 'animate-siren bg-red-600/30' : 'bg-slate-800/60'} flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-slate-950 border-2 ${isEmergency ? 'border-red-500' : 'border-slate-700'} flex items-center justify-center shadow-lg text-lg">
              🚑
            </div>
          </div>
          <div className="absolute -bottom-4 bg-slate-950/90 text-[10px] font-mono font-bold text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800 whitespace-nowrap shadow-md">
            AMB-001 • ${speed} km/h
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

  const createHospitalIcon = () =>
    L.divIcon({
      className: 'custom-hosp-icon',
      html: `
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 border-2 border-white flex items-center justify-center text-xl shadow-xl">
              🏥
            </div>
          </div>
          <div className="absolute -bottom-5 bg-slate-950/90 text-[10px] font-bold text-rose-300 px-2 py-0.5 rounded border border-rose-800 whitespace-nowrap">
            ${selectedDestination.name}
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

  const createIntersectionIcon = (int: any) => {
    const isPreempted = int.mode === 'PREEMPTION';
    return L.divIcon({
      className: 'custom-int-icon',
      html: `
        <div className="relative group cursor-pointer">
          <div className="w-9 h-9 rounded-xl ${
            isPreempted
              ? 'bg-emerald-500/30 border-2 border-emerald-400 animate-pulse shadow-lg shadow-emerald-500/40'
              : 'bg-slate-900 border-2 border-slate-700'
          } flex flex-col items-center justify-center p-1">
            <div className="flex gap-1 items-center">
              <span className="w-2 h-2 rounded-full ${int.directions.NORTH === 'GREEN' ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}"></span>
              <span className="w-2 h-2 rounded-full ${int.directions.EAST === 'GREEN' ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}"></span>
            </div>
            <div className="text-[9px] font-mono font-bold text-slate-300 mt-0.5">
              ${int.id.replace('INT-BLR-', 'INT-')}
            </div>
          </div>
          ${
            isPreempted
              ? `<div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase whitespace-nowrap shadow-md">
                  PREEMPTED
                </div>`
              : ''
          }
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  const createCarIcon = (stopped: boolean) =>
    L.divIcon({
      className: 'custom-car-icon',
      html: `
        <div className="w-6 h-6 rounded-full ${stopped ? 'bg-red-950 border border-red-500' : 'bg-slate-800 border border-cyan-600'} flex items-center justify-center text-xs opacity-80">
          🚗
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Green Corridor OSRM Road Polyline */}
        {corridorCoords.length >= 2 && (
          <>
            <Polyline
              positions={corridorCoords}
              pathOptions={{
                color: '#10b981',
                weight: 10,
                opacity: 0.4,
                lineCap: 'round',
              }}
            />
            <Polyline
              positions={corridorCoords}
              pathOptions={{
                color: '#34d399',
                weight: 5,
                opacity: 0.95,
                dashArray: '10, 6',
                lineCap: 'round',
              }}
            />
          </>
        )}

        {/* 500m Ambulance Preemption Detection Radius */}
        {activeVehicle && isEmergency && (
          <Circle
            center={[activeVehicle.lat, activeVehicle.lng]}
            radius={activeVehicle.detectionRadiusMeters}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#0891b2',
              fillOpacity: 0.08,
              weight: 1.5,
              dashArray: '6, 6',
            }}
          />
        )}

        {/* User Location Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
          <Tooltip direction="top" opacity={0.95}>
            <div className="bg-slate-950 text-cyan-300 p-2 rounded border border-cyan-800 text-xs font-mono">
              <div className="font-bold">📍 Your Location</div>
              <div className="text-[10px] text-slate-300">{userLocation.addressName}</div>
            </div>
          </Tooltip>
        </Marker>

        {/* Intersections */}
        {state.intersections.map(int => (
          <Marker
            key={int.id}
            position={[int.lat, int.lng]}
            icon={createIntersectionIcon(int)}
            eventHandlers={{
              click: () => onSelectIntersection && onSelectIntersection(int.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
              <div className="bg-slate-950 text-white p-2 rounded-lg border border-slate-800 text-xs font-mono">
                <div className="font-bold text-cyan-400">{int.id}: {int.name}</div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Mode: <span className={int.mode === 'PREEMPTION' ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{int.mode}</span>
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {/* Destination Hospital */}
        <Marker position={[selectedDestination.lat, selectedDestination.lng]} icon={createHospitalIcon()}>
          <Tooltip direction="top" opacity={0.95}>
            <div className="bg-slate-950 text-rose-300 p-2 rounded border border-rose-800 text-xs font-mono">
              <div className="font-bold">🏥 {selectedDestination.name}</div>
              <div className="text-[10px] text-slate-300">{selectedDestination.address}</div>
            </div>
          </Tooltip>
        </Marker>

        {/* Ambulance */}
        {activeVehicle && (
          <Marker position={[activeVehicle.lat, activeVehicle.lng]} icon={createAmbulanceIcon(activeVehicle.speedKmh)}>
            <Tooltip direction="top" opacity={0.95}>
              <div className="bg-slate-950 text-white p-2 rounded border border-red-800 text-xs font-mono">
                <div className="font-bold text-red-400">{activeVehicle.id} - {activeVehicle.name}</div>
                <div className="text-[11px] text-slate-300">Destination: {selectedDestination.name}</div>
                <div className="text-[11px] text-cyan-400 mt-0.5">Speed: {activeVehicle.speedKmh} km/h</div>
              </div>
            </Tooltip>
          </Marker>
        )}

        {/* Background Traffic */}
        {state.backgroundTraffic.map(car => (
          <Marker key={car.id} position={[car.lat, car.lng]} icon={createCarIcon(car.stopped)} />
        ))}
      </MapContainer>

      {/* Map Control: Locate Me Button */}
      <button
        onClick={onRequestUserLocation}
        className="absolute top-3 right-3 bg-slate-950/90 hover:bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white p-2.5 rounded-xl shadow-xl z-[1000] flex items-center gap-2 text-xs font-mono transition active:scale-95 select-none"
        title="Locate Me (Center Map on My GPS Position)"
      >
        <Crosshair className="w-4 h-4 text-cyan-400" />
        <span className="font-bold">LOCATE ME</span>
      </button>

      {/* Interactive Map Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-[1000] select-none">
        <div className="flex flex-wrap items-center gap-4 text-slate-300 font-mono text-[11px]">
          <span className="flex items-center gap-1.5"><span className="text-base">📍</span> User Origin</span>
          <span className="flex items-center gap-1.5"><span className="text-base">🚑</span> Ambulance</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400 animate-pulse"></span> Active Signal Preemption</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-1 bg-emerald-400 rounded"></span> OSRM Green Corridor</span>
          <span className="flex items-center gap-1.5"><span className="text-base">🏥</span> Hospital ER</span>
        </div>

        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          BENGALURU GIS ROAD NETWORK
        </div>
      </div>
    </div>
  );
};
