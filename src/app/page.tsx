'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  ArrowUpRight,
  MessageCircle,
  Network,
  ShieldCheck,
  Award,
  Terminal,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { MessengerFrame } from '@/components/messenger-frame';
import { ContagionTerminal } from '@/components/contagion-terminal';
import { ArtifactsModal } from '@/components/artifacts-modal';
import { PortfolioState } from '@/types/portfolio';
import { TradeProposal } from '@/types/proposals';

const WHATSAPP_BOT_URL = 'https://wa.me/12018291736';
const WHATSAPP_DISPLAY_PHONE = '+1 201-829-1736';

export default function LandingPage() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [proposals, setProposals] = useState<TradeProposal[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [activeView, setActiveView] = useState<'terminal' | 'chat'>('terminal');

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

  const openWhatsApp = () => {
    window.open(WHATSAPP_BOT_URL, '_blank', 'noopener,noreferrer');
  };

  const openModal = (tab: 'portfolio' | 'audit' | 'submission' | 'messenger') => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#eeeeeb] flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      
      {/* Shell Container */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col min-h-screen justify-between gap-4">
        
        {/* 1. Header / Navbar */}
        <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md flex items-center justify-between gap-3 border-b border-[#1f1f26] pb-3 pt-1 shrink-0">
          
          {/* Left: Brand Identity & Hackathon Track */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-[#101014] rounded-[10px] flex items-center justify-center">
                <Bell className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                  Exbit<span className="text-emerald-400 font-semibold">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hidden sm:inline-block">
                  Bitget Track 1
                </span>
              </div>
              <p className="text-[11px] text-[#888] hidden md:block">
                Verifiable Conversational Trading via WhatsApp on Bitget rTokens
              </p>
            </div>
          </div>

          {/* Center: View Switcher (Terminal vs WhatsApp Chat) */}
          <div className="flex items-center bg-[#131318] p-1 rounded-xl border border-[#23232c] text-xs font-medium">
            <button
              onClick={() => setActiveView('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'terminal'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Contagion Terminal</span>
            </button>
            <button
              onClick={() => setActiveView('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'chat'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>WhatsApp Agent</span>
            </button>
          </div>

          {/* Right: Direct WhatsApp Launch & Artifacts */}
          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#25d366] hover:bg-[#20ba59] text-slate-950 transition-all shadow-md shadow-emerald-500/25 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">WhatsApp Bot</span>
              <span className="sm:hidden">Chat</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <button
              onClick={() => openModal('submission')}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Submission Pack</span>
            </button>
          </div>
        </header>

        {/* 2. Bold WhatsApp Connectivity Hero Callout Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#121218] to-cyan-950/40 border border-emerald-500/30 p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  Live on WhatsApp:
                  <a
                    href={WHATSAPP_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-mono"
                  >
                    {WHATSAPP_DISPLAY_PHONE}
                  </a>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  ● INSTANTLY REACHABLE
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                No app install or Meta review wall. Open WhatsApp, send commands like <span className="text-white font-mono font-semibold">"STATUS"</span>, <span className="text-white font-mono font-semibold">"SCAN"</span>, or an X handle like <span className="text-white font-mono font-semibold">"@sama"</span> to execute verifiable paper trades on Bitget.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0">
            <a
              href={WHATSAPP_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/25 active:scale-95"
            >
              <span>Open in WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => openModal('audit')}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#1a1a22] hover:bg-[#252530] border border-[#2e2e3a] transition-all"
            >
              Audit Trail
            </button>
          </div>
        </div>

        {/* 3. Main Body: Switchable between Contagion Terminal and WhatsApp Phone Frame */}
        <main className="flex-1 flex flex-col justify-center my-auto">
          {activeView === 'terminal' ? (
            /* Contagion Terminal View (Matches and Beats Cascadr) */
            <ContagionTerminal onOpenWhatsApp={openWhatsApp} />
          ) : (
            /* Conversational Mobile Simulator View */
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-10 w-full py-2">
              {/* Left Column: Clean Typography & WhatsApp Guide */}
              <section className="space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#14141a] border border-[#2b2b36] text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Verifiable Conversational Trading</span>
                  <span className="text-[#555]">•</span>
                  <span className="text-emerald-300">Powered by Kapso Cloud API</span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-[clamp(38px,5vw,72px)] font-bold leading-[1.0] tracking-[-0.06em] text-white">
                    <span>Trade after-hours</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                      directly on WhatsApp
                    </span>
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-[540px]">
                  When stock markets close for the weekend, information never stops. ExBit perception agents monitor regulatory filings, SEC Form 8-Ks, Congressional stock disclosures, and key accounts around the clock. The moment high-shock catalysts break, ExBit models price transmission against 24/7 Bitget rTokens and messages you directly on WhatsApp for human approval.
                </p>

                {/* Quick WhatsApp Command Guide Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-[620px]">
                  <div className="p-2.5 rounded-xl bg-[#14141a] border border-[#23232c]">
                    <span className="text-[10px] text-zinc-500 font-mono block">COMMAND</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">STATUS</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Live portfolio equity & Sharpe ratio</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#14141a] border border-[#23232c]">
                    <span className="text-[10px] text-zinc-500 font-mono block">COMMAND</span>
                    <span className="text-xs font-bold text-cyan-400 font-mono">SCAN</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Instant after-hours perception scan</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#14141a] border border-[#23232c]">
                    <span className="text-[10px] text-zinc-500 font-mono block">COMMAND</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">@sama</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Track any executive or analyst</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#14141a] border border-[#23232c]">
                    <span className="text-[10px] text-zinc-500 font-mono block">COMMAND</span>
                    <span className="text-xs font-bold text-white font-mono">YES / NO</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Approve paper order on Bitget</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={WHATSAPP_BOT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-full text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Open Live WhatsApp Bot (+1 201-829-1736)</span>
                  </a>

                  <button
                    onClick={() => setActiveView('terminal')}
                    className="px-5 py-3 rounded-full text-xs font-semibold bg-[#1a1a22] hover:bg-[#252530] text-zinc-200 border border-[#2c2c38] transition-all flex items-center gap-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Switch to Contagion Terminal</span>
                  </button>
                </div>
              </section>

              {/* Right Column: WhatsApp Phone Simulator Frame */}
              <div className="w-full flex items-start justify-center lg:justify-end pt-2 lg:pt-0">
                <MessengerFrame
                  onSendMessage={handleSendMessage}
                  isSending={isSending}
                />
              </div>
            </div>
          )}
        </main>

        {/* 4. Footer */}
        <footer className="border-t border-[#1c1c22] pt-2.5 pb-1 text-[10px] text-[#71717a] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <span>
            ExBit AI · Built for Bitget AI Base Camp Hackathon S2 (Track 1: Agentic Trading) · Verified on Bitget Isolated Paper Engine.
          </span>
          <div className="flex items-center gap-3 font-mono">
            <span>WHATSAPP: <span className="text-emerald-400 font-semibold">+1 201-829-1736</span></span>
            <span className="text-zinc-600">|</span>
            <button
              onClick={() => openModal('submission')}
              className="text-cyan-400 hover:underline"
            >
              View Submission Pack
            </button>
          </div>
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
