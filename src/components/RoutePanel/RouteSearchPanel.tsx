'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Crosshair,
  Building2,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio,
  GitBranch,
} from 'lucide-react';
import { Destination, UserLocation } from '@/types';
import { BENGALURU_HOSPITALS } from '@/lib/simulation/cityData';

interface RouteSearchPanelProps {
  userLocation: UserLocation;
  selectedDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
  onRequestUserLocation: () => void;
  onStartRoute: () => void;
  onReroute: () => void;
  onReset: () => void;
  isEmergencyActive: boolean;
  isLocating: boolean;
  locationError?: string | null;
  isLiveGpsActive: boolean;
  onToggleLiveGps: () => void;
}

export const RouteSearchPanel: React.FC<RouteSearchPanelProps> = ({
  userLocation,
  selectedDestination,
  onSelectDestination,
  onRequestUserLocation,
  onStartRoute,
  onReroute,
  onReset,
  isEmergencyActive,
  isLocating,
  locationError,
  isLiveGpsActive,
  onToggleLiveGps,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = BENGALURU_HOSPITALS.filter(
    h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl select-none space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Route Planning & Navigation
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
          OSRM BENGALURU ENGINE
        </span>
      </div>

      {/* Origin / User Location Box */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>ORIGIN LOCATION</span>
          </div>
          <button
            onClick={onRequestUserLocation}
            disabled={isLocating}
            className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 hover:text-white text-[10px] font-mono font-bold transition flex items-center gap-1.5 active:scale-95"
          >
            <Crosshair className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? 'Locating...' : '📍 Use My Location'}
          </button>
        </div>

        <div className="text-xs font-mono text-white bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="truncate">{userLocation.addressName}</span>
          {userLocation.isDefault ? (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 shrink-0">
              Default Bengaluru
            </span>
          ) : (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              GPS Locked
            </span>
          )}
        </div>

        {locationError && (
          <div className="text-[10px] text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-900 flex items-center gap-1.5 font-sans">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {/* Destination Selection Box */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-rose-400" />
            <span>DESTINATION HOSPITAL</span>
          </div>
          <span className="text-[10px] text-rose-400 font-bold">{selectedDestination.name}</span>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search Bengaluru Hospitals..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-xs font-mono text-white pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Suggested Bengaluru Hospitals List */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
          {filteredHospitals.map(hospital => {
            const isSelected = selectedDestination.id === hospital.id;
            return (
              <button
                key={hospital.id}
                onClick={() => onSelectDestination(hospital)}
                className={`w-full text-left p-2 rounded-lg border transition font-mono text-xs flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-950/60 border-rose-600 text-rose-300 shadow-md shadow-rose-950'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold">{hospital.name}</div>
                  <div className="text-[9px] text-slate-400 truncate max-w-[200px]">{hospital.address}</div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live GPS Mode Toggle */}
      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Radio className={`w-4 h-4 ${isLiveGpsActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-slate-300">Live GPS Tracking Mode</span>
        </div>
        <button
          onClick={onToggleLiveGps}
          className={`px-3 py-1 rounded-lg font-bold text-[10px] transition ${
            isLiveGpsActive
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {isLiveGpsActive ? 'ACTIVE' : 'OFF'}
        </button>
      </div>

      {/* Main Start Route & Reroute Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onStartRoute}
          disabled={isEmergencyActive}
          className={`py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg ${
            isEmergencyActive
              ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          START ROUTE
        </button>

        <button
          onClick={onReroute}
          className="py-3 px-4 rounded-xl bg-slate-900 border border-purple-800 hover:border-purple-600 text-purple-300 font-mono text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95"
        >
          <GitBranch className="w-4 h-4" />
          REROUTE
        </button>
      </div>
    </div>
  );
};
