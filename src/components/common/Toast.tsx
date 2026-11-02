import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl backdrop-blur-md border text-sm font-medium transition-all transform animate-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-blue-600/95 text-white border-blue-500 shadow-blue-500/20'
              : toast.type === 'error'
              ? 'bg-red-600/95 text-white border-red-500 shadow-red-500/20'
              : 'bg-slate-900/95 text-white border-slate-700 shadow-slate-900/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300 shrink-0" />}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/80 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
