"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "./components/Toast";
import { serviceCategories } from "./services/data";
import { ACCENT_THEMES } from "./services/types";
import CategoryCard from "./services/components/CategoryCard";
import qrCodeImg from "@/public/qr-code.png";

const MotionLink = motion.create(Link);

interface BankDetailItem {
  label: string;
  value: string;
  copyValue?: string;
  displayValue?: string;
  icon: string;
  highlight?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function Home() {
  // Payment states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Contact form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "Select a service...",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Active Disclosure Tab / Filter for quick viewing
  const [activeDisclosureId, setActiveDisclosureId] = useState<string>("all");

  const cardShadow =
    "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4)";
  const initialShadow =
    "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 30px 80px rgba(0, 0, 0, 0.6)";
  const springTransition = { type: "spring" as const, stiffness: 200, damping: 18 };

  // Scroll to hash on initial load if present
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  };

  const bankDetails: BankDetailItem[] = [
    {
      label: "Bank Name",
      value: "UCO BANK",
      icon: "account_balance",
      highlight: true,
    },
    {
      label: "Account Holder Name",
      value: "GOURAV DHARKAR",
      icon: "person",
      highlight: true,
    },
    {
      label: "Account Number",
      value: "22460210002377",
      displayValue: "2246 0210 0023 77",
      icon: "tag",
      highlight: true,
    },
    {
      label: "IFSC Code",
      value: "UCBA0002246",
      icon: "pin",
      highlight: true,
    },
    {
      label: "Account Type",
      value: "CURRENT ACCOUNT",
      icon: "verified_user",
      highlight: false,
    },
  ];

  const handleCopyAll = () => {
    const fullText = `BANK DETAILS FOR PAYMENT - GOURAV DHARKAR
======================================
Bank: UCO BANK
Account Holder: GOURAV DHARKAR
Account Number: 22460210002377
IFSC Code: UCBA0002246
Account Type: CURRENT ACCOUNT
SEBI Registration: INH000025300
======================================`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setCopiedKey("ALL");
      showToast("success", "All bank details copied to clipboard!");
      setTimeout(() => {
        setCopiedKey(null);
      }, 2500);
    }
  };

  const paymentSteps = [
    {
      step: "01",
      title: "Choose Payment Mode",
      desc: "Transfer using IMPS / NEFT / RTGS to our UCO Bank account, or scan the official UPI QR code using any UPI application.",
      icon: "payments",
    },
    {
      step: "02",
      title: "Save Reference / UTR",
      desc: "Take a screenshot of the completed payment receipt showing the 12-digit UTR or Transaction Reference ID.",
      icon: "receipt_long",
    },
    {
      step: "03",
      title: "Share Confirmation",
      desc: "Send your receipt via WhatsApp (+91 98275 62967) or Email. Your service access will be activated within 15–30 minutes.",
      icon: "mark_chat_read",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "How long does onboarding take?",
      answer: "Standard KYC and onboarding usually takes 24-48 business hours after all required documents are submitted.",
    },
    {
      question: "Are my investments safe?",
      answer: "We operate strictly within regulatory frameworks to ensure maximum transparency, compliance, and capital protection.",
    },
    {
      question: "Can I upgrade my service plan later?",
      answer: "Yes, you can upgrade your service tier at any time through your dashboard or by contacting your dedicated account manager.",
    },
    {
      question: "How are recommendations communicated?",
      answer: "Recommendations with entry, target, and stop-loss levels are sent instantly through WhatsApp, Telegram, and Email for immediate execution.",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setIsSuccess(true);
      showToast("success", "Your message has been sent successfully!");

      setTimeout(() => {
        setIsSuccess(false);
      }, 1500);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        service: "Select a service...",
        message: "",
      });
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const disclosureSections = [
    {
      id: "history",
      title: "History & Business",
      icon: "corporate_fare",
      content: (
        <>
          <p>
            Money Vriksh is an individual SEBI registered research analyst dedicated to providing high-quality, actionable insights to retail, institutional, and high-net-worth investors. Operating with a commitment to analytical rigor, our business model focuses entirely on independent equity research without the conflicts inherent in investment banking or proprietary trading operations.
          </p>
          <p className="mt-4">
            Our core business involves analyzing macroeconomic trends, sector dynamics, and individual corporate fundamentals to deliver comprehensive research reports and recommendations. We do not engage in any merchant banking, investment banking, or brokerage services.
          </p>
        </>
      ),
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      icon: "gavel",
      content: (
        <>
          <p>
            The information and views presented in our research reports are prepared by Money Vriksh solely for informational purposes and are not intended to be a complete description of the securities, markets, or developments referred to in the material.
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>All research is subject to change without notice.</li>
            <li>Past performance is not indicative of future results.</li>
            <li>Clients should seek advice based on their particular circumstances from an independent tax, legal, or financial advisor.</li>
          </ul>
        </>
      ),
    },
    {
      id: "disciplinary",
      title: "Disciplinary History",
      icon: "history",
      content: (
        <>
          <p>
            There are no material disciplinary actions, penalties, or litigations pending against Money Vriksh by any regulatory authority (including SEBI, stock exchanges, or other judicial bodies) as of the date of these disclosures.
          </p>
          <p className="mt-4">
            We maintain strict compliance and adherence to regulatory directives to preserve the integrity of our advisory operations.
          </p>
        </>
      ),
    },
    {
      id: "associates",
      title: "Associates Details",
      icon: "group",
      content: (
        <>
          <p>
            Money Vriksh does not have any material associate or group entities engaged in merchant banking, brokerage, portfolio management, or lending operations.
          </p>
          <p className="mt-4">
            This lack of corporate associations guarantees that our research and market analyst insights are completely independent, objective, and free from cross-selling conflicts of interest.
          </p>
        </>
      ),
    },
    {
      id: "research",
      title: "Research Disclosures",
      icon: "analytics",
      content: (
        <>
          <p>
            Pursuant to the SEBI (Research Analysts) Regulations, 2014, Money Vriksh hereby declares:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>Neither the analyst nor their relatives have any financial interest in the subject companies under coverage.</li>
            <li>There are no material conflict of interest issues at the time of publication of research reports.</li>
            <li>No brokerage, investment banking fee, or advisory commissions have been received from the subject companies in the past twelve months.</li>
          </ul>
        </>
      ),
    },
    {
      id: "disclaimer",
      title: "Legal Disclaimer",
      icon: "shield",
      content: (
        <>
          <p>
            Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
          </p>
          <p className="mt-4">
            Investments in the securities market are subject to market risks. Please read all scheme-related and disclosure documents carefully before investing. Equity trading involves risk of capital loss.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="relative w-full pt-[80px] md:pt-[100px]">
      {/* Ambient Light Leaks */}
      <div className="light-leak-primary top-[-100px] left-[-200px]" />
      <div className="light-leak-secondary top-[20%] right-[-100px]" />
      <div className="light-leak-primary top-[45%] left-[-150px] opacity-40" />
      <div className="light-leak-secondary top-[70%] right-[-100px] opacity-40" />
      <div className="light-leak-primary bottom-[10%] left-[-100px] opacity-50" />

      {/* ========================================================
          1. HERO SECTION (id="home")
          ======================================================== */}
      <section
        id="home"
        className="relative px-margin-mobile md:px-margin-desktop py-6 sm:py-10 max-w-container-max mx-auto scroll-mt-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden border border-elegant p-6 sm:p-10 md:p-12 lg:p-16 glass-panel shadow-2xl"
        >
          {/* Background Image Panel */}
          <div
            className="absolute inset-0 z-[-1] opacity-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlNQ_mxpVKHmffOod9PpCUjb9exANO8Me3LV4sXhu9ySxB_ax2F5Bw63oPRX1Q69fbT7CypbVES437vPA7SFyxSxI1HIluMwqGiEPfd2IVBXaB6J-XK2G2iKf8mcG0vUYoeqXwNkuGkmxFFlHVGZmtit8sNJZTMN4msXkSJbtMUqb5xIdlVvW_3MZIamkF6w75bWuV4Mx-EcSEKwYvzcf5FcHtXZX_kVpr_jBRBjBHj6SmqJ8SLuiBCe7dR8b-lsVQwp1AIZ94boNf')",
            }}
          />

          <div className="max-w-3xl flex flex-col justify-center text-center sm:text-left">
            {/* Prominent Brand Eyebrow & SEBI Verification Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 bg-surface-container-high/70 border border-primary/30 rounded-full px-4 sm:px-5 py-2 w-fit mb-5 sm:mb-6 glass-panel mx-auto sm:mx-0 shadow-md">
              <div className="flex items-center gap-1.5 font-headline text-base sm:text-lg text-on-surface font-semibold tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span>Money</span>
                <span className="italic animating-gradient-text font-normal">Vriksh</span>
              </div>
              <span className="text-white/20 hidden sm:inline">&bull;</span>
              <div className="flex items-center gap-1 text-premium-gold">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="font-label-md uppercase tracking-wider text-[10px] sm:text-xs font-bold">
                  SEBI NO - INH000025300
                </span>
              </div>
            </div>

            <h1 className="font-display-lg text-3xl sm:text-5xl lg:text-6xl font-normal text-on-surface mb-4 sm:mb-6 leading-tight font-headline tracking-tight">
              Grow Your Wealth with <br className="hidden sm:block" />
              <span className="animating-gradient-text italic font-normal">Money Vriksh</span>
            </h1>

            <p className="font-body-lg text-sm sm:text-base lg:text-lg text-slate-text mb-8 sm:mb-10 max-w-2xl mx-auto sm:mx-0 leading-relaxed">
              Professional Stock Market Research, High-Probability Trading Insights, and SEBI-Registered Advisory by <strong className="text-on-surface font-semibold">Money Vriksh</strong> — designed for consistent growth in dynamic financial markets.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto sm:mx-0">
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, "contact")}
                className="gradient-bg-primary text-background font-label-md text-sm sm:text-base px-7 py-3.5 sm:py-4 rounded-full hover:shadow-[0_0_20px_rgba(78,222,163,0.5)] transition-all-slow flex items-center justify-center gap-2 font-bold focus-ring cursor-pointer"
              >
                Talk To Our Experts
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
              <a
                href="#services"
                onClick={(e) => handleSmoothScroll(e, "services")}
                className="bg-transparent border border-premium-gold text-premium-gold font-label-md text-sm sm:text-base px-7 py-3.5 sm:py-4 rounded-full hover:bg-premium-gold/10 transition-all-slow flex items-center justify-center gap-2 font-bold focus-ring cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">explore</span>
                Explore Services
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          2. ABOUT US SECTION (id="about")
          ======================================================== */}
      <section
        id="about"
        className="relative px-margin-mobile md:px-margin-desktop py-16 md:py-24 max-w-container-max mx-auto scroll-mt-24"
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase mb-2 block font-semibold">
            — Know About Us
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl font-normal text-on-surface mb-4 font-headline tracking-tight">
            Empowering Your Financial Future with <span className="gradient-text-primary italic">Precision</span>
          </h2>
          <p className="font-body-lg text-sm sm:text-base md:text-lg text-slate-text leading-relaxed">
            We are a premier stock market research and advisory firm, dedicated to providing high-net-worth individuals and retail investors with actionable, data-driven insights.
          </p>
        </div>

        {/* Feature Split: Experience Badge & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 sm:mb-20">
          {/* Left: Image Container with Experience Badge */}
          <div className="relative mx-auto md:mx-0 w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px]">
            <div className="relative w-full h-[360px] sm:h-[440px] md:h-[520px] rounded-3xl overflow-hidden glass-panel border border-elegant shadow-2xl">
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
              <div className="w-[125px] h-[125px] sm:w-[145px] sm:h-[145px] md:w-[155px] md:h-[155px] rounded-2xl bg-premium-gold flex flex-col items-center justify-center shadow-2xl border border-premium-gold/30">
                <span className="font-bold text-4xl sm:text-5xl text-background-midnight leading-none">10+</span>
                <span className="text-xs sm:text-sm font-semibold text-background-midnight mt-2 text-center leading-tight px-2">
                  Years of experience
                </span>
              </div>
            </div>
          </div>

          {/* Right: Key Philosophy & Bullets */}
          <div className="flex flex-col gap-5 sm:gap-6 mt-8 md:mt-0">
            <h3 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-normal text-on-surface font-headline leading-tight tracking-tight">
              Money Solutions for all your needs, <span className="italic gradient-text-primary">throughout your life.</span>
            </h3>

            <p className="font-body-md text-sm sm:text-base text-slate-text leading-relaxed">
              Money Vriksh is an individual SEBI Registered Research Analyst who, on the basis of in-depth and extensive technical research, generates constructive recommendations for clients. We communicate these recommendations to our esteemed clients through SMS as well as Instant Messengers, to help them excel in Equity as well as Commodity Markets.
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

            <div className="bg-[#070707] p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
              <span className="material-symbols-outlined text-premium-gold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <p className="font-body-md text-xs sm:text-sm text-slate-text">
                Registered with SEBI as an individual Research Analyst: <strong className="text-on-surface font-mono">INH000025300</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <a
                href="#services"
                onClick={(e) => handleSmoothScroll(e, "services")}
                className="gradient-bg-primary text-background font-label-md text-sm px-7 py-3.5 rounded-full hover:shadow-[0_0_20px_rgba(78,222,163,0.5)] transition-all-slow flex items-center justify-center gap-2 font-bold focus-ring cursor-pointer"
              >
                Explore Offerings
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>

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
                  <span className="font-data-mono text-[10px] sm:text-[11px] text-slate-text uppercase tracking-widest mt-1">Direct Analyst Line</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bento Grid: Story & Values */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-16 sm:mb-20">
          {/* Company Story (8 cols) */}
          <motion.div
            whileHover={{ y: -3 }}
            style={{ boxShadow: cardShadow }}
            transition={springTransition}
            className="bg-[#171717] rounded-2xl p-6 sm:p-8 lg:col-span-8 flex flex-col justify-center relative overflow-hidden group border-t border-white/20 border-x border-white/[0.02] border-b border-white/10"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-premium-gold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    history_edu
                  </span>
                </div>
                <h3 className="font-headline-lg text-2xl sm:text-3xl font-normal font-headline tracking-tight">Our <span className="italic text-premium-gold">Story</span></h3>
              </div>
              <p className="text-slate-text mb-4 leading-relaxed font-body-md text-sm sm:text-base">
                Founded on the principle that superior market intelligence should be accessible to those who seek serious wealth generation, Money Vriksh has established a premier independent equity research practice.
              </p>
              <p className="text-slate-text leading-relaxed font-body-md text-sm sm:text-base">
                Our deep-rooted expertise in navigating volatile markets ensures that our clients are always positioned strategically, leveraging both macro trends and micro anomalies to secure sustained growth.
              </p>
            </div>
          </motion.div>

          {/* Core Values (4 cols) */}
          <motion.div
            whileHover={{ y: -3 }}
            style={{ boxShadow: cardShadow }}
            transition={springTransition}
            className="bg-[#171717] rounded-2xl p-6 sm:p-8 lg:col-span-4 relative overflow-hidden border-t border-white/20 border-x border-white/[0.02] border-b border-white/10"
          >
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  diamond
                </span>
              </div>
              <h3 className="font-headline-lg text-xl sm:text-2xl font-normal font-headline tracking-tight">Core <span className="italic text-primary">Values</span></h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1 shrink-0">check_circle</span>
                <div>
                  <h4 className="font-label-md text-sm text-on-surface font-semibold mb-0.5">Integrity</h4>
                  <p className="font-data-mono text-data-mono text-slate-text text-xs">Unwavering ethical standards.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1 shrink-0">visibility</span>
                <div>
                  <h4 className="font-label-md text-sm text-on-surface font-semibold mb-0.5">Transparency</h4>
                  <p className="font-data-mono text-data-mono text-slate-text text-xs">Clear, honest communication.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1 shrink-0">target</span>
                <div>
                  <h4 className="font-label-md text-sm text-on-surface font-semibold mb-0.5">Precision</h4>
                  <p className="font-data-mono text-data-mono text-slate-text text-xs">Data-backed analysis.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1 shrink-0">handshake</span>
                <div>
                  <h4 className="font-label-md text-sm text-on-surface font-semibold mb-0.5">Client-Focus</h4>
                  <p className="font-data-mono text-data-mono text-slate-text text-xs">Your success is our priority.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Leadership Quote & Regulatory Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 sm:mb-20">
          <motion.div
            whileHover={{ y: -3 }}
            style={{ boxShadow: cardShadow }}
            transition={springTransition}
            className="bg-[#171717] rounded-2xl p-6 sm:p-8 border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 border-l-4 border-l-primary flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    format_quote
                  </span>
                </div>
                <h3 className="font-headline-lg text-xl sm:text-2xl font-normal font-headline tracking-tight">
                  Message from <span className="italic text-primary">Money Vriksh</span>
                </h3>
              </div>
              <blockquote className="italic text-slate-text border-l-2 border-primary/30 pl-4 py-1 leading-relaxed font-body-md text-sm sm:text-base">
                &quot;In an era of information overload, true value lies in synthesized intelligence. As an independent SEBI Registered Research Analyst, I don&apos;t just provide data; I provide conviction. My goal is to transform complexity into clarity, empowering you to navigate the financial markets with absolute confidence.&quot;
              </blockquote>
            </div>
            <p className="mt-4 font-headline text-sm font-semibold text-on-surface">
              — Gourav Dharkar, SEBI Registered RA
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            style={{ boxShadow: cardShadow }}
            transition={springTransition}
            className="bg-[#171717] rounded-2xl p-6 sm:p-8 border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                    gavel
                  </span>
                </div>
                <h3 className="font-headline-lg text-xl sm:text-2xl font-normal font-headline text-on-surface tracking-tight">
                  Regulatory <span className="italic text-error">Compliance</span>
                </h3>
              </div>
              <p className="text-slate-text mb-6 leading-relaxed font-body-md text-sm sm:text-base">
                We operate strictly under the regulatory guidelines of SEBI, ensuring maximum capital protection, risk mitigation, and full transparency for all investors.
              </p>
            </div>
            <div className="bg-[#070707] p-4 rounded-xl border border-white/5 flex items-center justify-between shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)]">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant mb-1 font-semibold text-[10px] sm:text-xs uppercase tracking-wider">
                  SEBI Registration Status
                </p>
                <p className="font-data-mono text-data-mono text-primary font-bold text-sm sm:text-base">
                  INH000025300
                </p>
              </div>
              <span className="material-symbols-outlined text-success-emerald text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
          </motion.div>
        </div>

        {/* Advantages Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center bg-surface-container-low/60 rounded-3xl p-6 sm:p-10 border border-white/5">
          <div>
            <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase mb-2 block font-semibold">
              Why Choose Us
            </span>
            <h3 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-normal text-on-surface mb-5 font-headline tracking-tight">
              Our <span className="italic gradient-text-primary">Advantages</span>
            </h3>
            <p className="font-body-md text-sm sm:text-base text-slate-text mb-8 leading-relaxed">
              We help our clients adhere to strict money management and risk protocols. Our analysts utilize disciplined trend-following strategies to capture high-probability market opportunities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-xl">timer</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm sm:text-base font-semibold text-on-surface font-headline">
                    10+ Years Experience
                  </h4>
                  <p className="text-xs text-slate-text mt-0.5">Proven market resilience</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-xl">workspace_premium</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm sm:text-base font-semibold text-on-surface font-headline">
                    SEBI Reg. Research
                  </h4>
                  <p className="text-xs text-slate-text mt-0.5">INH000025300 compliance</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm sm:text-base font-semibold text-on-surface font-headline">
                    Data-Driven Edge
                  </h4>
                  <p className="text-xs text-slate-text mt-0.5">Quantitative technical setups</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-xl">support_agent</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm sm:text-base font-semibold text-on-surface font-headline">
                    Dedicated Support
                  </h4>
                  <p className="text-xs text-slate-text mt-0.5">Continuous analyst assistance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden glass-panel aspect-[16/10] sm:aspect-video relative flex items-center justify-center bg-surface-container-high/50 border border-primary/20 shadow-2xl group">
            <Image
              src="/why-choose-us.jpg"
              alt="Money Vriksh Quantitative Research & Market Analytics"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-midnight/80 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
              <div className="glass-panel px-3 py-1.5 rounded-lg border border-primary/30 flex items-center gap-2 bg-black/60 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-on-surface">Institutional Technical Setups</span>
              </div>
              <div className="glass-panel px-3 py-1.5 rounded-lg border border-white/10 hidden sm:flex items-center gap-1.5 bg-black/60 backdrop-blur-md">
                <span className="material-symbols-outlined text-sm text-premium-gold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-xs text-on-surface font-medium">SEBI Reg. INH000025300</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SERVICES SECTION (id="services")
          ======================================================== */}
      <section
        id="services"
        className="relative px-margin-mobile md:px-margin-desktop py-16 md:py-24 max-w-container-max mx-auto scroll-mt-24 before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-['']"
      >
        <div className="text-center mb-14 sm:mb-16">
          <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase mb-2 block font-semibold">
            Our Offerings
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl font-normal text-on-surface mb-4 font-headline tracking-tight">
            <span className="italic gradient-text-primary">Precision</span> Strategies for Every Market Condition
          </h2>
          <p className="font-body-lg text-sm sm:text-base md:text-lg text-slate-text max-w-2xl mx-auto leading-relaxed">
            Institutional-grade research and actionable insights tailored to your investment style. Choose your domain and explore specialized strategies.
          </p>
        </div>

        {/* All Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {serviceCategories.map((category, idx) => (
            <CategoryCard key={category.id} category={category} index={idx} />
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-2xl p-6 sm:p-8 border border-elegant mb-16 shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <p className="font-headline-md text-3xl sm:text-4xl font-bold gradient-text-primary font-headline">12+</p>
              <p className="font-label-md text-xs text-slate-text uppercase tracking-wider mt-1 font-semibold">Specialized Services</p>
            </div>
            <div className="text-center">
              <p className="font-headline-md text-3xl sm:text-4xl font-bold text-premium-gold font-headline">2</p>
              <p className="font-label-md text-xs text-slate-text uppercase tracking-wider mt-1 font-semibold">Market Domains</p>
            </div>
            <div className="text-center">
              <p className="font-headline-md text-3xl sm:text-4xl font-bold text-on-surface font-headline">85%+</p>
              <p className="font-label-md text-xs text-slate-text uppercase tracking-wider mt-1 font-semibold">Avg. Success Ratio</p>
            </div>
            <div className="text-center">
              <p className="font-headline-md text-3xl sm:text-4xl font-bold text-on-surface font-headline">SEBI</p>
              <p className="font-label-md text-xs text-slate-text uppercase tracking-wider mt-1 font-semibold">Reg. INH000025300</p>
            </div>
          </div>
        </motion.div>

        {/* Process Steps */}
        <div className="mb-14 sm:mb-16">
          <div className="text-center mb-10 sm:mb-12">
            <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase mb-2 block font-semibold">
              Our Process
            </span>
            <h3 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-normal text-on-surface font-headline tracking-tight">
              Get Our Service In <span className="italic gradient-text-primary">4 Simple Steps</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                step: "01",
                icon: "contact_support",
                title: "Contact Us",
                desc: "Reach out to our advisory desk for personalized market orientation.",
              },
              {
                step: "02",
                icon: "strategy",
                title: "Investment Strategy",
                desc: "Select the strategy plan tailored to your capital and risk tolerance.",
              },
              {
                step: "03",
                icon: "model_training",
                title: "Follow Guidance",
                desc: "Receive instant real-time market recommendations and entry/exit levels.",
              },
              {
                step: "04",
                icon: "insights",
                title: "Grow Your Capital",
                desc: "Execute disciplined trades to accomplish your long-term financial milestones.",
              },
            ].map((stepItem, sIdx) => (
              <motion.div
                key={sIdx}
                whileHover={{ y: -3 }}
                style={{
                  boxShadow:
                    "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="bg-[#171717] p-6 sm:p-7 rounded-2xl relative overflow-visible group border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col"
              >
                <div className="absolute top-0 right-0 bg-[#070707] text-premium-gold border-b border-l border-white/10 font-data-mono text-xs sm:text-sm px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-bl-xl font-bold shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)]">
                  {stepItem.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    {stepItem.icon}
                  </span>
                </div>
                <h4 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-2 font-headline">
                  {stepItem.title}
                </h4>
                <p className="font-body-md text-sm text-slate-text leading-relaxed">
                  {stepItem.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Free Consultation Callout */}
        <div className="text-center py-8 glass-panel rounded-2xl border border-elegant">
          <h3 className="font-headline-lg text-2xl sm:text-3xl font-normal text-on-surface mb-3 font-headline tracking-tight">
            Not Sure Which Service <span className="italic gradient-text-primary">Fits You</span>?
          </h3>
          <p className="font-body-lg text-sm sm:text-base text-slate-text max-w-xl mx-auto mb-6 px-4">
            Schedule a free consultation call and our research desk will help you choose the right strategy.
          </p>
          <a
            href="#contact"
            onClick={(e) => handleSmoothScroll(e, "contact")}
            className="gradient-bg-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-label-md text-sm font-bold text-background focus-ring cursor-pointer hover:shadow-[0_0_20px_rgba(78,222,163,0.5)] transition-all duration-300"
          >
            Book a Free Consultation
            <span className="material-symbols-outlined text-base">event</span>
          </a>
        </div>
      </section>

      {/* ========================================================
          4. PAYMENT SECTION (id="payment")
          ======================================================== */}
      <section
        id="payment"
        className="relative px-margin-mobile md:px-margin-desktop py-16 md:py-24 max-w-container-max mx-auto scroll-mt-24 before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-['']"
      >
        <div className="mb-12 sm:mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-surface-container-high/60 border border-premium-gold/30 rounded-full px-3.5 sm:px-4 py-1.5 w-fit mb-4 glass-panel shadow-sm mx-auto">
            <span
              className="material-symbols-outlined text-premium-gold text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="font-label-md text-[10px] sm:text-[11px] font-bold text-premium-gold uppercase tracking-widest">
              Official Payment Gateway &bull; SEBI Reg. INH000025300
            </span>
          </div>

          <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl font-normal text-on-surface mb-3 sm:mb-4 font-headline leading-tight tracking-tight">
            Official <span className="italic gradient-text-primary">Payment Portal</span>
          </h2>
          <p className="font-body-lg text-sm sm:text-base md:text-lg text-slate-text leading-relaxed">
            Make fast, direct, and zero-surcharge payments for Money Vriksh research subscriptions and advisory plans via verified Bank Transfer or UPI QR.
          </p>
        </div>

        {/* Bento Grid: Bank Details + UPI QR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-14 sm:mb-16">
          {/* Left: Bank Transfer Details (7 cols) */}
          <motion.div
            whileHover={{
              boxShadow:
                "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 30px 80px rgba(78, 222, 163, 0.15)",
            }}
            style={{ boxShadow: initialShadow }}
            transition={springTransition}
            className="lg:col-span-7 bg-[#171717] p-5 sm:p-8 rounded-2xl relative overflow-visible border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-primary text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      account_balance
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-lg text-xl sm:text-2xl md:text-3xl font-normal text-on-surface font-headline tracking-tight">
                      Bank <span className="italic gradient-text-primary">Transfer</span> (NEFT / IMPS / RTGS)
                    </h3>
                    <p className="font-label-md text-xs text-slate-text mt-0.5">
                      Direct deposit into official registered account
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={handleCopyAll}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="text-xs px-4 py-2 rounded-lg bg-surface-container-high/80 hover:bg-primary/10 border border-white/10 hover:border-primary/40 text-on-surface hover:text-primary transition-all flex items-center gap-1.5 font-bold cursor-pointer focus-ring"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedKey === "ALL" ? "done_all" : "content_copy"}
                  </span>
                  {copiedKey === "ALL" ? "All Copied!" : "Copy All Details"}
                </motion.button>
              </div>

              {/* Bank Detail Rows */}
              <div className="space-y-3.5">
                {bankDetails.map((item, idx) => (
                  <div
                    key={idx}
                    className="group bg-[#070707] p-3.5 sm:p-4 rounded-xl border border-white/5 hover:border-primary/30 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high/40 border border-white/5 flex items-center justify-center shrink-0 text-slate-text group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-label-md text-[10px] text-slate-text uppercase tracking-widest font-semibold">
                          {item.label}
                        </p>
                        <p
                          className={`font-data-mono font-bold text-base md:text-lg tracking-wide ${
                            item.label === "Account Number"
                              ? "text-primary"
                              : item.label === "Bank Name"
                              ? "text-premium-gold font-headline text-xl"
                              : "text-on-surface"
                          }`}
                        >
                          {item.displayValue || item.value}
                        </p>
                      </div>
                    </div>

                    {item.label === "Account Type" && (
                      <div className="self-end sm:self-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-label-md text-[11px] font-bold uppercase tracking-wider">
                          Verified Business
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Security Note */}
            <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-slate-text text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-emerald-400 text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock
                </span>
                <span>Direct bank transfers carry 0% convenience fees & 100% security.</span>
              </div>
              <span className="font-data-mono text-[11px] text-premium-gold/90 font-medium">
                Branch: Dhar, MP
              </span>
            </div>
          </motion.div>

          {/* Right: Scan to Pay QR Code (5 cols) */}
          <motion.div
            whileHover={{
              y: -3,
              boxShadow:
                "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 50px rgba(212, 175, 55, 0.3)",
            }}
            style={{ boxShadow: initialShadow }}
            transition={springTransition}
            className="lg:col-span-5 bg-[#171717] p-6 sm:p-8 rounded-2xl relative overflow-visible border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between text-center"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-white/5">
                <div className="text-left">
                  <h3 className="font-headline-lg text-2xl font-normal text-on-surface font-headline tracking-tight">
                    Scan &amp; <span className="italic text-premium-gold">Pay via UPI</span>
                  </h3>
                  <p className="font-label-md text-xs text-slate-text mt-0.5">
                    Fast checkout via any UPI Application
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Instant
                </div>
              </div>

              {/* QR Image Frame */}
              <div className="relative group mx-auto max-w-[260px] sm:max-w-[290px] bg-[#070707] p-4 rounded-2xl border border-white/10 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6),0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white p-3 flex items-center justify-center">
                  <Image
                    src={qrCodeImg}
                    alt="Money Vriksh UCO Bank UPI Payment QR Code"
                    priority
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => setImageModalOpen(true)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white font-medium text-xs cursor-pointer rounded-xl"
                  >
                    <span className="material-symbols-outlined text-3xl text-primary">
                      zoom_in
                    </span>
                    Click to View Large
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-text">
                  <span className="font-semibold text-on-surface">UCO Bank QR</span>
                  <button
                    onClick={() => setImageModalOpen(true)}
                    className="text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>Enlarge</span>
                    <span className="material-symbols-outlined text-xs">fullscreen</span>
                  </button>
                </div>
              </div>

              {/* Supported UPI Badges */}
              <div className="mt-6">
                <p className="font-label-md text-[10px] text-slate-text uppercase tracking-widest font-semibold mb-3">
                  Supported UPI Applications
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {["Google Pay", "PhonePe", "Paytm", "BHIM", "CRED", "Any Bank App"].map(
                    (app, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-[#070707] border border-white/5 text-[11px] font-medium text-slate-text shadow-sm"
                      >
                        {app}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="font-body-md text-xs text-slate-text">
                Scan with any app, verify <strong className="text-on-surface">GOURAV DHARKAR</strong> on your screen, and proceed with payment.
              </p>
            </div>
          </motion.div>
        </div>

        {/* 3-Step Payment Activation Guide */}
        <div className="mb-14 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="font-headline-lg text-2xl sm:text-3xl font-normal text-on-surface font-headline tracking-tight mb-2">
              Simple 3-Step <span className="italic gradient-text-primary">Activation</span>
            </h3>
            <p className="font-body-md text-slate-text max-w-xl mx-auto text-xs sm:text-sm">
              Follow these simple steps to complete your payment and activate your premium advisory services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paymentSteps.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{
                  y: -3,
                  boxShadow:
                    "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 40px rgba(16, 185, 129, 0.25)",
                }}
                style={{ boxShadow: initialShadow }}
                transition={springTransition}
                className="bg-[#171717] p-5 sm:p-7 rounded-2xl border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl sm:text-2xl text-primary">
                        {item.icon}
                      </span>
                    </div>
                    <span className="font-data-mono font-bold text-2xl sm:text-3xl text-white/10">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-2 font-headline">
                    {item.title}
                  </h4>
                  <p className="font-body-md text-slate-text text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Desk Confirmation Banner */}
        <motion.div
          whileHover={{ y: -2 }}
          style={{ boxShadow: initialShadow }}
          transition={springTransition}
          className="bg-[#171717] rounded-2xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 mb-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background-midnight via-primary/10 to-background-midnight z-0" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Completed Your Transfer?
            </div>
            <h3 className="font-headline-lg text-2xl sm:text-3xl md:text-5xl font-normal mb-3 sm:mb-4 font-headline text-on-surface tracking-tight">
              Share Screenshot for <span className="text-primary italic">Instant Activation</span>
            </h3>
            <p className="text-slate-text mb-6 sm:mb-8 leading-relaxed text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
              Send your transaction screenshot or 12-digit UTR reference directly to our compliance desk to fast-track your onboarding.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <a
                href="https://wa.me/919827562967?text=Hi%2C%20I%20have%20made%20a%20payment%20for%20Money%20Vriksh%20research%20service.%20Here%20is%20my%20payment%20proof."
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-bg-primary text-background font-label-md text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-full hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all font-bold focus-ring cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  chat
                </span>
                Send on WhatsApp (+91 98275 62967)
              </a>

              <a
                href="mailto:dharkargourav@gmail.com?subject=Payment%20Confirmation%20-%20Money%20Vriksh&body=Hello%20Money%20Vriksh%2C%0A%0AI%20have%20transferred%20the%20subscription%20fee.%20Attached%20is%20my%20payment%20receipt.%0A%0AName%3A%0APhone%3A%0AService%20Opted%3A%0AUTR%20%2F%20Transaction%20ID%3A"
                className="bg-[#070707] border border-white/10 hover:border-primary/40 text-premium-gold font-label-md text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-full hover:bg-white/5 transition-all font-bold focus-ring cursor-pointer shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  mail
                </span>
                Email Payment Receipt
              </a>
            </div>
          </div>
        </motion.div>

        {/* Regulatory & Advisory Notice */}
        <div className="bg-[#171717] p-5 sm:p-6 rounded-xl border border-white/5 text-slate-text text-xs leading-relaxed max-w-4xl mx-auto shadow-sm">
          <div className="flex items-start gap-3">
            <span
              className="material-symbols-outlined text-premium-gold text-xl shrink-0 mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            <div>
              <p className="font-semibold text-on-surface mb-1">
                Important Compliance &amp; Security Advisory:
              </p>
              <p className="text-slate-text">
                Please verify that the beneficiary name displays as <strong className="text-on-surface">GOURAV DHARKAR</strong> and bank is <strong className="text-on-surface">UCO BANK</strong> (A/C: <strong className="text-on-surface">22460210002377</strong>, IFSC: <strong className="text-on-surface">UCBA0002246</strong>). Money Vriksh operates strictly under SEBI Research Analyst registration <strong className="text-premium-gold">INH000025300</strong> and never solicits cash deposits or payments to unauthorized accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. CONTACT US SECTION (id="contact")
          ======================================================== */}
      <section
        id="contact"
        className="relative px-margin-mobile md:px-margin-desktop py-16 md:py-24 max-w-container-max mx-auto scroll-mt-24 before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-['']"
      >
        <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
          <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase mb-2 block font-semibold">
            Get In Touch
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl font-normal text-on-surface mb-3 sm:mb-4 font-headline leading-tight tracking-tight">
            Connect with Our <span className="italic gradient-text-primary">Research Desk</span>
          </h2>
          <p className="font-body-lg text-sm sm:text-base md:text-lg text-slate-text leading-relaxed">
            Connect with our experts for personalized financial strategies, compliance inquiries, or onboarding support.
          </p>
        </div>

        {/* Bento Grid: Form (7 cols) + Headquarters Info (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12 sm:mb-16">
          {/* Form Card */}
          <motion.div
            whileHover={{
              boxShadow:
                "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 30px 80px rgba(78, 222, 163, 0.15)",
            }}
            style={{ boxShadow: initialShadow }}
            transition={springTransition}
            className="lg:col-span-7 bg-[#171717] p-6 sm:p-8 rounded-2xl relative overflow-visible border-t border-white/20 border-x border-white/[0.02] border-b border-white/10"
          >
            <h3 className="font-headline-lg text-2xl sm:text-3xl font-normal mb-6 sm:mb-8 text-on-surface font-headline tracking-tight">
              Send us a <span className="italic gradient-text-primary">Message</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <label className="font-label-md text-[10px] text-slate-text mb-2 uppercase tracking-widest font-semibold">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    type="text"
                    className="bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 sm:p-3.5 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30 min-h-[44px] text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-label-md text-[10px] text-slate-text mb-2 uppercase tracking-widest font-semibold">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    type="email"
                    className="bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 sm:p-3.5 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30 min-h-[44px] text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <label className="font-label-md text-[10px] text-slate-text mb-2 uppercase tracking-widest font-semibold">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    type="tel"
                    className="bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 sm:p-3.5 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30 min-h-[44px] text-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-label-md text-[10px] text-slate-text mb-2 uppercase tracking-widest font-semibold">
                    Service Interest
                  </label>
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 sm:p-3.5 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30 appearance-none cursor-pointer min-h-[44px] text-sm"
                    >
                      <option>Select a service...</option>
                      <option>Equity Cash Market</option>
                      <option>Stock Futures</option>
                      <option>Index Futures (Nifty &amp; BankNifty)</option>
                      <option>Stock Options</option>
                      <option>Index Options</option>
                      <option>Commodity (MCX Gold &amp; Silver)</option>
                      <option>Long-Term Equity Portfolio</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-text">
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-[10px] text-slate-text mb-2 uppercase tracking-widest font-semibold">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 sm:p-3.5 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30 resize-none text-sm"
                  placeholder="How can we help you today?"
                  rows={4}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`w-full sm:w-auto text-background font-label-md text-sm px-8 py-3.5 rounded-lg mt-4 transition-all font-bold focus-ring cursor-pointer flex items-center justify-center gap-2 min-h-[44px] ${
                  isSuccess
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    : "bg-gradient-to-r from-primary to-success-emerald hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-background"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : isSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Submitted!
                  </>
                ) : (
                  "Submit Request"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Headquarters Info Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              whileHover={{
                y: -3,
                boxShadow:
                  "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 50px rgba(212, 175, 55, 0.45)",
              }}
              style={{ boxShadow: initialShadow }}
              transition={springTransition}
              className="bg-[#171717] p-6 sm:p-8 rounded-2xl flex-grow relative overflow-visible border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-headline-md text-lg font-bold text-premium-gold mb-6 font-headline">
                  Headquarters &amp; Direct Office
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        location_on
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-[10px] text-slate-text mb-1 uppercase tracking-wider font-semibold">
                        Address
                      </p>
                      <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                        103 Prakash Nagar,
                        <br />
                        Dhar, Madhya Pradesh 454001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        mail
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-[10px] text-slate-text mb-1 uppercase tracking-wider font-semibold">
                        Email
                      </p>
                      <a
                        href="mailto:dharkargourav@gmail.com"
                        className="font-body-md text-body-md text-on-surface font-semibold hover:text-primary transition-colors block break-all"
                      >
                        dharkargourav@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        call
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-[10px] text-slate-text mb-1 uppercase tracking-wider font-semibold">
                        Phone
                      </p>
                      <a
                        href="tel:+919827562967"
                        className="font-data-mono text-data-mono text-on-surface font-bold hover:text-primary transition-colors block"
                      >
                        +91 98275 62967
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-label-md text-[10px] text-slate-text uppercase tracking-wider font-semibold">
                    Support Hours
                  </p>
                  <p className="font-data-mono text-xs text-on-surface/80 mt-0.5">
                    Mon – Fri: 9:00 AM – 6:00 PM IST
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Active
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <a
            href="tel:+919827562967"
            className="block h-full group focus-ring rounded-2xl cursor-pointer"
          >
            <motion.div
              whileHover={{
                y: -3,
                boxShadow:
                  "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 40px rgba(16, 185, 129, 0.4)",
              }}
              style={{ boxShadow: initialShadow }}
              transition={springTransition}
              className="bg-[#171717] p-5 sm:p-6 rounded-2xl h-full border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between min-h-[170px]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl text-primary block">
                  support_agent
                </span>
              </div>
              <div>
                <h4 className="font-headline-md text-base font-bold text-on-surface mb-1 font-headline">
                  Talk to an Expert
                </h4>
                <p className="font-body-md text-xs text-slate-text">
                  Call directly at +91 98275 62967
                </p>
              </div>
              <div className="font-data-mono text-xs text-primary font-bold mt-4">
                Call Now →
              </div>
            </motion.div>
          </a>

          <a
            href="mailto:dharkargourav@gmail.com"
            className="block h-full group focus-ring rounded-2xl cursor-pointer"
          >
            <motion.div
              whileHover={{
                y: -3,
                boxShadow:
                  "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 40px rgba(212, 175, 55, 0.4)",
              }}
              style={{ boxShadow: initialShadow }}
              transition={springTransition}
              className="bg-[#171717] p-5 sm:p-6 rounded-2xl h-full border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between min-h-[170px]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <span
                  className="material-symbols-outlined text-3xl text-premium-gold block"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  gavel
                </span>
              </div>
              <div>
                <h4 className="font-headline-md text-base font-bold text-on-surface mb-1 font-headline">
                  Compliance Desk
                </h4>
                <p className="font-body-md text-xs text-slate-text">
                  Write to dharkargourav@gmail.com
                </p>
              </div>
              <div className="font-data-mono text-xs text-premium-gold font-bold mt-4">
                Email Desk →
              </div>
            </motion.div>
          </a>

          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              const faqEl = document.getElementById("faq");
              if (faqEl) faqEl.scrollIntoView({ behavior: "smooth" });
            }}
            className="block h-full group focus-ring rounded-2xl sm:col-span-2 lg:col-span-1 cursor-pointer"
          >
            <motion.div
              whileHover={{
                y: -3,
                boxShadow:
                  "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 40px rgba(16, 185, 129, 0.4)",
              }}
              style={{ boxShadow: initialShadow }}
              transition={springTransition}
              className="bg-[#171717] p-5 sm:p-6 rounded-2xl h-full border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between min-h-[170px]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl text-primary block">
                  help
                </span>
              </div>
              <div>
                <h4 className="font-headline-md text-base font-bold text-on-surface mb-1 font-headline">
                  General Support &amp; FAQ
                </h4>
                <p className="font-body-md text-xs text-slate-text">
                  Common queries and subscription questions.
                </p>
              </div>
              <div className="font-data-mono text-xs text-primary font-bold mt-4">
                View FAQ Below ↓
              </div>
            </motion.div>
          </a>
        </div>

        {/* FAQ Section Accordion */}
        <motion.div
          id="faq"
          style={{ boxShadow: initialShadow }}
          className="bg-[#171717] p-6 sm:p-8 md:p-10 rounded-2xl max-w-4xl mx-auto border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 scroll-mt-28"
        >
          <h3 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-normal mb-6 sm:mb-8 text-center text-on-surface font-headline tracking-tight">
            Frequent <span className="italic gradient-text-primary">Inquiries</span>
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border-b border-white/5 pb-4">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left py-3 font-headline-md text-sm sm:text-base font-bold text-on-surface font-headline cursor-pointer hover:text-primary transition-colors focus-ring rounded min-h-[44px]"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="material-symbols-outlined text-primary shrink-0"
                    >
                      expand_more
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="overflow-hidden pl-3 sm:pl-4 border-l-2 border-primary/30 mt-3 sm:mt-4 border-t border-white/[0.04] pt-3 sm:pt-4"
                      >
                        <p className="font-body-md text-xs sm:text-sm text-slate-text leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          6. DISCLOSURE SECTION (id="disclosure")
          ======================================================== */}
      <section
        id="disclosure"
        className="relative px-margin-mobile md:px-margin-desktop py-16 md:py-24 max-w-container-max mx-auto scroll-mt-24 before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-['']"
      >
        {/* Warning Banner */}
        <motion.div
          style={{ boxShadow: cardShadow }}
          className="bg-[#171717] border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 border-l-4 border-l-premium-gold rounded-xl p-5 sm:p-6 mb-10"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-premium-gold text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>
            <div>
              <h3 className="font-headline-md text-sm sm:text-base font-bold text-premium-gold mb-1 sm:mb-2 font-headline uppercase tracking-wider">
                Important Regulatory Notice
              </h3>
              <p className="font-body-lg text-xs sm:text-sm text-on-surface leading-relaxed">
                Investment in securities markets are subject to market risks. Read all related documents carefully before investing. SEBI Registration No:{" "}
                <span className="font-data-mono text-data-mono text-on-surface bg-surface-container-high px-2 py-0.5 rounded font-bold">
                  INH000025300
                </span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase mb-2 block font-semibold">
            Compliance &amp; Ethics
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl font-normal text-on-surface mb-3 font-headline tracking-tight">
            Legal <span className="italic gradient-text-primary">Disclosures</span>
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-slate-text leading-relaxed">
            Statutory and regulatory disclosures in full accordance with Securities and Exchange Board of India (Research Analysts) Regulations, 2014.
          </p>
        </div>

        {/* Filter / Quick Jump Pills */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveDisclosureId("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus-ring ${
              activeDisclosureId === "all"
                ? "bg-primary text-background font-bold shadow-md"
                : "bg-[#171717] text-slate-text border border-white/10 hover:text-primary hover:border-primary/30"
            }`}
          >
            All Disclosures ({disclosureSections.length})
          </button>
          {disclosureSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveDisclosureId(sec.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus-ring flex items-center gap-1.5 ${
                activeDisclosureId === sec.id
                  ? "bg-primary text-background font-bold shadow-md"
                  : "bg-[#171717] text-slate-text border border-white/10 hover:text-primary hover:border-primary/30"
              }`}
            >
              <span className="material-symbols-outlined text-xs">{sec.icon}</span>
              {sec.title}
            </button>
          ))}
        </div>

        {/* Disclosures Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {disclosureSections
            .filter((sec) => activeDisclosureId === "all" || activeDisclosureId === sec.id)
            .map((sec) => (
              <motion.div
                key={sec.id}
                id={sec.id}
                whileHover={{ y: -2 }}
                style={{ boxShadow: cardShadow }}
                transition={springTransition}
                className="bg-[#171717] rounded-2xl p-6 sm:p-7 border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 relative overflow-visible"
              >
                <h3 className="font-headline-lg text-lg sm:text-xl font-normal text-on-surface mb-4 flex items-center gap-3 font-headline tracking-tight">
                  <div className="w-10 h-10 rounded-lg bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">{sec.icon}</span>
                  </div>
                  {sec.title}
                </h3>
                <div className="text-slate-text font-body-md text-xs sm:text-sm leading-relaxed pl-1">
                  {sec.content}
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* ========================================================
          QR ZOOM MODAL
          ======================================================== */}
      <AnimatePresence>
        {imageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setImageModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative z-10 bg-[#121212] border border-white/10 p-5 sm:p-6 rounded-3xl max-w-[380px] sm:max-w-[420px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(78,222,163,0.12)] my-auto"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-lg">qr_code_2</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-base text-on-surface leading-tight">
                      Scan &amp; Pay via UPI
                    </h4>
                    <p className="font-body-md text-[11px] text-slate-text">
                      Money Vriksh &bull; UCO Bank
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setImageModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-text hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-inner mx-auto w-fit">
                <div className="relative w-[210px] h-[210px] sm:w-[240px] sm:h-[240px]">
                  <Image
                    src={qrCodeImg}
                    alt="Money Vriksh UCO Bank UPI Payment QR Code"
                    fill
                    sizes="(max-width: 640px) 210px, 240px"
                    priority
                    className="object-contain"
                  />
                </div>
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5 text-neutral-600 text-[11px] font-medium tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Scan with any UPI App</span>
                </div>
              </div>

              <div className="mt-4 bg-[#0a0a0a] rounded-xl p-3 border border-white/5 text-center">
                <p className="text-[11px] text-slate-text uppercase tracking-wider font-semibold">
                  Verified Account Holder
                </p>
                <p className="font-bold text-sm text-on-surface mt-0.5 font-headline">
                  GOURAV DHARKAR
                </p>
                <p className="font-data-mono text-[10px] text-premium-gold/90 mt-1">
                  UCO BANK &bull; A/C: 22460210002377 &bull; UCBA0002246
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-3">
                <button
                  onClick={() => setImageModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-slate-text hover:text-white font-medium transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
                <a
                  href="/qr-code.png"
                  download="Money_Vriksh_Payment_QR.png"
                  className="flex-1 py-2.5 px-4 rounded-xl gradient-bg-primary text-background text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(78,222,163,0.4)] flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Save QR
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
