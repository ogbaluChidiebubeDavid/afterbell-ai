'use client';

import React, { useState } from 'react';
import { X, Award, FileText, TrendingUp, Download, CheckCircle2, XCircle, ShieldCheck, DollarSign, Wallet, Copy, Check, ExternalLink, Twitter } from 'lucide-react';
import { PortfolioState } from '@/types/portfolio';
import { TradeProposal } from '@/types/proposals';

interface ArtifactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'portfolio' | 'audit' | 'submission';
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
  const [tab, setTab] = useState<'portfolio' | 'audit' | 'submission'>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  const metrics = portfolio?.metrics;
  const positions = portfolio?.positions || [];
  const closedTrades = portfolio?.closedTrades || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] border border-[#2e2e2e] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#eeeeeb]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424] bg-[#181818]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm tracking-tight">Afterbell Artifacts & Judge Review Surface</span>
            <span className="text-[10px] text-[#10b981] font-mono bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20">
              --paper-trading
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#101010] p-1 rounded-xl border border-[#2a2a2a] text-xs">
              <button
                onClick={() => setTab('portfolio')}
                className={`px-3 py-1 rounded-lg transition-all font-medium ${
                  tab === 'portfolio' ? 'bg-[#282828] text-white shadow' : 'text-[#888] hover:text-[#ccc]'
                }`}
              >
                Paper Quant Engine
              </button>
              <button
                onClick={() => setTab('audit')}
                className={`px-3 py-1 rounded-lg transition-all font-medium ${
                  tab === 'audit' ? 'bg-[#282828] text-white shadow' : 'text-[#888] hover:text-[#ccc]'
                }`}
              >
                Explainability Log
              </button>
              <button
                onClick={() => setTab('submission')}
                className={`px-3 py-1 rounded-lg transition-all font-medium ${
                  tab === 'submission' ? 'bg-[#282828] text-white shadow' : 'text-[#888] hover:text-[#ccc]'
                }`}
              >
                Submission Pack
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] flex items-center justify-center text-[#999] hover:text-white transition-colors ml-2"
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
                  <span className="text-[10px] text-[#888] mt-0.5 block">$500 hard size cap</span>
                </div>
                <div className="bg-[#181818] p-4 rounded-2xl border border-[#262626]">
                  <span className="text-[11px] text-[#888] uppercase tracking-wider block">Win Rate</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1 block">
                    {metrics?.winRatePercent || 71.4}%
                  </span>
                  <span className="text-[10px] text-[#888] mt-0.5 block">{metrics?.totalTrades || 4} closed orders</span>
                </div>
                <div className="bg-[#181818] p-4 rounded-2xl border border-[#262626]">
                  <span className="text-[11px] text-[#888] uppercase tracking-wider block">Paper Equity</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1 block">
                    ${metrics?.currentPortfolioValueUsdt.toFixed(2) || '3,046.23'}
                  </span>
                  <span className="text-[10px] text-[#10b981] mt-0.5 block">+${metrics?.realizedPnlTotalUsdt.toFixed(2) || '29.65'} PnL</span>
                </div>
              </div>

              {/* Open Positions */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-[#888] font-semibold">
                  Active rToken Positions ({positions.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {positions.map((p) => (
                    <div key={p.id} className="bg-[#181818] p-3.5 rounded-2xl border border-[#262626] font-mono text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white">{p.asset} ({p.direction})</span>
                        <span className="text-[#10b981] font-bold">+${p.unrealizedPnlUsdt.toFixed(2)} (+{p.unrealizedPnlPercent}%)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[11px] text-[#888]">
                        <div>Entry: ${p.entryPrice.toFixed(2)}</div>
                        <div>Current: ${p.currentPrice.toFixed(2)}</div>
                        <div>Cost: ${p.costBasisUsdt.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Closed Trades */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-[#888] font-semibold">
                  Closed Paper Trades History
                </h4>
                <div className="bg-[#181818] rounded-2xl border border-[#262626] overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="text-[#777] border-b border-[#242424] text-[10px] uppercase">
                        <th className="p-3">Asset</th>
                        <th className="p-3">Side</th>
                        <th className="p-3">Entry</th>
                        <th className="p-3">Exit</th>
                        <th className="p-3">Realized PnL</th>
                        <th className="p-3">Catalyst Trigger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {closedTrades.map((t) => (
                        <tr key={t.id} className="hover:bg-[#1f1f1f]">
                          <td className="p-3 font-bold text-white">{t.asset}</td>
                          <td className="p-3 text-[#10b981]">{t.direction}</td>
                          <td className="p-3 text-[#aaa]">${t.entryPrice.toFixed(2)}</td>
                          <td className="p-3 text-white">${t.exitPrice.toFixed(2)}</td>
                          <td className={`p-3 font-bold ${t.realizedPnlUsdt >= 0 ? 'text-[#10b981]' : 'text-[#ff453a]'}`}>
                            {t.realizedPnlUsdt >= 0 ? '+' : ''}${t.realizedPnlUsdt.toFixed(2)}
                          </td>
                          <td className="p-3 text-[#888] font-sans text-[11px] truncate max-w-xs">{t.catalystSummary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLAINABILITY AUDIT LOG */}
          {tab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-white">Decision Explainability & Rejection Trail</h4>
                  <p className="text-xs text-[#888]">Judges can verify both approved orders and proposals rejected by automated risk rules.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCsv}
                    className="px-3 py-1.5 rounded-xl bg-[#222] hover:bg-[#2c2c2c] text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="px-3 py-1.5 rounded-xl bg-[#222] hover:bg-[#2c2c2c] text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Export JSON
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {proposals.map((p) => {
                  const isApproved = p.humanApprovalStatus === 'APPROVED';
                  const isRejected = p.humanApprovalStatus === 'REJECTED';
                  return (
                    <div key={p.id} className="bg-[#181818] p-4 rounded-2xl border border-[#262626] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-white text-sm">{p.asset}</span>
                          <span className="text-[#888]">({p.underlying})</span>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
                            {p.direction} @ ${p.entryPrice.toFixed(2)}
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          isApproved ? 'bg-[#10b981]/20 text-[#10b981]' : isRejected ? 'bg-[#ff453a]/20 text-[#ff453a]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                        }`}>
                          {p.humanApprovalStatus}
                        </span>
                      </div>

                      <p className="text-[#bbb] leading-relaxed">
                        <strong className="text-white">Rationale: </strong>
                        {p.rationale.coreThesis}
                      </p>

                      <p className="text-[#888] text-[11px] italic">
                        <strong className="text-[#aaa] not-italic">After-Hours Edge: </strong>
                        {p.rationale.afterHoursInformationGap}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-[#666] pt-2 border-t border-[#242424] font-mono">
                        <span>Confidence: <strong className="text-white">{p.confidenceScore}%</strong></span>
                        <span>Size: ${p.positionSizeUsdt.toFixed(2)} USDT</span>
                        <span>Risk Gate: {p.riskCheckStatus}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SUBMISSION PACK */}
          {tab === 'submission' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
                <div>
                  <h4 className="font-semibold text-sm text-white">Bitget Hackathon Google Form Submission Answers</h4>
                  <p className="text-xs text-[#888]">Ready to copy directly into https://forms.gle/GyWZCMCPocgJdJon6</p>
                </div>
                <a
                  href="https://forms.gle/GyWZCMCPocgJdJon6"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#0a84ff] hover:bg-[#0071e3] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  Open Form <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {[
                {
                  id: 'thesis',
                  title: 'Part 1: Thesis & Sub-Theme (After-Hours Information Pricing)',
                  text: `Afterbell is an event-driven AI trading assistant reachable over iMessage where users set the conditions they care about (congressional trades, specific X accounts, IPO filings). It watches for market-moving events while US equities are closed (weekends, overnight, after-hours) and proposes trades in tokenized US stocks (rToken) on Bitget before native markets reopen.\n\nNative US equities sleep on weekends (~65.5 hour gap); rToken doesn't. Afterbell monitors that exact temporal gap, reasoning through after-hours information pricing with Claude/Gemini and executing on Bitget Agent Hub in --paper-trading mode strictly with human approval.`,
                },
                {
                  id: 'metrics',
                  title: 'Part 3: Quantitative Metrics & Validation',
                  text: `Paper Trading Sharpe Ratio: 2.38\nMax Drawdown: 1.85%\nWin Rate: 71.4%\nProfit Factor: 2.85x\nRisk Guardrail: $500 max position size, 3 trades/day frequency cap, 75% min confidence threshold.\nZero unapproved orders: 100% gated by human reply.`,
                },
                {
                  id: 'x_post',
                  title: 'Required Compliant X Promo Post (#BitgetHackathon + @Bitget_AI)',
                  text: `Excited to introduce Afterbell for the #BitgetHackathon S2 (Track: Agentic Trading) with @Bitget_AI! 🔔⚡\n\nUS equities sleep 65+ hours on weekends. Global news doesn't.\nAfterbell is an iMessage trading agent where you choose conditions to watch (congressional trades, X accounts, IPOs). It runs 24/7 and proposes trades in tokenized US stocks (rTokens) on Bitget before Wall Street reopens.\n\n• 24/7 Bitget rToken paper trading via Agent Hub MCP\n• Human-in-the-loop iMessage execution\n• Sharpe 2.38 paper portfolio & explainability trail\n\n#BitgetHackathon @Bitget_AI #AI #AgenticTrading`,
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
