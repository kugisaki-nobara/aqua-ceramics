'use client';

import React from 'react';
import {
  LayoutDashboard,
  Ambulance,
  TrafficCone,
  Navigation,
  ListOrdered,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

export type TabType = 'dashboard' | 'vehicles' | 'signals' | 'routes' | 'events' | 'architecture';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadEventsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, unreadEventsCount }) => {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'vehicles', label: 'Emergency Vehicles', icon: <Ambulance className="w-5 h-5" />, badge: '1 Active' },
    { id: 'signals', label: 'Traffic Signals', icon: <TrafficCone className="w-5 h-5" />, badge: '7 Nodes' },
    { id: 'routes', label: 'Route Optimization', icon: <Navigation className="w-5 h-5" /> },
    { id: 'events', label: 'Event Logs', icon: <ListOrdered className="w-5 h-5" />, badge: unreadEventsCount > 0 ? unreadEventsCount : undefined },
    { id: 'architecture', label: 'System Architecture', icon: <Cpu className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Command Operations
        </div>

        <nav className="mt-1 space-y-1">
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-400 border border-cyan-800/60 shadow-md shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Safety & Compliance Badge */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Safety Interlocks Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Conflict-free preemption enforcement prevents opposing green light states.
        </p>
      </div>
    </aside>
  );
};
