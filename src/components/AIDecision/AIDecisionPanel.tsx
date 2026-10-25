'use client';

import React from 'react';
import { Sparkles, BrainCircuit, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { AIDecision } from '@/types';

interface AIDecisionPanelProps {
  decision: AIDecision | null;
  loading: boolean;
}

export const AIDecisionPanel: React.FC<AIDecisionPanelProps> = ({ decision, loading }) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl select-none">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-purple-600/30">
            <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Gemini AI Decision
            </h2>
            <p className="text-[10px] text-slate-400">Autonomous Reasoning Engine</p>
          </div>
        </div>

        {/* Fallback vs Live Status Badge */}
        {decision && (
          <span
            className={`px-2.5 py-1 rounded-md text-[9px] font-bold font-mono tracking-wider uppercase border ${
              decision.isFallback
                ? 'bg-amber-950/80 border-amber-800/80 text-amber-400'
                : 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400'
            }`}
          >
            {decision.isFallback ? 'LOCAL SAFE FALLBACK' : 'GEMINI 2.5 FLASH ACTIVE'}
          </span>
        )}
      </div>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <BrainCircuit className="w-8 h-8 text-cyan-400 animate-pulse mb-2" />
          <div className="text-xs font-mono font-bold text-slate-300">Consulting Gemini Neural Network...</div>
          <p className="text-[10px] text-slate-500 mt-1">Analyzing multi-intersection signal vectors</p>
        </div>
      ) : decision ? (
        <div className="space-y-3 font-mono text-xs">
          {/* Target & Action Card */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="uppercase tracking-wider">Target Intersection</span>
              <span className="text-cyan-400 font-bold">{decision.next_intersection}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="uppercase tracking-wider">Recommended Action</span>
              <span className="text-emerald-400 font-bold">{decision.action}</span>
            </div>
          </div>

          {/* AI Explanation / Reasoning Box */}
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/50 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              Reasoning & Optimization Rationale
            </div>
            <p className="text-slate-200 text-[11px] leading-relaxed font-sans">
              "{decision.reason}"
            </p>
          </div>

          {/* Key Metrics: Confidence & Time Saved */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[9px] text-slate-400 uppercase">AI Confidence</div>
                <div className="text-xs font-bold text-emerald-400">{decision.confidence}%</div>
                <div className="text-[8px] text-slate-500">
                  {decision.isFallback ? 'Simulation Confidence' : 'Model Output Confidence'}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Est. Time Saved</div>
                <div className="text-xs font-bold text-purple-300">{decision.estimated_time_saved} seconds</div>
                <div className="text-[8px] text-slate-500">Vs. Standard Signal Cycle</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-500 font-mono">
          <ShieldAlert className="w-6 h-6 text-slate-600 mx-auto mb-2" />
          Awaiting Emergency Corridor Activation to generate AI preemption reasoning.
        </div>
      )}
    </div>
  );
};
