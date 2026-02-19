"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function RedefinePasswordSuccess() {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-center items-center min-h-screen p-4 text-center">
      <CheckCircle2 className="w-16 h-16 text-white fill-primary mb-6" />
      <h1 className="text-4xl font-bold mt-4">
        Senha foi redefinida com sucesso
      </h1>
      <Link href="/auth/login" className="w-full">
        <Button className="w-full mt-8">Voltar para login</Button>
      </Link>
    </div>
  );
}
