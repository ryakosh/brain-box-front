"use client";

import { createContext, useCallback, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/Dialog";

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  rejectLabel?: string;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve?: (result: boolean) => void;
}

const ConfirmContext = createContext<{
  confirm: (options: ConfirmOptions) => Promise<boolean>;
} | null>(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);

  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }

  return ctx.confirm;
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: "Are you sure?",
    description: "",
    confirmLabel: "Confirm",
    rejectLabel: "Cancel",
  });
  const [loading, setLoading] = useState(false);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ isOpen: true, ...options, resolve });
    });
  }, []);

  const handleClose = useCallback(() => {
    state.resolve?.(false);
    setState((s) => ({ ...s, isOpen: false }));
  }, [state.resolve]);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    state.resolve?.(true);
    setLoading(false);
    setState((s) => ({ ...s, isOpen: false }));
  }, [state.resolve]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog isOpen={state.isOpen} onClose={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{state.title}</DialogTitle>
            {state.description && (
              <DialogDescription>{state.description}</DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            <div className="flex mt-3 justify-center gap-2">
              <button
                className="py-2 px-3 font-semibold bg-accent-red hover:opacity-90 transition-opacity rounded-md shadow-md cursor-pointer"
                type="button"
                disabled={loading}
                onClick={handleConfirm}
              >
                {state.confirmLabel}
              </button>
              <button
                className="py-2 px-3 text-fg-muted font-semibold bg-none cursor-pointer"
                type="button"
                disabled={loading}
                onClick={handleClose}
              >
                {state.rejectLabel}
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
