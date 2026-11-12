import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  MessageSquare,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Strictly accept only numeric digits and max 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Strip non-digits
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);

    if (phoneError) {
      if (digitsOnly.length === 10) {
        setPhoneError(null);
      }
    }
  };

  const handlePhoneBlur = () => {
    if (!phone) {
      setPhoneError('Contact phone number is required.');
    } else if (phone.length !== 10) {
      setPhoneError(`Contact number must be exactly 10 digits (currently ${phone.length}).`);
    } else {
      setPhoneError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validation before submission
    if (!phone) {
      setPhoneError('Contact phone number is required.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Contact number must be exactly 10 numeric digits.');
      return;
    }

    setPhoneError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit message.');
      }
      setSubmitted(true);
    } catch (err: any) {
      setServerError(err.message || 'Error submitting message. Please verify and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Connect With Us
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Contact Aqua Ceramics LLP
          </h1>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Have questions about our architectural sanitaryware, water closets, or project supply pipelines? Our corporate team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left: Contact Info Cards */}
          <div className="space-y-6">
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Customer Desk &amp; Inquiries
                </h3>
                <a
                  href="tel:7019254016"
                  className="text-xl font-bold font-sans text-sky-600 hover:text-sky-700 block mt-1"
                >
                  7019254016
                </a>
                <p className="text-xs text-slate-500 mt-1">Available Mon – Sat, 9:30 AM to 6:30 PM IST</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Official Business Email
                </h3>
                <a
                  href="mailto:business@aquaceramics.in"
                  className="text-base font-bold text-slate-800 hover:text-sky-600 block mt-1 break-all"
                >
                  business@aquaceramics.in
                </a>
                <p className="text-xs text-slate-500 mt-1">For commercial quotations &amp; dealerships</p>
              </div>
            </div>

            {/* Trading & Distribution Note */}
            <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4" /> Trading &amp; Distribution
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aqua Ceramics LLP coordinates organized logistics, warehouse stock verification, and prompt dispatch to project sites and retail networks across India.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-slate-600 text-xs mb-8">
              Fill out the form below. Our response team typically replies within 2-4 business hours.
            </p>

            {submitted ? (
              <div className="text-center py-12 bg-emerald-50 rounded-2xl border border-emerald-200 p-8">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                  Thank you for contacting Aqua Ceramics LLP. A representative will get in touch with you shortly at <strong>{phone}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {serverError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number * <span className="font-normal lowercase text-slate-400">(10 digits)</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:bg-white tracking-wider font-mono ${
                        phoneError ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/50' : 'border-slate-300 focus:ring-sky-500'
                      }`}
                    />
                    {phoneError ? (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {phoneError}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Enter 10 numeric digits without country code or symbols ({phone.length}/10).
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ananya@example.com"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Inquiry Category *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    >
                      <option value="Product Inquiry">Product Inquiry / Specifications</option>
                      <option value="Commercial / Project Supply">Commercial / Bulk Project Supply</option>
                      <option value="Dealer / Distributorship">Dealer / Distributorship</option>
                      <option value="Order Tracking / Dispatch">Order Status &amp; Delivery</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Message / Specifications *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, sanitaryware models of interest, or project requirements..."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
