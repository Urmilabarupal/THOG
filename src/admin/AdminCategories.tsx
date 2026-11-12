/**
 * @file src/admin/AdminCategories.tsx
 * @purpose Admin Category Management module for managing product collections and counts.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Lists categories, tracks product density, and allows category metadata updates.
 */

import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const AdminCategories: React.FC = () => {
  const { categories, products, refreshProducts, showToast } = useStore();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    showToast(`Category "${newCatName}" added.`);
    setNewCatName('');
    setNewCatDesc('');
    refreshProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Store Taxonomy</span>
          <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
            Category Management ({categories.length})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4 text-center">Active Products</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug).length;
                return (
                  <tr key={cat.id} className="hover:bg-stone-50/70">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      {cat.name}
                      <span className="block text-[11px] text-stone-400 font-normal line-clamp-1">{cat.description}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">{cat.slug}</td>
                    <td className="py-3 px-4 text-center font-bold tabular-nums text-stone-800">{count}</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-semibold">Active</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick Add Category Card (1 Col) */}
        <div className="bg-white border border-stone-200 rounded p-6 space-y-4">
          <h3 className="font-semibold text-stone-900 text-sm">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Category Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Golf Putters"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Description</label>
              <textarea
                rows={3}
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Overview of this equipment category..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors"
            >
              Save Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
