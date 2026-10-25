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
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col">
      {/* Thumbnail Container */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        {/* Product Code Badge */}
        <span className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider">
          {product.code}
        </span>

        {/* Discount / Special Offer Badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-12 z-10 bg-amber-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider">
            PROJECT OFFER
          </span>
        )}

        {/* Wishlist / Shortlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited ? 'bg-rose-50 text-rose-600' : 'bg-white/80 backdrop-blur-xs text-slate-600 hover:text-rose-600'
          }`}
          title={isFavorited ? 'Remove from Shortlist' : 'Add to Shortlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hero_sanitaryware_banner.jpg';
            }}
          />
        </Link>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/95 text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-sky-50 hover:text-sky-700"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[11px] font-bold text-sky-700 uppercase tracking-widest mb-1">
          {product.category}
        </div>

        <Link to={`/products/${product.id}`} className="hover:text-sky-700 transition-colors">
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 leading-snug mb-1">
            {product.name}
          </h3>
        </Link>

        {product.dimensions && (
          <div className="text-xs text-slate-600 mb-3">
            Dimensions: <span className="text-slate-600 font-medium">{product.dimensions}</span>
          </div>
        )}

        {/* Pricing & Commercial Availability Row */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Indicative Price
            </div>
            <div className="text-lg font-extrabold text-slate-950">
              {formatINR(effectivePrice)}
            </div>
          </div>

          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
            Available for Supply
          </span>
        </div>

        {/* Action Buttons for B2B Showcase */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Link
            to={`/products/${product.id}`}
            className="px-3 py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Full Specs
          </Link>

          <button
            onClick={() => openEnquiry({ product: product.name, code: product.code, type: 'Project Quotation' })}
            className="px-3 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Enquire
          </button>
        </div>
      </div>
    </div>
  );
};

