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

    console.log('[WhatsApp Webhook Inbound Payload]', JSON.stringify(body, null, 2));

    let fromNumber = '';
    let messageText = '';

    // 1. Kapso v2 payload format: { message: { text: { body: "..." }, kapso: { content: "..." } }, conversation: { phone_number: "+..." } }
    if (body.message || body.conversation) {
      fromNumber =
        body.conversation?.phone_number ||
        body.message?.from ||
        body.phone_number ||
        body.from ||
        '';

      messageText =
        body.message?.kapso?.content ||
        body.message?.text?.body ||
        body.message?.interactive?.button_reply?.id ||
        body.message?.interactive?.button_reply?.title ||
        (typeof body.message?.text === 'string' ? body.message.text : '') ||
        body.message?.body ||
        '';
    }

    // 2. Kapso v1 or wrapped event format: { event: "whatsapp.message.received", data: { ... } }
    if (!fromNumber && body.data) {
      const data = body.data;
      const msg = data.message || data;
      fromNumber =
        data.conversation?.phone_number ||
        msg.from ||
        msg.sender ||
        msg.sender_phone_number ||
        data.from ||
        '';

      messageText =
        msg.kapso?.content ||
        msg.text?.body ||
        msg.interactive?.button_reply?.id ||
        msg.interactive?.button_reply?.title ||
        (typeof msg.text === 'string' ? msg.text : '') ||
        msg.body ||
        '';
    }

    // 3. Standard Meta WhatsApp Cloud API format (entry[].changes[].value.messages[])
    if (!fromNumber && (body.object === 'whatsapp_business_account' || body.entry)) {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};
          const messages = value.messages || [];
          for (const msg of messages) {
            fromNumber = msg.from || '';
            messageText =
              msg.interactive?.button_reply?.id ||
              msg.interactive?.button_reply?.title ||
              msg.text?.body ||
              msg.button?.text ||
              '';
            if (fromNumber && messageText) break;
          }
          if (fromNumber && messageText) break;
        }
        if (fromNumber && messageText) break;
      }
    }

    // 4. Flat test format { from: "...", text: "..." }
    if (!fromNumber && body.from) {
      fromNumber = String(body.from);
      messageText = typeof body.text === 'string' ? body.text : body.text?.body || '';
    }

    fromNumber = fromNumber.trim();
    messageText = messageText.trim();

    if (fromNumber && messageText) {
      console.log(`[WhatsApp Webhook] ✅ Processing message from ${fromNumber}: "${messageText}"`);
      const reply = await WhatsAppChannelService.processInboundMessage(fromNumber, messageText);
      return NextResponse.json({ success: true, from: fromNumber, text: messageText, reply });
    }

    console.warn('[WhatsApp Webhook] No actionable message found in payload:', body);
    return new Response('EVENT_RECEIVED', { status: 200 });
  } catch (error: any) {
    console.error('[WhatsApp Webhook Error]', error);
    return new Response('EVENT_RECEIVED', { status: 200 });
  }
}
