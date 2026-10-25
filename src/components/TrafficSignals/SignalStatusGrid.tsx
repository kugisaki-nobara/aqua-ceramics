'use client';

import React, { useState } from 'react';
import { Intersection, DirectionKey } from '@/types';
import { TrafficCone, Sliders, ShieldCheck, Zap, X } from 'lucide-react';

interface SignalStatusGridProps {
  intersections: Intersection[];
  onForceSignal: (intersectionId: string, direction: DirectionKey | null) => void;
}

export const SignalStatusGrid: React.FC<SignalStatusGridProps> = ({ intersections, onForceSignal }) => {
  const [selectedIntId, setSelectedIntId] = useState<string | null>(null);

  const activeInt = intersections.find(i => i.id === selectedIntId);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl select-none space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <TrafficCone className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            Traffic Signal Control Grid ({intersections.length} Intersections)
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Normal Cycle: 15s NS / EW Switch
        </span>
      </div>

      {/* Grid of Intersections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {intersections.map(int => {
          const isPreempted = int.mode === 'PREEMPTION';
          return (
            <div
              key={int.id}
              className={`p-4 rounded-xl border transition-all ${
                isPreempted
                  ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                <div>
                  <div className="font-bold text-sm text-white">{int.id}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{int.name}</div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      isPreempted
                        ? 'bg-emerald-500 text-slate-950 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPreempted ? 'PREEMPTED' : 'NORMAL'}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1">Density: {int.trafficDensity}</span>
                </div>
              </div>

              {/* 4 Directions Signal Matrix */}
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                {(['NORTH', 'SOUTH', 'EAST', 'WEST'] as DirectionKey[]).map(dir => {
                  const state = int.directions[dir];
                  return (
                    <div
                      key={dir}
                      className="p-1.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-slate-400">{dir[0]}: {dir}</span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full font-bold text-[9px] ${
                          state === 'GREEN'
                            ? 'bg-emerald-400 shadow-md shadow-emerald-400/80 animate-ping'
                            : state === 'YELLOW'
                            ? 'bg-amber-400'
                            : 'bg-red-500'
                        }`}
                        title={`${dir}: ${state}`}
                      />
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setSelectedIntId(int.id)}
                className="w-full py-1.5 px-3 rounded bg-slate-950 hover:bg-slate-800 border border-cyan-900 text-cyan-400 text-[10px] font-bold transition flex items-center justify-center gap-1.5"
              >
                <Sliders className="w-3 h-3" />
                MANUAL FORCE OVERRIDE
              </button>
            </div>
          );
        })}
      </div>

      {/* Manual Signal Override Modal */}
      {activeInt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white uppercase">{activeInt.id} Override</h3>
                <p className="text-xs text-slate-400">{activeInt.name}</p>
              </div>
              <button
                onClick={() => setSelectedIntId(null)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select direction to FORCE GREEN preemption. All conflicting directions will turn RED instantly.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {(['NORTH', 'SOUTH', 'EAST', 'WEST'] as DirectionKey[]).map(dir => (
                <button
                  key={dir}
                  onClick={() => {
                    onForceSignal(activeInt.id, dir);
                    setSelectedIntId(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-950 border border-emerald-800 hover:border-emerald-500 text-emerald-400 hover:text-white font-bold text-xs transition"
                >
                  FORCE {dir} GREEN
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onForceSignal(activeInt.id, null);
                setSelectedIntId(null);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              RELEASE OVERRIDE (RESTORE NORMAL CYCLE)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
