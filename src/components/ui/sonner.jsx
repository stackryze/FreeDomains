"use client";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme === "light" ? "light" : "dark"}
      position="bottom-right"
      className="toaster group font-sans"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-card/95 backdrop-blur-md text-card-foreground border border-border rounded-xl shadow-2xl font-sans text-xs px-4 py-3.5",
          title: "text-xs font-semibold tracking-tight text-foreground",
          description: "text-xs text-muted-foreground leading-relaxed",
          actionButton:
            "bg-foreground text-background rounded-full text-xs font-medium px-3 py-1",
          cancelButton:
            "bg-secondary text-foreground rounded-full text-xs font-medium px-3 py-1",
          closeButton:
            "bg-card border-border text-muted-foreground hover:text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
