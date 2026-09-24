import { NextRequest, NextResponse } from 'next/server';
import { StrategyModuleService } from '@/services/strategy-modules';

export async function GET() {
  try {
    const modules = StrategyModuleService.getModules();
    return NextResponse.json({
      success: true,
      data: modules,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Module ID required' }, { status: 400 });
    }
    const updated = StrategyModuleService.toggleModule(id);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
