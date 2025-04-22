
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive" | "success";

interface ToastOptions {
  description?: string;
  variant?: ToastVariant;
}

export const toast = (title: string, options?: ToastOptions) => {
  sonnerToast(title, {
    description: options?.description,
    variant: options?.variant
  });
};
