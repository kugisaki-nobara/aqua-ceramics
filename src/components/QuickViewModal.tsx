import React from 'react';
import { X, Check, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useEnquiry } from '../context/EnquiryContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { openEnquiry } = useEnquiry();

  if (!product) return null;

  const features: string[] = Array.isArray(product.key_features)
    ? product.key_features
    : typeof product.key_features === 'string'
    ? JSON.parse(product.key_features || '[]')
    : [];

  const effectivePrice = product.promotional_price || product.price;

  const handleEnquire = () => {
    onClose();
    openEnquiry({
      product: product.name,
      code: product.code,
      type: 'Project Quotation'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="bg-slate-100 p-6 flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-80 w-auto object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero_sanitaryware_banner.jpg';
              }}
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-widest">
                {product.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                {product.name}
              </h2>
              <div className="text-xs text-slate-500 mb-3">
                Model Code: <strong className="text-slate-800">{product.code}</strong>
              </div>

              <div className="mb-4">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Indicative Commercial Rate</span>
                <div className="text-2xl font-black text-sky-950">
                  ₹{effectivePrice.toLocaleString('en-IN')}
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {product.dimensions && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                  <strong>Dimensions:</strong> {product.dimensions}
                </div>
              )}

              {features.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-800 uppercase mb-1.5">Key Specifications:</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEnquire}
                className="flex-1 py-3 px-5 bg-gradient-to-r from-sky-700 to-sky-800 hover:from-sky-800 hover:to-sky-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" /> Send Enquiry / Bulk Quote
              </button>

              <a
                href={`/products/${product.id}`}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition-colors"
              >
                Full Specs <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

