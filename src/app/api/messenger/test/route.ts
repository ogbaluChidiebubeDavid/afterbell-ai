import { NextRequest, NextResponse } from 'next/server';
import { MessagingChannelService } from '@/services/messaging-channel';

export async function GET(req: NextRequest) {
  const recipient = req.nextUrl.searchParams.get('recipient') || req.nextUrl.searchParams.get('id') || undefined;

  const testMessage = `🔔 Exbit Agent: Facebook Messenger connection verified!
Watching US Equities After-Hours & Weekend Gap for Bitget rToken trading.
Reply "MENU" to toggle watched conditions, or "STATUS" for live stats.`;

  const quickReplies = [
    { title: 'View Menu', payload: 'MENU' },
    { title: 'Check Status', payload: 'STATUS' },
    { title: 'Reply YES', payload: 'YES' },
  ];

  const dispatchResult = await MessagingChannelService.notifyUser(testMessage, recipient, quickReplies);

  return NextResponse.json({
    status: dispatchResult.success ? 'OK' : 'DISPATCH_ISSUE',
    service: 'Facebook Messenger Connector (Meta Graph API)',
    configured: MessagingChannelService.isConfigured(),
    mode: dispatchResult.mode,
    recipient: dispatchResult.recipient || MessagingChannelService.getActiveRecipient() || 'None specified',
    dispatchResult,
    facebookPageUrl: 'https://facebook.com/ExbitBot',
    messengerChatUrl: 'https://m.me/ExbitBot',
    setupGuide: {
      step1: 'Create a free App at https://developers.facebook.com and add Messenger product.',
      step2: 'Create/link a Facebook Page (e.g. https://facebook.com/ExbitBot) and generate a Page Access Token.',
      step3: 'Set MESSENGER_PAGE_TOKEN and MESSENGER_VERIFY_TOKEN in .env.local',
      step4: 'Configure Callback URL in Meta Dashboard to: https://<your-domain>/api/messenger/webhook',
      step5: 'Verify webhook with verify token: exbit_messenger_verify_token and subscribe to "messages" & "messaging_postbacks".',
      step6: 'Message your Facebook Page (https://facebook.com/ExbitBot) or open https://m.me/ExbitBot to chat with Exbit!',
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const targetRecipient = body.recipient || body.id;
  const customMessage = body.message || `🔔 Exbit Agent: Test ping via Facebook Messenger at ${new Date().toLocaleTimeString()} EST.`;

  const dispatchResult = await MessagingChannelService.notifyUser(customMessage, targetRecipient);

  return NextResponse.json({
    success: dispatchResult.success,
    dispatchResult,
  });
}
