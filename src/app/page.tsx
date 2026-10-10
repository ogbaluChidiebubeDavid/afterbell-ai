'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  MessageCircle,
} from 'lucide-react';
import { MessengerFrame } from '@/components/messenger-frame';
import { ArtifactsModal } from '@/components/artifacts-modal';
import { PortfolioState } from '@/types/portfolio';
import { TradeProposal } from '@/types/proposals';

const DEFAULT_WHATSAPP_URL = 'https://wa.me/12018291736?text=MENU';

export default function LandingPage() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [proposals, setProposals] = useState<TradeProposal[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'portfolio' | 'audit' | 'submission' | 'messenger'>('portfolio');

  // Fetch portfolio and proposals data
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
      await fetch('/api/whatsapp/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: '12018291736', text }),
      });
      await loadData();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenWhatsApp = () => {
    window.open(DEFAULT_WHATSAPP_URL, '_blank', 'noopener,noreferrer');
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
              Exbit<span className="text-emerald-400 font-semibold">.ai</span>
            </span>
          </div>

          {/* Right: Direct WhatsApp Launch */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenWhatsApp}
              title="Open Exbit in WhatsApp"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#25D366] hover:bg-[#20ba59] text-black transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-black" />
              <span>Connect WhatsApp</span>
            </button>
          </div>
        </header>

        {/* Main Hero & Content Grid */}
        <main className="my-auto py-1 sm:py-2 flex items-center justify-center flex-1 relative z-10 overflow-visible">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-10 w-full">
            
            {/* Left Column: Clean Typography & Direct WhatsApp Launch */}
            <section className="max-w-[760px] space-y-4 sm:space-y-5">

              {/* Punchy Hero Typography */}
              <div className="space-y-1">
                <h1 className="text-[clamp(42px,5.8vw,80px)] font-semibold leading-[0.98] tracking-[-0.07em] text-[#eeeeeb]">
                  <span>Run trading</span>
                  <span className="block -mt-[0.14em]">agents from</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#25D366] to-teal-300">
                    WhatsApp
                  </span>
                </h1>
              </div>

              <p className="text-[clamp(14px,1.4vw,18px)] text-[#999] leading-[1.4] max-w-[500px]">
                Choose a strategy like tracking congressional trades, following specific X accounts, watching new IPO filings, or after-hours rToken pricing. You set the conditions, your agent runs around the clock and messages you on WhatsApp the moment it spots a signal.
              </p>

              {/* Strategic Primary CTA - Directly Opens WhatsApp */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleOpenWhatsApp}
                  className="px-6 py-3 rounded-full text-sm font-semibold bg-[#25D366] hover:bg-[#20ba59] text-black flex items-center gap-2.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer font-medium"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>Launch on WhatsApp</span>
                </button>
              </div>

            </section>

            {/* Right Column: Interactive Phone Simulator */}
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

      {/* Artifacts, Submission & Portfolio Modal */}
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
