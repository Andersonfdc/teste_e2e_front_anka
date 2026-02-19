"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { PageProvider, usePage } from "@/contexts/PageContext";

import type { NavTab } from "@/contexts/PageContext";

export interface AppPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: NavTab[];
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

function PageHeader({ className, contentClassName, children }: { className?: string; contentClassName?: string; children: React.ReactNode }) {
  const { title, description, actions, tabs, activeHref } = usePage();
  const currentTabValue = React.useMemo(() => {
    if (Array.isArray(tabs) && tabs.length > 0) {
      return activeHref ?? tabs[0].href;
    }
    return undefined;
  }, [activeHref, tabs]);

  return (
    <div className={cn("max-w-7xl mx-auto", className)}>
      <header className="flex flex-col gap-2 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold truncate">{title}</h1>
            {description ? (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>

        {Array.isArray(tabs) && tabs.length > 0 ? (
          <Tabs value={currentTabValue} className="mt-2">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.href} value={tab.href} asChild disabled={tab.disabled}>
                  <Link href={tab.href} prefetch>{tab.label}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}
      </header>

      <section className={cn("space-y-6", contentClassName)}>{children}</section>
    </div>
  );
}

export const AppPage = React.memo(function AppPage({
  title,
  description,
  actions,
  tabs,
  children,
  className,
  contentClassName,
}: AppPageProps) {
  return (
    <PageProvider title={title ?? null} description={description} actions={actions} tabs={tabs}>
      <PageHeader className={className} contentClassName={contentClassName}>
        {children}
      </PageHeader>
    </PageProvider>
  );
});


