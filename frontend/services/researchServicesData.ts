export interface ResearchPlan {
  duration: 'monthly' | 'quarterly';
  label: string;
  price: number;
  priceFormatted: string;
  validity: string;
}

export interface ResearchService {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  plans: {
    monthly: ResearchPlan;
    quarterly: ResearchPlan;
  };
  features: string;
}

export const researchServicesData: ResearchService[] = [
  {
    id: 'commodity',
    badge: 'Research Services - Commodity',
    title: 'Commodity',
    subtitle: 'Commodity | FnO',
    description:
      'Research-backed Commodity FnO opportunities covering Gold, Silver, Crude Oil, Natural Gas and other major commodities, with clear entry, target & stop-loss levels, supported by technical and fundamental analysis, global market cues, real-time updates and disciplined risk management.',
    plans: {
      monthly: {
        duration: 'monthly',
        label: 'Monthly — ₹10,000',
        price: 10000,
        priceFormatted: '₹10,000',
        validity: '22 working days validity',
      },
      quarterly: {
        duration: 'quarterly',
        label: 'Quarterly — ₹25,000',
        price: 25000,
        priceFormatted: '₹25,000',
        validity: '66 working days validity',
      },
    },
    features:
      'Real-Time Market Support | Commodity FnO Calls | Intraday & Positional Setups | Entry Target & Stop-Loss | Technical & Fundamental Analysis | Global Market Cues | Live Trade Updates | Risk-Reward Focused Strategies',
  },
  {
    id: 'index-equity-fno',
    badge: 'Research Services - Index + Equity Analysis',
    title: 'Index + Equity FnO',
    subtitle: 'Index | Equity | FnO Calls',
    description:
      'Research-backed Equity, Index and FnO trading opportunities with clear entry, target and stop-loss levels, supported by technical analysis, market trends, real-time updates, and disciplined risk management for intraday and positional trading.',
    plans: {
      monthly: {
        duration: 'monthly',
        label: 'Monthly — ₹10,000',
        price: 10000,
        priceFormatted: '₹10,000',
        validity: '22 working days validity',
      },
      quarterly: {
        duration: 'quarterly',
        label: 'Quarterly — ₹25,000',
        price: 25000,
        priceFormatted: '₹25,000',
        validity: '66 working days validity',
      },
    },
    features:
      'Real-Time Support | Live Trade Updates | Index & Equity FnO | Cash Market Calls | Entry, Target & Stop-Loss | Intraday & Positional Setups | Technical & Fundamental Analysis | Risk-Reward Focused Trades',
  },
  {
    id: 'long-term-investment',
    badge: 'Research Services',
    title: 'Long-Term Investment',
    subtitle: 'Equity calls based on Fundamental and Technical Analysis',
    description:
      'Research-driven Long-term Investment ideas focused on fundamentally strong companies, supported by detailed fundamental analysis, business outlook, growth potential, valuation, financial performance and risk assessment to identify quality investment opportunities for long-term wealth creation.',
    plans: {
      monthly: {
        duration: 'monthly',
        label: 'Monthly — ₹10,000',
        price: 10000,
        priceFormatted: '₹10,000',
        validity: '22 working days validity',
      },
      quarterly: {
        duration: 'quarterly',
        label: 'Quarterly — ₹25,000',
        price: 25000,
        priceFormatted: '₹25,000',
        validity: '66 working days validity',
      },
    },
    features:
      'Fundamental Research | Quality Stock Selection | Valuation Analysis | Growth and Business Outlook | Entry and Target Levels | Long-Term Portfolio Approach | Regular Updates | Risk Assessment',
  },
  {
    id: 'premium-combo',
    badge: 'Research Services - Combo',
    title: 'Premium Combo',
    subtitle: 'Complete Market Research. One Premium Solution.',
    description:
      'A comprehensive research package combining Index & equity FnO, Cash Market, Positional trading, Commodity FnO and Long-term Investment Research, with clear entry, target and stop-loss levels, real-time updates, technical & fundamental analysis, and disciplined risk-management insights.',
    plans: {
      monthly: {
        duration: 'monthly',
        label: 'Monthly — ₹30,000',
        price: 30000,
        priceFormatted: '₹30,000',
        validity: '22 working days validity',
      },
      quarterly: {
        duration: 'quarterly',
        label: 'Quarterly — ₹75,000',
        price: 75000,
        priceFormatted: '₹75,000',
        validity: '66 working days validity',
      },
    },
    features:
      'Multi-Market Coverage | Real-Time Support | FnO & Cash Calls | Commodity Research | Positional Setups | Long-Term Investment Ideas | Technical & Fundamental Analysis | Entry, Target & Stop-Loss | Regular Updates | Risk-Reward Focus',
  },
  {
    id: 'swing-trade',
    badge: 'Research Services - Swing Trading',
    title: 'Swing Trade',
    subtitle: 'Research-Driven Positional Trades with Clear Entry, Targets & Risk Management.',
    description:
      'Research-backed Positional Trading opportunities based on a combination of technical and fundamental analysis, with clearly defined entry levels, targets, stop-loss, expected holding period and risk-reward considerations to identify short-to-medium-term opportunities.',
    plans: {
      monthly: {
        duration: 'monthly',
        label: 'Monthly — ₹10,000',
        price: 10000,
        priceFormatted: '₹10,000',
        validity: '22 working days validity',
      },
      quarterly: {
        duration: 'quarterly',
        label: 'Quarterly — ₹25,000',
        price: 25000,
        priceFormatted: '₹25,000',
        validity: '66 working days validity',
      },
    },
    features:
      'Technical + Fundamental Analysis | Entry & Target Levels | Stop-Loss | Holding Period | Trend-Based Setups | Risk-Reward Focus | Regular Trade Updates | Market Monitoring',
  },
];
