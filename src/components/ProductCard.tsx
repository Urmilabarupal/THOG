/**
 * @file src/components/ProductCard.tsx
 * @purpose Premium e-commerce product card adhering to anti-slop and zero-pill discipline.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts.
 * @implementation Features 70% height image container, unboxed typographic metadata,
 * tabular INR pricing, wishlist and compare quick-affordances, and add-to-bag triggers.
 */

import React from 'react';
import { Heart, BarChart3, Plus, Star } from 'lucide-react';
import { Product } from '../types/index.ts';
import { useStore } from '../context/StoreContext.tsx';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart, toggleWishlist, isInWishlist, addToCompare, compareList, formatINR } = useStore();

  const isFavorited = isInWishlist(product.id);
  const isCompared = compareList.some((p) => p.id === product.id);

  const price = product.salePrice || product.regularPrice;
  const hasDiscount = Boolean(product.salePrice && product.salePrice < product.regularPrice);
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg';

  const handleCardClick = () => {
    navigate('product-detail', { productId: product.id });
  };

  return (
    <div className="group relative flex flex-col bg-white border border-stone-200/80 rounded-sm overflow-hidden hover:shadow-md transition-all duration-200">
      {/* 70% Product Image Canvas */}
      <div
        onClick={handleCardClick}
        className="relative w-full aspect-[4/3] bg-stone-100/70 overflow-hidden cursor-pointer"
      >
        <img
          src={mainImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quiet Subtle Tag (Never colored pill) */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-semibold px-2 py-0.5 tracking-tight border border-stone-200/60 shadow-xs">
            Save {formatINR(product.regularPrice - (product.salePrice || 0))}
          </div>
        )}

        {/* Action icons cluster */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isFavorited
                ? 'bg-[#0D3B2E] text-white shadow-sm'
                : 'bg-white/90 text-stone-600 hover:text-[#0D3B2E] hover:bg-white shadow-xs'
            }`}
            title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCompare(product);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isCompared
                ? 'bg-stone-800 text-white shadow-sm'
                : 'bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-white shadow-xs'
            }`}
            title="Compare specifications"
            aria-label="Compare toggle"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Details Module */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 tracking-wide">
            <span className="font-semibold text-stone-700 uppercase">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{product.category.replace('-', ' ')}</span>
            {product.rating > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center text-amber-700 font-medium">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                  {product.rating.toFixed(1)}
                </span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={handleCardClick}
            className="text-sm font-semibold text-stone-900 hover:text-[#0D3B2E] line-clamp-2 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>

          {/* Short Excerpt */}
          <p className="text-xs text-stone-500 line-clamp-1 mt-1 font-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing and Quick Add Bar */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#0D3B2E] tabular-nums">
              {formatINR(price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatINR(product.regularPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-2 text-stone-700 hover:text-white bg-stone-100 hover:bg-[#0D3B2E] rounded transition-colors flex items-center gap-1 text-xs font-medium"
            title="Add to Golf Bag"
            aria-label="Add to cart"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
