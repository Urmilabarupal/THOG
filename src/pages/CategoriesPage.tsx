/**
 * @file src/pages/CategoriesPage.tsx
 * @purpose Visual exploration of all 8 core golf retail categories.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Displays structured category cards with real product counts and quick navigation.
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const CategoriesPage: React.FC = () => {
  const { categories, products, navigate } = useStore();

  const categoryImages: Record<string, string> = {
    'golf-clubs': '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg',
    'golf-balls': '/src/assets/images/golf_tour_balls_pack_1794483680033.jpg',
    'golf-bags': '/src/assets/images/golf_tour_leather_bag_1794483679825.jpg',
    'golf-shoes': '/src/assets/images/golf_premium_shoes_1794483679581.jpg',
    'golf-gloves': '/src/assets/images/golf_tour_balls_pack_1794483680033.jpg',
    'golf-clothing': '/src/assets/images/golf_premium_shoes_1794483679581.jpg',
    'golf-accessories': '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg',
    'training-equipment': '/src/assets/images/golf_tour_leather_bag_1794483679825.jpg',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-[#0D3B2E] uppercase tracking-wider">
          Equipment Taxonomy
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900 mt-1">
          Product Categories
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-2">
          Explore specialized golf disciplines engineered for competitive amateur and tour professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.slug).length;
          const image = categoryImages[cat.slug] || '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg';

          return (
            <div
              key={cat.id}
              onClick={() => navigate('shop', { category: cat.slug })}
              className="group relative bg-white border border-stone-200 rounded-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src={image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/10 transition-colors" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                  {count} {count === 1 ? 'Product' : 'Products'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-serif-display font-bold text-stone-900 group-hover:text-[#0D3B2E] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#0D3B2E]">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
