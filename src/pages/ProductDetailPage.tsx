import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  ShoppingCart, 
  FileText, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Droplets, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  Download,
  Phone,
  Mail,
  Box,
  Truck
} from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useEnquiry } from '../context/EnquiryContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openEnquiry } = useEnquiry();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);

  // Quote form state
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteQty, setQuoteQty] = useState(10);
  const [quoteMsg, setQuoteMsg] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data.product);

        // Fetch related products
        const catRes = await fetch(`/api/products?category=${encodeURIComponent(data.product.category)}`);
        if (catRes.ok) {
          const catData = await catRes.json();
          setRelatedProducts(
            (catData.products || [])
              .filter((p: Product) => p.id !== data.product.id)
              .slice(0, 3)
          );
        }
      } catch (err: any) {
        setError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-600">Loading Product Specifications...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-slate-600 text-sm mb-6">The requested sanitaryware model could not be found or has been discontinued.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const effectivePrice = product.promotional_price || product.price;
  const isDiscounted = product.promotional_price && product.promotional_price < product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - product.promotional_price!) / product.price) * 100)
    : 0;


  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          product_name: product.name,
          quantity: quoteQty,
          customer_name: quoteName,
          customer_phone: quotePhone,
          customer_email: quoteEmail,
          message: quoteMsg
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit quote');
      setQuoteSuccess(data.quotation?.quote_ref || 'Received');
    } catch (err: any) {
      alert(err.message || 'Error submitting quotation');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const downloadSpecSheet = () => {
    const content = `AQUA CERAMICS LLP - ARCHITECTURAL SPECIFICATION SHEET
============================================================
Product: ${product.name}
Model Code: ${product.code}
Category: ${product.category}
Price: ₹${effectivePrice.toLocaleString('en-IN')}
Dimensions: ${product.dimensions || 'Standard Architectural Fit'}
Material & Finish: ${product.material_finish || 'High-fired Vitreous China with Nano-Glaze'}
Key Features: ${Array.isArray(product.key_features) ? product.key_features.join(', ') : product.key_features || 'Tornado Flush, Rimless, UF Soft-Close'}

Corporate Contact:
Aqua Ceramics LLP
Phone: 7019254016
Email: business@aquaceramics.in
Tagline: DESIGNED FOR COMFORT BUILT FOR LIFE
============================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aqua_Ceramics_${product.code}_Specification.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/products" className="hover:text-sky-600 transition-colors">Catalog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-sky-600 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Product Image & Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square flex items-center justify-center p-6">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
                {isDiscounted && (
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {discountPercent}% Off Promo
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-sm transition-all ${
                    inWishlist
                      ? 'bg-rose-50 text-rose-500'
                      : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Badges / Tech guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Droplets className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Eco-Flush</div>
                  <div className="text-[10px] text-slate-500">Dual 3L/6L</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Sparkles className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Nano Glaze</div>
                  <div className="text-[10px] text-slate-500">Anti-Bacterial</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">10 Year Warranty</div>
                  <div className="text-[10px] text-slate-500">Ceramic Body</div>
                </div>
              </div>
            </div>

            {/* Right: Product Meta, Price, Purchase & Quote CTAs */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Model: <strong className="text-slate-800">{product.code}</strong>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mb-4">
                  {product.name}
                </h1>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-3xl font-extrabold text-slate-950 font-sans">
                    ₹{effectivePrice.toLocaleString('en-IN')}
                  </span>
                  {isDiscounted && (
                    <span className="text-lg text-slate-400 line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-slate-500">(Includes applicable taxes & standard freight)</span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      In Stock ({product.stock} units available for dispatch)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      Backorder / Made to Project Order
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Features Highlights */}
                {product.key_features && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Key Engineering Highlights:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      {(Array.isArray(product.key_features)
                        ? product.key_features
                        : JSON.parse(product.key_features || '[]')
                      ).map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* B2B Showcase & Enquiry Actions */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => openEnquiry({ product: product.name, code: product.code, type: 'Project Quotation' })}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-700 to-sky-800 hover:from-sky-800 hover:to-sky-900 text-white px-6 py-4 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <FileText className="w-4 h-4" /> Enquire for Project / Bulk Rate
                  </button>

                  <button
                    onClick={() => setShowQuoteModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Request Formal Quotation
                  </button>
                </div>

                {/* Direct B2B Contact Row */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-slate-700">Commercial Sales Desk:</span>
                  <a href="tel:7019254016" className="flex items-center gap-1.5 font-bold text-sky-700 hover:text-sky-900">
                    <Phone className="w-3.5 h-3.5" /> 7019254016
                  </a>
                  <a href="mailto:business@aquaceramics.in" className="flex items-center gap-1.5 font-bold text-sky-700 hover:text-sky-900">
                    <Mail className="w-3.5 h-3.5" /> business@aquaceramics.in
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={downloadSpecSheet}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-600 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Technical Spec Sheet (.txt)
                  </button>
                  <Link
                    to="/bathroom-3d"
                    className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    <Box className="w-3.5 h-3.5" /> View in 3D Showroom
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Matrix */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
          <h3 className="text-xl font-bold font-serif text-slate-900 mb-6">
            Detailed Technical Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Model Code</span>
              <span className="text-slate-900 font-bold font-mono">{product.code}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Category</span>
              <span className="text-slate-900 font-bold">{product.category}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Dimensions</span>
              <span className="text-slate-900 font-bold">{product.dimensions || '550 x 360 x 380 mm'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Ceramic Material & Glaze</span>
              <span className="text-slate-900 font-bold">{product.material_finish || 'Grade A Vitreous China + Nano Ion Glaze'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Water Absorption Rate</span>
              <span className="text-slate-900 font-bold">&lt; 0.5% (Impermeable)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Static Load Bearing</span>
              <span className="text-slate-900 font-bold">Tested up to 400 kg</span>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif font-bold text-slate-900">
                Complementary Products in {product.category}
              </h3>
              <Link to="/products" className="text-xs font-semibold text-sky-600 hover:text-sky-700">
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Commercial Quotation Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">
              Request Commercial / Bulk Quotation
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Model: <strong className="text-slate-800">{product.name} ({product.code})</strong>
            </p>

            {quoteSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">Quotation Request Registered!</h4>
                <p className="text-xs text-slate-600 mb-4">
                  Reference: <strong className="font-mono text-sky-600">{quoteSuccess}</strong>. Our commercial sales engineer will reach out to you within 4 business hours.
                </p>
                <button
                  onClick={() => {
                    setShowQuoteModal(false);
                    setQuoteSuccess(null);
                  }}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    placeholder="e.g. Ramesh Patel (Architect)"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={quotePhone}
                      onChange={(e) => setQuotePhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Quantity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quoteQty}
                      onChange={(e) => setQuoteQty(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    placeholder="e.g. ramesh@architects.com"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Details / Location</label>
                  <textarea
                    rows={3}
                    value={quoteMsg}
                    onChange={(e) => setQuoteMsg(e.target.value)}
                    placeholder="Mention delivery city, project type (Hospitality / Residential), and delivery timeline..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quoteSubmitting}
                    className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 rounded-xl text-xs font-semibold text-white shadow-md"
                  >
                    {quoteSubmitting ? 'Submitting...' : 'Submit Quotation Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
