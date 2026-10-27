import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield, CheckCircle, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#132838] to-[#0c1a25] text-slate-300 pt-16 pb-8 border-t border-white/10 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3d84ae]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Company Profile with Official Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="p-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-md">
                <img 
                  src="/images/logo.jpg" 
                  alt="AQUA CERAMICS" 
                  className="h-12 w-12 object-contain rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/aqua_ceramics_logo.jpg';
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight font-serif-heading flex items-center gap-2">
                  <span>AQUA CERAMICS</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#3d84ae]/30 text-[#6ba8ce] border border-[#3d84ae]/50">LLP</span>
                </span>
                <div className="text-[10px] font-bold text-[#6ba8ce] tracking-widest uppercase">
                  DESIGNED FOR COMFORT BUILT FOR LIFE
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-300 max-w-sm">
              Aqua Ceramics LLP is a premier manufacturer and supplier of vitreous china sanitaryware. 
              Engineered with advanced nano-glaze finish, ergonomic comfort contours, and eco-friendly dual-flush hydraulic technology.
            </p>

            <div className="space-y-2 pt-2 text-sm">
              <a href="tel:7019254016" className="flex items-center gap-2.5 text-slate-200 hover:text-[#6ba8ce] transition-colors">
                <Phone className="w-4 h-4 text-[#3d84ae]" />
                <span className="font-semibold">7019254016</span>
              </a>
              <a href="mailto:business@aquaceramics.in" className="flex items-center gap-2.5 text-slate-200 hover:text-[#6ba8ce] transition-colors">
                <Mail className="w-4 h-4 text-[#3d84ae]" />
                <span>business@aquaceramics.in</span>
              </a>
              <div className="flex items-start gap-2.5 text-slate-400 text-xs pt-1">
                <MapPin className="w-4 h-4 text-[#3d84ae] shrink-0 mt-0.5" />
                <span>Corporate operations & logistics dispatch network across India.</span>
              </div>
            </div>
          </div>

          {/* Column 2: Sanitaryware Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=Wash+Basins" className="hover:text-sky-400 transition-colors">
                  Wash Basins
                </Link>
              </li>
              <li>
                <Link to="/products?category=Western+Toilets+%2F+EWC" className="hover:text-sky-400 transition-colors">
                  Western Toilets / EWC
                </Link>
              </li>
              <li>
                <Link to="/products?category=Other+Sanitaryware" className="hover:text-sky-400 transition-colors">
                  Concealed Cisterns
                </Link>
              </li>
              <li>
                <Link to="/products?category=Other+Sanitaryware" className="hover:text-sky-400 transition-colors">
                  Ceramic Urinals
                </Link>
              </li>
              <li>
                <Link to="/3d-experience" className="hover:text-sky-400 transition-colors font-semibold text-sky-400 flex items-center gap-1">
                  3D Visualiser ↗
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate & Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-sky-400 transition-colors">
                  About Aqua Ceramics
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-sky-400 transition-colors">
                  Projects & Installations
                </Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-sky-400 transition-colors">
                  Partners & Collaborations
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sky-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-sky-400 transition-colors text-xs text-slate-500">
                  Staff Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Services & Quotation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Commercial & Help</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/track-order" className="hover:text-sky-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/request-quote" className="hover:text-sky-400 transition-colors text-sky-400 font-semibold">
                  Request Bulk Quotation
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-sky-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-sky-400 transition-colors">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong>AQUA CERAMICS LLP</strong>. All rights reserved.
          </div>
          <div className="text-sky-400 font-semibold tracking-wider uppercase text-[11px]">
            DESIGNED FOR COMFORT BUILT FOR LIFE
          </div>
          <div className="flex gap-4">
            <span className="text-slate-400">Vitreous China Quality Certified</span>
            <span>•</span>
            <span className="text-slate-400">Nano-Glaze Technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
