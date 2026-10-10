import { MarketCatalyst, BitgetSignalSkill } from '../types/signals';

export class SignalAggregatorService {
  private static mockCatalysts: MarketCatalyst[] = [
    {
      id: "cat-nvda-weekend-01",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18m ago
      sourceSkill: "news-briefing",
      title: "US Commerce Dept Issues Weekend Clarification on High-Density AI Accelerators",
      summary: "Sunday 6:30 PM: Department of Commerce clarifies licensing rules for Blackwell architecture chips to tier-2 cloud providers in Middle East. Removes previously rumored export blanket ban overhang.",
      relevantTickers: ["rNVDA"],
      urgency: "HIGH",
      sentiment: "BULLISH",
      confidenceScore: 89,
      sourceCitation: "US Bureau of Industry & Security (BIS) Bulletin #2026-0814 & Taipei Times",
      sourceUrl: "https://www.bis.doc.gov/",
      directQuote: "Specific licensing exemptions established for localized high-density interconnect cluster deployments.",
      shockScore: 0.89,
      assetBeta: 1.45,
      falsificationCondition: "Invalidate if Sunday Night S&P 500 futures open down ≥ 0.8% or Commerce Dept issues formal retraction.",
      metadata: {
        headlineImpact: "+3.2% projected repricing at Monday 9:30 AM open based on historical policy resolutions.",
        underlyingUSMarketStatus: "CLOSED_WEEKEND",
        macroTag: "GEOPOLITICAL_TECH_POLICY",
      },
    },
    {
      id: "cat-tsla-overnight-02",
      timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42m ago
      sourceSkill: "sentiment-analyst",
      title: "Tesla FSD v13 Chinese Regulatory Fast-Track Granted in Shanghai Free-Trade Zone",
      summary: "Sunday night reports confirm municipal approval for full driverless robo-fleet road testing permits beginning next month. Social sentiment surged +410% in 1 hour.",
      relevantTickers: ["rTSLA"],
      urgency: "HIGH",
      sentiment: "BULLISH",
      confidenceScore: 84,
      sourceCitation: "Shanghai Municipal Transportation Commission Public Notice & Caixin Global",
      sourceUrl: "https://www.caixinglobal.com/",
      directQuote: "Municipal pilot permit granted for commercial validation of vision-based level-4 autonomous fleets in Pudong.",
      shockScore: 0.84,
      assetBeta: 1.62,
      falsificationCondition: "Invalidate if Chinese Ministry of Industry and Information Technology denies pilot scope expansion.",
      metadata: {
        headlineImpact: "Robo-fleet expansion unlocks high-margin recurring software monetization in world's largest EV market.",
        underlyingUSMarketStatus: "CLOSED_WEEKEND",
        macroTag: "AUTONOMOUS_MOBILITY",
      },
    },
    {
      id: "cat-mstr-weekend-03",
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // 75m ago
      sourceSkill: "market-intel",
      title: "Bitcoin Surges Past $68.5k on Weekend Spot ETF Inflow Momentum",
      summary: "Weekend crypto liquidity pushed BTC through key resistance. Historical beta of MicroStrategy (MSTR) against weekend BTC surge implies a +5.4% opening gap on Monday.",
      relevantTickers: ["rMSTR", "rCOIN"],
      urgency: "MEDIUM",
      sentiment: "BULLISH",
      confidenceScore: 91,
      sourceCitation: "SEC Form 8-K / MicroStrategy Treasury Disclosure & Bloomberg Onchain Terminal",
      sourceUrl: "https://www.sec.gov/edgar/browse/?CIK=0001050446",
      directQuote: "MicroStrategy acquired an aggregate of 7,420 bitcoins for approx $498.5 million in cash.",
      shockScore: 0.91,
      assetBeta: 2.15,
      falsificationCondition: "Invalidate if BTC retraces below $66,200 weekend support before 8:00 PM EST Sunday futures open.",
      metadata: {
        headlineImpact: "Direct net asset value (NAV) expansion for MSTR treasury holdings ahead of US equity open.",
        underlyingUSMarketStatus: "CLOSED_WEEKEND",
        macroTag: "ONCHAIN_LIQUIDITY",
      },
    },
    {
      id: "cat-macro-fed-04",
      timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
      sourceSkill: "macro-analyst",
      title: "Fed Governor Weekend Speech Signals Front-Loaded 50bps Rate Cut Trajectory",
      summary: "Sunday academic symposium remarks emphasize softening labor conditions and real rate restrictive drag. 2-Year Treasury futures imply lower yield open.",
      relevantTickers: ["rMSFT", "rAAPL"],
      urgency: "MEDIUM",
      sentiment: "BULLISH",
      confidenceScore: 78,
      sourceCitation: "Federal Reserve Board Speech Transcript & CME FedWatch Tool",
      sourceUrl: "https://www.federalreserve.gov/newsevents/speeches.htm",
      directQuote: "Labor market indicators warrant front-loaded recalibration toward neutral policy settings.",
      shockScore: 0.78,
      assetBeta: 1.18,
      falsificationCondition: "Invalidate if 2-Year Treasury yield futures rebound above 4.12%.",
      metadata: {
        headlineImpact: "Discount rate reduction expands valuation multiple headroom for megacap tech equities.",
        underlyingUSMarketStatus: "CLOSED_WEEKEND",
        macroTag: "FED_POLICY",
      },
    },
    {
      id: "cat-aapl-leak-05",
      timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
      sourceSkill: "technical-analysis",
      title: "rAAPL Orderbook Density Spike: Large Block Buying on Bitget Ahead of Reopen",
      summary: "Unusual buyer absorption detected at $225.80 support on Bitget rAAPL pair with 3.8x baseline volume. 24/7 spread tightened to 0.03%.",
      relevantTickers: ["rAAPL"],
      urgency: "LOW",
      sentiment: "BULLISH",
      confidenceScore: 76,
      metadata: {
        headlineImpact: "Smart money accumulation in tokenized shares anticipating Monday pre-market gap.",
        underlyingUSMarketStatus: "CLOSED_WEEKEND",
        macroTag: "ORDERBOOK_FLOW",
      },
    },
  ];

  static async getActiveCatalysts(): Promise<MarketCatalyst[]> {
    return [...this.mockCatalysts];
  }

  static async getCatalystById(id: string): Promise<MarketCatalyst | null> {
    const found = this.mockCatalysts.find(c => c.id === id);
    return found || null;
  }

  static async injectCustomCatalyst(catalyst: Omit<MarketCatalyst, 'id' | 'timestamp'>): Promise<MarketCatalyst> {
    const newEntry: MarketCatalyst = {
      ...catalyst,
      id: `cat-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
    };
    this.mockCatalysts.unshift(newEntry);
    return newEntry;
  }
}
