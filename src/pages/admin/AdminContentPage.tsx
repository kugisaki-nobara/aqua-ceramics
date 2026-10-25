import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminContentPage: React.FC = () => {
  const { token } = useAuth();
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form Fields
  const [phone, setPhone] = useState('7019254016');
  const [email, setEmail] = useState('business@aquaceramics.in');
  const [tagline, setTagline] = useState('DESIGNED FOR COMFORT BUILT FOR LIFE');
  const [gstPlaceholder, setGstPlaceholder] = useState('[GSTIN: Pending Corporate Verification / Registered LLP]');
  const [addressPlaceholder, setAddressPlaceholder] = useState('[Registered Corporate Office / Central Depot Address - Contact Desk: 7019254016]');
  const [warrantySummary, setWarrantySummary] = useState('Aqua Ceramics LLP provides a 10-Year Limited Warranty on all Vitreous China ceramic fixtures against manufacturing defects and water absorption.');

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setContent(data.content);
          if (data.content.phone) setPhone(data.content.phone);
          if (data.content.email) setEmail(data.content.email);
          if (data.content.tagline) setTagline(data.content.tagline);
          if (data.content.gst_number) setGstPlaceholder(data.content.gst_number);
          if (data.content.office_address) setAddressPlaceholder(data.content.office_address);
          if (data.content.warranty_text) setWarrantySummary(data.content.warranty_text);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          phone,
          email,
          tagline,
          gst_number: gstPlaceholder,
          office_address: addressPlaceholder,
          warranty_text: warrantySummary
        })
      });

      if (!res.ok) throw new Error('Failed to update company content');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Corporate Information & Content Placeholders
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage verified corporate identity, contact helplines, and editable corporate placeholders.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Company details and placeholders saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Verified details header */}
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-1">
          <div className="font-bold text-sky-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> Verified Business Credentials
          </div>
          <p className="text-sky-800 text-[11px] leading-relaxed">
            Aqua Ceramics LLP verified company phone is <strong>7019254016</strong> and email is <strong>business@aquaceramics.in</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Verified Helpline Phone Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-sm font-bold font-sans"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Verified Official Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Company Brand Tagline *
          </label>
          <input
            type="text"
            required
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-sm font-semibold tracking-wide"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            GSTIN / Corporate Registration Placeholder
          </label>
          <input
            type="text"
            value={gstPlaceholder}
            onChange={(e) => setGstPlaceholder(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            Clearly labeled placeholder; replace with official GSTIN once issued.
          </span>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Registered Office / Depot Address Placeholder
          </label>
          <textarea
            rows={2}
            value={addressPlaceholder}
            onChange={(e) => setAddressPlaceholder(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Standard Warranty Terms Summary
          </label>
          <textarea
            rows={3}
            value={warrantySummary}
            onChange={(e) => setWarrantySummary(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white rounded-xl font-semibold shadow-md"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
