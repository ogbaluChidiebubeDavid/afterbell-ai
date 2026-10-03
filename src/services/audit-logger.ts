import { TradeProposal } from '../types/proposals';
import { DryRunResult } from '../types/proposals';

export class AuditLoggerService {
  private static proposals: TradeProposal[] = [
    {
      id: "prop-nvda-demo",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      catalystId: "cat-nvda-weekend-01",
      asset: "rNVDA",
      underlying: "NVDA (NASDAQ)",
      direction: "LONG",
      currentPrice: 128.45,
      entryPrice: 128.45,
      targetPrice: 133.85,
      stopLossPrice: 126.50,
      positionSizeUsdt: 440.00,
      positionSizeTokens: 3.42,
      confidenceScore: 89,
      rationale: {
        coreThesis: "US Commerce Dept clarification on Blackwell export licensing removes rumor-driven overhang for Middle East datacenter supply contracts.",
        afterHoursInformationGap: "US cash equities closed until Monday 9:30 AM EST (~42 hours remaining). Traditional brokers are shut. Bitget rNVDA tokenized shares trade 24/7 with deep USDT liquidity.",
        macroSentimentContext: "Bitget news-briefing & macro-analyst confirm positive policy interpretation. Fear & Greed stable at 61.",
        technicalConfirmation: "Bitget rNVDA order book shows 68% buyer liquidity dominance with 0.04% bid-ask spread.",
        expectedCatalystPricingAtReopen: "Anticipate +3.2% gap at Monday 9:30 AM EST regular market open bell.",
      },
      riskFlags: ["Weekend low-liquidity slippage watch", "Requires explicit human confirmation"],
      riskCheckStatus: "PASSED",
      humanApprovalStatus: "PENDING_APPROVAL",
      dryRun: {
        passed: true,
        simulatedPrice: 128.45,
        estimatedSlippagePercent: 0.04,
        estimatedFeeUsdt: 0.44,
        marginRequiredUsdt: 440.00,
        availableCollateralUsdt: 2450.00,
        liquidityDepthUsdt: 52000,
        checks: [
          { rule: "Asset Allowlist", passed: true, detail: "rNVDA is authorized rToken" },
          { rule: "Max Position Cap", passed: true, detail: "$440 <= $500 max limit" },
          { rule: "Confidence Threshold", passed: true, detail: "89% >= 75% cutoff" },
          { rule: "Paper Mode Lock", passed: true, detail: "Bitget Agentic Account isolated" }
        ],
      },
      messageAlertSent: true,
      messageSentTimestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      channel: "Messenger",
    },
    {
      id: "prop-mstr-hist",
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      catalystId: "cat-mstr-weekend-03",
      asset: "rMSTR",
      underlying: "MSTR (NASDAQ)",
      direction: "LONG",
      currentPrice: 131.50,
      entryPrice: 131.50,
      targetPrice: 138.00,
      stopLossPrice: 128.00,
      positionSizeUsdt: 350.00,
      positionSizeTokens: 2.66,
      confidenceScore: 91,
      rationale: {
        coreThesis: "Bitcoin surged past $68.5k during Sunday liquidity thinness. Historical beta implies violent opening gap on MSTR.",
        afterHoursInformationGap: "Weekend crypto price discovery is completely detached from closed NASDAQ equity markets until Monday open.",
        macroSentimentContext: "Institutional spot ETF inflows continue into cold storage; macro liquidity index positive.",
        technicalConfirmation: "Bitget rMSTR trading at 1.8% premium over Friday close; buy orders stepping up.",
        expectedCatalystPricingAtReopen: "Expected opening print gap: +4.8% on NASDAQ open.",
      },
      riskFlags: ["High beta asset volatility"],
      riskCheckStatus: "PASSED",
      humanApprovalStatus: "APPROVED",
      approvalTimestamp: new Date(Date.now() - 1000 * 60 * 73).toISOString(),
      dryRun: {
        passed: true,
        simulatedPrice: 131.50,
        estimatedSlippagePercent: 0.05,
        estimatedFeeUsdt: 0.35,
        marginRequiredUsdt: 350.00,
        availableCollateralUsdt: 2800.00,
        liquidityDepthUsdt: 38000,
        checks: [
          { rule: "Asset Allowlist", passed: true, detail: "rMSTR is authorized rToken" },
          { rule: "Max Position Cap", passed: true, detail: "$350 <= $500 max limit" },
        ],
      },
      orderExecutionId: "bg_paper_mstr_01",
      messageAlertSent: true,
      channel: "Messenger",
    },
    {
      id: "prop-rejected-risk-example",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      catalystId: "cat-speculative-leak",
      asset: "rTSLA",
      underlying: "TSLA (NASDAQ)",
      direction: "LONG",
      currentPrice: 242.80,
      entryPrice: 242.80,
      targetPrice: 260.00,
      stopLossPrice: 235.00,
      positionSizeUsdt: 750.00, // VIOLATION: Exceeds $500 cap
      positionSizeTokens: 3.09,
      confidenceScore: 68,     // VIOLATION: Below 75% cutoff
      rationale: {
        coreThesis: "Unconfirmed blog post claiming robotaxi pre-orders in Europe.",
        afterHoursInformationGap: "Speculative rumor circulated during Saturday European hours.",
        macroSentimentContext: "Unverified rumor source; conflicting analyst reports.",
        technicalConfirmation: "Wide bid-ask spread on rTSLA order book.",
        expectedCatalystPricingAtReopen: "Indeterminate",
      },
      riskFlags: ["Confidence below 75%", "Position size $750 exceeds $500 cap", "Unverified blog source"],
      riskCheckStatus: "REJECTED_BY_RISK_RULE",
      riskRejectionReason: "Confidence 68% < 75% min cutoff; Size $750 > $500 limit. Proposal blocked before user notification.",
      humanApprovalStatus: "REJECTED",
      rejectionReason: "Blocked by automated Risk Control Layer (Scoring safety rules).",
      dryRun: {
        passed: false,
        simulatedPrice: 242.80,
        estimatedSlippagePercent: 0.42,
        estimatedFeeUsdt: 0.75,
        marginRequiredUsdt: 750.00,
        availableCollateralUsdt: 2450.00,
        liquidityDepthUsdt: 21000,
        checks: [
          { rule: "Max Position Cap", passed: false, detail: "$750 exceeds $500 hard cap" },
          { rule: "Confidence Gate", passed: false, detail: "68% fails >= 75% cutoff" },
        ],
      },
      messageAlertSent: false,
      channel: "Direct_API",
    },
    {
      id: "prop-user-declined-example",
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      catalystId: "cat-macro-fed-04",
      asset: "rAAPL",
      underlying: "AAPL (NASDAQ)",
      direction: "LONG",
      currentPrice: 226.50,
      entryPrice: 226.50,
      targetPrice: 232.00,
      stopLossPrice: 224.00,
      positionSizeUsdt: 320.00,
      positionSizeTokens: 1.41,
      confidenceScore: 78,
      rationale: {
        coreThesis: "Fed speech dovish tilt macro transmission.",
        afterHoursInformationGap: "Overnight bond futures reaction.",
        macroSentimentContext: "Dovish rates expectation.",
        technicalConfirmation: "Neutral momentum.",
        expectedCatalystPricingAtReopen: "+1.2% gap",
      },
      riskFlags: ["Broad macro beta rather than idiosyncratic catalyst"],
      riskCheckStatus: "PASSED",
      humanApprovalStatus: "REJECTED",
      rejectionReason: "User replied 'NO' via Messenger: Preferred conserving cash for higher-conviction NVDA event.",
      dryRun: {
        passed: true,
        simulatedPrice: 226.50,
        estimatedSlippagePercent: 0.03,
        estimatedFeeUsdt: 0.32,
        marginRequiredUsdt: 320.00,
        availableCollateralUsdt: 2450.00,
        liquidityDepthUsdt: 65000,
        checks: [{ rule: "Risk Gate", passed: true, detail: "All rules cleared" }],
      },
      messageAlertSent: true,
      channel: "Messenger",
    },
  ];

  static getAllProposals(): TradeProposal[] {
    return [...this.proposals];
  }

  static getProposalById(id: string): TradeProposal | null {
    return this.proposals.find(p => p.id === id) || null;
  }

  static addProposal(proposal: TradeProposal): void {
    this.proposals.unshift(proposal);
  }

  static updateProposal(id: string, updates: Partial<TradeProposal>): TradeProposal | null {
    const idx = this.proposals.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.proposals[idx] = { ...this.proposals[idx], ...updates };
    return this.proposals[idx];
  }

  /**
   * Generates downloadable CSV string of the paper trading explainability log.
   */
  static generateCsvAuditLog(): string {
    const headers = [
      "Timestamp",
      "Proposal_ID",
      "Asset",
      "Underlying",
      "Direction",
      "Entry_Price_USDT",
      "Size_USDT",
      "Confidence_Score",
      "Risk_Check_Status",
      "Human_Approval_Status",
      "Core_Thesis",
      "After_Hours_Information_Gap",
      "Rejection_Or_Execution_Notes"
    ];

    const rows = this.proposals.map(p => [
      `"${p.timestamp}"`,
      `"${p.id}"`,
      `"${p.asset}"`,
      `"${p.underlying}"`,
      `"${p.direction}"`,
      p.entryPrice.toFixed(2),
      p.positionSizeUsdt.toFixed(2),
      `${p.confidenceScore}%`,
      `"${p.riskCheckStatus}"`,
      `"${p.humanApprovalStatus}"`,
      `"${(p.rationale?.coreThesis || '').replace(/"/g, '""')}"`,
      `"${(p.rationale?.afterHoursInformationGap || '').replace(/"/g, '""')}"`,
      `"${(p.rejectionReason || p.riskRejectionReason || p.orderExecutionId || 'N/A').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
