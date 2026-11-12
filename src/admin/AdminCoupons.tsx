/**
 * @file src/admin/AdminCoupons.tsx
 * @purpose Admin Coupon Management module for promotional discount codes and cart vouchers.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts.
 * @implementation Features coupon CRUD, percentage vs flat deductions, minimum cart thresholds, and expiry.
 */

import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Check, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Coupon } from '../types/index.ts';

export const AdminCoupons: React.FC = () => {
  const { formatINR, showToast } = useStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Create Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minPurchase, setMinPurchase] = useState(5000);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = () => {
    fetch('/api/admin/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCoupons(data.data || []);
      })
      .catch((e) => console.warn(e));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          discountType,
          discountValue: Number(discountValue),
          minPurchaseAmount: Number(minPurchase),
          description: description.trim() || 'Promotional Store Discount'
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Coupon ${code.toUpperCase()} created.`);
        setCode('');
        setDescription('');
        fetchCoupons();
      } else {
        showToast(data.error || 'Failed to create coupon.', 'error');
      }
    } catch {
      showToast('Error creating coupon.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (!window.confirm(`Delete coupon ${couponCode}?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Coupon ${couponCode} deleted.`);
        fetchCoupons();
      }
    } catch {
      showToast('Error deleting coupon.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Marketing & Vouchers</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Coupon Management ({coupons.length} Active Vouchers)
        </h1>
        <p className="text-xs text-stone-500">Configure promotional discount codes with minimum basket thresholds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4 text-center">Usage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {c.code}
                    </span>
                    <span className="block text-[11px] text-stone-400 mt-0.5">{c.description}</span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-[#0D3B2E]">
                    {c.discountType === 'percentage' ? `${c.discountValue}% Off` : formatINR(c.discountValue)}
                  </td>

                  <td className="py-3 px-4 tabular-nums text-stone-700 font-medium">
                    {formatINR(c.minPurchaseAmount)}
                  </td>

                  <td className="py-3 px-4 text-center tabular-nums text-stone-500">
                    {c.usageCount} orders
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteCoupon(c.id, c.code)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Form (1 col) */}
        <div className="bg-white border border-stone-200 rounded p-6 space-y-4">
          <h3 className="font-semibold text-stone-900 text-sm">Create New Promo Voucher</h3>
          <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Coupon Code (Uppercase)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. BIRDIE15"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Value</label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Min Order Threshold (₹)</label>
              <input
                type="number"
                value={minPurchase}
                onChange={(e) => setMinPurchase(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 15% discount for PGA members"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Issue Voucher'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
