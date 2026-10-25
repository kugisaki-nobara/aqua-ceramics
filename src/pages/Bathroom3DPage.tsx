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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 3D Experience Top Control Header */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs uppercase tracking-wider font-bold text-sky-400">
                Interactive WebGL 3D Showroom
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white mt-0.5">
              Aqua Ceramics Virtual Bathroom Studio
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              to="/request-quote"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-colors"
            >
              Request Commercial Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 3D Scene Viewport (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
              <Bathroom3DScene 
                onSelectProduct={(p) => setSelectedHotspot(p)} 
                selectedId={selectedHotspot?.id}
              />
            </div>

            {/* User Interaction Tips */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 rounded-2xl px-6 py-3.5 gap-4">
              <div className="flex items-center gap-2">
                <Rotate3d className="w-4 h-4 text-sky-400" />
                <span><strong>Rotate:</strong> Drag Left Click or Touch Swipe</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-teal-400" />
                <span><strong>Zoom:</strong> Scroll Wheel or Toolbar +/-</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span><strong>Hotspots:</strong> Tap glowing pins to inspect fixtures</span>
              </div>
            </div>
          </div>

          {/* Sidebar: Showroom Features & Products in Scene (Col 1) */}
          <div className="space-y-6">
            {/* Hotspot Inspector */}
            {selectedHotspot ? (
              <div className="bg-slate-900 border border-sky-500/40 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-sky-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                    Active Fixture
                  </span>
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors"
                  >
                    Clear
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    {selectedHotspot.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Model: <strong className="text-slate-200 font-mono">{selectedHotspot.code}</strong>
                  </div>
                </div>

                <div className="text-2xl font-bold font-sans text-sky-400">
                  ₹{selectedHotspot.price?.toLocaleString('en-IN')}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  {selectedHotspot.specs}
                </p>

                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Dimensions:</span>
                  <strong className="text-slate-200">{selectedHotspot.dimensions}</strong>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => openEnquiry({
                      product: selectedHotspot.name,
                      code: selectedHotspot.code,
                      type: '3D Bathroom Studio'
                    })}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Enquire for this Fixture
                  </button>
                  <Link
                    to={`/products/${selectedHotspot.product?.id || 1}`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl font-semibold text-xs border border-slate-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> View Full Specifications
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                  <Info className="w-4 h-4" /> Scene Explorer
                </div>
                <h3 className="text-base font-serif font-bold text-white">
                  Click any Fixture to Inspect
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interact with the 3D model directly or select a sanitaryware fixture below to zoom and review technical tolerance, finish options, and pricing.
                </p>
              </div>
            )}

            {/* Sanitaryware Installed in this Setup (Interactive Selector) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Fixtures in Concept</span>
                <span className="text-[10px] text-sky-400 font-normal">Click to Inspect</span>
              </h3>
              
              <div className="space-y-2.5">
                {fixtureList.map((f) => {
                  const isSelected = selectedHotspot?.id === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleSelectFixture(f)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                        isSelected 
                          ? 'bg-sky-950/70 border-sky-500 text-white shadow-md' 
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                          {f.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Model: <span className="font-mono">{f.code}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-sky-400 block">
                          ₹{f.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-300">
                          Inspect &rarr;
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Architectural Consultation Card */}
            <div className="bg-gradient-to-br from-sky-950 to-slate-900 border border-sky-800/40 rounded-2xl p-6 text-slate-200 space-y-3">
              <h4 className="font-serif font-bold text-white text-base">Custom Bathroom Layouts</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Planning a hotel, residential villa development, or commercial master plan? Connect directly with Aqua Ceramics engineering team.
              </p>
              <div className="pt-1 flex flex-col gap-2">
                <Link
                  to="/request-quote"
                  className="w-full text-center px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Request Bulk Quotation
                </Link>
                <a
                  href="tel:7019254016"
                  className="w-full flex items-center justify-center gap-2 text-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-400" /> Call 7019254016
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
