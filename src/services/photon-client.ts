import { TradeProposal } from '../types/proposals';

export interface IMessageChatEntry {
  id: string;
  sender: 'AFTERBELL_AGENT' | 'USER';
  timestamp: string;
  text: string;
  proposalId?: string;
  isActionable?: boolean;
}

export class PhotonClientService {
  private static chatHistory: IMessageChatEntry[] = [
    {
      id: "msg-welcome-01",
      sender: "AFTERBELL_AGENT",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      text: "🔔 Afterbell Agent connected via Photon iMessage. Watching US Equities After-Hours & Weekend Gap for Bitget rToken trading. Type STATUS anytime.",
    },
    {
      id: "msg-alert-nvda",
      sender: "AFTERBELL_AGENT",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      proposalId: "prop-nvda-demo",
      isActionable: true,
      text: `🚨 AFTERBELL ALERT [Weekend Gap]
Target: rNVDA (NVIDIA Corp Tokenized)
Direction: LONG @ $128.45
Size: $440.00 USDT (~3.42 rNVDA)
Confidence: 89%

Rationale: US Commerce Dept clarified Blackwell export licensing to Middle East cloud hubs, removing blanket ban overhang. US markets closed until Monday 9:30 AM EST. Bitget rToken volume active.

DryRun: PASSED (Est. slippage: 0.04%, Fee: $0.44 USDT)

Reply "YES" to approve paper order, or "NO" to discard.`,
    },
  ];

  static getChatHistory(): IMessageChatEntry[] {
    return [...this.chatHistory];
  }

  static formatAlertText(proposal: TradeProposal): string {
    return `🚨 AFTERBELL ALERT [${proposal.underlying}]
Target: ${proposal.asset}
Direction: ${proposal.direction} @ $${proposal.entryPrice.toFixed(2)}
Size: $${proposal.positionSizeUsdt.toFixed(2)} USDT (~${proposal.positionSizeTokens} ${proposal.asset})
Confidence: ${proposal.confidenceScore}%

Rationale: ${proposal.rationale.afterHoursInformationGap}

DryRun: ${proposal.dryRun.passed ? 'PASSED' : 'FLAGGED'} (Est. slippage: ${proposal.dryRun.estimatedSlippagePercent}%, Fee: $${proposal.dryRun.estimatedFeeUsdt.toFixed(2)} USDT)

Reply "YES" to approve paper order, or "NO" to discard.`;
  }

  static addAgentMessage(text: string, proposalId?: string, isActionable?: boolean): IMessageChatEntry {
    const entry: IMessageChatEntry = {
      id: `msg-${Date.now().toString(36)}`,
      sender: 'AFTERBELL_AGENT',
      timestamp: new Date().toISOString(),
      text,
      proposalId,
      isActionable,
    };
    this.chatHistory.push(entry);
    return entry;
  }

  static addUserMessage(text: string): IMessageChatEntry {
    const entry: IMessageChatEntry = {
      id: `msg-${Date.now().toString(36)}`,
      sender: 'USER',
      timestamp: new Date().toISOString(),
      text,
    };
    this.chatHistory.push(entry);
    return entry;
  }

  static isAffirmativeReply(text: string): boolean {
    const clean = text.trim().toLowerCase();
    return clean === 'yes' || clean === 'y' || clean === 'approve' || clean === 'confirm' || clean === 'execute' || clean === 'buy' || clean === 'trade';
  }

  static isNegativeReply(text: string): boolean {
    const clean = text.trim().toLowerCase();
    return clean === 'no' || clean === 'n' || clean === 'reject' || clean === 'cancel' || clean === 'deny' || clean === 'skip';
  }
}
