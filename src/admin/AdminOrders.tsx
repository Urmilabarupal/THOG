/**
 * @file src/admin/AdminOrders.tsx
 * @purpose Admin Order Management module for lifecycle progression, Shiprocket AWB assignment, and status updates.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts.
 * @implementation Features status transitions (Pending/Processing/Shipped/Delivered), airway bill assignment,
 * and live tracking event logging.
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, Eye, X, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Order } from '../types/index.ts';

export const AdminOrders: React.FC = () => {
  const { formatINR, showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['orderStatus']>('processing');
  const [newAwb, setNewAwb] = useState('');
  const [trackingNote, setTrackingNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.data || []);
      })
      .catch((e) => console.warn(e));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderModal = (o: Order) => {
    setSelectedOrder(o);
    setNewStatus(o.orderStatus);
    setNewAwb(o.shiprocketAwb || `SR-IN-${Math.floor(100000000 + Math.random() * 900000000)}`);
    setTrackingNote('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          awb: newAwb.trim(),
          note: trackingNote.trim() || `Order status updated to ${newStatus.toUpperCase()}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Order ${selectedOrder.orderNumber} updated to ${newStatus}.`);
        setSelectedOrder(null);
        fetchOrders();
      } else {
        showToast(data.error || 'Failed to update order.', 'error');
      }
    } catch {
      showToast('Error updating order.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Order Fulfillment</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Order Management ({orders.length} Orders)
        </h1>
        <p className="text-xs text-stone-500">Manage order statuses and generate Shiprocket airway bills.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Order ID & Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Items Count</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Shiprocket AWB</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-stone-50/70">
                <td className="py-3 px-4">
                  <p className="font-mono font-bold text-stone-900">{o.orderNumber}</p>
                  <p className="text-[11px] text-stone-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                </td>

                <td className="py-3 px-4">
                  <p className="font-semibold text-stone-900">{o.shippingAddress?.fullName}</p>
                  <p className="text-[11px] text-stone-400">{o.customerEmail}</p>
                </td>

                <td className="py-3 px-4 text-stone-600">
                  {o.shippingAddress?.city}, {o.shippingAddress?.state}
                </td>

                <td className="py-3 px-4 tabular-nums font-medium text-stone-800">
                  {o.items.length} items
                </td>

                <td className="py-3 px-4 tabular-nums font-bold text-stone-900">
                  {formatINR(o.totalAmount)}
                </td>

                <td className="py-3 px-4 font-mono text-[11px]">
                  {o.shiprocketAwb ? (
                    <span className="text-[#0D3B2E] font-semibold">{o.shiprocketAwb}</span>
                  ) : (
                    <span className="text-stone-400 italic">Unassigned</span>
                  )}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      o.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : o.orderStatus === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {o.orderStatus}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => openOrderModal(o)}
                    className="px-3 py-1 bg-stone-100 hover:bg-[#0D3B2E] hover:text-white rounded font-medium text-xs transition-colors"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded shadow-2xl p-6 sm:p-8 space-y-5 text-xs text-stone-700">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#0D3B2E]">Shiprocket Fulfillment Hub</span>
                <h3 className="text-lg font-serif-display font-bold text-stone-900">
                  Manage Order: {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Update Order Lifecycle Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing (Custom Assembly & Loft Check)</option>
                  <option value="shipped">Shipped (Handed Over to Shiprocket Air)</option>
                  <option value="delivered">Delivered to Customer Doorstep</option>
                  <option value="cancelled">Cancelled & Payment Reversal</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Shiprocket Airway Bill (AWB)</label>
                <input
                  type="text"
                  value={newAwb}
                  onChange={(e) => setNewAwb(e.target.value)}
                  placeholder="e.g. SR-IN-981273910"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Tracking Log Note</label>
                <input
                  type="text"
                  value={trackingNote}
                  onChange={(e) => setTrackingNote(e.target.value)}
                  placeholder="e.g. Club loft checked, packed in dual-walled flight box."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                />
              </div>

              <div className="border-t border-stone-200 pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Save Order Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
