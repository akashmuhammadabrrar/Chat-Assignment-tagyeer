"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquareCode, ArrowLeft, Mail, Key, User } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register submitted:", { name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0D100B] p-4 sm:p-6 transition-colors duration-200">
      <Container className="max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-2xl border border-[#E5E5DD] bg-[#F7F7F3] p-6 sm:p-8 shadow-xl dark:border-[#363824] dark:bg-[#171A12]">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#31321D] text-white shadow-md mb-3">
              <MessageSquareCode className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Create your <span className="text-[#31321D] dark:text-[#F5F5EF]">Gossip</span> account
            </h1>
            <p className="mt-1 text-xs text-muted-foreground dark:text-[#B7B8A9]">
              Start real-time collaboration with your team in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E5DD] bg-white pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#31321D] dark:border-[#363824] dark:bg-[#0D100B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="alex@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E5DD] bg-white pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#31321D] dark:border-[#363824] dark:bg-[#0D100B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E5DD] bg-white pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#31321D] dark:border-[#363824] dark:bg-[#0D100B]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="brandPrimary"
              className="w-full justify-center text-xs font-semibold py-2.5 mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground dark:text-[#B7B8A9]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#31321D] hover:underline dark:text-[#F5F5EF]">
              Sign in here
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
