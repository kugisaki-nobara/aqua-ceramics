'use client';

import React from 'react';
import { SimulationStats, Intersection } from '@/types';
import { ShieldCheck, StopCircle, Clock, Zap, AlertTriangle } from 'lucide-react';

interface BeforeAfterComparisonProps {
  stats: SimulationStats;
  intersections: Intersection[];
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({ stats, intersections }) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl select-none space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            Before vs After AI Corridor Benchmark
          </h2>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
          REAL-TIME SIMULATION TELEMETRY
        </span>
      </div>

      {/* Visual Pipeline Comparison */}
      <div className="space-y-4 font-mono text-xs">
        {/* WITHOUT AI CORRIDOR */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-red-900/40 space-y-2">
          <div className="flex items-center justify-between text-red-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              WITHOUT AI CORRIDOR (UNGOVERNED SIGNALS)
            </span>
            <span>4 STOPS / RED DELAYS</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {intersections.slice(0, 5).map((int, i) => (
              <React.Fragment key={int.id}>
                <div className="shrink-0 p-2.5 rounded-lg bg-slate-950 border border-red-800 text-center min-w-[100px]">
                  <div className="text-[10px] text-slate-400 font-bold">{int.id}</div>
                  <div className="text-xs font-bold text-red-400 mt-1 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    RED DELAY
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">+45s Stop</div>
                </div>
                {i < 4 && <span className="text-slate-600 font-bold">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* WITH AI CORRIDOR */}
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/60 space-y-2 shadow-lg shadow-emerald-950/30">
          <div className="flex items-center justify-between text-emerald-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              WITH AI CORRIDOR (PREEMPTIVE GREEN STREAM)
            </span>
            <span className="text-emerald-300">0 STOPS / CONTINUOUS GREEN</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {intersections.slice(0, 5).map((int, i) => (
              <React.Fragment key={int.id}>
                <div className="shrink-0 p-2.5 rounded-lg bg-slate-950 border border-emerald-500 text-center min-w-[100px] shadow-md shadow-emerald-950">
                  <div className="text-[10px] text-slate-300 font-bold">{int.id}</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    GREEN STREAM
                  </div>
                  <div className="text-[9px] text-emerald-300 mt-0.5">0s Delay</div>
                </div>
                {i < 4 && <span className="text-emerald-500 font-bold">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate Telemetry Comparison Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-center">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Normal Response Time</div>
          <div className="text-base font-bold text-slate-200 mt-1">
            {Math.floor(stats.normalEtaSeconds / 60)}m {stats.normalEtaSeconds % 60}s
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800">
          <div className="text-[10px] text-emerald-400 uppercase font-bold">AI Corridor Response Time</div>
          <div className="text-base font-bold text-emerald-300 mt-1">
            {Math.floor(stats.aiEtaSeconds / 60)}m {stats.aiEtaSeconds % 60}s
          </div>
        </div>

        <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800">
          <div className="text-[10px] text-purple-400 uppercase font-bold">Total Time Saved</div>
          <div className="text-base font-bold text-purple-300 mt-1">
            {Math.floor(stats.timeSavedSeconds / 60)}m {stats.timeSavedSeconds % 60}s
          </div>
        </div>

        <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-800">
          <div className="text-[10px] text-cyan-400 uppercase font-bold">Preempted Signals</div>
          <div className="text-base font-bold text-cyan-300 mt-1">
            {stats.preemptedSignalsCount} / {intersections.length} Nodes
          </div>
        </div>
      </div>
    </div>
  );
};
