import RedefinePasswordForm from "./_components/redefine-password-form";
import { Suspense } from "react";
import { FormLoading } from "@/components/ui/loading";

export default function RedefinePasswordPage() {
  return (
    <Suspense fallback={<FormLoading />}>
      <RedefinePasswordForm />
    </Suspense>
  );
}
