"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export type NavTab = {
  href: string;
  label: React.ReactNode;
  disabled?: boolean;
  match?: "startsWith" | "equals";
};

export type PageContextValue = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: NavTab[];
  activeHref?: string;
  pathname: string;
};

const PageContext = React.createContext<PageContextValue | null>(null);

export function usePage() {
  const ctx = React.useContext(PageContext);
  if (!ctx) {
    throw new Error("usePage must be used within <PageProvider />");
  }
  return ctx;
}

export interface PageProviderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: NavTab[];
  children: React.ReactNode;
}

export function PageProvider({ title, description, actions, tabs, children }: PageProviderProps) {
  const pathname = usePathname();

  const activeHref = React.useMemo(() => {
    if (!tabs || tabs.length === 0) return undefined;
    for (const tab of tabs) {
      const mode = tab.match ?? "startsWith";
      if (mode === "equals" && pathname === tab.href) return tab.href;
      if (mode === "startsWith" && pathname.startsWith(tab.href)) return tab.href;
    }
    return undefined;
  }, [pathname, tabs]);

  const value = React.useMemo<PageContextValue>(
    () => ({ title, description, actions, tabs, activeHref, pathname }),
    [title, description, actions, tabs, activeHref, pathname]
  );

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}


