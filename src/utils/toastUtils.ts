
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive" | "success";

interface ToastOptions {
  description?: string;
  variant?: ToastVariant;
}

export const toast = (message: string, options?: ToastOptions) => {
  // Sonner expects a simple format without 'title' property
  sonnerToast(message, {
    description: options?.description
    // Variant is handled separately in Sonner
  });
};
