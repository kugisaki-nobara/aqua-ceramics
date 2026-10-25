'use client';

import React, { useState } from 'react';
import { TrafficEvent } from '@/types';
import { ListOrdered, ShieldAlert, CheckCircle2, Info, Zap, Filter } from 'lucide-react';

interface EventLogPanelProps {
  events: TrafficEvent[];
  onClearLogs?: () => void;
}

export const EventLogPanel: React.FC<EventLogPanelProps> = ({ events, onClearLogs }) => {
  const [filter, setFilter] = useState<'ALL' | 'PREEMPTION' | 'COMPLETED' | 'WARNING'>('ALL');

  const filteredEvents = events.filter(e => {
    if (filter === 'ALL') return true;
    if (filter === 'PREEMPTION') return e.type === 'PREEMPTION';
    if (filter === 'COMPLETED') return e.type === 'COMPLETED';
    if (filter === 'WARNING') return e.type === 'WARNING' || e.type === 'ALERT';
    return true;
  });

  const getEventIcon = (type: TrafficEvent['type']) => {
    switch (type) {
      case 'PREEMPTION':
        return <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />;
      case 'COMPLETED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />;
      case 'WARNING':
      case 'ALERT':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl select-none flex flex-col h-full max-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            System Event Log
          </h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1">
          {(['ALL', 'PREEMPTION', 'COMPLETED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition ${
                filter === f
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Log Stream */}
      <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs pr-1 scrollbar-thin">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No logged events match the selected filter.
          </div>
        ) : (
          filteredEvents.map(evt => (
            <div
              key={evt.id}
              className={`p-2 rounded-lg border flex items-start gap-2 transition ${
                evt.type === 'PREEMPTION'
                  ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300'
                  : evt.type === 'COMPLETED'
                  ? 'bg-cyan-950/30 border-cyan-900/50 text-cyan-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300'
              }`}
            >
              {getEventIcon(evt.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500 font-bold">{evt.timestamp}</span>
                  {evt.intersectionId && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">
                      {evt.intersectionId}
                    </span>
                  )}
                </div>
                <div className="text-[11px] leading-tight mt-0.5">{evt.message}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
