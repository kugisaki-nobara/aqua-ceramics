import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  FileEdit, 
  LogOut, 
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const navItems = [
    { label: 'Leads & Inquiries CRM', path: '/admin', icon: LayoutDashboard },
    { label: 'Customer Inquiries', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'B2B Quotations', path: '/admin/quotations', icon: FileText },
    { label: 'Products & Catalog', path: '/admin/products', icon: Package },
    { label: 'Company Info & Showcase', path: '/admin/content', icon: FileEdit },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-300">
                Staff CRM & Leads Hub
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo.jpg" 
                alt="Aqua Ceramics" 
                className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-white/20 shadow-md shrink-0" 
              />
              <div>
                <div className="text-base font-serif font-bold text-white tracking-wide leading-tight">
                  AQUA CERAMICS
                </div>
                <div className="text-[10px] text-sky-200 mt-0.5 font-medium">
                  Admin Portal & CRM
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Signed in as: <strong className="text-slate-800">{user?.name}</strong> ({user?.email})
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> System Active &bull; Database Connected
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <div className="p-6 sm:p-10 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
