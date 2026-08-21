"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service if needed
    console.error("Gossip Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0D100B] py-16">
      <Container className="max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-6 border border-rose-500/20">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-muted-foreground dark:text-[#B7B8A9] leading-relaxed">
          An unexpected error occurred in Gossip. Please try refreshing the view or returning home.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs font-mono text-muted-foreground/70 bg-muted/40 p-2 rounded-lg inline-block">
            Digest Code: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="brandPrimary"
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
