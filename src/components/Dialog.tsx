import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => dialogRef.current?.focus(), 0);
    }
  }, [isOpen]);

  if (typeof document === "undefined" || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed flex items-center justify-center inset-0 z-50 ">
      <div
        ref={dialogRef}
        className={cn(
          "relative rounded-md grid w-full max-w-lg gap-4 bg-bg-soft px-2 py-3 shadow-md mx-1",
        )}
      >
        {children}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3 cursor-pointer text-fg-muted"
        >
          <X size={20} />
        </button>
      </div>
    </div>,
    document.body,
  );
};

const DialogContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn(className)}>{children}</div>;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-left", className)}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex  justify-end ", className)} {...props} />
);

const DialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn("text-lg font-bold font-semibold text-fg ml-1", className)}
    {...props}
  />
);

const DialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-md text-fg mx-2.5", className)} {...props} />
);

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
