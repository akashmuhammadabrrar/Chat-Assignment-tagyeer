"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";

export function ContactSection() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contacts" className="py-16 sm:py-24 bg-secondary dark:bg-[#171914] text-brand-dark transition-colors duration-200 relative overflow-hidden">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3.5 py-1 rounded-full bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black tracking-wider uppercase inline-block mb-3 shadow-md"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark dark:text-secondary tracking-tight"
          >
            We'd Love to Hear From You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base font-medium text-brand-muted dark:text-muted-foreground"
          >
            Have questions about Gossip? Need support or custom enterprise integrations? Reach out anytime!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Contact info cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-4 flex flex-col justify-between"
          >
            {[
              { title: "Direct Phone / WhatsApp", val: "01758472964", sub: "Available 24/7 for support", icon: Phone },
              { title: "Email Support", val: "support@gossip-chat.com", sub: "Average response time: 15 mins", icon: Mail },
              { title: "Headquarters", val: "Dhaka, Bangladesh", sub: "Gossip Real-Time Engineering Hub", icon: MapPin },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white/70 dark:bg-card border-2 border-brand-dark/15 dark:border-white/10 shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow"
                >
                  <div className="h-12 w-12 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark flex items-center justify-center font-bold shrink-0 shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-brand-muted dark:text-muted-foreground">{card.title}</span>
                    <h4 className="text-base font-black text-brand-dark dark:text-secondary">{card.val}</h4>
                    <p className="text-[11px] font-medium text-brand-muted dark:text-muted-foreground">{card.sub}</p>
                  </div>
                </div>
              );
            })}

            {/* Avatar vector card */}
            <div className="p-4 rounded-3xl bg-brand-primary dark:bg-card border-2 border-brand-dark/15 flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl overflow-hidden shrink-0 border border-brand-dark/20">
                <Image src="/images/chat-boy.jpg" alt="Support Agent" fill className="object-cover" />
              </div>
              <div>
                <h5 className="text-xs font-black text-brand-dark dark:text-secondary">Instant Live Support</h5>
                <p className="text-[11px] font-medium text-brand-muted dark:text-muted-foreground">Chat live with our engineering team anytime inside the workspace.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-card border-2 border-brand-dark/15 dark:border-white/10 shadow-2xl"
          >
            <h3 className="text-xl font-black text-brand-dark dark:text-secondary mb-2 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>Send Us a Quick Message</span>
            </h3>
            <p className="text-xs font-medium text-brand-muted dark:text-muted-foreground mb-6">
              Fill out the details below and we will connect with you right away.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold mb-1.5 uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abrrar"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-brand-dark/15 dark:border-white/10 bg-white dark:bg-background text-xs sm:text-sm font-extrabold text-brand-dark dark:text-foreground focus:outline-none focus:border-brand-dark dark:focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold mb-1.5 uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 01758472964"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-brand-dark/15 dark:border-white/10 bg-white dark:bg-background text-xs sm:text-sm font-extrabold text-brand-dark dark:text-foreground focus:outline-none focus:border-brand-dark dark:focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold mb-1.5 uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-brand-dark/15 dark:border-white/10 bg-white dark:bg-background text-xs sm:text-sm font-extrabold text-brand-dark dark:text-foreground focus:outline-none focus:border-brand-dark dark:focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold mb-1.5 uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your inquiry or message here..."
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-brand-dark/15 dark:border-white/10 bg-white dark:bg-background text-xs sm:text-sm font-extrabold text-brand-dark dark:text-foreground focus:outline-none focus:border-brand-dark dark:focus:border-secondary resize-none"
                />
              </div>

              {submitted ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-black text-center">
                  ✓ Message sent successfully! We will get back to you shortly.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full h-11 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs sm:text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform cursor-pointer shadow-lg"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
