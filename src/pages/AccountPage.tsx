import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Order, Product } from '../types';

export const AccountPage: React.FC = () => {
  const { user, token, logout, isAuthenticated } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist() as any;
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user orders
        if (token) {
          const ordRes = await fetch('/api/orders/my-orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (ordRes.ok) {
            const data = await ordRes.json();
            setOrders(data.orders || []);
          }
        }

        // Fetch all products to match wishlist IDs
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const pData = await prodRes.json();
          const saved = (pData.products || []).filter((p: Product) =>
            wishlist.includes(p.id)
          );
          setWishlistProducts(saved);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token, wishlist]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center text-xl font-bold font-serif shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                  {user?.name || 'Customer'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  {user?.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Access Admin Portal
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mb-8 gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 text-sm font-semibold flex items-center gap-2 transition-all relative ${
              activeTab === 'orders'
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" /> My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-4 px-2 text-sm font-semibold flex items-center gap-2 transition-all relative ${
              activeTab === 'wishlist'
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
          </button>
        </div>

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div>
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Past Orders Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  You haven't placed any sanitaryware orders with us yet.
                </p>
                <Link
                  to="/products"
                  className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-semibold"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {ord.order_ref}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          {ord.order_status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Date: {new Date(ord.created_at).toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span>Amount: <strong className="text-slate-900">₹{ord.total_amount?.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <Link
                        to={`/track-order?ref=${ord.order_ref}`}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-sky-600" /> Track Consignment
                      </Link>
                      <Link
                        to={`/order-confirmation/${ord.order_ref}`}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        Receipt <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab Content */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Saved Items</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Save your favorite toilets, basins, and cisterns while browsing to inspect them later.
                </p>
                <Link
                  to="/products"
                  className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-semibold"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl bg-slate-50 overflow-hidden mb-3">
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{p.code}</div>
                      <Link to={`/products/${p.id}`} className="font-bold text-sm text-slate-900 hover:text-sky-600 block mb-1">
                        {p.name}
                      </Link>
                      <div className="font-sans font-extrabold text-slate-900 text-sm mb-3">
                        ₹{(p.promotional_price || p.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                      <Link
                        to={`/products/${p.id}`}
                        className="p-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
