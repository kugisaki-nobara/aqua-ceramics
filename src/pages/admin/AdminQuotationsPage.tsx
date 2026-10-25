import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Phone, 
  Mail, 
  Clock, 
  Edit3, 
  CheckCircle2, 
  X,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Quotation } from '../../types';

export const AdminQuotationsPage: React.FC = () => {
  const { token } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected Quotation for review modal
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [statusInput, setStatusInput] = useState('');
  const [proposedPriceInput, setProposedPriceInput] = useState<number | ''>('');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/quotations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuotations(data.quotations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [token]);

  const openReviewModal = (q: Quotation) => {
    setSelectedQuote(q);
    setStatusInput(q.status);
    setProposedPriceInput(q.proposed_price || '');
    setAdminNotesInput(q.admin_notes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/quotations/${selectedQuote.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: statusInput,
          proposed_price: proposedPriceInput === '' ? null : Number(proposedPriceInput),
          admin_notes: adminNotesInput
        })
      });

      if (!res.ok) throw new Error('Failed to update quotation');
      setSelectedQuote(null);
      fetchQuotations();
    } catch (err: any) {
      alert(err.message || 'Error updating quotation');
    } finally {
      setSaving(false);
    }
  };

  const filtered = quotations.filter((q) => {
    const s = search.toLowerCase();
    return (
      q.quote_ref.toLowerCase().includes(s) ||
      q.customer_name.toLowerCase().includes(s) ||
      (q.product_name && q.product_name.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Commercial B2B Quotations Pipeline
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review institutional tenders, set commercial volume discounts, and monitor proposal statuses.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quotation reference, firm, or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Quotations: <strong className="text-slate-800">{quotations.length}</strong>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Quote Ref</th>
                <th className="py-3 px-4">Product / Requirement</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Customer / Organization</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Proposed Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-600">
                    {q.quote_ref}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {q.product_name || 'Project Package'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {q.quantity} units
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {q.customer_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <a href={`tel:${q.customer_phone}`} className="text-sky-600 font-mono hover:underline block">
                      {q.customer_phone}
                    </a>
                    {q.customer_email && (
                      <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">{q.customer_email}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {q.proposed_price ? `₹${q.proposed_price.toLocaleString('en-IN')}` : <span className="text-slate-400 font-normal">Pending Rate</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openReviewModal(q)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold"
                    >
                      Review / Quote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  B2B Commercial Review
                </span>
                <h3 className="text-xl font-mono font-bold text-slate-900 mt-0.5">
                  {selectedQuote.quote_ref}
                </h3>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div><strong>Client:</strong> {selectedQuote.customer_name} ({selectedQuote.customer_phone})</div>
                <div><strong>Requirement:</strong> {selectedQuote.product_name} - {selectedQuote.quantity} units</div>
                {selectedQuote.message && (
                  <div className="pt-2 text-slate-600 italic border-t border-slate-200 mt-2">
                    "{selectedQuote.message}"
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quotation Docket Status *
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-semibold"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Under Review">Under Review (Estimating Crate Logistics)</option>
                  <option value="Quoted">Quoted (Formal Proposal Sent)</option>
                  <option value="Accepted">Accepted by Client</option>
                  <option value="Closed">Closed / Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proposed Commercial Package Price (₹)
                </label>
                <input
                  type="number"
                  value={proposedPriceInput}
                  onChange={(e) => setProposedPriceInput(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 185000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Internal Commercial Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="e.g. Offered 12% architect rebate. Dispatch planned from Bangalore depot."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white rounded-xl font-semibold shadow-md"
                >
                  {saving ? 'Saving...' : 'Update Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
