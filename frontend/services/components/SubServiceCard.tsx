'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SubService, ACCENT_THEMES } from '../types';
import RiskBadge from './RiskBadge';
import { getCategory } from '../data';

interface SubServiceCardProps {
  service: SubService;
  index: number;
  categoryId: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SubServiceCard({ service, index, categoryId }: SubServiceCardProps) {
  const category = getCategory(categoryId);
  const theme = ACCENT_THEMES[category?.accentColor || 'emerald'] || ACCENT_THEMES.emerald;

  const categoryBadgeBg = theme.bg;
  const categoryBadgeText = theme.text;
  const accentHoverLine = `group-hover:${theme.glow}`;

  const initialShadow = "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 30px 80px rgba(0, 0, 0, 0.6)";
  const hoverShadow = `inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 40px ${theme.glowRgba}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link href={`/services/${categoryId}/${service.slug}`} className="block group h-full focus-ring rounded-xl">
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
          className="bg-[#171717] rounded-xl border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 h-full flex flex-col relative overflow-visible"
        >
          {service.isPopular && (
            <div className="absolute top-0 right-0 z-20">
              <span className="inline-block px-2.5 py-0.5 bg-primary/15 text-primary font-label-md text-[9px] font-bold uppercase tracking-wider rounded-bl-lg rounded-tr-xl">
                Popular
              </span>
            </div>
          )}

          <div className="p-5 flex-1 flex flex-col relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className={`material-symbols-outlined text-lg ${theme.text}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}>
                  {service.icon}
                </span>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${categoryBadgeBg} ${categoryBadgeText}`}>
                {service.categoryLabel}
              </span>
            </div>

            <h3 className="font-headline-md text-base font-bold text-on-surface mb-1.5 font-headline group-hover:text-primary transition-colors">
              {service.name}
            </h3>

            <p className="font-body-md text-sm text-on-surface-variant/70 leading-relaxed mb-4 flex-1 line-clamp-2">
              {service.shortDescription}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-headline-md text-lg font-bold text-on-surface font-headline tracking-tight">
                    {formatPrice(service.priceMonthly)}
                  </p>
                  <p className="font-label-md text-[9px] text-on-surface-variant/40 uppercase tracking-wider">per month</p>
                </div>
                <div className="w-px h-7 bg-elegant/50" />
                <RiskBadge level={service.riskSustainability} variant="dot" />
              </div>
              <span className="material-symbols-outlined text-base text-on-surface-variant/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                chevron_right
              </span>
            </div>
          </div>

          <div className={`absolute bottom-0 left-0 right-0 h-px bg-transparent ${accentHoverLine} transition-colors duration-500`} />
        </motion.div>
      </Link>
    </motion.div>
  );
}
