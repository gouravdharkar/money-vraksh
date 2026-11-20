'use client';
import { RiskLevel, RISK_CONFIG } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  variant?: 'pill' | 'dot' | 'detailed';
}

export default function RiskBadge({ level, variant = 'pill' }: RiskBadgeProps) {
  const config = RISK_CONFIG[level];

  const dotColor =
    level === 'Low' ? 'bg-emerald-500' : level === 'Medium' ? 'bg-amber-500' : 'bg-red-500';
  const borderColor =
    level === 'Low' ? 'border-emerald-500/20' : level === 'Medium' ? 'border-amber-500/20' : 'border-red-500/20';
  const bgColor =
    level === 'Low' ? 'bg-emerald-500/8' : level === 'Medium' ? 'bg-amber-500/8' : 'bg-red-500/8';

  if (variant === 'dot') {
    return (
      <span className="inline-flex items-center gap-1.5 font-label-md text-xs font-medium">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className={config.color}>{config.label}</span>
      </span>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`rounded-xl border ${borderColor} ${bgColor} p-5`}>
        <div className="flex items-start gap-3">
          <span className={`material-symbols-outlined text-xl mt-0.5 ${config.color}`}>
            {config.icon}
          </span>
          <div>
            <span className={`font-label-md text-xs font-semibold uppercase tracking-wider ${config.color}`}>
              {config.label}
            </span>
            <p className="font-body-md text-sm text-on-surface-variant/70 mt-1.5 leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default: text-based "Risk: Level" format
  return (
    <span className="inline-flex items-center gap-2 font-label-md text-xs">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="text-on-surface-variant/70">Risk:</span>
      <span className={`font-medium ${config.color}`}>{config.label}</span>
    </span>
  );
}
