/**
 * @file src/admin/AdminBanners.tsx
 * @purpose Admin Website Banner Management module controlling top storefront notifications.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Updates top announcement text and visibility toggles without code alterations.
 */

import React, { useState } from 'react';
import { Megaphone, Save, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const AdminBanners: React.FC = () => {
  const { settings, showToast, refreshProducts } = useStore();

  const [bannerText, setBannerText] = useState(
    settings?.bannerAnnouncement || 'Complimentary Pan-India Air Express Delivery on Golf Equipment Orders over ₹5,000 · Certified 100% Genuine Tour Gear'
  );
  const [enabled, setEnabled] = useState(settings?.bannerEnabled !== false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerAnnouncement: bannerText.trim(),
          bannerEnabled: enabled
        })
      });
      if (res.ok) {
        showToast('Top announcement banner updated.');
        refreshProducts();
      }
    } catch {
      showToast('Error updating banner.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Storefront Messaging</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Website Banner Management
        </h1>
        <p className="text-xs text-stone-500">Edit promotional announcements displayed at the very top of all customer pages.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded p-6 max-w-2xl space-y-6 text-xs text-stone-700">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bannerActive"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#0D3B2E]"
            />
            <label htmlFor="bannerActive" className="font-semibold text-stone-900 cursor-pointer">
              Enable Top Promotional Announcement Bar
            </label>
          </div>

          <div>
            <label className="block text-stone-900 font-semibold mb-1">Announcement Copy</label>
            <textarea
              rows={3}
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="Enter announcement text..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              required
            />
          </div>

          {/* Live Preview */}
          <div className="border border-stone-200 rounded p-4 bg-stone-50 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Visual Preview</span>
            </span>
            <div className="bg-[#0D3B2E] text-stone-100 py-2 px-4 rounded text-center text-xs font-medium">
              {bannerText}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Publish Banner Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
