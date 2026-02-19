import { useCallback, useState } from "react";
import authRoutes from "@/services/auth-services";
import type { ApiError } from "@/services/api/error";

export function useResendOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resendOtp = useCallback(async (challengeId: number | null) => {
    if (!challengeId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await authRoutes.resendOtp({ challengeId });
      setSuccess(res.message || "Código reenviado");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message || "Erro ao reenviar código");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return { isLoading, error, success, resendOtp, resetStatus };
}
