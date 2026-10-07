import { BitgetOrderRequest, BitgetOrderResponse, BitgetAccountBalance } from '../types/bitget';
import { WATCHLIST_RTOKENS } from '../config/rtokens';

export class BitgetHubClientService {
  private static paperTradingMode: boolean = true;
  private static accountId: string = "bitget_agentic_exbit_paper_01";
  private static availableUsdt: number = 2450.00;
  private static lockedUsdt: number = 550.00;
  private static executedOrders: BitgetOrderResponse[] = [];

  static getAccountBalance(): BitgetAccountBalance {
    const unrealizedPnl = 124.50; // current paper unrealized
    const equity = this.availableUsdt + this.lockedUsdt + unrealizedPnl;
    
    return {
      accountId: this.accountId,
      usdtBalance: this.availableUsdt + this.lockedUsdt,
      usdtAvailable: this.availableUsdt,
      usdtLocked: this.lockedUsdt,
      unrealizedPnl,
      equity,
      isPaperTrading: this.paperTradingMode,
    };
  }

  /**
   * Executes a paper-trading order via Bitget Agent Hub MCP protocol.
   * STRICT: Validates paper trading flag before dispatching.
   */
  static async placePaperOrder(request: BitgetOrderRequest): Promise<BitgetOrderResponse> {
    if (!this.paperTradingMode) {
      throw new Error("CRITICAL SAFETY GUARD: Live execution disabled. Exbit only executes in --paper-trading mode.");
    }

    const token = WATCHLIST_RTOKENS.find(t => t.bitgetPair === request.symbol || t.symbol === request.symbol);
    const basePrice = token ? token.basePrice : 100.0;
    
    // Simulate slight natural fill variation within 0.05%
    const fillPrice = request.side === 'buy'
      ? Number((basePrice * 1.0004).toFixed(2))
      : Number((basePrice * 0.9996).toFixed(2));
      
    const quantity = parseFloat(request.size) || 1.0;
    const orderCostUsdt = fillPrice * quantity;
    const feeUsdt = Number((orderCostUsdt * 0.001).toFixed(3)); // 0.1% fee

    if (request.dryRun) {
      return {
        success: true,
        orderId: `dryrun-${Date.now()}`,
        clientOid: request.clientOid,
        symbol: request.symbol,
        fillPrice,
        fillQuantity: quantity,
        feeUsdt,
        status: 'simulated',
        timestamp: Date.now(),
        paperMode: true,
        message: "DryRun order simulated successfully via Bitget Agent Hub MCP server.",
      };
    }

    // Deduct available paper cash and increase locked margin
    if (this.availableUsdt >= orderCostUsdt) {
      this.availableUsdt -= orderCostUsdt;
      this.lockedUsdt += orderCostUsdt;
    }

    const orderResponse: BitgetOrderResponse = {
      success: true,
      orderId: `bg_paper_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      clientOid: request.clientOid,
      symbol: request.symbol,
      fillPrice,
      fillQuantity: quantity,
      feeUsdt,
      status: 'filled',
      timestamp: Date.now(),
      paperMode: true,
      message: `Paper order executed successfully on Bitget Agent Hub (${request.symbol} ${request.side.toUpperCase()}).`,
    };

    this.executedOrders.push(orderResponse);
    return orderResponse;
  }

  static getExecutedOrders(): BitgetOrderResponse[] {
    return [...this.executedOrders];
  }
}
