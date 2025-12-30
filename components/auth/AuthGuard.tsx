"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Wait for initial auth check
    if (loading) return;

    if (!user) {
      // Allow access to login/register pages regardless (though typically not wrapped in AuthGuard)
      // Since this is for (app) routes, we generally assume they need protection.
      // Redirect to login preserving the return url
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
    } else {
      setAuthorized(true);
    }
  }, [user, loading, router, pathname]);

  // Show nothing or a loading spinner while checking
  if (loading || !authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
}
