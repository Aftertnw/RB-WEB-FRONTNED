import { ToastProvider } from "@/components/toast/ToastProvider";
import AppShell from "@/components/layout/AppShell";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthGuard>
        <AppShell>{children}</AppShell>
      </AuthGuard>
    </ToastProvider>
  );
}
