'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CategoryCard from './components/CategoryCard';
import { serviceCategories } from './data';

const MotionLink = motion.create(Link);

export default function ServicesPage() {
  return (
    <div className="relative w-full pt-[120px] pb-24">
      <div className="light-leak-primary top-[-100px] left-[-100px]" />
      <div className="light-leak-secondary bottom-[-100px] right-[-100px]" />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center md:text-left"
        >
          <h1 className="font-headline text-4xl md:text-6xl font-normal text-on-surface mb-6 mt-6 leading-tight tracking-tight">
            <span className="italic">Precision</span> Strategies for <br className="hidden md:block" />
            <span className="gradient-text-primary italic">Every Market Condition</span>
          </h1>
          <p className="font-body-lg text-body-lg text-slate-text max-w-2xl mx-auto md:mx-0 mb-6 leading-relaxed">
            Institutional-grade research and actionable insights tailored to your investment style.
            Choose your domain and explore specialized strategies.
          </p>
        </motion.section>

        {/* Category Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {serviceCategories.map((category, idx) => (
            <CategoryCard key={category.id} category={category} index={idx} />
          ))}
        </section>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-2xl p-8 border border-elegant mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-headline-md text-3xl font-bold gradient-text-primary font-headline">12+</p>
              <p className="font-label-md text-xs text-slate-text uppercase tracking-wider mt-1">Specialized Services</p>
            </div>
            <div className="text-center">
              <p className="font-headline-md text-3xl font-bold text-premium-gold font-headline">2</p>
              <p className="font-label-md text-xs text-slate-text uppercase tracking-wider mt-1">Market Domains</p>
            </div>
            <div className="text-center">
              <p className="font-headline-md text-3xl font-bold text-on-surface font-headline">85%+</p>
              <p className="font-label-md text-xs text-slate-text uppercase tracking-wider mt-1">Avg. Win Rate</p>
            </div>
            <div className="text-center">
              <p className="font-headline-md text-3xl font-bold text-on-surface font-headline">SEBI</p>
              <p className="font-label-md text-xs text-slate-text uppercase tracking-wider mt-1">Registered</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <h2 className="font-headline-lg text-2xl md:text-4xl font-normal text-on-surface mb-4 font-headline tracking-tight">
            Not Sure Which Service <span className="italic gradient-text-primary">Fits You</span>?
          </h2>
          <p className="font-body-lg text-body-lg text-slate-text max-w-xl mx-auto mb-8">
            Schedule a free consultation call and our experts will help you choose the right strategy.
          </p>
          <MotionLink
            href="/contact"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="gradient-bg-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-label-md text-sm font-bold text-background focus-ring cursor-pointer hover:shadow-[0_0_20px_rgba(78,222,163,0.5)] transition-all duration-300"
          >
            Book a Free Consultation
            <span className="material-symbols-outlined text-base">event</span>
          </MotionLink>
        </motion.section>
      </main>
    </div>
  );
}
