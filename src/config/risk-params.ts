export interface RiskParameters {
  maxPositionSizeUsdt: number;
  dailyTradeCap: number;
  minConfidenceScore: number;
  maxSlippagePercent: number;
  maxDailyDrawdownPercent: number;
  minRiskRewardRatio: number;
  humanApprovalTimeoutMinutes: number;
  allowedExecutionMode: 'paper-trading';
  restrictedOperations: string[];
}

export const SYSTEM_RISK_PARAMS: RiskParameters = {
  maxPositionSizeUsdt: 500,
  dailyTradeCap: 3,
  minConfidenceScore: 75,
  maxSlippagePercent: 0.35,
  maxDailyDrawdownPercent: 3.5,
  minRiskRewardRatio: 1.8,
  humanApprovalTimeoutMinutes: 30,
  allowedExecutionMode: 'paper-trading',
  restrictedOperations: [
    'WITHDRAW',
    'TRANSFER',
    'CANCEL_ALL_UNCONFIRMED',
    'LEVERAGE_OVER_10X',
    'UNAUTHORIZED_ASSET',
  ],
};
