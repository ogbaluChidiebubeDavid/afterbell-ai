export interface BitgetAgentHubConfig {
  mode: 'paper-trading' | 'read-only' | 'live';
  accountId: string;
  serverUrl?: string;
  isIsolated: boolean;
  canWithdraw: false; // STRICT: always false for Afterbell
  canCancelAll: false; // STRICT: always false for Afterbell
}

export interface BitgetOrderRequest {
  symbol: string;        // e.g. "rNVDAUSDT"
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  size: string;          // Token quantity or USDT amount
  price?: string;
  clientOid: string;
  dryRun?: boolean;
}

export interface BitgetOrderResponse {
  success: boolean;
  orderId: string;
  clientOid: string;
  symbol: string;
  fillPrice: number;
  fillQuantity: number;
  feeUsdt: number;
  status: 'filled' | 'partially_filled' | 'rejected' | 'simulated';
  timestamp: number;
  paperMode: boolean;
  message?: string;
}

export interface BitgetAccountBalance {
  accountId: string;
  usdtBalance: number;
  usdtAvailable: number;
  usdtLocked: number;
  unrealizedPnl: number;
  equity: number;
  isPaperTrading: boolean;
}
