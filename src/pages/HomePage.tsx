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
      {/* SECTION A: HERO - Glassmorphic Oceanic Luxury */}
      <section className="relative overflow-hidden py-16 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Frosted Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[#1b3d54] text-xs font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#3d84ae]" />
              <span>Architectural Ceramic Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-[#1b3d54] font-serif">
              Designed for Comfort, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3d84ae] via-[#246187] to-[#1b3d54]">
                Built for Life.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              <strong className="font-semibold text-[#1b3d54]">AQUA CERAMICS LLP</strong> presents an architectural sanitaryware collection crafted from high-density vitreous china. 
              Featuring ultra-hygienic rimless flush engineering, designer countertop basins, and concealed water closet systems.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <Link
                to="/products"
                className="glass-button-primary px-8 py-4 font-bold rounded-2xl shadow-xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
              >
                <span>EXPLORE COLLECTION</span> 
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/3d-experience"
                className="glass-button-secondary px-8 py-4 font-bold rounded-2xl flex items-center gap-2.5 transition-all hover:scale-105"
              >
                <Box className="w-4 h-4 text-[#3d84ae]" /> 
                <span>3D BATHROOM EXPERIENCE</span>
              </Link>
            </div>

            {/* Quick Stats Glass Ribbon */}
            <div className="pt-6 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs">
                <div className="text-2xl font-black text-[#3d84ae]">100%</div>
                <div className="text-[11px] font-medium text-slate-600">Vitreous Glaze China</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs">
                <div className="text-2xl font-black text-[#3d84ae]">3L / 6L</div>
                <div className="text-[11px] font-medium text-slate-600">Eco-Flush Savings</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs">
                <div className="text-2xl font-black text-[#3d84ae]">400 kg</div>
                <div className="text-[11px] font-medium text-slate-600">Load Rated Durability</div>
              </div>
            </div>
          </div>

          {/* Hero Photography Showcase - Glass Framed */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 aspect-16/11 bg-white/40 backdrop-blur-xl group">
              <img
                src="/images/hero_sanitaryware_banner.jpg"
                alt="Aqua Ceramics Architectural Luxury Bathroom Showcase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b3d54]/90 via-transparent to-transparent flex items-end p-6">
                <div className="glass-panel-cream p-4 rounded-2xl border border-white/70 backdrop-blur-xl w-full">
                  <span className="text-[10px] font-extrabold text-[#3d84ae] uppercase tracking-widest block">
                    Aqua Signature Series
                  </span>
                  <p className="text-[#1b3d54] font-bold text-sm mt-0.5">
                    Rimless Wall-Hung Closet & Designer Countertop Basin Suite
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION B: FEATURED CATEGORIES - Glass Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-[#3d84ae] tracking-widest uppercase">
            Product Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b3d54] font-serif">
            Architectural Product Categories
          </h2>
          <p className="text-slate-600 text-sm">
            Discover precision-engineered sanitaryware crafted for modern living and commercial hospitality spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1: Wash Basins */}
          <div className="group glass-card rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="aspect-4/3 overflow-hidden relative">
              <img
                src="/images/category_wash_basins.jpg"
                alt="Wash Basins Collection"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/80 backdrop-blur-md text-[#1b3d54] border border-white/60">
                  Basins & Vanities
                </span>
              </div>
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-[#1b3d54] group-hover:text-[#3d84ae] transition-colors">
                Wash Basins
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mt-2 mb-6">
                Architectural table-top basins, full pedestal designs, oval vessel sinks, and space-saving wall-mounted units.
              </p>
              <Link
                to="/products?category=Wash+Basins"
                className="mt-auto inline-flex items-center gap-2 text-xs font-extrabold text-[#3d84ae] group-hover:gap-3 transition-all"
              >
                <span>EXPLORE WASH BASINS</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Category 2: Western Toilets / EWC */}
          <div className="group glass-card rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="aspect-4/3 overflow-hidden relative">
              <img
                src="/images/category_ewc_toilets.jpg"
                alt="Western Toilets EWC Collection"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/80 backdrop-blur-md text-[#1b3d54] border border-white/60">
                  Water Closets
                </span>
              </div>
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-[#1b3d54] group-hover:text-[#3d84ae] transition-colors">
                Western Toilets / EWC
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mt-2 mb-6">
                Rimless wall-hung water closets, single-piece siphon models, and coupled floor-mounted toilets with soft-close seats.
              </p>
              <Link
                to="/products?category=Western+Toilets+%2F+EWC"
                className="mt-auto inline-flex items-center gap-2 text-xs font-extrabold text-[#3d84ae] group-hover:gap-3 transition-all"
              >
                <span>EXPLORE EWC TOILETS</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Category 3: Other Sanitaryware */}
          <div className="group glass-card rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="aspect-4/3 overflow-hidden relative">
              <img
                src="/images/category_other_sanitaryware.jpg"
                alt="Other Sanitaryware Collection"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/80 backdrop-blur-md text-[#1b3d54] border border-white/60">
                  Fittings & Cisterns
                </span>
              </div>
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-[#1b3d54] group-hover:text-[#3d84ae] transition-colors">
                Other Sanitaryware
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mt-2 mb-6">
                Concealed dual-flush cistern tanks, touchless ceramic sensor urinals, ergonomic bidet closets, and corner basins.
              </p>
              <Link
                to="/products?category=Other+Sanitaryware"
                className="mt-auto inline-flex items-center gap-2 text-xs font-extrabold text-[#3d84ae] group-hover:gap-3 transition-all"
              >
                <span>EXPLORE SANITARYWARE</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/80 shadow-xl space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#3d84ae] tracking-widest uppercase">
                Curated Selection
              </span>
              <h2 className="text-3xl font-extrabold text-[#1b3d54] font-serif mt-1">
                Featured Sanitaryware Models
              </h2>
            </div>
            <Link
              to="/products"
              className="glass-button-secondary px-5 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>View All Catalogue</span> <ArrowRight className="w-4 h-4" />
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

      {/* SECTION D: BRAND INTRODUCTION - Glassmorphic Vitreous Craftsmanship */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-white/80 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold text-[#3d84ae] tracking-widest uppercase">
              About Aqua Ceramics LLP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b3d54] font-serif leading-tight">
              Pioneering Modern Ceramic Engineering for Every Space.
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed font-light">
              <strong className="font-semibold text-[#1b3d54]">AQUA CERAMICS LLP</strong> crafts high-performance sanitaryware that pairs understated European elegance with uncompromising structural resilience.
            </p>
            <p className="text-slate-700 text-sm leading-relaxed font-light">
              Every closet and wash basin is subjected to meticulous quality checks for ceramic density, thermal glaze stability, and flush water economy. We partner with architects, builders, hospitality projects, and nationwide distribution networks.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#3d84ae] mb-2" />
                <h4 className="font-bold text-[#1b3d54] text-sm">Nano-Glaze Surface</h4>
                <p className="text-xs text-slate-600 mt-1">Stain-resistant smooth finish prevents dirt and bacterial adhesion.</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#3d84ae] mb-2" />
                <h4 className="font-bold text-[#1b3d54] text-sm">Silent Hydraulics</h4>
                <p className="text-xs text-slate-600 mt-1">Acoustic insulation technology minimizes flush and refill noise.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="glass-button-primary inline-flex items-center gap-2 px-6 py-3 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105"
              >
                <span>DISCOVER OUR STORY</span> <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 aspect-4/3 bg-white/40 backdrop-blur-xl">
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
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-white border border-white/20 shadow-2xl bg-gradient-to-br from-[#1b3d54] via-[#265979] to-[#3d84ae]">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
              <span className="px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 backdrop-blur-md">
                <Box className="w-3.5 h-3.5 text-sky-200" /> Interactive WebGL Experience
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white leading-tight">
                Inspect Fixtures in Our Interactive 3D Bathroom Studio
              </h2>

              <p className="text-sky-100 text-sm leading-relaxed font-light">
                Step into a virtual architectural bathroom suite powered by Three.js WebGL. 
                Rotate 360°, inspect product hotspots, switch between Alpine White and Matte Black ceramic finishes, and request direct project quotations.
              </p>

              <Link
                to="/3d-experience"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-[#fef4e9] text-[#1b3d54] font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>LAUNCH 3D EXPERIENCE</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl aspect-16/10 group">
              <img
                src="/images/hero_sanitaryware_banner.jpg"
                alt="3D Bathroom Suite Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-[#1b3d54]/40 backdrop-blur-xs flex items-center justify-center">
                <Link
                  to="/3d-experience"
                  className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-[#1b3d54] flex items-center justify-center shadow-2xl hover:scale-115 transition-all cursor-pointer"
                >
                  <Box className="w-8 h-8 text-[#3d84ae]" />
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
            <span className="text-xs font-extrabold text-[#3d84ae] tracking-widest uppercase">
              Showcase
            </span>
            <h2 className="text-3xl font-extrabold text-[#1b3d54] font-serif mt-1">
              Projects & Installations
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs font-bold text-[#3d84ae] hover:underline flex items-center gap-1"
          >
            <span>View All Projects</span> →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((proj) => (
            <div key={proj.id} className="group glass-card rounded-3xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
              <div className="aspect-16/10 overflow-hidden bg-slate-100 relative">
                <img
                  src={proj.image_url}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#1b3d54]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase border border-white/20">
                  {proj.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="font-bold text-[#1b3d54] text-base">{proj.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 mb-2 font-medium">{proj.location}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{proj.description}</p>
                <div className="mt-auto text-[11px] font-semibold text-[#1b3d54] bg-white/70 backdrop-blur-md border border-white/80 px-3 py-2 rounded-xl">
                  Products: <span className="text-[#3d84ae]">{proj.products_used}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION G: WHY CHOOSE US - Glass Cards Dark Palette */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="glass-card-dark rounded-3xl p-8 sm:p-14 text-white shadow-2xl space-y-12 border border-white/20">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-extrabold text-sky-300 tracking-widest uppercase">
                The Aqua Ceramics Benchmark
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
                Why Choose Aqua Ceramics LLP?
              </h2>
              <p className="text-slate-300 text-sm font-light">
                Engineered with precision tolerances and backed by dedicated dealer support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/15 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/15 text-sky-200 flex items-center justify-center font-bold">
                  <Droplets className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Eco-Flush 3L/6L</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Dual-stage hydraulic siphon valves conserve thousands of liters of clean water yearly.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/15 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/15 text-sky-200 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Nano-Glaze Shield</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Ultra-smooth non-porous vitreous china prevents calcium scale and bacterial deposit build-up.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/15 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/15 text-sky-200 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Ergonomic Form</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Contoured seating height and splash-proof basin geometries engineered for effortless daily comfort.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/15 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/15 text-sky-200 flex items-center justify-center font-bold">
                  <Truck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Commercial Dispatch</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Direct bulk logistics coordination for builders, distributors, and architectural contractors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-[#3d84ae] tracking-widest uppercase">
            Client Feedback [Sample Content]
          </span>
          <h2 className="text-3xl font-extrabold text-[#1b3d54] font-serif">
            What Our Partners Say
          </h2>
          <p className="text-xs text-slate-500 italic">
            *Demonstration customer reviews for UI evaluation. Real client reviews will be published upon management verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-7 rounded-3xl space-y-4">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "The rimless EWC toilets from Aqua Ceramics have exceptional glaze finish and whisper-quiet flushing. Our villa clients are extremely pleased with the aesthetic."
            </p>
            <div className="border-t border-slate-200/60 pt-3">
              <div className="font-bold text-[#1b3d54] text-sm">Ar. Rajesh Verma</div>
              <div className="text-[11px] text-slate-500">Principal Architect, Studio Forma</div>
            </div>
          </div>

          <div className="glass-card p-7 rounded-3xl space-y-4">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "Aqua Ceramics table-top wash basins offer deep splash-free bowls and clean silhouettes. Delivery was punctual and safely packed."
            </p>
            <div className="border-t border-slate-200/60 pt-3">
              <div className="font-bold text-[#1b3d54] text-sm">Priya Sundaram</div>
              <div className="text-[11px] text-slate-500">Interior Design Consultant</div>
            </div>
          </div>

          <div className="glass-card p-7 rounded-3xl space-y-4">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "As a commercial dealer, the transparent wholesale quotations and high product reliability make Aqua Ceramics a strong recommendation for our clients."
            </p>
            <div className="border-t border-slate-200/60 pt-3">
              <div className="font-bold text-[#1b3d54] text-sm">Sunil Mehta</div>
              <div className="text-[11px] text-slate-500">Sanitaryware Distributor</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION I: CONTACT & QUOTATION CTA - Glass Accent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
        <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl bg-gradient-to-br from-[#3d84ae] via-[#265979] to-[#1b3d54] text-white border border-white/30">
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <h2 className="text-3xl sm:text-4xl font-black font-serif relative z-10">
            Need Commercial Pricing or Dealer Distributorship?
          </h2>
          <p className="text-sky-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed relative z-10 font-light">
            Connect directly with Aqua Ceramics LLP. Request bulk project quotations, verify dealership catalogs, or inspect custom bathroom specifications.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 relative z-10">
            <Link
              to="/request-quote"
              className="px-8 py-3.5 bg-white text-[#1b3d54] hover:bg-[#fef4e9] font-extrabold text-xs rounded-xl shadow-xl transition-all uppercase tracking-wider hover:scale-105 active:scale-95"
            >
              REQUEST A BULK QUOTE
            </Link>
            <a
              href="tel:7019254016"
              className="px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/30 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4 text-sky-200" /> CALL 7019254016
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
