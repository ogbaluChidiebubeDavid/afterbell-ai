import { NextRequest, NextResponse } from 'next/server';
import { MessagingChannelService } from '@/services/messaging-channel';

export const dynamic = 'force-dynamic';

/**
 * GET: Meta Webhook Handshake / Verification & Health Check
 * Meta sends hub.mode, hub.verify_token, and hub.challenge
 */
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode');
  const token = req.nextUrl.searchParams.get('hub.verify_token');
  const challenge = req.nextUrl.searchParams.get('hub.challenge');

  const verifyToken =
    process.env.MESSENGER_VERIFY_TOKEN ||
    process.env.MESSENGER_TOKEN ||
    'afterbell_messenger_verify_token';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[Messenger Webhook] Verified successfully with Meta!');
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Health check endpoint
  return NextResponse.json({
    status: 'ACTIVE',
    service: 'Afterbell Facebook Messenger Webhook',
    configured: MessagingChannelService.isConfigured(),
    activeRecipient: MessagingChannelService.getActiveRecipient(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST: Handles incoming messages from Facebook Messenger (and local simulator)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Direct simulator POST from web landing page
    if (body.text) {
      const text = (body.text || '').trim();
      const sender = body.sender || 'web-simulator-user';
      const result = await MessagingChannelService.processUserMessage(text, sender);
      return NextResponse.json({ success: true, ...result });
    }

    // Meta webhook payload verification
    if (body.object === 'page') {
      const entries = body.entry || [];

      for (const entry of entries) {
        const messagingEvents = entry.messaging || [];

        for (const event of messagingEvents) {
          const senderId = event.sender?.id;
          if (!senderId) continue;

          const messageText = (
            event.message?.quick_reply?.payload ||
            event.message?.text ||
            event.postback?.payload ||
            ''
          ).trim();

          if (!messageText) continue;

          await MessagingChannelService.processUserMessage(messageText, senderId);
        }
      }

      return new Response('EVENT_RECEIVED', { status: 200 });
    }

    return new Response('EVENT_RECEIVED', { status: 200 });
  } catch (error: any) {
    console.error('[Messenger Webhook Error]', error);
    return new Response('EVENT_RECEIVED', { status: 200 });
  }
}
