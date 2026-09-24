import { NextRequest, NextResponse } from 'next/server';
import { PhotonClientService } from '@/services/photon-client';
import { AuditLoggerService } from '@/services/audit-logger';
import { BitgetHubClientService } from '@/services/bitget-hub-client';
import { PortfolioManagerService } from '@/services/portfolio-manager';
import { StrategyModuleService } from '@/services/strategy-modules';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messageText: string = (body.text || body.message || body.body || '').trim();

    if (!messageText) {
      return NextResponse.json({ success: false, error: 'Empty message text' }, { status: 400 });
    }

    // Record user message
    PhotonClientService.addUserMessage(messageText);

    const isAffirmative = PhotonClientService.isAffirmativeReply(messageText);
    const isNegative = PhotonClientService.isNegativeReply(messageText);
    const upper = messageText.toUpperCase();

    // Check for MENU command
    if (upper === 'MENU' || upper === 'STRATEGIES' || upper === 'CONDITIONS') {
      const modules = StrategyModuleService.getModules();
      const menuText = `📋 AFTERBELL STRATEGY CONDITIONS:\nSelect what you want watched around the clock:\n` +
        modules.map((m, i) => `${i + 1}. [${m.isActive ? '✅ ON' : '⚪ OFF'}] ${m.name}`).join('\n') +
        `\n\nReply with a number (1-4) to toggle conditions, or "STATUS" for portfolio stats.`;

      PhotonClientService.addAgentMessage(menuText, undefined, false);
      return NextResponse.json({ success: true, action: 'MENU' });
    }

    // Check for number toggles (1-4)
    if (['1', '2', '3', '4'].includes(messageText)) {
      const idx = parseInt(messageText, 10) - 1;
      const modules = StrategyModuleService.getModules();
      if (modules[idx]) {
        const updated = StrategyModuleService.toggleModule(modules[idx].id);
        PhotonClientService.addAgentMessage(
          `⚙️ Condition Updated: ${updated?.name} is now ${updated?.isActive ? 'ACTIVATED ✅' : 'DISABLED ⚪'}.\nWatching ${updated?.targets.join(', ')}.`,
          undefined,
          false
        );
        return NextResponse.json({ success: true, action: 'TOGGLE_STRATEGY', module: updated });
      }
    }

    // Check for STATUS command
    if (upper.includes('STATUS') || upper.includes('PORTFOLIO')) {
      const port = PortfolioManagerService.getPortfolioState();
      const activeMods = StrategyModuleService.getActiveModules();
      PhotonClientService.addAgentMessage(
        `📊 AFTERBELL STATUS REPORT:\nMode: --paper-trading (Bitget Agentic Account)\nPortfolio Value: $${port.metrics.currentPortfolioValueUsdt.toFixed(2)} USDT\nRealized P&L: +$${port.metrics.realizedPnlTotalUsdt.toFixed(2)} USDT\nSharpe Ratio: ${port.metrics.sharpeRatio}\nWin Rate: ${port.metrics.winRatePercent}%\nActive Watch Conditions: ${activeMods.map(m => m.name).join(', ')}`,
        undefined,
        false
      );
      return NextResponse.json({ success: true, action: 'STATUS_REPORT' });
    }

    // Proposals flow
    const proposals = AuditLoggerService.getAllProposals();
    const pendingProposal = proposals.find(p => p.humanApprovalStatus === 'PENDING_APPROVAL');

    if (isAffirmative) {
      if (!pendingProposal) {
        PhotonClientService.addAgentMessage(
          "⚠️ No trade proposal is currently awaiting approval. Type STATUS or MENU to see active conditions.",
          undefined,
          false
        );
        return NextResponse.json({ success: true, action: 'NO_PENDING_PROPOSAL' });
      }

      if (pendingProposal.riskCheckStatus === 'REJECTED_BY_RISK_RULE') {
        PhotonClientService.addAgentMessage(
          `🛑 Cannot execute: Proposal for ${pendingProposal.asset} failed automated risk controls (${pendingProposal.riskRejectionReason}).`,
          pendingProposal.id,
          false
        );
        return NextResponse.json({ success: true, action: 'RISK_BLOCKED' });
      }

      // Execute paper order on Bitget Agent Hub
      const orderResponse = await BitgetHubClientService.placePaperOrder({
        symbol: `${pendingProposal.asset}USDT`,
        side: pendingProposal.direction === 'LONG' ? 'buy' : 'sell',
        orderType: 'market',
        size: pendingProposal.positionSizeTokens.toString(),
        clientOid: `afterbell_imsg_${pendingProposal.id}`,
        dryRun: false,
      });

      AuditLoggerService.updateProposal(pendingProposal.id, {
        humanApprovalStatus: 'APPROVED',
        approvalTimestamp: new Date().toISOString(),
        orderExecutionId: orderResponse.orderId,
      });

      PortfolioManagerService.openPositionFromOrder(pendingProposal, orderResponse);

      PhotonClientService.addAgentMessage(
        `✅ ORDER FILLED [Bitget Agent Hub Paper Trading]\nAsset: ${pendingProposal.asset}\nDirection: ${pendingProposal.direction}\nFill: $${orderResponse.fillPrice.toFixed(2)} USDT\nSize: $${(orderResponse.fillPrice * orderResponse.fillQuantity).toFixed(2)}\nOrder ID: ${orderResponse.orderId}\nAccount: Bitget Agentic (Isolated)`,
        pendingProposal.id,
        false
      );

      return NextResponse.json({
        success: true,
        action: 'APPROVED_AND_EXECUTED',
        proposalId: pendingProposal.id,
        orderId: orderResponse.orderId,
      });
    }

    if (isNegative) {
      if (pendingProposal) {
        AuditLoggerService.updateProposal(pendingProposal.id, {
          humanApprovalStatus: 'REJECTED',
          rejectionReason: 'User declined via iMessage reply ("NO")',
        });

        PhotonClientService.addAgentMessage(
          `❌ Trade proposal for ${pendingProposal.asset} was cancelled upon your request. Logged to explainability trail.`,
          pendingProposal.id,
          false
        );

        return NextResponse.json({
          success: true,
          action: 'REJECTED',
          proposalId: pendingProposal.id,
        });
      } else {
        PhotonClientService.addAgentMessage("Acknowledged. No active proposal was pending.");
        return NextResponse.json({ success: true, action: 'NO_OP' });
      }
    }

    // Default conversational reply
    PhotonClientService.addAgentMessage(
      `🤖 Afterbell Agent: Received "${messageText}".\nWatching your chosen conditions 24/7.\n• Reply "YES" to approve any pending trade\n• Reply "NO" to reject\n• Send "MENU" to toggle watched conditions\n• Send "STATUS" for portfolio stats.`,
      undefined,
      false
    );

    return NextResponse.json({ success: true, action: 'REPLIED' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
