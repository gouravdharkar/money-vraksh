"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
}

type ToastFn = (type: ToastType, message: string) => void;

let addToastListener: ToastFn | null = null;

export function showToast(type: ToastType, message: string) {
  if (addToastListener) {
    addToastListener(type, message);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastListener = addToast;
    return () => { addToastListener = null; };
  }, [addToast]);

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const iconMap = {
    success: "check_circle",
    error: "error",
    info: "info",
  };

  const colorMap = {
    success: "text-success-emerald border-success-emerald/30",
    error: "text-red-400 border-red-400/30",
    info: "text-primary border-primary/30",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => remove(t.id)}
            className={`pointer-events-auto cursor-pointer flex items-center gap-3 px-5 py-3.5 rounded-xl border bg-background-midnight backdrop-blur-xl shadow-2xl ${colorMap[t.type]}`}
          >
            <span className="material-symbols-outlined text-lg">{iconMap[t.type]}</span>
            <span className="font-body-md text-sm text-on-surface">{t.message}</span>
            <button
              onClick={(e) => { e.stopPropagation(); remove(t.id); }}
              className="ml-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
