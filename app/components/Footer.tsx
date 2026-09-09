"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background-midnight w-full mt-auto relative z-10 before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-['']">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 mb-1 focus-ring rounded-lg w-fit group transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Money Vriksh Home"
          >
            <div className="relative flex items-center justify-center shrink-0 w-8 h-8 sm:w-9 sm:h-9">
              <Image
                src="/logo1.png"
                alt="Money Vriksh Logo"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <span className="font-instrument text-[1.65rem] sm:text-[1.85rem] leading-none tracking-tight flex items-baseline select-none">
              <span className="text-white font-normal">Money</span>
              <span className="italic font-normal animating-gradient-text pr-0.5">Vriksh</span>
            </span>
          </Link>
          <p className="font-body-md text-body-md text-slate-text text-sm leading-relaxed">
            Empowering investors with institutional-grade research, algorithm-backed setups, and data-driven insights.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-3">
          <span className="font-label-md text-label-md text-on-surface mb-1 font-bold uppercase tracking-wider text-xs">
            Company
          </span>
          <Link href="/" className="text-slate-text hover:text-primary transition-colors text-sm focus-ring rounded-sm w-fit py-0.5">
            Home
          </Link>
          <Link href="/about" className="text-slate-text hover:text-primary transition-colors text-sm focus-ring rounded-sm w-fit py-0.5">
            About Us
          </Link>
          <Link href="/services" className="text-slate-text hover:text-primary transition-colors text-sm focus-ring rounded-sm w-fit py-0.5">
            Services
          </Link>
        </div>

        {/* Support Links */}
        <div className="flex flex-col gap-3">
          <span className="font-label-md text-label-md text-on-surface mb-1 font-bold uppercase tracking-wider text-xs">
            Support &amp; Payment
          </span>
          <Link href="/payment" className="text-slate-text hover:text-primary transition-colors text-sm focus-ring rounded-sm w-fit py-0.5">
            Payment Details
          </Link>
          <Link href="/services#faq" className="text-slate-text hover:text-primary transition-colors text-sm focus-ring rounded-sm w-fit py-0.5">
            FAQ
          </Link>
          <Link href="/contact" className="text-slate-text hover:text-primary transition-colors text-sm focus-ring rounded-sm w-fit py-0.5">
            Contact Us
          </Link>
        </div>

        {/* Legal & Compliance */}
        <div className="flex flex-col gap-3">
          <span className="font-label-md text-label-md text-on-surface mb-1 font-bold uppercase tracking-wider text-xs">
            Legal &amp; Compliance
          </span>
          <Link href="/disclosure" className="text-slate-text hover:text-primary transition-colors text-sm focus-ring rounded-sm w-fit py-0.5">
            Disclosure
          </Link>
          <Link href="/disclosure#terms" className="text-slate-text hover:text-primary transition-colors text-sm focus-ring rounded-sm w-fit py-0.5">
            Terms &amp; Conditions
          </Link>
          <p className="font-body-md text-premium-gold text-xs leading-relaxed mt-2">
            © {new Date().getFullYear()} MoneyVriksh. SEBI Reg. NO INH000025300.
          </p>
        </div>
      </div>
      
      {/* Compliance Bottom Bar */}
      <div className="relative py-6 px-margin-mobile md:px-margin-desktop text-center before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/15 before:to-transparent before:content-['']">
        <p className="font-data-mono text-data-mono text-premium-gold max-w-4xl mx-auto font-normal text-[11px] opacity-75 leading-relaxed">
          Disclaimer: MoneyVriksh is a SEBI registered Research Analyst (INH000025300). Trading and investing in stock markets involve significant market risk. All recommendations are for educational &amp; advisory purposes.
        </p>
      </div>
    </footer>
  );
}
