"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../components/Toast";

interface BankDetailItem {
  label: string;
  value: string;
  copyValue?: string;
  displayValue?: string;
  icon: string;
  highlight?: boolean;
}

export default function PaymentPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

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
    const fullText = `BANK DETAILS FOR PAYMENT - MONEYVRAKSH
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

  const initialShadow =
    "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 30px 80px rgba(0, 0, 0, 0.6)";
  const springTransition = { type: "spring" as const, stiffness: 200, damping: 18 };

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

  return (
    <div className="relative w-full pt-[100px] sm:pt-[120px] pb-24 min-h-screen">
      {/* Ambient Lighting Background */}
      <div className="light-leak-primary top-[-100px] left-[-200px]" />
      <div className="light-leak-secondary top-[35%] right-[-150px]" />

      <main className="flex-grow px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        {/* Header */}
        <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-surface-container-high/60 border border-premium-gold/30 rounded-full px-3.5 sm:px-4 py-1.5 w-fit mb-4 glass-panel shadow-sm mx-auto">
            <span className="material-symbols-outlined text-premium-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="font-label-md text-[10px] sm:text-[11px] font-bold text-premium-gold uppercase tracking-widest">
              Official Payment Gateway &bull; SEBI Reg. INH000025300
            </span>
          </div>

          <h1 className="font-display-lg text-3xl sm:text-5xl md:text-6xl font-normal text-on-surface mb-3 sm:mb-4 font-headline leading-tight tracking-tight">
            Official <span className="italic gradient-text-primary">Payment Portal</span>
          </h1>
          <p className="font-body-lg text-sm sm:text-base md:text-lg text-slate-text leading-relaxed">
            Make fast, direct, and zero-surcharge payments for MoneyVraksh research subscriptions and advisory plans via verified Bank Transfer or UPI QR.
          </p>
        </div>

        {/* Bento Grid: Bank Transfer & UPI QR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12 sm:mb-16">
          {/* Left Column: Bank Account Details (7 Columns on desktop) */}
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-white/5">
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
                    <h2 className="font-headline-lg text-2xl md:text-3xl font-normal text-on-surface font-headline tracking-tight">
                      Bank <span className="italic gradient-text-primary">Transfer</span> (NEFT / IMPS / RTGS)
                    </h2>
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
              <div className="space-y-4">
                {bankDetails.map((item, idx) => {
                  const isCopied = copiedKey === item.label;
                  return (
                    <div
                      key={idx}
                      className="group bg-[#070707] p-4 rounded-xl border border-white/5 hover:border-primary/30 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high/40 border border-white/5 flex items-center justify-center shrink-0 text-slate-text group-hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-lg">
                            {item.icon}
                          </span>
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
                  );
                })}
              </div>
            </div>

            {/* Bottom Security Note */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-slate-text text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                <span>Direct bank transfers carry 0% convenience fees & 100% security.</span>
              </div>
              <span className="font-data-mono text-[11px] text-premium-gold/90 font-medium">
                Branch: Dhar, MP
              </span>
            </div>
          </motion.div>

          {/* Right Column: Scan to Pay QR Code (5 Columns) */}
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
                  <h2 className="font-headline-lg text-2xl font-normal text-on-surface font-headline tracking-tight">
                    Scan &amp; <span className="italic text-premium-gold">Pay via UPI</span>
                  </h2>
                  <p className="font-label-md text-xs text-slate-text mt-0.5">
                    Fast checkout via any UPI Application
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Instant
                </div>
              </div>

              {/* QR Image Frame */}
              <div className="relative group mx-auto max-w-[280px] sm:max-w-[320px] bg-[#070707] p-4 rounded-2xl border border-white/10 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6),0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                  <Image
                    src="/payment.jpeg"
                    alt="MoneyVraksh UCO Bank UPI Payment QR Code"
                    width={400}
                    height={400}
                    priority
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle overlay button for zoom */}
                  <button
                    onClick={() => setImageModalOpen(true)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white font-medium text-xs cursor-pointer"
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
                  {["Google Pay", "PhonePe", "Paytm", "BHIM", "CRED", "Any Bank App"].map((app, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-[#070707] border border-white/5 text-[11px] font-medium text-slate-text shadow-sm"
                    >
                      {app}
                    </span>
                  ))}
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
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-normal text-on-surface font-headline tracking-tight mb-2">
              Simple 3-Step <span className="italic gradient-text-primary">Activation</span>
            </h2>
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
                  <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-2 font-headline">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-slate-text text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Confirmation Action Desk Banner */}
        <motion.div
          whileHover={{ y: -2 }}
          style={{ boxShadow: initialShadow }}
          transition={springTransition}
          className="bg-[#171717] rounded-2xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 mb-12 sm:mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background-midnight via-primary/10 to-background-midnight z-0" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              Completed Your Transfer?
            </div>
            <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-5xl font-normal mb-3 sm:mb-4 font-headline text-on-surface tracking-tight">
              Share Screenshot for <span className="text-primary italic">Instant Activation</span>
            </h2>
            <p className="text-slate-text mb-6 sm:mb-8 leading-relaxed text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
              Send your transaction screenshot or 12-digit UTR reference directly to our compliance desk to fast-track your onboarding.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <a
                href="https://wa.me/919827562967?text=Hi%2C%20I%20have%20made%20a%20payment%20for%20MoneyVraksh%20service.%20Here%20is%20my%20payment%20proof."
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
                href="mailto:dharkargourav@gmail.com?subject=Payment%20Confirmation%20-%20MoneyVraksh&body=Hello%20MoneyVraksh%20Team%2C%0A%0AI%20have%20transferred%20the%20subscription%20fee.%20Attached%20is%20my%20payment%20receipt.%0A%0AName%3A%0APhone%3A%0AService%20Opted%3A%0AUTR%20%2F%20Transaction%20ID%3A"
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
        <div className="bg-[#171717] p-6 rounded-xl border border-white/5 text-slate-text text-xs leading-relaxed max-w-4xl mx-auto shadow-sm">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-premium-gold text-xl shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              info
            </span>
            <div>
              <p className="font-semibold text-on-surface mb-1">
                Important Compliance &amp; Security Advisory:
              </p>
              <p className="text-slate-text">
                Please verify that the beneficiary name displays as <strong className="text-on-surface">GOURAV DHARKAR</strong> and bank is <strong className="text-on-surface">UCO BANK</strong> (A/C: <strong className="text-on-surface">22460210002377</strong>, IFSC: <strong className="text-on-surface">UCBA0002246</strong>). MoneyVraksh operates strictly under SEBI Research Analyst registration <strong className="text-premium-gold">INH000025300</strong> and never solicits cash deposits or payments to unauthorized accounts.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {imageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setImageModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative z-10 bg-[#171717] border border-white/10 p-6 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline-md font-bold text-lg text-on-surface">
                  MoneyVraksh UPI Payment QR
                </h3>
                <button
                  onClick={() => setImageModalOpen(false)}
                  className="p-1 rounded-lg text-slate-text hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 border border-white/5">
                <Image
                  src="/payment.jpeg"
                  alt="UCO Bank UPI QR Code"
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <p className="font-data-mono text-xs text-slate-text">
                  A/C: 22460210002377 &bull; UCBA0002246
                </p>
                <a
                  href="/payment.jpeg"
                  download="MoneyVraksh_Payment_QR.jpeg"
                  className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download QR
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
