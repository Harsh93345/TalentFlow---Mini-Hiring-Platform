import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive" | "success" | "warning";

interface ToastInput {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
}

function toast({ title, description, variant = "default" }: ToastInput) {
  const options = {
    description: description ? String(description) : undefined,
    duration: 4000,
  };

  switch (variant) {
    case "destructive":
      return sonnerToast.error(title ? String(title) : "Error", options);
    case "success":
      return sonnerToast.success(title ? String(title) : "Success", options);
    case "warning":
      return sonnerToast.warning(title ? String(title) : "Warning", options);
    default:
      return sonnerToast(title ? String(title) : "Notification", options);
  }
}

function useToast() {
  return React.useMemo(() => ({ toast }), []);
}

export { useToast, toast };
