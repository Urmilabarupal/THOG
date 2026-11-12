/**
 * @file src/components/Footer.tsx
 * @purpose Storefront footer with Indian showroom footprints, customer care, and quick navigation.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Displays brand credentials under Climate Change Digital Labs (CCDL),
 * links to all policies, tracking services, payment badges, and showroom locations.
 */

import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const Footer: React.FC = () => {
  const { navigate } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 text-sm border-t border-stone-800">
      {/* Trust Badges Strip */}
      <div className="border-b border-stone-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-stone-800/90 text-[#C5A880] rounded">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">100% Tour Authentic</h4>
              <p className="text-stone-400 text-xs mt-0.5">Directly sourced authorized Indian distributor gear with serial certificates.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-stone-800/90 text-[#C5A880] rounded">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Shiprocket Air Express</h4>
              <p className="text-stone-400 text-xs mt-0.5">Complimentary pan-India delivery on orders ₹5,000+ with live AWB tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-stone-800/90 text-[#C5A880] rounded">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">14-Day Return Assurance</h4>
              <p className="text-stone-400 text-xs mt-0.5">Hassle-free equipment returns and custom loft/lie recalibrations.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-stone-800/90 text-[#C5A880] rounded">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Razorpay Verified Secure</h4>
              <p className="text-stone-400 text-xs mt-0.5">Bank-grade 256-bit SSL encrypted UPI, NetBanking, and Card checkout.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & CCDL Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xl font-serif-display font-bold text-white tracking-tight">
              The House of Gaunt
            </span>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              An initiative of <strong className="text-white">Climate Change Digital Labs (CCDL)</strong>. Delivering high-precision tour golf equipment, handcrafted leather accessories, and bespoke club-fitting services across the Indian subcontinent.
            </p>
            <div className="space-y-2 text-xs text-stone-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>Flagship Fitting Studio: 18 MG Road, Bengaluru, KA 560001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>Concierge Desk: +91 80 4123 9900 (Mon–Sat, 9AM–7PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>concierge@fairwaylinks.ccdl.in</span>
              </div>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Equipment Catalog</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('shop', { category: 'golf-clubs' })} className="hover:text-white transition-colors">
                  Drivers & Fairway Woods
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'golf-clubs' })} className="hover:text-white transition-colors">
                  Forged Iron Sets & Wedges
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'golf-balls' })} className="hover:text-white transition-colors">
                  Tour Urethane Golf Balls
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'golf-bags' })} className="hover:text-white transition-colors">
                  Leather Staff & Stand Bags
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'golf-shoes' })} className="hover:text-white transition-colors">
                  Waterproof Spikeless Footwear
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'training-equipment' })} className="hover:text-white transition-colors">
                  Precision Putting Mats & Radar
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge & Tracking */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Client Concierge</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('order-tracking')} className="hover:text-white transition-colors text-emerald-400 font-medium">
                  Track Shiprocket Shipment
                </button>
              </li>
              <li>
                <button onClick={() => navigate('my-orders')} className="hover:text-white transition-colors">
                  Order History & Tax Invoices
                </button>
              </li>
              <li>
                <button onClick={() => navigate('compare')} className="hover:text-white transition-colors">
                  Club Specifications Comparison
                </button>
              </li>
              <li>
                <button onClick={() => navigate('wishlist')} className="hover:text-white transition-colors">
                  Saved Golf Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faq')} className="hover:text-white transition-colors">
                  Custom Fitting & Shaft FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
                  Book Bangalore / Delhi Fitting
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Policies */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Policies & Governance</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('shipping-policy')} className="hover:text-white transition-colors">
                  Shipping Policy & India Pin Codes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('refund-policy')} className="hover:text-white transition-colors">
                  Return, Refund & Warranty Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy-policy')} className="hover:text-white transition-colors">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms-conditions')} className="hover:text-white transition-colors">
                  Terms & Conditions of Sale
                </button>
              </li>
              <li>
                <button onClick={() => navigate('blog')} className="hover:text-white transition-colors">
                  The Fairway Journal
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => navigate('admin')}
                  className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-[11px] font-mono border border-stone-800 px-2.5 py-1 rounded hover:border-stone-700"
                >
                  <span>Admin Console</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Indian Commercial Note */}
        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Climate Change Digital Labs (CCDL). Registered Indian Enterprise. All rights reserved.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>GSTIN: 29AAACC1234F1Z8</span>
            <span>·</span>
            <span>Razorpay Test Sandbox Active</span>
            <span>·</span>
            <span>Shiprocket Logistics Node: BLR-01</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
