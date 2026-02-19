"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/use-login";

export default function LoginForm() {
  const router = useRouter();
  const {
    form,
    isLoading: isLoginLoading,
    error: loginError,
    success: loginSuccess,
    submitLogin,
  } = useLogin();

  const handleLoginFormSubmit = form.handleSubmit(async (values) => {
    const id = await submitLogin(values);
    if (typeof id === "number") {
      router.push(`/auth/login/otp/${id}`);
    }
  });

  return (
    <div className="space-y-4 w-full flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mt-4">
          Login
        </h1>
      </div>
      {loginError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {loginError}
        </div>
      )}
      {loginSuccess && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          {loginSuccess}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={handleLoginFormSubmit}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    disabled={isLoginLoading}
                    placeholder="seu@email.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    disabled={isLoginLoading}
                    placeholder="••••••••"
                  />
                </FormControl>
                <FormMessage />
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-muted-foreground"
                >
                  Esqueceu sua senha?
                </Link>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoginLoading} className="w-full">
            {isLoginLoading ? "Enviando..." : "Enviar código"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
