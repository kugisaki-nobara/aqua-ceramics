import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Eye } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useEnquiry } from '../context/EnquiryContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { openEnquiry } = useEnquiry();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const effectivePrice = product.promotional_price || product.price;
  const hasDiscount = product.promotional_price && product.promotional_price < product.price;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col group">
      {/* Thumbnail Container */}
      <div className="relative aspect-4/3 bg-white/70 overflow-hidden flex items-center justify-center p-3">
        {/* Product Code Badge */}
        <span className="absolute top-2.5 left-2.5 z-10 bg-[#1b3d54]/85 backdrop-blur-md text-[#fef4e9] text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 tracking-wider shadow-xs">
          {product.code}
        </span>

        {/* Discount / Special Offer Badge */}
        {hasDiscount && (
          <span className="absolute top-2.5 right-11 z-10 bg-[#3d84ae]/90 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border border-white/30 shadow-xs">
            PROJECT OFFER
          </span>
        )}

        {/* Wishlist / Shortlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isFavorited ? 'bg-rose-50/95 text-rose-600 shadow-xs' : 'bg-white/80 backdrop-blur-md text-slate-600 hover:text-rose-600 border border-white/80 shadow-2xs'
          }`}
          title={isFavorited ? 'Remove from Shortlist' : 'Add to Shortlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Product Image Link Container */}
        <Link to={`/products/${product.id}`} className="w-full h-full flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain object-center rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 rounded-xl border-2 border-dashed border-slate-200/80 bg-slate-50/60 text-slate-400 group-hover:border-[#3d84ae]/40 group-hover:bg-[#3d84ae]/5 transition-all">
              <span className="text-[11px] font-bold text-slate-500 mb-0.5">Image to be attached</span>
              <span className="text-[9px] text-slate-400 line-clamp-2 px-1">
                {product.source_ref ? product.source_ref.split(',')[0] : 'Manufacturer Catalog Reference'}
              </span>
            </div>
          )}
        </Link>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-[#3d84ae] hover:text-white border border-white/80 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[11px] font-bold text-[#3d84ae] uppercase tracking-widest mb-1">
          {product.category}
        </div>

        <Link to={`/products/${product.id}`} className="hover:text-[#3d84ae] transition-colors">
          <h3 className="font-bold text-[#1b3d54] text-base line-clamp-1 leading-snug mb-1">
            {product.name}
          </h3>
        </Link>

        {product.dimensions && (
          <div className="text-xs text-slate-500 mb-3">
            Dimensions: <span className="text-slate-700 font-medium">{product.dimensions}</span>
          </div>
        )}

        {/* Pricing & Commercial Availability Row */}
        <div className="mt-auto pt-3 border-t border-white/60 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {product.price > 0 ? 'Printed MRP' : 'Pricing'}
            </div>
            <div className="text-base font-extrabold text-[#1b3d54]">
              {product.price > 0 ? formatINR(effectivePrice) : (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Price not listed
                </span>
              )}
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#fef4e9] text-[#265979] border border-[#3d84ae]/20 shadow-2xs">
            {product.price > 0 ? 'In Stock' : 'Request Quote'}
          </span>
        </div>

        {/* Action Buttons for B2B Showcase */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Link
            to={`/products/${product.id}`}
            className="glass-button-secondary px-3 py-2 text-center text-xs font-bold text-slate-700 rounded-xl"
          >
            Full Specs
          </Link>

          <button
            onClick={() => openEnquiry({ product: product.name, code: product.code, type: 'Project Quotation' })}
            className="glass-button-primary px-3 py-2 text-xs font-bold text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Enquire
          </button>
        </div>
      </div>
    </div>
  );
};


