/**
 * @file src/pages/ContactUsPage.tsx
 * @purpose Contact & Fitting Studio booking page with showroom locations in Bangalore, Gurugram, and Mumbai.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Features working contact form, direct WhatsApp integration, and physical showroom details.
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const ContactUsPage: React.FC = () => {
  const { showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [subject, setSubject] = useState('Custom Driver Fitting Appointment');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill all required contact fields.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        showToast('Message sent! Our fitting concierge will reach out within 4 business hours.');
      } else {
        showToast(data.error || 'Failed to dispatch inquiry.', 'error');
      }
    } catch {
      showToast('Error sending message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold text-[#0D3B2E] uppercase tracking-wider">
          Client Concierge & Fitting Studios
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900 mt-1">
          Connect with Our Master Club Fitters
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2">
          Schedule private TrackMan 4 launch monitor sessions or speak with our equipment concierges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded border border-stone-200">
          <h2 className="text-base font-serif-display font-bold text-stone-900 mb-2">
            Send an Inquiry or Book Studio Fitting
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Leave your contact details and golf specifications. We respond promptly during Indian business hours.
          </p>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">Inquiry Dispatched Successfully</h3>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                A senior fitting concierge from Climate Change Digital Labs has received your note and will contact you via phone or WhatsApp.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-2 bg-[#0D3B2E] text-white text-xs font-medium rounded hover:bg-[#092b21]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Mobile (WhatsApp) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Inquiry Purpose</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  >
                    <option value="Custom Driver Fitting Appointment">Custom Driver Fitting Appointment</option>
                    <option value="Iron Set Loft & Lie Recalibration">Iron Set Loft & Lie Recalibration</option>
                    <option value="Order Tracking & Logistics Assistance">Order Tracking & Logistics Assistance</option>
                    <option value="Bulk Corporate & Golf Club Gifting">Bulk Corporate & Golf Club Gifting</option>
                    <option value="General Inquiry">General Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Message or Golf Specifications *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your current swing tempo, handicap, preferred clubhead, or question..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Message to Concierge'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Studio Showrooms & Direct Reach (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Direct */}
          <div className="bg-emerald-900 text-white p-5 rounded space-y-3">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-emerald-300" />
              <h3 className="font-semibold text-sm">WhatsApp Concierge Desk</h3>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Prefer instant messaging? Chat directly with an PGA-certified fitting engineer regarding loft angles, shaft weights, and inventory.
            </p>
            <a
              href="https://wa.me/919845012345?text=Hello%20The%20House%20of%20Gaunt,%20I%20would%20like%20to%20inquire%20about%20golf%20equipment"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-bold text-xs rounded transition-colors"
            >
              Open WhatsApp (+91 98450 12345)
            </a>
          </div>

          {/* Showroom Addresses */}
          <div className="bg-white border border-stone-200 rounded p-6 space-y-5 text-xs text-stone-600">
            <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
              Physical Fitting Studios in India
            </h3>

            <div className="space-y-1">
              <p className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#0D3B2E]" />
                <span>Bengaluru Flagship Lab</span>
              </p>
              <p>CCDL Tower, 18 MG Road, Bengaluru, Karnataka 560001</p>
              <p className="text-[11px] text-stone-400">Hours: Mon–Sun, 8:00 AM – 8:00 PM IST</p>
            </div>

            <div className="space-y-1 border-t border-stone-100 pt-3">
              <p className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#0D3B2E]" />
                <span>Delhi NCR Fitting Suite</span>
              </p>
              <p>Golf Course Road, DLF Phase 5, Gurugram, Haryana 122002</p>
              <p className="text-[11px] text-stone-400">Hours: Tue–Sun, 9:00 AM – 7:00 PM IST</p>
            </div>

            <div className="space-y-1 border-t border-stone-100 pt-3">
              <p className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#0D3B2E]" />
                <span>Mumbai BKC Studio</span>
              </p>
              <p>The Capital, Level 3, G Block, BKC, Bandra East, Mumbai 400051</p>
              <p className="text-[11px] text-stone-400">Hours: Mon–Sat, 10:00 AM – 7:30 PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
