"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export function SidebarHeader() {
  return (
    <div className="flex items-center">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo/logo.png"
          alt="Gossip Logo"
          width={140}
          height={40}
          priority
          className="h-8 w-auto object-contain"
        />
      </Link>
    </div>
  );
}
