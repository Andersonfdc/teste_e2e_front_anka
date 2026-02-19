import { useState } from "react";
import authRoutes from "@/services/auth-services";
import type { ForgotPasswordResponse } from "@/services/auth-services/types";
import type { ApiError } from "@/services/api/error";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";

const forgotPasswordSchema = z.object({
  email: z.email("Email inválido").min(1, "Email é obrigatório"),
});

interface UseForgotPasswordResult {
  loading: boolean;
  error: ApiError | null;
  forgotPassword: (data: {
    email: string;
  }) => Promise<ForgotPasswordResponse | null>;
  forgotPasswordForm: UseFormReturn<z.infer<typeof forgotPasswordSchema>>;
  forgotPasswordSchema: z.ZodSchema<z.infer<typeof forgotPasswordSchema>>;
}

export function useForgotPassword(): UseForgotPasswordResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function forgotPassword(data: {
    email: string;
  }): Promise<ForgotPasswordResponse | null> {
    setLoading(true);
    setError(null);
    try {
      const res = await authRoutes.forgotPassword({ email: data.email });
      return res;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    forgotPassword,
    forgotPasswordForm,
    forgotPasswordSchema,
  };
}
