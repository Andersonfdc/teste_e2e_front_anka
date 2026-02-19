"use client";

import { useState } from "react";
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
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";
// AuthLogo optional; remove import if component not present
import ForgotPasswordSuccess from "./forgot-password-success";

export default function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const {
    forgotPassword,
    loading,
    error,
    forgotPasswordForm,
    forgotPasswordSchema,
  } = useForgotPassword();
  const { handleSubmit, control } = forgotPasswordForm;

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    const response = await forgotPassword(data);
    if (response) {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <ForgotPasswordSuccess email={forgotPasswordForm.getValues("email")} />
    );
  }

  return (
    <div className="w-full mx-auto max-w-2xl flex flex-col justify-center min-h-screen p-4">
      {/* Logo placeholder - add your brand logo here if desired */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mt-4">
          Esqueceu a senha?
        </h1>
        <p className="mt-2 text-base">
          Informe o e-mail cadastrado para enviarmos um link com instruções para
          redefinição da senha.
        </p>
      </div>
      <FormProvider {...forgotPasswordForm}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-8"
        >
          <FormField
            name="email"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(forgotPasswordForm.formState.errors.root || error) && (
            <p className="text-sm font-medium text-destructive">
              {error?.message ||
                forgotPasswordForm.formState.errors.root?.message}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
