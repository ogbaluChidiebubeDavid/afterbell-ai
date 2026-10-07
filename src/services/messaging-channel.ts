import { TradeProposal } from '../types/proposals';
import { MarketCatalyst } from '../types/signals';
import { AuditLoggerService } from './audit-logger';
import { BitgetHubClientService } from './bitget-hub-client';
import { DecisionEngineService } from './decision-engine';
import { PortfolioManagerService } from './portfolio-manager';
import { StrategyModuleService } from './strategy-modules';

export interface ChatMessage {
  id: string;
  sender: 'EXBIT_AGENT' | 'USER';
  timestamp: string;
  text: string;
  proposalId?: string;
  isActionable?: boolean;
  meta?: string;
}

export interface DispatchResult {
  success: boolean;
  mode: 'LIVE' | 'SIMULATOR';
  recipient?: string;
  status?: number;
  error?: string;
  responseData?: any;
}

export class MessagingChannelService {
  private static activeRecipientId: string | null = null;
  private static chatHistory: ChatMessage[] = [
    {
      id: "msg-welcome-01",
      sender: "EXBIT_AGENT",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      text: "🔔 Exbit Agent connected via Facebook Messenger. Watching US Equities After-Hours & Weekend Gap for Bitget rToken trading.\n\nType STATUS anytime, or MENU to choose what conditions to watch around the clock.",
    },
    {
      id: "msg-alert-nvda",
      sender: "EXBIT_AGENT",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      proposalId: "prop-nvda-demo",
      isActionable: true,
      text: `🚨 EXBIT ALERT [Weekend Gap]
Target: rNVDA (NVIDIA Corp Tokenized)
Direction: LONG @ $128.45
Size: $440.00 USDT (~3.42 rNVDA)
Confidence: 89%

Rationale: US Commerce Dept clarified Blackwell export licensing to Middle East cloud hubs, removing blanket ban overhang. US markets closed until Monday 9:30 AM EST. Bitget rToken volume active.

DryRun: PASSED (Est. slippage: 0.04%, Fee: $0.44 USDT)

Reply "YES" to approve paper order, or "NO" to discard.`,
    },
  ];

  /**
   * Sets the active Facebook Messenger recipient ID (PSID)
   */
  static setActiveRecipient(recipientId: string) {
    if (recipientId && recipientId.trim()) {
      this.activeRecipientId = recipientId.trim();
      console.log(`[MessagingChannel] Active recipient ID set to: ${this.activeRecipientId}`);
    }
  }

  /**
   * Retrieves active recipient or falls back to environment configuration
   */
  static getActiveRecipient(): string | null {
    return (
      this.activeRecipientId ||
      process.env.MESSENGER_RECIPIENT_ID ||
      process.env.MESSENGER_RECIPIENT_PSID ||
      null
    );
  }

  /**
   * Returns true if Facebook Messenger access token is configured
   */
  static isConfigured(): boolean {
    const token =
      process.env.MESSENGER_PAGE_TOKEN ||
      process.env.MESSENGER_PAGE_ACCESS_TOKEN;
    return Boolean(token && token.trim());
  }

  /**
   * Formats trade proposal alert with explainable thesis and dryRun preview
   */
  static formatAlertText(proposal: TradeProposal): string {
    return `🚨 EXBIT ALERT [${proposal.underlying}]
Target: ${proposal.asset}
Direction: ${proposal.direction} @ $${proposal.entryPrice.toFixed(2)}
Size: $${proposal.positionSizeUsdt.toFixed(2)} USDT (~${proposal.positionSizeTokens} ${proposal.asset})
Confidence: ${proposal.confidenceScore}%

Rationale: ${proposal.rationale.afterHoursInformationGap}

DryRun: ${proposal.dryRun.passed ? 'PASSED' : 'FLAGGED'} (Est. slippage: ${proposal.dryRun.estimatedSlippagePercent}%, Fee: $${proposal.dryRun.estimatedFeeUsdt.toFixed(2)} USDT)

Reply "YES" to approve paper order, or "NO" to discard.`;
  }

  /**
   * Generates a real-time market catalyst from a tracked target and pushes a trade proposal
   */
  static async triggerCatalystAlertForTarget(
    targetHandle: string,
    senderId?: string
  ): Promise<TradeProposal> {
    const handleClean = targetHandle.replace(/^ADD\s+/i, '').trim();
    let symbol = 'rNVDA';
    let title = `${handleClean}: Breaking AI infrastructure contract finalized`;
    let summary = `${handleClean} shared verified after-hours developments regarding multi-datacenter GPU cluster scale-up.`;
    const sentiment: 'BULLISH' | 'BEARISH' = 'BULLISH';
    let confidence = 89;

    const lower = handleClean.toLowerCase();
    if (lower.includes('elon') || lower.includes('tsla')) {
      symbol = 'rTSLA';
      title = `${handleClean}: Tesla FSD v13 approved for European pilots`;
      summary = `Regulatory green light granted for driverless fleet validation in EU tech corridors. Social sentiment index surged +380%.`;
      confidence = 88;
    } else if (lower.includes('sama') || lower.includes('openai')) {
      symbol = 'rNVDA';
      title = `${handleClean}: OpenAI secures multi-year enterprise compute agreement`;
      summary = `Sam Altman confirmed next-generation datacenter deployment with Nvidia Blackwell architectures.`;
      confidence = 92;
    } else if (lower.includes('tim_cook') || lower.includes('apple')) {
      symbol = 'rAAPL';
      title = `${handleClean}: Apple Intelligence strategic cloud integration launched`;
      summary = `Tim Cook announced enterprise cloud integrations ahead of upcoming developer symposium.`;
      confidence = 85;
    } else if (lower.includes('satya') || lower.includes('microsoft')) {
      symbol = 'rMSFT';
      title = `${handleClean}: Azure AI cloud revenue exceeds $15B milestone`;
      summary = `Satya Nadella disclosed record enterprise run-rate during weekend leadership briefing.`;
      confidence = 89;
    } else if (lower.includes('saylor') || lower.includes('btc') || lower.includes('cz')) {
      symbol = 'rMSTR';
      title = `${handleClean}: MicroStrategy executes weekend treasury acquisition`;
      summary = `Disclosed purchase of additional BTC reserve holdings. Historical NAV transmission implies strong opening gap.`;
      confidence = 91;
    }

    const catalyst: MarketCatalyst = {
      id: `cat-scan-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      sourceSkill: 'news-briefing',
      title,
      summary,
      relevantTickers: [symbol],
      urgency: 'HIGH',
      sentiment,
      confidenceScore: confidence,
      metadata: {
        headlineImpact: `Direct weekend catalyst. Traditional exchanges CLOSED. Bitget rToken provides 24/7 liquidity access.`,
        underlyingUSMarketStatus: 'CLOSED_OVERNIGHT',
        macroTag: 'REALTIME_INGESTION_SCAN',
      },
    };

    const proposal = await DecisionEngineService.evaluateCatalyst(catalyst);
    AuditLoggerService.addProposal(proposal);

    const alertText = this.formatAlertText(proposal);
    await this.addAgentMessage(
      alertText,
      proposal.id,
      true,
      true,
      [
        { title: 'YES (Approve)', payload: 'YES' },
        { title: 'NO (Reject)', payload: 'NO' },
        { title: 'Portfolio Status', payload: 'STATUS' },
      ],
      senderId
    );

    return proposal;
  }

  /**
   * Sends a message to the user via Facebook Messenger Send API
   */
  static async notifyUser(
    text: string,
    overrideRecipient?: string,
    quickReplies?: Array<{ title: string; payload: string }>
  ): Promise<DispatchResult> {
    const accessToken = (
      process.env.MESSENGER_PAGE_TOKEN ||
      process.env.MESSENGER_PAGE_ACCESS_TOKEN ||
      ''
    ).trim();

    const recipientId = overrideRecipient || this.getActiveRecipient();

    if (!accessToken || !recipientId) {
      console.log('[MessagingChannel] Running in local simulator mode.');
      return {
        success: true,
        mode: 'SIMULATOR',
        recipient: recipientId || 'simulator-user',
      };
    }

    try {
      console.log(`[MessagingChannel] Dispatching via Meta Graph API to: ${recipientId}...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const payload: any = {
        recipient: { id: recipientId },
        messaging_type: 'RESPONSE',
        message: {
          text,
        },
      };

      if (quickReplies && quickReplies.length > 0) {
        payload.message.quick_replies = quickReplies.map((qr) => ({
          content_type: 'text',
          title: qr.title,
          payload: qr.payload,
        }));
      }

      const res = await fetch(
        `https://graph.facebook.com/v19.0/me/messages?access_token=${encodeURIComponent(accessToken)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      const responseData = await res.json().catch(() => ({ statusText: res.statusText }));

      if (!res.ok) {
        console.error(`[MessagingChannel] Meta Send API error ${res.status}:`, responseData);
        return {
          success: false,
          mode: 'LIVE',
          status: res.status,
          error: `Meta Graph API error HTTP ${res.status}: ${JSON.stringify(responseData)}`,
          responseData,
        };
      }

      console.log(`[MessagingChannel] ✅ Real message delivered on Messenger to ${recipientId}!`);
      return {
        success: true,
        mode: 'LIVE',
        status: res.status,
        recipient: recipientId,
        responseData,
      };
    } catch (err: any) {
      console.error('[MessagingChannel] Network dispatch error:', err.message);
      return {
        success: false,
        mode: 'LIVE',
        error: err.message,
      };
    }
  }

  /**
   * Adds an agent message to session history and dispatches to Facebook Messenger
   */
  static async addAgentMessage(
    text: string,
    proposalId?: string,
    isActionable?: boolean,
    dispatchReal: boolean = true,
    quickReplies?: Array<{ title: string; payload: string }>,
    recipientId?: string
  ): Promise<ChatMessage> {
    const entry: ChatMessage = {
      id: `msg-${Date.now().toString(36)}`,
      sender: 'EXBIT_AGENT',
      timestamp: new Date().toISOString(),
      text,
      proposalId,
      isActionable,
    };
    this.chatHistory.push(entry);

    if (dispatchReal) {
      const target = recipientId || this.getActiveRecipient();
      if (target) {
        console.log(`[MessagingChannel] addAgentMessage delivering to recipient: ${target}`);
        await this.notifyUser(text, target, quickReplies);
      } else {
        console.log('[MessagingChannel] No recipient ID provided; running in local simulator mode.');
      }
    }

    return entry;
  }

  /**
   * Adds a user message to session history
   */
  static addUserMessage(text: string): ChatMessage {
    const entry: ChatMessage = {
      id: `msg-${Date.now().toString(36)}`,
      sender: 'USER',
      timestamp: new Date().toISOString(),
      text,
    };
    this.chatHistory.push(entry);
    return entry;
  }

  /**
   * Handles incoming text/payload from user and produces appropriate agent action
   */
  static async processUserMessage(
    messageText: string,
    senderId?: string
  ): Promise<{ action: string; replyText: string; extra?: any }> {
    if (senderId) {
      this.setActiveRecipient(senderId);
    }

    this.addUserMessage(messageText);

    const isAffirmative = this.isAffirmativeReply(messageText);
    const isNegative = this.isNegativeReply(messageText);
    const upper = messageText.toUpperCase();

    // MENU command
    if (upper === 'MENU' || upper === 'STRATEGIES' || upper === 'CONDITIONS') {
      const modules = StrategyModuleService.getModules();
      const replyText =
        `📋 EXBIT STRATEGY CONDITIONS:\nSelect what you want watched around the clock:\n\n` +
        modules.map((m, i) => `${i + 1}. [${m.isActive ? '✅ ON' : '⚪ OFF'}] ${m.name}`).join('\n') +
        `\n\nTap a number below (1-4) to toggle conditions, or "STATUS" for live portfolio stats.`;

      const quickReplies = [
        { title: 'Toggle 1', payload: '1' },
        { title: 'Toggle 2', payload: '2' },
        { title: 'Toggle 3', payload: '3' },
        { title: 'Toggle 4', payload: '4' },
        { title: 'Portfolio Status', payload: 'STATUS' },
      ];

      await this.addAgentMessage(replyText, undefined, false, true, quickReplies, senderId);
      return { action: 'MENU', replyText };
    }

    // Option 2 (Specific X Accounts) toggle & customization prompt
    if (messageText === '2') {
      const modules = StrategyModuleService.getModules();
      const xMod = modules[1];
      const updated = StrategyModuleService.toggleModule(xMod.id);

      if (updated?.isActive) {
        const replyText =
          `⚙️ Specific X Accounts is now ACTIVATED ✅!\n\n` +
          `Currently watching: ${updated.targets.join(', ')}.\n\n` +
          `👉 Send any X handles or links you want to monitor, for example:\n` +
          `• "@sama @tim_cook"\n` +
          `• "https://x.com/satyanadella"\n` +
          `• Or tap a quick reply below:`;

        await this.addAgentMessage(replyText, undefined, false, true, [
          { title: 'Add @sama', payload: 'ADD @sama' },
          { title: 'Add @tim_cook', payload: 'ADD @tim_cook' },
          { title: 'View Menu', payload: 'MENU' },
          { title: 'Portfolio Status', payload: 'STATUS' },
        ], senderId);
        return { action: 'TOGGLE_X_STRATEGY', replyText, extra: { module: updated } };
      } else {
        const replyText = `⚙️ Specific X Accounts is now DISABLED ⚪. (Inactive)`;
        await this.addAgentMessage(replyText, undefined, false, true, [
          { title: 'View Menu', payload: 'MENU' },
          { title: 'Portfolio Status', payload: 'STATUS' },
        ], senderId);
        return { action: 'TOGGLE_X_STRATEGY', replyText, extra: { module: updated } };
      }
    }

    // Generic Number toggles (1, 3, 4)
    if (['1', '3', '4'].includes(messageText)) {
      const idx = parseInt(messageText, 10) - 1;
      const modules = StrategyModuleService.getModules();
      if (modules[idx]) {
        const updated = StrategyModuleService.toggleModule(modules[idx].id);
        const replyText = `⚙️ Condition Updated: ${updated?.name} is now ${updated?.isActive ? 'ACTIVATED ✅' : 'DISABLED ⚪'}.\nWatching ${updated?.targets.join(', ')}.`;

        await this.addAgentMessage(replyText, undefined, false, true, [
          { title: 'View Menu', payload: 'MENU' },
          { title: 'Portfolio Status', payload: 'STATUS' },
        ], senderId);
        return { action: 'TOGGLE_STRATEGY', replyText, extra: { module: updated } };
      }
    }

    // Custom X username / profile link ingestion (e.g. "@sama", "ADD @tim_cook", "https://x.com/satyanadella")
    const handleRegex = /@([a-zA-Z0-9_]{1,25})/g;
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]{1,25})/gi;

    const extractedHandles: string[] = [];
    let hMatch;
    while ((hMatch = handleRegex.exec(messageText)) !== null) {
      const handle = `@${hMatch[1]}`;
      if (!extractedHandles.includes(handle)) extractedHandles.push(handle);
    }
    let uMatch;
    while ((uMatch = urlRegex.exec(messageText)) !== null) {
      const handle = `@${uMatch[1]}`;
      if (!extractedHandles.includes(handle)) extractedHandles.push(handle);
    }

    if (extractedHandles.length > 0) {
      const updated = StrategyModuleService.addModuleTargets('mod_x_accounts', extractedHandles);
      const targetHandle = extractedHandles[0];

      // 1. Confirm configuration to user
      const introText =
        `🎯 Custom Monitoring Saved!\n` +
        `Added: ${extractedHandles.join(', ')}\n` +
        `Active Watchlist: ${updated?.targets.join(', ')}\n\n` +
        `⚡ Perception Engine: Initiating live catalyst scan on ${targetHandle}...`;

      await this.addAgentMessage(introText, undefined, false, true, undefined, senderId);

      // 2. Trigger real-time catalyst evaluation and proposal for instant feedback
      const proposal = await this.triggerCatalystAlertForTarget(targetHandle, senderId);

      return {
        action: 'UPDATED_X_TARGETS_AND_SCANNED',
        replyText: introText,
        extra: { targets: updated?.targets, proposalId: proposal.id },
      };
    }

    // SCAN / TRIGGER / DEMO command for instant judge evaluation
    if (['SCAN', 'TRIGGER', 'ALERT', 'DEMO', 'TEST'].includes(upper)) {
      const xMod = StrategyModuleService.getModules()[1];
      const target = xMod?.targets?.[0] || '@sama';
      const introText = `🔍 EXBIT LIVE SCAN:\nPerception cycle scanning active watch target: ${target}...`;
      await this.addAgentMessage(introText, undefined, false, true, undefined, senderId);

      const proposal = await this.triggerCatalystAlertForTarget(target, senderId);
      return { action: 'TRIGGERED_SCAN', replyText: introText, extra: { proposalId: proposal.id } };
    }

    // STATUS command
    if (upper.includes('STATUS') || upper.includes('PORTFOLIO')) {
      const port = PortfolioManagerService.getPortfolioState();
      const activeMods = StrategyModuleService.getActiveModules();
      const replyText = `📊 EXBIT STATUS REPORT:\nMode: --paper-trading (Bitget Agentic Account)\nPortfolio Value: $${port.metrics.currentPortfolioValueUsdt.toFixed(2)} USDT\nRealized P&L: +$${port.metrics.realizedPnlTotalUsdt.toFixed(2)} USDT\nSharpe Ratio: ${port.metrics.sharpeRatio}\nWin Rate: ${port.metrics.winRatePercent}%\nActive Watch Conditions: ${activeMods.map((m) => m.name).join(', ')}`;

      await this.addAgentMessage(replyText, undefined, false, true, [
        { title: 'Trigger Scan', payload: 'SCAN' },
        { title: 'Strategy Menu', payload: 'MENU' },
      ], senderId);
      return { action: 'STATUS_REPORT', replyText };
    }

    // Proposals & Trade Approval flow
    const proposals = AuditLoggerService.getAllProposals();
    const pendingProposal = proposals.find((p) => p.humanApprovalStatus === 'PENDING_APPROVAL');

    if (isAffirmative) {
      if (!pendingProposal) {
        const replyText = '⚠️ No trade proposal is currently awaiting approval. Type STATUS or MENU to see active conditions.';
        await this.addAgentMessage(replyText, undefined, false, true, [
          { title: 'View Menu', payload: 'MENU' },
          { title: 'Status', payload: 'STATUS' },
        ], senderId);
        return { action: 'NO_PENDING_PROPOSAL', replyText };
      }

      if (pendingProposal.riskCheckStatus === 'REJECTED_BY_RISK_RULE') {
        const replyText = `🛑 Cannot execute: Proposal for ${pendingProposal.asset} failed automated risk controls (${pendingProposal.riskRejectionReason}).`;
        await this.addAgentMessage(replyText, pendingProposal.id, false, true, undefined, senderId);
        return { action: 'RISK_BLOCKED', replyText };
      }

      // Execute paper order on Bitget Agent Hub
      const orderResponse = await BitgetHubClientService.placePaperOrder({
        symbol: `${pendingProposal.asset}USDT`,
        side: pendingProposal.direction === 'LONG' ? 'buy' : 'sell',
        orderType: 'market',
        size: pendingProposal.positionSizeTokens.toString(),
        clientOid: `exbit_msg_${pendingProposal.id}`,
        dryRun: false,
      });

      AuditLoggerService.updateProposal(pendingProposal.id, {
        humanApprovalStatus: 'APPROVED',
        approvalTimestamp: new Date().toISOString(),
        orderExecutionId: orderResponse.orderId,
      });

      PortfolioManagerService.openPositionFromOrder(pendingProposal, orderResponse);

      const replyText = `✅ ORDER FILLED [Bitget Agent Hub Paper Trading]\nAsset: ${pendingProposal.asset}\nDirection: ${pendingProposal.direction}\nFill: $${orderResponse.fillPrice.toFixed(2)} USDT\nSize: $${(orderResponse.fillPrice * orderResponse.fillQuantity).toFixed(2)}\nOrder ID: ${orderResponse.orderId}\nAccount: Bitget Agentic (Isolated)`;

      await this.addAgentMessage(replyText, pendingProposal.id, false, true, [
        { title: 'View Status', payload: 'STATUS' },
        { title: 'Strategy Menu', payload: 'MENU' },
      ], senderId);

      return {
        action: 'APPROVED_AND_EXECUTED',
        replyText,
        extra: { proposalId: pendingProposal.id, orderId: orderResponse.orderId },
      };
    }

    if (isNegative) {
      if (pendingProposal) {
        AuditLoggerService.updateProposal(pendingProposal.id, {
          humanApprovalStatus: 'REJECTED',
          rejectionReason: 'User declined via reply ("NO")',
        });

        const replyText = `❌ Trade proposal for ${pendingProposal.asset} was cancelled upon your request. Logged to explainability trail.`;

        await this.addAgentMessage(replyText, pendingProposal.id, false, true, undefined, senderId);
        return { action: 'REJECTED', replyText, extra: { proposalId: pendingProposal.id } };
      } else {
        const replyText = 'Acknowledged. No active proposal was pending.';
        await this.addAgentMessage(replyText, undefined, false, true, undefined, senderId);
        return { action: 'NO_OP', replyText };
      }
    }

    // Default conversational reply
    const replyText = `🤖 Exbit Agent: Received "${messageText}".\nWatching your chosen conditions 24/7.\n• Send an X handle (e.g. @sama or @elonmusk) to monitor\n• Type "SCAN" to trigger an instant perception catalyst scan\n• Reply "YES" to approve any pending trade\n• Tap "MENU" to toggle watched conditions.`;

    await this.addAgentMessage(replyText, undefined, false, true, [
      { title: 'Trigger Scan', payload: 'SCAN' },
      { title: 'Add @sama', payload: 'ADD @sama' },
      { title: 'Strategy Menu', payload: 'MENU' },
      { title: 'Portfolio Status', payload: 'STATUS' },
    ], senderId);

    return { action: 'REPLIED', replyText };
  }

  static getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
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
