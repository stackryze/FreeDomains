"use client";
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

const DOT_STYLES = {
  default: "bg-foreground",
  success: "bg-emerald-500",
  destructive: "bg-destructive",
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <span
              className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                DOT_STYLES[variant] || DOT_STYLES.default
              }`}
              aria-hidden="true"
            />
            <div className="grid gap-1 flex-1 min-w-0">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
