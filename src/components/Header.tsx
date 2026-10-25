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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-sky-900 text-white text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="font-semibold tracking-wider text-sky-200">AQUA CERAMICS LLP</span>
            <span className="hidden md:inline text-sky-400">•</span>
            <a href="tel:7019254016" className="flex items-center gap-1 hover:text-sky-200 transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-300" /> 7019254016
            </a>
            <span className="hidden md:inline text-sky-400">•</span>
            <a href="mailto:business@aquaceramics.in" className="flex items-center gap-1 hover:text-sky-200 transition-colors">
              <Mail className="w-3.5 h-3.5 text-sky-300" /> business@aquaceramics.in
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium tracking-wide text-sky-100 uppercase text-[11px]">
              DESIGNED FOR COMFORT BUILT FOR LIFE
            </span>
            <button 
              onClick={() => openEnquiry({ type: 'General' })}
              className="hover:underline text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Quick Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-sky-800 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-sky-700 transition-colors">
            AC
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-sky-950 font-serif-heading leading-tight">
              AQUA CERAMICS <span className="text-sky-600 font-light text-base">LLP</span>
            </div>
            <div className="text-[9px] font-bold tracking-widest text-sky-600 uppercase">
              DESIGNED FOR COMFORT BUILT FOR LIFE
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
          <Link to="/" className={`hover:text-sky-700 transition-colors ${isActive('/') ? 'text-sky-700 font-bold' : ''}`}>
            Home
          </Link>

          <Link to="/about" className={`hover:text-sky-700 transition-colors ${isActive('/about') ? 'text-sky-700 font-bold' : ''}`}>
            About Us
          </Link>

          {/* Products Mega Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => setProductsDropdownOpen(false)}
          >
            <Link to="/products" className={`flex items-center gap-1 hover:text-sky-700 transition-colors ${location.pathname.startsWith('/products') ? 'text-sky-700 font-bold' : ''}`}>
              Products <ChevronDown className="w-4 h-4 text-slate-400" />
            </Link>

            {productsDropdownOpen && (
              <div className="absolute top-full -left-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 grid gap-2 z-50">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Sanitaryware Categories</div>
                <Link to="/products?category=Wash+Basins" className="p-2.5 rounded-lg hover:bg-sky-50 flex items-center justify-between group">
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-sky-700 text-sm">Wash Basins</div>
                    <div className="text-xs text-slate-500">Table top, pedestal & wall hung basins</div>
                  </div>
                  <span className="text-sky-600 text-xs">→</span>
                </Link>
                <Link to="/products?category=Western+Toilets+%2F+EWC" className="p-2.5 rounded-lg hover:bg-sky-50 flex items-center justify-between group">
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-sky-700 text-sm">EWC / Western Toilets</div>
                    <div className="text-xs text-slate-500">Rimless wall-hung & single-piece closets</div>
                  </div>
                  <span className="text-sky-600 text-xs">→</span>
                </Link>
                <Link to="/products?category=Other+Sanitaryware" className="p-2.5 rounded-lg hover:bg-sky-50 flex items-center justify-between group">
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-sky-700 text-sm">Other Sanitaryware</div>
                    <div className="text-xs text-slate-500">Concealed cisterns, urinals & bidets</div>
                  </div>
                  <span className="text-sky-600 text-xs">→</span>
                </Link>
                <div className="border-t border-slate-100 pt-2 px-2">
                  <Link to="/products" className="text-xs font-bold text-sky-700 hover:underline">
                    View Complete Catalogue (All 12 Models) →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/3d-experience" className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all ${isActive('/3d-experience') ? 'bg-sky-700 text-white shadow-sm' : 'bg-sky-100 text-sky-800 hover:bg-sky-200'}`}>
            <Box className="w-3.5 h-3.5" /> 3D Bathroom Experience
          </Link>

          <Link to="/projects" className={`hover:text-sky-700 transition-colors ${isActive('/projects') ? 'text-sky-700 font-bold' : ''}`}>
            Projects & Installations
          </Link>

          <Link to="/partners" className={`hover:text-sky-700 transition-colors ${isActive('/partners') ? 'text-sky-700 font-bold' : ''}`}>
            Partners
          </Link>

          <Link to="/contact" className={`hover:text-sky-700 transition-colors ${isActive('/contact') ? 'text-sky-700 font-bold' : ''}`}>
            Contact Us
          </Link>
        </nav>

        {/* Header Action Icons */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)} 
            className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors relative"
            title="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Link */}
          <Link 
            to="/account/wishlist" 
            className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors relative"
            title="My Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Business Enquiry Button */}
          <button 
            onClick={() => openEnquiry({ type: 'General' })} 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            title="Send Business Enquiry"
          >
            <MessageSquare className="w-4 h-4" />
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
