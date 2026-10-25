'use client';

import React from 'react';
import { Activity, ShieldAlert, Radio, Clock, Zap, Play, RotateCcw } from 'lucide-react';
import { SimulationState } from '@/lib/simulation/trafficEngine';

interface HeaderProps {
  state: SimulationState;
  onRunDemo: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onRunDemo, onReset }) => {
  const activeVehicle = state.vehicles.find(v => v.id === state.activeVehicleId);
  const isEmergency = activeVehicle?.status === 'EMERGENCY';
  const overriddenCount = state.intersections.filter(i => i.mode === 'PREEMPTION').length;

  return (
    <header className="bg-slate-950 border-b border-cyan-950/80 px-4 py-3 flex flex-wrap items-center justify-between gap-4 select-none shadow-lg shadow-cyan-950/20">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30">
            <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-wider text-white font-mono uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-400">
              AI Emergency Corridor
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-cyan-950 border border-cyan-800 text-cyan-400">
              SIMULATION v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Autonomous Signal Preemption & Route Optimizer
          </p>
        </div>
      </div>

      {/* Control Room Live Telemetry Counters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* System Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">System Status</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
              ONLINE <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
          </div>
        </div>

        {/* Active Vehicles */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2.5">
          <Radio className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Active Units</div>
            <div className="text-xs font-bold text-white font-mono">
              {isEmergency ? '1 ACTIVE (AMB-001)' : '0 ACTIVE (STANDBY)'}
            </div>
          </div>
        </div>

        {/* Overridden Signals */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Signals Overridden</div>
            <div className="text-xs font-bold text-cyan-400 font-mono">
              {overriddenCount} / {state.intersections.length} INTERSECTIONS
            </div>
          </div>
        </div>

        {/* Response Time Improvement */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-purple-400" />
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Time Saved</div>
            <div className="text-xs font-bold text-purple-300 font-mono">
              {state.stats.timeSavedSeconds > 0 ? `+${Math.round(state.stats.timeSavedSeconds / 60)} min ${state.stats.timeSavedSeconds % 60}s` : '0 min (Standby)'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRunDemo}
          className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-[1px] font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition"
        >
          <div className="px-4 py-2 rounded-[11px] bg-slate-950 group-hover:bg-opacity-80 transition flex items-center gap-2 text-emerald-400 group-hover:text-white">
            <Play className="w-4 h-4 fill-current text-emerald-400 group-hover:text-white" />
            <span className="font-mono text-xs tracking-wider uppercase font-bold">RUN EMERGENCY DEMO</span>
          </div>
        </button>

        <button
          onClick={onReset}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition active:scale-95"
          title="Reset Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
