import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Printer, 
  ArrowRight, 
  Phone, 
  Mail, 
  Copy, 
  Check,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Order } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { orderRef } = useParams<{ orderRef: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [loading, setLoading] = useState<boolean>(!order);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!order && orderRef) {
      fetch(`/api/orders/track/${orderRef}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) setOrder(data.order);
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [order, orderRef]);

  const copyRef = () => {
    if (!orderRef) return;
    navigator.clipboard.writeText(orderRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl print:shadow-none print:border-none">
          {/* Header */}
          <div className="text-center pb-8 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Order Confirmed & Logged
            </span>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-slate-500 text-xs mt-2">
              Aqua Ceramics LLP has registered your order for quality inspection and crate dispatch.
            </p>

            {/* Order Reference Pill */}
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Order Reference:</span>
              <span className="text-base font-mono font-bold text-sky-600">{orderRef}</span>
              <button
                onClick={copyRef}
                className="p-1 text-slate-400 hover:text-slate-600"
                title="Copy Reference"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Order Details Body */}
          <div className="py-8 space-y-6">
            {/* Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Date Placed</span>
                <span className="font-semibold text-slate-800">
                  {order?.created_at ? new Date(order.created_at).toLocaleDateString() : 'Today'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Payment Method</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {order?.payment_method?.replace('_', ' ') || 'Online / Razorpay'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block mb-1">Payment Status</span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {order?.payment_status || 'Paid / Verified'}
                </span>
              </div>
            </div>

            {/* Ordered Items List */}
            {order?.items && order.items.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Purchased Sanitaryware Items
                </h3>
                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{item.product_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Code: {item.product_code} &bull; Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-slate-50 flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-700">Total Order Value:</span>
                    <span className="text-sky-600 font-mono text-base">
                      ₹{order.total_amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Destination */}
            {order && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" /> Dispatch Destination:
                </div>
                <div className="text-slate-600 leading-relaxed">
                  <strong>{order.customer_name}</strong> &bull; {order.customer_phone}<br />
                  {order.address}, {order.city}, {order.state} - {order.postal_code}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              <Printer className="w-4 h-4" /> Print Commercial Receipt
            </button>

            <Link
              to={`/track-order?ref=${orderRef}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/20"
            >
              Track Order Live <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Corporate Helpline */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400 space-y-1">
            <div>Questions regarding your dispatch? Reach out to Aqua Logistics Desk:</div>
            <div>
              Phone: <a href="tel:7019254016" className="text-sky-600 font-bold hover:underline">7019254016</a> &bull; Email: <a href="mailto:business@aquaceramics.in" className="text-sky-600 font-bold hover:underline">business@aquaceramics.in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
