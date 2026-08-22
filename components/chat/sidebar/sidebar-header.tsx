"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  onToggleSidebar?: () => void;
}

export function SidebarHeader({ onToggleSidebar }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Link href="/" className="flex items-center transition-transform hover:scale-[1.02]">
        <Image
          src="/logo/logo.png"
          alt="Gossip Logo"
          width={240}
          height={65}
          priority
          className="h-10 sm:h-12 w-auto max-h-[48px] object-contain drop-shadow-sm"
        />
      </Link>
      {onToggleSidebar && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-brand-dark dark:text-secondary hover:bg-black/10 dark:hover:bg-white/10 shrink-0 transition-colors rounded-xl"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
