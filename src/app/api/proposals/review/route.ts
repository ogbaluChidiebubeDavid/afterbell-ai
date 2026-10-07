import { NextRequest, NextResponse } from 'next/server';
import { AuditLoggerService } from '@/services/audit-logger';
import { BitgetHubClientService } from '@/services/bitget-hub-client';
import { PortfolioManagerService } from '@/services/portfolio-manager';
import { MessagingChannelService } from '@/services/messaging-channel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proposalId, action, rejectionReason } = body;

    if (!proposalId || !action) {
      return NextResponse.json({ success: false, error: 'Missing proposalId or action' }, { status: 400 });
    }

    const proposal = AuditLoggerService.getProposalById(proposalId);
    if (!proposal) {
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 });
    }

    if (action === 'REJECT') {
      const reason = rejectionReason || 'User rejected trade proposal via Messenger interface';
      AuditLoggerService.updateProposal(proposalId, {
        humanApprovalStatus: 'REJECTED',
        rejectionReason: reason,
      });

      MessagingChannelService.addAgentMessage(
        `❌ Trade proposal for ${proposal.asset} was REJECTED (${reason}). No orders were dispatched.`,
        proposalId,
        false
      );

      return NextResponse.json({
        success: true,
        message: 'Proposal marked as REJECTED in explainability log.',
        proposalId,
        status: 'REJECTED',
      });
    }

    if (action === 'APPROVE') {
      if (proposal.humanApprovalStatus === 'APPROVED') {
        return NextResponse.json({ success: false, error: 'Proposal has already been approved and executed' }, { status: 400 });
      }

      // Check risk rule status
      if (proposal.riskCheckStatus === 'REJECTED_BY_RISK_RULE') {
        return NextResponse.json({
          success: false,
          error: `Execution prohibited: This proposal failed automated risk checks (${proposal.riskRejectionReason}).`,
        }, { status: 403 });
      }

      // Execute order via Bitget Agent Hub MCP (Paper Trading)
      const orderResponse = await BitgetHubClientService.placePaperOrder({
        symbol: `${proposal.asset}USDT`,
        side: proposal.direction === 'LONG' ? 'buy' : 'sell',
        orderType: 'market',
        size: proposal.positionSizeTokens.toString(),
        clientOid: `exbit_${proposal.id}`,
        dryRun: false,
      });

      // Update proposal state
      const updated = AuditLoggerService.updateProposal(proposalId, {
        humanApprovalStatus: 'APPROVED',
        approvalTimestamp: new Date().toISOString(),
        orderExecutionId: orderResponse.orderId,
      });

      // Update paper portfolio
      const position = PortfolioManagerService.openPositionFromOrder(proposal, orderResponse);

      // Send confirmation to Messenger
      MessagingChannelService.addAgentMessage(
        `✅ ORDER EXECUTED [Bitget Agent Hub Paper Trading]\nAsset: ${proposal.asset}\nSide: ${proposal.direction}\nFill Price: $${orderResponse.fillPrice.toFixed(2)} USDT\nQty: ${orderResponse.fillQuantity} tokens ($${(orderResponse.fillPrice * orderResponse.fillQuantity).toFixed(2)})\nOrder ID: ${orderResponse.orderId}\nMode: --paper-trading (Isolated Account)`,
        proposalId,
        false
      );

      return NextResponse.json({
        success: true,
        message: 'Trade approved and paper order filled on Bitget Agent Hub.',
        data: {
          proposal: updated,
          order: orderResponse,
          position,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action. Must be APPROVE or REJECT' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
