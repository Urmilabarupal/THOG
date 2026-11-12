/**
 * @file src/admin/AdminInventory.tsx
 * @purpose Admin Inventory & Stock replenishment module with inline quantity adjustments.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Features live stock modifications syncing to disk persistence via /api/admin/inventory/:id.
 */

import React, { useState } from 'react';
import { Warehouse, AlertTriangle, Plus, Minus, Check, Save } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const AdminInventory: React.FC = () => {
  const { products, refreshProducts, showToast } = useStore();
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleStockChange = (productId: string, val: number) => {
    setStockUpdates((prev) => ({
      ...prev,
      [productId]: Math.max(0, val)
    }));
  };

  const handleSaveStock = async (productId: string) => {
    const newStock = stockUpdates[productId];
    if (newStock === undefined) return;

    try {
      setSavingId(productId);
      const res = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newStock })
      });
      if (res.ok) {
        showToast('Inventory level updated.');
        refreshProducts();
      } else {
        showToast('Failed to update inventory.', 'error');
      }
    } catch {
      showToast('Error updating inventory.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Warehouse Logistics</span>
          <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
            Inventory & Stock Management
          </h1>
          <p className="text-xs text-stone-500">Live units available at Bangalore Central Fulfillment Center.</p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Equipment & SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Available Stock</th>
              <th className="py-3 px-4 text-right">Quick Restock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {products.map((p) => {
              const currentVal = stockUpdates[p.id] !== undefined ? stockUpdates[p.id] : p.stockQuantity;
              const isDirty = stockUpdates[p.id] !== undefined && stockUpdates[p.id] !== p.stockQuantity;
              const isLow = currentVal <= 10;

              return (
                <tr key={p.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-stone-900">{p.name}</p>
                    <p className="text-[11px] text-stone-400 font-mono">SKU: {p.sku} · {p.brand}</p>
                  </td>

                  <td className="py-3 px-4 capitalize">{p.category.replace('-', ' ')}</td>

                  <td className="py-3 px-4 text-center">
                    {isLow ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Low Stock</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        Optimal
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center font-bold tabular-nums text-sm text-stone-900">
                    {currentVal}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex items-center border border-stone-300 rounded bg-stone-50">
                        <button
                          onClick={() => handleStockChange(p.id, currentVal - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={currentVal}
                          onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                          className="w-12 text-center text-xs font-semibold bg-transparent focus:outline-none"
                        />
                        <button
                          onClick={() => handleStockChange(p.id, currentVal + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {isDirty && (
                        <button
                          onClick={() => handleSaveStock(p.id)}
                          disabled={savingId === p.id}
                          className="px-2.5 py-1 bg-[#0D3B2E] text-white rounded font-semibold text-xs hover:bg-[#092b21] flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
