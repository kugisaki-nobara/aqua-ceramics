'use client';

import React from 'react';
import { EmergencyVehicle, Intersection } from '@/types';
import { getCorridorNodes } from '@/lib/simulation/trafficEngine';
import { CheckCircle2, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CorridorStatusVisualizerProps {
  vehicle: EmergencyVehicle;
  intersections: Intersection[];
}

export const CorridorStatusVisualizer: React.FC<CorridorStatusVisualizerProps> = ({ vehicle, intersections }) => {
  const nodes = getCorridorNodes(vehicle, intersections);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-950/90 border-emerald-500 text-emerald-400',
          dot: 'bg-emerald-400 animate-ping',
          label: 'GREEN PREEMPTION',
        };
      case 'BLUE':
        return {
          bg: 'bg-cyan-950/90 border-cyan-400 text-cyan-300',
          dot: 'bg-cyan-400 animate-pulse',
          label: 'AMBULANCE CROSSING',
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-950/90 border-amber-500 text-amber-400',
          dot: 'bg-amber-400 animate-pulse',
          label: 'PREPARING PREEMPTION',
        };
      case 'PASSED':
        return {
          bg: 'bg-slate-900 border-slate-700 text-slate-400',
          dot: 'bg-slate-500',
          label: 'CLEARED & RESTORED',
        };
      default:
        return {
          bg: 'bg-slate-950 border-slate-800 text-slate-500',
          dot: 'bg-slate-600',
          label: 'UPCOMING',
        };
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Active Green Corridor Status
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase">
          {vehicle.routeIntersectionIds.length} Nodes In Pipeline
        </span>
      </div>

      {/* Horizontal Flow Pipeline */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {/* Ambulance Unit Card */}
        <div className="flex items-center shrink-0">
          <div className="bg-gradient-to-br from-red-950 to-slate-900 border border-red-700 rounded-xl px-3 py-2 text-center min-w-[100px] shadow-lg shadow-red-950/40">
            <div className="text-lg">🚑</div>
            <div className="text-[10px] font-bold text-red-400 font-mono mt-0.5">{vehicle.id}</div>
            <div className="text-[9px] text-slate-400 font-mono">{vehicle.speedKmh} km/h</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 mx-1" />
        </div>

        {/* Intersection Nodes */}
        {nodes.map((node, i) => {
          const style = getStatusBadge(node.status);
          return (
            <React.Fragment key={node.intersectionId}>
              <div
                className={`shrink-0 border rounded-xl p-2.5 min-w-[130px] transition-all duration-300 ${style.bg} ${
                  node.status === 'GREEN' ? 'shadow-lg shadow-emerald-950/60 scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold font-mono text-white">{node.intersectionId}</span>
                  <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                </div>

                <div className="text-[10px] font-medium text-slate-300 truncate" title={node.intersectionName}>
                  {node.intersectionName}
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-white/10 pt-1">
                  <span>{style.label}</span>
                  {node.distanceMeters > 0 && <span>{node.distanceMeters}m</span>}
                </div>
              </div>

              {i < nodes.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />}
            </React.Fragment>
          );
        })}

        {/* Hospital ER Node */}
        <div className="flex items-center shrink-0">
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 mx-1" />
          <div className="bg-gradient-to-br from-rose-950 to-slate-900 border border-rose-700 rounded-xl px-3 py-2 text-center min-w-[110px] shadow-lg shadow-rose-950/40">
            <div className="text-lg">🏥</div>
            <div className="text-[10px] font-bold text-rose-300 font-mono mt-0.5">CITY HOSPITAL</div>
            <div className="text-[9px] text-slate-400 font-mono">DESTINATION</div>
          </div>
        </div>
      </div>
    </div>
  );
};
