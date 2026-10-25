'use client';

import React from 'react';
import { Cpu, ShieldCheck, Radio, Eye, Layers, Lock, Server, AlertTriangle } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl select-none space-y-6 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase font-mono tracking-wider">
              System Architecture & Hardware Specs
            </h2>
            <p className="text-xs text-slate-400">Production-Grade Smart City Implementation Blueprint</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 border border-purple-800 text-purple-300">
          V2X + GEMINI AI STACK
        </span>
      </div>

      {/* Hardware & Software Pipeline Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Layer 1: Sensor & Ingestion */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
            <Eye className="w-4 h-4" />
            1. SENSOR & PERCEPTION LAYER
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><strong className="text-white">Optical CCTV & Edge AI:</strong> NVIDIA Jetson Orin modules running YOLOv8 at 60 FPS for strobe light detection.</li>
            <li><strong className="text-white">ANPR Cameras:</strong> High-speed optical plate recognition for emergency fleet validation.</li>
            <li><strong className="text-white">AVL / GPS Beacons:</strong> Real-time 10Hz dual-band GNSS telemetry from emergency dispatch.</li>
          </ul>
        </div>

        {/* Layer 2: Telemetry & AI Decision */}
        <div className="p-4 rounded-xl bg-slate-900 border border-indigo-900/60 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono text-sm">
            <Layers className="w-4 h-4" />
            2. AI DECISION & ROUTING LAYER
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><strong className="text-white">Google Gemini 2.5 Flash:</strong> Multi-intersection traffic density evaluation and adaptive preemption timing optimization.</li>
            <li><strong className="text-white">Micro-Routing Engine:</strong> Dynamic Dijkstra/A* pathing around unexpected road closures or accidents.</li>
            <li><strong className="text-white">Deterministic Local Fallback:</strong> Zero-latency fail-safe rules if cloud connection drops.</li>
          </ul>
        </div>

        {/* Layer 3: Actuation & Traffic Controllers */}
        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/60 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-sm">
            <Radio className="w-4 h-4" />
            3. TRAFFIC SIGNAL ACTUATION
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><strong className="text-white">C-V2X (Cellular V2X):</strong> 5.9 GHz PC5 Direct Communication interface with traffic signal controllers.</li>
            <li><strong className="text-white">NEMA TS2 / ATC Controllers:</strong> Standardized NTCIP 1202 protocol preemption command injection.</li>
            <li><strong className="text-white">Hardware Interlocks:</strong> Physical conflict-monitor cards (CMU) preventing opposing green signals.</li>
          </ul>
        </div>
      </div>

      {/* Prototype vs Real-World Section */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/50 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          PROTOTYPE VS REAL-WORLD DEPLOYMENT
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          This interactive application is a software simulation and prototype designed to demonstrate the operational concept and AI preemption workflow. No real-world infrastructure is connected or controlled.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold">Prototype Capabilities</div>
            <p className="text-slate-400 text-[11px]">
              Simulated map grid, simulated background vehicles, real-time signal state machine, Gemini API integration, deterministic safety fallback, event logger.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-purple-400 font-bold">Production Requirements</div>
            <p className="text-slate-400 text-[11px]">
              DOT/City Traffic Authority certification, NEMA/ATC NTCIP 1202 controller integration, hardware conflict monitoring, encrypted PKI credentials, CAD/dispatch integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
