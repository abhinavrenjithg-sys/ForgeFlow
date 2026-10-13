import React, { useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { ToastContext } from './useToast';

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success'; id: number } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' = 'info') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#131713] border border-[rgba(220,235,215,0.2)] shadow-2xl text-[#F5F7F2] font-mono text-xs">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#C7FF45] shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#C7FF45] shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-[#697168] hover:text-[#F5F7F2] transition-colors ml-2"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
