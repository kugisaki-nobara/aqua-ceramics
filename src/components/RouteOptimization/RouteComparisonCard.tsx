'use client';

import React, { useState } from 'react';
import { Navigation, Clock, Zap, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { SimulationStats, EmergencyVehicle } from '@/types';

interface RouteComparisonCardProps {
  stats: SimulationStats;
  vehicle: EmergencyVehicle;
  onCompareRoutesClick?: () => void;
}

export const RouteComparisonCard: React.FC<RouteComparisonCardProps> = ({ stats, vehicle }) => {
  const [showModal, setShowModal] = useState(false);

  const formatSecs = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins} min ${secs < 10 ? '0' : ''}${secs} sec`;
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Route Optimization Engine
          </h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300 hover:text-white text-[10px] font-bold font-mono uppercase transition"
        >
          COMPARE ROUTES
        </button>
      </div>

      {/* Main Calculated Metrics */}
      <div className="grid grid-cols-3 gap-2 font-mono text-center">
        {/* Normal ETA */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[9px] text-slate-400 uppercase">Standard Route ETA</div>
          <div className="text-sm font-bold text-slate-300 mt-1">{formatSecs(stats.normalEtaSeconds)}</div>
          <div className="text-[8px] text-red-400 mt-0.5">Subject to signal delays</div>
        </div>

        {/* AI Corridor ETA */}
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 shadow-lg shadow-emerald-950/40">
          <div className="text-[9px] text-emerald-400 uppercase font-bold">AI Corridor ETA</div>
          <div className="text-sm font-bold text-emerald-300 mt-1">{formatSecs(stats.aiEtaSeconds)}</div>
          <div className="text-[8px] text-emerald-400 mt-0.5">Continuous green stream</div>
        </div>

        {/* Time Saved */}
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 shadow-lg shadow-purple-950/40">
          <div className="text-[9px] text-purple-400 uppercase font-bold">Time Saved</div>
          <div className="text-sm font-bold text-purple-300 mt-1">{formatSecs(stats.timeSavedSeconds)}</div>
          <div className="text-[8px] text-purple-400 mt-0.5">+38% Faster Arrival</div>
        </div>
      </div>

      {/* Compare Routes Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase font-mono">
                  Route Performance Comparison
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Without AI Corridor */}
              <div className="p-4 rounded-xl bg-slate-950 border border-red-900/50 space-y-3 font-mono text-xs">
                <div className="font-bold text-red-400 uppercase tracking-wider text-sm">
                  Without AI Corridor
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>Average Speed:</span>
                    <span className="font-bold text-red-400">28 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Signal Delays:</span>
                    <span className="font-bold text-red-400">4 Stops (~4.5 min)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Traffic Congestion:</span>
                    <span className="font-bold text-amber-400">HIGH</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span>Total ETA:</span>
                    <span className="font-bold text-slate-200">{formatSecs(stats.normalEtaSeconds)}</span>
                  </div>
                </div>
              </div>

              {/* With AI Corridor */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 space-y-3 font-mono text-xs shadow-xl shadow-emerald-950/40">
                <div className="font-bold text-emerald-400 uppercase tracking-wider text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  With AI Corridor
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>Average Speed:</span>
                    <span className="font-bold text-emerald-400">78 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Signal Delays:</span>
                    <span className="font-bold text-emerald-400">0 Stops (0 min)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Traffic Congestion:</span>
                    <span className="font-bold text-emerald-400">PREEMPTED</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span>Total ETA:</span>
                    <span className="font-bold text-emerald-300">{formatSecs(stats.aiEtaSeconds)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800 text-center font-mono text-xs text-purple-300">
              ⚡ AI Green Corridor reduces critical emergency travel time by{' '}
              <strong className="text-white underline">{formatSecs(stats.timeSavedSeconds)}</strong>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
