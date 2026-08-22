"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Code, Cpu, Smartphone } from "lucide-react";
import { Container } from "@/components/ui/container";

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-brand-primary dark:bg-[#12140D] text-brand-dark transition-colors duration-200 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Image Stack — Spring Pop-Up */}
          <motion.div
            initial={{ opacity: 0, y: 70, scale: 0.88, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl border-2 border-brand-dark/20 dark:border-white/10 bg-white/40 dark:bg-card/40 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
              <div className="relative w-full h-[280px] sm:h-[360px] rounded-2xl overflow-hidden bg-white dark:bg-background border border-brand-dark/10 shadow-lg">
                <Image
                  src="/images/vector-2.jpg"
                  alt="Gossip Workspace Architecture Vector"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating overlay image */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 w-40 sm:w-52 rounded-2xl border-2 border-brand-dark/20 dark:border-border bg-white dark:bg-card p-2 shadow-2xl"
              >
                <div className="relative w-full h-24 sm:h-32 rounded-xl overflow-hidden bg-secondary/50">
                  <Image
                    src="/images/chat-3.jpg"
                    alt="Chat preview avatar"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: About Details — Staggered Pop-Up Cards */}
          <div className="lg:col-span-6 space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="px-3.5 py-1 rounded-full bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black tracking-wider uppercase inline-block shadow-md"
            >
              About Gossip Platform
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40, scale: 0.92, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark dark:text-secondary tracking-tight leading-tight"
            >
              Designed for Speed, Reliability & Seamless UX
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.1 }}
              className="text-sm sm:text-base font-semibold text-brand-muted dark:text-muted-foreground leading-relaxed"
            >
              Gossip is a state-of-the-art chat application tailored for modern team communication. It provides high-concurrency 1-on-1 direct conversations and multi-member group workspaces with zero friction.
            </motion.p>

            {/* Architecture Highlights — Rise from Water Cards */}
            <div className="space-y-3 pt-2">
              {[
                { title: "Next.js 16 App Router & Turbopack", desc: "Lighting-fast static generation and optimized client bundle delivery.", icon: Code },
                { title: "Redux Toolkit & TanStack Query", desc: "Synchronized global active state and smart background API cache invalidation.", icon: Cpu },
                { title: "Fully Responsive Across Devices", desc: "Fluid desktop sidebar drawer, mobile sliding drawers, and touch-optimized components.", icon: Smartphone },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(4px)" }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      type: "spring",
                      stiffness: 170,
                      damping: 18,
                      delay: 0.15 + idx * 0.08,
                    }}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-card border border-brand-dark/15 dark:border-white/10 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="h-9 w-9 rounded-xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark flex items-center justify-center font-bold shrink-0 mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-brand-dark dark:text-secondary">{item.title}</h4>
                      <p className="text-[11px] sm:text-xs font-medium text-brand-muted dark:text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
