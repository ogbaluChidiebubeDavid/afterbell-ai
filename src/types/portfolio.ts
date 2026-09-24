import { TradeDirection } from './proposals';

export interface PaperPosition {
  id: string;
  proposalId: string;
  asset: string;            // e.g. "rNVDA"
  direction: TradeDirection;
  entryPrice: number;
  currentPrice: number;
  sizeTokens: number;
  costBasisUsdt: number;
  unrealizedPnlUsdt: number;
  unrealizedPnlPercent: number;
  targetPrice: number;
  stopLossPrice: number;
  openedAt: string;
  liquidationPrice?: number;
}

export interface ClosedTrade {
  id: string;
  proposalId: string;
  asset: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number;
  sizeTokens: number;
  costBasisUsdt: number;
  realizedPnlUsdt: number;
  realizedPnlPercent: number;
  openedAt: string;
  closedAt: string;
  exitReason: 'TAKE_PROFIT' | 'STOP_LOSS' | 'MANUAL_CLOSE' | 'US_MARKET_OPEN_REBALANCE';
  catalystSummary: string;
}

export interface EquityCurvePoint {
  timestamp: string;
  totalPortfolioValue: number;
  unrealizedPnl: number;
  realizedPnlCumulative: number;
  cashUsdt: number;
}

export interface QuantitativeMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRatePercent: number;          // Target: > 60%
  sharpeRatio: number;             // Target: > 1.8 - 2.5
  maxDrawdownPercent: number;      // Target: < 6.5%
  profitFactor: number;            // Gross Profits / Gross Losses
  totalReturnPercent: number;
  startingCapitalUsdt: number;
  currentPortfolioValueUsdt: number;
  availableCashUsdt: number;
  marginLockedUsdt: number;
  realizedPnlTotalUsdt: number;
  unrealizedPnlTotalUsdt: number;
  averageTradeDurationMinutes: number;
  lastUpdated: string;
}

export interface PortfolioState {
  metrics: QuantitativeMetrics;
  positions: PaperPosition[];
  closedTrades: ClosedTrade[];
  equityCurve: EquityCurvePoint[];
}
