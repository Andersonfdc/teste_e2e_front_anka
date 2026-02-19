import { AppPage } from '@/components/ui/custom/app-page';
import { usersTabs } from './tabs';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppPage title="Usuários" description="Gestão de usuários" tabs={usersTabs}>
      {children}
    </AppPage>
  );
}
