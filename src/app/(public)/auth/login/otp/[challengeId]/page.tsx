import OtpForm from "./_components/otp-form";

interface OtpPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

export default async function OtpPage({ params }: OtpPageProps) {
  const { challengeId } = await params;
  return <OtpForm challengeId={parseInt(challengeId, 10)} />;
}
