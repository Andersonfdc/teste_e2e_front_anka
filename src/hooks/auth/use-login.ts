import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import authRoutes from "@/services/auth-services";
import type { ApiError } from "@/services/api/error";

export const loginSchema = z.object({
  email: z.email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<number | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const submitLogin = useCallback(
    async (values: LoginFormValues): Promise<number | null> => {
      setIsLoading(true);
      resetStatus();
      try {
        const res = await authRoutes.login({
          email: values.email,
          password: values.password,
        });
        setSuccess(res.message || "Código enviado. Verifique seu e-mail.");
        if (typeof res.challengeId === "number") {
          setChallengeId(res.challengeId);
          return res.challengeId;
        }
        return null;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError?.message || "Erro ao fazer login");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [resetStatus],
  );

  return {
    form,
    isLoading,
    error,
    success,
    challengeId,
    submitLogin,
    resetStatus,
  };
}
