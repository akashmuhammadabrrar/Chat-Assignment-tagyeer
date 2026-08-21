"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Zap, Users, MessageSquare, Lock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const TITLE = "Where Whispers Happen in Real Time.";
const CHARS = TITLE.split("");
const STAGGER = 0.07;
const ANIM_DURATION = 0.5;
const WAVE_PERIOD = CHARS.length * STAGGER;

function FloatingTitle() {
  return (
    <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.2] flex flex-wrap">
      {CHARS.map((char, i) =>
        char === " " ? (
          <span key={i} style={{ display: "inline-block", width: "0.3em" }} />
        ) : (
          <motion.span
            key={i}
            className="inline-block"
            style={{ willChange: "transform, opacity" }}
            animate={{ y: [0, -18, 0], opacity: [0.8, 1, 0.8] }}
            transition={{
              duration: ANIM_DURATION,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: WAVE_PERIOD - ANIM_DURATION,
              delay: i * STAGGER,
            }}
          >
            {char}
          </motion.span>
        )
      )}
    </h1>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden pt-0 pb-12 sm:pb-20 bg-brand-primary text-brand-dark transition-colors duration-200 flex flex-col justify-between">
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-white/20 blur-3xl dark:bg-black/20" />

      <Container className="my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-1 sm:pt-4 pb-8 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            <FloatingTitle />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg lg:text-xl text-brand-muted font-medium leading-relaxed max-w-xl"
            >
              Experience lightning-fast team communication with zero latency, end-to-end security, multi-channel workspaces, and instant media sharing. Powered by state-of-the-art Redux Toolkit and TanStack Query caching.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/chat" className="w-full sm:w-auto">
                <button className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl border-2 border-[#171914] dark:border-[#FAFD8F] text-[#171914] dark:text-[#FAFD8F] transition-colors duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                  <span className="absolute inset-0 bg-secondary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-[#171914] transition-colors duration-300">
                    <span>Start Chatting Free</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>

              <a href="#features" className="w-full sm:w-auto">
                <button className="group relative overflow-hidden w-full sm:w-auto px-7 py-4 text-base font-bold rounded-2xl border-2 border-[#171914] dark:border-[#FAFD8F] text-[#171914] dark:text-[#FAFD8F] transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer">
                  <span className="absolute inset-0 bg-[#171914] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-[#FAFD8F] transition-colors duration-300">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171914]/15 group-hover:bg-white/20 transition-colors">
                      <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    </div>
                    <span>Explore Features</span>
                  </span>
                </button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-brand-muted"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-dark" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-dark" />
                <span>60-second instant setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-dark" />
                <span>Free tier forever</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl border-2 border-white/40 dark:border-border bg-white/20 dark:bg-card/60 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
                <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[420px] rounded-2xl overflow-hidden bg-white dark:bg-background p-2 sm:p-4 border border-foreground/10 shadow-lg flex items-center justify-center">
                  <Image
                    src="/images/chat-vect-1.png"
                    alt="Gossip Real-Time Chat Vector"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-2 hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-4 w-44 sm:w-56 lg:w-64 rounded-2xl border-2 border-foreground/15 dark:border-border bg-white dark:bg-card p-2 sm:p-3 shadow-2xl"
                >
                  <div className="relative w-full h-28 sm:h-36 rounded-xl overflow-hidden bg-secondary/40 dark:bg-muted">
                    <Image
                      src="/images/chat-5.png"
                      alt="Gossip Chat Workspace Preview"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-1"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          id="features"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 sm:mt-16 border-t border-foreground/15 dark:border-border pt-10"
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {[
              { value: "99.99%", label: "Service Uptime Guarantee", icon: Zap },
              { value: "< 10ms", label: "WebSocket Message Speed", icon: MessageSquare },
              { value: "100K+", label: "Active Team Chatters", icon: Users },
              { value: "256-bit", label: "AES E2E Security Standard", icon: Lock },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl bg-white/25 dark:bg-card border border-foreground/15 dark:border-border transition-transform hover:-translate-y-1"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background dark:bg-secondary dark:text-secondary-foreground mb-2 font-bold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs font-semibold text-brand-muted">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
