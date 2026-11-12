/**
 * @file src/components/Toast.tsx
 * @purpose Toast notifications renderer for cart, wishlist, auth, and action alerts.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Floating notifications queue responding within interaction latency budgets.
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded shadow-lg border text-xs font-medium transition-all transform translate-y-0 ${
            toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : toast.type === 'info'
              ? 'bg-stone-900 text-white border-stone-800'
              : 'bg-[#0D3B2E] text-white border-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-stone-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/70 hover:text-white p-0.5"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
