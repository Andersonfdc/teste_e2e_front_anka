"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePage } from "@/contexts/PageContext";

export default function UsersIndexRedirect() {
  const { pathname, tabs } = usePage();
  const router = useRouter();

  React.useEffect(() => {
    if (pathname === "/users" && Array.isArray(tabs) && tabs.length > 0) {
      router.replace(tabs[0].href);
    }
  }, [pathname, tabs, router]);

  return null;
}
