import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Rotate3d, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Eye, 
  MessageSquare,
  CheckCircle2,
  Info,
  ChevronRight,
  Download,
  PhoneCall
} from 'lucide-react';
import * as THREE from 'three';
import { Bathroom3DScene, Hotspot } from '../components/Bathroom3DScene';
import { useEnquiry } from '../context/EnquiryContext';
import { Product } from '../types';

export const Bathroom3DPage: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const { openEnquiry } = useEnquiry();

  const fixtureList = [
    {
      id: 'ewc',
      code: 'AC-EWC-101',
      name: 'Aqua Luxe Rimless Wall-Hung EWC',
      category: 'Western Toilets / EWC',
      price: 12490,
      specs: 'Premium vitreous china rimless wall-hung toilet with nano-glaze shield and soft-close ergonomic UF seat.'
    },
    {
      id: 'basin',
      code: 'AC-WB-201',
      name: 'Aqua Crystal Ceramic Table-Top Wash Basin',
      category: 'Wash Basins',
      price: 5490,
      specs: 'Modern slim-rim vessel basin with splash-free contoured interior and stain-resistant gloss porcelain finish.'
    },
    {
      id: 'cistern',
      code: 'AC-ST-301',
      name: 'Aqua Smart Concealed Dual-Flush Cistern',
      category: 'Other Sanitaryware',
      price: 4890,
      specs: 'Heavy-duty in-wall pneumatic concealed water tank with dual-flush chrome actuator plate.'
    }
  ];

  const handleSelectFixture = (f: typeof fixtureList[0]) => {
    const mockProduct: Product = {
      id: f.id === 'ewc' ? 1 : f.id === 'basin' ? 5 : 9,
      code: f.code,
      name: f.name,
      category: f.category,
      brand: 'Aqua Ceramics',
      price: f.price,
      stock: 35,
      availability: 'In Stock',
      description: f.specs,
      image_url: f.id === 'ewc' 
        ? '/images/products/wall-hung-toilet.jpg' 
        : f.id === 'basin' 
          ? '/images/products/table-top-basin.jpg' 
          : '/images/products/concealed-tank.jpg',
      is_featured: 1,
      is_published: 1
    };

    const hp: Hotspot = {
      id: f.id,
      name: f.name,
      code: f.code,
      category: f.category,
      price: f.price,
      position: f.id === 'ewc' 
        ? new THREE.Vector3(-1.2, 0.85, -1.3)
        : f.id === 'basin'
          ? new THREE.Vector3(1.2, 1.35, -1.4)
          : new THREE.Vector3(-1.2, 1.6, -1.9),
      specs: f.specs,
      dimensions: f.id === 'ewc' ? '530 x 360 x 360 mm' : f.id === 'basin' ? '480 x 370 x 130 mm' : '500 x 120 x 1100 mm',
      product: mockProduct
    };

    setSelectedHotspot(hp);
  };


  return (
    <div className="min-h-screen text-[#1b3d54] py-6 sm:py-10">
      {/* 3D Experience Top Control Header - Frosted Glass Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#3d84ae]">
                Interactive WebGL 3D Studio
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1b3d54] mt-2">
              Aqua Ceramics Virtual Bathroom Studio
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Experience photorealistic ceramic glaze reflection, evaluate installation dimensions, and request direct commercial quotes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="glass-button-secondary px-4 py-2.5 text-xs font-bold rounded-xl transition-all hover:scale-105"
            >
              Browse Catalog
            </Link>
            <Link
              to="/request-quote"
              className="glass-button-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
            >
              Request Commercial Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 3D Scene Viewport (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/70 shadow-2xl bg-slate-950">
              <Bathroom3DScene 
                onSelectProduct={(p) => setSelectedHotspot(p)} 
                selectedId={selectedHotspot?.id}
              />
            </div>

            {/* User Interaction Tips Glass Ribbon */}
            <div className="glass-panel border border-white/80 rounded-2xl px-6 py-3.5 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Rotate3d className="w-4 h-4 text-[#3d84ae]" />
                <span><strong>Rotate:</strong> Drag Left Click or Touch Swipe</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-[#265979]" />
                <span><strong>Zoom:</strong> Scroll Wheel or Toolbar +/-</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span><strong>Hotspots:</strong> Tap glowing pins to inspect fixtures</span>
              </div>
            </div>
          </div>

          {/* Sidebar: Showroom Features & Products in Scene (Col 1) */}
          <div className="space-y-6">
            {/* Hotspot Inspector Glass Card */}
            {selectedHotspot ? (
              <div className="glass-card rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300 border-2 border-[#3d84ae]/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#3d84ae] flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-full border border-white/80">
                    <span className="w-2 h-2 rounded-full bg-[#3d84ae] animate-pulse"></span>
                    Active Fixture
                  </span>
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-white/60 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-[#1b3d54]">
                    {selectedHotspot.name}
                  </h3>
                  <div className="text-xs text-slate-600 mt-1">
                    Model: <strong className="text-[#1b3d54] font-mono">{selectedHotspot.code}</strong>
                  </div>
                </div>

                <div className="text-2xl font-black font-sans text-[#3d84ae]">
                  ₹{selectedHotspot.price?.toLocaleString('en-IN')}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed glass-panel p-3.5 rounded-xl border border-white/80">
                  {selectedHotspot.specs}
                </p>

                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>Dimensions:</span>
                  <strong className="text-[#1b3d54]">{selectedHotspot.dimensions}</strong>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => openEnquiry({
                      product: selectedHotspot.name,
                      code: selectedHotspot.code,
                      type: '3D Bathroom Studio'
                    })}
                    className="w-full flex items-center justify-center gap-2 glass-button-primary text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Enquire for this Fixture
                  </button>
                  <Link
                    to={`/products/${selectedHotspot.product?.id || 1}`}
                    className="w-full flex items-center justify-center gap-2 glass-button-secondary py-2.5 rounded-xl font-semibold text-xs transition-colors"
                  >
                    <Eye className="w-4 h-4" /> View Full Specifications
                  </Link>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-[#3d84ae] font-bold text-xs uppercase tracking-wider">
                  <Info className="w-4 h-4" /> Scene Explorer
                </div>
                <h3 className="text-base font-serif font-bold text-[#1b3d54]">
                  Click any Fixture to Inspect
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Interact with the 3D model directly or select a sanitaryware fixture below to zoom and review technical tolerance, finish options, and pricing.
                </p>
              </div>
            )}

            {/* Sanitaryware Installed in this Setup (Interactive Selector) */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b3d54] flex items-center justify-between">
                <span>Fixtures in Concept</span>
                <span className="text-[10px] text-[#3d84ae] font-normal">Click to Inspect</span>
              </h3>
              
              <div className="space-y-2.5">
                {fixtureList.map((f) => {
                  const isSelected = selectedHotspot?.id === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleSelectFixture(f)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected 
                          ? 'bg-[#3d84ae]/20 border-[#3d84ae] shadow-md' 
                          : 'bg-white/50 border-white/60 hover:bg-white/80 hover:border-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#1b3d54] group-hover:text-[#3d84ae] transition-colors">
                          {f.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Model: <span className="font-mono">{f.code}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#3d84ae] block">
                          ₹{f.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 group-hover:text-[#1b3d54]">
                          Inspect &rarr;
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Architectural Consultation Card */}
            <div className="relative overflow-hidden rounded-3xl p-6 text-white space-y-3 bg-gradient-to-br from-[#1b3d54] via-[#265979] to-[#3d84ae] shadow-xl border border-white/20">
              <h4 className="font-serif font-bold text-white text-base">Custom Bathroom Layouts</h4>
              <p className="text-xs text-sky-100 leading-relaxed font-light">
                Planning a luxury villa, residential development, or commercial master plan? Connect directly with Aqua Ceramics engineering team.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/request-quote"
                  className="w-full text-center px-4 py-2.5 bg-white text-[#1b3d54] hover:bg-[#fef4e9] rounded-xl text-xs font-bold transition-all shadow-md hover:scale-105 cursor-pointer"
                >
                  Request Bulk Quotation
                </Link>
                <a
                  href="tel:7019254016"
                  className="w-full flex items-center justify-center gap-2 text-center px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-medium border border-white/30 backdrop-blur-md transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-200" /> Direct Desk: 7019254016
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
