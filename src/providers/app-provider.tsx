import { type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/providers/client-provider";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
