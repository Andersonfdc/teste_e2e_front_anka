"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PrivateContent({ children }: { children: ReactNode }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div
      className={cn(
        "min-h-screen w-full transition-all duration-500",
        collapsed ? "md:ml-[70px]" : "md:ml-[230px]",
      )}
    >
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
