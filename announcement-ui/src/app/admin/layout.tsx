"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar, AdminHeader } from "@/components/layout";
import { useAuthStore, useUIStore } from "@/stores";
import { LoadingScreen } from "@/components/ui";
import { ROUTES } from "@/config/constants";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  
  const isLoginPage = pathname === ROUTES.ADMIN.LOGIN;

  useEffect(() => {
    if (!isLoginPage) {
      fetchUser();
    }
  }, [fetchUser, isLoginPage]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push(ROUTES.ADMIN.LOGIN);
    }
  }, [isLoading, isAuthenticated, router, isLoginPage]);

  // For login page, render without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <LoadingScreen message="Memuat..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
