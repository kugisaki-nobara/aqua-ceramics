import React, { useState, useEffect } from 'react';
import { 
  X, Send, Phone, Mail, Building2, MapPin, 
  CheckCircle2, Sparkles, MessageSquare, ShieldCheck, Box
} from 'lucide-react';
import { useEnquiry } from '../context/EnquiryContext';

export const EnquiryDrawer: React.FC = () => {
  const { isOpen, initialData, closeEnquiry, openEnquiry } = useEnquiry();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company_name: '',
    city: '',
    enquiry_type: 'Project Quotation',
    product_of_interest: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        enquiry_type: initialData.type || 'Project Quotation',
        product_of_interest: initialData.product 
          ? `${initialData.product} ${initialData.code ? `(${initialData.code})` : ''}`
          : prev.product_of_interest,
        message: initialData.message || prev.message
      }));
      setSuccess(false);
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: `${formData.enquiry_type}: ${formData.product_of_interest || 'Aqua Ceramics Sanitaryware'}`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setLeadId(data.enquiry_id || Date.now());
        setFormData({
          name: '',
          phone: '',
          email: '',
          company_name: '',
          city: '',
          enquiry_type: 'Project Quotation',
          product_of_interest: '',
          message: ''
        });
      } else {
        setError(data.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please call 7019254016 directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Global Action Pill Button (Always visible on bottom right) */}
      {!isOpen && (
        <button
          onClick={() => openEnquiry({ type: 'General' })}
          className="fixed bottom-6 right-6 z-40 glass-button-primary font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group cursor-pointer"
          title="Open Business Enquiry Panel"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <MessageSquare className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          <span>Quick Business Enquiry</span>
        </button>
      )}

      {/* Slide-out Drawer & Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with Frosted Blur */}
          <div 
            onClick={closeEnquiry}
            className="absolute inset-0 bg-[#1b3d54]/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-lg bg-[#fef4e9]/90 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-white/80 animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header with Frosted Glass Look */}
              <div className="relative p-6 bg-gradient-to-br from-[#3d84ae] via-[#2d6f96] to-[#1b3d54] text-white border-b border-white/20 shadow-lg overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-100">
                      Commercial Desk
                    </span>
                  </div>
                  <button
                    onClick={closeEnquiry}
                    className="p-1.5 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-3 relative z-10">
                  <img 
                    src="/images/logo.jpg" 
                    alt="Aqua Ceramics" 
                    className="w-10 h-10 rounded-xl object-contain bg-white/90 p-0.5 border border-white/40 shadow-sm shrink-0" 
                  />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                      Business & Project Enquiry
                    </h2>
                    <p className="text-[11px] text-sky-100 mt-0.5 font-medium leading-tight">
                      Direct connection to Aqua Ceramics technical sales & supply team
                    </p>
                  </div>
                </div>

                <p className="text-xs text-sky-100/90 mt-2.5 leading-relaxed relative z-10 font-light">
                  Request wholesale quotations, CAD specification sheets, dealership terms, or 3D bathroom suite configurations.
                </p>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {success ? (
                  <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-500/30">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-[#1b3d54]">
                      Enquiry Registered Successfully
                    </h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting Aqua Ceramics LLP. Our technical commercial desk has received your request and will follow up with you promptly.
                    </p>
                    {leadId && (
                      <div className="inline-block bg-white/80 backdrop-blur-md border border-[#3d84ae]/30 text-[#1b3d54] text-xs font-mono font-bold px-4 py-2 rounded-xl shadow-sm">
                        Lead Reference: #{leadId}
                      </div>
                    )}
                    <div className="pt-4 flex flex-col gap-2.5">
                      <button
                        onClick={closeEnquiry}
                        className="w-full py-3 glass-button-primary text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Done / Continue Exploring
                      </button>
                      <a
                        href="tel:7019254016"
                        className="w-full py-2.5 text-center text-xs font-bold text-[#3d84ae] hover:underline flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" /> Direct Call: 7019254016
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-rose-500/10 border border-rose-300 text-rose-700 text-xs rounded-xl font-medium backdrop-blur-md">
                        {error}
                      </div>
                    )}

                    {/* Enquiry Type Selector */}
                    <div>
                      <label className="block text-xs font-bold text-[#1b3d54] uppercase tracking-wider mb-1.5">
                        Enquiry Purpose *
                      </label>
                      <select
                        name="enquiry_type"
                        value={formData.enquiry_type}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold text-slate-800 focus:outline-[#3d84ae]"
                      >
                        <option value="Project Quotation">Architectural & Project Bulk Quotation</option>
                        <option value="Dealership Request">Showroom & Dealer Distributorship</option>
                        <option value="3D Suite Specification">3D Bathroom Studio Fitting</option>
                        <option value="Product Spec Sheet">Product Technical Spec Sheet / CAD</option>
                        <option value="General">General Business Inquiry</option>
                      </select>
                    </div>

                    {/* Contact Info (Name + Phone) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1b3d54] mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Ar. Vikram Roy"
                          className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 focus:outline-[#3d84ae]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1b3d54] mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 focus:outline-[#3d84ae]"
                        />
                      </div>
                    </div>

                    {/* Email + City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1b3d54] mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@company.com"
                          className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 focus:outline-[#3d84ae]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1b3d54] mb-1">
                          City / State
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Bengaluru, Karnataka"
                          className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 focus:outline-[#3d84ae]"
                        />
                      </div>
                    </div>

                    {/* Company / Firm Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1b3d54] mb-1">
                        Company / Firm / Studio Name <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="e.g. Skyline Builders / Studio Design LLP"
                        className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 focus:outline-[#3d84ae]"
                      />
                    </div>

                    {/* Product of Interest */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1b3d54] mb-1">
                        Sanitaryware Model / Fixture of Interest
                      </label>
                      <input
                        type="text"
                        name="product_of_interest"
                        value={formData.product_of_interest}
                        onChange={handleChange}
                        placeholder="e.g. AC-EWC-101 Wall-Hung Toilet / 3D Bathroom Suite"
                        className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 focus:outline-[#3d84ae]"
                      />
                    </div>

                    {/* Message / Requirements */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1b3d54] mb-1">
                        Project Scope / Requirements *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your project, required quantity, installation timeline, or custom architectural specifications..."
                        className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 focus:outline-[#3d84ae] resize-none"
                      />
                    </div>

                    {/* Direct Contact Banner Glass */}
                    <div className="glass-panel p-3.5 rounded-xl border border-white/60 flex items-center justify-between text-xs text-[#1b3d54] shadow-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#3d84ae] shrink-0" />
                        <span>Direct Commercial Desk: <strong>7019254016</strong></span>
                      </div>
                      <span className="text-[11px] text-[#3d84ae] font-semibold bg-white/70 px-2 py-0.5 rounded-md border border-white/60">
                        Priority
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 glass-button-primary text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Submitting Enquiry...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Commercial Enquiry
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/60 text-center text-[11px] text-slate-600 font-medium">
                AQUA CERAMICS LLP • DESIGNED FOR COMFORT BUILT FOR LIFE
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
