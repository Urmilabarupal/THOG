/**
 * @file src/pages/ShopPage.tsx
 * @purpose Shop All Products catalog page with faceted filtering, brand sorting, and price range controls.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../components/ProductCard.tsx.
 * @implementation Features category selection, brand multi-filter, price boundaries in INR ₹,
 * player flex selection, active filters, and tabular numeral pricing.
 */

import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    activeCategory,
    navigate,
    formatINR
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(120000);
  const [selectedFlex, setSelectedFlex] = useState<string>('all');
  const [selectedHand, setSelectedHand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return list.sort();
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      const effectivePrice = p.salePrice || p.regularPrice;
      if (effectivePrice > priceMax) return false;
      if (inStockOnly && p.stockQuantity <= 0) return false;
      if (selectedFlex !== 'all' && p.flex && p.flex !== selectedFlex) return false;
      if (selectedHand !== 'all' && p.hand && p.hand !== selectedHand && p.hand !== 'Universal') return false;
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.regularPrice;
      const priceB = b.salePrice || b.regularPrice;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedBrand, priceMax, inStockOnly, selectedFlex, selectedHand, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceMax(120000);
    setSelectedFlex('all');
    setSelectedHand('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedBrand !== 'all' || priceMax < 120000 || inStockOnly || selectedFlex !== 'all' || selectedHand !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <button onClick={() => navigate('home')} className="hover:text-stone-900">Home</button>
          <span>/</span>
          <span className="text-stone-900 font-medium">Equipment Catalog</span>
          {selectedCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="capitalize">{selectedCategory.replace('-', ' ')}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif-display font-bold text-stone-900">
              {selectedCategory === 'all'
                ? 'All Golf Equipment & Apparel'
                : categories.find((c) => c.slug === selectedCategory)?.name || 'Golf Equipment'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Displaying <strong className="text-stone-800">{filteredProducts.length}</strong> tournament-grade products across India
            </p>
          </div>

          {/* Sort Selector & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-white border border-stone-300 text-xs font-semibold rounded text-stone-700"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-600 bg-white border border-stone-300 px-3 py-2 rounded">
              <span className="font-medium text-stone-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters Desktop */}
        <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} md:col-span-1 space-y-6 bg-white p-5 rounded border border-stone-200/80 self-start`}>
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4 text-[#0D3B2E]" />
              <span>Refine Catalog</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#0D3B2E] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">Category</h4>
            <div className="space-y-1.5 text-xs text-stone-600">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#0D3B2E] text-white font-medium'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-[#0D3B2E] text-white font-medium'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  {cat.name} ({products.filter((p) => p.category === cat.slug).length})
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">Brand</h4>
            <div className="space-y-1.5 text-xs text-stone-600">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                  selectedBrand === 'all' ? 'bg-[#0D3B2E] text-white font-medium' : 'hover:bg-stone-100'
                }`}
              >
                All Brands
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                    selectedBrand === brand ? 'bg-[#0D3B2E] text-white font-medium' : 'hover:bg-stone-100'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Max Price</h4>
              <span className="text-xs font-medium text-[#0D3B2E] tabular-nums">{formatINR(priceMax)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="120000"
              step="2000"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#0D3B2E] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>₹1,000</span>
              <span>₹1,20,000+</span>
            </div>
          </div>

          {/* Handedness & Flex */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1.5">Dexterity</h4>
              <div className="flex gap-1.5 text-xs">
                {['all', 'Right-Handed', 'Left-Handed'].map((h) => (
                  <button
                    key={h}
                    onClick={() => setSelectedHand(h)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      selectedHand === h
                        ? 'bg-[#0D3B2E] text-white border-[#0D3B2E]'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {h === 'all' ? 'All' : h === 'Right-Handed' ? 'RH' : 'LH'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1.5">Shaft Flex</h4>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['all', 'Regular', 'Stiff', 'Extra Stiff'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFlex(f)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      selectedFlex === f
                        ? 'bg-[#0D3B2E] text-white border-[#0D3B2E]'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-4 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-[#0D3B2E] w-4 h-4"
              />
              <span>In-Stock Ready to Ship</span>
            </label>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center rounded">
              <p className="text-stone-400 text-sm font-medium">No products match your selected filters.</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-[#0D3B2E] text-white text-xs font-medium rounded hover:bg-[#092b21] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
