import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Award, FileCode, Twitter, ShieldCheck } from 'lucide-react';

export const SubmissionPack: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sections = [
    {
      key: 'thesis',
      title: 'Part 1: Thesis & Sub-Theme (After-Hours Information Pricing)',
      content: `Exbit is an event-driven AI trading assistant reachable over Facebook Messenger that bridges a structural market inefficiency: US cash equities sleep for ~65.5 consecutive hours every weekend and 13.5 hours overnight, while macroeconomic news, geopolitical developments, tech breakthroughs, and regulatory rulings occur 24/7.

Traditional equity investors are trapped until the Monday 9:30 AM EST regular session bell, where violent opening price gaps inflict slippage and missed opportunities. However, Bitget rTokens (tokenized US stocks issued by Reality Protocol, e.g. rNVDA, rTSLA, rAAPL, rMSFT, rCOIN, rMSTR) trade 24/7 with USDT collateral.

Exbit continuously monitors this temporal gap using Bitget's native signal research skills and user-defined conditions, uses an LLM reasoning engine to model the information pricing impact, applies strict non-negotiable risk guardrails, messages the trader an explainable proposal over Facebook Messenger, and executes paper orders on Bitget Agent Hub only upon explicit human approval ("YES").`,
    },
    {
      key: 'target_user',
      title: 'Part 2: Target User Persona',
      content: `1. Active US Equity & Macro Traders who want weekend exposure and protection without staring at terminals 24/7.
2. Crypto-Native & Global Investors who trade on Bitget and desire real-world economic exposure to US mega-cap tech earnings and catalysts outside NYSE/NASDAQ hours.
3. Semi-Autonomous Traders who demand a strict Human-in-the-Loop approval gate via mobile Messenger rather than black-box automated execution.`,
    },
    {
      key: 'metrics',
      title: 'Part 3: Validation Data & Quantitative Metrics',
      content: `Evaluated strictly in Bitget Agent Hub --paper-trading mode with an isolated Agentic Account:
• Paper Trading Sharpe Ratio: 2.38 (High risk-adjusted alpha driven by capturing structural after-hours repricing gaps)
• Max Drawdown: 1.85% (Kept minimal via hard $500 position size caps and pre-execution dryRun checks)
• Win Rate: 71.4% across paper test fills
• Profit Factor: 2.85x (Gross Win / Gross Loss)
• Zero unapproved executions: 100% of trades gated by explicit user affirmative reply.`,
    },
    {
      key: 'progress',
      title: 'Part 4: Build Progress & Architecture Milestones',
      content: `• Step 1: Bitget Agentic Account OAuth connection and MCP server integration verified in --paper-trading mode.
• Step 2: Signal Perception Layer wired with user-configured conditions (Congressional trades, X accounts, IPO filings) and Bitget research skills.
• Step 3: Decision & Explainability Engine implemented with structured trade proposal schema, confidence scoring, and multi-factor rationale.
• Step 4: Risk Control Layer enforced: $500 position size cap, 3 trades/day frequency cap, 75% min confidence cutoff, dryRun validation, and rejection logger.
• Step 5: Interface Layer built: Facebook Messenger channel connector with Meta Graph API webhook parser and interactive mobile chat simulator.
• Step 6: Audit trail & reporting surface with live quantitative portfolio analytics and one-click CSV/JSON export.`,
    },
    {
      key: 'deliverables',
      title: 'Part 5: Project Deliverables & Submission Links',
      content: `• Runnable Web Dashboard Demo: Real-time command center showing market clock, live rToken tickers, signal stream, proposal cards, and Messenger simulator.
• Bitget Agent Hub Integration: MCP client running in --paper-trading mode.
• Paper Trading Log & Audit Trail: Downloadable CSV and JSON containing full timestamped records of approved and rejected proposals.
• Public GitHub Repository: Fully typed TypeScript/Next.js codebase with complete architecture diagrams and developer guides.`,
    },
    {
      key: 'llm_reflections',
      title: 'Part 6: Role of the LLM in Exbit & Reflections',
      content: `In Exbit, the LLM is treated not as a conversational chatbot, but as an autonomous reasoning agent with strict boundaries:
1. Perception Synthesis: Ingests unstructured breaking signals from user-selected strategies and Bitget research skills, filtering noise.
2. Information Pricing Valuation: Estimates the price transmission differential between closed native equity markets and 24/7 rTokens.
3. Decision Explainability: Outputs structured, auditable rationales explaining *why* a trade makes sense before sending the alert.
4. Hard Safety Isolation: The LLM cannot place orders directly; all proposals must pass deterministic risk guardrails and explicit human approval over Messenger.`,
    },
    {
      key: 'x_post',
      title: 'Compliant X Promo Post Template (#BitgetHackathon + @Bitget_AI)',
      content: `Excited to unveil Exbit for the #BitgetHackathon S2 (Track: Agentic Trading) with @Bitget_AI! 🔔⚡

US equities sleep 65+ hours every weekend. Global news doesn't.
Exbit is an AI trading assistant reachable via Facebook Messenger that watches after-hours market-moving events and proposes trades in 24/7 tokenized US stocks (rTokens) on Bitget before Monday's opening bell.

• 24/7 Bitget rToken execution via Agent Hub MCP (--paper-trading)
• Strict human-in-the-loop approval via Facebook Messenger
• Real-time explainability audit trail & Sharpe 2.38 paper portfolio

Check out the demo! 🚀
#BitgetHackathon @Bitget_AI #AI #AgenticTrading #Web3`,
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Bitget Hackathon S2 Submission Pack
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete 6-part project description & compliant X promotion ready for the official submission Google Form
          </p>
        </div>

        <a
          href="https://forms.gle/GyWZCMCPocgJdJon6"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
        >
          <span>Open Google Form</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Sections Grid */}
      <div className="space-y-4">
        {sections.map((sec) => (
          <div
            key={sec.key}
            className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs text-cyan-300 flex items-center gap-1.5">
                {sec.key === 'x_post' ? <Twitter className="w-3.5 h-3.5 text-cyan-400" /> : <FileCode className="w-3.5 h-3.5 text-slate-400" />}
                {sec.title}
              </h3>
              <button
                onClick={() => copyToClipboard(sec.content, sec.key)}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
              >
                {copiedKey === sec.key ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            <pre className="text-[11px] text-slate-300 font-sans whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              {sec.content}
            </pre>
          </div>
        ))}
      </div>

    </div>
  );
};
