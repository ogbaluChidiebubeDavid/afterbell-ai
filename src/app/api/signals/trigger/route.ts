import { NextRequest, NextResponse } from 'next/server';
import { SignalAggregatorService } from '@/services/signal-aggregator';
import { DecisionEngineService } from '@/services/decision-engine';
import { AuditLoggerService } from '@/services/audit-logger';
import { MessagingChannelService } from '@/services/messaging-channel';
import { PortfolioManagerService } from '@/services/portfolio-manager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title, summary, relevantTickers, sourceSkill, urgency, sentiment, confidenceScore } = body;

    // Create or inject catalyst
    const catalyst = await SignalAggregatorService.injectCustomCatalyst({
      sourceSkill: sourceSkill || 'news-briefing',
      title: title || 'Breaking Weekend Catalyst: Hyperscaler Expands AI Acceleration Procurement',
      summary: summary || 'Sunday evening disclosure confirms multi-billion dollar long-term allocation to next-gen AI silicon clusters ahead of Monday US opening bell.',
      relevantTickers: relevantTickers && relevantTickers.length > 0 ? relevantTickers : ['rNVDA'],
      urgency: urgency || 'HIGH',
      sentiment: sentiment || 'BULLISH',
      confidenceScore: confidenceScore || 88,
      metadata: {
        headlineImpact: 'Proactive tokenized stock positioning ahead of regular market session gap.',
        underlyingUSMarketStatus: 'CLOSED_WEEKEND',
        macroTag: 'EVENT_DRIVEN_CATALYST',
      },
    });

    // Run decision engine
    const portfolio = PortfolioManagerService.getPortfolioState();
    const proposal = await DecisionEngineService.evaluateCatalyst(
      catalyst,
      portfolio.metrics.availableCashUsdt,
      portfolio.positions.length
    );

    // Save to audit log
    AuditLoggerService.addProposal(proposal);

    // Dispatch to WhatsApp channel
    const alertText = MessagingChannelService.formatAlertText(proposal);
    MessagingChannelService.addAgentMessage(alertText, proposal.id, true, true, [
      { title: 'Reply YES', payload: 'YES' },
      { title: 'Reply NO', payload: 'NO' },
      { title: 'View Status', payload: 'STATUS' },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        catalyst,
        proposal,
      },
      message: 'Catalyst triggered, proposal reasoned, and trade alert dispatched.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
