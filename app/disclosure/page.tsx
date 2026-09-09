"use client";

import { motion } from "framer-motion";

export default function Disclosure() {
  const cardShadow = "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4)";
  const springTransition = { type: "spring" as const, stiffness: 200, damping: 18 };

  const sections = [
    {
      id: "history",
      title: "History & Business",
      icon: "corporate_fare",
      content: (
        <>
          <p>
            MoneyVriksh is an independent equity research firm dedicated to providing high-quality, actionable insights to institutional and high-net-worth investors. Founded with a commitment to analytical rigor, our business model focuses entirely on proprietary research without the conflicts inherent in investment banking or proprietary trading operations.
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
            The information and views presented in our research reports are prepared by MoneyVriksh solely for informational purposes and are not intended to be a complete description of the securities, markets, or developments referred to in the material.
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
            There are no material disciplinary actions, penalties, or litigations pending against MoneyVriksh or its key managerial personnel by any regulatory authority (including SEBI, stock exchanges, or other judicial bodies) as of the date of these disclosures.
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
            MoneyVriksh does not have any material associate or group companies engaged in merchant banking, brokerage, portfolio management, or lending operations.
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
            Pursuant to the SEBI (Research Analysts) Regulations, 2014, MoneyVriksh and its associated research analysts hereby declare:
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
    <div className="relative w-full pt-[100px] sm:pt-[120px] pb-24">
      {/* Light Leak backdrop */}
      <div className="light-leak-primary top-[10%] left-[-200px] opacity-40" />

      <main className="flex-grow px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        {/* Warning Banner */}
        <motion.div 
          style={{ boxShadow: cardShadow }}
          className="bg-[#171717] border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 border-l-4 border-l-premium-gold rounded-xl p-5 sm:p-6 mb-8"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-premium-gold text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
            </div>
            <div>
              <h2 className="font-headline-md text-sm sm:text-base font-bold text-premium-gold mb-1 sm:mb-2 font-headline uppercase tracking-wider">
                Important Regulatory Notice
              </h2>
              <p className="font-body-lg text-xs sm:text-sm text-on-surface leading-relaxed">
                Investment in securities markets are subject to market risks. Read all related documents carefully before investing. SEBI Registration No: <span className="font-data-mono text-data-mono text-on-surface bg-surface-container-high px-2 py-0.5 rounded font-bold">INH000025300</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mobile Quick-Jump Pills */}
        <div className="lg:hidden mb-8 overflow-x-auto pb-2 -mx-margin-mobile px-margin-mobile flex gap-2 no-scrollbar">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                const element = document.getElementById(sec.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-[#171717] border border-white/10 text-slate-text hover:text-primary text-xs font-semibold whitespace-nowrap focus-ring shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm text-primary">{sec.icon}</span>
              {sec.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar Navigation (Desktop) */}
          <div className="lg:col-span-3 hidden lg:block">
            <div 
              style={{ boxShadow: cardShadow }}
              className="sticky top-[120px] bg-[#171717] rounded-2xl p-4 border-t border-white/20 border-x border-white/[0.02] border-b border-white/10"
            >
              <nav className="flex flex-col space-y-1.5">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      const element = document.getElementById(sec.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-left w-full text-on-surface-variant hover:text-primary hover:bg-white/5 px-3.5 py-2.5 border-l-2 border-transparent hover:border-primary rounded-r-lg font-label-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer focus-ring"
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Cards */}
          <div className="lg:col-span-9 space-y-6">
            <h1 className="font-display-lg text-3xl sm:text-4xl font-normal text-primary mb-6 lg:hidden font-headline tracking-tight">
              Legal <span className="italic">Disclosures</span>
            </h1>

            {sections.map((sec) => (
              <motion.section
                key={sec.id}
                id={sec.id}
                whileHover={{ y: -2 }}
                style={{ boxShadow: cardShadow }}
                transition={springTransition}
                className="bg-[#171717] rounded-2xl p-6 sm:p-8 scroll-mt-24 sm:scroll-mt-28 border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 relative overflow-visible"
              >
                <h2 className="font-headline-lg text-lg sm:text-xl md:text-2xl font-normal text-on-surface mb-5 sm:mb-6 flex items-center gap-3 font-headline tracking-tight">
                  <div className="w-10 h-10 rounded-lg bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">{sec.icon}</span>
                  </div>
                  {sec.title}
                </h2>
                <div className="prose prose-invert max-w-none text-slate-text font-body-md text-xs sm:text-sm md:text-base leading-relaxed pl-1">
                  {sec.content}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
