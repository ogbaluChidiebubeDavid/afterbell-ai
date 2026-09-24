import { NextResponse } from 'next/server';
import { SignalAggregatorService } from '@/services/signal-aggregator';

export async function GET() {
  try {
    const catalysts = await SignalAggregatorService.getActiveCatalysts();
    return NextResponse.json({
      success: true,
      count: catalysts.length,
      data: catalysts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
