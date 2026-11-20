import { ServiceCategory, SubService } from './types';

export interface PricingInfo {
  tier: 'monthly' | 'quarterly' | 'halfYearly' | 'yearly';
  label: string;
  months: number;
  price: number;
  equivalentMonthlyPrice: number;
  savingsPercent: number;
  savingsAmount: number;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'equity-cash',
    name: 'Equity Cash Market',
    shortName: 'EQ Cash',
    description: 'Cash market strategies for consistent wealth creation',
    longDescription: 'Precision intraday, swing, and positional equity recommendations. Focused on liquid blue-chips and emerging mid-caps with clear risk management parameters.',
    icon: 'candlestick_chart',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accentColor: 'emerald',
    subServices: [
      {
        id: 'cash-safe-intraday',
        slug: 'cash-safe-intraday',
        category: 'equity-cash',
        name: 'Cash Safe Intraday',
        tagline: 'High liquidity blue-chip intraday trades',
        shortDescription: 'Designed for conservative day traders seeking daily compounding from highly liquid, large-cap stocks with minimal slippage.',
        whatIsItFor: 'Capturing intraday price movements in large-cap stocks using clean technical pivot breakouts and volume setups.',
        whomIsItFor: 'Conservative intraday traders, part-time traders, and retail buyers who want active cash segment trading with capital preservation as priority.',
        idealFor: [
          'Traders seeking capital protection',
          'Low drawdown tolerance',
          'High liquidity large-cap focus',
          'Those who want same-day entry and exit'
        ],
        productDescription: 'Conservative cash segment trading focusing purely on Nifty 100 stocks. Employs tight stop losses and clear target ratios to ensure consistent daily payouts.',
        riskSustainability: 'Low',
        minimumInvestment: '₹50,000 - ₹1,50,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '1-2 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + Email',
        followUp: 'Real-time entry, target, and stop-loss updates',
        priceMonthly: 7000,
        priceQuarterly: 21000,
        priceHalfYearly: 38000,
        priceYearly: 68000,
        icon: 'shield',
        iconColor: 'text-emerald-400',
        borderColor: 'hover:border-emerald-500/20',
        gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        stats: [
          { value: '1-2', label: 'Calls/Day' },
          { value: 'Low', label: 'Drawdowns' }
        ]
      },
      {
        id: 'cash-momentum-pro',
        slug: 'cash-momentum-pro',
        category: 'equity-cash',
        name: 'Cash Momentum Pro',
        tagline: 'Momentum-based intraday opportunities',
        shortDescription: 'Captures quick intraday momentum moves in highly active, volume-fueled mid-cap and large-cap equities.',
        whatIsItFor: 'Capitalizing on active breakout trends, sudden volume expansions, and institutional news triggers.',
        whomIsItFor: 'Active day traders looking for swift price action and ready to take calculated medium-level risks for higher returns.',
        idealFor: [
          'Traders looking for rapid price action',
          'Intermediate intraday players',
          'Those comfortable with mid-cap volatility',
          'Traders with active market screen access'
        ],
        productDescription: 'Scans 300+ liquid equities dynamically to identify breakout consolidations and volume expansions. Includes real-time entry and trailing targets.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹1,00,000 - ₹3,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-3 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + Email',
        followUp: 'Real-time updates at key price levels',
        priceMonthly: 9000,
        priceQuarterly: 24000,
        priceHalfYearly: 44000,
        priceYearly: 75000,
        icon: 'bolt',
        iconColor: 'text-emerald-400',
        borderColor: 'hover:border-emerald-500/20',
        gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        isPopular: true,
        stats: [
          { value: '2-3', label: 'Calls/Day' },
          { value: 'High', label: 'Momentum' }
        ]
      },
      {
        id: 'cash-turbo-trader',
        slug: 'cash-turbo-trader',
        category: 'equity-cash',
        name: 'Cash Turbo Trader',
        tagline: 'Aggressive intraday trading with higher targets',
        shortDescription: 'High-velocity, high-beta cash market recommendations designed to capture large intraday breakouts and reversals.',
        whatIsItFor: 'Targeting high-beta stock selections to capture explosive intraday moves and sudden macro reversals.',
        whomIsItFor: 'Experienced day traders with high risk tolerance, solid capital base, and high-speed execution terminals.',
        idealFor: [
          'Aggressive intraday traders',
          'High risk tolerance portfolios',
          'Traders targeting larger intraday percentages',
          'Rapid execution environments'
        ],
        productDescription: 'Aggressive day trading service prioritizing high-beta stocks, sector leaders undergoing sharp breakouts, and momentum expansion plays. High risk, high reward.',
        riskSustainability: 'High',
        minimumInvestment: '₹1,50,000 - ₹5,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-4 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + Email',
        followUp: 'Instant voice/text updates on execution',
        priceMonthly: 11000,
        priceQuarterly: 28000,
        priceHalfYearly: 51000,
        priceYearly: 81000,
        icon: 'speed',
        iconColor: 'text-emerald-400',
        borderColor: 'hover:border-emerald-500/20',
        gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        stats: [
          { value: '2-4', label: 'Calls/Day' },
          { value: 'Aggressive', label: 'Targets' }
        ]
      },
      {
        id: 'wealth-builder-picks',
        slug: 'wealth-builder-picks',
        category: 'equity-cash',
        name: 'Wealth Builder Picks',
        tagline: '1-12 month investment ideas',
        shortDescription: 'High-conviction value and growth stock recommendations targeting compounding returns over a 1 to 12-month horizon.',
        whatIsItFor: 'Building structured long-term wealth by investing in fundamentally strong companies during optimal buying cycles.',
        whomIsItFor: 'Passive investors, working professionals, and retail buyers who want to grow capital steadily without trading daily.',
        idealFor: [
          'Medium to long term investors',
          'Working professionals seeking passive growth',
          'Conservative wealth builders',
          'Investors with capital compounding goals'
        ],
        productDescription: 'Detailed fundamental research combined with macro-technical entry triggers. Provides holding ideas with periodic reviews, target valuations, and clear exit targets.',
        riskSustainability: 'Low',
        minimumInvestment: '₹2,00,000+',
        categoryLabel: 'Positional',
        recommendationFrequency: '2-3 quality picks per month',
        modeOfRecommendation: 'WhatsApp + Email + Premium Portal',
        followUp: 'Monthly updates and trailing stop-loss alerts',
        priceMonthly: 6000,
        priceQuarterly: 14000,
        priceHalfYearly: 25000,
        priceYearly: 45000,
        icon: 'trending_up',
        iconColor: 'text-teal-400',
        borderColor: 'hover:border-teal-500/20',
        gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
        stats: [
          { value: '1-12 M', label: 'Holding Period' },
          { value: 'Value', label: 'Research' }
        ]
      },
      {
        id: 'growth-performer',
        slug: 'growth-performer',
        category: 'equity-cash',
        name: 'Growth Performer',
        tagline: 'Swing and positional opportunities',
        shortDescription: 'Capitalizes on multi-day swing and medium-term positional breakouts lasting 1 to 3 weeks.',
        whatIsItFor: 'Trading short-term structural trends, sector rotations, and swing chart patterns.',
        whomIsItFor: 'Swing traders, active retail investors, and professionals looking to turn capital over efficiently in active cycles.',
        idealFor: [
          'Swing traders seeking 1-3 week holds',
          'Growth portfolio builders',
          'Retail traders seeking benchmark-beating returns',
          'Those comfortable with overnight risk'
        ],
        productDescription: 'Identifies strong price-action breakout candidates and relative strength leaders. Combines volume profiles with technical indicators to capture swing moves.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹1,50,000+',
        categoryLabel: 'Positional',
        recommendationFrequency: '4-6 picks per month',
        modeOfRecommendation: 'WhatsApp + Email + Premium Portal',
        followUp: 'Bi-weekly portfolio performance reports',
        priceMonthly: 7000,
        priceQuarterly: 21000,
        priceHalfYearly: 38000,
        priceYearly: 68000,
        icon: 'auto_graph',
        iconColor: 'text-teal-400',
        borderColor: 'hover:border-teal-500/20',
        gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
        stats: [
          { value: '1-3 W', label: 'Holding Period' },
          { value: 'Swing', label: 'Breaks' }
        ]
      },
      {
        id: 'multibagger-vision',
        slug: 'multibagger-vision',
        category: 'equity-cash',
        name: 'Multibagger Vision',
        tagline: 'High-growth and high-risk stock picks',
        shortDescription: 'High-conviction, high-growth emerging mid-cap and small-cap stocks with multibagger potential.',
        whatIsItFor: 'Capturing explosive growth cycles in small-cap and niche segment companies before institutional re-rating.',
        whomIsItFor: 'Long-term investors with high risk tolerance seeking asymmetric, compound returns over 6-24 months.',
        idealFor: [
          'High risk tolerance long-term capital',
          'HNIs seeking exponential portfolio boosters',
          'Investors comfortable with high volatility',
          'Those seeking multi-fold growth potential'
        ],
        productDescription: 'Deep fundamental research covering management background, balance sheet strengths, market share expansions, and industry tailwinds. Strictly curated picks.',
        riskSustainability: 'High',
        minimumInvestment: '₹3,00,000+',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 picks per month',
        modeOfRecommendation: 'Dedicated RM + Email + Premium Portal',
        followUp: 'Quarterly company tracking updates & exit alerts',
        priceMonthly: 9000,
        priceQuarterly: 24000,
        priceHalfYearly: 42000,
        priceYearly: 71000,
        icon: 'stars',
        iconColor: 'text-teal-400',
        borderColor: 'hover:border-teal-500/20',
        gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
        stats: [
          { value: '6-24 M', label: 'Horizon' },
          { value: 'Alpha', label: 'Growth' }
        ]
      }
    ]
  },
  {
    id: 'stock-futures',
    name: 'Stock Futures',
    shortName: 'ST Futures',
    description: 'Leveraged directional stock futures setups',
    longDescription: 'High-probability stock futures recommendations with structured risk management, capturing large swings and momentum continuation in derivatives.',
    icon: 'trending_up',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    accentColor: 'amber',
    subServices: [
      {
        id: 'future-shield-intraday',
        slug: 'future-shield-intraday',
        category: 'stock-futures',
        name: 'Future Shield Intraday',
        tagline: 'Intraday technical calls based on low risk setups',
        shortDescription: 'Leverages liquid stock futures contracts using low-risk pivot setups and strict intraday stop-losses.',
        whatIsItFor: 'Trading stock futures intraday with structured capital protection and rapid risk adjustments.',
        whomIsItFor: 'Conservative derivative day traders looking to leverage positions while enforcing structural risk controls.',
        idealFor: [
          'Risk-controlled leverage traders',
          'Active derivative day traders',
          'Those seeking high liquidity names',
          'Traders looking for same-day settlements'
        ],
        productDescription: 'Monitors Open Interest (OI) build-ups and technical support zones in F&O active lists. Focuses on low-drawdown intraday execution.',
        riskSustainability: 'Low',
        minimumInvestment: '₹2,00,000 - ₹5,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '1-2 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + Instant SMS',
        followUp: 'Real-time updates and active risk tracking alerts',
        priceMonthly: 11000,
        priceQuarterly: 30000,
        priceHalfYearly: 51000,
        priceYearly: 75000,
        icon: 'security',
        iconColor: 'text-amber-400',
        borderColor: 'hover:border-amber-500/20',
        gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
        stats: [
          { value: '1-2', label: 'Calls/Day' },
          { value: 'Low', label: 'Risk Setups' }
        ]
      },
      {
        id: 'future-momentum',
        slug: 'future-momentum',
        category: 'stock-futures',
        name: 'Future Momentum',
        tagline: 'Medium risk intraday setups',
        shortDescription: 'Captures intraday stock breakouts and volume buildups using stock futures leverage.',
        whatIsItFor: 'Riding fast intraday price action in liquid F&O stock contracts.',
        whomIsItFor: 'Active derivative day traders seeking balanced, momentum-driven futures recommendations.',
        idealFor: [
          'Active breakout traders',
          'Traders comfortable with medium futures risk',
          'Those aiming for quick leverage returns',
          'Traders with quick terminal response times'
        ],
        productDescription: 'Identifies instant momentum continuations in stock futures. Relies on relative strength indexes and sudden F&O volume surges.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹3,00,000 - ₹7,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-3 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + App',
        followUp: 'Real-time stop trailing alerts',
        priceMonthly: 14000,
        priceQuarterly: 38000,
        priceHalfYearly: 55000,
        priceYearly: 80000,
        icon: 'speed',
        iconColor: 'text-amber-400',
        borderColor: 'hover:border-amber-500/20',
        gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
        isPopular: true,
        stats: [
          { value: '2-3', label: 'Calls/Day' },
          { value: 'Medium', label: 'Risk' }
        ]
      },
      {
        id: 'future-accelerator',
        slug: 'future-accelerator',
        category: 'stock-futures',
        name: 'Future Accelerator',
        tagline: 'Captures large moves based on technical reversals',
        shortDescription: 'Aggressive stock futures trading focused on catching major intraday breakouts and sharp reversals.',
        whatIsItFor: 'Accelerating returns by trading high-beta stock futures during structural trend changes and breakouts.',
        whomIsItFor: 'Professional derivative day traders with high risk tolerance, looking for larger intraday target achievements.',
        idealFor: [
          'High risk futures day traders',
          'Traders seeking larger percentage swings',
          'Professional level margin capacities',
          'Event-driven volatility traders'
        ],
        productDescription: 'High-beta stock futures selections targeting volatile trend changes, post-earnings reactions, and institutional blocks. High risk profile.',
        riskSustainability: 'High',
        minimumInvestment: '₹4,00,000 - ₹10,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '1-2 calls per market day',
        modeOfRecommendation: 'Dedicated RM + Telegram + WhatsApp',
        followUp: 'Real-time voice support and target triggers',
        priceMonthly: 21000,
        priceQuarterly: 48000,
        priceHalfYearly: 65000,
        priceYearly: 85000,
        icon: 'rocket_launch',
        iconColor: 'text-amber-400',
        borderColor: 'hover:border-amber-500/20',
        gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
        stats: [
          { value: '1-2', label: 'Calls/Day' },
          { value: 'Aggressive', label: 'Moves' }
        ]
      },
      {
        id: 'future-trend-rider',
        slug: 'future-trend-rider',
        category: 'stock-futures',
        name: 'Future Trend Rider',
        tagline: 'Low risk large cap stock positional futures',
        shortDescription: 'Captures multi-day positional trends in high-liquidity, large-cap stock futures with strict risk limits.',
        whatIsItFor: 'Swing trading large-cap futures based on low-risk support consolidations and structural breakouts.',
        whomIsItFor: 'Positional derivative traders who want to run leveraged trend positions with minimal drawdowns.',
        idealFor: [
          'Positional futures traders',
          'Low drawdown swing seekers',
          'Large-cap derivatives focus',
          'Those comfortable with overnight margin'
        ],
        productDescription: 'Positional setups designed to ride 3-7 day trend waves in front-line index stocks. Risk managed through multi-day hedges and dynamic stop levels.',
        riskSustainability: 'Low',
        minimumInvestment: '₹3,00,000 - ₹8,00,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'WhatsApp + Email + App',
        followUp: 'Daily position status and margin warnings',
        priceMonthly: 9000,
        priceQuarterly: 24000,
        priceHalfYearly: 44000,
        priceYearly: 64000,
        icon: 'insights',
        iconColor: 'text-orange-400',
        borderColor: 'hover:border-orange-500/20',
        gradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
        stats: [
          { value: '3-7 Days', label: 'Hold' },
          { value: 'Large Cap', label: 'Focus' }
        ]
      },
      {
        id: 'future-swing-master',
        slug: 'future-swing-master',
        category: 'stock-futures',
        name: 'Future Swing Master',
        tagline: 'Captures momentum continuation on medium risk',
        shortDescription: 'Positional stock futures recommendations riding momentum cycles in high-liquidity mid-cap and large-cap contracts.',
        whatIsItFor: 'Capitalizing on multi-day to multi-week trend continuations and technical breakout channels.',
        whomIsItFor: 'Active swing traders who seek to maximize returns using futures rollover structures.',
        idealFor: [
          'Momentum swing traders',
          'Intermediate positional futures players',
          'Those comfortable holding 5-15 sessions',
          'Traders looking for active rollover plays'
        ],
        productDescription: 'Identifies strong continuation channels using advanced volume profile data and open interest distributions. Managed with active targets.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹4,00,000 - ₹10,00,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '2-3 setups per week',
        modeOfRecommendation: 'Telegram + WhatsApp + Email',
        followUp: 'Active adjustments and target updates',
        priceMonthly: 10000,
        priceQuarterly: 27000,
        priceHalfYearly: 51000,
        priceYearly: 71000,
        icon: 'swap_vert',
        iconColor: 'text-orange-400',
        borderColor: 'hover:border-orange-500/20',
        gradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
        stats: [
          { value: '5-15 Days', label: 'Hold' },
          { value: 'OI Driven', label: 'Research' }
        ]
      },
      {
        id: 'future-wealth-max',
        slug: 'future-wealth-max',
        category: 'stock-futures',
        name: 'Future Wealth Max',
        tagline: 'High volatility setups capturing big moves',
        shortDescription: 'High-beta positional stock futures recommendations designed to capture large trend expansions.',
        whatIsItFor: 'Aggressive multi-week futures positions capturing major structural trend breakouts and macro-economic announcements.',
        whomIsItFor: 'Experienced derivative swing traders seeking substantial gains from volatile stocks, with robust margin tolerance.',
        idealFor: [
          'High risk swing derivative traders',
          'Portfolios seeking extreme alpha returns',
          'Traders with large capital allocations',
          'Those tolerant of overnight gaps'
        ],
        productDescription: 'Identifies setups displaying heavy accumulation and potential volatility breakouts. Employs aggressive targeting with structural stop management.',
        riskSustainability: 'High',
        minimumInvestment: '₹5,00,000+',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'Dedicated RM + Telegram + Call',
        followUp: 'Direct updates and active rollover calls',
        priceMonthly: 15000,
        priceQuarterly: 39000,
        priceHalfYearly: 71000,
        priceYearly: 84000,
        icon: 'trending_up',
        iconColor: 'text-orange-400',
        borderColor: 'hover:border-orange-500/20',
        gradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
        stats: [
          { value: 'Positional', label: 'Holds' },
          { value: 'Big Moves', label: 'Focus' }
        ]
      }
    ]
  },
  {
    id: 'index-futures',
    name: 'Index Futures',
    shortName: 'IDX Futures',
    description: 'Nifty and Bank Nifty futures trading',
    longDescription: 'Technical and open interest (OI) data-driven recommendations on Nifty and Bank Nifty futures for consistent compounding and high liquidity trading.',
    icon: 'query_stats',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    accentColor: 'blue',
    subServices: [
      {
        id: 'nifty-safe-trader',
        slug: 'nifty-safe-trader',
        category: 'index-futures',
        name: 'Nifty Safe Trader',
        tagline: 'Captures frequent technical trades and small risk reward setups',
        shortDescription: 'Conservative intraday index trading targeting highly reliable technical support/resistance pivots in Nifty/Bank Nifty futures.',
        whatIsItFor: 'Trading Nifty and Bank Nifty futures with low-risk entries, tight stops, and quick profit bookings.',
        whomIsItFor: 'Day traders looking to specialize in major indices while maintaining tight drawdowns.',
        idealFor: [
          'Conservative day traders',
          'Traders focused on Nifty/Bank Nifty',
          'Low risk-reward setups',
          'Steady daily compounders'
        ],
        productDescription: 'Purely technical-driven system trading the cash index boundaries. Places emphasis on capital preservation and small, frequent profit goals.',
        riskSustainability: 'Low',
        minimumInvestment: '₹2,00,000 - ₹4,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '1-2 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp',
        followUp: 'Step-by-step target-reaching notifications',
        priceMonthly: 12000,
        priceQuarterly: 31000,
        priceHalfYearly: 55000,
        priceYearly: 84000,
        icon: 'health_and_safety',
        iconColor: 'text-blue-400',
        borderColor: 'hover:border-blue-500/20',
        gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
        stats: [
          { value: '1-2', label: 'Calls/Day' },
          { value: 'Tight', label: 'Stop Loss' }
        ]
      },
      {
        id: 'index-momentum-pro',
        slug: 'index-momentum-pro',
        category: 'index-futures',
        name: 'Index Momentum Pro',
        tagline: 'Technical calls based on momentum and OI data',
        shortDescription: 'Active Nifty and Bank Nifty intraday trading setups using institutional open interest indicators and price momentum.',
        whatIsItFor: 'Capturing mid-day index swings and breakout moves triggered by volume breakouts.',
        whomIsItFor: 'Active index day traders seeking professional OI build-up and technical data inputs.',
        idealFor: [
          'Active day traders',
          'OI tracking enthusiasts',
          'Index swing traders',
          'Fast momentum execution'
        ],
        productDescription: 'Combines real-time Option Chain data, Future Open Interest spikes, and sector weightages to track index direction breakouts. Highly responsive.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹3,00,000 - ₹6,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-3 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + SMS',
        followUp: 'Real-time stop-loss trailing and index updates',
        priceMonthly: 16000,
        priceQuarterly: 37000,
        priceHalfYearly: 61000,
        priceYearly: 88000,
        icon: 'trending_up',
        iconColor: 'text-blue-400',
        borderColor: 'hover:border-blue-500/20',
        gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
        isPopular: true,
        stats: [
          { value: '2-3', label: 'Calls/Day' },
          { value: 'OI Data', label: 'Analysis' }
        ]
      },
      {
        id: 'index-power-trader',
        slug: 'index-power-trader',
        category: 'index-futures',
        name: 'Index Power Trader',
        tagline: 'Technical calls capturing volatility and big moves',
        shortDescription: 'High-volatility intraday index setups designed to capture massive trend expansions, global triggers, and reversal spikes.',
        whatIsItFor: 'Trading index futures aggressively to maximize gains from wild swings and major momentum expansions.',
        whomIsItFor: 'Professional index day traders with robust margin capacity and high risk tolerance.',
        idealFor: [
          'Volatility index day traders',
          'Event-driven breakout players',
          'Traders with large capital allocations',
          'Rapid risk taking profiles'
        ],
        productDescription: 'Aggressive intraday strategy focusing on key macro zones, global indices correlations, and index breakout channels. Expect high volatility.',
        riskSustainability: 'High',
        minimumInvestment: '₹4,00,000 - ₹8,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-3 calls per market day',
        modeOfRecommendation: 'Dedicated RM + Telegram + Call',
        followUp: 'Immediate alerts on target updates or stops',
        priceMonthly: 21000,
        priceQuarterly: 38000,
        priceHalfYearly: 68000,
        priceYearly: 85000,
        icon: 'flash_on',
        iconColor: 'text-blue-400',
        borderColor: 'hover:border-blue-500/20',
        gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
        stats: [
          { value: '2-3', label: 'Calls/Day' },
          { value: 'High', label: 'Volatility' }
        ]
      },
      {
        id: 'index-trend-builder',
        slug: 'index-trend-builder',
        category: 'index-futures',
        name: 'Index Trend Builder',
        tagline: 'Large cap technical positional index calls',
        shortDescription: 'Low-risk positional swing trading on Nifty and Bank Nifty futures, holding positions across multiple sessions.',
        whatIsItFor: 'Capturing multi-day index trend moves without the stress of monitoring intraday volatility.',
        whomIsItFor: 'Working professionals and swing traders seeking steady index compounding over 3-7 sessions.',
        idealFor: [
          'Working professionals',
          'Positional swing traders',
          'Index-level trend followers',
          'Those with limited daily market time'
        ],
        productDescription: 'Focuses on structural chart breakouts on daily/weekly timeframes. Enforces wide but strategic stop levels to absorb minor noise.',
        riskSustainability: 'Low',
        minimumInvestment: '₹3,00,000 - ₹7,00,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'WhatsApp + Email + App',
        followUp: 'Daily EOD analysis and trailing alerts',
        priceMonthly: 11000,
        priceQuarterly: 28000,
        priceHalfYearly: 51000,
        priceYearly: 78000,
        icon: 'timeline',
        iconColor: 'text-indigo-400',
        borderColor: 'hover:border-indigo-500/20',
        gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
        stats: [
          { value: '3-7 Days', label: 'Hold' },
          { value: 'Trend', label: 'Following' }
        ]
      },
      {
        id: 'index-wealth-rider',
        slug: 'index-wealth-rider',
        category: 'index-futures',
        name: 'Index Wealth Rider',
        tagline: 'Medium risk reward setups based on technical views',
        shortDescription: 'Positional index swing trading capitalizing on medium-term channel breakouts and global market setups.',
        whatIsItFor: 'Riding major weekly ranges and medium-term trends in Nifty and Bank Nifty futures.',
        whomIsItFor: 'Growth-oriented derivative swing traders looking to rotate capital in index futures.',
        idealFor: [
          'Active positional swing traders',
          'Trend channels traders',
          'Those trading global cues',
          'Calculated risk profiles'
        ],
        productDescription: 'Derived from multi-timeframe charts, moving averages, and index hedging flows. Targets capture substantial index point moves.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹4,00,000 - ₹9,00,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '2-3 setups per week',
        modeOfRecommendation: 'Telegram + WhatsApp + Email',
        followUp: 'Mid-session positional checkups and trailing rules',
        priceMonthly: 14000,
        priceQuarterly: 32000,
        priceHalfYearly: 55000,
        priceYearly: 81000,
        icon: 'navigation',
        iconColor: 'text-indigo-400',
        borderColor: 'hover:border-indigo-500/20',
        gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
        stats: [
          { value: 'Weekly', label: 'Swings' },
          { value: 'Medium', label: 'Drawdowns' }
        ]
      },
      {
        id: 'index-alpha-max',
        slug: 'index-alpha-max',
        category: 'index-futures',
        name: 'Index Alpha Max',
        tagline: 'High risk reward moves captured on technical and news setups',
        shortDescription: 'Aggressive positional index strategies designed to capture major market reversals and structural breakdowns.',
        whatIsItFor: 'Capturing massive index trends and macro-reversals over multi-week holding periods.',
        whomIsItFor: 'HNI traders and professional derivative specialists ready to hold positions through volatile global cycles.',
        idealFor: [
          'High conviction index swing traders',
          'Macro event risk takers',
          'HNI advisory clients',
          'Large move capturers'
        ],
        productDescription: 'Combines structural price action with geopolitical triggers, FII data flows, and central bank actions. High volatility, massive targets.',
        riskSustainability: 'High',
        minimumInvestment: '₹5,00,000+',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'Dedicated RM + Telegram + Call',
        followUp: 'Direct RM contact and active trade management',
        priceMonthly: 18000,
        priceQuarterly: 46000,
        priceHalfYearly: 60000,
        priceYearly: 85000,
        icon: 'analytics',
        iconColor: 'text-indigo-400',
        borderColor: 'hover:border-indigo-500/20',
        gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
        stats: [
          { value: 'Positional', label: 'Holds' },
          { value: 'Asymmetric', label: 'Returns' }
        ]
      }
    ]
  },
  {
    id: 'stock-options',
    name: 'Stock Options',
    shortName: 'ST Options',
    description: 'Tactical options strategies on select equities',
    longDescription: 'Leveraged stock option buying and swing strategies designed for high-conviction directional moves with strict stop-losses and risk metrics.',
    icon: 'analytics',
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    accentColor: 'rose',
    subServices: [
      {
        id: 'option-shield',
        slug: 'option-shield',
        category: 'stock-options',
        name: 'Option Shield',
        tagline: 'Low-risk stock option setups with disciplined risk management',
        shortDescription: 'Focuses on intraday stock option buying (mostly near-ATM contracts) with tight stop losses to protect capital.',
        whatIsItFor: 'Trading stock options intraday with a focus on shielding trading capital from option decay.',
        whomIsItFor: 'Retail option buyers who want intraday stock option recommendations with highly disciplined risk levels.',
        idealFor: [
          'Retail option buyers',
          'Conservative day traders',
          'Those seeking small defined stop-losses',
          'ATM contract trading'
        ],
        productDescription: 'Identifies high liquidity options where technical momentum has triggered. Enforces quick entry and tight stops to limit premium decay.',
        riskSustainability: 'Low',
        minimumInvestment: '₹50,000 - ₹1,50,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '1-2 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp',
        followUp: 'Real-time trailing update alerts',
        priceMonthly: 12000,
        priceQuarterly: 30000,
        priceHalfYearly: 55000,
        priceYearly: 75000,
        icon: 'verified_user',
        iconColor: 'text-rose-400',
        borderColor: 'hover:border-rose-500/20',
        gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
        stats: [
          { value: '1-2', label: 'Calls/Day' },
          { value: 'Disciplined', label: 'Risk' }
        ]
      },
      {
        id: 'option-momentum',
        slug: 'option-momentum',
        category: 'stock-options',
        name: 'Option Momentum',
        tagline: 'Momentum-based intraday stock option trades',
        shortDescription: 'Captures quick momentum breakouts and volume surges in liquid equity options for active day traders.',
        whatIsItFor: 'Capitalizing on fast momentum breakouts where options premiums rise rapidly.',
        whomIsItFor: 'Active option buyers who have rapid execution systems and can track real-time alerts.',
        idealFor: [
          'Active momentum option buyers',
          'Traders with quick terminal setups',
          'Mid-cap momentum followers',
          'Balanced risk-reward goals'
        ],
        productDescription: 'Finds immediate volume spikes and breakout candles in underlying stock charts to capture sharp moves in the option premium.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹1,00,000 - ₹2,50,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-3 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + App',
        followUp: 'Live updates on option metrics and exit targets',
        priceMonthly: 15000,
        priceQuarterly: 36000,
        priceHalfYearly: 61000,
        priceYearly: 80000,
        icon: 'trending_up',
        iconColor: 'text-rose-400',
        borderColor: 'hover:border-rose-500/20',
        gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
        isPopular: true,
        stats: [
          { value: '2-3', label: 'Calls/Day' },
          { value: 'High', label: 'Momentum' }
        ]
      },
      {
        id: 'option-blast',
        slug: 'option-blast',
        category: 'stock-options',
        name: 'Option Blast',
        tagline: 'Aggressive stock option trades targeting high-return setups',
        shortDescription: 'Aggressive intraday option buying on highly volatile stocks targeting large premium spikes.',
        whatIsItFor: 'Taking aggressive option positions targeting rapid premium compounding during major price expansion.',
        whomIsItFor: 'Experienced day options traders with high volatility tolerance and fast execution setup access.',
        idealFor: [
          'Aggressive option scalpers',
          'High risk options players',
          'High-beta stock selection users',
          'Fast momentum chasers'
        ],
        productDescription: 'Proprietary scans trace massive option volume imbalances and aggressive contract buying to jump on explosive momentum. High risk profile.',
        riskSustainability: 'High',
        minimumInvestment: '₹1,50,000 - ₹3,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '1-2 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + Call',
        followUp: 'Immediate buy/sell/exit notifications',
        priceMonthly: 21000,
        priceQuarterly: 45000,
        priceHalfYearly: 65000,
        priceYearly: 85000,
        icon: 'workspace_premium',
        iconColor: 'text-rose-400',
        borderColor: 'hover:border-rose-500/20',
        gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
        stats: [
          { value: '1-2', label: 'Calls/Day' },
          { value: 'Explosive', label: 'Spikes' }
        ]
      },
      {
        id: 'strategic-option-builder',
        slug: 'strategic-option-builder',
        category: 'stock-options',
        name: 'Strategic Option Builder',
        tagline: 'Low-risk positional stock option recommendations based on trends',
        shortDescription: 'Positional stock option recommendations using defined-risk spread structures (e.g. Bull Call spreads) to protect capital.',
        whatIsItFor: 'Holding multi-day stock options positions with a capped-risk structure to capitalize on strong charts.',
        whomIsItFor: 'Positional options traders seeking capital preservation and structured derivative plays.',
        idealFor: [
          'Positional option swingers',
          'Conservative options traders',
          'Capped-risk spread users',
          'Those comfortable holding multi-day'
        ],
        productDescription: 'Builds defined-risk option structures (Bull Call Spreads, Bear Put Spreads, Iron Condors) on stock charts showing clear accumulation.',
        riskSustainability: 'Low',
        minimumInvestment: '₹1,50,000 - ₹3,50,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'WhatsApp + Email + App',
        followUp: 'Weekly adjustments and margin tracking',
        priceMonthly: 10000,
        priceQuarterly: 25000,
        priceHalfYearly: 45000,
        priceYearly: 70000,
        icon: 'dashboard_customize',
        iconColor: 'text-pink-400',
        borderColor: 'hover:border-pink-500/20',
        gradient: 'from-pink-500/10 via-rose-500/5 to-transparent',
        stats: [
          { value: 'Hedged', label: 'Spreads' },
          { value: 'Low', label: 'Capital Risk' }
        ]
      },
      {
        id: 'option-swing-elite',
        slug: 'option-swing-elite',
        category: 'stock-options',
        name: 'Option Swing Elite',
        tagline: 'Medium-risk stock option trades designed to capture swings',
        shortDescription: 'Directional swing option trades on high liquidity equities, capturing multi-day stock trends.',
        whatIsItFor: 'Trading swing breakout patterns using naked options or simple debit spreads.',
        whomIsItFor: 'Intermediate option traders who want to capture weekly stock breakouts using options leverage.',
        idealFor: [
          'Swing options buyers',
          'Active retail traders',
          '2-5 day holding periods',
          'Liquidity-oriented swingers'
        ],
        productDescription: 'Scans technical breakouts and relative volume peaks to find high momentum stocks. Enters near-ATM calls or puts to catch swing cycles.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹2,00,000 - ₹4,50,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '2-3 setups per week',
        modeOfRecommendation: 'Telegram + WhatsApp + Email',
        followUp: 'Daily updates on entry and exit thresholds',
        priceMonthly: 12000,
        priceQuarterly: 30000,
        priceHalfYearly: 50000,
        priceYearly: 75000,
        icon: 'stars',
        iconColor: 'text-pink-400',
        borderColor: 'hover:border-pink-500/20',
        gradient: 'from-pink-500/10 via-rose-500/5 to-transparent',
        stats: [
          { value: '2-5 Days', label: 'Hold' },
          { value: 'Directional', label: 'Swing' }
        ]
      },
      {
        id: 'option-wealth-multiplier',
        slug: 'option-wealth-multiplier',
        category: 'stock-options',
        name: 'Option Wealth Multiplier',
        tagline: 'High-conviction stock option opportunities for big returns',
        shortDescription: 'High-reward positional option recommendations targeting large earnings breakouts or news triggers.',
        whatIsItFor: 'Seeking explosive gains by taking high-conviction positional options plays on major structural stocks.',
        whomIsItFor: 'Experienced option buyers with high risk tolerance looking for asymmetric payoffs.',
        idealFor: [
          'High risk options traders',
          'Portfolios seeking extreme alpha boosts',
          'HNI options advisory clients',
          'Those comfortable with high premium swings'
        ],
        productDescription: 'Curates deep structural stock opportunities showing strong volume accumulation or macro catalysts. Expect high premium movements.',
        riskSustainability: 'High',
        minimumInvestment: '₹3,00,000 - ₹6,00,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'Dedicated RM + Telegram + WhatsApp',
        followUp: 'Real-time adjustments and expiry management advice',
        priceMonthly: 15000,
        priceQuarterly: 40000,
        priceHalfYearly: 70000,
        priceYearly: 85000,
        icon: 'diamond',
        iconColor: 'text-pink-400',
        borderColor: 'hover:border-pink-500/20',
        gradient: 'from-pink-500/10 via-rose-500/5 to-transparent',
        stats: [
          { value: 'Multi-Day', label: 'Holding' },
          { value: 'High Alpha', label: 'Target' }
        ]
      }
    ]
  },
  {
    id: 'index-options',
    name: 'Index Options',
    shortName: 'IDX Options',
    description: 'Active index option buying and strategies',
    longDescription: 'Momentum-driven index option buying and structured option strategies to capture sharp Nifty/Bank Nifty intraday moves and weekly trends.',
    icon: 'rocket_launch',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    accentColor: 'violet',
    subServices: [
      {
        id: 'index-option-guard',
        slug: 'index-option-guard',
        category: 'index-options',
        name: 'Index Option Guard',
        tagline: 'Low-risk Nifty and Bank Nifty option trading opportunities',
        shortDescription: 'Focuses on capital-protected intraday Nifty and Bank Nifty option trades with extremely disciplined risk parameters.',
        whatIsItFor: 'Intraday index options trading targeting high-probability pivots with small stops.',
        whomIsItFor: 'Risk-averse day traders looking to participate in index option buying/selling with capital security focus.',
        idealFor: [
          'Risk-controlled option buyers',
          'Nifty/Bank Nifty day traders',
          'Low drawdown tolerance',
          'Strict stop-loss discipline'
        ],
        productDescription: 'Utilizes short-duration index levels and momentum oscillators to enter highly liquid ATM options. Prioritizes quick exit setups to lock gains.',
        riskSustainability: 'Low',
        minimumInvestment: '₹40,000 - ₹1,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '1-2 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp',
        followUp: 'Quick stop-trailing updates',
        priceMonthly: 10000,
        priceQuarterly: 25000,
        priceHalfYearly: 45000,
        priceYearly: 75000,
        icon: 'security',
        iconColor: 'text-violet-400',
        borderColor: 'hover:border-violet-500/20',
        gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
        stats: [
          { value: '1-2', label: 'Calls/Day' },
          { value: 'Low Risk', label: 'Pivots' }
        ]
      },
      {
        id: 'index-option-pro',
        slug: 'index-option-pro',
        category: 'index-options',
        name: 'Index Option Pro',
        tagline: 'Momentum-driven index option calls for active traders',
        shortDescription: 'Active Nifty and Bank Nifty options buying capitalizing on sharp intraday moves and volume expansions.',
        whatIsItFor: 'Capturing intraday momentum swings in index option premiums.',
        whomIsItFor: 'Active index option buyers looking for professional-grade intraday breakout signals.',
        idealFor: [
          'Active day traders',
          'Index option buyers',
          'OI breakout chasers',
          'Balanced risk profiles'
        ],
        productDescription: 'Combines open interest trends, dynamic volume charts, and underlying price action to enter ATM/near-OTM options with defined targets.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹75,000 - ₹2,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-3 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + App',
        followUp: 'Real-time updates on index pivots and targets',
        priceMonthly: 11000,
        priceQuarterly: 28000,
        priceHalfYearly: 50000,
        priceYearly: 80000,
        icon: 'flash_on',
        iconColor: 'text-violet-400',
        borderColor: 'hover:border-violet-500/20',
        gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
        isPopular: true,
        stats: [
          { value: '2-3', label: 'Calls/Day' },
          { value: 'Active', label: 'Scalps' }
        ]
      },
      {
        id: 'index-option-rocket',
        slug: 'index-option-rocket',
        category: 'index-options',
        name: 'Index Option Rocket',
        tagline: 'High-risk index option trades targeting sharp intraday moves',
        shortDescription: 'Aggressive index options setups designed to capture explosive moves, particularly on expiry days.',
        whatIsItFor: 'Capturing explosive spikes in index option premiums during high-velocity intraday breakouts and expiry days.',
        whomIsItFor: 'Experienced option buyers seeking rapid, high-return intraday setups with high risk tolerance.',
        idealFor: [
          'Expiry day players',
          'Volatility breakout traders',
          'Aggressive scalpers',
          'High risk tolerance portfolios'
        ],
        productDescription: 'Focuses on fast-moving momentum setups, technical gamma squeezes, and sharp reversal zones. Very high risk-reward structure.',
        riskSustainability: 'High',
        minimumInvestment: '₹1,00,000 - ₹3,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-3 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + Call',
        followUp: 'Immediate real-time execution and target alerts',
        priceMonthly: 14000,
        priceQuarterly: 38000,
        priceHalfYearly: 65000,
        priceYearly: 85000,
        icon: 'rocket_launch',
        iconColor: 'text-violet-400',
        borderColor: 'hover:border-violet-500/20',
        gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
        stats: [
          { value: 'Gamma', label: 'Setups' },
          { value: 'High', label: 'Velocity' }
        ]
      },
      {
        id: 'option-income-strategy',
        slug: 'option-income-strategy',
        category: 'index-options',
        name: 'Option Income Strategy',
        tagline: 'Conservative positional index option setups with controlled risk',
        shortDescription: 'Defined-risk option selling setups (e.g. Credit Spreads, Iron Condors) to generate consistent weekly premium collection.',
        whatIsItFor: 'Harvesting theta decay and index consolidation ranges over a multi-day holding period.',
        whomIsItFor: 'Income-focused options traders seeking consistent returns with defined downside risk.',
        idealFor: [
          'Option sellers seeking income',
          'Sideways market players',
          'Conservative theta gatherers',
          'Traders seeking regular payouts'
        ],
        productDescription: 'Designs delta-neutral or conservative directional spreads on index contracts. Leverages theta decay to capture premium steadily with strict hedges.',
        riskSustainability: 'Low',
        minimumInvestment: '₹3,00,000 - ₹6,00,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'WhatsApp + Email + App',
        followUp: 'Detailed adjustments and weekly rollover advice',
        priceMonthly: 8000,
        priceQuarterly: 21000,
        priceHalfYearly: 35000,
        priceYearly: 60000,
        icon: 'account_balance_wallet',
        iconColor: 'text-purple-400',
        borderColor: 'hover:border-purple-500/20',
        gradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
        stats: [
          { value: 'Hedged', label: 'Selling' },
          { value: 'Weekly', label: 'Income' }
        ]
      },
      {
        id: 'positional-option-edge',
        slug: 'positional-option-edge',
        category: 'index-options',
        name: 'Positional Option Edge',
        tagline: 'Trend-based positional index option recommendations',
        shortDescription: 'Captures weekly Nifty/Bank Nifty trend breakouts using multi-day option buying or simple spreads.',
        whatIsItFor: 'Riding multi-day index trend breakouts with capped-risk option structures.',
        whomIsItFor: 'Intermediate index swing traders who want leverage without intraday terminal checking.',
        idealFor: [
          'Weekly swing option traders',
          'Intermediate options buyers',
          'Trend-channel breakout users',
          'Risk-conscious leverage seekers'
        ],
        productDescription: 'Tracks structural breakout lines on daily charts. Trades atmospheric index moves with near-ATM debit spreads to manage drawdowns.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹2,00,000 - ₹5,00,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'Telegram + WhatsApp + Email',
        followUp: 'Daily positional tracking and target alerts',
        priceMonthly: 10000,
        priceQuarterly: 25000,
        priceHalfYearly: 40000,
        priceYearly: 65000,
        icon: 'trending_up',
        iconColor: 'text-purple-400',
        borderColor: 'hover:border-purple-500/20',
        gradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
        stats: [
          { value: '3-5 Days', label: 'Hold' },
          { value: 'Trend', label: 'Edge' }
        ]
      },
      {
        id: 'option-alpha-max',
        slug: 'option-alpha-max',
        category: 'index-options',
        name: 'Option Alpha Max',
        tagline: 'High-risk index option calls focused on major trends',
        shortDescription: 'High-conviction positional options buying recommendations designed to ride massive index moves.',
        whatIsItFor: 'Capturing structural index trend waves and major global breakout events for maximum premium growth.',
        whomIsItFor: 'Experienced index traders looking for large, leveraged swings with high volatility tolerance.',
        idealFor: [
          'Directional option buyers',
          'High risk index traders',
          'Asymmetric reward seekers',
          'Those comfortable with overnight gaps'
        ],
        productDescription: 'High-conviction, high-beta positional index options selections designed around macro triggers, FII data flow patterns, and major support breakdowns.',
        riskSustainability: 'High',
        minimumInvestment: '₹3,00,000 - ₹7,00,000',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'Dedicated RM + Telegram + Call',
        followUp: 'Active RM trade reviews and rollover calls',
        priceMonthly: 12000,
        priceQuarterly: 30000,
        priceHalfYearly: 50000,
        priceYearly: 70000,
        icon: 'military_tech',
        iconColor: 'text-purple-400',
        borderColor: 'hover:border-purple-500/20',
        gradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
        stats: [
          { value: 'Weekly', label: 'Holds' },
          { value: 'Asymmetric', label: 'Alpha' }
        ]
      }
    ]
  },
  {
    id: 'mcx-commodity',
    name: 'MCX Commodity',
    shortName: 'MCX Comm',
    description: 'Gold, Silver, Crude, and Base Metals trading',
    longDescription: 'Expert commodity research covering Gold, Silver, Crude Oil, and Natural Gas on the MCX, with focus on capital protection and trend capture.',
    icon: 'diamond',
    gradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    accentColor: 'yellow',
    subServices: [
      {
        id: 'commodity-shield',
        slug: 'commodity-shield',
        category: 'mcx-commodity',
        name: 'Commodity Shield',
        tagline: 'Low-risk commodity intraday calls',
        shortDescription: 'Focuses on capital-protected intraday commodity setups (precious metals and energy) with tight stop losses.',
        whatIsItFor: 'Trading MCX commodity contracts intraday with a priority on capital preservation.',
        whomIsItFor: 'Conservative commodity day traders seeking steady daily gains with minimal drawdowns.',
        idealFor: [
          'Conservative day traders',
          'Precious metal focus',
          'Strict risk controls',
          'Steady intraday compounding'
        ],
        productDescription: 'Identifies key liquidity zones and pivot points in MCX Gold, Silver, and Crude Oil. Enforces tight intraday exits to protect margins.',
        riskSustainability: 'Low',
        minimumInvestment: '₹1,50,000 - ₹3,50,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '1-2 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp',
        followUp: 'Real-time stop updates and target locks',
        priceMonthly: 10000,
        priceQuarterly: 25000,
        priceHalfYearly: 45000,
        priceYearly: 70000,
        icon: 'security',
        iconColor: 'text-yellow-400',
        borderColor: 'hover:border-yellow-500/20',
        gradient: 'from-yellow-500/10 via-amber-500/5 to-transparent',
        stats: [
          { value: '1-2', label: 'Calls/Day' },
          { value: 'Low Risk', label: 'Pivots' }
        ]
      },
      {
        id: 'mcx-momentum',
        slug: 'mcx-momentum',
        category: 'mcx-commodity',
        name: 'MCX Momentum',
        tagline: 'Balanced risk-reward intraday commodity setups',
        shortDescription: 'Intraday commodity breakout recommendations designed to capture momentum in active metals and energy markets.',
        whatIsItFor: 'Riding active daily trends and price breakouts in liquid MCX contracts.',
        whomIsItFor: 'Active commodity day traders looking for momentum breakout alerts during peak trading hours.',
        idealFor: [
          'Active day traders',
          'Energy & base metal traders',
          'Momentum breakout chasers',
          'Balanced risk budgets'
        ],
        productDescription: 'Finds breakouts on intraday commodity charts triggered by global volume spikes, inventory data releases, and technical overlays.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹2,00,000 - ₹5,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-3 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + App',
        followUp: 'Real-time alerts on shifts in global markets',
        priceMonthly: 12000,
        priceQuarterly: 30000,
        priceHalfYearly: 55000,
        priceYearly: 75000,
        icon: 'flash_on',
        iconColor: 'text-yellow-400',
        borderColor: 'hover:border-yellow-500/20',
        gradient: 'from-yellow-500/10 via-amber-500/5 to-transparent',
        isPopular: true,
        stats: [
          { value: '2-3', label: 'Calls/Day' },
          { value: 'Active', label: 'Momentum' }
        ]
      },
      {
        id: 'mcx-turbo-trader',
        slug: 'mcx-turbo-trader',
        category: 'mcx-commodity',
        name: 'MCX Turbo Trader',
        tagline: 'Aggressive commodity trading in volatile markets',
        shortDescription: 'High-velocity intraday setups in highly volatile energy and base metals contracts targeting larger gains.',
        whatIsItFor: 'Capturing quick, explosive price moves in volatile commodity futures contracts.',
        whomIsItFor: 'Experienced MCX day traders seeking high returns and comfortable with significant volatility.',
        idealFor: [
          'Aggressive commodity scalpers',
          'Crude Oil / Natural Gas traders',
          'High risk tolerance capital',
          'Fast terminal executions'
        ],
        productDescription: 'High-speed day trading strategy centered on peak volume times, international data releases (EIA, CPI), and momentum breakouts. High risk.',
        riskSustainability: 'High',
        minimumInvestment: '₹3,00,000 - ₹7,00,000',
        categoryLabel: 'Intraday',
        recommendationFrequency: '2-3 calls per market day',
        modeOfRecommendation: 'Telegram + WhatsApp + Call',
        followUp: 'Immediate buy/sell/exit triggers',
        priceMonthly: 15000,
        priceQuarterly: 40000,
        priceHalfYearly: 65000,
        priceYearly: 85000,
        icon: 'speed',
        iconColor: 'text-yellow-400',
        borderColor: 'hover:border-yellow-500/20',
        gradient: 'from-yellow-500/10 via-amber-500/5 to-transparent',
        stats: [
          { value: '2-3', label: 'Calls/Day' },
          { value: 'Aggressive', label: 'Targets' }
        ]
      },
      {
        id: 'commodity-wealth-builder',
        slug: 'commodity-wealth-builder',
        category: 'mcx-commodity',
        name: 'Commodity Wealth Builder',
        tagline: 'Low-risk positional commodity recommendations based on trends',
        shortDescription: 'Positional commodity recommendations designed to capture long-term macro trends with capital security.',
        whatIsItFor: 'Building long-term wealth by taking low-risk positional holdings in Gold, Silver, and key base metals.',
        whomIsItFor: 'Investors seeking portfolio diversification and commodity exposure to hedge inflation.',
        idealFor: [
          'Portfolio diversifiers',
          'Conservative positional investors',
          'Long term wealth builders',
          'Inflation hedging strategies'
        ],
        productDescription: 'Combines multi-week global demand-supply studies with long-term technical breakout charts. Managed with a strict trailing framework.',
        riskSustainability: 'Low',
        minimumInvestment: '₹3,00,000+',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'WhatsApp + Email + App',
        followUp: 'Weekly positional analysis and global market news',
        priceMonthly: 8000,
        priceQuarterly: 20000,
        priceHalfYearly: 35000,
        priceYearly: 60000,
        icon: 'stars',
        iconColor: 'text-amber-400',
        borderColor: 'hover:border-amber-500/20',
        gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
        stats: [
          { value: 'Weekly', label: 'Picks' },
          { value: 'Low Risk', label: 'Trend' }
        ]
      },
      {
        id: 'commodity-trend-master',
        slug: 'commodity-trend-master',
        category: 'mcx-commodity',
        name: 'Commodity Trend Master',
        tagline: 'Sustained mid-term commodity market trends',
        shortDescription: 'Positional MCX swing trading designed to capture multi-week price breakouts and channel moves.',
        whatIsItFor: 'Riding medium-term breakout channels in gold, silver, crude oil, and copper futures.',
        whomIsItFor: 'Active positional swing traders looking to capitalize on cyclical commodity fluctuations.',
        idealFor: [
          'Positional swing traders',
          'Cyclical trend followers',
          'Intermediate commodity traders',
          'Multi-week holding seekers'
        ],
        productDescription: 'Monitors international charts (COMEX, NYMEX) and dollar-index correlations to identify breakout continuations. Employs medium target strategies.',
        riskSustainability: 'Medium',
        minimumInvestment: '₹4,00,000+',
        categoryLabel: 'Positional',
        recommendationFrequency: '2-3 setups per week',
        modeOfRecommendation: 'Telegram + WhatsApp + Email',
        followUp: 'Mid-week updates on macro triggers and charts',
        priceMonthly: 10000,
        priceQuarterly: 25000,
        priceHalfYearly: 45000,
        priceYearly: 65000,
        icon: 'auto_graph',
        iconColor: 'text-amber-400',
        borderColor: 'hover:border-amber-500/20',
        gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
        stats: [
          { value: 'Multi-Week', label: 'Holds' },
          { value: 'Trend', label: 'Capture' }
        ]
      },
      {
        id: 'commodity-super-cycle',
        slug: 'commodity-super-cycle',
        category: 'mcx-commodity',
        name: 'Commodity Super Cycle',
        tagline: 'High-conviction commodity opportunities targeting major cycles',
        shortDescription: 'Premium high-risk positional commodity picks riding massive geopolitical or macroeconomic supercycles.',
        whatIsItFor: 'Participating in huge, structural shifts in global commodities for outsized returns.',
        whomIsItFor: 'HNIs and sophisticated traders seeking cyclical alpha trends with high risk tolerance.',
        idealFor: [
          'High risk positional swingers',
          'HNI advisory clients',
          'Geopolitical event traders',
          'Outsized target seekers'
        ],
        productDescription: 'Identifies commodity contracts entering long-term supply deficits or global inflation runs. Managed with active targets and cycle calls.',
        riskSustainability: 'High',
        minimumInvestment: '₹5,00,000+',
        categoryLabel: 'Positional',
        recommendationFrequency: '1-2 setups per week',
        modeOfRecommendation: 'Dedicated RM + Telegram + Call',
        followUp: 'Direct contact and cyclical reviews',
        priceMonthly: 12000,
        priceQuarterly: 30000,
        priceHalfYearly: 55000,
        priceYearly: 75000,
        icon: 'military_tech',
        iconColor: 'text-amber-400',
        borderColor: 'hover:border-amber-500/20',
        gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
        stats: [
          { value: 'Cyclical', label: 'Holds' },
          { value: 'Super Cycle', label: 'Focus' }
        ]
      }
    ]
  }
];

export function getCategory(id: string): ServiceCategory | undefined {
  return serviceCategories.find(c => c.id === id);
}

export function getSubService(categoryId: string, slug: string) {
  const category = getCategory(categoryId);
  return category?.subServices.find(s => s.slug === slug);
}

export function getAllSubServices() {
  return serviceCategories.flatMap(c => c.subServices);
}

export function calculateQuarterlySavings(monthly: number, quarterly: number): number {
  const threeMonthCost = monthly * 3;
  return threeMonthCost - quarterly;
}

export function calculateSavingsPercent(monthly: number, quarterly: number): number {
  const threeMonthCost = monthly * 3;
  if (threeMonthCost === 0) return 0;
  return Math.round(((threeMonthCost - quarterly) / threeMonthCost) * 100);
}

export function getPricingTiers(service: SubService): PricingInfo[] {
  const tiers: { tier: PricingInfo['tier']; label: string; months: number; price: number }[] = [
    { tier: 'monthly', label: 'Monthly', months: 1, price: service.priceMonthly },
    { tier: 'quarterly', label: 'Quarterly', months: 3, price: service.priceQuarterly },
    { tier: 'halfYearly', label: 'Half Yearly', months: 6, price: service.priceHalfYearly },
    { tier: 'yearly', label: 'Yearly', months: 12, price: service.priceYearly },
  ];

  return tiers.map(t => {
    const monthlyEquivalent = t.price / t.months;
    const standardCost = service.priceMonthly * t.months;
    const savingsAmount = standardCost - t.price;
    const savingsPercent = standardCost > 0 ? Math.round((savingsAmount / standardCost) * 100) : 0;

    return {
      ...t,
      equivalentMonthlyPrice: Math.round(monthlyEquivalent),
      savingsPercent: savingsPercent > 0 ? savingsPercent : 0,
      savingsAmount: savingsAmount > 0 ? savingsAmount : 0,
    };
  });
}
