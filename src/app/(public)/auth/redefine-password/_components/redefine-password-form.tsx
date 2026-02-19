"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RedefinePasswordSuccess from "./redefine-password-success";
import { useResetPassword } from "@/hooks/auth/use-reset-password";
// AuthLogo optional; remove import if component not present
import { Check, X } from "lucide-react";

const redefinePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres.")
      .regex(/[A-Z]/, "A senha deve conter pelo menos 1 letra maiúscula.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "A senha deve conter pelo menos 1 caractere especial.",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export default function RedefinePasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [redefined, setRedefined] = useState(false);
  const [password, setPassword] = useState("");

  const methods = useForm({
    resolver: zodResolver(redefinePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const { handleSubmit, control, formState } = methods;
  const { resetPassword, loading, error } = useResetPassword();

  // Password validation checks
  const passwordChecks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const onSubmit = async (data: z.infer<typeof redefinePasswordSchema>) => {
    if (!token) {
      return;
    }
    const response = await resetPassword({
      token,
      ...data,
    });

    if (response) {
      setRedefined(true);
    }
  };

  if (redefined) {
    return <RedefinePasswordSuccess />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-center min-h-screen p-4">
      {/* Logo placeholder - add your brand logo here if desired */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mt-4">
          Crie uma nova senha
        </h1>
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <FormField
            name="newPassword"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Senha"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setPassword(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar nova senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Insira a mesma senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-sm">
            <p>A nova senha deve conter:</p>
            <ul className="space-y-1 mt-2">
              <li
                className={`flex items-center gap-2 ${passwordChecks.minLength ? "text-green-600" : "text-gray-500"}`}
              >
                {passwordChecks.minLength ? (
                  <Check size={16} />
                ) : (
                  <X size={16} />
                )}
                Mínimo de 8 caracteres
              </li>
              <li
                className={`flex items-center gap-2 ${passwordChecks.hasUppercase ? "text-green-600" : "text-gray-500"}`}
              >
                {passwordChecks.hasUppercase ? (
                  <Check size={16} />
                ) : (
                  <X size={16} />
                )}
                1 letra maiúscula
              </li>
              <li
                className={`flex items-center gap-2 ${passwordChecks.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}
              >
                {passwordChecks.hasSpecialChar ? (
                  <Check size={16} />
                ) : (
                  <X size={16} />
                )}
                1 caractere especial (!@#$%^&*(),.?&quot;:{}|{"<>"})
              </li>
            </ul>
          </div>
          {(formState.errors.root || error) && (
            <p className="text-destructive text-sm mt-2">
              {error?.message || formState.errors.root?.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading || !token}
            className="w-full mt-4"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
