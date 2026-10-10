import { NextRequest, NextResponse } from 'next/server';
import { AuditLoggerService } from '@/services/audit-logger';
import { PortfolioManagerService } from '@/services/portfolio-manager';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    if (format === 'json') {
      const proposals = AuditLoggerService.getAllProposals();
      const portfolio = PortfolioManagerService.getPortfolioState();

      const exportPayload = {
        project: "Exbit - Agentic Trading Assistant",
        hackathon: "Bitget AI Base Camp Hackathon S2",
        track: "Agentic Trading (Event-Driven / After-Hours Pricing)",
        generatedAt: new Date().toISOString(),
        executionMode: "paper-trading",
        accountIsolation: "Bitget Agentic Account",
        quantitativeMetrics: portfolio.metrics,
        openPositions: portfolio.positions,
        closedTrades: portfolio.closedTrades,
        explainabilityProposals: proposals,
      };

      return new NextResponse(JSON.stringify(exportPayload, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="exbit_paper_trading_audit_log.json"',
        },
      });
    }

    // CSV Export
    const type = searchParams.get('type') || 'runs';

    if (type === 'proposals') {
      const csvContent = AuditLoggerService.generateCsvAuditLog();
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="exbit_explainability_proposals.csv"',
        },
      });
    }

    // Default: Official Paper-Trading Run Records (timestamp, instrument, direction, price, quantity, account balance change)
    const runRecordsCsv = PortfolioManagerService.generateRunRecordsCsv();
    return new NextResponse(runRecordsCsv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="exbit_paper_trading_run_records.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
