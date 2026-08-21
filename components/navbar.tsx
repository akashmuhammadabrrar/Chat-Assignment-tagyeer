"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Chats", href: "/chat" },
    { label: "Contacts", href: "/chat" },
    { label: "Features", href: "#features" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent transition-all duration-300">
      <Container className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between bg-transparent">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link
              href="/"
              className="flex items-center transition-transform hover:scale-[1.03]"
              aria-label="Gossip Home"
            >
              <Image
                src="/logo/logo.png"
                alt="Gossip Logo"
                width={260}
                height={70}
                priority
                className="h-10 sm:h-12 lg:h-14 w-auto max-h-[48px] sm:max-h-[56px] object-contain drop-shadow-md"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1 sm:gap-2">
              {navLinks.map((link, idx) => (
                <React.Fragment key={link.label}>
                  <Link
                    href={link.href}
                    className="group relative px-3 py-1 text-sm sm:text-base font-extrabold text-brand-dark dark:text-secondary transition-all hover:text-secondary dark:hover:text-white"
                  >
                    <span>{link.label}</span>
                    <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-secondary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-full" />
                  </Link>
                  {idx < navLinks.length - 1 && (
                    <span className="text-brand-dark/40 dark:text-secondary/40 font-bold select-none">
                      |
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <ThemeToggle />

            <Link href="/login">
              <Button
                size="lg"
                className="h-9 sm:h-10 px-5 sm:px-7 text-xs sm:text-sm font-bold tracking-wide rounded-xl shadow-lg bg-secondary text-secondary-foreground hover:bg-white dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-white transition-all hover:scale-[1.03] cursor-pointer"
              >
                Login
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-brand-dark dark:text-secondary hover:bg-black/10 dark:hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              />

              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-secondary dark:bg-card border-r border-foreground/20 dark:border-border p-6 shadow-2xl flex flex-col justify-between md:hidden"
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-brand-dark/15 dark:border-white/10 mb-6">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <Image
                        src="/logo/logo.png"
                        alt="Gossip Logo"
                        width={180}
                        height={50}
                        className="h-10 w-auto object-contain"
                      />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-brand-dark dark:text-secondary hover:bg-black/10 dark:hover:bg-white/10 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-center justify-between px-4 py-3 text-base font-extrabold text-brand-dark dark:text-secondary hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="pt-6 border-t border-foreground/15 dark:border-border flex flex-col gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center h-11 text-sm font-bold rounded-xl bg-foreground text-background hover:opacity-90">
                      Login to Workspace
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
