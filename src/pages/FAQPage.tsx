/**
 * @file src/pages/FAQPage.tsx
 * @purpose Frequently Asked Questions covering shipping in India, custom fittings, warranties, and Razorpay.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Expandable accordion system with instant keyword filtering.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'Authenticity & Serial Verification',
    question: 'How do I know the golf equipment is 100% genuine and tour-authentic?',
    answer: 'Climate Change Digital Labs (CCDL) is an authorized direct importer and partner for Titleist, TaylorMade, Callaway, Mizuno, Ping, and Bushnell Golf. Every clubhead, iron set, and rangefinder arrives in factory-sealed OEM packaging with verifiable laser-etched serial numbers that can be checked directly on the manufacturer’s warranty database.'
  },
  {
    category: 'Shipping & Delivery in India',
    question: 'How does Shiprocket Air Express delivery operate across Indian cities?',
    answer: 'We dispatch all confirmed orders from our Central Logistics Hub in Bangalore via Shiprocket Air Express (primarily BlueDart Air and Delhivery Surface). Metro destinations (Bengaluru, Delhi NCR, Mumbai, Hyderabad, Chennai, Kolkata) typically receive packages within 2–3 business days. Tier-2 and Tier-3 cities receive delivery within 3–5 business days. You receive live SMS and WhatsApp tracking links upon airway bill (AWB) generation.'
  },
  {
    category: 'Shipping & Delivery in India',
    question: 'Is shipping free across India?',
    answer: 'Yes! All orders above ₹5,000 qualify for complimentary pan-India Shiprocket Air Express delivery. Orders below ₹5,000 incur a standard flat shipping fee of ₹350.'
  },
  {
    category: 'Custom Club Fitting',
    question: 'How does CCDL custom fitting and loft/lie calibration work?',
    answer: 'We operate TrackMan 4 launch monitor studios in Bangalore (MG Road), Gurugram (Golf Course Road), and Mumbai (BKC). During a 60-minute session, our PGA-certified fitters evaluate your attack angle, swing speed, club path, and launch spin to recommend exact shaft stiffness, length, and lie specifications. If you order online, you can submit your swing video or handicap for remote advisory.'
  },
  {
    category: 'Payments & Razorpay',
    question: 'What payment methods are supported on The House of Gaunt?',
    answer: 'We support all major Indian digital payment modes via Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), Indian & International Credit/Debit Cards (Visa, MasterCard, RuPay, American Express), and NetBanking across 50+ Indian banks. We also support Cash on Delivery (COD) for orders up to ₹25,000.'
  },
  {
    category: 'Returns & Warranties',
    question: 'What is your 14-day return and recalibration policy?',
    answer: 'If you are dissatisfied with an unhit, pristine club or accessory, you may return it within 14 calendar days of delivery for a 100% refund or store credit. If you have played the club and feel the loft or lie requires adjustment, we offer complimentary recalibration at any of our fitting centers within the first 30 days.'
  }
];

export const FAQPage: React.FC = () => {
  const { navigate } = useStore();
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);
  const [filterQuery, setFilterQuery] = useState('');

  const toggleAccordion = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  const filteredFAQs = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-[#0D3B2E] uppercase tracking-wider">
          Player Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
          Everything you need to know about tour equipment authenticity, Shiprocket delivery in India, and custom fitting services.
        </p>

        {/* Search filter input */}
        <div className="pt-4 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search questions (e.g. Shiprocket, TrackMan, Razorpay, Returns)..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
            />
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
        {filteredFAQs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div key={idx} className="py-4">
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between text-left gap-4 hover:text-[#0D3B2E] transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                    {faq.category}
                  </span>
                  <h3 className="text-sm font-semibold text-stone-900 leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <div className="p-1 rounded-full text-stone-500 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed pr-8 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Card */}
      <div className="bg-stone-100/70 border border-stone-200 rounded p-6 text-center space-y-3">
        <h4 className="font-semibold text-stone-900 text-sm">Still have questions regarding your golf setup?</h4>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Our fitting specialists in Bangalore and Delhi are on standby to evaluate your game requirements.
        </p>
        <button
          onClick={() => navigate('contact')}
          className="px-5 py-2.5 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] inline-flex items-center gap-1.5"
        >
          <span>Contact Fitting Concierge</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
