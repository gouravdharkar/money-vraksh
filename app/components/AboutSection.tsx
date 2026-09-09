"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

export function AboutSection() {
  return (
    <section className="relative px-margin-mobile md:px-margin-desktop py-16 md:py-20 max-w-container-max mx-auto overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

        {/* Left: Image Container */}
        <div className="relative mx-auto md:mx-0 w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px]">
          <div className="relative w-full h-[380px] sm:h-[460px] md:h-[560px] rounded-3xl overflow-hidden glass-panel border border-elegant shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop"
              alt="Laptop with trading charts and financial analytics"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 340px, 420px"
            />
          </div>

          {/* Floating 10+ badge */}
          <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 md:left-6 -translate-x-1/2 md:translate-x-0 z-20">
            <div className="w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] md:w-[160px] md:h-[160px] rounded-2xl bg-premium-gold flex flex-col items-center justify-center shadow-2xl border border-premium-gold/30">
              <span className="font-bold text-4xl sm:text-5xl text-background-midnight leading-none">10+</span>
              <span className="text-xs sm:text-sm font-semibold text-background-midnight mt-2 text-center leading-tight px-2">
                Years of experience
              </span>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 mt-10 md:mt-0">
          <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase font-semibold">
            — Know About Us
          </span>

          <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-5xl font-normal text-on-surface font-headline leading-tight tracking-tight">
            Money Solutions for all your needs, <span className="italic gradient-text-primary">throughout your life.</span>
          </h2>

          <p className="font-body-md text-sm sm:text-base text-slate-text leading-relaxed">
            We at MoneyVriksh have a team of expert and connoisseur technical analysts, who on the basis of in-depth and extensive research generate constructive recommendations for our clients. We communicate these recommendations to our esteemed clients through SMS as well as Instant Messengers, to make them excel in Equity as well as Commodity Markets.
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
                <span className="font-headline-md text-sm sm:text-base font-semibold text-on-surface font-headline">{item}</span>
              </li>
            ))}
          </ul>

          <p className="font-body-md text-xs sm:text-sm text-slate-text -mt-1">
            MoneyVriksh is SEBI registered (Reg. No INH000025300) as a Research Analyst, providing reliable and insightful stock and index recommendations to its clients.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            <MotionLink
              href="/about"
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="gradient-bg-primary text-background font-label-md text-sm px-7 py-3.5 rounded-full hover:shadow-[0_0_20px_rgba(78,222,163,0.5)] transition-all-slow flex items-center justify-center gap-2 font-bold focus-ring cursor-pointer"
            >
              Know More
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </MotionLink>

            <a
              href="tel:+919827562967"
              className="flex items-center justify-center sm:justify-start gap-3 group transition-all-slow focus-ring rounded-lg p-2"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-elegant flex items-center justify-center group-hover:border-primary/50 transition-colors shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-base sm:text-lg font-bold text-on-surface font-headline leading-none group-hover:text-primary transition-colors">+91 98275 62967</span>
                <span className="font-data-mono text-[10px] sm:text-[11px] text-slate-text uppercase tracking-widest mt-1">Call Our Team</span>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
