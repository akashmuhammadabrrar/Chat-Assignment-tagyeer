"use client";

import * as React from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>
  );
}
