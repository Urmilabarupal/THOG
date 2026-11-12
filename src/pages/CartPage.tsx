/**
 * @file src/pages/CartPage.tsx
 * @purpose Full Shopping Cart page with itemized inventory, Shiprocket PIN calculator, and coupon redemption.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Displays detailed line items, live Indian PIN shipping calculations, GST tax breakdowns,
 * and seamless transition into the checkout funnel.
 */

import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, Truck, Tag, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    formatINR,
    navigate,
    settings
  } = useStore();

  const [pinInput, setPinInput] = useState('560001'); // Default Bangalore PIN
  const [shippingResult, setShippingResult] = useState<{
    region: string;
    estimatedDelivery: string;
    isFreeShipping: boolean;
    standardFee: number;
    courierPartner: string;
  } | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const freeThreshold = settings?.freeShippingThreshold || 5000;
  const isEligibleForFreeShipping = cartSubtotal >= freeThreshold;

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setShippingError('');
    setIsCalculatingShipping(true);
    try {
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postalCode: pinInput.trim(), cartSubtotal })
      });
      const data = await res.json();
      if (res.ok) {
        setShippingResult(data.data);
      } else {
        setShippingError(data.error || 'Invalid Indian PIN code.');
      }
    } catch {
      setShippingError('Failed to calculate shipping rates.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setIsApplyingCoupon(true);
    const result = await applyCouponCode(couponInput.trim());
    setIsApplyingCoupon(false);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-4">
          <Truck className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900">Your Golf Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto">
          Equip yourself with tour-validated clubs, handmade leather staff bags, and precision accessories.
        </p>
        <button
          onClick={() => navigate('shop')}
          className="mt-6 px-6 py-3 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-colors inline-flex items-center gap-2"
        >
          <span>Explore Equipment Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const shippingCost = isEligibleForFreeShipping ? 0 : (shippingResult ? shippingResult.standardFee : (settings?.standardShippingFee || 350));
  const finalPayable = cartTotal + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('shop')}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900">
            Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:underline font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Line Items Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded divide-y divide-stone-100">
          <div className="hidden sm:grid sm:grid-cols-12 px-6 py-3 bg-stone-50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            <span className="sm:col-span-6">Product</span>
            <span className="sm:col-span-2 text-center">Quantity</span>
            <span className="sm:col-span-2 text-right">Price</span>
            <span className="sm:col-span-2 text-right">Total</span>
          </div>

          {cart.map((item) => (
            <div key={item.id} className="p-6 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 flex flex-col gap-4">
              {/* Product Info */}
              <div className="sm:col-span-6 flex gap-4 items-center">
                <img
                  src={item.product.images[0] || '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 object-cover rounded border border-stone-200 shrink-0 bg-stone-100"
                />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400">{item.product.brand}</span>
                  <h3
                    onClick={() => navigate('product-detail', { productId: item.product.id })}
                    className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-[#0D3B2E] cursor-pointer"
                  >
                    {item.product.name}
                  </h3>
                  {item.variant && (
                    <p className="text-[11px] text-stone-500 mt-0.5">Configuration: {item.variant.name}</p>
                  )}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-rose-600 text-xs flex items-center gap-1 mt-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="sm:col-span-2 flex justify-start sm:justify-center">
                <div className="flex items-center border border-stone-200 rounded">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-stone-600 hover:bg-stone-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-xs font-semibold tabular-nums text-stone-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-stone-600 hover:bg-stone-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Unit Price */}
              <div className="sm:col-span-2 text-left sm:text-right text-xs text-stone-600 tabular-nums font-medium">
                <span className="sm:hidden text-stone-400 mr-1">Unit:</span>
                {formatINR(item.price)}
              </div>

              {/* Subtotal */}
              <div className="sm:col-span-2 text-left sm:text-right text-xs sm:text-sm font-semibold text-stone-900 tabular-nums">
                <span className="sm:hidden text-stone-400 mr-1">Total:</span>
                {formatINR(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Summary & Estimator (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Indian PIN Code Shipping Estimator */}
          <div className="bg-white p-5 rounded border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 uppercase tracking-wider">
              <Truck className="w-4 h-4 text-[#0D3B2E]" />
              <span>Shiprocket Rate Estimator</span>
            </div>
            <p className="text-xs text-stone-500">Calculate doorstep air express transit time by 6-digit Indian PIN code.</p>

            <form onSubmit={handleCalculateShipping} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 560001 or 110001"
                className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              />
              <button
                type="submit"
                disabled={isCalculatingShipping}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded disabled:opacity-50"
              >
                {isCalculatingShipping ? '...' : 'Check'}
              </button>
            </form>

            {shippingError && <p className="text-[11px] text-rose-600">{shippingError}</p>}

            {shippingResult && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-xs space-y-1 text-emerald-900">
                <p className="font-semibold">{shippingResult.region}</p>
                <p className="text-[11px]">Estimated Transit: {shippingResult.estimatedDelivery}</p>
                <p className="text-[11px] text-stone-500">Courier: {shippingResult.courierPartner}</p>
                <p className="font-medium pt-1 text-[#0D3B2E]">
                  Rate: {shippingResult.isFreeShipping ? 'FREE (Threshold met)' : formatINR(shippingResult.standardFee)}
                </p>
              </div>
            )}
          </div>

          {/* Coupon Code Box */}
          <div className="bg-white p-5 rounded border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 uppercase tracking-wider">
              <Tag className="w-4 h-4 text-[#0D3B2E]" />
              <span>Promotional Discount Voucher</span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded border border-emerald-200 text-xs text-emerald-800">
                <div>
                  <p className="font-semibold">{appliedCoupon.code}</p>
                  <p className="text-[11px] text-stone-500">{appliedCoupon.description}</p>
                </div>
                <button
                  onClick={removeCouponCode}
                  className="text-rose-600 hover:underline text-xs font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter FAIRWAY10 or EAGLE2000"
                    className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="px-3 py-1.5 bg-stone-800 text-white text-xs font-semibold rounded hover:bg-stone-900 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
              </form>
            )}
          </div>

          {/* Final Financial Summary */}
          <div className="bg-white p-6 rounded border border-stone-200 space-y-3">
            <h3 className="text-sm font-semibold text-stone-900 border-b border-stone-100 pb-3">
              Order Financial Summary
            </h3>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Equipment Subtotal</span>
                <span className="tabular-nums font-medium text-stone-900">{formatINR(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="tabular-nums font-semibold">-{formatINR(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Applicable GST (18%)</span>
                <span className="tabular-nums font-medium text-stone-900">{formatINR(cartTax)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shiprocket Air Logistics</span>
                <span className="tabular-nums font-medium">
                  {shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : formatINR(shippingCost)}
                </span>
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-[#0D3B2E] tabular-nums">{formatINR(finalPayable)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('checkout')}
              className="w-full py-3 mt-4 bg-[#0D3B2E] hover:bg-[#092b21] text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Secure Indian Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>Razorpay 256-bit SSL Encrypted Transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
