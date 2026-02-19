"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export type AppSidebarItemProps = React.ComponentProps<typeof SidebarMenuButton>;

export function AppSidebarItem({ className, ...props }: AppSidebarItemProps) {
  return (
    <SidebarMenuButton
      className={cn(
        // Base and hover: white text on black sidebar background using DS tokens
        "text-background hover:bg-background/10 hover:text-background",
        // Active: white background with black text via DS tokens
        "data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:font-medium",
        className,
      )}
      {...props}
    />
  );
}


