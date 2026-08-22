"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, MessageSquare, Users, Zap, Bell, Search } from "lucide-react";
import { Container } from "@/components/ui/container";

const features = [
  {
    icon: MessageSquare,
    title: "1-on-1 & Group Chats",
    desc: "Start private direct messages or multi-participant group chats with custom names and member management.",
    badge: "Real-time",
  },
  {
    icon: ShieldCheck,
    title: "Admin Controls & Permissions",
    desc: "Promote members to Admin, rename group conversations, and manage participant membership seamlessly.",
    badge: "Admin Tools",
  },
  {
    icon: Zap,
    title: "Instant Delivery & Seen Ticks",
    desc: "Visual message status indicators: sending spinner, single tick for sent, double green checkmark for read status.",
    badge: "Live Status",
  },
  {
    icon: Search,
    title: "Smart Phone & Name Search",
    desc: "Find teammates instantly by searching names or phone numbers with multi-format BD/International matching.",
    badge: "Multi-Format",
  },
  {
    icon: Bell,
    title: "Unread Badges & Bold Hints",
    desc: "Clear unread message counters and bold message indicators so you never miss an incoming chat.",
    badge: "Notifications",
  },
  {
    icon: Users,
    title: "Active Contact Indicator",
    desc: "See who is currently active with dynamic online avatar badges derived straight from conversation threads.",
    badge: "Presence",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-secondary dark:bg-[#171914] text-brand-dark transition-colors duration-200 relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-brand-primary/40 blur-3xl" />

      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="px-3.5 py-1 rounded-full bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black tracking-wider uppercase inline-block mb-3 shadow-md"
          >
            Powerful Architecture
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 50, scale: 0.92, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark dark:text-secondary tracking-tight"
          >
            Everything You Need for Modern Team Messaging
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-brand-muted dark:text-muted-foreground font-medium"
          >
            Built with production-grade REST APIs, Socket.io WebSockets, and state-of-the-art TanStack Query state caching.
          </motion.p>
        </div>

        {/* Feature Showcase Grid — Rise from Water Pop-Up Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 70, scale: 0.88, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  type: "spring",
                  stiffness: 170,
                  damping: 18,
                  mass: 0.8,
                  delay: idx * 0.07,
                }}
                className="p-6 rounded-3xl bg-white/70 dark:bg-card border-2 border-brand-dark/15 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-dark/10 dark:bg-white/10 text-[11px] font-extrabold text-brand-dark dark:text-secondary">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-brand-dark dark:text-secondary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-brand-muted dark:text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Feature Visual Preview — Spring Rise */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="p-6 sm:p-10 rounded-3xl bg-brand-primary dark:bg-card border-2 border-brand-dark/20 dark:border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-secondary tracking-tight">
              Real-time Group Details & Admin Controls
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-brand-muted dark:text-muted-foreground leading-relaxed">
              Admins can easily promote group members to Admin status, update group titles inline, and manage group member lists with zero latency socket sync.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-xl bg-white/80 dark:bg-background text-brand-dark text-xs font-black border border-brand-dark/10">✓ Group Rename</span>
              <span className="px-3 py-1 rounded-xl bg-white/80 dark:bg-background text-brand-dark text-xs font-black border border-brand-dark/10">✓ Admin Badges</span>
              <span className="px-3 py-1 rounded-xl bg-white/80 dark:bg-background text-brand-dark text-xs font-black border border-brand-dark/10">✓ Member Removal</span>
            </div>
          </div>
          <div className="lg:col-span-6 relative h-60 sm:h-72 rounded-2xl overflow-hidden bg-white/40 dark:bg-background/40 border border-brand-dark/15 p-2 shadow-inner">
            <Image
              src="/images/chat-1.avif"
              alt="Gossip Group Features Showcase"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-xl hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
