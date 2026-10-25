import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Download, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Building2, 
  MapPin, 
  Box, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Enquiry, Quotation } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesText, setNotesText] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Manual Add Lead Modal State
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    company_name: '',
    city: '',
    enquiry_type: 'Project Quotation',
    product_of_interest: 'Aqua Ceramics Fixtures',
    message: ''
  });
  const [addLeadSubmitting, setAddLeadSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsRes, enquiriesRes] = await Promise.all([
        fetch('/api/admin/metrics', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/enquiries', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.metrics);
        setRecentQuotes(metricsData.recentQuotations || []);
      }

      if (enquiriesRes.ok) {
        const enqData = await enquiriesRes.json();
        setEnquiries(enqData.data || []);
      }
    } catch (e) {
      console.error('Error fetching admin dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        // Refresh metrics counter
        fetchDashboardData();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: number) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ admin_notes: notesText })
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, admin_notes: notesText } : item))
        );
        setEditingNotesId(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving notes');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!window.confirm(`Are you sure you want to remove lead #${id}?`)) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting lead');
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLeadSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeadForm)
      });
      if (res.ok) {
        setShowAddLeadModal(false);
        setNewLeadForm({
          name: '',
          phone: '',
          email: '',
          company_name: '',
          city: '',
          enquiry_type: 'Project Quotation',
          product_of_interest: 'Aqua Ceramics Fixtures',
          message: ''
        });
        fetchDashboardData();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add lead');
      }
    } catch (err) {
      alert('Network error adding lead');
    } finally {
      setAddLeadSubmitting(false);
    }
  };

  const exportLeadsCSV = () => {
    if (enquiries.length === 0) {
      alert('No leads to export');
      return;
    }

    const headers = [
      'ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Company Name',
      'City',
      'Enquiry Type',
      'Product of Interest',
      'Status',
      'Subject',
      'Message',
      'Admin Notes'
    ];

    const rows = enquiries.map((l) => [
      l.id,
      new Date(l.created_at).toISOString().split('T')[0],
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${(l.company_name || '').replace(/"/g, '""')}"`,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${l.enquiry_type || ''}"`,
      `"${(l.product_of_interest || '').replace(/"/g, '""')}"`,
      `"${l.status || ''}"`,
      `"${(l.subject || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.admin_notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aqua_ceramics_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = enquiries.filter((item) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.phone.includes(q) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.company_name && item.company_name.toLowerCase().includes(q)) ||
      (item.city && item.city.toLowerCase().includes(q)) ||
      (item.product_of_interest && item.product_of_interest.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === '3D Studio'
        ? item.enquiry_type === '3D Bathroom Studio'
        : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'New':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Contacted':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'In Discussion':
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Converted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'Closed':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 gap-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Loading B2B Leads & CRM Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
              AQUA CERAMICS LLP &bull; B2B LEAD GENERATION HUB
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Leads & Business Inquiries CRM
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking architects, commercial builders, dealership applications, and 3D studio interactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => fetchDashboardData()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
            title="Refresh leads list"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>

          <button
            onClick={exportLeadsCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" /> Export CSV
          </button>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-700 to-sky-800 hover:from-sky-800 hover:to-sky-900 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Inbound Lead
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Ribbon (5 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Inquiries */}
        <div 
          onClick={() => setStatusFilter('All')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'All' 
              ? 'bg-sky-50 border-sky-400 shadow-sm' 
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {metrics?.totalLeads || enquiries.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">All prospective clients</div>
        </div>

        {/* New Unread */}
        <div 
          onClick={() => setStatusFilter('New')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'New' 
              ? 'bg-amber-50 border-amber-400 shadow-sm' 
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">New Enquiries</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">
            {metrics?.newLeads || enquiries.filter(e => e.status === 'New').length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Needs Immediate Callback</div>
        </div>

        {/* Contacted */}
        <div 
          onClick={() => setStatusFilter('Contacted')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Contacted' 
              ? 'bg-sky-50 border-sky-400 shadow-sm' 
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Contacted</span>
            <Phone className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-950 mt-2">
            {metrics?.contactedLeads || enquiries.filter(e => e.status === 'Contacted').length}
          </div>
          <div className="text-[11px] text-sky-600 mt-0.5">Intro call completed</div>
        </div>

        {/* In Discussion */}
        <div 
          onClick={() => setStatusFilter('In Discussion')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'In Discussion' 
              ? 'bg-indigo-50 border-indigo-400 shadow-sm' 
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">In Discussion</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-950 mt-2">
            {metrics?.inProgressLeads || enquiries.filter(e => e.status === 'In Discussion').length}
          </div>
          <div className="text-[11px] text-indigo-600 mt-0.5">BOQ / Drawing Stage</div>
        </div>

        {/* Converted */}
        <div 
          onClick={() => setStatusFilter('Converted')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Converted' 
              ? 'bg-emerald-50 border-emerald-400 shadow-sm' 
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Converted Deals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">
            {metrics?.convertedLeads || enquiries.filter(e => e.status === 'Converted').length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Supply Contracts Won</div>
        </div>
      </div>

      {/* 3. Main Leads Table & Pipeline Control */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search, Filter Tabs & Count Header */}
        <div className="p-6 border-b border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'New', 'Contacted', 'In Discussion', 'Converted', '3D Studio'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by client, firm, phone, city..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div>
              Showing <strong className="text-slate-900">{filteredLeads.length}</strong> of{' '}
              <strong className="text-slate-900">{enquiries.length}</strong> total inquiries
            </div>
            {statusFilter !== 'All' && (
              <button
                onClick={() => setStatusFilter('All')}
                className="text-sky-600 hover:underline font-semibold"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Responsive Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3.5 px-4">Client & Organization</th>
                <th className="py-3.5 px-4">Contact Channels</th>
                <th className="py-3.5 px-4">Inquiry Scope / Product</th>
                <th className="py-3.5 px-4">Lead Status</th>
                <th className="py-3.5 px-4">Follow-up Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    No inquiries found matching this search or filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isEditingNotes = editingNotesId === lead.id;
                  const isUpdating = updatingId === lead.id;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Client & Organization */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                        {lead.company_name && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mt-0.5">
                            <Building2 className="w-3 h-3 text-sky-600 shrink-0" />
                            {lead.company_name}
                          </div>
                        )}
                        {lead.city && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {lead.city}
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>

                      {/* 2. Contact Channels */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 font-mono font-bold text-xs transition-colors"
                            title="Call customer directly"
                          >
                            <Phone className="w-3 h-3 text-sky-600" /> {lead.phone}
                          </a>
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="block text-[11px] text-slate-600 hover:text-sky-700 truncate max-w-[180px]"
                              title={lead.email}
                            >
                              <Mail className="w-3 h-3 inline mr-1 text-slate-400" />
                              {lead.email}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* 3. Inquiry Scope & Product */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
                            {lead.enquiry_type || 'General'}
                          </span>
                          {lead.product_of_interest && (
                            <span className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-semibold truncate max-w-[150px]">
                              {lead.product_of_interest}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {lead.message}
                        </p>
                        <button
                          onClick={() => setSelectedEnquiry(lead)}
                          className="text-[11px] text-sky-700 hover:underline font-bold mt-1 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" /> View Full Message
                        </button>
                      </td>

                      {/* 4. Lead Status Dropdown */}
                      <td className="py-4 px-4 align-top">
                        <select
                          value={lead.status}
                          disabled={isUpdating}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${getStatusBadge(
                            lead.status
                          )}`}
                        >
                          <option value="New">🟡 New Lead</option>
                          <option value="Contacted">🔵 Contacted</option>
                          <option value="In Discussion">🟣 In Discussion</option>
                          <option value="Converted">🟢 Converted / Won</option>
                          <option value="Closed">⚪ Closed</option>
                        </select>
                        {isUpdating && <span className="text-[10px] text-slate-400 block mt-1 animate-pulse">Saving...</span>}
                      </td>

                      {/* 5. Follow-Up Notes */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        {isEditingNotes ? (
                          <div className="space-y-1.5">
                            <textarea
                              value={notesText}
                              onChange={(e) => setNotesText(e.target.value)}
                              placeholder="Add internal notes (e.g. sent catalogue on WhatsApp, meeting scheduled on Friday)..."
                              className="w-full p-2 bg-white border border-sky-400 rounded-lg text-xs focus:outline-none"
                              rows={3}
                            />
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleSaveNotes(lead.id)}
                                className="px-2.5 py-1 bg-sky-700 text-white rounded-md text-[10px] font-bold hover:bg-sky-800"
                              >
                                Save Note
                              </button>
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold hover:bg-slate-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNotesId(lead.id);
                              setNotesText(lead.admin_notes || '');
                            }}
                            className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/50 cursor-pointer transition-all"
                            title="Click to edit internal note"
                          >
                            {lead.admin_notes ? (
                              <p className="text-slate-700 text-xs line-clamp-2 italic">
                                "{lead.admin_notes}"
                              </p>
                            ) : (
                              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                                <Edit3 className="w-3 h-3" /> Add follow-up note...
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* 6. Quick Actions */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEnquiry(lead)}
                            className="p-2 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Commercial Project Quotations Tender Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span>
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                COMMERCIAL TENDERS & BULK SPECIFICATIONS
              </span>
            </div>
            <h2 className="text-lg font-serif font-bold text-slate-900">
              Recent Formal Project Quotations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bulk requirement submissions for commercial towers, hotels, and luxury residences.
            </p>
          </div>
          <Link
            to="/admin/quotations"
            className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
          >
            Manage Quotations &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Tender Ref</th>
                <th className="py-3 px-4">Product / Package</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Tender Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No quotation requests logged yet.
                  </td>
                </tr>
              ) : (
                recentQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                      {q.quote_ref}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {q.product_name || 'Commercial Package'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono">{q.quantity}</span> units
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {q.customer_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <a href={`tel:${q.customer_phone}`} className="font-mono text-sky-700 hover:underline font-bold">
                        {q.customer_phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Lead Detail Inspection Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-sky-50 text-sky-700 px-2.5 py-1 rounded-md border border-sky-100">
                  {selectedEnquiry.enquiry_type || 'General'} Lead #{selectedEnquiry.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedEnquiry.name}</h3>
                {selectedEnquiry.company_name && (
                  <div className="text-xs font-semibold text-slate-700">
                    Firm: {selectedEnquiry.company_name} {selectedEnquiry.city ? `(${selectedEnquiry.city})` : ''}
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Contact quick links */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="p-3 bg-sky-50 border border-sky-100 rounded-xl font-bold text-sky-800 flex items-center gap-2 hover:bg-sky-100 transition-colors"
              >
                <Phone className="w-4 h-4 text-sky-600" /> {selectedEnquiry.phone}
              </a>
              {selectedEnquiry.email ? (
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-100 transition-colors truncate"
                >
                  <Mail className="w-4 h-4 text-slate-500" /> {selectedEnquiry.email}
                </a>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400">
                  No email provided
                </div>
              )}
            </div>

            {/* Scope / Product */}
            <div className="text-xs space-y-1">
              <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                Product / Fixture of Interest:
              </span>
              <div className="font-bold text-slate-900 text-sm">
                {selectedEnquiry.product_of_interest || 'Full Ceramic Showcase'}
              </div>
            </div>

            {/* Requirement Message */}
            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                Customer's Specification / Requirement Message:
              </span>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status & Notes */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => {
                    handleUpdateStatus(selectedEnquiry.id, e.target.value);
                    setSelectedEnquiry({ ...selectedEnquiry, status: e.target.value });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusBadge(
                    selectedEnquiry.status
                  )}`}
                >
                  <option value="New">🟡 New Lead</option>
                  <option value="Contacted">🔵 Contacted</option>
                  <option value="In Discussion">🟣 In Discussion</option>
                  <option value="Converted">🟢 Converted / Won</option>
                  <option value="Closed">⚪ Closed</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Manual Inbound Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Log Inbound Commercial Lead</h3>
                <p className="text-xs text-slate-500">
                  Record an inbound phone call, WhatsApp enquiry, or dealer walk-in.
                </p>
              </div>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="e.g. Ar. Vikram Malhotra"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="e.g. 9845012345"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Company / Firm Name
                  </label>
                  <input
                    type="text"
                    value={newLeadForm.company_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="e.g. Studio Vista Architects"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="e.g. Bengaluru, Karnataka"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Lead Category
                  </label>
                  <select
                    value={newLeadForm.enquiry_type}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, enquiry_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Project Quotation">Project Quotation</option>
                    <option value="3D Bathroom Studio">3D Bathroom Studio</option>
                    <option value="Dealership / Distribution">Dealership / Distribution</option>
                    <option value="Architectural Specification">Architectural Specification</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Product / Model Code
                  </label>
                  <input
                    type="text"
                    value={newLeadForm.product_of_interest}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, product_of_interest: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="e.g. AC-EWC-101 / 50 Sets"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Inquiry Details / Client Requirements *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="Notes from customer call or meeting..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLeadSubmitting}
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {addLeadSubmitting ? 'Saving...' : 'Save Lead to CRM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
