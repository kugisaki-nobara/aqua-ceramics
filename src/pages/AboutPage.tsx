import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Droplets, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ArrowRight, 
  Building2, 
  Factory,
  Layers,
  Wrench
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold tracking-wider uppercase mb-6 border border-sky-400/30">
            About Aqua Ceramics LLP
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-6">
            Pioneering Architectural <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-200">
              Sanitaryware Excellence
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-8">
            “DESIGNED FOR COMFORT, BUILT FOR LIFE” — Aqua Ceramics LLP delivers luxury sanitaryware 
            engineered for durability, hydrodynamic efficiency, and timeless minimalist elegance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-600/30 transition-all"
            >
              Explore Products <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold backdrop-blur-sm transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Identity & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block text-sky-600 font-semibold text-sm tracking-wider uppercase mb-3">
                Our Foundation
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                Crafted for Contemporary Spaces & Lasting Performance
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>
                  Aqua Ceramics LLP was established with a singular vision: to bridge the gap between premium international bathroom aesthetics and reliable Indian engineering. We believe a bathroom is not just a utility space—it is a sanctuary of comfort, personal wellness, and design harmony.
                </p>
                <p>
                  Every piece in our portfolio, from our rimless Western Closets (EWC) to ultra-slim ceramic table-top basins, is crafted using high-grade Vitreous China fired at peak temperatures exceeding 1200°C. This ensures high structural density, zero water percolation, and a stain-resistant glaze that preserves its lustrous sheen year after year.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Dual Flush Eco-Tech</h4>
                    <p className="text-xs text-slate-500 mt-1">Saves up to 45% water per flush cycle.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Anti-Bacterial Glaze</h4>
                    <p className="text-xs text-slate-500 mt-1">Nano-coating repels limescale & bacteria.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <img
                  src="/images/hero_sanitaryware_banner.jpg"
                  alt="Aqua Ceramics Engineering"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-white/50 text-slate-900">
                  <div className="text-xs uppercase font-bold tracking-wider text-sky-600">Company Tagline</div>
                  <div className="text-xl font-serif font-bold mt-1 text-slate-900">
                    DESIGNED FOR COMFORT BUILT FOR LIFE
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Verified Contact: <a href="tel:7019254016" className="text-sky-600 font-semibold hover:underline">7019254016</a> &bull; <a href="mailto:business@aquaceramics.in" className="text-sky-600 font-semibold hover:underline">business@aquaceramics.in</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 bg-slate-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">The Aqua Advantage</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
              Why Discerning Architects & Builders Choose Aqua Ceramics
            </h2>
            <p className="text-slate-600 mt-4">
              We engineer our products with precision tolerances, uncompromising ceramic purity, and ergonomic principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">1200°C High-Fired Vitreous China</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dense crystalline molecular structure guarantees less than 0.5% water absorption, preventing odor absorption and micro-cracks.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">360° Rimless Tornado Flush</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Eliminates hidden rims where dirt accumulates. A dynamic swirling water vortex clears the entire bowl with pinpoint cleanliness.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">UF Soft-Close Hydraulic Seats</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Constructed from heavy-duty Urea-Formaldehyde (UF) polymer, scratch-resistant and silent with quick-release cleaning hinges.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">B2B & Project Supply Support</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Direct quotation pipeline, technical CAD specifications, and dedicated dispatch coordinators for architects and contractors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Production & Glazing Standards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-3xl p-10 lg:p-16 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sky-400 font-semibold text-xs uppercase tracking-widest">
                  Engineering Standards
                </span>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold mt-2 mb-6">
                  The Science Behind Aqua Nano-Glaze
                </h3>
                <p className="text-slate-300 leading-relaxed text-base mb-6">
                  Traditional ceramics develop microscopic surface pores over time, trapping minerals and bacteria. Aqua Ceramics applies an ion-barrier Nano-Glaze before the final kiln firing, bonding directly to the ceramic substrate.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200 text-sm">Ultra-smooth surface roughness of under 0.05 microns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200 text-sm">Resistant to harsh toilet cleaners, acids, and alkalis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200 text-sm">100% inspected for siphon pressure and leakage testing</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                  <div className="text-4xl font-bold font-serif text-sky-400 mb-1">1200°C</div>
                  <div className="text-xs text-slate-300 font-medium">Kiln Firing Heat</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                  <div className="text-4xl font-bold font-serif text-teal-300 mb-1">&lt;0.5%</div>
                  <div className="text-xs text-slate-300 font-medium">Water Absorption</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                  <div className="text-4xl font-bold font-serif text-cyan-300 mb-1">400+ kg</div>
                  <div className="text-xs text-slate-300 font-medium">Static Load Testing</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                  <div className="text-4xl font-bold font-serif text-sky-300 mb-1">100%</div>
                  <div className="text-xs text-slate-300 font-medium">Siphon Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Information & Inquiries Banner */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Have a Commercial or Bulk Requirement?</h3>
              <p className="text-slate-600 mt-2 max-w-xl text-sm">
                Connect directly with the Aqua Ceramics commercial desk for tailored project pricing, architectural catalogues, or sample requests.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                <a href="tel:7019254016" className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                  <Phone className="w-4 h-4" /> 7019254016
                </a>
                <a href="mailto:business@aquaceramics.in" className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                  <Mail className="w-4 h-4" /> business@aquaceramics.in
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                to="/request-quote"
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all whitespace-nowrap"
              >
                Request Quotation
              </Link>
              <Link
                to="/products"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
              >
                View Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
