import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
        let borderColor = 'border-emerald-200';
        let bgIcon = 'bg-emerald-50';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500" />;
          borderColor = 'border-rose-200';
          bgIcon = 'bg-rose-50';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-indigo-500" />;
          borderColor = 'border-indigo-200';
          bgIcon = 'bg-indigo-50';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
          borderColor = 'border-amber-200';
          bgIcon = 'bg-amber-50';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border ${borderColor} transition-all duration-300 animate-in slide-in-from-right-8`}
          >
            <div className={`p-1.5 rounded-xl ${bgIcon} flex-shrink-0 mt-0.5`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
