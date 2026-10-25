'use client';

import React from 'react';
import { EmergencyVehicle, Intersection } from '@/types';
import { ShieldCheck, GitBranch, Clock, Navigation, AlertTriangle, Radio } from 'lucide-react';

interface ActiveNavigationCardProps {
  vehicle: EmergencyVehicle;
  nextIntersection: Intersection | null;
  distanceToNextMeters: number;
  onReroute: () => void;
  isRerouting?: boolean;
  rerouteReason?: string;
}

export const ActiveNavigationCard: React.FC<ActiveNavigationCardProps> = ({
  vehicle,
  nextIntersection,
  distanceToNextMeters,
  onReroute,
  isRerouting,
  rerouteReason,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-slate-950 border border-emerald-500/80 rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 select-none space-y-3 font-mono text-xs animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚑</span>
          <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-sm">
            EMERGENCY ROUTE ACTIVE
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-bold animate-pulse">
          LIVE PREEMPTION
        </span>
      </div>

      {/* Rerouting Alert Badge if Rerouting */}
      {isRerouting && (
        <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-600 text-purple-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-[11px] uppercase">🔄 Rerouting... {rerouteReason || 'Faster Route Found'}</span>
          </div>
        </div>
      )}

      {/* Primary Navigation Telemetry */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[9px] text-slate-400 uppercase">ETA</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">{formatTime(vehicle.etaSeconds)}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[9px] text-slate-400 uppercase">Distance</div>
          <div className="text-sm font-bold text-cyan-400 mt-0.5">{vehicle.totalDistanceKm.toFixed(1)} km</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[9px] text-slate-400 uppercase">Traffic</div>
          <div className="text-sm font-bold text-amber-400 mt-0.5">MEDIUM</div>
        </div>
      </div>

      {/* Active Corridor & Next Signal Status */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 uppercase">Corridor Status</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Green Corridor ACTIVE
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 uppercase">Next Signal Node</span>
          <span className="text-white font-bold">{nextIntersection ? nextIntersection.id : 'INT-BLR-01'}</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 uppercase">Distance to Signal</span>
          <span className="text-purple-300 font-bold">{distanceToNextMeters} meters away</span>
        </div>
      </div>

      {/* Reroute Button */}
      <button
        onClick={onReroute}
        className="w-full py-2.5 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-purple-300 hover:text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 active:scale-95"
      >
        <GitBranch className="w-4 h-4" />
        RECALCULATE / REROUTE
      </button>
    </div>
  );
};
