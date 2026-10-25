import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Droplets, ShieldCheck, Truck, 
  Box, Phone, Mail, Award, CheckCircle2, ChevronRight, Star
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product, Category, Project } from '../types';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch featured products
    fetch('/api/products?featured=true&limit=8')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFeaturedProducts(data.data);
      })
      .catch((err) => console.error(err));

    // Fetch projects
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-24">
      {/* SECTION A: HERO */}
      <section className="relative bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-900/60 border border-sky-600/40 text-sky-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Architectural Ceramic Excellence
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-white font-serif-heading">
              Designed for Comfort, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-white">
                Built for Life.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              AQUA CERAMICS LLP presents a distinguished sanitaryware collection crafted from high-density vitreous china. 
              Featuring ultra-hygienic rimless flush technology, designer countertop wash basins, and architectural in-wall cistern systems.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/products"
                className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl shadow-xl shadow-sky-900/40 flex items-center gap-2 transition-all hover:gap-3"
              >
                EXPLORE COLLECTION <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/3d-experience"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all"
              >
                <Box className="w-4 h-4 text-sky-400" /> 3D BATHROOM EXPERIENCE
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="pt-8 border-t border-slate-800 grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-2xl font-black text-sky-400">100%</div>
                <div className="text-xs text-slate-400">Vitreous Glaze China</div>
              </div>
              <div>
                <div className="text-2xl font-black text-sky-400">3L / 6L</div>
                <div className="text-xs text-slate-400">Eco-Flush Savings</div>
              </div>
              <div>
                <div className="text-2xl font-black text-sky-400">400 kg</div>
                <div className="text-xs text-slate-400">Load Rated Durability</div>
              </div>
            </div>
          </div>

          {/* Hero Photography Showcase */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-16/10">
              <img
                src="/images/hero_sanitaryware_banner.jpg"
                alt="Aqua Ceramics Architectural Luxury Bathroom Showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Master Bathroom Suite</span>
                  <p className="text-white font-bold text-sm">Aqua Luxe Rimless EWC & Table-Top Ceramic Basin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-sky-700 tracking-widest uppercase">
            Product Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif-heading">
            Featured Categories
          </h2>
          <p className="text-slate-600 text-sm">
            Discover precision-engineered sanitaryware crafted for modern Indian and international living spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1: Wash Basins */}
          <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="aspect-4/3 overflow-hidden bg-slate-100">
              <img
                src="/images/category_wash_basins.jpg"
                alt="Wash Basins Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Wash Basins
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mt-2 mb-6">
                Architectural table-top basins, full pedestal designs, oval vessel sinks, and space-saving wall-mounted units.
              </p>
              <Link
                to="/products?category=Wash+Basins"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-700 group-hover:gap-2.5 transition-all"
              >
                EXPLORE WASH BASINS <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Category 2: Western Toilets / EWC */}
          <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="aspect-4/3 overflow-hidden bg-slate-100">
              <img
                src="/images/category_ewc_toilets.jpg"
                alt="Western Toilets EWC Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Western Toilets / EWC
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mt-2 mb-6">
                Rimless wall-hung water closets, single-piece siphon models, and coupled floor-mounted toilets with soft-close seats.
              </p>
              <Link
                to="/products?category=Western+Toilets+%2F+EWC"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-700 group-hover:gap-2.5 transition-all"
              >
                EXPLORE EWC TOILETS <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Category 3: Other Sanitaryware */}
          <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="aspect-4/3 overflow-hidden bg-slate-100">
              <img
                src="/images/category_other_sanitaryware.jpg"
                alt="Other Sanitaryware Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Other Sanitaryware
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mt-2 mb-6">
                Concealed dual-flush cistern tanks, touchless ceramic sensor urinals, ergonomic bidet closets, and corner basins.
              </p>
              <Link
                to="/products?category=Other+Sanitaryware"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-700 group-hover:gap-2.5 transition-all"
              >
                EXPLORE SANITARYWARE <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: FEATURED PRODUCTS GRID */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-sky-700 tracking-widest uppercase">
                Curated Selection
              </span>
              <h2 className="text-3xl font-extrabold text-slate-950 font-serif-heading mt-1">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-white border border-slate-300 hover:border-sky-600 text-slate-800 hover:text-sky-700 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-2 transition-all"
            >
              View All Catalogue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D: BRAND INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold text-sky-700 tracking-widest uppercase">
              About Aqua Ceramics LLP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif-heading leading-tight">
              Pioneering Modern Ceramic Engineering for Every Home.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              AQUA CERAMICS LLP is focused on crafting high-performance ceramic sanitaryware that pairs understated modern elegance with uncompromising structural resilience.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every closet and wash basin is subjected to rigorous quality checks for ceramic density, thermal stability, and flush water efficiency. We serve individual homeowners, commercial developers, architects, and nationwide dealer networks.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                <CheckCircle2 className="w-5 h-5 text-sky-700 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Nano-Glaze Surface</h4>
                <p className="text-xs text-slate-600 mt-1">Stain-resistant smooth finish prevents dirt and bacterial adhesion.</p>
              </div>
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                <CheckCircle2 className="w-5 h-5 text-sky-700 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Silent Hydraulics</h4>
                <p className="text-xs text-slate-600 mt-1">Acoustic insulation technology minimizes flush and refill noise.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
              >
                DISCOVER OUR STORY <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="/images/category_wash_basins.jpg"
                alt="Aqua Ceramics Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: 3D BATHROOM EXPERIENCE TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 rounded-3xl p-8 sm:p-14 text-white border border-sky-900 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" /> Interactive WebGL Experience
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-heading text-white">
                Visualize Products in Our Interactive 3D Bathroom
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Step into a virtual architectural bathroom suite powered by Three.js. 
                Rotate, zoom, click real 3D product hotspots to inspect toilet bowls and vanity basins, switch between Alpine White and Matte Black finishes, and add items directly to your shopping cart.
              </p>

              <Link
                to="/3d-experience"
                className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all"
              >
                LAUNCH 3D EXPERIENCE →
              </Link>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-16/10">
              <img
                src="/images/hero_sanitaryware_banner.jpg"
                alt="3D Bathroom Suite Preview"
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Link
                  to="/3d-experience"
                  className="w-16 h-16 rounded-full bg-sky-600/90 hover:bg-sky-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                >
                  <Box className="w-8 h-8" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: PROJECTS & INSTALLATIONS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold text-sky-700 tracking-widest uppercase">
              Showcase
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 font-serif-heading mt-1">
              Projects & Installations
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
          >
            View All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((proj) => (
            <div key={proj.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col">
              <div className="aspect-16/10 overflow-hidden bg-slate-100 relative">
                <img
                  src={proj.image_url}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                  {proj.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-bold text-slate-900 text-base">{proj.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 mb-2">{proj.location}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{proj.description}</p>
                <div className="mt-auto text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-md">
                  Products: {proj.products_used}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION G: WHY CHOOSE US */}
      <section className="bg-slate-900 text-white py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-sky-400 tracking-widest uppercase">
              The Aqua Ceramics Benchmark
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-heading text-white">
              Why Choose Aqua Ceramics LLP?
            </h2>
            <p className="text-slate-400 text-sm">
              Engineered with precision tolerances and backed by dedicated dealer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
                <Droplets className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Eco-Flush 3L/6L</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dual-stage hydraulic siphon valves conserve thousands of liters of clean water yearly.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Nano-Glaze Shield</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ultra-smooth non-porous vitreous china prevents calcium scale and bacterial deposit build-up.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Ergonomic Form</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contoured seating height and splash-proof basin geometries engineered for effortless daily comfort.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Commercial Dispatch</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct bulk logistics coordination for builders, distributors, and architectural contractors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: CUSTOMER TESTIMONIALS (Sample Demonstration) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-sky-700 tracking-widest uppercase">
            Client Feedback [Sample Content]
          </span>
          <h2 className="text-3xl font-extrabold text-slate-950 font-serif-heading">
            What Our Partners Say
          </h2>
          <p className="text-xs text-slate-500 italic">
            *Demonstration customer reviews for UI evaluation. Real client reviews will be published upon management verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "The rimless EWC toilets from Aqua Ceramics have exceptional glaze finish and whisper-quiet flushing. Our villa clients are extremely pleased with the aesthetic."
            </p>
            <div className="border-t border-slate-100 pt-3">
              <div className="font-bold text-slate-900 text-sm">Ar. Rajesh Verma</div>
              <div className="text-[11px] text-slate-500">Principal Architect, Studio Forma</div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Aqua Ceramics table-top wash basins offer deep splash-free bowls and clean silhouettes. Delivery was punctual and safely packed."
            </p>
            <div className="border-t border-slate-100 pt-3">
              <div className="font-bold text-slate-900 text-sm">Priya Sundaram</div>
              <div className="text-[11px] text-slate-500">Interior Design Consultant</div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "As a commercial dealer, the transparent wholesale quotations and high product reliability make Aqua Ceramics a strong recommendation for our clients."
            </p>
            <div className="border-t border-slate-100 pt-3">
              <div className="font-bold text-slate-900 text-sm">Sunil Mehta</div>
              <div className="text-[11px] text-slate-500">Sanitaryware Distributor</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION I: CONTACT & QUOTATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
        <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black font-serif-heading">
            Need Commercial Pricing or Dealer Support?
          </h2>
          <p className="text-sky-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connect directly with Aqua Ceramics LLP. Request bulk product quotes, verify dealer terms, or inquire about custom bathroom specifications.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/request-quote"
              className="px-8 py-3.5 bg-white text-sky-950 font-extrabold text-xs rounded-xl shadow-lg hover:bg-sky-50 transition-all uppercase tracking-wider"
            >
              REQUEST A BULK QUOTE
            </Link>
            <a
              href="tel:7019254016"
              className="px-8 py-3.5 bg-sky-950/60 hover:bg-sky-950 text-white font-bold text-xs rounded-xl border border-sky-400/40 backdrop-blur-xs flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-sky-300" /> CALL 7019254016
            </a>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
