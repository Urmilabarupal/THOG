/**
 * @file src/components/CartDrawer.tsx
 * @purpose Slide-over cart drawer providing quick cart adjustments and instant checkout routing.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Features quantity steppers, free shipping threshold progress,
 * coupon code redemption, itemized price calculations in INR ₹, and checkout affordances.
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    formatINR,
    navigate,
    settings
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeThreshold = settings?.freeShippingThreshold || 5000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));
  const amountToFree = Math.max(0, freeThreshold - cartSubtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setIsApplying(true);
    const result = await applyCouponCode(couponInput.trim());
    setIsApplying(false);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
            <div>
              <h2 className="text-base font-serif-display font-semibold text-stone-900">
                Your Golf Bag ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h2>
              <p className="text-xs text-stone-500">Shipped with Shiprocket Air Express</p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-[#0D3B2E] font-medium mb-1.5">
              <Truck className="w-4 h-4 text-[#0D3B2E]" />
              {amountToFree === 0 ? (
                <span>You unlocked <strong>Free Air Express Shipping</strong> across India!</span>
              ) : (
                <span>Add <strong>{formatINR(amountToFree)}</strong> more for free express shipping.</span>
              )}
            </div>
            <div className="w-full bg-emerald-200/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0D3B2E] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-4">
                  <Truck className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-sm font-semibold text-stone-900">Your bag is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Explore our tour-grade drivers, handcrafted leather bags, and forged iron sets.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('shop');
                  }}
                  className="mt-5 px-5 py-2.5 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-colors"
                >
                  Explore Equipment
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <img
                    src={item.product.images[0] || '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 object-cover bg-stone-100 rounded border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate('product-detail', { productId: item.product.id });
                          }}
                          className="text-xs font-semibold text-stone-900 hover:text-[#0D3B2E] line-clamp-1 cursor-pointer"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variant && (
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Variant: {item.variant.name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-stone-200 rounded">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium tabular-nums text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-stone-900 tabular-nums">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="border-t border-stone-200 px-6 py-5 bg-stone-50/70 space-y-4">
              {/* Coupon input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatINR(appliedCoupon.discountAmount)})</span>
                  </div>
                  <button
                    onClick={removeCouponCode}
                    className="text-rose-600 hover:underline text-[11px] font-medium"
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
                      placeholder="Try code: FAIRWAY10 or EAGLE2000"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded transition-colors disabled:opacity-50"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                </form>
              )}

              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="tabular-nums font-medium text-stone-900">{formatINR(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promotional Discount</span>
                    <span className="tabular-nums font-medium">-{formatINR(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>Shipping (Shiprocket Air)</span>
                  <span>{amountToFree === 0 ? 'FREE' : formatINR(settings?.standardShippingFee || 350)}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-semibold text-stone-900">
                  <span>Estimated Total</span>
                  <span className="text-[#0D3B2E] tabular-nums font-bold">
                    {formatINR(cartTotal + (amountToFree === 0 ? 0 : (settings?.standardShippingFee || 350)))}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">Includes 18% GST (Applicable Indian Sports Tax).</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('checkout');
                  }}
                  className="w-full py-3 bg-[#0D3B2E] hover:bg-[#092b21] text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Indian Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('cart');
                  }}
                  className="w-full py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium rounded transition-colors text-center"
                >
                  View Full Cart & Shipping Estimator
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
