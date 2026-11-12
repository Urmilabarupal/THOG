/**
 * @file src/admin/AdminRefunds.tsx
 * @purpose Admin Refund Management module for processing 14-day customer returns.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Displays refund claims, return reasons, and simulates reverse payment disbursements.
 */

import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface RefundItem {
  id: string;
  orderNumber: string;
  customerName: string;
  equipment: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processed' | 'rejected';
  date: string;
}

const SAMPLE_REFUNDS: RefundItem[] = [
  {
    id: 'ref-1',
    orderNumber: 'CCDL-2026-1038',
    customerName: 'Karan Mehra',
    equipment: 'TaylorMade Qi10 Max 10K Driver (10.5° Regular)',
    amount: 56999,
    reason: 'Player opted for stiffer shaft profile after simulator test.',
    status: 'pending',
    date: '2026-03-02'
  },
  {
    id: 'ref-2',
    orderNumber: 'CCDL-2026-1022',
    customerName: 'Meenakshi Iyer',
    equipment: 'CCDL Monaco Waterproof Shoes (UK 7)',
    amount: 16999,
    reason: 'Size exchange needed for thicker winter socks.',
    status: 'processed',
    date: '2026-02-28'
  }
];

export const AdminRefunds: React.FC = () => {
  const { formatINR, showToast } = useStore();
  const [refunds, setRefunds] = useState<RefundItem[]>(SAMPLE_REFUNDS);

  const handleApprove = (id: string) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'processed' } : r))
    );
    showToast('Refund processed via Razorpay API reversal.');
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Claims & Recalibrations</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Refund & Return Management
        </h1>
        <p className="text-xs text-stone-500">Handle 14-day warranty returns and Razorpay source-account reversals.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Refund ID & Order</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Equipment</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Return Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {refunds.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50/70">
                <td className="py-3 px-4 font-mono">
                  <p className="font-bold text-stone-900">{r.id}</p>
                  <p className="text-[11px] text-stone-400">{r.orderNumber}</p>
                </td>
                <td className="py-3 px-4 font-semibold text-stone-900">{r.customerName}</td>
                <td className="py-3 px-4 text-stone-800">{r.equipment}</td>
                <td className="py-3 px-4 tabular-nums font-bold text-stone-900">{formatINR(r.amount)}</td>
                <td className="py-3 px-4 text-stone-500 max-w-xs">{r.reason}</td>
                <td className="py-3 px-4 uppercase text-[10px] font-bold">
                  <span className={`px-2 py-0.5 rounded ${r.status === 'processed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {r.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="px-2.5 py-1 bg-[#0D3B2E] text-white rounded text-xs font-semibold hover:bg-[#092b21]"
                    >
                      Approve Reversal
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
