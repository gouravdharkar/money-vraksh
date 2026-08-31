'use client';
import { motion } from 'framer-motion';
import { SubService } from '../types';
import { getPricingTiers } from '../data';

interface PriceCardProps {
  service: SubService;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PriceCard({ service }: PriceCardProps) {
  const tiers = getPricingTiers(service);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {tiers.map((tier, idx) => {
        const isYearly = tier.tier === 'yearly';
        const isHalfYearly = tier.tier === 'halfYearly';
        
        // Custom styling for premium options
        let borderClass = 'border-surface-container/50 hover:border-primary/30';
        let bgClass = 'bg-surface-glass';
        let titleColor = 'text-on-surface-variant/50';
        let priceColor = 'text-on-surface';
        let currencyColor = 'text-on-surface-variant/40';

        if (isYearly) {
          borderClass = 'border-premium-gold/30 hover:border-premium-gold/70 shadow-[0_0_20px_rgba(212,175,55,0.05)]';
          bgClass = 'bg-gradient-to-b from-premium-gold/[0.04] to-transparent';
          titleColor = 'text-premium-gold/80 font-bold';
          priceColor = 'text-premium-gold';
          currencyColor = 'text-premium-gold/50';
        } else if (isHalfYearly) {
          borderClass = 'border-primary/20 hover:border-primary/50';
          bgClass = 'bg-gradient-to-b from-primary/[0.02] to-transparent';
          titleColor = 'text-primary/80 font-semibold';
        }

        return (
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className={`rounded-xl border p-5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between ${borderClass} ${bgClass}`}
          >
            {/* Savings Badge */}
            {tier.savingsPercent > 0 && (
              <div className="absolute top-0 right-0 z-10">
                <span className={`inline-block px-2.5 py-0.5 font-label-md text-[9px] font-bold uppercase tracking-wider rounded-bl-lg ${
                  isYearly 
                    ? 'bg-premium-gold/20 text-premium-gold' 
                    : 'bg-primary/20 text-primary'
                }`}>
                  Save {tier.savingsPercent}%
                </span>
              </div>
            )}
            
            <div className="relative z-10">
              <p className={`font-label-md text-[10px] uppercase tracking-wider mb-2 ${titleColor}`}>
                {tier.label}
              </p>
              
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`material-symbols-outlined text-lg ${currencyColor}`}>currency_rupee</span>
                <span className={`font-headline-md text-2xl font-bold font-headline tracking-tight ${priceColor}`}>
                  {formatCurrency(tier.price).replace('₹', '')}
                </span>
              </div>
              
              {tier.months > 1 && (
                <p className="font-label-md text-xs text-on-surface-variant/40 mt-1">
                  equivalent to <span className="font-semibold text-on-surface-variant/60">{formatCurrency(tier.equivalentMonthlyPrice)}</span>/mo
                </p>
              )}
            </div>

            {tier.savingsAmount > 0 && (
              <p className="font-body-md text-[11px] text-emerald-400/80 mt-4 font-medium border-t border-elegant/50 pt-2 relative z-10">
                Save {formatCurrency(tier.savingsAmount)} vs monthly
              </p>
            )}
            
            {isYearly && (
              <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-premium-gold/5 group-hover:scale-150 transition-transform duration-700" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
