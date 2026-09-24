export type BitgetSignalSkill = 
  | 'macro-analyst'
  | 'news-briefing'
  | 'sentiment-analyst'
  | 'market-intel'
  | 'technical-analysis';

export type SignalUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MarketCatalyst {
  id: string;
  timestamp: string;
  sourceSkill: BitgetSignalSkill;
  title: string;
  summary: string;
  relevantTickers: string[]; // e.g. ["rNVDA", "rTSLA"]
  urgency: SignalUrgency;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'VOLATILE';
  confidenceScore: number; // 0 - 100
  metadata: {
    sourceUrl?: string;
    macroTag?: string;
    headlineImpact?: string;
    underlyingUSMarketStatus: 'CLOSED_WEEKEND' | 'CLOSED_OVERNIGHT' | 'PRE_MARKET' | 'REGULAR';
  };
}

export interface SignalAggregatorState {
  lastUpdated: string;
  activeCatalysts: MarketCatalyst[];
  marketWindow: {
    isUsEquitiesOpen: boolean;
    isWeekendGap: boolean;
    isOvernightGap: boolean;
    windowLabel: string;
    secondsUntilNextUsOpen: number;
    nextUsOpenTimestamp: string;
  };
}
