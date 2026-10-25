import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Tag, 
  Check,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, itemCount } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const code = couponCode.trim().toUpperCase();
    if (code === 'AQUA10') {
      const discount = Math.round(cartTotal * 0.1);
      setAppliedDiscount(discount);
      setCouponSuccess('Promo Code AQUA10 applied (10% Off)!');
    } else if (code === 'ARCHITECT5') {
      const discount = Math.round(cartTotal * 0.05);
      setAppliedDiscount(discount);
      setCouponSuccess('Architect Trade Code applied (5% Off)!');
    } else {
      setCouponError('Invalid promo code. Try "AQUA10" or "ARCHITECT5"');
    }
  };

  const finalTotal = Math.max(0, cartTotal - appliedDiscount);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">
            Your Cart is Currently Empty
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Explore our curated range of rimless toilets, architectural wash basins, and concealed cisterns to start building your dream bathroom.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-sky-500 transition-all"
            >
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <nav className="text-xs text-slate-500 mb-2 flex items-center gap-2">
              <Link to="/" className="hover:text-sky-600">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Shopping Cart</span>
            </nav>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Order Basket ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Cart Items Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {item.code}
                      </div>
                      <Link
                        to={`/products/${item.id}`}
                        className="text-base font-bold text-slate-900 hover:text-sky-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-slate-500 mt-1">
                        Unit Price: <span className="font-semibold text-slate-800">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                        {item.stock} units available in depot
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-slate-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right min-w-[5rem]">
                      <div className="text-base font-extrabold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Delete action */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to Catalog Link */}
            <div className="flex justify-between items-center px-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                <ChevronLeft className="w-4 h-4" /> Continue Shopping
              </Link>
              <span className="text-xs text-slate-400">All prices include standard freight & insurance</span>
            </div>
          </div>

          {/* Order Summary & Checkout Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h3 className="text-lg font-serif font-bold text-slate-900 pb-4 border-b border-slate-100">
                Order Summary
              </h3>

              {/* Line Items */}
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-slate-900 font-sans">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promotional Discount</span>
                    <span>- ₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Standard Depot Freight</span>
                  <span className="text-emerald-600 font-semibold uppercase text-[10px]">FREE</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18% Included)</span>
                  <span className="text-slate-500 font-sans">
                    ₹{Math.round((finalTotal * 18) / 118).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Promotional / Trade Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. AQUA10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1 font-medium">{couponSuccess}</p>}
              </form>

              {/* Grand Total */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <div className="text-sm font-bold text-slate-900">Total Payable Amount</div>
                  <div className="text-[10px] text-slate-400">Net price after taxes</div>
                </div>
                <div className="text-2xl font-extrabold text-slate-950 font-sans">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => navigate('/checkout', { state: { appliedDiscount } })}
                className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-sky-600/20 transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="space-y-2 pt-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Genuine High-Fired Ceramic Grade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-500" />
                  <span>Wooden Crate Packaging for Zero Breakage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
