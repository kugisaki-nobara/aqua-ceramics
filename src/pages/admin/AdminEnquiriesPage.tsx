import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Building2,
  Trash2,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Enquiry } from '../../types';

export const AdminEnquiriesPage: React.FC = () => {
  const { token } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [token]);

  const filtered = enquiries.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.phone.includes(q) ||
      (item.subject && item.subject.toLowerCase().includes(q)) ||
      item.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Customer & Channel Partner Inquiries
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Leads received through the contact desk and authorized dealer program.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, phone, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Inquiries: <strong className="text-slate-800">{enquiries.length}</strong>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                  <a href={`tel:${item.phone}`} className="text-sky-600 font-mono hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {item.phone}
                  </a>
                  {item.email && (
                    <a href={`mailto:${item.email}`} className="text-slate-500 hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {item.email}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {item.status}
                </span>
              </div>
            </div>

            {item.subject && (
              <div className="text-xs font-semibold text-slate-700">
                Subject: <span className="font-normal text-slate-800">{item.subject}</span>
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {item.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
