import React from 'react';
import { CheckCircle2, Clock, Truck, Package, ShieldCheck, Home, AlertCircle } from 'lucide-react';
import { OrderHistoryEvent } from '../types';

interface OrderTimelineProps {
  currentStatus: string;
  history?: OrderHistoryEvent[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, history = [] }) => {
  const stages = [
    { name: 'Order Placed', icon: Clock, desc: 'Received in system' },
    { name: 'Order Confirmed', icon: ShieldCheck, desc: 'Verified by Aqua Logistics' },
    { name: 'Processing', icon: Package, desc: 'Quality checked & packed' },
    { name: 'Dispatched', icon: Truck, desc: 'Handed to carrier' },
    { name: 'Out for Delivery', icon: Truck, desc: 'Courier out for delivery' },
    { name: 'Delivered', icon: Home, desc: 'Completed successfully' },
  ];

  const isCancelled = currentStatus === 'Cancelled';
  const stageNames = stages.map((s) => s.name);
  const currentIndex = stageNames.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
            Fulfillment Progress
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status updates from Aqua Ceramics dispatch center
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
            isCancelled
              ? 'bg-rose-100 text-rose-800'
              : currentStatus === 'Delivered'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-sky-100 text-sky-800'
          }`}
        >
          Status: {currentStatus}
        </span>
      </div>

      {isCancelled ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <div>
            <strong>This order has been cancelled.</strong> If you have questions regarding a refund or cancellation reason, please contact our team at <strong>7019254016</strong>.
          </div>
        </div>
      ) : (
        /* Progress Stepper */
        <div className="relative">
          {/* Timeline Bar */}
          <div className="hidden md:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0">
            <div
              className="h-full bg-sky-600 transition-all duration-500"
              style={{
                width: `${currentIndex >= 0 ? (currentIndex / (stages.length - 1)) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = currentIndex >= idx;
              const isCurrent = currentIndex === idx;

              return (
                <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs shrink-0 ${
                      isCompleted
                        ? 'bg-sky-600 text-white'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-sky-100' : ''}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                  </div>

                  <div>
                    <div
                      className={`text-sm font-bold ${
                        isCompleted ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {stage.name}
                    </div>
                    <div className="text-[11px] text-slate-500 hidden sm:block">
                      {stage.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Log */}
      {history.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Audit Status History
          </h4>
          <div className="space-y-3">
            {history.map((ev, i) => (
              <div key={i} className="flex items-start justify-between text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="font-bold text-slate-800">{ev.status}</span>
                  {ev.notes && <p className="text-slate-600 mt-0.5">{ev.notes}</p>}
                </div>
                <div className="text-slate-400 shrink-0 text-right">
                  <div>{new Date(ev.created_at).toLocaleDateString()}</div>
                  <div>{new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
