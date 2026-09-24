'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { IPhoneFrame } from '@/components/iphone-frame';
import { StrategySelector } from '@/components/strategy-selector';
import { ArtifactsModal } from '@/components/artifacts-modal';
import { StrategyModule, StrategyModuleService } from '@/services/strategy-modules';
import { IMessageChatEntry } from '@/services/photon-client';
import { PortfolioState } from '@/types/portfolio';
import { TradeProposal } from '@/types/proposals';

export default function LandingPage() {
  const [modules, setModules] = useState<StrategyModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<StrategyModule | null>(null);
  const [chatHistory, setChatHistory] = useState<IMessageChatEntry[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [proposals, setProposals] = useState<TradeProposal[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'portfolio' | 'audit' | 'submission'>('portfolio');
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);

  // Fetch initial data
  const loadData = async () => {
    try {
      const [modRes, chatRes, portRes, propRes] = await Promise.all([
        fetch('/api/strategies').then(r => r.json()),
        fetch('/api/imessage/send').then(r => r.json()),
        fetch('/api/portfolio').then(r => r.json()),
        fetch('/api/proposals').then(r => r.json()),
      ]);

      if (modRes.success) {
        setModules(modRes.data);
        if (!selectedModule && modRes.data.length > 0) {
          setSelectedModule(modRes.data[0]);
        }
      }
      if (chatRes.success) setChatHistory(chatRes.data);
      if (portRes.success) setPortfolio(portRes.data.portfolio);
      if (propRes.success) setProposals(propRes.data);
    } catch (err) {
      console.error('Failed to load landing data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectModule = (mod: StrategyModule) => {
    setSelectedModule(mod);
    // Simulate event triggered from this module into iMessage
    handleTriggerModuleEvent(mod);
  };

  const handleToggleModule = async (id: string) => {
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setModules(prev => prev.map(m => m.id === id ? data.data : m));
      }
    } catch (err) {
      console.error('Failed to toggle module:', err);
    }
  };

  const handleTriggerModuleEvent = async (mod: StrategyModule) => {
    try {
      await fetch('/api/signals/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mod.sampleTriggerEvent.title,
          summary: mod.sampleTriggerEvent.summary,
          relevantTickers: [mod.sampleTriggerEvent.ticker],
          urgency: 'HIGH',
          sentiment: mod.sampleTriggerEvent.sentiment,
          confidenceScore: mod.sampleTriggerEvent.confidence,
          sourceSkill: mod.bitgetSkillContext,
        }),
      });
      await loadData();
    } catch (err) {
      console.error('Error triggering module signal:', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    setIsSending(true);
    try {
      await fetch('/api/imessage/webhook', {
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

  const openModal = (tab: 'portfolio' | 'audit' | 'submission') => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#eeeeeb] flex flex-col justify-between selection:bg-[#eeeeeb] selection:text-[#111]">
      
      {/* Shell Container */}
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 py-6 sm:py-8 flex flex-col min-h-screen justify-between gap-12">
        
        {/* Masthead */}
        <header className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-[#999] border-b border-[#222] pb-5">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base tracking-[-0.03em] text-[#eeeeeb] uppercase">
              Afterbell
            </span>
            <span className="text-[#666] hidden sm:inline">•</span>
            <span className="text-[#999] hidden sm:inline font-mono">
              Bitget S2 • Agentic Trading
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => openModal('portfolio')}
              className="hover:text-[#eeeeeb] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <span>Paper P&L</span>
              <span className="text-[#10b981] font-mono lowercase text-[10px] bg-[#10b981]/10 px-1.5 py-0.5 rounded">
                sharpe 2.38
              </span>
            </button>

            <button
              onClick={() => openModal('audit')}
              className="hover:text-[#eeeeeb] transition-colors cursor-pointer font-medium hidden sm:inline"
            >
              Explainability Log
            </button>

            <button
              onClick={() => openModal('submission')}
              className="hover:text-[#eeeeeb] transition-colors cursor-pointer font-medium text-[#0a84ff]"
            >
              Submission Pack
            </button>

            <a
              href="https://github.com/BitgetLimited/agent_hub"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#eeeeeb] transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.28-.36 6.72-1.61 6.72-7.25A5.65 5.65 0 0 0 19.22 3.3 5.4 5.4 0 0 0 19.08 1S17.9.65 15 2.48a13.38 13.38 0 0 0-7 0C5.1.65 3.92 1 3.92 1a5.4 5.4 0 0 0-.14 2.3A5.65 5.65 0 0 0 2.28 7.25c0 5.63 3.44 6.88 6.72 7.25A4.8 4.8 0 0 0 8 18v4"></path>
                <path d="M8 19c-3 .9-3-1.5-4-2"></path>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </header>

        {/* Main Content Grid (Adaam 1:1 Layout) */}
        <main className="my-auto py-4 sm:py-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-10">
            
            {/* Left Column: Intro & Interactive Strategy Modules */}
            <section className="max-w-[760px] space-y-6">
              
              <div className="space-y-1">
                <p className="text-[#999] uppercase tracking-[0.12em] text-[11px] font-bold">
                  Bitget AI Base Camp S2 • Track: Agentic Trading
                </p>
                <h1 className="text-[clamp(46px,7.5vw,92px)] font-semibold leading-[0.98] tracking-[-0.07em] text-[#eeeeeb]">
                  <span>Run trading</span>
                  <span className="block -mt-[0.14em]">agents from</span>
                  <span>iMessage</span>
                </h1>
              </div>

              <p className="text-[clamp(15px,2vw,19px)] text-[#999] leading-[1.45] max-w-[540px]">
                Choose a strategy like tracking congressional trades, following specific X accounts, watching new IPO filings, or after-hours rToken pricing. You set the conditions, your agent runs around the clock and texts you the moment it spots a signal.
              </p>

              {/* User-Configured Strategy Modules Component */}
              {selectedModule && (
                <StrategySelector
                  modules={modules}
                  selectedModule={selectedModule}
                  onSelectModule={handleSelectModule}
                  onToggleModule={handleToggleModule}
                />
              )}

              {/* Copy Prompt Block (Adaam 1:1 Design) */}
              <section className="w-full max-w-[580px] pt-2" aria-labelledby="prompt-label">
                <div className="border border-[#3b3b3b] bg-[#181818] rounded-[26px] grid grid-cols-[minmax(0,1fr)_46px] items-center gap-2 p-[9px] shadow-[0_16px_38px_rgba(0,0,0,0.18)]">
                  <p className="font-mono text-[clamp(13px,1.15vw,15px)] text-[#eeeeeb] px-4 truncate tracking-[-0.03em] m-0">
                    Read https://afterbell.vercel.app/skill &amp; help me launch my own agent.
                  </p>
                  <button
                    onClick={copyPromptText}
                    aria-label="Copy prompt"
                    title="Copy prompt"
                    type="button"
                    className="w-[46px] h-[46px] rounded-full bg-[#eeeeeb] hover:bg-[#cfcfcb] active:scale-95 text-[#111] flex items-center justify-center transition-all cursor-pointer border-0"
                  >
                    {hasCopiedPrompt ? (
                      <Check className="w-4 h-4 text-[#10b981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p id="prompt-label" className="text-[#999] text-xs mt-2.5 ml-3 tracking-[-0.01em]">
                  Paste into your coding agent (Claude Code, Cursor, Codex)
                </p>
              </section>

              {/* Quick Status Pill */}
              <div className="flex items-center gap-4 text-xs text-[#888] pt-1">
                <span className="flex items-center gap-1.5 text-[#10b981] font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                  Bitget Agent Hub MCP: Connected (--paper-trading)
                </span>
                <span className="text-[#555]">•</span>
                <span>Max $500 size limit</span>
                <span className="text-[#555]">•</span>
                <span>100% Human approval gated</span>
              </div>

            </section>

            {/* Right Column: 3D iPhone Device with Live iMessage */}
            <div className="w-full flex items-center justify-center lg:justify-end">
              {selectedModule && (
                <IPhoneFrame
                  chatHistory={chatHistory}
                  onSendMessage={handleSendMessage}
                  isSending={isSending}
                  selectedStrategy={selectedModule}
                  onSelectStrategy={handleSelectModule}
                />
              )}
            </div>

          </div>
        </main>

        {/* Footer (Adaam 1:1 Design) */}
        <footer className="border-t border-[#222] pt-6 pb-2 text-[11px] text-[#777] leading-[1.5]">
          <span>
            For informational purposes only; not investment advice or a recommendation. Trading involves substantial risk, including the potential loss of your entire investment. AI agents may make mistakes or fail. You direct all agent activity and assume all risk for transactions your agents execute, as well as for any use of your data by third-party AI providers. Built for Bitget AI Base Camp Hackathon S2 (Track: Agentic Trading, Sub-Theme: Event-Driven Agent / After-Hours Information Pricing).
          </span>
        </footer>

      </div>

      {/* Artifacts & Submission Modal */}
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
