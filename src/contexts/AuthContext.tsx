"use client";

import { createContext, useContext, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { deleteCookie } from "cookies-next";
import type { TokenModel } from "@/services/auth-services/types";
import { useGetMe } from "@/hooks/permissions/use-get-me";
import type { ApiError } from "@/services/api/error";

type AuthContextValue = {
  user: TokenModel | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
};

const publicRoutes = ["/auth/login", "/auth/login/otp", "/auth/forgot-password", "/auth/reset-password"];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isGetMeLoading, isGetMeError, getMeRefetch, getMeError } =
    useGetMe();
  const router = useRouter();
  const pathname = usePathname();

  // Handle authentication state changes and redirects
  useEffect(() => {
    // Skip redirect logic while loading
    if (isGetMeLoading) return;

    const isPublicRoute = publicRoutes.includes(pathname);
    const isPrivateRoute = !isPublicRoute;

    const statusCode =
      (getMeError as ApiError | undefined)?.statusCode ??
      (getMeError as any)?.response?.status;
    const isUnauthorized = statusCode === 401;

    // If user is not authenticated and trying to access private routes
    if (!user && isPrivateRoute) {
      router.push("/auth/login");
      return;
    }

    // If user is authenticated and trying to access auth routes (login, etc.)
    if (user && isPublicRoute) {
      router.push("/home");
      return;
    }

    // If authentication failed (token invalid/expired), clear cookies and redirect
    if (!isGetMeLoading && (isGetMeError || isUnauthorized) && !isPublicRoute) {
      deleteCookie("token");
      deleteCookie("refreshToken");
      deleteCookie("userId");
      router.push("/auth/login");
      return;
    }
  }, [user, isGetMeLoading, isGetMeError, getMeError, pathname, router]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isLoading: isGetMeLoading,
      isAuthenticated: !!user,
      refetch: getMeRefetch,
    };
  }, [user, isGetMeLoading, getMeRefetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
