import { NextResponse } from 'next/server';
import { MarketClockService } from '@/services/market-clock';

export async function GET() {
  try {
    const marketState = MarketClockService.getCurrentState();
    return NextResponse.json({
      success: true,
      data: marketState,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
