"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Heart, ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#171914] text-[#FAFD8F] border-t border-white/10 pt-12 pb-8 transition-colors duration-200 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
            {/* Col 1: Logo & Tagline */}
            <div className="md:col-span-5 space-y-4">
              <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
                <Image
                  src="/logo/logo.png"
                  alt="Gossip Logo"
                  width={200}
                  height={55}
                  className="h-10 w-auto object-contain drop-shadow-md brightness-110"
                />
              </Link>
              <p className="text-xs font-semibold text-white/70 max-w-sm leading-relaxed">
                Industry-standard real-time team chat application powered by Socket.io WebSockets, Redux Toolkit, and TanStack Query state management.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-secondary">Quick Navigation</h4>
              <ul className="space-y-2 text-xs font-extrabold text-white/80">
                <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
                <li><Link href="#features" className="hover:text-secondary transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-secondary transition-colors">About Architecture</Link></li>
                <li><Link href="/chat" className="hover:text-secondary transition-colors">Go to Workspace</Link></li>
              </ul>
            </div>

            {/* Col 3: Tech Stack Badges */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-secondary">Tech Stack</h4>
              <div className="flex flex-wrap gap-2 text-[11px] font-bold text-white/90">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">Next.js 16 App Router</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">Redux Toolkit</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">TanStack Query v5</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">Socket.io Client</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">Framer Motion</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">Tailwind CSS</span>
              </div>
            </div>
          </div>

          {/* Bottom copyright & scroll to top */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-white/60">
            <div className="flex items-center gap-1.5">
              <span>© {new Date().getFullYear()} Gossip Chat Platform. Built with</span>
              <Heart className="h-3.5 w-3.5 text-red-400 fill-current inline" />
              <span>for Taghyeer Assignment.</span>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-secondary hover:text-[#171914] text-white text-xs font-bold transition-all cursor-pointer"
              title="Scroll to top"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}
