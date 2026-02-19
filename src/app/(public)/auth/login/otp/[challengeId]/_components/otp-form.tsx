"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useVerifyOtp } from "@/hooks/auth/use-verify-otp";
import { useResendOtp } from "@/hooks/auth/use-resend-otp";
import { cn } from "@/lib/utils";
// AuthLogo optional: remove if not present

interface OtpFormProps {
  challengeId: number;
}

export default function OtpForm({ challengeId }: OtpFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rememberMe = searchParams.get("rememberMe") === "true";

  const [timeLeft, setTimeLeft] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const {
    form,
    isLoading: verifyLoading,
    error: verifyError,
    submitOtp,
  } = useVerifyOtp();
  const { isLoading: resendLoading, resendOtp } = useResendOtp();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [timeLeft]);

  useEffect(() => {
    form.setValue("rememberMe", !!rememberMe);
  }, [form, rememberMe]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await submitOtp(challengeId, values);
    if (result.ok) {
      router.push("/home");
    } else {
      form.setError("code", { message: result.error });
    }
  });

  const handleResendCode = async () => {
    if (!canResend || resendLoading) return;
    await resendOtp(challengeId);
    setTimeLeft(45);
    setCanResend(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-center min-h-screen p-4">
      {/* Logo placeholder - add your brand logo here if desired */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mt-4">
          Verificação de Segurança
        </h1>
        <p className="mt-2 text-base">
          Enviamos um código de verificação de 6 dígitos para o seu email
          cadastrado.
        </p>
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 items-center"
        >
          <p className="text-2xl font-medium">Digite o código:</p>
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    className={cn(
                      verifyError &&
                        "border-destructive focus:border-destructive focus:ring-destructive",
                    )}
                  >
                    <InputOTPGroup className="gap-4">
                      <InputOTPSlot index={0} aria-invalid={!!verifyError} />
                      <InputOTPSlot index={1} aria-invalid={!!verifyError} />
                      <InputOTPSlot index={2} aria-invalid={!!verifyError} />
                      <InputOTPSlot index={3} aria-invalid={!!verifyError} />
                      <InputOTPSlot index={4} aria-invalid={!!verifyError} />
                      <InputOTPSlot index={5} aria-invalid={!!verifyError} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || resendLoading}
              className={`font-medium ${canResend && !resendLoading ? "hover:underline" : "text-muted-foreground cursor-not-allowed"}`}
            >
              {resendLoading ? "Reenviando..." : "Reenviar código"}
            </button>
            {!canResend && (
              <p className="text-muted-foreground">
                Você pode reenviar em{" "}
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={verifyLoading}
            className="w-full mt-4"
          >
            {verifyLoading ? "Confirmando..." : "Confirmar"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
