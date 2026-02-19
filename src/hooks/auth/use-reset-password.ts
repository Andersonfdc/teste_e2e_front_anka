import { useCallback, useState } from "react";
import authRoutes from "@/services/auth-services";
import type { ApiError } from "@/services/api/error";

interface UseResetPasswordResult {
  loading: boolean;
  error: { message: string; statusCode?: number } | null;
  resetPassword: (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<true | null>;
}

export function useResetPassword(): UseResetPasswordResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<UseResetPasswordResult["error"]>(null);

  const resetPassword = useCallback(
    async (payload: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    }): Promise<true | null> => {
      setLoading(true);
      setError(null);
      try {
        await authRoutes.resetPassword(payload);
        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        const apiError = err as ApiError;
        setError({ message: apiError?.message || "Erro ao redefinir senha." });
        return null;
      }
    },
    [authRoutes],
  );

  return { loading, error, resetPassword };
}
