/**
 * @file src/admin/AdminShipping.tsx
 * @purpose Admin Shipping Management module configuring Shiprocket courier rules and free thresholds.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Updates Indian postal rules, shipping fees in INR ₹, and Shiprocket operating mode.
 */

import React, { useState } from 'react';
import { Truck, ShieldCheck, Save, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const AdminShipping: React.FC = () => {
  const { settings, formatINR, showToast } = useStore();

  const [threshold, setThreshold] = useState(settings?.freeShippingThreshold || 5000);
  const [standardFee, setStandardFee] = useState(settings?.standardShippingFee || 350);
  const [expressFee, setExpressFee] = useState(settings?.expressShippingFee || 750);
  const [mode, setMode] = useState(settings?.shiprocketMode || 'sandbox');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freeShippingThreshold: Number(threshold),
          standardShippingFee: Number(standardFee),
          expressShippingFee: Number(expressFee),
          shiprocketMode: mode
        })
      });
      if (res.ok) {
        showToast('Shiprocket shipping configuration updated.');
      }
    } catch {
      showToast('Error saving shipping settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Logistics Rules</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Shiprocket Logistics & Freight Management
        </h1>
        <p className="text-xs text-stone-500">Configure Indian courier zones, air express tiers, and free delivery thresholds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white border border-stone-200 rounded p-6 space-y-5 text-xs text-stone-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-900 font-semibold mb-1">Free Shipping Order Threshold (INR ₹)</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
              <p className="text-[11px] text-stone-400 mt-1">Orders above this amount receive 100% free delivery.</p>
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Standard Air Express Fee (INR ₹)</label>
              <input
                type="number"
                value={standardFee}
                onChange={(e) => setStandardFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
              <p className="text-[11px] text-stone-400 mt-1">Applied to orders below threshold.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-900 font-semibold mb-1">Priority Metro Express Fee (INR ₹)</label>
              <input
                type="number"
                value={expressFee}
                onChange={(e) => setExpressFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Shiprocket API Operating Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              >
                <option value="sandbox">Sandbox Test Mode (Simulated AWB)</option>
                <option value="live">Live Production (BlueDart / Delhivery Dispatch)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Updating...' : 'Save Logistics Configuration'}</span>
            </button>
          </div>
        </form>

        <div className="bg-stone-50 border border-stone-200 rounded p-6 space-y-4 text-xs">
          <h3 className="font-bold text-stone-900">Shiprocket Carrier Nodes</h3>
          <div className="space-y-2 text-stone-600">
            <div className="flex items-center justify-between p-2 bg-white rounded border border-stone-200">
              <span className="font-semibold text-stone-800">BlueDart Air</span>
              <span className="text-emerald-700 font-bold">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border border-stone-200">
              <span className="font-semibold text-stone-800">Delhivery Surface</span>
              <span className="text-emerald-700 font-bold">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border border-stone-200">
              <span className="font-semibold text-stone-800">Shadowfax Express</span>
              <span className="text-emerald-700 font-bold">Enabled</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-400">
            Primary Origin Facility: CCDL Warehouse, Peenya Industrial Area, Bengaluru - 560058.
          </p>
        </div>
      </div>
    </div>
  );
};
