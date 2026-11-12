/**
 * @file src/pages/SearchResultsPage.tsx
 * @purpose Search Results view providing instant query filtering and category facets.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../components/ProductCard.tsx.
 * @implementation Allows customers to query the catalog by product name, SKU, brand, and specifications.
 */

import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

export const SearchResultsPage: React.FC = () => {
  const { searchQuery, products, navigate } = useStore();
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  const query = (searchQuery || '').toLowerCase().trim();

  const matchingProducts = products.filter((p) => {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.shortDescription.toLowerCase().includes(query)
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate('search', { search: localQuery.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <button
          onClick={() => navigate('shop')}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>

        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900">
            {query ? `Search Results for "${searchQuery}"` : 'Catalog Search'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Found <strong className="text-stone-800">{matchingProducts.length}</strong> matching golf products
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search titanium drivers, stand bags, balls, rangefinders..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {matchingProducts.length === 0 ? (
        <div className="bg-white border border-stone-200 p-12 text-center rounded max-w-xl mx-auto">
          <p className="text-stone-600 font-semibold text-sm">No items found matching "{searchQuery}"</p>
          <p className="text-xs text-stone-400 mt-1">Check spelling or try popular golf terms:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
            {['Driver', 'Titanium', 'Bags', 'Shoes', 'Pro V1', 'Bushnell'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setLocalQuery(term);
                  navigate('search', { search: term });
                }}
                className="px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {matchingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
