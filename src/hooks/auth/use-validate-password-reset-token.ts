import { useState } from "react";
import api from "@/services/api/index";
import type { AxiosError } from "axios";
import { ValidateTokenResponse } from "@/services/auth-services/types";
import type { ApiError } from "@/services/api/error";

interface UseValidatePasswordResetTokenResult {
  loading: boolean;
  error: ApiError | null;
  validatePasswordResetToken: (token: string) => Promise<ValidateTokenResponse | null>;
}

export function useValidatePasswordResetToken(): UseValidatePasswordResetTokenResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function validateToken(token: string): Promise<ValidateTokenResponse | null> {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ValidateTokenResponse>(`/auth/password/validate?token=${encodeURIComponent(token)}`);
      setLoading(false);
      return res.data;
    } catch (err: unknown) {
      setLoading(false);

      const error = err as ApiError;

      setError(error);
      return null;
    }
  }

  return { loading, error, validatePasswordResetToken: validateToken };
}
