/**
 * @file src/admin/AdminBrands.tsx
 * @purpose Admin Brand Management module for managing authorized golf equipment manufacturers.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Displays manufacturer portfolios (Titleist, TaylorMade, Callaway, CCDL Tour Edition).
 */

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Brand } from '../types/index.ts';

export const AdminBrands: React.FC = () => {
  const { showToast } = useStore();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCountry, setNewBrandCountry] = useState('USA');
  const [newBrandDesc, setNewBrandDesc] = useState('');

  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBrands(data.data || []);
      })
      .catch((e) => console.warn(e));
  }, []);

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    const brand: Brand = {
      id: `b-${Date.now()}`,
      name: newBrandName.trim(),
      slug: newBrandName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      country: newBrandCountry,
      description: newBrandDesc.trim() || 'Authorized tour equipment manufacturer.'
    };

    setBrands([...brands, brand]);
    showToast(`Brand "${brand.name}" registered.`);
    setNewBrandName('');
    setNewBrandDesc('');
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Authorized Partners</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Brand Management ({brands.length} Brands)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Brand Name</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Partnership Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {b.name}
                    <span className="block text-[11px] text-stone-400 font-normal line-clamp-1">{b.description}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-600">{b.country}</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Direct OEM Certified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-stone-200 rounded p-6 space-y-4">
          <h3 className="font-semibold text-stone-900 text-sm">Register New Brand</h3>
          <form onSubmit={handleAddBrand} className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Brand Name</label>
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="e.g. Cobra Golf"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Country of Origin</label>
              <input
                type="text"
                value={newBrandCountry}
                onChange={(e) => setNewBrandCountry(e.target.value)}
                placeholder="USA / Japan / India / UK"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Description</label>
              <textarea
                rows={2}
                value={newBrandDesc}
                onChange={(e) => setNewBrandDesc(e.target.value)}
                placeholder="Brand specialty..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors"
            >
              Add Brand
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
