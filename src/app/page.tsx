'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { WatchlistTicker } from '@/components/watchlist-ticker';
import { MetricsBar } from '@/components/metrics-bar';
import { MarketClockWidget } from '@/components/market-clock-widget';
import { PerceptionFeed } from '@/components/perception-feed';
import { ProposalCard } from '@/components/proposal-card';
import { IMessageSimulator } from '@/components/imessage-simulator';
import { PortfolioView } from '@/components/portfolio-view';
import { AuditLogTable } from '@/components/audit-log-table';
import { SubmissionPack } from '@/components/submission-pack';

import { USMarketState } from '@/services/market-clock';
import { MarketCatalyst } from '@/types/signals';
import { TradeProposal } from '@/types/proposals';
import { PortfolioState } from '@/types/portfolio';
import { IMessageChatEntry } from '@/services/photon-client';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'audit' | 'submission'>('dashboard');
  const [marketState, setMarketState] = useState<USMarketState | null>(null);
  const [catalysts, setCatalysts] = useState<MarketCatalyst[]>([]);
  const [proposals, setProposals] = useState<TradeProposal[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [chatHistory, setChatHistory] = useState<IMessageChatEntry[]>([]);
  
  const [isTriggering, setIsTriggering] = useState(false);
  const [isProcessingProposal, setIsProcessingProposal] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Initial data fetch
  const fetchData = async () => {
    try {
      const [mRes, sRes, pRes, portRes, cRes] = await Promise.all([
        fetch('/api/market-status').then(r => r.json()),
        fetch('/api/signals').then(r => r.json()),
        fetch('/api/proposals').then(r => r.json()),
        fetch('/api/portfolio').then(r => r.json()),
        fetch('/api/imessage/send').then(r => r.json()),
      ]);

      if (mRes.success) setMarketState(mRes.data);
      if (sRes.success) setCatalysts(sRes.data);
      if (pRes.success) setProposals(pRes.data);
      if (portRes.success) setPortfolio(portRes.data.portfolio);
      if (cRes.success) setChatHistory(cRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Trigger custom catalyst
  const handleTriggerCatalyst = async (presetKey: string) => {
    setIsTriggering(true);
    try {
      let payload = {};
      if (presetKey === 'nvda_chips') {
        payload = {
          title: 'US Commerce Dept Issues Weekend Clarification on High-Density AI Accelerators',
          summary: 'Sunday evening: Commerce Dept clarifies export licensing rules for Blackwell architecture chips to tier-2 cloud providers in Middle East, removing blanket ban overhang.',
          relevantTickers: ['rNVDA'],
          urgency: 'HIGH',
          sentiment: 'BULLISH',
          confidenceScore: 89,
          sourceSkill: 'news-briefing',
        };
      } else if (presetKey === 'tsla_fsd') {
        payload = {
          title: 'Tesla FSD v13 Chinese Regulatory Fast-Track Granted in Shanghai Free-Trade Zone',
          summary: 'Sunday night reports confirm municipal approval for full driverless robo-fleet road testing permits beginning next month. Social sentiment surged +410% in 1 hour.',
          relevantTickers: ['rTSLA'],
          urgency: 'HIGH',
          sentiment: 'BULLISH',
          confidenceScore: 84,
          sourceSkill: 'sentiment-analyst',
        };
      } else if (presetKey === 'mstr_btc') {
        payload = {
          title: 'Bitcoin Surges Past $68.5k on Weekend Spot ETF Inflow Momentum',
          summary: 'Weekend crypto liquidity pushed BTC through key resistance. Historical beta of MicroStrategy (MSTR) against weekend BTC surge implies a +5.4% opening gap on Monday.',
          relevantTickers: ['rMSTR'],
          urgency: 'HIGH',
          sentiment: 'BULLISH',
          confidenceScore: 91,
          sourceSkill: 'market-intel',
        };
      }

      await fetch('/api/signals/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      await fetchData();
    } catch (err) {
      console.error('Error triggering catalyst:', err);
    } finally {
      setIsTriggering(false);
    }
  };

  // Approve proposal
  const handleApproveProposal = async (proposalId: string) => {
    setIsProcessingProposal(true);
    try {
      await fetch('/api/proposals/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, action: 'APPROVE' }),
      });
      await fetchData();
    } catch (err) {
      console.error('Error approving proposal:', err);
    } finally {
      setIsProcessingProposal(false);
    }
  };

  // Reject proposal
  const handleRejectProposal = async (proposalId: string) => {
    setIsProcessingProposal(true);
    try {
      await fetch('/api/proposals/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, action: 'REJECT' }),
      });
      await fetchData();
    } catch (err) {
      console.error('Error rejecting proposal:', err);
    } finally {
      setIsProcessingProposal(false);
    }
  };

  // Send message from iMessage simulator
  const handleSendMessage = async (text: string) => {
    setIsSendingMessage(true);
    try {
      await fetch('/api/imessage/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sender: 'USER' }),
      });
      await fetchData();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const pendingProposal = proposals.find(p => p.humanApprovalStatus === 'PENDING_APPROVAL') || proposals[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* App Header */}
      <Header
        marketState={marketState}
        activeTab={activeTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
        onSimulateClick={() => handleTriggerCatalyst('nvda_chips')}
      />

      {/* 24/7 rToken Watchlist Strip */}
      <WatchlistTicker />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        
        {/* Top Quantitative Performance Row (Judges Scoring Alignment) */}
        <MetricsBar metrics={portfolio?.metrics || null} />

        {/* Tab 1: Dashboard Command Center */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* The After-Hours Temporal Gap Widget */}
            <MarketClockWidget marketState={marketState} />

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (7 Cols): Perception Feed & Decision Explainability */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Active Proposal Card (Explainability & Approval Gate) */}
                {pendingProposal ? (
                  <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Active Trade Proposal & Rationale
                      </span>
                      <span className="text-xs text-cyan-400 font-mono">
                        Bitget rToken Paper Fill
                      </span>
                    </div>
                    <ProposalCard
                      proposal={pendingProposal}
                      onApprove={handleApproveProposal}
                      onReject={handleRejectProposal}
                      isProcessing={isProcessingProposal}
                    />
                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center text-slate-400">
                    No active proposals pending. Click "Simulate Catalyst" above to trigger a live after-hours event.
                  </div>
                )}

                {/* Perception Layer Feed */}
                <PerceptionFeed
                  catalysts={catalysts}
                  onTriggerCatalyst={handleTriggerCatalyst}
                  isTriggering={isTriggering}
                />

                {/* Portfolio Positions & History */}
                <PortfolioView portfolio={portfolio} />

              </div>

              {/* Right Column (5 Cols): Live iOS iMessage Simulator & Relay */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="sticky top-20 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        Live iMessage Channel (Photon Relay)
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Interactive Demo Surface
                      </span>
                    </div>

                    <IMessageSimulator
                      chatHistory={chatHistory}
                      onSendMessage={handleSendMessage}
                      isSending={isSendingMessage}
                    />
                  </div>

                  {/* Judge Evaluation Callout */}
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
                    <strong className="text-cyan-300 block">💡 How Judges Can Test End-to-End:</strong>
                    <p>
                      1. Click <strong>"Inject Event"</strong> above to simulate a weekend catalyst.
                    </p>
                    <p>
                      2. Observe the structured trade proposal generated with after-hours information gap rationale.
                    </p>
                    <p>
                      3. In the iMessage phone above, click <strong>"Reply YES"</strong> to approve. The paper order executes instantly on Bitget Agent Hub!
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Explainability Audit Log */}
        {activeTab === 'audit' && (
          <AuditLogTable proposals={proposals} />
        )}

        {/* Tab 3: Hackathon Submission Pack */}
        {activeTab === 'submission' && (
          <SubmissionPack />
        )}

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Afterbell — Bitget AI Base Camp Hackathon S2 (Track: Agentic Trading)</span>
          <span className="font-mono text-cyan-400/80">Mode: --paper-trading | Bitget Agentic Account Isolated</span>
        </div>
      </footer>

    </div>
  );
}
