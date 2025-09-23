"use client";

import { AlertTriangle, Check, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastMode = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  mode: ToastMode;
  message?: string;
}

interface ToastContextType {
  showToast: (mode: ToastMode, message?: string) => void;
}

const colors: Record<ToastMode, string> = {
  success: "bg-accent-green",
  error: "bg-accent-red",
  info: "bg-accent-blue",
  warning: "bg-accent-yellow",
};

const icons: Record<ToastMode, React.JSX.Element> = {
  success: <Check className="w-8 h-8" />,
  error: <X className="h-8 w-8" />,
  info: <Info className="h-8 w-8" />,
  warning: <AlertTriangle className="h-8 w-8" />,
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((mode: ToastMode, message?: string) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, mode, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="flex flex-col fixed right-0 top-1/2 translate-y-20 z-50">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) throw new Error("useToast must be used within ToastProvider");

  return ctx;
}

function ToastItem({ id, mode, message }: Toast) {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className={`${colors[mode]} rounded-l-md shadow-md flex items-center px-2 py-2 min-h-[40px] max-w-sm ml-1`}
    >
      <span className="mr-2">{icons[mode]}</span>
      {message && <p className="font-bold text-lg">{message}</p>}
    </motion.div>
  );
}
