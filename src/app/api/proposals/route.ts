import { NextRequest, NextResponse } from 'next/server';
import { AuditLoggerService } from '@/services/audit-logger';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const asset = searchParams.get('asset');

    let proposals = AuditLoggerService.getAllProposals();

    if (status) {
      proposals = proposals.filter(p => p.humanApprovalStatus === status);
    }

    if (asset) {
      proposals = proposals.filter(p => p.asset === asset);
    }

    return NextResponse.json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
