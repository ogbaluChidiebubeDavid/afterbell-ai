import { NextResponse } from 'next/server';
import { PortfolioManagerService } from '@/services/portfolio-manager';
import { BitgetHubClientService } from '@/services/bitget-hub-client';

export async function GET() {
  try {
    const portfolio = PortfolioManagerService.getPortfolioState();
    const bitgetBalance = BitgetHubClientService.getAccountBalance();

    return NextResponse.json({
      success: true,
      data: {
        portfolio,
        bitgetAccount: bitgetBalance,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
