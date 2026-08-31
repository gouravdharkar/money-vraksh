"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="relative px-margin-mobile md:px-margin-desktop py-20 max-w-container-max mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* Left: Image */}
        <div className="relative">
          <div className="relative w-[320px] h-[440px] md:w-[420px] md:h-[580px] mx-auto md:mx-0 rounded-3xl overflow-hidden glass-panel border border-elegant">
            <Image
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop"
              alt="Laptop with trading charts"
              fill
              className="object-cover"
            />
          </div>

          {/* Floating 10+ badge */}
          <div className="absolute -bottom-6 left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0">
            <div className="w-[160px] h-[160px] rounded-2xl bg-premium-gold flex flex-col items-center justify-center shadow-xl border border-premium-gold/30">
              <span className="font-bold text-5xl text-background-midnight leading-none">10+</span>
              <span className="text-sm font-semibold text-background-midnight mt-2 text-center leading-tight px-2">
                Years of experience
              </span>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col gap-6 md:gap-7 mt-16 md:mt-0">
          <span className="font-label-md text-label-md text-primary tracking-widest uppercase font-semibold">
            — Know About Us
          </span>

          <h2 className="font-headline-lg text-3xl md:text-5xl font-normal text-on-surface font-headline leading-tight tracking-tight">
            Money Solutions for all your needs, <span className="italic gradient-text-primary">throughout your life.</span>
          </h2>

          <p className="font-body-md text-body-md text-slate-text leading-relaxed">
            We at Morning Bell Research have a team of expert and connoisseur technical analysts, who on the basis of in-depth and extensive research generate constructive recommendations for our clients. We communicate these recommendations to our esteemed clients through SMS as well as Instant Messengers, to make them excel in Equity as well as Commodity Markets.
          </p>

          <ul className="flex flex-col gap-3">
            {[
              "A Modern Way-SMART TRADING",
              "Minimum Risk-Reward ratio and High Success rate",
              "Detailed recommendations of financial solutions",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-headline-md text-body-lg font-semibold text-on-surface font-headline">{item}</span>
              </li>
            ))}
          </ul>

          <p className="font-body-md text-body-md text-slate-text text-sm -mt-1">
            Morning Bell Research is SEBI registered (Reg. No INH000018850) as a Research Analyst, a SEBI registered research analyst that has been providing reliable and insightful stock and index recommendations to its clients.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="gradient-bg-primary text-background font-label-md text-label-md px-8 py-4 rounded-full hover:shadow-[0_0_20px_rgba(78,222,163,0.5)] transition-all-slow flex items-center gap-2 font-bold focus-ring cursor-pointer"
            >
              Know More
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </motion.button>

            <a
              href="tel:+918109888590"
              className="flex items-center gap-3 group transition-all-slow focus-ring rounded-lg p-1"
            >
              <div className="w-11 h-11 rounded-full border border-elegant flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-lg font-bold text-on-surface font-headline leading-none group-hover:text-primary transition-colors">+91-8109888590</span>
                <span className="font-data-mono text-[11px] text-slate-text uppercase tracking-widest mt-0.5">Call Our Team</span>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
