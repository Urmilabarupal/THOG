/**
 * @file src/pages/OrderConfirmationPage.tsx
 * @purpose Post-checkout celebration view displaying order receipt, Shiprocket AWB, and tax invoice options.
 * @dependencies canvas-confetti, lucide-react, ../context/StoreContext.tsx.
 * @implementation Fires confetti upon mount, renders itemized order receipt, and links directly
 * to live Shiprocket tracking.
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Truck, Download, ArrowRight, Printer, MapPin, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const OrderConfirmationPage: React.FC = () => {
  const { lastPlacedOrder, navigate, formatINR } = useStore();

  useEffect(() => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti animation:', e);
    }
  }, []);

  const order = lastPlacedOrder || {
    id: 'ord-mock',
    orderNumber: 'CCDL-2026-1042',
    customerEmail: 'sandeepaliens01@gmail.com',
    customerPhone: '+91 98450 12345',
    shippingAddress: {
      fullName: 'Sandeep Rao',
      email: 'sandeepaliens01@gmail.com',
      phone: '+91 98450 12345',
      streetAddress: '42, Prestige Golfshire Villa 18',
      apartment: 'Nandi Hills Road',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '562110',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'CCDL Aurum Titanium EVO 9.0° Driver',
        sku: 'CCDL-DRV-AURUM9-ST',
        quantity: 1,
        price: 48999,
        image: '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'
      }
    ],
    subtotal: 48999,
    discountAmount: 0,
    shippingFee: 0,
    taxAmount: 8820,
    totalAmount: 57819,
    paymentMethod: 'razorpay' as const,
    paymentStatus: 'paid' as const,
    orderStatus: 'processing' as const,
    shiprocketAwb: 'SR-IN-981273910',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trackingHistory: []
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Celebration Header */}
      <div className="text-center space-y-3 pb-8 border-b border-stone-200">
        <div className="w-16 h-16 bg-emerald-100 text-[#0D3B2E] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#0D3B2E]">
          Order Confirmed & Payment Verified
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900">
          Thank you for choosing The House of Gaunt.
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
          Your order has been transmitted to our Bangalore fitting facility. An electronic tax invoice and dispatch updates have been emailed to <strong>{order.customerEmail}</strong>.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <div className="px-3.5 py-1.5 bg-stone-100 text-stone-800 text-xs rounded font-mono font-medium">
            Order Reference: <strong className="text-[#0D3B2E]">{order.orderNumber}</strong>
          </div>
          {order.shiprocketAwb && (
            <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-900 text-xs rounded font-mono font-medium border border-emerald-200">
              Shiprocket AWB: <strong>{order.shiprocketAwb}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="mt-8 bg-white border border-stone-200 rounded p-6 sm:p-8 space-y-8">
        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600 border-b border-stone-100 pb-6">
          <div>
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0D3B2E]" />
              <span>Ship To Address</span>
            </h4>
            <p className="font-medium text-stone-800">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.streetAddress}</p>
            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#0D3B2E]" />
              <span>Logistics & Settlement</span>
            </h4>
            <p>Courier: <strong>Shiprocket Air Express (BlueDart / Delhivery)</strong></p>
            <p>Payment: <strong className="uppercase">{order.paymentMethod}</strong> ({order.paymentStatus === 'paid' ? 'Paid Online' : 'Pay on Delivery'})</p>
            <p>Estimated Doorstep Delivery: <strong>2-3 Business Days</strong></p>
            <p className="text-[11px] text-stone-400 mt-1">Status: Calibration & Protective Packaging</p>
          </div>
        </div>

        {/* Itemized Order Items */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            Ordered Equipment ({order.items.length})
          </h4>

          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded border border-stone-200"
                  />
                  <div>
                    <p className="font-semibold text-stone-900">{item.productName}</p>
                    <p className="text-stone-500 text-[11px]">Qty: {item.quantity} · SKU: {item.sku}</p>
                  </div>
                </div>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Final Financial Breakdown */}
        <div className="border-t border-stone-100 pt-4 max-w-xs ml-auto space-y-1.5 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium text-stone-900">{formatINR(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Coupon Discount</span>
              <span className="tabular-nums font-semibold">-{formatINR(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>18% GST (Indian Tax)</span>
            <span className="tabular-nums font-medium text-stone-900">{formatINR(order.taxAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Air Express Shipping</span>
            <span className="tabular-nums font-medium">{order.shippingFee === 0 ? 'FREE' : formatINR(order.shippingFee)}</span>
          </div>
          <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
            <span>Amount Paid</span>
            <span className="text-[#0D3B2E] tabular-nums">{formatINR(order.totalAmount)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-stone-200 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <button
              onClick={() => navigate('order-tracking')}
              className="px-4 py-2.5 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-colors flex items-center gap-2"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track with Shiprocket</span>
            </button>
            <button
              onClick={handlePrintReceipt}
              className="px-4 py-2.5 bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
          </div>

          <button
            onClick={() => navigate('shop')}
            className="text-xs font-semibold text-[#0D3B2E] hover:underline flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
