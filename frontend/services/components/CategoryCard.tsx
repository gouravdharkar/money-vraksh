'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ServiceCategory, ACCENT_THEMES } from '../types';

interface CategoryCardProps {
  category: ServiceCategory;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const theme = ACCENT_THEMES[category.accentColor] || ACCENT_THEMES.emerald;

  const iconColor = theme.text;
  const badgeBg = theme.bg;
  const badgeText = theme.text;
  const accentBar = theme.accentBar;
  const btnBg = theme.btnBg;

  const initialShadow = "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 30px 80px rgba(0, 0, 0, 0.6)";
  const hoverShadow = `inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 50px ${theme.glowRgba}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: index * 0.12 }}
    >
      <Link href={`/services/${category.id}`} className="block group h-full focus-ring rounded-2xl">
        <motion.div 
          whileHover={{
            y: -3,
            boxShadow: hoverShadow
          }}
          style={{
            boxShadow: initialShadow
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 18
          }}
          className="bg-[#171717] rounded-2xl border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 h-full flex flex-col relative overflow-visible"
        >
          <div className="relative z-10 p-8 md:p-10 flex-1 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
              <span className={`material-symbols-outlined text-3xl ${iconColor}`}
                style={{ fontVariationSettings: "'FILL' 1" }}>
                {category.icon}
              </span>
            </div>

            <div className="flex items-center gap-2.5 mb-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${badgeBg} ${badgeText}`}>
                {category.shortName}
              </span>
              <span className="text-[11px] text-on-surface-variant/40 font-label-md">
                {category.subServices.length} Services
              </span>
            </div>

            <h3 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface mb-3 font-headline tracking-tight">
              {category.name}
            </h3>

            <p className="font-body-md text-body-md text-on-surface-variant/70 leading-relaxed mb-8 flex-1">
              {category.description}
            </p>

            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-label-md text-sm font-bold text-white transition-all duration-300 self-start"
              style={{ background: btnBg }}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Explore Strategies
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </motion.div>
          </div>

          <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:opacity-100 transition-all duration-700 ${accentBar} opacity-0`} />
        </motion.div>
      </Link>
    </motion.div>
  );
}
