/**
 * @file src/pages/PoliciesPage.tsx
 * @purpose Legal, shipping, return, and privacy policy hub for The House of Gaunt.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Tabbed policy documentation covering Indian IT Act compliance, Shiprocket logistics,
 * Razorpay consumer protection, and 14-day equipment return assurances.
 */

import React, { useState } from 'react';
import { Shield, Truck, RotateCcw, FileText, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface PoliciesPageProps {
  initialTab?: 'privacy' | 'terms' | 'shipping' | 'refund';
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ initialTab }) => {
  const { currentView, navigate } = useStore();

  const determineTab = (): 'privacy' | 'terms' | 'shipping' | 'refund' => {
    if (currentView === 'privacy-policy') return 'privacy';
    if (currentView === 'terms-conditions') return 'terms';
    if (currentView === 'shipping-policy') return 'shipping';
    if (currentView === 'refund-policy') return 'refund';
    return initialTab || 'shipping';
  };

  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'shipping' | 'refund'>(determineTab());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <button
          onClick={() => navigate('home')}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </button>
        <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
          Governance & Customer Policies
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Climate Change Digital Labs (CCDL) · Registered Indian Enterprise Commercial Framework
        </p>
      </div>

      {/* Policy Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            activeTab === 'shipping' ? 'bg-[#0D3B2E] text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Shipping Policy (Shiprocket)</span>
        </button>

        <button
          onClick={() => setActiveTab('refund')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            activeTab === 'refund' ? 'bg-[#0D3B2E] text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Return & Refund Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            activeTab === 'privacy' ? 'bg-[#0D3B2E] text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            activeTab === 'terms' ? 'bg-[#0D3B2E] text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms & Conditions</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white border border-stone-200 rounded p-6 sm:p-10 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
        {/* 1. Shipping Policy */}
        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif-display font-bold text-stone-900">
              Pan-India Shipping & Logistics Policy (Shiprocket Integration)
            </h2>
            <p>
              The House of Gaunt partners with <strong>Shiprocket</strong> (incorporating BlueDart Air, Delhivery, and Shadowfax Express) to provide fast, secure, and insured delivery of golf clubs, bags, shoes, and fragile tournament equipment across all 28 Indian States and 8 Union Territories.
            </p>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">1. Delivery Zones & Estimated Timelines</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li><strong>Tier 1 Metro Hubs (Bangalore, Delhi NCR, Mumbai, Pune, Hyderabad, Chennai):</strong> 2 to 3 Business Days via Air Express.</li>
              <li><strong>Tier 2 Regional Capitals (Chandigarh, Jaipur, Ahmedabad, Kochi, Kolkata, Lucknow):</strong> 3 to 4 Business Days.</li>
              <li><strong>Rest of India (Tier 3 & Remote Pincodes):</strong> 4 to 6 Business Days via Surface Express.</li>
            </ul>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">2. Free Shipping Threshold</h3>
            <p>
              Orders with an equipment subtotal equal to or exceeding <strong>₹5,000</strong> qualify for 100% complimentary Shiprocket Air Express delivery. Orders below ₹5,000 incur a flat shipping charge of ₹350.
            </p>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">3. Tamper-Evident Tour Packaging</h3>
            <p>
              Every golf driver and iron set is sealed inside reinforced double-wall corrugated cartons with customized shock-absorbing foam inserts. If the exterior tamper-evident seal is broken upon arrival, please refuse the delivery and notify our concierge immediately.
            </p>
          </div>
        )}

        {/* 2. Return & Refund Policy */}
        {activeTab === 'refund' && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif-display font-bold text-stone-900">
              Return, Refund & Calibration Warranty Policy
            </h2>
            <p>
              At The House of Gaunt, we stand behind the craftsmanship and performance of every product. We offer a transparent 14-day hassle-free return window for Indian golfers.
            </p>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">1. Return Eligibility Criteria</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>The item must be in unhit, mint condition with factory shrink-wrap intact on the clubhead or grip.</li>
              <li>Apparel and golf shoes must be unworn with original tags and shoe box intact.</li>
              <li>Return requests must be initiated within 14 calendar days of delivery confirmation via Shiprocket tracking.</li>
            </ul>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">2. Refund Disbursement (Razorpay Source Account)</h3>
            <p>
              Once returned equipment passes inspection at our Bangalore Logistics Hub, refunds are automatically credited back to your original payment method (Bank Account, UPI ID, or Credit Card) within 3 to 5 business days via Razorpay.
            </p>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">3. 30-Day Complimentary Loft & Lie Recalibration</h3>
            <p>
              If you have purchased a driver or iron set and discover after testing that the lie angle or loft requires a 0.5° to 1.5° adjustment, visit our Bangalore studio or arrange a reverse pickup for complimentary digital recalibration.
            </p>
          </div>
        )}

        {/* 3. Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif-display font-bold text-stone-900">
              Privacy Policy & Data Protection (Indian IT Act 2000 Compliant)
            </h2>
            <p>
              Climate Change Digital Labs (CCDL) is committed to safeguarding customer personal and transactional information. This policy governs how customer data is processed on The House of Gaunt.
            </p>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">1. Information We Collect</h3>
            <p>
              We collect customer name, delivery address, phone number, and email strictly to fulfill orders, generate Shiprocket airway bills, and transmit Razorpay payment receipts. We do not store sensitive credit card numbers or banking passwords on our servers.
            </p>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">2. Zero Third-Party Monetization</h3>
            <p>
              Your contact details will never be sold, leased, or shared with third-party telemarketers. Customer communication is restricted to order status alerts and opt-in fitting insights from CCDL.
            </p>
          </div>
        )}

        {/* 4. Terms & Conditions */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif-display font-bold text-stone-900">
              Terms & Conditions of Sale
            </h2>
            <p>
              By browsing or completing a purchase on The House of Gaunt, you agree to comply with the legal terms set forth by Climate Change Digital Labs (CCDL).
            </p>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">1. Pricing & Indian Taxes (GST)</h3>
            <p>
              All prices displayed on the customer-facing storefront are in Indian Rupees (INR ₹) and are inclusive of the mandatory 18% Goods and Services Tax (GST) applicable to sports equipment under Indian commerce statutes.
            </p>

            <h3 className="font-semibold text-stone-900 text-sm pt-2">2. Jurisdiction</h3>
            <p>
              Any disputes arising from transactions or custom fitting services shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
