"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, User as UserIcon, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [phone, setPhone] = React.useState("");
  const [name, setName] = React.useState("");
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const { login, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();

    if (!trimmedPhone) {
      setValidationError("Please enter your phone number.");
      return;
    }

    if (!trimmedName) {
      setValidationError("Please enter your name.");
      return;
    }

    login({ phone: trimmedPhone, name: trimmedName });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-primary dark:bg-[#0D100B] text-brand-dark transition-colors duration-200 p-4 sm:p-6">
      <Container className="my-auto max-w-md w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-brand-dark dark:text-secondary hover:opacity-80 mb-6 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Animated Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border-2 border-brand-dark/20 dark:border-white/10 bg-brand-secondary/90 dark:bg-card p-6 sm:p-8 shadow-2xl backdrop-blur-md"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <Link href="/" className="mb-4 transition-transform hover:scale-105">
              <Image
                src="/logo/logo.png"
                alt="Gossip Logo"
                width={200}
                height={55}
                priority
                className="h-12 w-auto object-contain drop-shadow-md"
              />
            </Link>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark dark:text-secondary tracking-tight">
              Login to Whisper
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-brand-muted dark:text-muted-foreground font-semibold max-w-xs">
              Enter your phone number & display name to access your workspace.
            </p>
          </div>

          {/* Validation or API Error Alerts */}
          {(validationError || error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive flex items-start gap-2.5 text-xs font-bold"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{validationError || error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number Field */}
            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-brand-dark dark:text-secondary mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/50 dark:text-secondary/50" />
                <input
                  type="text"
                  required
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border-2 border-brand-dark/20 dark:border-white/10 bg-white/70 dark:bg-background pl-10 pr-4 py-3 text-sm font-extrabold text-brand-dark dark:text-foreground placeholder:text-brand-dark/40 dark:placeholder:text-muted-foreground focus:outline-none focus:border-brand-dark dark:focus:border-secondary transition-colors"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Display Name Field */}
            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-brand-dark dark:text-secondary mb-1.5">
                Display Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/50 dark:text-secondary/50" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border-2 border-brand-dark/20 dark:border-white/10 bg-white/70 dark:bg-background pl-10 pr-4 py-3 text-sm font-extrabold text-brand-dark dark:text-foreground placeholder:text-brand-dark/40 dark:placeholder:text-muted-foreground focus:outline-none focus:border-brand-dark dark:focus:border-secondary transition-colors"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Submit Action Button with Left-to-Right Fill Animation */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative overflow-hidden w-full px-6 py-3.5 mt-2 text-sm sm:text-base font-extrabold rounded-2xl border-2 border-brand-dark dark:border-secondary text-brand-dark dark:text-secondary transition-colors duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-brand-dark dark:bg-secondary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-secondary dark:group-hover:text-brand-dark transition-colors duration-300">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Connecting to Gossip...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Continue to Gossip</span>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 text-center text-xs font-semibold text-brand-muted dark:text-muted-foreground">
            No password required • Seamless automatic session sync
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
