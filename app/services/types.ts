export type RiskLevel = 'Low' | 'Medium' | 'High';
export type CategoryId =
  | 'equity-cash'
  | 'stock-futures'
  | 'index-futures'
  | 'stock-options'
  | 'index-options'
  | 'mcx-commodity';

export interface SubService {
  id: string;
  slug: string;
  category: CategoryId;
  name: string;
  tagline: string;
  shortDescription: string;
  whatIsItFor: string;
  whomIsItFor: string;
  idealFor: string[];
  productDescription: string;
  riskSustainability: RiskLevel;
  minimumInvestment: string;
  categoryLabel: string;
  recommendationFrequency: string;
  modeOfRecommendation: string;
  followUp: string;
  priceMonthly: number;
  priceQuarterly: number;
  priceHalfYearly: number;
  priceYearly: number;
  icon: string;
  iconColor: string;
  borderColor: string;
  gradient: string;
  isPopular?: boolean;
  stats?: { value: string; label: string }[];
}

export interface ServiceCategory {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  icon: string;
  gradient: string;
  accentColor: string;
  subServices: SubService[];
}

export const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; icon: string; description: string }> = {
  Low: {
    label: 'Low Risk',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-500/30',
    icon: 'shield_check',
    description: 'Conservative approach with capital preservation as priority. Suitable for risk-averse investors seeking steady compounding.'
  },
  Medium: {
    label: 'Medium Risk',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15 border-amber-500/30',
    icon: 'shield_alert',
    description: 'Balanced risk-reward profile. Drawdowns managed through position sizing and stop losses. Ideal for growth-oriented investors.'
  },
  High: {
    label: 'High Risk',
    color: 'text-red-400',
    bg: 'bg-red-500/15 border-red-500/30',
    icon: 'shield_off',
    description: 'Aggressive strategies with higher volatility. Requires strong risk tolerance and discipline. For experienced traders only.'
  }
};

export interface ColorTheme {
  text: string;
  bg: string;
  border: string;
  hoverBorder: string;
  glow: string;
  accentBar: string;
  gradient: string;
  btnBg: string;
  primaryHex: string;
  secondaryHex: string;
  primaryRgba: string;
  secondaryRgba: string;
  glowRgba: string;
}

export const ACCENT_THEMES: Record<string, ColorTheme> = {
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/15',
    hoverBorder: 'hover:border-emerald-500/25',
    glow: 'bg-emerald-500',
    accentBar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    btnBg: 'linear-gradient(135deg, #10B981, #059669)',
    primaryHex: '#10B981',
    secondaryHex: '#059669',
    primaryRgba: 'rgba(16, 185, 129, 0.16)',
    secondaryRgba: 'rgba(20, 184, 166, 0.10)',
    glowRgba: 'rgba(16, 185, 129, 0.5)',
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/8',
    border: 'border-amber-500/15',
    hoverBorder: 'hover:border-amber-500/25',
    glow: 'bg-amber-500',
    accentBar: 'bg-gradient-to-r from-amber-500 to-orange-400',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    btnBg: 'linear-gradient(135deg, #F59E0B, #EA580C)',
    primaryHex: '#F59E0B',
    secondaryHex: '#EA580C',
    primaryRgba: 'rgba(245, 158, 11, 0.16)',
    secondaryRgba: 'rgba(234, 88, 12, 0.10)',
    glowRgba: 'rgba(245, 158, 11, 0.5)',
  },
  blue: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/8',
    border: 'border-blue-500/15',
    hoverBorder: 'hover:border-blue-500/25',
    glow: 'bg-blue-500',
    accentBar: 'bg-gradient-to-r from-blue-500 to-indigo-400',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    btnBg: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    primaryHex: '#3B82F6',
    secondaryHex: '#2563EB',
    primaryRgba: 'rgba(59, 130, 246, 0.16)',
    secondaryRgba: 'rgba(6, 182, 212, 0.10)',
    glowRgba: 'rgba(59, 130, 246, 0.5)',
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-500/8',
    border: 'border-rose-500/15',
    hoverBorder: 'hover:border-rose-500/25',
    glow: 'bg-rose-500',
    accentBar: 'bg-gradient-to-r from-rose-500 to-pink-400',
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    btnBg: 'linear-gradient(135deg, #F43F5E, #E11D48)',
    primaryHex: '#F43F5E',
    secondaryHex: '#E11D48',
    primaryRgba: 'rgba(244, 63, 94, 0.16)',
    secondaryRgba: 'rgba(251, 113, 133, 0.10)',
    glowRgba: 'rgba(244, 63, 94, 0.5)',
  },
  violet: {
    text: 'text-violet-400',
    bg: 'bg-violet-500/8',
    border: 'border-violet-500/15',
    hoverBorder: 'hover:border-violet-500/25',
    glow: 'bg-violet-500',
    accentBar: 'bg-gradient-to-r from-violet-500 to-purple-400',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    btnBg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    primaryHex: '#8B5CF6',
    secondaryHex: '#7C3AED',
    primaryRgba: 'rgba(139, 92, 246, 0.16)',
    secondaryRgba: 'rgba(168, 85, 247, 0.10)',
    glowRgba: 'rgba(139, 92, 246, 0.5)',
  },
  yellow: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/8',
    border: 'border-yellow-500/15',
    hoverBorder: 'hover:border-yellow-500/25',
    glow: 'bg-yellow-500',
    accentBar: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    gradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    btnBg: 'linear-gradient(135deg, #EAB308, #CA8A04)',
    primaryHex: '#EAB308',
    secondaryHex: '#CA8A04',
    primaryRgba: 'rgba(234, 179, 8, 0.16)',
    secondaryRgba: 'rgba(245, 158, 11, 0.10)',
    glowRgba: 'rgba(234, 179, 8, 0.5)',
  }
};