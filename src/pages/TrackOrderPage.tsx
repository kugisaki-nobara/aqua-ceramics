import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Truck, 
  AlertCircle, 
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Order } from '../types';
import { OrderTimeline } from '../components/OrderTimeline';

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [orderRefInput, setOrderRefInput] = useState<string>(initialRef);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrackOrder = async (ref: string) => {
    if (!ref.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(ref.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No matching order found for this reference.');
      }
      setOrder(data.order);
      setSearchParams({ ref: ref.trim() });
    } catch (err: any) {
      setError(err.message || 'Unable to track order. Please check the reference.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchTrackOrder(initialRef);
    }
  }, [initialRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackOrder(orderRefInput);
  };

  const loadDemoOrder = () => {
    const demoRef = 'AQUA-ORD-20261012-7019';
    setOrderRefInput(demoRef);
    fetchTrackOrder(demoRef);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Real-Time Logistics Telemetry
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Track Your Consignment
          </h1>
          <p className="text-slate-600 mt-3 text-sm leading-relaxed">
            Enter your unique Aqua Ceramics order reference to view live inspection records, depot dispatch status, and delivery milestones.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Order Reference (e.g. AQUA-ORD-20261012-7019)..."
                value={orderRefInput}
                onChange={(e) => setOrderRefInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white rounded-2xl text-sm font-semibold shadow-md transition-all whitespace-nowrap"
            >
              {loading ? 'Locating...' : 'Track Order'}
            </button>
          </form>

          {/* Quick Demo Button */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>Don't have an order reference yet?</span>
            <button
              type="button"
              onClick={loadDemoOrder}
              className="text-sky-600 hover:underline font-semibold"
            >
              Load Demo Dispatched Order (AQUA-ORD-20261012-7019) &rarr;
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800 text-xs flex items-center gap-3 mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <div>
              <strong className="block font-semibold">Reference Not Found:</strong>
              {error}
            </div>
          </div>
        )}

        {/* Order Result Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-fade-in">
            {/* Header / Current Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Order Reference
                </span>
                <h2 className="text-2xl font-mono font-bold text-slate-900 mt-0.5">
                  {order.order_ref}
                </h2>
                <div className="text-xs text-slate-500 mt-1">
                  Placed on: {new Date(order.created_at).toLocaleDateString()} at{' '}
                  {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block mb-1">Current Milestone:</span>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                  {order.order_status}
                </span>
              </div>
            </div>

            {/* Visual 6-Stage Timeline Tracker */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
                Fulfillment Progression
              </h3>
              <OrderTimeline currentStatus={order.order_status} history={order.history} />
            </div>

            {/* Courier / Dispatch Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-sky-600" /> Logistics Carrier & Docket
                </div>
                <div className="text-slate-600 font-medium">
                  {order.tracking_number ? (
                    <span className="font-mono text-slate-900 font-bold">{order.tracking_number}</span>
                  ) : (
                    <span className="text-slate-400">Regional Depot Trucking (Standard Safe-Transit)</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Delivery Destination
                </div>
                <div className="text-slate-600 truncate">
                  {order.address}, {order.city}, {order.state} - {order.postal_code}
                </div>
              </div>
            </div>

            {/* Items Summary in this Consignment */}
            {order.items && order.items.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Consignment Manifest
                </h3>
                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{item.product_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Model Code: {item.product_code} &bull; Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Help Callout */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div>Need urgent dispatch change or delivery gate pass?</div>
              <a
                href="tel:7019254016"
                className="inline-flex items-center gap-2 text-sky-600 font-bold hover:underline"
              >
                <Phone className="w-4 h-4" /> Call Aqua Dispatch Desk: 7019254016
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
