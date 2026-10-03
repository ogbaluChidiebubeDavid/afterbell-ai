export type TradeDirection = 'LONG' | 'SHORT' | 'HEDGE';

export type HumanApprovalStatus = 
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED';

export type RiskCheckStatus = 
  | 'PASSED'
  | 'REJECTED_BY_RISK_RULE';

export interface DryRunResult {
  passed: boolean;
  simulatedPrice: number;
  estimatedSlippagePercent: number;
  estimatedFeeUsdt: number;
  marginRequiredUsdt: number;
  availableCollateralUsdt: number;
  liquidityDepthUsdt: number;
  checks: {
    rule: string;
    passed: boolean;
    detail: string;
  }[];
}

export interface ExplainabilityRationale {
  coreThesis: string;
  afterHoursInformationGap: string;
  macroSentimentContext: string;
  technicalConfirmation: string;
  expectedCatalystPricingAtReopen: string;
}

export interface TradeProposal {
  id: string;
  timestamp: string;
  catalystId: string;
  asset: string;              // e.g. "rNVDA"
  underlying: string;         // e.g. "NVDA (NASDAQ)"
  direction: TradeDirection;
  currentPrice: number;
  entryPrice: number;
  targetPrice: number;
  stopLossPrice: number;
  positionSizeUsdt: number;
  positionSizeTokens: number;
  confidenceScore: number;    // 0 - 100
  rationale: ExplainabilityRationale;
  riskFlags: string[];
  riskCheckStatus: RiskCheckStatus;
  riskRejectionReason?: string;
  humanApprovalStatus: HumanApprovalStatus;
  approvalTimestamp?: string;
  rejectionReason?: string;
  dryRun: DryRunResult;
  orderExecutionId?: string;
  messageAlertSent: boolean;
  messageSentTimestamp?: string;
  channel: 'Messenger' | 'Web_Simulator' | 'Direct_API';
}

export interface TradeProposalFilter {
  status?: HumanApprovalStatus;
  asset?: string;
  limit?: number;
}
