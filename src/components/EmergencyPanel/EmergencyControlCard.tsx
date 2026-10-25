'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  GitBranch,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SimulationState } from '@/lib/simulation/trafficEngine';

interface EmergencyControlCardProps {
  state: SimulationState;
  onStartEmergency: () => void;
  onPauseToggle: () => void;
  onReset: () => void;
  onReroute: () => void;
  onNormalMode: () => void;
  onOpenForceSignalModal: () => void;
}

export const EmergencyControlCard: React.FC<EmergencyControlCardProps> = ({
  state,
  onStartEmergency,
  onPauseToggle,
  onReset,
  onReroute,
  onNormalMode,
  onOpenForceSignalModal,
}) => {
  const activeVehicle = state.vehicles.find(v => v.id === state.activeVehicleId);
  const isEmergency = activeVehicle?.status === 'EMERGENCY';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Emergency Controls
          </h2>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest ${
            isEmergency
              ? 'bg-red-950/80 border border-red-700 text-red-400 animate-pulse'
              : 'bg-slate-900 border border-slate-800 text-slate-400'
          }`}
        >
          {isEmergency ? 'EMERGENCY ACTIVE' : 'STANDBY MODE'}
        </span>
      </div>

      {/* Ambulance Info Snapshot */}
      {activeVehicle && (
        <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Vehicle ID</span>
            <span className="font-bold text-white text-sm">{activeVehicle.id}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Priority</span>
            <span className="font-bold text-red-400 text-sm">{activeVehicle.priority}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Emergency</span>
            <span className="text-slate-300 truncate block">{activeVehicle.emergencyType}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Destination</span>
            <span className="text-cyan-400 truncate block">{activeVehicle.destination.name}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Speed</span>
            <span className="text-emerald-400 font-bold">{activeVehicle.speedKmh} km/h</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Detection Radius</span>
            <span className="text-purple-400 font-bold">{activeVehicle.detectionRadiusMeters} meters</span>
          </div>
        </div>
      )}

      {/* Main Control Action Grid */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onStartEmergency}
          disabled={isEmergency}
          className={`col-span-2 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg ${
            isEmergency
              ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-600/30 active:scale-95'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          START EMERGENCY
        </button>

        <button
          onClick={onPauseToggle}
          className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Pause className="w-3.5 h-3.5" />
          {state.isPaused ? 'RESUME' : 'PAUSE'}
        </button>

        <button
          onClick={onReset}
          className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          RESET
        </button>

        <button
          onClick={onOpenForceSignalModal}
          className="py-2.5 px-3 rounded-xl bg-slate-900 border border-cyan-900 hover:border-cyan-700 text-cyan-400 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
          title="Force manual signal preemption on selected intersection"
        >
          <Sliders className="w-3.5 h-3.5" />
          FORCE SIGNAL
        </button>

        <button
          onClick={onReroute}
          className="py-2.5 px-3 rounded-xl bg-slate-900 border border-purple-900 hover:border-purple-700 text-purple-400 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
          title="Recalculate dynamic route to bypass congestion"
        >
          <GitBranch className="w-3.5 h-3.5" />
          REROUTE
        </button>
      </div>

      <button
        onClick={onNormalMode}
        className="mt-2 w-full py-2 px-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-300 font-mono text-[11px] transition flex items-center justify-center gap-1.5"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        RETURN ALL SIGNALS TO NORMAL MODE
      </button>
    </div>
  );
};
