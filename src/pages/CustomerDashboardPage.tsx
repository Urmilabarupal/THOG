/**
 * @file src/pages/CustomerDashboardPage.tsx
 * @purpose Customer portal overview displaying account statistics, recent orders, and address book.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Provides personalized overview for logged-in golfers with quick access to orders and fittings.
 */

import React, { useState, useEffect } from 'react';
import { Package, Heart, MapPin, Award, ArrowRight, Truck, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Order } from '../types/index.ts';

export const CustomerDashboardPage: React.FC = () => {
  const { user, wishlist, navigate, formatINR } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(user?.email || 'sandeepaliens01@gmail.com')}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data || []);
        }
      } catch (err) {
        console.warn('Could not fetch user orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerOrders();
  }, [user?.email]);

  const totalSpent = orders.reduce((sum, o) => (o.paymentStatus === 'paid' ? sum + o.totalAmount : sum), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Card */}
      <div className="bg-[#0D3B2E] text-white p-6 sm:p-8 rounded-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A880] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#C5A880]" />
            <span>The House of Gaunt Club · VIP Member</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold">
            Welcome back, {user ? user.fullName : 'Guest Golfer'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            {user?.email} · Bangalore Fitting Hub Registered
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('order-tracking')}
            className="px-4 py-2 bg-white text-[#0D3B2E] text-xs font-semibold rounded hover:bg-stone-100 transition-colors flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Active Shiprocket Parcel</span>
          </button>
          <button
            onClick={() => navigate('shop')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded border border-white/20 transition-colors"
          >
            Explore New Arrivals
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="bg-white p-5 rounded border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase">Total Orders</span>
            <Package className="w-4 h-4 text-[#0D3B2E]" />
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 tabular-nums">{orders.length}</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Tour gear delivered across India</p>
        </div>

        <div className="bg-white p-5 rounded border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase">Total Investment</span>
            <Award className="w-4 h-4 text-[#0D3B2E]" />
          </div>
          <p className="text-2xl font-bold text-[#0D3B2E] mt-2 tabular-nums">{formatINR(totalSpent)}</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Verified authentic purchases</p>
        </div>

        <div className="bg-white p-5 rounded border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase">Saved in Wishlist</span>
            <Heart className="w-4 h-4 text-[#0D3B2E]" />
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 tabular-nums">{wishlist.length}</p>
          <button
            onClick={() => navigate('wishlist')}
            className="text-[11px] text-[#0D3B2E] hover:underline font-medium mt-0.5 block"
          >
            View saved equipment →
          </button>
        </div>

        <div className="bg-white p-5 rounded border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase">Fitting Status</span>
            <Clock className="w-4 h-4 text-[#0D3B2E]" />
          </div>
          <p className="text-sm font-bold text-emerald-800 mt-2">Calibrated · Active</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Bangalore Studio TrackMan 4 Record</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-stone-200 rounded p-6 mb-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-serif-display font-bold text-stone-900">Recent Equipment Orders</h2>
            <p className="text-xs text-stone-500">Track shipments and print GST compliant tax invoices.</p>
          </div>
          <button
            onClick={() => navigate('my-orders')}
            className="text-xs font-semibold text-[#0D3B2E] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <p className="text-xs text-stone-400 py-6 text-center">Loading order history...</p>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center text-xs text-stone-500">
            <p>You have not placed any orders yet.</p>
            <button
              onClick={() => navigate('shop')}
              className="mt-3 px-4 py-2 bg-[#0D3B2E] text-white rounded font-medium"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-stone-900">{order.orderNumber}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                    <span className="text-stone-400">·</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-stone-500 mt-1">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}:{' '}
                    {order.items.map((i) => i.productName).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold text-stone-900 tabular-nums text-sm">
                    {formatINR(order.totalAmount)}
                  </span>
                  <button
                    onClick={() => navigate('order-tracking')}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-medium flex items-center gap-1"
                  >
                    <Truck className="w-3 h-3" />
                    <span>Track</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Delivery Addresses */}
      <div className="bg-white border border-stone-200 rounded p-6">
        <h2 className="text-lg font-serif-display font-bold text-stone-900 mb-1">
          Registered Delivery Addresses
        </h2>
        <p className="text-xs text-stone-500 mb-4">Default delivery locations for Shiprocket automated dispatch.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 border border-emerald-300 bg-emerald-50/30 rounded relative">
            <span className="text-[10px] font-bold uppercase text-[#0D3B2E] tracking-wider block mb-1">
              Primary Residential Villa
            </span>
            <p className="font-semibold text-stone-900">{user?.fullName || 'Sandeep Rao'}</p>
            <p className="text-stone-600 mt-0.5">42, Prestige Golfshire Villa 18, Nandi Hills Road</p>
            <p className="text-stone-600">Bangalore, Karnataka - 562110, India</p>
            <p className="text-stone-500 mt-1">Phone: {user?.phone || '+91 98450 12345'}</p>
          </div>

          <div className="p-4 border border-dashed border-stone-300 rounded flex flex-col items-center justify-center text-center text-stone-400 py-6">
            <MapPin className="w-6 h-6 mb-1 text-stone-300" />
            <p className="font-medium text-stone-600">Add Club / Office Address</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Store multiple clubhouse or corporate addresses</p>
          </div>
        </div>
      </div>
    </div>
  );
};
