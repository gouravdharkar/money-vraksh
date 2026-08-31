'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SubServiceCard from '../components/SubServiceCard';
import { ServiceCategory, ACCENT_THEMES } from '../types';

interface CategoryPageClientProps {
  category: ServiceCategory;
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const theme = ACCENT_THEMES[category.accentColor] || ACCENT_THEMES.emerald;

  const textAccent = theme.text;
  const borderClass = theme.border;
  const bgAccent = theme.bg;
  const glowBgClass = theme.glow;
  const btnBg = theme.btnBg;

  // Split subservices into Intraday and Positional
  const intradayServices = category.subServices.filter(
    s => s.categoryLabel.toLowerCase() === 'intraday'
  );
  const positionalServices = category.subServices.filter(
    s => s.categoryLabel.toLowerCase() === 'positional'
  );

  return (
    <div className="relative w-full pt-[120px] pb-24">
      <div className="light-leak-primary top-[-100px] left-[-200px]" />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 mb-8 text-sm"
        >
          <Link href="/services" className="text-slate-text hover:text-primary transition-colors font-label-md">Services</Link>
          <span className="material-symbols-outlined text-sm text-slate-text">chevron_right</span>
          <span className={`font-label-md ${textAccent}`}>{category.name}</span>
        </motion.div>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${bgAccent} border ${borderClass} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined text-2xl sm:text-3xl ${textAccent}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {category.icon}
              </span>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-lg ${bgAccent} ${textAccent} text-[10px] sm:text-xs font-bold tracking-wider uppercase`}>
                {category.shortName}
              </span>
              <h1 className="font-headline text-2xl sm:text-4xl md:text-5xl font-normal text-on-surface mt-2 leading-tight tracking-tight">
                {category.name} <span className="italic">Strategies</span>
              </h1>
            </div>
          </div>
          <p className="font-body-lg text-sm sm:text-base text-slate-text max-w-2xl leading-relaxed">
            {category.longDescription}
          </p>
        </motion.section>

        {/* Section A: Intraday Calls */}
        {intradayServices.length > 0 && (
          <section className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-elegant pb-4">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-1 ${glowBgClass} rounded-full`} />
                <div>
                  <h2 className="font-headline-lg text-2xl md:text-3xl font-normal text-on-surface font-headline tracking-tight">
                    Intraday <span className="italic">Trading Calls</span>
                  </h2>
                  <p className="text-xs text-slate-text mt-1">Same-day positions with strict target entries and capital safety rules</p>
                </div>
              </div>
              <span className="text-slate-text font-label-md text-xs">
                {intradayServices.length} Active Services
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {intradayServices.map((service, idx) => (
                <SubServiceCard key={service.id} service={service} index={idx} categoryId={category.id} />
              ))}
            </div>
          </section>
        )}

        {/* Section B: Positional Calls */}
        {positionalServices.length > 0 && (
          <section className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-elegant pb-4">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-1 ${glowBgClass} rounded-full`} />
                <div>
                  <h2 className="font-headline-lg text-2xl md:text-3xl font-normal text-on-surface font-headline tracking-tight">
                    Positional &amp; <span className="italic">Holding Calls</span>
                  </h2>
                  <p className="text-xs text-slate-text mt-1">Multi-day swings and investment suggestions for progressive capital growth</p>
                </div>
              </div>
              <span className="text-slate-text font-label-md text-xs">
                {positionalServices.length} Active Services
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {positionalServices.map((service, idx) => (
                <SubServiceCard key={service.id} service={service} index={idx} categoryId={category.id} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-2xl p-8 md:p-12 border border-elegant text-center"
        >
          <h2 className="font-headline-lg text-2xl md:text-4xl font-normal text-on-surface mb-4 font-headline tracking-tight">
            Need Help Choosing a <span className={`italic ${textAccent}`}>{category.name}</span> Service?
          </h2>
          <p className="font-body-lg text-body-lg text-slate-text max-w-xl mx-auto mb-8">
            Our advisory team will analyze your risk tolerance and find the perfect match.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-label-md text-sm font-bold text-white transition-all duration-300"
            style={{ background: btnBg }}
          >
            Talk to an Expert
            <span className="material-symbols-outlined text-base">support_agent</span>
          </Link>
        </motion.section>
      </main>
    </div>
  );
}
