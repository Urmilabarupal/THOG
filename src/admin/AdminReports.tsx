/**
 * @file src/admin/AdminReports.tsx
 * @purpose Admin Sales Reports module providing revenue analytics and CSV ledger export.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Generates exportable CSV files of store transactions, category sales, and GST totals.
 */

import React, { useState, useEffect } from 'react';
import { BarChart, Download, Calendar, IndianRupee } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Order } from '../types/index.ts';

export const AdminReports: React.FC = () => {
  const { formatINR, showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.data || []);
      })
      .catch((e) => console.warn(e));
  }, []);

  const totalSales = orders.reduce((sum, o) => (o.paymentStatus === 'paid' ? sum + o.totalAmount : sum), 0);
  const totalTax = orders.reduce((sum, o) => (o.paymentStatus === 'paid' ? sum + o.taxAmount : sum), 0);
  const totalShipping = orders.reduce((sum, o) => sum + o.shippingFee, 0);

  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No orders available to export.', 'info');
      return;
    }

    const headers = ['Order Number', 'Date', 'Customer Email', 'City', 'State', 'Subtotal', 'Tax (GST 18%)', 'Shipping', 'Total', 'Payment Method', 'Payment Status', 'AWB'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt,
      o.customerEmail,
      o.shippingAddress.city,
      o.shippingAddress.state,
      o.subtotal,
      o.taxAmount,
      o.shippingFee,
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus,
      o.shiprocketAwb || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `House_of_Gaunt_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Sales Report CSV generated and downloaded.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Financial Intelligence</span>
          <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
            Sales Reports & Tax Ledger
          </h1>
          <p className="text-xs text-stone-500">Commercial export for GST filing and financial auditing.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Sales CSV (Excel)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded border border-stone-200">
          <span className="text-xs font-semibold uppercase text-stone-400">Paid Gross Inflow</span>
          <p className="text-2xl font-bold text-stone-900 mt-1 tabular-nums">{formatINR(totalSales)}</p>
          <p className="text-[11px] text-stone-500 mt-1">Processed transactions</p>
        </div>

        <div className="bg-white p-5 rounded border border-stone-200">
          <span className="text-xs font-semibold uppercase text-stone-400">GST Collected (18%)</span>
          <p className="text-2xl font-bold text-emerald-800 mt-1 tabular-nums">{formatINR(totalTax)}</p>
          <p className="text-[11px] text-stone-500 mt-1">Payable to Government of India</p>
        </div>

        <div className="bg-white p-5 rounded border border-stone-200">
          <span className="text-xs font-semibold uppercase text-stone-400">Logistics Charges</span>
          <p className="text-2xl font-bold text-stone-700 mt-1 tabular-nums">{formatINR(totalShipping)}</p>
          <p className="text-[11px] text-stone-500 mt-1">Shiprocket freight fee aggregate</p>
        </div>
      </div>
    </div>
  );
};
