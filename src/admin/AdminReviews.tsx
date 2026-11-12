/**
 * @file src/admin/AdminReviews.tsx
 * @purpose Admin Reviews Management module for approving or rejecting customer equipment ratings.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts.
 * @implementation Moderates player feedback, verifies purchase flags, and adjusts product ratings.
 */

import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Check, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductReview } from '../types/index.ts';

export const AdminReviews: React.FC = () => {
  const { showToast, products } = useStore();
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  const fetchReviews = () => {
    fetch('/api/admin/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReviews(data.data || []);
      })
      .catch((e) => console.warn(e));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Review marked as ${status}.`);
        fetchReviews();
      }
    } catch {
      showToast('Error updating review status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Moderation</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Customer Reviews Moderation ({reviews.length})
        </h1>
        <p className="text-xs text-stone-500">Approve or hide golfer reviews across clubs and apparel.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Player & Date</th>
              <th className="py-3 px-4">Equipment</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Review Text</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {reviews.map((r) => {
              const product = products.find((p) => p.id === r.productId);
              return (
                <tr key={r.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-stone-900">{r.customerName}</p>
                    <p className="text-[11px] text-stone-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                  </td>

                  <td className="py-3 px-4 font-medium text-stone-800">
                    {product ? product.name : r.productId}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      <span>{r.rating}.0</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-sm">
                    <p className="font-semibold text-stone-900">{r.title}</p>
                    <p className="text-stone-500 text-[11px] line-clamp-2">{r.comment}</p>
                  </td>

                  <td className="py-3 px-4 uppercase text-[10px] font-bold">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        r.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'approved')}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                          title="Approve Review"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'rejected')}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Reject Review"
                        >
                          <X className="w-4 h-4" />
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
