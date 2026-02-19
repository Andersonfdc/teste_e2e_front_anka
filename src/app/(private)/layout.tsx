import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/custom/sidebar/app-sidebar";
import AppProviders from "@/providers/app-provider";
import { PrivateContent } from "./_components/private-content";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <AppProviders>
        <AppSidebar />
        <PrivateContent>
          <div className="text-foreground">{children}</div>
        </PrivateContent>
      </AppProviders>
    </SidebarProvider>
  );
}
