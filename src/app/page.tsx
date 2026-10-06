'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  ArrowUpRight,
  MessageCircle,
  ExternalLink,
  Smartphone,
  X,
  Check,
} from 'lucide-react';
import { MessengerFrame } from '@/components/messenger-frame';
import { ArtifactsModal } from '@/components/artifacts-modal';
import { PortfolioState } from '@/types/portfolio';
import { TradeProposal } from '@/types/proposals';

export default function LandingPage() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [proposals, setProposals] = useState<TradeProposal[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'portfolio' | 'audit' | 'submission' | 'messenger'>('messenger');

  // Page URL Direct Connect State
  const [isPagePromptOpen, setIsPagePromptOpen] = useState(false);
  const [customPageUrl, setCustomPageUrl] = useState('');

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
    const saved = localStorage.getItem('afterbell_page_url');
    if (saved) setCustomPageUrl(saved);
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

  const handleOpenMessenger = () => {
    const configuredUrl =
      process.env.NEXT_PUBLIC_MESSENGER_PAGE_URL ||
      localStorage.getItem('afterbell_page_url');

    if (configuredUrl && configuredUrl.trim()) {
      const trimmed = configuredUrl.trim();
      const targetUrl = trimmed.startsWith('http')
        ? trimmed
        : `https://m.me/${trimmed.replace(/^@/, '')}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      setIsPagePromptOpen(true);
    }
  };

  const handleSaveAndLaunchMessenger = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPageUrl.trim()) return;

    const trimmed = customPageUrl.trim();
    localStorage.setItem('afterbell_page_url', trimmed);
    const targetUrl = trimmed.startsWith('http')
      ? trimmed
      : `https://m.me/${trimmed.replace(/^@/, '')}`;

    setIsPagePromptOpen(false);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const openModal = (tab: 'portfolio' | 'audit' | 'submission' | 'messenger') => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen max-h-screen bg-[#101010] text-[#eeeeeb] flex flex-col justify-between overflow-y-auto lg:overflow-hidden selection:bg-[#eeeeeb] selection:text-[#111]">
      
      {/* Shell Container */}
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 flex flex-col h-full max-h-screen justify-between gap-4 lg:gap-6">
        
        {/* Masthead / Navbar */}
        <header className="sticky top-0 z-40 bg-[#101010] flex items-center justify-between gap-4 border-b border-[#242424] pb-4 pt-1 sm:pb-5 shrink-0">
          
          {/* Left: Brand Identity / Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#252528] to-[#151517] border border-[#38383c] flex items-center justify-center shadow-lg shadow-black/40 shrink-0">
              <Bell className="w-4 h-4 text-emerald-400" />
            </div>
            
            <span className="font-bold text-lg sm:text-xl tracking-tight text-[#eeeeeb]">
              Afterbell<span className="text-emerald-400 font-semibold">.ai</span>
            </span>
          </div>

          {/* Right: Direct Messenger Launch & GitHub Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenMessenger}
              title="Open Afterbell in Facebook Messenger"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0084ff] hover:bg-[#0070d6] text-white transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Connect Messenger</span>
            </button>

            <a
              href="https://github.com/ogbaluChidiebubeDavid/afterbell-ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#aaa] hover:text-[#eeeeeb] bg-[#161616] hover:bg-[#202020] border border-[#2b2b2b] hover:border-[#3a3a3a] transition-all cursor-pointer shadow-sm"
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
        <main className="my-auto py-1 sm:py-2 flex items-center justify-center flex-1 relative z-10 overflow-visible">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-10 w-full">
            
            {/* Left Column: Clean Typography & Direct Messenger Launch */}
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
                <h1 className="text-[clamp(42px,5.8vw,80px)] font-semibold leading-[0.98] tracking-[-0.07em] text-[#eeeeeb]">
                  <span>Run trading</span>
                  <span className="block -mt-[0.14em]">agents from</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0084ff] via-[#00c6ff] to-[#30d158]">
                    Messenger
                  </span>
                </h1>
              </div>

              <p className="text-[clamp(14px,1.4vw,18px)] text-[#999] leading-[1.4] max-w-[500px]">
                Choose a strategy like tracking congressional trades, following specific X accounts, watching new IPO filings, or after-hours rToken pricing. You set the conditions, your agent runs around the clock and messages you on Facebook Messenger the moment it spots a signal.
              </p>

              {/* Strategic Primary CTA - Directly Opens Messenger Chatbox */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleOpenMessenger}
                  className="px-6 py-3 rounded-full text-sm font-semibold bg-[#0084ff] hover:bg-[#0070d6] text-white flex items-center gap-2.5 shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Launch on Facebook Messenger</span>
                </button>

                <button
                  onClick={() => openModal('messenger')}
                  className="px-4 py-2.5 rounded-full text-xs font-medium text-[#888] hover:text-[#ccc] bg-[#161616] hover:bg-[#202020] border border-[#262626] transition-all cursor-pointer"
                >
                  Webhook Settings
                </button>
              </div>

            </section>

            {/* Right Column: Messenger Frame — Interactive Simulator */}
            <div className="w-full flex items-start justify-center lg:justify-end pt-4 lg:pt-0">
              <MessengerFrame
                onSendMessage={handleSendMessage}
                isSending={isSending}
              />
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#222] pt-3 pb-1 text-[10px] text-[#666] leading-[1.4] shrink-0">
          <span>
            For informational purposes only; not investment advice or a recommendation. Trading involves substantial risk, including the potential loss of your entire investment. AI agents may make mistakes or fail. You direct all agent activity and assume all risk for transactions your agents execute. Built for Bitget AI Base Camp Hackathon S2 (Track: Agentic Trading, Sub-Theme: Event-Driven Agent / After-Hours Information Pricing).
          </span>
        </footer>

      </div>

      {/* Direct Messenger Chatbox Link Prompt Modal */}
      {isPagePromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#161618] border border-[#2d2d30] rounded-3xl p-6 shadow-2xl text-[#eeeeeb] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#242426]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0084ff]/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-[#0084ff]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Open in Facebook Messenger</h3>
                  <p className="text-[11px] text-[#888]">Direct link to your trading assistant bot</p>
                </div>
              </div>
              <button
                onClick={() => setIsPagePromptOpen(false)}
                className="w-7 h-7 rounded-full bg-[#222] hover:bg-[#333] flex items-center justify-center text-[#999] hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSaveAndLaunchMessenger} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-[#aaa] block mb-1">
                  Facebook Page Username or Link:
                </label>
                <div className="flex items-center bg-[#101010] rounded-xl border border-[#333] px-3 py-2 text-xs">
                  <span className="text-[#666] mr-1">m.me/</span>
                  <input
                    type="text"
                    value={customPageUrl.replace(/^https?:\/\/m\.me\//, '').replace(/^@/, '')}
                    onChange={(e) => setCustomPageUrl(e.target.value)}
                    placeholder="your-page-username"
                    className="flex-1 bg-transparent text-white focus:outline-none font-mono"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-[#666] mt-1">
                  Found in your Facebook Page URL or Meta Dashboard (e.g. <code>AfterbellAI</code>).
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!customPageUrl.trim()}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#0084ff] hover:bg-[#0070d6] text-white flex items-center justify-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Messenger Chatbox</span>
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-[#222] flex items-center justify-between text-[11px] text-[#888]">
              <span>Prefer testing on this page?</span>
              <button
                onClick={() => setIsPagePromptOpen(false)}
                className="text-[#0084ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Smartphone className="w-3 h-3" />
                Use Web Simulator →
              </button>
            </div>
          </div>
        </div>
      )}

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
