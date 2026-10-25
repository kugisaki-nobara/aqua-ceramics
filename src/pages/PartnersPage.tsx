import React, { useState, useEffect } from 'react';
import { 
  Handshake, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Phone, 
  Mail,
  Send,
  Sparkles
} from 'lucide-react';
import { Partner } from '../types';

export const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Application form
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [partnerType, setPartnerType] = useState('Dealer / Retail Showroom');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/partners');
        if (res.ok) {
          const data = await res.json();
          setPartners(data.partners || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${name} (${company} - ${partnerType}, ${city})`,
          phone,
          email,
          subject: `Channel Partner Application: ${partnerType}`,
          message
        })
      });

      if (!res.ok) throw new Error('Failed to submit application');
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Authorized Network & Alliances
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Partner with Aqua Ceramics LLP
          </h1>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Expand your enterprise portfolio with our fast-growing, high-margin architectural sanitaryware brand. We provide comprehensive marketing, display units, and inventory support.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">High Profit Margins</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Attractive B2B distributor margins, volume rebates, and quarterly growth incentives for retail partners.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Territorial Exclusivity</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Protected regional dealer territories to prevent internal price undercutting and protect your investments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Showroom Display Units</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Modular display racks, branded wall panels, and high-gloss 3D sample stands provided on preferential terms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Priority Dispatch</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Dedicated logistics lanes and direct-from-depot dispatch guarantee 48-hour order fulfillment for stock models.
            </p>
          </div>
        </div>

        {/* Existing Partner Profiles / Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 text-center">
            Our Trade Alliances & Channel Network
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    {partner.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{partner.name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  {partner.description || 'Authorized partner collaborating on architectural sanitaryware procurement.'}
                </p>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-sky-600 hover:underline font-semibold"
                  >
                    Visit Website &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Partner Application Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              Apply to Become an Authorized Partner
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Fill out this partnership inquiry. Our Corporate Distribution Manager will contact you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 bg-emerald-50 rounded-2xl border border-emerald-200 p-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                Thank you for your interest in joining the Aqua Ceramics network. A dedicated trade representative will contact you at <strong>{phone}</strong> shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="e.g. Vikram Mehta"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Company / Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Ceramics & Bathware"
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
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@apexceramics.in"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    City / Target Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bangalore, Karnataka"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Partnership Category *
                </label>
                <select
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Dealer / Retail Showroom">Dealer / Retail Showroom Owner</option>
                  <option value="Architectural & Interior Design Studio">Architectural & Interior Design Studio</option>
                  <option value="Real Estate Developer / Contractor">Real Estate Developer / Contractor</option>
                  <option value="Regional Super Stockist / Distributor">Regional Super Stockist / Distributor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Additional Details & Showroom Size
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention your existing brand portfolio, showroom square footage, or ongoing project requirements..."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Direct Line: <a href="tel:7019254016" className="text-sky-600 font-semibold hover:underline">7019254016</a> &bull; <a href="mailto:business@aquaceramics.in" className="text-sky-600 font-semibold hover:underline">business@aquaceramics.in</a>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-md transition-all"
                >
                  <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Partner Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
