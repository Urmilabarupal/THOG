/**
 * @file src/pages/ProductDetailPage.tsx
 * @purpose Product Detail Page (PDP) with contiguous purchase module, variant selection, and live reviews.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts, ../components/ProductCard.tsx.
 * @implementation Features sticky image gallery, contiguous purchase panel, variant selector,
 * full specifications table, related equipment recommendations, and review submission.
 */

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Truck, RotateCcw, Heart, BarChart3, Plus, Minus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Product, ProductVariant, ProductReview } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';

export const ProductDetailPage: React.FC = () => {
  const {
    activeProductId,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    compareList,
    formatINR,
    navigate,
    showToast
  } = useStore();

  const product = products.find((p) => p.id === activeProductId) || products[0];

  const [selectedImage, setSelectedImage] = useState<string>(product?.images[0] || '');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'shipping'>('specs');

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([]);

  // Update selected image and variant when active product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg');
      setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
      setQuantity(1);

      // Fetch reviews
      fetch(`/api/products/${product.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.reviews) {
            setReviewsList(data.data.reviews);
          }
        })
        .catch((e) => console.warn('Could not fetch reviews:', e));
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500">Product not found.</p>
        <button
          onClick={() => navigate('shop')}
          className="mt-4 px-4 py-2 bg-[#0D3B2E] text-white text-xs font-semibold rounded"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const effectivePrice = selectedVariant
    ? (selectedVariant.salePrice || selectedVariant.price)
    : (product.salePrice || product.regularPrice);
  const regularPrice = selectedVariant ? selectedVariant.price : product.regularPrice;
  const hasDiscount = effectivePrice < regularPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stockQuantity;
  const isWishlisted = isInWishlist(product.id);
  const isCompared = compareList.some((p) => p.id === product.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please provide your name and review remarks.', 'error');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: reviewName.trim(),
          rating: reviewRating,
          title: reviewTitle.trim() || 'Verified Purchase',
          comment: reviewComment.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setReviewsList((prev) => [data.data, ...prev]);
        showToast('Review submitted successfully! Thank you.');
        setReviewName('');
        setReviewTitle('');
        setReviewComment('');
      } else {
        showToast(data.error || 'Failed to submit review.', 'error');
      }
    } catch {
      showToast('Error submitting review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button & breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-8">
        <button
          onClick={() => navigate('shop')}
          className="hover:text-stone-900 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>
        <span>/</span>
        <span className="capitalize">{product.category.replace('-', ' ')}</span>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Contiguous PDP Grid: Gallery Left, Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Gallery (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-stone-100/80 rounded border border-stone-200 overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-white/95 text-stone-900 text-xs font-semibold px-2.5 py-1 shadow-sm border border-stone-200">
                Save {formatINR(regularPrice - effectivePrice)}
              </span>
            )}
          </div>

          {/* Multiple Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 aspect-square rounded border overflow-hidden ${
                    selectedImage === img ? 'border-[#0D3B2E] ring-1 ring-[#0D3B2E]' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Contiguous Purchase Module (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded border border-stone-200 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 tracking-wide mb-1.5 uppercase font-medium">
              <span>{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{product.category.replace('-', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">SKU: {selectedVariant?.sku || product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-2 mt-2.5 text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-stone-800">{product.rating.toFixed(1)}</span>
              <span className="text-stone-400">·</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-[#0D3B2E] hover:underline font-medium"
              >
                {reviewsList.length || product.reviewCount} verified reviews
              </button>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="border-t border-b border-stone-100 py-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-[#0D3B2E] tabular-nums">
              {formatINR(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-stone-400 line-through tabular-nums">
                {formatINR(regularPrice)}
              </span>
            )}
            <span className="text-xs text-stone-500">
              (Includes 18% GST · Free Pan-India Air Express)
            </span>
          </div>

          {/* Description Excerpt */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                Select Configuration / Variant
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 text-left border rounded text-xs transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[#0D3B2E] bg-emerald-50/50 text-[#0D3B2E] font-semibold ring-1 ring-[#0D3B2E]'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <p className="font-medium truncate">{v.name}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5 tabular-nums">
                      {formatINR(v.salePrice || v.price)} · {v.stock > 0 ? `${v.stock} in stock` : 'Sold out'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                currentStock > 5 ? 'bg-emerald-600' : currentStock > 0 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
            />
            <span className="font-medium text-stone-700">
              {currentStock > 5
                ? 'In Stock · Ready for Immediate Shiprocket Dispatch'
                : currentStock > 0
                ? `Only ${currentStock} left in stock - Order promptly`
                : 'Backorder Available (3-5 Days Calibrated Assembly)'}
            </span>
          </div>

          {/* Quantity Stepper & Buy CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-600 hover:bg-stone-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold tabular-nums text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-600 hover:bg-stone-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, selectedVariant, quantity)}
                className="flex-1 py-3 bg-[#0D3B2E] hover:bg-[#092b21] text-white text-xs font-semibold rounded shadow-sm transition-colors text-center"
              >
                Add to Golf Bag ({formatINR(effectivePrice * quantity)})
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, selectedVariant, quantity);
                navigate('checkout');
              }}
              className="w-full py-3 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded transition-colors text-center"
            >
              Instant Indian Checkout (Razorpay / UPI)
            </button>

            {/* Wishlist & Compare toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => toggleWishlist(product)}
                className={`py-2 px-3 border rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  isWishlisted
                    ? 'border-[#0D3B2E] bg-emerald-50 text-[#0D3B2E]'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => addToCompare(product)}
                className={`py-2 px-3 border rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  isCompared
                    ? 'border-stone-800 bg-stone-800 text-white'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{isCompared ? 'In Compare List' : 'Compare Specs'}</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0D3B2E]" />
              <span>100% Genuine Tour Gear · Serial Registered</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0D3B2E]" />
              <span>Complimentary Shiprocket Air Express (2-4 Days Delivery)</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#0D3B2E]" />
              <span>14-Day Hassle-Free Returns & Calibrated Refitting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications, Reviews, Shipping Details */}
      <div className="mt-16 border-t border-stone-200 pt-8">
        <div className="flex gap-8 border-b border-stone-200 text-sm font-semibold mb-8">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-[#0D3B2E] text-[#0D3B2E]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Technical Specifications ({product.specifications?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-[#0D3B2E] text-[#0D3B2E]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Customer Reviews ({reviewsList.length || product.reviewCount})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'shipping'
                ? 'border-[#0D3B2E] text-[#0D3B2E]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Delivery & Fitting Policy
          </button>
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div className="max-w-3xl">
            <dl className="divide-y divide-stone-200 border-t border-b border-stone-200">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, i) => (
                  <div key={i} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 text-xs sm:text-sm">
                    <dt className="font-semibold text-stone-700">{spec.label}</dt>
                    <dd className="mt-1 sm:mt-0 sm:col-span-2 text-stone-900 font-mono">{spec.value}</dd>
                  </div>
                ))
              ) : (
                <div className="py-3 text-xs text-stone-500">Standard OEM tournament specifications.</div>
              )}
            </dl>
          </div>
        )}

        {/* Tab 2: Customer Reviews & Submission Form */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Reviews List (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-base font-serif-display font-bold text-stone-900">
                Verified Customer Feedback
              </h3>

              {reviewsList.length === 0 ? (
                <p className="text-xs text-stone-500">No reviews yet. Be the first to review this tour equipment!</p>
              ) : (
                <div className="space-y-4">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-4 bg-white border border-stone-200 rounded text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-stone-400 text-[11px]">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <h4 className="font-semibold text-stone-900">{rev.title}</h4>
                      <p className="text-stone-600 leading-relaxed">{rev.comment}</p>
                      <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-medium pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{rev.customerName} · Verified Player</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review (5 cols) */}
            <div className="lg:col-span-5 bg-stone-50 p-6 rounded border border-stone-200">
              <h3 className="text-sm font-semibold text-stone-900 mb-1">Share Your Review</h3>
              <p className="text-xs text-stone-500 mb-4">Help fellow Indian golfers choose the right setup.</p>

              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Star Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  >
                    <option value={5}>5 Stars - Outstanding Tour Performance</option>
                    <option value={4}>4 Stars - Very Good Feel & Distance</option>
                    <option value={3}>3 Stars - Average Quality</option>
                    <option value={2}>2 Stars - Needs Improvement</option>
                    <option value={1}>1 Star - Disappointed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Review Headline</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Crisp launch angle and solid acoustics"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Detailed Feedback</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe trajectory, shaft response, acoustic sound, and feel off the face..."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-2.5 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Submitting Review...' : 'Publish Customer Review'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Delivery & Fitting Policy */}
        {activeTab === 'shipping' && (
          <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <h3 className="font-semibold text-stone-900 text-base">Pan-India Shiprocket Air Express Dispatch</h3>
            <p>
              All golf equipment orders dispatched from our Bengaluru Central Logistics Hub are cushioned in heavy-duty impact-absorbing flight sleeves. Shipments to metropolitan hubs (Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata) arrive within 2 to 3 business days via BlueDart Air / Delhivery Express.
            </p>
            <h4 className="font-semibold text-stone-800 text-sm pt-2">Custom Club Fitting Guarantee</h4>
            <p>
              If your driver or forged iron setup requires lie or loft recalibration after testing on the course, visit our Bangalore studio or courier the clubhead back within 14 days for complimentary digital recalibration.
            </p>
          </div>
        )}
      </div>

      {/* Related Equipment Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-stone-200 pt-12">
          <div className="mb-6">
            <span className="text-xs font-semibold text-[#0D3B2E] uppercase tracking-wider">Complete Your Bag</span>
            <h2 className="text-2xl font-serif-display font-bold text-stone-900 mt-1">
              Complementary Tour Gear
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
