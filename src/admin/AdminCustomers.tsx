/**
 * @file src/admin/AdminCustomers.tsx
 * @purpose Admin Customer Management module displaying registered golfers and purchase metrics.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts.
 * @implementation Lists customer accounts, order counts, lifetime spend in INR ₹, and primary contacts.
 */

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Customer } from '../types/index.ts';

export const AdminCustomers: React.FC = () => {
  const { formatINR } = useStore();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCustomers(data.data || []);
      })
      .catch((e) => console.warn(e));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Customer Base</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Customer Management ({customers.length} Accounts)
        </h1>
        <p className="text-xs text-stone-500">Registered golfers and their transaction histories.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Golfer Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Contact Phone</th>
              <th className="py-3 px-4 text-center">Orders</th>
              <th className="py-3 px-4 text-right">Lifetime Spend</th>
              <th className="py-3 px-4 text-right">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50/70">
                <td className="py-3 px-4 font-semibold text-stone-900">{c.fullName}</td>
                <td className="py-3 px-4 text-stone-600">{c.email}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-stone-500">{c.phone || '—'}</td>
                <td className="py-3 px-4 text-center font-bold tabular-nums">{c.totalOrders}</td>
                <td className="py-3 px-4 text-right font-bold text-[#0D3B2E] tabular-nums">
                  {formatINR(c.totalSpent)}
                </td>
                <td className="py-3 px-4 text-right uppercase text-[10px] font-bold">
                  <span className={`px-2 py-0.5 rounded ${c.role === 'admin' ? 'bg-stone-900 text-white' : 'bg-emerald-50 text-emerald-800'}`}>
                    {c.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
