"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

export default function About() {
  const cardShadow = "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4)";
  const springTransition = { type: "spring" as const, stiffness: 200, damping: 18 };

  return (
    <div className="relative w-full pt-[120px] pb-24">
      {/* Ambient Light Leak */}
      <div className="light-leak-primary top-[-100px] left-[-200px]" />
      
      <main className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        {/* Header/Hero Section */}
        <section className="mb-24 text-center">
          <h1 className="font-display-lg text-4xl md:text-6xl font-normal mb-6 font-headline leading-tight tracking-tight">
            Empowering Your Financial Future with <span className="gradient-text-primary italic">Precision</span>
          </h1>
          <p className="font-body-lg text-body-lg text-slate-text max-w-3xl mx-auto mb-10 leading-relaxed">
            We are a premier stock market research and advisory firm, dedicated to providing high-net-worth individuals and institutional investors with actionable, data-driven insights.
          </p>
        </section>

        {/* Bento Grid: Story & Values */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-24">
          {/* Company Story (Spans 8 columns) */}
          <motion.div
            whileHover={{ y: -3 }}
            style={{ boxShadow: cardShadow }}
            transition={springTransition}
            className="bg-[#171717] rounded-2xl p-8 md:col-span-8 flex flex-col justify-center relative overflow-hidden group border-t border-white/20 border-x border-white/[0.02] border-b border-white/10"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-premium-gold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    history_edu
                  </span>
                </div>
                <h2 className="font-headline-lg text-2xl md:text-4xl font-normal font-headline tracking-tight">Our <span className="italic text-premium-gold">Story</span></h2>
              </div>
              <p className="text-slate-text mb-4 leading-relaxed font-body-md">
                Founded on the principle that superior market intelligence should be accessible to those who seek serious wealth generation, MoneyVraksh has grown from a specialized analytics desk into a trusted advisory powerhouse.
              </p>
              <p className="text-slate-text leading-relaxed font-body-md">
                Our deep-rooted expertise in navigating volatile markets ensures that our clients are always positioned strategically, leveraging both macro trends and micro anomalies to secure sustained growth.
              </p>
            </div>
          </motion.div>

          {/* Core Values (Spans 4 columns) */}
          <motion.div
            whileHover={{ y: -3 }}
            style={{ boxShadow: cardShadow }}
            transition={springTransition}
            className="bg-[#171717] rounded-2xl p-8 md:col-span-4 relative overflow-hidden border-t border-white/20 border-x border-white/[0.02] border-b border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  diamond
                </span>
              </div>
              <h2 className="font-headline-lg text-xl md:text-3xl font-normal font-headline tracking-tight">Core <span className="italic text-primary">Values</span></h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-1">Integrity</h3>
                  <p className="font-data-mono text-data-mono text-slate-text text-xs">Unwavering ethical standards.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1">visibility</span>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-1">Transparency</h3>
                  <p className="font-data-mono text-data-mono text-slate-text text-xs">Clear, honest communication.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1">target</span>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-1">Precision</h3>
                  <p className="font-data-mono text-data-mono text-slate-text text-xs">Data-backed analysis.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1">handshake</span>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-1">Client-Focus</h3>
                  <p className="font-data-mono text-data-mono text-slate-text text-xs">Your success is our priority.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </section>

        {/* Leadership & Compliance */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-24">
          {/* Leadership Message */}
          <motion.div
            whileHover={{ y: -3 }}
            style={{ boxShadow: cardShadow }}
            transition={springTransition}
            className="bg-[#171717] rounded-2xl p-8 border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 border-l-4 border-l-primary flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    format_quote
                  </span>
                </div>
                <h2 className="font-headline-lg text-xl md:text-3xl font-normal font-headline tracking-tight">
                  Message from <span className="italic text-primary">Leadership</span>
                </h2>
              </div>
              <blockquote className="italic text-slate-text border-l-2 border-primary/30 pl-4 py-1 leading-relaxed font-body-md text-base">
                &quot;In an era of information overload, true value lies in synthesized intelligence. At MoneyVraksh, we don&apos;t just provide data; we provide conviction. Our goal is to transform complexity into clarity, empowering you to navigate the financial markets with absolute confidence.&quot;
              </blockquote>
            </div>
          </motion.div>

          {/* Compliance */}
          <motion.div
            whileHover={{ y: -3 }}
            style={{ boxShadow: cardShadow }}
            transition={springTransition}
            className="bg-[#171717] rounded-2xl p-8 border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                    gavel
                  </span>
                </div>
                <h2 className="font-headline-lg text-xl md:text-3xl font-normal font-headline text-on-surface tracking-tight">Regulatory <span className="italic text-error">Compliance</span></h2>
              </div>
              <p className="text-slate-text mb-6 leading-relaxed font-body-md">
                We operate strictly under the regulatory guidelines, ensuring maximum capital protection, risk mitigation, and full transparency for our retail and HNI clients.
              </p>
            </div>
            <div className="bg-[#070707] p-4 rounded-xl border border-white/5 flex items-center justify-between shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)]">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant mb-1 font-semibold text-xs uppercase">
                  SEBI Registration Status
                </p>
                <p className="font-data-mono text-data-mono text-primary font-bold text-sm">
                  INH000025300
                </p>
              </div>
              <span className="material-symbols-outlined text-success-emerald text-3xl">
                verified_user
              </span>
            </div>
          </motion.div>
        </section>

        {/* CTA Banner */}
        <motion.section 
          whileHover={{ y: -2 }}
          style={{ boxShadow: cardShadow }}
          transition={springTransition}
          className="bg-[#171717] rounded-2xl p-12 text-center relative overflow-hidden border-t border-white/20 border-x border-white/[0.02] border-b border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background-midnight via-primary/10 to-background-midnight z-0" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-3xl md:text-5xl font-normal mb-4 font-headline text-on-surface tracking-tight">
              Join Thousands of <span className="text-primary italic">Successful</span> Investors.
            </h2>
            <p className="text-slate-text mb-8 leading-relaxed">
              Experience the difference of precision research and dedicated advisory.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <MotionLink
                href="/contact"
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="gradient-bg-primary text-background font-label-md text-label-md px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all font-bold focus-ring cursor-pointer"
              >
                Start Your Journey
              </MotionLink>
              <MotionLink
                href="/services"
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-[#070707] border border-white/10 text-premium-gold font-label-md text-label-md px-8 py-3 rounded-full hover:bg-white/5 transition-all font-bold focus-ring cursor-pointer shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)]"
              >
                View Our Services
              </MotionLink>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
