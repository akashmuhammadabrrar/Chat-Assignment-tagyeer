"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>
  );
}
