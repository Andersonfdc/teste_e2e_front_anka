import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import authRoutes from "@/services/auth-services";
import { setCookie } from "cookies-next";
import type { ApiError } from "@/services/api/error";

export const otpSchema = z.object({
  code: z
    .string()
    .min(6, "Código deve ter 6 dígitos")
    .max(6, "Código deve ter 6 dígitos")
    .regex(/^\d{6}$/, "Código deve ter 6 dígitos"),
  rememberMe: z.boolean().default(false),
});

export type OtpFormInput = z.input<typeof otpSchema>;
export type OtpFormValues = z.output<typeof otpSchema>;

export function useVerifyOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<OtpFormInput, any, OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "", rememberMe: false },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const submitOtp = useCallback(
    async (
      challengeId: number | null,
      values: OtpFormValues,
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (!challengeId)
        return { ok: false as const, error: "Desafio inválido" };
      setIsLoading(true);
      resetStatus();
      try {
        const res = await authRoutes.verifyOtp({
          challengeId,
          code: values.code,
          rememberMe: values.rememberMe,
        });

        const maxAge = values.rememberMe ? 60 * 60 * 24 * 30 : undefined;
        setCookie("token", res.accessToken, { maxAge });
        setCookie("refreshToken", res.refreshToken, { maxAge });
        setCookie("userId", res.user.id, { maxAge });

        setSuccess(res.message || "Login realizado com sucesso");
        return { ok: true as const };
      } catch (err) {
        const apiError = err as ApiError;
        const message = apiError?.message || "Código inválido";
        setError(message);
        return { ok: false as const, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [resetStatus],
  );

  return { form, isLoading, error, success, submitOtp, resetStatus };
}
