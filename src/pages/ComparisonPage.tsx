/**
 * @file src/pages/ComparisonPage.tsx
 * @purpose Side-by-side product specifications comparison tool for golf equipment.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts.
 * @implementation Allows comparing up to 4 golf clubs, bags, or accessories across technical specs,
 * lofts, shaft flex, prices in INR ₹, and stock availability.
 */

import React from 'react';
import { Trash2, ShoppingBag, ArrowLeft, Plus, BarChart3, Star, Check, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const ComparisonPage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, addToCart, navigate, formatINR, products } = useStore();

  const handleAddSample = (productId: string) => {
    const p = products.find((prod) => prod.id === productId);
    if (p) addToCart(p);
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
            <span>Back to Catalog</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900">
            Equipment Comparison Matrix ({compareList.length} of 4)
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Compare clubhead volumes, shaft materials, lofts, and launch characteristics side-by-side.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs text-rose-600 hover:underline font-semibold self-start sm:self-auto"
          >
            Clear All Comparison Items
          </button>
        )}
      </div>

      {compareList.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded p-16 text-center max-w-lg mx-auto">
          <BarChart3 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-900">No Equipment Selected for Comparison</h3>
          <p className="text-xs text-stone-500 mt-1">
            Browse our catalog and click the comparison icon on any product card to analyze specifications.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="mt-5 px-5 py-2.5 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21]"
          >
            Browse Golf Equipment
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-stone-200 rounded">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="p-4 w-44 font-semibold text-stone-600 uppercase text-[11px] tracking-wider">
                  Specification
                </th>
                {compareList.map((product) => (
                  <th key={product.id} className="p-4 min-w-[240px] align-top">
                    <div className="space-y-3">
                      <div className="relative aspect-[4/3] bg-stone-100 rounded overflow-hidden border border-stone-200">
                        <img
                          src={product.images[0] || '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute top-2 right-2 p-1 bg-white/90 text-stone-500 hover:text-rose-600 rounded-full shadow-xs"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          {product.brand}
                        </span>
                        <h4
                          onClick={() => navigate('product-detail', { productId: product.id })}
                          className="font-bold text-stone-900 hover:text-[#0D3B2E] cursor-pointer line-clamp-2"
                        >
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-xs">
                          <span className="font-bold text-[#0D3B2E] tabular-nums">
                            {formatINR(product.salePrice || product.regularPrice)}
                          </span>
                          {product.salePrice && (
                            <span className="text-[11px] text-stone-400 line-through tabular-nums">
                              {formatINR(product.regularPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 bg-[#0D3B2E] hover:bg-[#092b21] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </th>
                ))}
                {/* Empty filler columns if < 4 */}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, idx) => (
                  <th key={`empty-${idx}`} className="p-4 min-w-[200px] border-l border-stone-100 bg-stone-50/40 text-center align-middle">
                    <button
                      onClick={() => navigate('shop')}
                      className="border border-dashed border-stone-300 rounded p-6 text-stone-400 hover:text-stone-700 hover:border-stone-400 w-full flex flex-col items-center gap-2"
                    >
                      <Plus className="w-5 h-5 text-stone-400" />
                      <span className="text-xs font-medium">Add Club to Compare</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-stone-700">
              {/* Category */}
              <tr>
                <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Category</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 capitalize">{p.category.replace('-', ' ')}</td>
                ))}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                  <td key={i} className="p-4 bg-stone-50/20"></td>
                ))}
              </tr>

              {/* Player Rating */}
              <tr>
                <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Player Rating</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{p.rating.toFixed(1)} / 5.0</span>
                      <span className="text-stone-400 text-[11px] font-normal">({p.reviewCount} reviews)</span>
                    </div>
                  </td>
                ))}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                  <td key={i} className="p-4 bg-stone-50/20"></td>
                ))}
              </tr>

              {/* Dexterity */}
              <tr>
                <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Hand Dexterity</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">{p.hand || 'Universal (Both Hands)'}</td>
                ))}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                  <td key={i} className="p-4 bg-stone-50/20"></td>
                ))}
              </tr>

              {/* Shaft Flex */}
              <tr>
                <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Shaft Flex / Profile</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">{p.flex || 'Standard Tour Setup'}</td>
                ))}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                  <td key={i} className="p-4 bg-stone-50/20"></td>
                ))}
              </tr>

              {/* Stock Status */}
              <tr>
                <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Stock Availability</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.stockQuantity > 0 ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>In Stock ({p.stockQuantity} units)</span>
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        <span>Backorder</span>
                      </span>
                    )}
                  </td>
                ))}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                  <td key={i} className="p-4 bg-stone-50/20"></td>
                ))}
              </tr>

              {/* SKU */}
              <tr>
                <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Manufacturer SKU</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 font-mono text-[11px] text-stone-500">{p.sku}</td>
                ))}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                  <td key={i} className="p-4 bg-stone-50/20"></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
