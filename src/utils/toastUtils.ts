
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive" | "success";

interface ToastOptions {
  description?: string;
  variant?: ToastVariant;
}

export const toast = (title: string, options?: ToastOptions) => {
  sonnerToast(title, {
    description: options?.description
    // We need to remove the variant property as it's not supported by Sonner's ExternalToast type
  });
};
