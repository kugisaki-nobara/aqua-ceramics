'use client';

import React, { useState } from 'react';
import { Camera, Eye, Cpu, ChevronDown, ChevronUp, ShieldCheck, Radio } from 'lucide-react';
import { EmergencyVehicle, Intersection } from '@/types';
import { getTravelDirection } from '@/lib/simulation/cityData';

interface DetectionCardProps {
  vehicle: EmergencyVehicle;
  targetIntersection: Intersection | null;
  distanceMeters: number;
}

export const DetectionCard: React.FC<DetectionCardProps> = ({
  vehicle,
  targetIntersection,
  distanceMeters,
}) => {
  const [showArchDetails, setShowArchDetails] = useState(false);

  const direction = targetIntersection
    ? `${getTravelDirection(vehicle.lat, vehicle.lng, targetIntersection.lat, targetIntersection.lng)}BOUND`
    : 'APPROACHING';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800">
            <Camera className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Vehicle Detection System
            </h2>
            <p className="text-[10px] text-slate-400">Computer Vision Telemetry</p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-cyan-950/80 border border-cyan-800 text-cyan-300">
          SIMULATED CV ACTIVE
        </span>
      </div>

      {/* Live Detection Data Grid */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px] uppercase">Status</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            AMBULANCE DETECTED
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px] uppercase">Detected Unit</span>
          <span className="text-white font-bold">{vehicle.id} ({vehicle.name})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px] uppercase">Approaching Node</span>
          <span className="text-cyan-400 font-bold">{targetIntersection ? targetIntersection.id : 'INT-01'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px] uppercase">Distance to Node</span>
          <span className="text-amber-400 font-bold">{distanceMeters} meters</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px] uppercase">Vector / Bearing</span>
          <span className="text-purple-300 font-bold">{direction}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px] uppercase">Detection Method</span>
          <span className="text-slate-300">Simulated Computer Vision</span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-1.5">
          <span className="text-slate-400 text-[11px] uppercase">Model Confidence</span>
          <span className="text-emerald-400 font-bold">97.4%</span>
        </div>
      </div>

      {/* Real-World Future Architecture Accordion */}
      <button
        onClick={() => setShowArchDetails(!showArchDetails)}
        className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center justify-between transition"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Real-World Detection Stack Architecture</span>
        </div>
        {showArchDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showArchDetails && (
        <div className="mt-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 font-sans text-slate-300 animate-fadeIn">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            In a production city deployment, detection fuses multi-sensor hardware inputs for 99.99% reliability:
          </p>
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex items-start gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">CCTV & YOLOv8:</strong> Real-time 60fps edge visual detection & optical flashing light classification.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Radio className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">ANPR:</strong> Automatic Number Plate Recognition for authenticating registered emergency fleet IDs.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">C-V2X & AVL GPS:</strong> Direct cellular vehicle-to-everything encrypted radio beacons sent directly to traffic light controllers.</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
