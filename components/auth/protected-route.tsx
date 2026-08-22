"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquareCode } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [mounted, setMounted] = React.useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-primary dark:bg-[#0D100B] text-brand-dark transition-colors duration-200">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-brand-secondary/80 dark:bg-card border-2 border-brand-dark/20 dark:border-white/10 shadow-2xl backdrop-blur-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark shadow-lg">
            <MessageSquareCode className="h-7 w-7 animate-bounce" />
          </div>
          <div className="flex items-center gap-2 text-sm font-extrabold">
            <Loader2 className="h-5 w-5 animate-spin text-brand-dark dark:text-secondary" />
            <span>Verifying Gossip Workspace Session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
