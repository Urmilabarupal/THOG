/**
 * @file src/admin/AdminDashboard.tsx
 * @purpose Admin analytics dashboard providing key business metrics, revenue charts, and operational alerts.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Displays real-time Gross Revenue in INR ₹, total orders, low stock warnings,
 * and category sales breakdowns.
 */

import React, { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Users, AlertTriangle, ArrowUpRight, Truck, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { AdminModule } from './AdminLayout.tsx';

interface AdminDashboardProps {
  setActiveModule: (module: AdminModule) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveModule }) => {
  const { formatINR } = useStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalytics(data.data);
        }
      })
      .catch((e) => console.warn(e))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !analytics) {
    return <div className="text-stone-400 text-xs py-12 text-center">Loading store analytics...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Performance Overview · Pan-India E-Commerce
          </span>
          <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
            Store Performance & Operations
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('products')}
            className="px-3 py-2 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-colors"
          >
            + Add New Golf Equipment
          </button>
          <button
            onClick={() => setActiveModule('orders')}
            className="px-3 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-semibold rounded hover:bg-stone-50 transition-colors"
          >
            Manage Orders
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-white p-5 rounded border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Gross Sales</span>
            <IndianRupee className="w-4 h-4 text-[#0D3B2E]" />
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 tabular-nums">
            {formatINR(analytics.grossRevenue)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Avg Order Value: {formatINR(analytics.avgOrderValue)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#0D3B2E]" />
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 tabular-nums">
            {analytics.totalOrdersCount}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Processed via Razorpay & COD</p>
        </div>

        {/* Active Customers */}
        <div className="bg-white p-5 rounded border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Active Customers</span>
            <Users className="w-4 h-4 text-[#0D3B2E]" />
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 tabular-nums">
            {analytics.activeCustomersCount}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Registered Indian golf players</p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-5 rounded border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Inventory Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2 tabular-nums">
            {analytics.lowStockCount} items
          </p>
          <button
            onClick={() => setActiveModule('inventory')}
            className="text-[11px] text-amber-800 hover:underline font-medium mt-1 block"
          >
            Review inventory re-orders →
          </button>
        </div>
      </div>

      {/* Two Column Grid: Low Stock Alert List & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif-display font-bold text-base text-stone-900">Recent Customer Orders</h3>
              <p className="text-xs text-stone-500">Live order stream awaiting fulfillment.</p>
            </div>
            <button
              onClick={() => setActiveModule('orders')}
              className="text-xs text-[#0D3B2E] font-semibold hover:underline"
            >
              View All Orders →
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {analytics.recentOrders && analytics.recentOrders.length > 0 ? (
              analytics.recentOrders.map((ord: any) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500">{ord.shippingAddress?.fullName}</span>
                      <span className="text-stone-400">·</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.orderStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>
                    <p className="text-stone-400 text-[11px] mt-0.5 font-mono">
                      AWB: {ord.shiprocketAwb || 'Pending Assignment'} · {ord.shippingAddress?.city}
                    </p>
                  </div>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {formatINR(ord.totalAmount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">No orders yet.</p>
            )}
          </div>
        </div>

        {/* Low Stock Items & Quick Replenish (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif-display font-bold text-base text-stone-900">Low Stock Warnings</h3>
              <p className="text-xs text-stone-500">Products with inventory below threshold (≤ 10 units).</p>
            </div>
            <button
              onClick={() => setActiveModule('inventory')}
              className="text-xs text-[#0D3B2E] font-semibold hover:underline"
            >
              Update Stock →
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {analytics.lowStockItems && analytics.lowStockItems.length > 0 ? (
              analytics.lowStockItems.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-stone-900 line-clamp-1">{item.name}</p>
                    <p className="text-stone-400 text-[11px] font-mono">SKU: {item.sku}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded border border-amber-200 tabular-nums">
                    {item.stock} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-700 py-4 text-center">All inventory levels healthy.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
