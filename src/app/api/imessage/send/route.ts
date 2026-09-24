import { NextRequest, NextResponse } from 'next/server';
import { PhotonClientService } from '@/services/photon-client';

export async function GET() {
  try {
    const history = PhotonClientService.getChatHistory();
    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;
    if (!text) {
      return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 });
    }

    // Call the webhook handler logic by redirecting internally or reusing the service
    const userMsg = PhotonClientService.addUserMessage(text);
    return NextResponse.json({
      success: true,
      data: userMsg,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
