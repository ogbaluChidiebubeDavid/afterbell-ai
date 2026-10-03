import { NextResponse } from 'next/server';

export async function GET() {
  const skillMarkdown = `# Afterbell Trading Agent Skill (Bitget AI Base Camp Hackathon S2)

Afterbell is an event-driven AI trading assistant reachable over Facebook Messenger that watches for market-moving events while US equities are closed (weekends, overnight, after-hours) and proposes trades in tokenized US stocks (rToken) on Bitget before the native market reopens.

## User-Configured Strategy Modules
1. Congressional trades: Track disclosed trades from specific members of Congress (e.g. Nancy Pelosi, Dan Crenshaw).
2. Specific X accounts: Follow named accounts for market-moving commentary (e.g. @elonmusk, @unusual_whales).
3. New IPO filings & S-1s: Watch for new filings in target sectors.
4. After-hours rToken pricing: Exploit the 65.5h weekend gap when US cash stocks sleep but Bitget rTokens trade 24/7.

## Execution Rules
- Execution Mode: STRICTLY \`--paper-trading\` via Bitget Agent Hub MCP
- Human-in-the-loop: Every single trade requires explicit affirmative reply ("YES" / "APPROVE")
- Risk limits: Max position size $500 USDT, max 3 trades/day, min 75% confidence threshold.
- Account: Bitget Agentic Account (OAuth-based, fund-isolated).
`;

  return new NextResponse(skillMarkdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
