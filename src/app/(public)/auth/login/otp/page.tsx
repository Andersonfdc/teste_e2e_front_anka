import { redirect } from "next/navigation";

export default function OtpPage() {
  // If user navigates to the OTP page directly without a challengeId,
  // redirect them back to the login page
  redirect("/auth/login");
}
