import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, Mail, MessageSquare, Heart, User as UserIcon, 
  Menu, X, Search, ChevronDown, Sparkles, Shield, Box, FileText
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useEnquiry } from '../context/EnquiryContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const { openEnquiry } = useEnquiry();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#fef4e9]/80 backdrop-blur-2xl border-b border-white/70 shadow-[0_8px_32px_rgba(61,132,174,0.06)]">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#1b3d54]/95 via-[#265979]/95 to-[#1b3d54]/95 backdrop-blur-md text-white text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="font-semibold tracking-wider text-[#fef4e9]">AQUA CERAMICS LLP</span>
            <span className="hidden md:inline text-[#6ba8ce]">•</span>
            <a href="tel:7019254016" className="flex items-center gap-1 hover:text-[#fef4e9] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#6ba8ce]" /> 7019254016
            </a>
            <span className="hidden md:inline text-[#6ba8ce]">•</span>
            <a href="mailto:business@aquaceramics.in" className="flex items-center gap-1 hover:text-[#fef4e9] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#6ba8ce]" /> business@aquaceramics.in
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium tracking-wide text-white/90 uppercase text-[11px]">
              DESIGNED FOR COMFORT BUILT FOR LIFE
            </span>
            <button 
              onClick={() => openEnquiry({ type: 'General' })}
              className="hover:underline text-[#6ba8ce] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Quick Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo with Official Company Emblem */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative p-1 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(61,132,174,0.15)] group-hover:scale-105 transition-all duration-300">
            <img 
              src="/images/logo.jpg" 
              alt="AQUA CERAMICS" 
              className="h-11 w-11 object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/aqua_ceramics_logo.jpg';
              }}
            />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-[#1b3d54] font-serif-heading leading-tight flex items-center gap-1.5">
              <span>AQUA CERAMICS</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#3d84ae]/15 text-[#265979] border border-[#3d84ae]/30">LLP</span>
            </div>
            <div className="text-[9px] font-bold tracking-widest text-[#3d84ae] uppercase">
              DESIGNED FOR COMFORT BUILT FOR LIFE
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {/* Desktop Navigation Links with Glass Hover Effects */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
          <Link to="/" className={`transition-all px-3 py-1.5 rounded-full ${isActive('/') ? 'bg-[#3d84ae]/15 text-[#265979] font-bold border border-[#3d84ae]/25' : 'hover:text-[#3d84ae] hover:bg-white/50'}`}>
            Home
          </Link>

          <Link to="/about" className={`transition-all px-3 py-1.5 rounded-full ${isActive('/about') ? 'bg-[#3d84ae]/15 text-[#265979] font-bold border border-[#3d84ae]/25' : 'hover:text-[#3d84ae] hover:bg-white/50'}`}>
            About Us
          </Link>

          {/* Products Mega Dropdown with Frosted Glass Panel */}
          <div 
            className="relative"
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => setProductsDropdownOpen(false)}
          >
            <Link to="/products" className={`flex items-center gap-1 transition-all px-3 py-1.5 rounded-full ${location.pathname.startsWith('/products') ? 'bg-[#3d84ae]/15 text-[#265979] font-bold border border-[#3d84ae]/25' : 'hover:text-[#3d84ae] hover:bg-white/50'}`}>
              Products <ChevronDown className="w-4 h-4 text-slate-400" />
            </Link>

            {productsDropdownOpen && (
              <div className="absolute top-full -left-12 w-80 glass-panel rounded-2xl shadow-2xl p-4 grid gap-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-xs font-bold text-[#3d84ae] uppercase tracking-wider px-2">Sanitaryware Categories</div>
                <Link to="/products?category=Wash+Basins" className="p-2.5 rounded-xl hover:bg-white/80 transition-all flex items-center justify-between group border border-transparent hover:border-white/60">
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-[#3d84ae] text-sm">Wash Basins</div>
                    <div className="text-xs text-slate-500">Table top, pedestal & wall hung basins</div>
                  </div>
                  <span className="text-[#3d84ae] text-xs font-bold">→</span>
                </Link>
                <Link to="/products?category=Western+Toilets+%2F+EWC" className="p-2.5 rounded-xl hover:bg-white/80 transition-all flex items-center justify-between group border border-transparent hover:border-white/60">
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-[#3d84ae] text-sm">EWC / Western Toilets</div>
                    <div className="text-xs text-slate-500">Rimless wall-hung & single-piece closets</div>
                  </div>
                  <span className="text-[#3d84ae] text-xs font-bold">→</span>
                </Link>
                <Link to="/products?category=Other+Sanitaryware" className="p-2.5 rounded-xl hover:bg-white/80 transition-all flex items-center justify-between group border border-transparent hover:border-white/60">
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-[#3d84ae] text-sm">Other Sanitaryware</div>
                    <div className="text-xs text-slate-500">Concealed cisterns, urinals & bidets</div>
                  </div>
                  <span className="text-[#3d84ae] text-xs font-bold">→</span>
                </Link>
                <div className="border-t border-white/60 pt-2 px-2">
                  <Link to="/products" className="text-xs font-bold text-[#3d84ae] hover:underline flex items-center justify-between">
                    <span>View Complete Catalogue</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/3d-experience" className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs ${isActive('/3d-experience') ? 'bg-[#3d84ae] text-white shadow-md' : 'bg-gradient-to-r from-[#3d84ae]/15 to-[#fef4e9] text-[#1b3d54] hover:bg-[#3d84ae]/25 border border-[#3d84ae]/30'}`}>
            <Box className="w-3.5 h-3.5 text-[#3d84ae]" /> 3D Bathroom Experience
          </Link>

          <Link to="/projects" className={`transition-all px-3 py-1.5 rounded-full ${isActive('/projects') ? 'bg-[#3d84ae]/15 text-[#265979] font-bold border border-[#3d84ae]/25' : 'hover:text-[#3d84ae] hover:bg-white/50'}`}>
            Projects
          </Link>

          <Link to="/partners" className={`transition-all px-3 py-1.5 rounded-full ${isActive('/partners') ? 'bg-[#3d84ae]/15 text-[#265979] font-bold border border-[#3d84ae]/25' : 'hover:text-[#3d84ae] hover:bg-white/50'}`}>
            Partners
          </Link>

          <Link to="/contact" className={`transition-all px-3 py-1.5 rounded-full ${isActive('/contact') ? 'bg-[#3d84ae]/15 text-[#265979] font-bold border border-[#3d84ae]/25' : 'hover:text-[#3d84ae] hover:bg-white/50'}`}>
            Contact Us
          </Link>
        </nav>

        {/* Header Action Icons */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)} 
            className="p-2.5 rounded-full bg-white/60 hover:bg-white/90 border border-white/80 text-slate-700 transition-all shadow-xs relative"
            title="Search Products"
          >
            <Search className="w-4 h-4 text-[#3d84ae]" />
          </button>

          {/* Wishlist Link */}
          <Link 
            to="/account/wishlist" 
            className="p-2.5 rounded-full bg-white/60 hover:bg-white/90 border border-white/80 text-slate-700 transition-all shadow-xs relative"
            title="My Shortlist"
          >
            <Heart className="w-4 h-4 text-slate-600 hover:text-rose-600" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Glassmorphic Business Enquiry Button */}
          <button 
            onClick={() => openEnquiry({ type: 'General' })} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-button-primary text-white font-bold text-xs uppercase tracking-wider cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            title="Send Business Enquiry"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Enquire Now</span>
          </button>

          {/* Customer / Admin Account Menu */}
          <div className="relative group">
            <Link 
              to={isAuthenticated ? (isAdmin ? "/admin" : "/account") : "/login"}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 flex items-center gap-1.5"
              title="Account"
            >
              <UserIcon className="w-5 h-5" />
              {user && (
                <span className="text-xs font-semibold max-w-[80px] truncate hidden xl:inline">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </Link>

            {/* Account Quick Dropdown */}
            <div className="absolute right-0 top-full w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 hidden group-hover:block z-50">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="font-bold text-xs text-slate-900 truncate">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                  </div>
                  {isAdmin ? (
                    <Link to="/admin" className="block px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-50 rounded-md">
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/account" className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-md">
                      My Account & Orders
                    </Link>
                  )}
                  <button 
                    onClick={logout} 
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md mt-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-50 rounded-md">
                    Customer Sign In
                  </Link>
                  <Link to="/register" className="block px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-md">
                    Create Account
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/admin/login" className="block px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 rounded-md">
                    Staff Admin Portal
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Global Search Bar Dropdown */}
      {searchOpen && (
        <div className="bg-slate-50 border-t border-b border-slate-200 py-3 px-4 sm:px-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
              }
            }}
            className="max-w-3xl mx-auto flex items-center gap-3"
          >
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by model code (e.g. AC-EWC-101) or sanitaryware name..." 
              className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-sky-600"
              autoFocus
            />
            <button type="submit" className="px-5 py-2 bg-sky-700 text-white rounded-lg text-sm font-bold hover:bg-sky-800">
              Search
            </button>
          </form>
        </div>
      )}

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-slate-800">Home</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-slate-800">About Us</Link>
          <div className="py-2 border-y border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Products</div>
            <Link to="/products?category=Wash+Basins" onClick={() => setMobileMenuOpen(false)} className="block pl-3 py-1 text-sm text-slate-700">Wash Basins</Link>
            <Link to="/products?category=Western+Toilets+%2F+EWC" onClick={() => setMobileMenuOpen(false)} className="block pl-3 py-1 text-sm text-slate-700">Western Toilets / EWC</Link>
            <Link to="/products?category=Other+Sanitaryware" onClick={() => setMobileMenuOpen(false)} className="block pl-3 py-1 text-sm text-slate-700">Other Sanitaryware</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block pl-3 py-1 text-sm font-bold text-sky-700">View All Catalogue</Link>
          </div>
          <Link to="/3d-experience" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-sky-700">3D Bathroom Experience</Link>
          <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-slate-800">Projects & Installations</Link>
          <Link to="/partners" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-slate-800">Partners</Link>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              openEnquiry({ type: 'General' });
            }} 
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 text-white font-bold text-sm shadow-md"
          >
            <MessageSquare className="w-4 h-4" /> Send Business Enquiry
          </button>
          <Link to="/request-quote" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-sky-800">Request a Commercial Quote</Link>
          <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-slate-500 pt-2">Staff Portal</Link>
        </div>
      )}
    </header>
  );
};
