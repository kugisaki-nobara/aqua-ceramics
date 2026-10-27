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
      <div className="relative aspect-4/3 bg-white/45 overflow-hidden">
        {/* Product Code Badge */}
        <span className="absolute top-3 left-3 z-10 bg-[#1b3d54]/80 backdrop-blur-md text-[#fef4e9] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20 tracking-wider">
          {product.code}
        </span>

        {/* Discount / Special Offer Badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-12 z-10 bg-[#3d84ae]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider border border-white/30">
            PROJECT OFFER
          </span>
        )}

        {/* Wishlist / Shortlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited ? 'bg-rose-50/90 text-rose-600 shadow-sm' : 'bg-white/70 backdrop-blur-md text-slate-600 hover:text-rose-600 border border-white/80'
          }`}
          title={isFavorited ? 'Remove from Shortlist' : 'Add to Shortlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="block w-full h-full p-2">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hero_sanitaryware_banner.jpg';
            }}
          />
        </Link>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-[#3d84ae] hover:text-white border border-white/80"
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
              Indicative Price
            </div>
            <div className="text-lg font-extrabold text-[#1b3d54]">
              {formatINR(effectivePrice)}
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#fef4e9] text-[#265979] border border-[#3d84ae]/20 shadow-2xs">
            Available for Supply
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


