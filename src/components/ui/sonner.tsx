"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          // Design System tokens
          // Normal toast
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          // Error toast
          "--error-bg": "var(--destructive)",
          "--error-text": "var(--primary-foreground)",
          "--error-border": "var(--destructive)",
          // Success toast
          "--success-bg": "var(--accent)",
          "--success-text": "var(--accent-foreground)",
          "--success-border": "var(--accent)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
