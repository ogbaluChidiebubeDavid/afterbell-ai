'use client';

import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Bell,
  ArrowUpRight,
  MessageCircle,
  Award,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { IPhoneFrame, AUTOMATED_SCENARIOS } from '@/components/iphone-frame';
import { ArtifactsModal } from '@/components/artifacts-modal';
import { PortfolioState } from '@/types/portfolio';
import { TradeProposal } from '@/types/proposals';

export default function LandingPage() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [proposals, setProposals] = useState<TradeProposal[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'portfolio' | 'audit' | 'submission' | 'messenger'>('portfolio');
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);

  // Fetch portfolio and proposals data for the modal
  const loadData = async () => {
    try {
      const [portRes, propRes] = await Promise.all([
        fetch('/api/portfolio').then((r) => r.json()),
        fetch('/api/proposals').then((r) => r.json()),
      ]);

      if (portRes.success) setPortfolio(portRes.data.portfolio);
      if (propRes.success) setProposals(propRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (text: string) => {
    setIsSending(true);
    try {
      await fetch('/api/messenger/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sender: 'USER' }),
      });
      await loadData();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const copyPromptText = () => {
    navigator.clipboard.writeText('Read https://afterbell.vercel.app/skill & help me launch my own agent.');
    setHasCopiedPrompt(true);
    setTimeout(() => setHasCopiedPrompt(false), 2000);
  };

  const openModal = (tab: 'portfolio' | 'audit' | 'submission' | 'messenger') => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#eeeeeb] flex flex-col justify-between selection:bg-[#eeeeeb] selection:text-[#111]">
      
      {/* Shell Container */}
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col min-h-screen justify-between gap-4">
        
        {/* Masthead / Navbar */}
        <header className="sticky top-0 z-40 bg-[#101010]/95 backdrop-blur-md flex items-center justify-between gap-3 border-b border-[#242424] pb-3 pt-2 shrink-0">
          
          {/* Left: Brand Identity & Live Mode Pill */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#252528] to-[#151517] border border-[#38383c] flex items-center justify-center shadow-lg shadow-black/40 shrink-0">
              <Bell className="w-4 h-4 text-emerald-400" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-[#eeeeeb]">
                Afterbell<span className="text-emerald-400 font-semibold">.ai</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Bitget Hub • --paper-trading
              </span>
            </div>
          </div>

          {/* Right Strategic Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Primary CTA: Launch / Connect Messenger */}
            <button
              onClick={() => openModal('messenger')}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0084ff] hover:bg-[#0070d6] text-white transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Connect Messenger</span>
            </button>

            {/* Secondary CTA: Judge Review & Artifacts */}
            <button
              onClick={() => openModal('portfolio')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#ccc] hover:text-white bg-[#191919] hover:bg-[#222] border border-[#303030] transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Sharpe 2.38 Pack</span>
            </button>

            {/* GitHub Button */}
            <a
              href="https://github.com/BitgetLimited/agent_hub"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#aaa] hover:text-[#eeeeeb] bg-[#161616] hover:bg-[#202020] border border-[#2b2b2b] hover:border-[#3a3a3a] transition-all cursor-pointer shadow-sm"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.28-.36 6.72-1.61 6.72-7.25A5.65 5.65 0 0 0 19.22 3.3 5.4 5.4 0 0 0 19.08 1S17.9.65 15 2.48a13.38 13.38 0 0 0-7 0C5.1.65 3.92 1 3.92 1a5.4 5.4 0 0 0-.14 2.3A5.65 5.65 0 0 0 2.28 7.25c0 5.63 3.44 6.88 6.72 7.25A4.8 4.8 0 0 0 8 18v4"></path>
                <path d="M8 19c-3 .9-3-1.5-4-2"></path>
              </svg>
              <span className="hidden sm:inline">GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-[#666]" />
            </a>
          </div>
        </header>

        {/* Main Hero & Content Grid */}
        <main className="my-auto py-2 sm:py-4 flex items-center justify-center flex-1 relative z-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-10 w-full">
            
            {/* Left Column: Messaging & Strategy Conditions */}
            <section className="max-w-[760px] space-y-4 sm:space-y-5">
              
              {/* Track Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#1a1a1a] border border-[#2d2d2d] text-[#aaa]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Bitget AI Base Camp S2</span>
                <span className="text-[#555]">•</span>
                <span className="text-emerald-300">Agentic Trading Track</span>
              </div>

              {/* Punchy Hero Typography */}
              <div className="space-y-1">
                <h1 className="text-[clamp(38px,5.2vw,72px)] font-semibold leading-[0.98] tracking-[-0.06em] text-[#eeeeeb]">
                  <span>Run trading</span>
                  <span className="block -mt-[0.1em]">agents from</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0084ff] via-[#00c6ff] to-[#30d158]">
                    Messenger
                  </span>
                </h1>
              </div>

              <p className="text-[clamp(14px,1.35vw,17px)] text-[#999] leading-[1.45] max-w-[540px]">
                Exploit the ~65.5-hour weekend and overnight window when Wall Street is closed.
                You set the conditions to watch — Congressional trades, named X accounts via Monid,
                IPO filings, or after-hours rTokens. When a catalyst strikes, Afterbell reasons
                through the information pricing and messages you for one-tap execution.
              </p>

              {/* Interactive Strategy Selector Pills (Changes scenario on the Phone) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[11px] text-[#777] font-mono uppercase tracking-wider">
                  <span>Watched Strategy Conditions:</span>
                  <span className="text-cyan-400">Tap to preview on phone →</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AUTOMATED_SCENARIOS.map((sc, idx) => (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedScenarioIndex(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedScenarioIndex === idx
                          ? 'bg-[#1e1e24] border-[#0084ff] text-white shadow-lg shadow-blue-500/10'
                          : 'bg-[#151515] border-[#262626] text-[#888] hover:text-[#ccc] hover:border-[#383838]'
                      }`}
                    >
                      <span className="block text-[11px] font-semibold truncate text-[#eee]">
                        {idx === 0 && '🏛️ '}
                        {idx === 1 && '𝕏 '}
                        {idx === 2 && '📑 '}
                        {idx === 3 && '⚡ '}
                        {sc.name}
                      </span>
                      <span className="block text-[9px] text-[#666] font-mono truncate mt-0.5">
                        {sc.categoryTag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Strategic CTA Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openModal('messenger')}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0084ff] hover:bg-[#0070d6] text-white flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Launch on Facebook Messenger</span>
                </button>

                <button
                  onClick={() => openModal('audit')}
                  className="px-4 py-2.5 rounded-full text-xs font-medium bg-[#1c1c1e] hover:bg-[#27272a] text-[#ccc] hover:text-white border border-[#333] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>View Explainability Trail</span>
                </button>

                <button
                  onClick={() => openModal('submission')}
                  className="px-4 py-2.5 rounded-full text-xs font-medium bg-[#1c1c1e] hover:bg-[#27272a] text-[#ccc] hover:text-white border border-[#333] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Submission Pack</span>
                </button>
              </div>

              {/* Copy Prompt Block (Adaam 1:1 Clean Design) */}
              <section className="w-full max-w-[540px] pt-2" aria-labelledby="prompt-label">
                <div className="border border-[#3b3b3b] bg-[#181818] rounded-[24px] grid grid-cols-[minmax(0,1fr)_44px] items-center gap-2 p-[7px] shadow-[0_16px_38px_rgba(0,0,0,0.18)]">
                  <p className="font-mono text-[clamp(12px,1.1vw,14px)] text-[#eeeeeb] px-3.5 truncate tracking-[-0.03em] m-0">
                    Read https://afterbell.vercel.app/skill &amp; help me launch my own agent.
                  </p>
                  <button
                    onClick={copyPromptText}
                    aria-label="Copy prompt"
                    title="Copy prompt"
                    type="button"
                    className="w-[44px] h-[44px] rounded-full bg-[#eeeeeb] hover:bg-[#cfcfcb] active:scale-95 text-[#111] flex items-center justify-center transition-all cursor-pointer border-0"
                  >
                    {hasCopiedPrompt ? (
                      <Check className="w-4 h-4 text-[#10b981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p id="prompt-label" className="text-[#888] text-[11px] mt-2 ml-3 tracking-[-0.01em]">
                  Paste into your coding agent (Claude Code, Cursor, Codex) to clone &amp; deploy.
                </p>
              </section>

            </section>

            {/* Right Column: Phone mockup — top-aligned, reactive to selected strategy */}
            <div className="w-full flex items-start justify-center lg:justify-end pt-2 lg:pt-0">
              <IPhoneFrame
                onSendMessage={handleSendMessage}
                isSending={isSending}
                selectedScenarioIndex={selectedScenarioIndex}
                onSelectScenario={setSelectedScenarioIndex}
              />
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#222] pt-3 pb-2 text-[10px] text-[#666] leading-[1.4] shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            For informational purposes only; not investment advice. Strict <code className="text-[#888]">--paper-trading</code> mode via Bitget Agent Hub MCP with isolated fund account and human approval gate.
          </span>
          <div className="flex items-center gap-3 shrink-0 text-[#888]">
            <a href="/skill" className="hover:text-white underline">/skill</a>
            <span>•</span>
            <button onClick={() => openModal('messenger')} className="hover:text-[#0084ff] cursor-pointer">
              Messenger Webhook
            </button>
            <span>•</span>
            <button onClick={() => openModal('portfolio')} className="hover:text-white cursor-pointer">
              Sharpe: {portfolio?.metrics.sharpeRatio || '2.38'}
            </button>
          </div>
        </footer>

      </div>

      {/* Artifacts, Submission & Messenger Modal */}
      <ArtifactsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
        portfolio={portfolio}
        proposals={proposals}
      />

    </div>
  );
}
