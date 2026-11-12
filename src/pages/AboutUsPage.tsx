/**
 * @file src/pages/AboutUsPage.tsx
 * @purpose About Us narrative covering Climate Change Digital Labs (CCDL), club fitting ethos, and engineering.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Outlines brand heritage, Bangalore and Delhi fitting facilities, and sustainability commitments.
 */

import React from 'react';
import { Award, Compass, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const AboutUsPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Editorial Hero */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold text-[#0D3B2E] uppercase tracking-wider">
          Climate Change Digital Labs (CCDL) Initiative
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-stone-900 leading-tight">
          Where Aerospace Precision Meets the Heritage of Golf.
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Founded in Bengaluru by Climate Change Digital Labs, The House of Gaunt was conceived with a single mandate: to eliminate the compromises Indian golfers face in accessing genuine, custom-calibrated tour equipment.
        </p>
      </div>

      {/* 2-Column Split: Image & Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] bg-stone-100 rounded overflow-hidden border border-stone-200">
          <img
            src="/src/assets/images/hero_golf_fairway_green_1794483677630.jpg"
            alt="Golf Course Precision"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-serif-display font-bold text-stone-900">
              The Indian Fairway Metallurgy Standard
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Standard off-the-rack equipment is frequently calibrated for dry temperate climates. In India—where morning dew on Bangalore bentgrass transitions to the blistering heat of Delhi summers and coastal humidity in Mumbai—shaft load characteristics and turf friction shift radically.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex gap-3">
              <div className="p-2 bg-emerald-50 text-[#0D3B2E] rounded shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-900">Forged Carbon & Tungsten Density</h4>
                <p className="text-stone-500 mt-0.5">We utilize D18 high-density tungsten inserts to push center-of-gravity lower, maximizing launch angles into heavy morning air.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="p-2 bg-emerald-50 text-[#0D3B2E] rounded shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-900">Full TrackMan 4 Fitting Protocol</h4>
                <p className="text-stone-500 mt-0.5">Our Bangalore studio features high-speed 2,000 FPS cameras tracking impact smash factors, face-to-path ratios, and attack angles.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="p-2 bg-emerald-50 text-[#0D3B2E] rounded shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-900">100% Verified Authorized Importer</h4>
                <p className="text-stone-500 mt-0.5">Direct OEM relationships with Titleist, TaylorMade, Callaway, Mizuno, and Bushnell with laser serial authenticity registration.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate CCDL Credential Block */}
      <div className="bg-stone-900 text-white p-8 sm:p-12 rounded space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
            Development & Corporate Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-bold">
            Climate Change Digital Labs (CCDL)
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            As a digital innovation studio, CCDL pioneers sustainable supply chain routing and digital fitting tools. By partnering with Shiprocket’s carbon-neutral courier network and deploying eco-tanned Ethiopian Cabretta leather, we reduce the carbon intensity of equipment distribution.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-stone-800 text-xs">
          <div>
            <p className="text-stone-400">Headquarters</p>
            <p className="font-semibold text-white mt-0.5">Bengaluru, Karnataka</p>
          </div>
          <div>
            <p className="text-stone-400">Fittings Conducted</p>
            <p className="font-semibold text-white mt-0.5 tabular-nums">2,400+ Indian Golfers</p>
          </div>
          <div>
            <p className="text-stone-400">Logistics Partner</p>
            <p className="font-semibold text-white mt-0.5">Shiprocket Air Express</p>
          </div>
          <div>
            <p className="text-stone-400">Payment Gateway</p>
            <p className="font-semibold text-white mt-0.5">Razorpay India (256-Bit SSL)</p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('contact')}
            className="px-5 py-2.5 bg-white text-stone-900 text-xs font-semibold rounded hover:bg-stone-100 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Visit Our Fitting Studios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
