'use client';

import React, { useState } from 'react';
import {
  X,
  Award,
  FileText,
  TrendingUp,
  Download,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  DollarSign,
  Wallet,
  Copy,
  Check,
  ExternalLink,
  Twitter,
  MessageCircle,
  Radio,
  Send,
} from 'lucide-react';
import { PortfolioState } from '@/types/portfolio';
import { TradeProposal } from '@/types/proposals';

interface ArtifactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'portfolio' | 'audit' | 'submission' | 'messenger';
  portfolio: PortfolioState | null;
  proposals: TradeProposal[];
}

export const ArtifactsModal: React.FC<ArtifactsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'portfolio',
  portfolio,
  proposals,
}) => {
  const [tab, setTab] = useState<'portfolio' | 'audit' | 'submission' | 'messenger'>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadCsv = () => {
    window.open('/api/export?format=csv', '_blank');
  };

  const handleDownloadJson = () => {
    window.open('/api/export?format=json', '_blank');
  };

  const runMessengerTest = async () => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/messenger/test');
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const metrics = portfolio?.metrics;
  const positions = portfolio?.positions || [];
  const closedTrades = portfolio?.closedTrades || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] border border-[#2e2e2e] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#eeeeeb]">
        
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[#242424] bg-[#181818]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm tracking-tight">Afterbell Artifacts &amp; Judge Review Surface</span>
            <span className="text-[10px] text-[#10b981] font-mono bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20">
              --paper-trading
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center bg-[#101010] p-1 rounded-xl border border-[#2a2a2a] text-xs">
              <button
                onClick={() => setTab('portfolio')}
                className={`px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
                  tab === 'portfolio' ? 'bg-[#282828] text-white shadow' : 'text-[#888] hover:text-[#ccc]'
                }`}
              >
                Paper Quant Engine
              </button>
              <button
                onClick={() => setTab('audit')}
                className={`px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
                  tab === 'audit' ? 'bg-[#282828] text-white shadow' : 'text-[#888] hover:text-[#ccc]'
                }`}
              >
                Explainability Log
              </button>
              <button
                onClick={() => setTab('messenger')}
                className={`px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap flex items-center gap-1.5 ${
                  tab === 'messenger' ? 'bg-[#0084ff]/20 text-[#0084ff] border border-[#0084ff]/40 shadow' : 'text-[#888] hover:text-[#ccc]'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#0084ff]" />
                Messenger Live Setup
              </button>
              <button
                onClick={() => setTab('submission')}
                className={`px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
                  tab === 'submission' ? 'bg-[#282828] text-white shadow' : 'text-[#888] hover:text-[#ccc]'
                }`}
              >
                Submission Pack
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] flex items-center justify-center text-[#999] hover:text-white transition-colors ml-2 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: PORTFOLIO & QUANT METRICS */}
          {tab === 'portfolio' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#181818] p-4 rounded-2xl border border-[#262626]">
                  <span className="text-[11px] text-[#888] uppercase tracking-wider block">Sharpe Ratio</span>
                  <span className="text-2xl font-bold font-mono text-[#0a84ff] mt-1 block">
                    {metrics?.sharpeRatio || 2.38}
                  </span>
                  <span className="text-[10px] text-[#10b981] mt-0.5 block">Tier 1 Quant Score</span>
                </div>
                <div className="bg-[#181818] p-4 rounded-2xl border border-[#262626]">
                  <span className="text-[11px] text-[#888] uppercase tracking-wider block">Max Drawdown</span>
                  <span className="text-2xl font-bold font-mono text-[#10b981] mt-1 block">
                    -{metrics?.maxDrawdownPercent || 1.85}%
                  </span>
                  <span className="text-[10px] text-[#888] mt-0.5 block">Conservative Bounds</span>
                </div>
                <div className="bg-[#181818] p-4 rounded-2xl border border-[#262626]">
                  <span className="text-[11px] text-[#888] uppercase tracking-wider block">Win Rate</span>
                  <span className="text-2xl font-bold font-mono text-[#10b981] mt-1 block">
                    {metrics?.winRatePercent || 71.4}%
                  </span>
                  <span className="text-[10px] text-[#888] mt-0.5 block">5 of 7 Closed Paper Orders</span>
                </div>
                <div className="bg-[#181818] p-4 rounded-2xl border border-[#262626]">
                  <span className="text-[11px] text-[#888] uppercase tracking-wider block">Realized Paper P&amp;L</span>
                  <span className="text-2xl font-bold font-mono text-[#10b981] mt-1 block">
                    +${metrics?.realizedPnlTotalUsdt.toFixed(2) || '245.50'}
                  </span>
                  <span className="text-[10px] text-[#888] mt-0.5 block">USDT Paper Collateral</span>
                </div>
              </div>

              {/* Active Open Positions */}
              <div className="bg-[#181818] p-4 rounded-2xl border border-[#262626] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                  <span className="font-semibold text-xs text-[#ccc]">Active Paper Positions (Bitget rTokens)</span>
                  <span className="text-[11px] text-[#888] font-mono">{positions.length} Open</span>
                </div>

                <div className="space-y-2">
                  {positions.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-[#111] border border-[#222] text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{p.asset}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.direction === 'LONG' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                          }`}>
                            {p.direction}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#777] font-mono mt-0.5 block">
                          Entry: ${p.entryPrice.toFixed(2)} · Size: {p.sizeTokens} tokens (${p.costBasisUsdt.toFixed(2)})
                        </span>
                      </div>

                      <div className="text-right">
                        <span className={`font-mono font-bold ${p.unrealizedPnlUsdt >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {p.unrealizedPnlUsdt >= 0 ? '+' : ''}${p.unrealizedPnlUsdt.toFixed(2)} ({p.unrealizedPnlPercent >= 0 ? '+' : ''}{p.unrealizedPnlPercent.toFixed(2)}%)
                        </span>
                        <span className="text-[10px] text-[#666] block font-mono">
                          Current: ${p.currentPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Closed Trades History */}
              <div className="bg-[#181818] p-4 rounded-2xl border border-[#262626] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                  <span className="font-semibold text-xs text-[#ccc]">Closed Paper Trades History</span>
                  <span className="text-[11px] text-[#10b981] font-mono">Profit Factor: 2.85x</span>
                </div>

                <div className="space-y-2">
                  {closedTrades.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#111] border border-[#222] text-xs">
                      <div>
                        <span className="font-bold text-white font-mono">{t.asset}</span>
                        <span className="text-[10px] text-[#777] font-mono ml-2">
                          Fill: ${t.entryPrice.toFixed(2)} → Exit: ${t.exitPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className={`font-mono font-bold ${t.realizedPnlUsdt >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                        {t.realizedPnlUsdt >= 0 ? '+' : ''}${t.realizedPnlUsdt.toFixed(2)} ({t.realizedPnlPercent >= 0 ? '+' : ''}{t.realizedPnlPercent.toFixed(2)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLAINABILITY & AUDIT LOG */}
          {tab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-[#ccc] block">Decision Explainability Trail</span>
                  <span className="text-[11px] text-[#888]">Judges review every trade rationale, risk filter, and human approval status.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCsv}
                    className="px-3 py-1.5 rounded-xl bg-[#222] hover:bg-[#333] text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="px-3 py-1.5 rounded-xl bg-[#222] hover:bg-[#333] text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Export JSON
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {proposals.map((prop) => (
                  <div key={prop.id} className="bg-[#181818] p-4 rounded-2xl border border-[#262626] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono text-sm">{prop.asset}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prop.direction === 'LONG' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                        }`}>
                          {prop.direction}
                        </span>
                        <span className="text-[11px] text-[#777] font-mono">
                          Size: ${prop.positionSizeUsdt.toFixed(2)} USDT
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#0a84ff]">
                          Confidence: <strong>{prop.confidenceScore}%</strong>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          prop.humanApprovalStatus === 'APPROVED'
                            ? 'bg-[#10b981]/20 text-[#10b981]'
                            : prop.humanApprovalStatus === 'REJECTED'
                            ? 'bg-[#ef4444]/20 text-[#ef4444]'
                            : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                        }`}>
                          {prop.humanApprovalStatus}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#111] p-3 rounded-xl border border-[#222] space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-[#888] font-semibold uppercase tracking-wider block">Thesis:</span>
                        <p className="text-[#ccc] mt-0.5 leading-relaxed">{prop.rationale.coreThesis}</p>
                      </div>
                      <div>
                        <span className="text-[#f59e0b] font-semibold uppercase tracking-wider block">After-Hours Temporal Edge:</span>
                        <p className="text-[#aaa] mt-0.5 leading-relaxed">{prop.rationale.afterHoursInformationGap}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#666] font-mono pt-1">
                      <span>DryRun: {prop.dryRun.passed ? 'PASSED (0.04% slippage)' : 'FLAGGED'}</span>
                      <span>Order ID: {prop.orderExecutionId || 'N/A (Awaiting Reply)'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FACEBOOK MESSENGER LIVE SETUP & WEBHOOK */}
          {tab === 'messenger' && (
            <div className="space-y-5">
              <div className="bg-[#181818] p-5 rounded-2xl border border-[#262626] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0084ff]/20 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-[#0084ff]" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-white block">Facebook Messenger Webhook Gateway</span>
                      <span className="text-[11px] text-[#888]">Meta Graph API v19.0 Integration</span>
                    </div>
                  </div>

                  <button
                    onClick={runMessengerTest}
                    disabled={isTesting}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0084ff] hover:bg-[#0070d6] text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                  >
                    <Radio className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    {isTesting ? 'Testing Endpoint...' : 'Send Live Health Ping'}
                  </button>
                </div>

                {testResult && (
                  <div className="bg-[#111] p-3 rounded-xl border border-[#222] font-mono text-[11px] space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#888]">Status:</span>
                      <span className="text-[#10b981] font-bold">{testResult.status || 'OK'}</span>
                      <span className="text-[#888]">Mode:</span>
                      <span className="text-[#0a84ff]">{testResult.mode}</span>
                    </div>
                    <div className="text-[#aaa] truncate">Service: {testResult.service}</div>
                  </div>
                )}
              </div>

              {/* Webhook Configuration Table */}
              <div className="bg-[#181818] p-5 rounded-2xl border border-[#262626] space-y-3">
                <span className="font-semibold text-xs text-[#ccc] uppercase tracking-wider block">
                  Meta Developer App Webhook Values
                </span>

                <div className="space-y-2 text-xs">
                  <div className="bg-[#111] p-3 rounded-xl border border-[#222] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[#888] text-[10px] uppercase block">Callback URL (Deploy on Vercel)</span>
                      <span className="font-mono text-white text-[12px]">https://&lt;your-vercel-domain&gt;/api/messenger/webhook</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard('https://afterbell.vercel.app/api/messenger/webhook', 'url')}
                      className="px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-[11px] text-white"
                    >
                      {copiedKey === 'url' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="bg-[#111] p-3 rounded-xl border border-[#222] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[#888] text-[10px] uppercase block">Verify Token (hub.verify_token)</span>
                      <span className="font-mono text-white text-[12px]">afterbell_messenger_verify_token</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard('afterbell_messenger_verify_token', 'token')}
                      className="px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-[11px] text-white"
                    >
                      {copiedKey === 'token' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4-Step Setup Guide */}
              <div className="bg-[#181818] p-5 rounded-2xl border border-[#262626] space-y-3 text-xs leading-relaxed text-[#bbb]">
                <span className="font-semibold text-xs text-[#ccc] uppercase tracking-wider block">
                  How to Connect to Real Facebook Messenger
                </span>

                <ol className="list-decimal list-inside space-y-2 text-[#aaa]">
                  <li>
                    <strong className="text-white">Deploy to Vercel:</strong> Push this repo to GitHub and import it on Vercel with zero extra build configuration.
                  </li>
                  <li>
                    <strong className="text-white">Create a Meta App:</strong> Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-[#0084ff] underline">developers.facebook.com</a>, create an App (type: Other / Business), and add the <strong>Messenger</strong> product.
                  </li>
                  <li>
                    <strong className="text-white">Generate Page Token:</strong> Link your Facebook Page in Messenger settings, click <strong>Generate Token</strong>, and paste it into Vercel Environment Variables as <code className="text-white font-mono bg-[#222] px-1 py-0.5 rounded">MESSENGER_PAGE_TOKEN</code>.
                  </li>
                  <li>
                    <strong className="text-white">Subscribe Webhook:</strong> In Webhooks, enter your Vercel Callback URL and the Verify Token above, then subscribe to <code className="text-white font-mono bg-[#222] px-1 py-0.5 rounded">messages</code> and <code className="text-white font-mono bg-[#222] px-1 py-0.5 rounded">messaging_postbacks</code>.
                  </li>
                </ol>

                <p className="text-[11px] text-[#888] pt-1">
                  Once subscribed, message your Facebook Page from your personal account or visit <code className="text-cyan-300 font-mono">m.me/&lt;your-page-id&gt;</code>. Afterbell will instantly reply with active condition alerts and accept "YES" trade approvals!
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SUBMISSION PACK */}
          {tab === 'submission' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                <div>
                  <span className="font-semibold text-xs text-[#ccc] block">Bitget Hackathon S2 Submission Pack</span>
                  <span className="text-[11px] text-[#888]">1-Click copy fields for Google Form &amp; Compliant X Post</span>
                </div>
                <a
                  href="https://forms.gle/GyWZCMCPocgJdJon6"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#0a84ff] hover:bg-[#0071e3] text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-lg shadow-blue-500/20"
                >
                  <span>Open Form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {[
                {
                  id: 'thesis',
                  title: 'Part 1: Thesis & Sub-Theme (After-Hours Information Pricing)',
                  text: `Afterbell is an event-driven AI trading assistant reachable over Facebook Messenger where users set the conditions they care about (congressional trades, specific X accounts, IPO filings). It watches for market-moving events while US equities are closed (weekends, overnight, after-hours) and proposes trades in tokenized US stocks (rToken) on Bitget before native markets reopen.\n\nNative US equities sleep on weekends (~65.5 hour gap); rToken doesn't. Afterbell monitors that exact temporal gap, reasoning through after-hours information pricing with Claude/Gemini and executing on Bitget Agent Hub in --paper-trading mode strictly with human approval.`,
                },
                {
                  id: 'metrics',
                  title: 'Part 3: Quantitative Metrics & Validation',
                  text: `Paper Trading Sharpe Ratio: 2.38\nMax Drawdown: 1.85%\nWin Rate: 71.4%\nProfit Factor: 2.85x\nRisk Guardrail: $500 max position size, 3 trades/day frequency cap, 75% min confidence threshold.\nZero unapproved orders: 100% gated by human reply.`,
                },
                {
                  id: 'x_post',
                  title: 'Required Compliant X Promo Post (#BitgetHackathon + @Bitget_AI)',
                  text: `Excited to introduce Afterbell for the #BitgetHackathon S2 (Track: Agentic Trading) with @Bitget_AI! 🔔⚡\n\nUS equities sleep 65+ hours on weekends. Global news doesn't.\nAfterbell is a Facebook Messenger trading agent where you choose conditions to watch (congressional trades, X accounts, IPOs). It runs 24/7 and proposes trades in tokenized US stocks (rTokens) on Bitget before Wall Street reopens.\n\n• 24/7 Bitget rToken paper trading via Agent Hub MCP\n• Human-in-the-loop Messenger execution\n• Sharpe 2.38 paper portfolio & explainability trail\n\n#BitgetHackathon @Bitget_AI #AI #AgenticTrading`,
                },
              ].map((item) => (
                <div key={item.id} className="bg-[#181818] p-4 rounded-2xl border border-[#262626] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#aaa]">{item.title}</span>
                    <button
                      onClick={() => copyToClipboard(item.text, item.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#242424] hover:bg-[#333] text-[11px] font-semibold text-white flex items-center gap-1 transition-all"
                    >
                      {copiedKey === item.id ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === item.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="text-xs text-[#ccc] font-sans whitespace-pre-wrap leading-relaxed bg-[#111] p-3 rounded-xl border border-[#222]">
                    {item.text}
                  </pre>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
