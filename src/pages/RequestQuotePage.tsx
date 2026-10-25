import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Building2, 
  Copy, 
  Check, 
  Phone, 
  Mail,
  ShieldCheck,
  Package,
  Layers
} from 'lucide-react';
import { Product } from '../types';

export const RequestQuotePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('0');
  const [customModel, setCustomModel] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(20);
  const [name, setName] = useState<string>('');
  const [firmName, setFirmName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const prodIdNum = Number(selectedProductId);
    const chosenProduct = products.find((p) => p.id === prodIdNum);
    const prodName = prodIdNum === 0 ? (customModel || 'Multiple Fixtures / Comprehensive Project Package') : chosenProduct?.name;

    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: prodIdNum > 0 ? prodIdNum : null,
          product_name: prodName,
          quantity,
          customer_name: firmName ? `${name} (${firmName})` : name,
          customer_phone: phone,
          customer_email: email,
          message: `Delivery Location: ${city || 'Not specified'}. Details: ${message}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate quotation');
      setQuoteRef(data.quotation?.quote_ref || 'AQUA-QT-SUCCESS');
    } catch (err: any) {
      alert(err.message || 'Error submitting quotation');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (!quoteRef) return;
    navigator.clipboard.writeText(quoteRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-4">
            B2B Commercial Desk
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Request Commercial & Project Quotation
          </h1>
          <p className="text-slate-600 mt-3 text-sm leading-relaxed">
            Direct pricing for builders, architects, institutional buyers, and high-volume developments. Receive tailored volume rates with logistics options.
          </p>
        </div>

        {quoteRef ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              Quotation Request Registered!
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
              Your quotation docket has been prioritized in our enterprise pipeline.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto mb-8">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                Your Quotation Reference
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-mono font-bold text-sky-600">{quoteRef}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm"
                  title="Copy Reference"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              Our Senior Project Estimator will review specifications and contact you via phone or email within 4 hours.
            </p>

            <button
              onClick={() => {
                setQuoteRef(null);
                setSelectedProductId('0');
                setMessage('');
              }}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Submit Another Quotation
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Select Sanitaryware Fixture *
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="0">Package / Multiple Sanitaryware Fixtures</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.code}] {p.name} - ₹{p.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Estimated Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {selectedProductId === '0' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Custom Model Code or Fixtures Description
                  </label>
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="e.g. 50 EWC Wall-Hung Closets + 50 Table-Top Wash Basins"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Singhania"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Company / Architectural Firm / Project Name
                  </label>
                  <input
                    type="text"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    placeholder="e.g. Singhania Developers Ltd."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. procurement@singhania.com"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Delivery City / State *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Project Notes & Delivery Timeline
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify delivery phase schedules, preferred finishes (Gloss White / Matte Black), and any special packing requirements..."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Direct Line: <a href="tel:7019254016" className="text-sky-600 font-bold hover:underline">7019254016</a> &bull; <a href="mailto:business@aquaceramics.in" className="text-sky-600 font-bold hover:underline">business@aquaceramics.in</a>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-md transition-all"
                >
                  <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Generate Official Quote'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
