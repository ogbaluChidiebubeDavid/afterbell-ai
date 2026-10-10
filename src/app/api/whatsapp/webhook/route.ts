import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppChannelService } from '@/services/whatsapp-channel';

export const dynamic = 'force-dynamic';

/**
 * GET: Webhook Handshake Verification & Health Check
 */
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode');
  const token = req.nextUrl.searchParams.get('hub.verify_token');
  const challenge = req.nextUrl.searchParams.get('hub.challenge');

  const configuredToken = process.env.WHATSAPP_VERIFY_TOKEN || 'exbit_whatsapp_verify_token';

  if (mode === 'subscribe' && token === configuredToken && challenge) {
    console.log('[WhatsApp Webhook] Verified successfully with Kapso / Meta!');
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Health check endpoint
  return NextResponse.json({
    status: 'ACTIVE',
    service: 'Exbit WhatsApp Webhook (Powered by Kapso)',
    phoneNumberId: process.env.KAPSO_PHONE_NUMBER_ID || '1452815264574436',
    displayPhoneNumber: '+1 201-829-1736',
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST: Handles incoming WhatsApp messages from Kapso / WhatsApp Cloud API
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // 1. Handle Kapso webhook format: event === "whatsapp.message.received"
    if (body.event === 'whatsapp.message.received' || body.data?.message) {
      const msg = body.data?.message || body.data || body;
      const from = msg.from || msg.sender || msg.sender_phone_number;
      const text = (msg.body || msg.text || msg.interactive?.button_reply?.title || '').trim();

      if (from && text) {
        console.log(`[Kapso Webhook] Inbound from ${from}: "${text}"`);
        await WhatsAppChannelService.processInboundMessage(from, text);
        return NextResponse.json({ success: true, processed: true });
      }
    }

    // 2. Handle standard Meta WhatsApp Cloud API format (entry[].changes[].value.messages[])
    if (body.object === 'whatsapp_business_account' || body.entry) {
      const entries = body.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};
          const messages = value.messages || [];

          for (const msg of messages) {
            const from = msg.from;
            const text = (
              msg.interactive?.button_reply?.id ||
              msg.interactive?.button_reply?.title ||
              msg.text?.body ||
              msg.button?.text ||
              ''
            ).trim();

            if (from && text) {
              console.log(`[Meta WhatsApp Webhook] Inbound from ${from}: "${text}"`);
              await WhatsAppChannelService.processInboundMessage(from, text);
            }
          }
        }
      }

      return new Response('EVENT_RECEIVED', { status: 200 });
    }

    // Direct test payload support
    if (body.from && body.text) {
      await WhatsAppChannelService.processInboundMessage(body.from, body.text);
      return NextResponse.json({ success: true });
    }

    return new Response('EVENT_RECEIVED', { status: 200 });
  } catch (error: any) {
    console.error('[WhatsApp Webhook Error]', error);
    return new Response('EVENT_RECEIVED', { status: 200 });
  }
}
