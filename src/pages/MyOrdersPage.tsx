/**
 * @file src/pages/MyOrdersPage.tsx
 * @purpose Customer Order History page with line item breakdowns and printable GST tax invoices.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts.
 * @implementation Displays past orders, payment confirmations, Shiprocket AWB references, and invoice modals.
 */

import React, { useState, useEffect } from 'react';
import { Package, Truck, Printer, Eye, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Order } from '../types/index.ts';

export const MyOrdersPage: React.FC = () => {
  const { user, navigate, formatINR } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders?email=${encodeURIComponent(user?.email || 'sandeepaliens01@gmail.com')}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data || []);
        }
      })
      .catch((e) => console.warn(e))
      .finally(() => setIsLoading(false));
  }, [user?.email]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <button
          onClick={() => navigate('customer-dashboard')}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900">
          My Equipment Orders & Tax Invoices
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review past purchases, download GST invoices, and track live Shiprocket dispatches.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-stone-400">Loading your purchase records...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded p-12 text-center max-w-md mx-auto">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-900">No Orders Placed Yet</h3>
          <p className="text-xs text-stone-500 mt-1">
            When you purchase golf gear, your order details and invoices will appear here.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="mt-4 px-4 py-2 bg-[#0D3B2E] text-white text-xs font-semibold rounded"
          >
            Explore Equipment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-stone-200 rounded p-6 shadow-xs space-y-4">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-sm">{order.orderNumber}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="text-stone-400">·</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  {order.shiprocketAwb && (
                    <p className="text-[11px] text-stone-500 mt-1 font-mono">
                      Shiprocket AWB: <strong className="text-stone-800">{order.shiprocketAwb}</strong>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('order-tracking')}
                    className="px-3 py-1.5 bg-[#0D3B2E] text-white rounded text-xs font-semibold flex items-center gap-1.5 hover:bg-[#092b21] transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Shipment</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Invoice</span>
                  </button>
                </div>
              </div>

              {/* Items in this order */}
              <div className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded border border-stone-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-stone-900">{item.productName}</h4>
                        <p className="text-[11px] text-stone-500">
                          Qty: {item.quantity} · SKU: {item.sku} {item.variantName ? `· ${item.variantName}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-stone-900 tabular-nums">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t border-stone-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2">
                <p>
                  Delivery to: <strong>{order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.postalCode})</strong>
                </p>
                <div className="flex items-center gap-4 text-stone-800">
                  <span>Payment: <strong className="uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})</span>
                  <span>Total Paid: <strong className="text-[#0D3B2E] font-bold text-sm tabular-nums">{formatINR(order.totalAmount)}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded shadow-2xl p-8 space-y-6 text-xs text-stone-700">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D3B2E]">Tax Invoice / Bill of Supply</span>
                <h2 className="text-xl font-serif-display font-bold text-stone-900 mt-1">The House of Gaunt</h2>
                <p className="text-[11px] text-stone-500">Climate Change Digital Labs Pvt Ltd · GSTIN: 29AAACC1234F1Z8</p>
              </div>
              <div className="text-right font-mono">
                <p className="font-bold text-stone-900">{selectedOrder.orderNumber}</p>
                <p className="text-[11px] text-stone-500">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Billing & Shipping Details */}
            <div className="grid grid-cols-2 gap-6 border-b border-stone-200 pb-4">
              <div>
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider mb-1">Customer & Delivery:</h4>
                <p className="font-medium text-stone-800">{selectedOrder.shippingAddress.fullName}</p>
                <p>{selectedOrder.shippingAddress.streetAddress}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}</p>
                <p>Phone: {selectedOrder.shippingAddress.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider mb-1">Logistics & Settlement:</h4>
                <p>Logistics: Shiprocket Air Express</p>
                <p>AWB Number: {selectedOrder.shiprocketAwb || 'SR-PENDING'}</p>
                <p>Payment: {selectedOrder.paymentMethod.toUpperCase()} (Verified)</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <table className="w-full text-left">
                <thead className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {selectedOrder.items.map((i, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium text-stone-900">
                        {i.productName}
                        <span className="block text-[10px] text-stone-400 font-mono">SKU: {i.sku}</span>
                      </td>
                      <td className="py-2.5 text-center tabular-nums">{i.quantity}</td>
                      <td className="py-2.5 text-right tabular-nums">{formatINR(i.price)}</td>
                      <td className="py-2.5 text-right tabular-nums font-semibold">{formatINR(i.price * i.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial summary */}
            <div className="border-t border-stone-200 pt-3 max-w-xs ml-auto space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatINR(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatINR(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="tabular-nums">{formatINR(selectedOrder.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="tabular-nums">{selectedOrder.shippingFee === 0 ? 'FREE' : formatINR(selectedOrder.shippingFee)}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900 text-sm">
                <span>Total Amount Paid</span>
                <span className="text-[#0D3B2E] tabular-nums">{formatINR(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-stone-200 pt-4 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-900 text-white rounded font-semibold flex items-center gap-1.5 hover:bg-black"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded hover:bg-stone-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
