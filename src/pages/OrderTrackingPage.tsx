/**
 * @file src/pages/OrderTrackingPage.tsx
 * @purpose Live Shiprocket order tracking simulator for pan-Indian golf shipments.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Features AWB search, Indian transit milestone visualization, courier hub updates,
 * and delivery estimations.
 */

import React, { useState, useEffect } from 'react';
import { Search, Truck, CheckCircle2, Clock, MapPin, ArrowLeft, PackageCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const OrderTrackingPage: React.FC = () => {
  const { navigate } = useStore();
  const [identifierInput, setIdentifierInput] = useState('CCDL-2026-1041');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchTracking = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(idToSearch.trim())}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTrackingData(data.data);
      } else {
        setErrorMessage(data.error || 'No shipment found for that reference ID.');
        setTrackingData(null);
      }
    } catch {
      setErrorMessage('Failed to connect to Shiprocket tracking gateway.');
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking('CCDL-2026-1041');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(identifierInput);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <button
          onClick={() => navigate('home')}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900">
          Shiprocket Live Order Tracking
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Monitor your tournament golf gear in real-time across Indian air express hubs.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded border border-stone-200 mb-8 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={identifierInput}
              onChange={(e) => setIdentifierInput(e.target.value)}
              placeholder="Enter Order ID (e.g. CCDL-2026-1041) or Shiprocket AWB (e.g. SR-IN-981273910)"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Locating...' : 'Track Parcel'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-[11px] text-stone-500">
          <span className="font-semibold text-stone-700">Test References:</span>
          <button
            onClick={() => {
              setIdentifierInput('CCDL-2026-1041');
              fetchTracking('CCDL-2026-1041');
            }}
            className="text-[#0D3B2E] underline font-mono"
          >
            CCDL-2026-1041
          </button>
          <span>·</span>
          <button
            onClick={() => {
              setIdentifierInput('SR-IN-981273910');
              fetchTracking('SR-IN-981273910');
            }}
            className="text-[#0D3B2E] underline font-mono"
          >
            SR-IN-981273910
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs mb-8">
          {errorMessage}
        </div>
      )}

      {/* Tracking Result View */}
      {trackingData && (
        <div className="bg-white border border-stone-200 rounded p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <span className="text-xs font-bold text-[#0D3B2E] uppercase tracking-wider block">
                Air Express Courier: {trackingData.courier}
              </span>
              <h2 className="text-xl font-bold font-serif-display text-stone-900 mt-1">
                Airway Bill #{trackingData.awb}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Destination: <strong>{trackingData.destination}</strong>
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-[#0D3B2E] text-xs font-bold uppercase rounded">
                {trackingData.shiprocketStatus || 'In Transit'}
              </span>
              <p className="text-xs text-stone-500 mt-1">
                Estimated Delivery: <strong className="text-stone-900">{trackingData.estimatedDelivery}</strong>
              </p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Shipment Movement Log
            </h3>

            <div className="relative pl-6 space-y-6 border-l-2 border-[#0D3B2E]">
              {trackingData.trackingHistory && trackingData.trackingHistory.length > 0 ? (
                trackingData.trackingHistory.map((step: any, idx: number) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#0D3B2E] border-2 border-white ring-2 ring-emerald-100" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{step.status}</span>
                        <span className="text-stone-400 text-xs">·</span>
                        <span className="text-[11px] text-stone-500 font-mono">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#0D3B2E]" />
                        <span>{step.location}</span>
                      </p>
                      {step.note && (
                        <p className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded mt-1.5 border border-stone-100 max-w-lg">
                          {step.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-500">
                  Parcel data received at Bangalore Central Hub. Awaiting initial scan.
                </div>
              )}
            </div>
          </div>

          {/* Guarantee Footer */}
          <div className="border-t border-stone-100 pt-4 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#0D3B2E]" />
              <span>Tamper-evident packaging with shock-sensor indicators.</span>
            </div>
            <button
              onClick={() => navigate('contact')}
              className="text-[#0D3B2E] font-medium hover:underline"
            >
              Need Delivery Assistance? Contact Concierge →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
