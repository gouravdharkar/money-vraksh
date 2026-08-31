"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../components/Toast";

interface FAQItem {
  question: string;
  answer: string;
}

export default function Contact() {
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

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

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

  const faqs: FAQItem[] = [
    {
      question: "How long does onboarding take?",
      answer: "Standard KYC and onboarding usually takes 24-48 business hours after all required documents are submitted."
    },
    {
      question: "Are my investments safe?",
      answer: "We operate strictly within regulatory frameworks to ensure maximum transparency, compliance, and capital protection."
    },
    {
      question: "Can I upgrade my service plan later?",
      answer: "Yes, you can upgrade your service tier at any time through your dashboard or by contacting your dedicated account manager."
    }
  ];

  const initialShadow = "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 30px 80px rgba(0, 0, 0, 0.6)";
  const springTransition = { type: "spring" as const, stiffness: 200, damping: 18 };

  return (
    <div className="relative w-full pt-[120px] pb-24">
      {/* Light Leak Effect */}
      <div className="fixed inset-0 light-leak z-0" />

      <main className="flex-grow px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <h1 className="font-display-lg text-4xl md:text-6xl font-normal text-on-surface mb-4 font-headline leading-tight tracking-tight">
            Get in <span className="italic gradient-text-primary">Touch</span>
          </h1>
          <p className="font-body-lg text-body-lg text-slate-text max-w-2xl leading-relaxed">
            Connect with our experts for personalized financial strategies, compliance inquiries, or general support.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-16">
          {/* Left Column: Form (Spans 7) */}
          <motion.div 
            whileHover={{
              boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 30px 80px rgba(78, 222, 163, 0.15)"
            }}
            style={{ boxShadow: initialShadow }}
            transition={springTransition}
            className="md:col-span-7 bg-[#171717] p-8 rounded-2xl relative overflow-visible border-t border-white/20 border-x border-white/[0.02] border-b border-white/10"
          >
            <h2 className="font-headline-lg text-2xl md:text-3xl font-normal mb-8 text-on-surface font-headline tracking-tight">
              Send us a <span className="italic gradient-text-primary">Message</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30"
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
                    className="bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30"
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
                      className="w-full bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30 appearance-none cursor-pointer"
                    >
                      <option>Select a service...</option>
                      <option>Portfolio Management</option>
                      <option>Equity Research</option>
                      <option>Algo Trading</option>
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
                  className="bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] text-on-surface p-3 rounded-lg focus:border-primary/40 focus:outline-none transition-all focus:ring-1 focus:ring-primary/30 resize-none"
                  placeholder="How can we help you today?"
                  rows={4}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`w-full md:w-auto text-background font-label-md text-sm px-8 py-3 rounded-lg mt-4 transition-all font-bold focus-ring cursor-pointer flex items-center justify-center gap-2 ${
                  isSuccess
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    : "bg-gradient-to-r from-primary to-success-emerald hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

          {/* Right Column: Info (Spans 5) */}
          <div className="md:col-span-5 flex flex-col gap-gutter">
            {/* Contact Details Card */}
            <motion.div 
              whileHover={{
                y: -3,
                boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 50px rgba(212, 175, 55, 0.45)"
              }}
              style={{ boxShadow: initialShadow }}
              transition={springTransition}
              className="bg-[#171717] p-8 rounded-2xl flex-grow relative overflow-visible border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-headline-md text-lg font-bold text-premium-gold mb-6 font-headline">
                  Headquarters
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
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
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
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
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
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

        {/* Quick Contact Cards (Bento row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-16">
          <a
            href="tel:+919827562967"
            className="block h-full group focus-ring rounded-2xl cursor-pointer"
          >
            <motion.div
              whileHover={{
                y: -3,
                boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 40px rgba(16, 185, 129, 0.4)"
              }}
              style={{ boxShadow: initialShadow }}
              transition={springTransition}
              className="bg-[#171717] p-6 rounded-2xl h-full border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between min-h-[180px]"
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
                boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 40px rgba(212, 175, 55, 0.4)"
              }}
              style={{ boxShadow: initialShadow }}
              transition={springTransition}
              className="bg-[#171717] p-6 rounded-2xl h-full border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between min-h-[180px]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl text-premium-gold block" style={{ fontVariationSettings: "'FILL' 1" }}>
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

          <Link
            href="/contact"
            className="block h-full group focus-ring rounded-2xl"
          >
            <motion.div
              whileHover={{
                y: -3,
                boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 40px rgba(16, 185, 129, 0.4)"
              }}
              style={{ boxShadow: initialShadow }}
              transition={springTransition}
              className="bg-[#171717] p-6 rounded-2xl h-full border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col justify-between min-h-[180px]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl text-primary block">
                  help
                </span>
              </div>
              <div>
                <h4 className="font-headline-md text-base font-bold text-on-surface mb-1 font-headline">
                  General Support
                </h4>
                <p className="font-body-md text-xs text-slate-text">
                  Account access and billing questions.
                </p>
              </div>
              <div className="font-data-mono text-xs text-primary font-bold mt-4">
                Visit Help Center →
              </div>
            </motion.div>
          </Link>
        </div>

        {/* FAQ Section */}
        <motion.div 
          style={{ boxShadow: initialShadow }}
          className="bg-[#171717] p-8 rounded-2xl max-w-4xl mx-auto border-t border-white/20 border-x border-white/[0.02] border-b border-white/10"
        >
          <h2 className="font-headline-lg text-2xl md:text-4xl font-normal mb-8 text-center text-on-surface font-headline tracking-tight">
            Frequent <span className="italic gradient-text-primary">Inquiries</span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border-b border-white/5 pb-4">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left py-2 font-headline-md text-base font-bold text-on-surface font-headline cursor-pointer hover:text-primary transition-colors focus-ring rounded"
                  >
                    {faq.question}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="material-symbols-outlined text-primary"
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
                        className="overflow-hidden pl-4 border-l-2 border-primary/30 mt-4 border-t border-white/[0.04] pt-4"
                      >
                        <p className="font-body-md text-body-md text-slate-text leading-relaxed">
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
      </main>
    </div>
  );
}
