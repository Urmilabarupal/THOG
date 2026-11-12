/**
 * @file src/pages/WishlistPage.tsx
 * @purpose Saved golf equipment wishlist allowing customers to curate their dream bag.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../components/ProductCard.tsx.
 * @implementation Displays saved gear, bulk transfer to cart, and zero-pill clean layout.
 */

import React from 'react';
import { Heart, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

export const WishlistPage: React.FC = () => {
  const { wishlist, addToCart, navigate, showToast } = useStore();

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(product);
    });
    showToast(`Added ${wishlist.length} saved products to your golf bag.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate('shop')}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900">
            Saved Equipment Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Curate your ideal golf bag configuration before scheduling a studio fitting.
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="px-4 py-2 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add All to Golf Bag</span>
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded p-16 text-center max-w-md mx-auto">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-stone-500 mt-1">
            Click the heart icon on any driver, bag, or golf shoe to save it to your wishlist.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="mt-5 px-5 py-2.5 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] inline-flex items-center gap-2"
          >
            <span>Explore Tour Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
