"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
};

type ToastContextValue = {
  toast: (t: Omit<ToastItem, "id">) => void;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function IconCheck() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = (id: string) => setItems((x) => x.filter((i) => i.id !== id));

  const toast = (t: Omit<ToastItem, "id">) => {
    const id = uid();
    const item: ToastItem = { id, durationMs: 3500, ...t };
    setItems((x) => [item, ...x].slice(0, 5));

    const ms = item.durationMs ?? 3500;
    window.setTimeout(() => remove(id), ms);
  };

  const value = useMemo(() => ({ toast, remove }), [toast, remove]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <IconCheck />;
      case "error":
        return <IconX />;
      default:
        return <IconInfo />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: "bg-emerald-500 text-white",
          title: "text-emerald-900",
          message: "text-emerald-700",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "bg-red-500 text-white",
          title: "text-red-900",
          message: "text-red-700",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "bg-blue-500 text-white",
          title: "text-blue-900",
          message: "text-blue-700",
        };
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-4 top-4 z-[60] space-y-3">
        {items.map((t) => {
          const styles = getStyles(t.type);
          return (
            <div
              key={t.id}
              className={`w-[380px] max-w-[92vw] rounded-xl border shadow-lg animate-slideIn ${styles.bg} ${styles.border}`}
            >
              <div className="flex gap-3 p-4">
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${styles.icon}`}
                >
                  {getIcon(t.type)}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className={`text-sm font-semibold ${styles.title}`}>
                    {t.title}
                  </div>
                  {t.message && (
                    <div className={`mt-1 text-xs ${styles.message}`}>
                      {t.message}
                    </div>
                  )}
                </div>

                <button
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/50 hover:text-slate-600"
                  onClick={() => remove(t.id)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
