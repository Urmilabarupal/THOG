/**
 * @file src/admin/AdminSettings.tsx
 * @purpose Admin General Store Settings module for store branding, Indian GST tax rates, and gateway keys.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Updates currency formatting, support helplines, Razorpay parameters, and tax models.
 */

import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const AdminSettings: React.FC = () => {
  const { settings, showToast, refreshProducts } = useStore();

  const [storeName, setStoreName] = useState(settings?.storeName || 'The House of Gaunt');
  const [supportEmail, setSupportEmail] = useState(settings?.supportEmail || 'concierge@houseofgaunt.in');
  const [supportPhone, setSupportPhone] = useState(settings?.supportPhone || '+91 80 4123 9900');
  const [gstRate, setGstRate] = useState(settings?.gstRate || 18);
  const [currency, setCurrency] = useState(settings?.currency || 'INR');
  const [currencySymbol, setCurrencySymbol] = useState(settings?.currencySymbol || '₹');
  const [razorpayKeyId, setRazorpayKeyId] = useState(settings?.razorpayKeyId || 'rzp_test_ccdl99golfindia');
  const [razorpayTestMode, setRazorpayTestMode] = useState(settings?.razorpayTestMode !== false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          supportEmail,
          supportPhone,
          gstRate: Number(gstRate),
          currency,
          currencySymbol,
          razorpayKeyId,
          razorpayTestMode
        })
      });
      if (res.ok) {
        showToast('Store settings saved successfully.');
        refreshProducts();
      } else {
        showToast('Failed to save store settings.', 'error');
      }
    } catch {
      showToast('Error saving settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">System Configuration</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          General Store Settings
        </h1>
        <p className="text-xs text-stone-500">Configure business identity, Indian GST percentage, and payment modes.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded p-6 sm:p-8 max-w-3xl space-y-6 text-xs text-stone-700">
        {/* Store Identity */}
        <div className="space-y-4">
          <h3 className="font-serif-display font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
            Store Identity & Agency Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-900 font-semibold mb-1">Store Legal Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Development Agency</label>
              <input
                type="text"
                value="Climate Change Digital Labs (CCDL)"
                disabled
                className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded text-stone-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-900 font-semibold mb-1">Support Email Desk</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Support Phone Helpline</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>
          </div>
        </div>

        {/* Financial & Indian Tax Settings */}
        <div className="space-y-4 border-t border-stone-100 pt-6">
          <h3 className="font-serif-display font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
            Indian Financial & GST Tax Model
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-900 font-semibold mb-1">Currency Code</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Currency Symbol</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Indian GST Rate (%)</label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>
          </div>
        </div>

        {/* Razorpay Gateway Parameters */}
        <div className="space-y-4 border-t border-stone-100 pt-6">
          <h3 className="font-serif-display font-bold text-sm text-stone-900 border-b border-stone-100 pb-2 flex items-center justify-between">
            <span>Razorpay Indian Payment Gateway</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified Integration
            </span>
          </h3>

          <div>
            <label className="block text-stone-900 font-semibold mb-1">Razorpay Key ID</label>
            <input
              type="text"
              value={razorpayKeyId}
              onChange={(e) => setRazorpayKeyId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="razorpayTest"
              checked={razorpayTestMode}
              onChange={(e) => setRazorpayTestMode(e.target.checked)}
              className="w-4 h-4 accent-[#0D3B2E]"
            />
            <label htmlFor="razorpayTest" className="font-semibold text-stone-900 cursor-pointer">
              Enable Razorpay Test / Sandbox Mode during development
            </label>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Settings...' : 'Save General Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
