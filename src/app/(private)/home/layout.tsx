import { AppPage } from "@/components/ui/custom/app-page";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppPage title="Home" description="Bem-vindo ao painel.">
      {children}
    </AppPage>
  );
}