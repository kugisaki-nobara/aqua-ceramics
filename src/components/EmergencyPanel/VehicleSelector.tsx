'use client';

import React from 'react';
import { EmergencyVehicle } from '@/types';
import { Ambulance, Flame, CheckCircle, Clock, MapPin, Radio } from 'lucide-react';

interface VehicleSelectorProps {
  vehicles: EmergencyVehicle[];
  activeVehicleId: string;
  onSelectVehicle: (id: string) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  activeVehicleId,
  onSelectVehicle,
}) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl select-none space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Ambulance className="w-5 h-5 text-red-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            Emergency Vehicle Fleet
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {vehicles.length} Units Registered
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {vehicles.map(vehicle => {
          const isActive = vehicle.id === activeVehicleId;
          const isEmergency = vehicle.status === 'EMERGENCY';

          return (
            <div
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-cyan-500 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md ${
                      vehicle.type === 'AMBULANCE' ? 'bg-red-950 border border-red-700' : 'bg-amber-950 border border-amber-700'
                    }`}
                  >
                    {vehicle.type === 'AMBULANCE' ? '🚑' : '🚒'}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{vehicle.id}</div>
                    <div className="text-[10px] text-slate-400">{vehicle.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      isEmergency
                        ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {vehicle.status}
                  </span>
                  <div className="text-[9px] font-bold text-red-400 mt-1">{vehicle.priority} PRIORITY</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Emergency Type:</span>
                  <span className="font-bold text-slate-200">{vehicle.emergencyType}</span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Destination:</span>
                  <span className="text-cyan-400 font-bold truncate max-w-[160px]">{vehicle.destination.name}</span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Current Speed:</span>
                  <span className="text-emerald-400 font-bold">{vehicle.speedKmh} km/h</span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Corridor Route:</span>
                  <span className="text-purple-300 font-bold">{vehicle.routeIntersectionIds.length} Intersections</span>
                </div>
              </div>

              {isActive && (
                <div className="mt-3 pt-2 border-t border-cyan-900/60 text-[10px] text-cyan-400 font-bold flex items-center justify-center gap-1 uppercase">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  Currently Selected for Control Room Telemetry
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
