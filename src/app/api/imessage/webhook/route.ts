import { NextRequest, NextResponse } from 'next/server';
import { PhotonClientService } from '@/services/photon-client';
import { AuditLoggerService } from '@/services/audit-logger';
import { BitgetHubClientService } from '@/services/bitget-hub-client';
import { PortfolioManagerService } from '@/services/portfolio-manager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messageText: string = (body.text || body.message || body.body || '').trim();
    const sender = body.from || body.sender || 'USER';

    if (!messageText) {
      return NextResponse.json({ success: false, error: 'Empty message text' }, { status: 400 });
    }

    // Record user message
    PhotonClientService.addUserMessage(messageText);

    // Check for commands or approvals
    const isAffirmative = PhotonClientService.isAffirmativeReply(messageText);
    const isNegative = PhotonClientService.isNegativeReply(messageText);

    // Find the latest pending proposal
    const proposals = AuditLoggerService.getAllProposals();
    const pendingProposal = proposals.find(p => p.humanApprovalStatus === 'PENDING_APPROVAL');

    if (isAffirmative) {
      if (!pendingProposal) {
        PhotonClientService.addAgentMessage(
          "⚠️ No trade proposal is currently awaiting approval. Type STATUS to view current watch state.",
          undefined,
          false
        );
        return NextResponse.json({ success: true, action: 'NO_PENDING_PROPOSAL' });
      }

      // Check if blocked by risk rule
      if (pendingProposal.riskCheckStatus === 'REJECTED_BY_RISK_RULE') {
        PhotonClientService.addAgentMessage(
          `🛑 Cannot execute: Proposal for ${pendingProposal.asset} failed automated risk controls (${pendingProposal.riskRejectionReason}).`,
          pendingProposal.id,
          false
        );
        return NextResponse.json({ success: true, action: 'RISK_BLOCKED' });
      }

      // Execute paper order on Bitget
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
        `✅ CONFIRMED: ${pendingProposal.direction} ${pendingProposal.asset} executed on Bitget Agent Hub Paper Trading!\nFill: $${orderResponse.fillPrice.toFixed(2)} USDT\nPosition Size: $${(orderResponse.fillPrice * orderResponse.fillQuantity).toFixed(2)}\nOrder ID: ${orderResponse.orderId}`,
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

    if (messageText.toUpperCase().includes('STATUS') || messageText.toUpperCase().includes('PORTFOLIO')) {
      const port = PortfolioManagerService.getPortfolioState();
      PhotonClientService.addAgentMessage(
        `📊 AFTERBELL STATUS REPORT:\nMode: --paper-trading (Bitget Agentic Account)\nPortfolio Value: $${port.metrics.currentPortfolioValueUsdt.toFixed(2)} USDT\nRealized P&L: +$${port.metrics.realizedPnlTotalUsdt.toFixed(2)} USDT\nSharpe Ratio: ${port.metrics.sharpeRatio}\nWin Rate: ${port.metrics.winRatePercent}%\nOpen Positions: ${port.positions.length} active (rTokens)`,
        undefined,
        false
      );
      return NextResponse.json({ success: true, action: 'STATUS_REPORT' });
    }

    // Default conversational reply
    PhotonClientService.addAgentMessage(
      `🤖 Afterbell Agent: Received "${messageText}".\nUS Equities are closed. Watching rToken after-hours information pricing.\n• Reply "YES" to approve any pending trade\n• Reply "NO" to reject\n• Send "STATUS" for portfolio stats.`,
      undefined,
      false
    );

    return NextResponse.json({ success: true, action: 'REPLIED' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
