/**
 * @file src/pages/HomePage.tsx
 * @purpose Storefront landing page featuring campaign hero, category showcase, and featured tour gear.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../components/ProductCard.tsx.
 * @implementation Implements 1 bold campaign focal point, 3-column featured product grid,
 * editorial craftsmanship section, and direct conversion pathways.
 */

import React from 'react';
import { ArrowRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

export const HomePage: React.FC = () => {
  const { navigate, products } = useStore();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      {/* 1. Storefront Hero: 1 bold campaign focal point */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_golf_fairway_green_1794483677630.jpg"
            alt="Championship Golf Course Fairway at Sunrise"
            className="w-full h-full object-cover object-center opacity-65"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-stone-900/20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-36 flex flex-col justify-end min-h-[580px]">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>The House of Gaunt · Bespoke Atelier</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-white tracking-tight leading-tight text-balance">
              Championship Precision, Crafted for Indian Fairways.
            </h1>

            <p className="text-sm sm:text-base text-stone-200 font-light leading-relaxed max-w-xl">
              Tour-validated titanium drivers, handcrafted leather staff bags, and precision-forged iron sets. Engineered to excel across diverse micro-climates from Delhi to Bangalore.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('shop')}
                className="px-6 py-3 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Shop All Equipment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('about')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-medium rounded transition-all"
              >
                Custom Fitting & Craftsmanship
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Navigation Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold text-[#0D3B2E] uppercase tracking-wider">Curated Collections</p>
            <h2 className="text-2xl font-serif-display font-bold text-stone-900 mt-1">
              Explore by Discipline
            </h2>
          </div>
          <button
            onClick={() => navigate('categories')}
            className="text-xs font-semibold text-[#0D3B2E] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All 8 Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Tile 1: Golf Clubs */}
          <div
            onClick={() => navigate('shop', { category: 'golf-clubs' })}
            className="group relative aspect-square bg-stone-100 rounded-sm overflow-hidden cursor-pointer border border-stone-200"
          >
            <img
              src="/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg"
              alt="Tour Golf Clubs"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[11px] text-stone-300 uppercase tracking-wider font-medium">CCDL Tour Series</span>
              <h3 className="text-base font-serif-display font-semibold text-white">Golf Clubs</h3>
            </div>
          </div>

          {/* Tile 2: Tour Staff Bags */}
          <div
            onClick={() => navigate('shop', { category: 'golf-bags' })}
            className="group relative aspect-square bg-stone-100 rounded-sm overflow-hidden cursor-pointer border border-stone-200"
          >
            <img
              src="/src/assets/images/golf_tour_leather_bag_1794483679825.jpg"
              alt="Handcrafted Leather Golf Bags"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[11px] text-stone-300 uppercase tracking-wider font-medium">Bespoke Saddle Leather</span>
              <h3 className="text-base font-serif-display font-semibold text-white">Golf Bags</h3>
            </div>
          </div>

          {/* Tile 3: Spikeless Footwear */}
          <div
            onClick={() => navigate('shop', { category: 'golf-shoes' })}
            className="group relative aspect-square bg-stone-100 rounded-sm overflow-hidden cursor-pointer border border-stone-200"
          >
            <img
              src="/src/assets/images/golf_premium_shoes_1794483679581.jpg"
              alt="Waterproof Golf Shoes"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[11px] text-stone-300 uppercase tracking-wider font-medium">Waterproof Calfskin</span>
              <h3 className="text-base font-serif-display font-semibold text-white">Golf Shoes</h3>
            </div>
          </div>

          {/* Tile 4: Tour Urethane Balls */}
          <div
            onClick={() => navigate('shop', { category: 'golf-balls' })}
            className="group relative aspect-square bg-stone-100 rounded-sm overflow-hidden cursor-pointer border border-stone-200"
          >
            <img
              src="/src/assets/images/golf_tour_balls_pack_1794483680033.jpg"
              alt="Tour Urethane Golf Balls"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[11px] text-stone-300 uppercase tracking-wider font-medium">332 Dimple Aerodynamics</span>
              <h3 className="text-base font-serif-display font-semibold text-white">Golf Balls</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Tour Equipment Grid */}
      <section className="bg-stone-100/60 py-16 border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#0D3B2E] uppercase tracking-wider">The Standard of Play</p>
              <h2 className="text-2xl font-serif-display font-bold text-stone-900 mt-1">
                Featured Tour Equipment
              </h2>
            </div>
            <button
              onClick={() => navigate('shop')}
              className="text-xs font-semibold text-[#0D3B2E] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore All Equipment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Craftsmanship & Fitting Concierge Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0D3B2E]">
              Precision Metallurgy · CCDL Fitting Lab
            </span>
            <h2 className="text-3xl font-serif-display font-bold text-stone-900 leading-tight">
              Every strike deserves calibrated balance and acoustic feedback.
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              At Climate Change Digital Labs, our golf engineering discipline treats golf equipment as precision aerospace instruments. From D18 tungsten brazing for perimeter launch stability to cryogenic CNC face milling, our clubs are tailored to match your specific swing tempo and ball launch parameters.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="border-l-2 border-[#0D3B2E] pl-4">
                <span className="text-xl font-serif-display font-bold text-stone-900">0.5° Loft</span>
                <p className="text-xs text-stone-500 mt-0.5">Tolerance accuracy across all custom fitting hosel sleeves.</p>
              </div>
              <div className="border-l-2 border-[#0D3B2E] pl-4">
                <span className="text-xl font-serif-display font-bold text-stone-900">100% Genuine</span>
                <p className="text-xs text-stone-500 mt-0.5">Direct manufacturer serial verification and lifetime fitting logs.</p>
              </div>
            </div>
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => navigate('contact')}
                className="px-6 py-2.5 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-colors"
              >
                Book Fitting Consultation
              </button>
              <button
                onClick={() => navigate('about')}
                className="px-4 py-2 text-stone-700 text-xs font-semibold hover:underline"
              >
                Learn Our Methodology →
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
            <img
              src="/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg"
              alt="Titanium Clubhead Engineering"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-stone-900/85 backdrop-blur-md p-4 text-white text-xs rounded border border-white/10">
              <p className="font-semibold text-amber-200">The House of Gaunt Fitting Studio · Bangalore</p>
              <p className="text-stone-300 text-[11px] mt-0.5">Equipped with TrackMan 4 dual-radar tracking and high-speed photometric cameras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Review Highlight */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
            Tour Player Feedback
          </span>
          <blockquote className="text-lg sm:text-xl font-serif-display italic leading-relaxed text-stone-200">
            "The House of Gaunt Aurum Driver with the Fujikura Ventus shaft gave me 18 extra carry yards at the Delhi Golf Club tournament. The ball flight piercing through morning dew was simply breathtaking."
          </blockquote>
          <div className="text-xs text-stone-400">
            <p className="font-semibold text-white">Col. Vikram Rathore (Retd.)</p>
            <p className="text-[11px] text-stone-400">Member, Delhi Golf Club · 3-Handicap Golfer</p>
          </div>
        </div>
      </section>
    </div>
  );
};
