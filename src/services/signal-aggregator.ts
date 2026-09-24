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
