'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Info,
  Maximize2,
  MessageCircle,
  Network,
  RefreshCw,
  Shield,
  Sliders,
  TrendingUp,
  Zap,
  X,
} from 'lucide-react';

interface ContagionNode {
  id: string;
  name: string;
  ticker: string;
  role: 'origin' | 'supplier' | 'customer' | 'rtoken';
  sector: string;
  x: number;
  y: number;
  marketCap: string;
}

interface ContagionEdge {
  from: string;
  to: string;
  relationship: string;
  weight: number;
  transmissionLagHours: number;
}

const CONTAGION_NODES: ContagionNode[] = [
  { id: 'NVDA', name: 'Nvidia Corp', ticker: 'rNVDA', role: 'rtoken', sector: 'AI Accelerators', x: 260, y: 160, marketCap: '$3.15T' },
  { id: 'TSM', name: 'TSMC Fab', ticker: '2330.TW', role: 'supplier', sector: 'Foundry Fab', x: 140, y: 110, marketCap: '$840B' },
  { id: 'ASML', name: 'ASML Litho', ticker: 'ASML', role: 'supplier', sector: 'EUV Equipment', x: 70, y: 170, marketCap: '$390B' },
  { id: 'SKHY', name: 'SK Hynix', ticker: '000660.KS', role: 'supplier', sector: 'HBM Memory', x: 130, y: 220, marketCap: '$110B' },
  { id: 'MSFT', name: 'Microsoft', ticker: 'rMSFT', role: 'customer', sector: 'Hyperscale Cloud', x: 380, y: 100, marketCap: '$3.12T' },
  { id: 'GOOGL', name: 'Alphabet', ticker: 'GOOGL', role: 'origin', sector: 'Cloud & TPU', x: 390, y: 210, marketCap: '$2.10T' },
  { id: 'AMZN', name: 'Amazon AWS', ticker: 'AMZN', role: 'customer', sector: 'Cloud Compute', x: 340, y: 260, marketCap: '$1.95T' },
  { id: 'MSTR', name: 'MicroStrategy', ticker: 'rMSTR', role: 'rtoken', sector: 'Treasury NAV', x: 250, y: 60, marketCap: '$45B' },
  { id: 'TSLA', name: 'Tesla Inc', ticker: 'rTSLA', role: 'rtoken', sector: 'Robotics & FSD', x: 440, y: 160, marketCap: '$780B' },
  { id: 'AVGO', name: 'Broadcom', ticker: 'AVGO', role: 'supplier', sector: 'Networking ASICs', x: 190, y: 270, marketCap: '$820B' },
  { id: 'SMCI', name: 'Supermicro', ticker: 'SMCI', role: 'supplier', sector: 'Liquid Cooling Rack', x: 210, y: 90, marketCap: '$28B' },
  { id: 'ORCL', name: 'Oracle Cloud', ticker: 'ORCL', role: 'customer', sector: 'OCI Cloud', x: 450, y: 240, marketCap: '$480B' },
];

const CONTAGION_EDGES: ContagionEdge[] = [
  { from: 'ASML', to: 'TSM', relationship: 'High-NA EUV Scanner', weight: 0.95, transmissionLagHours: 12 },
  { from: 'TSM', to: 'NVDA', relationship: 'CoWoS-L Advanced Packaging', weight: 0.98, transmissionLagHours: 6 },
  { from: 'SKHY', to: 'NVDA', relationship: 'HBM3e Memory Stacks', weight: 0.92, transmissionLagHours: 8 },
  { from: 'NVDA', to: 'MSFT', relationship: 'Azure Blackwell Instances', weight: 0.88, transmissionLagHours: 14 },
  { from: 'NVDA', to: 'AMZN', relationship: 'AWS UltraCluster Fabrics', weight: 0.86, transmissionLagHours: 14 },
  { from: 'NVDA', to: 'ORCL', relationship: 'OCI Supercluster Deployment', weight: 0.82, transmissionLagHours: 18 },
  { from: 'SMCI', to: 'NVDA', relationship: 'Liquid Cooled Server Racks', weight: 0.79, transmissionLagHours: 16 },
  { from: 'AVGO', to: 'GOOGL', relationship: 'Custom TPUv6 Interconnect', weight: 0.84, transmissionLagHours: 20 },
  { from: 'GOOGL', to: 'MSFT', relationship: 'AI Frontier Pricing Parity', weight: 0.72, transmissionLagHours: 24 },
  { from: 'NVDA', to: 'TSLA', relationship: 'Cortex Dojo H100 Clusters', weight: 0.85, transmissionLagHours: 12 },
  { from: 'MSTR', to: 'NVDA', relationship: 'Weekend Liquidity Reallocation', weight: 0.65, transmissionLagHours: 8 },
];

export interface ContagionTerminalProps {
  onOpenWhatsApp: () => void;
}

export const ContagionTerminal: React.FC<ContagionTerminalProps> = ({ onOpenWhatsApp }) => {
  const [selectedNode, setSelectedNode] = useState<string>('NVDA');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>('DEC-2859');
  const [explainModalItem, setExplainModalItem] = useState<any | null>(null);
  const [graphFilter, setGraphFilter] = useState<'all' | 'suppliers' | 'hyperscalers'>('all');
  const [cycleCount, setCycleCount] = useState<number>(418);
  const [secondsUntilRead, setSecondsUntilRead] = useState<number>(382);

  // Live timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilRead((prev) => (prev > 1 ? prev - 1 : 420));
      if (Math.random() > 0.85) setCycleCount((c) => c + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const newsItems = [
    {
      id: 'DEC-2859',
      source: 'US BIS & TAIPEI TIMES',
      timeAgo: '14m ago',
      status: 'PROPOSED',
      title: 'US Bureau of Industry and Security clears Middle East export licensing for high-density Blackwell clusters',
      ticker: 'rNVDA',
      shockScore: 0.89,
      shockLevel: 'HIGH',
      assetBeta: 1.45,
      confidence: 0.92,
      model: 'deepseek-r1',
      linkText: 'View Federal Notice #2026-0814 ↗',
      url: 'https://www.bis.doc.gov/',
      quote: 'Specific licensing exemptions established for localized high-density interconnect cluster deployments.',
      thesis: 'Weekend policy resolution removes export blanket ban overhang; implies +3.2% Monday equity reopen mark.',
      falsification: 'Invalidate if Sunday Night S&P 500 futures open down ≥ 0.8% or Commerce Dept issues formal retraction.',
      impliedMovePercent: 3.2,
      origin: 'Nvidia (NVDA)',
    },
    {
      id: 'DEC-2858',
      source: 'SHANGHAI MUNICIPAL TRANSPORT',
      timeAgo: '42m ago',
      status: 'PROPOSED',
      title: 'Tesla FSD v13 Chinese Regulatory Fast-Track Granted in Shanghai Free-Trade Pilot Zone',
      ticker: 'rTSLA',
      shockScore: 0.84,
      shockLevel: 'HIGH',
      assetBeta: 1.62,
      confidence: 0.89,
      model: 'claude-3.5-sonnet',
      linkText: 'View Shanghai SMTC Filing ↗',
      url: 'https://www.caixinglobal.com/',
      quote: 'Municipal pilot permit granted for commercial validation of vision-based level-4 autonomous fleets in Pudong.',
      thesis: 'Unlocks recurring software monetization in world largest EV market ahead of Monday US opening bell.',
      falsification: 'Invalidate if Chinese Ministry of Industry and Information Technology denies pilot scope expansion.',
      impliedMovePercent: 2.8,
      origin: 'Tesla (TSLA)',
    },
    {
      id: 'DEC-2857',
      source: 'SEC FORM 8-K / MICROSTRATEGY',
      timeAgo: '1h ago',
      status: 'PROPOSED',
      title: 'MicroStrategy Discloses Weekend Treasury Acquisition of 7,420 Bitcoin ($498.5M aggregate)',
      ticker: 'rMSTR',
      shockScore: 0.91,
      shockLevel: 'HIGH',
      assetBeta: 2.15,
      confidence: 0.95,
      model: 'deepseek-r1',
      linkText: 'SEC Form 8-K CIK:0001050446 ↗',
      url: 'https://www.sec.gov/edgar/browse/?CIK=0001050446',
      quote: 'MicroStrategy acquired an aggregate of 7,420 bitcoins for approx $498.5 million in cash.',
      thesis: 'Direct net asset value (NAV) expansion for MSTR treasury holdings ahead of US equity open.',
      falsification: 'Invalidate if BTC retraces below $66,200 weekend support before 8:00 PM EST Sunday futures open.',
      impliedMovePercent: 5.4,
      origin: 'MicroStrategy (MSTR)',
    },
    {
      id: 'DEC-2856',
      source: 'FORTUNE · REUTERS',
      timeAgo: '1h 35m ago',
      status: 'DECLINED',
      title: 'Alphabet exploring orbital solar compute architectures for off-planet experimental research',
      ticker: 'GOOGL',
      shockScore: 0.05,
      shockLevel: 'LOW',
      assetBeta: 1.05,
      confidence: 0.90,
      model: 'claude-3.5-sonnet',
      linkText: 'View Fortune Report ↗',
      url: 'https://fortune.com/',
      quote: 'Preliminary exploratory whitepaper regarding speculative space-based datacenter power efficiency.',
      thesis: 'Speculative 10-year R&D concept with zero measurable financial transmission to near-term earnings or cash flow.',
      falsification: 'N/A - Shock magnitude 0.05 is below institutional threshold (0.70).',
      impliedMovePercent: -0.1,
      origin: 'Alphabet (GOOGL)',
    },
    {
      id: 'DEC-2855',
      source: 'BUSINESS INSIDER',
      timeAgo: '2h 10m ago',
      status: 'DECLINED',
      title: 'AWS CEO comments casually on consumer cloud streaming subscription dynamics in podcast interview',
      ticker: 'AMZN',
      shockScore: 0.02,
      shockLevel: 'LOW',
      assetBeta: 1.15,
      confidence: 0.94,
      model: 'deepseek-r1',
      linkText: 'Read Transcript ↗',
      url: 'https://www.businessinsider.com/',
      quote: 'Executive answered broad questions on media habits without providing forward guidance.',
      thesis: 'Routine media appearance with no regulatory, supply-chain, or temporal pricing catalyst.',
      falsification: 'N/A - Rejected by Noise Filter (Conviction Delta: 0.00).',
      impliedMovePercent: 0.0,
      origin: 'Amazon (AMZN)',
    },
  ];

  const agentLogs = [
    {
      time: '12:16:13',
      action: 'RECV · WHATSAPP (+234...933)',
      status: 'EXECUTED',
      details: 'User issued "STATUS" command via live Kapso WhatsApp channel. Dispatched real-time Bitget portfolio balance & Sharpe ratio.',
      model: 'kapso-v2',
      badge: 'WHATSAPP SYNC',
      shock: 'N/A',
      conf: 1.0,
    },
    {
      time: '12:04:06',
      action: 'READ · US BIS #2026-0814',
      status: 'PROPOSED',
      details: 'Evaluated Middle East Blackwell licensing exemption. Catalyst shock 0.89 * beta 1.45 implies +3.2% Monday reopen mark. Dispatched approval request to WhatsApp.',
      model: 'deepseek-r1',
      badge: 'rNVDA',
      shock: '0.89 HIGH',
      conf: 0.92,
    },
    {
      time: '11:51:40',
      action: 'READ · SEC 8-K MSTR',
      status: 'PROPOSED',
      details: 'Detected 7,420 BTC weekend acquisition. NAV transmission models +5.4% gap. Dispatched approval alert.',
      model: 'deepseek-r1',
      badge: 'rMSTR',
      shock: '0.91 HIGH',
      conf: 0.95,
    },
    {
      time: '11:40:38',
      action: 'READ · FORTUNE GOOGLE SPACE',
      status: 'DECLINED',
      details: 'Exploratory orbital datacenter paper. Shock 0.05 fell below 0.70 threshold. Suppressed from WhatsApp to prevent noise.',
      model: 'claude-3.5-sonnet',
      badge: 'GOOGL',
      shock: '0.05 LOW',
      conf: 0.90,
    },
    {
      time: '11:22:15',
      action: 'ORDER · BITGET PAPER DEMO',
      status: 'FILLED',
      details: 'Order bg_paper_plsi_928f filled: 3.42 rNVDA @ $128.45 USDT. WhatsApp human approval verified. Account: Isolated Paper.',
      model: 'bitget-hub',
      badge: 'EXECUTION',
      shock: 'N/A',
      conf: 0.98,
    },
    {
      time: '10:55:02',
      action: 'STOCK ACT · PELOSI PTR',
      status: 'PROPOSED',
      details: 'Nancy Pelosi disclosed 50x NVDA $120 Calls ($1.25M notional). Sourced from House Ethics Office PTR repository.',
      model: 'deepseek-r1',
      badge: 'CONGRESSIONAL',
      shock: '0.92 HIGH',
      conf: 0.94,
    },
  ];

  const positions = [
    { symbol: 'rNVDAUSDT', side: 'LONG', by: 'WHATSAPP AGENT', notional: '$10,992', entry: '$128.45', mark: '$132.80', pnl: '+$372.40 (+3.38%)', status: 'OPEN' },
    { symbol: 'rMSTRUSDT', side: 'LONG', by: 'WHATSAPP AGENT', notional: '$14,209', entry: '$134.20', mark: '$141.50', pnl: '+$774.20 (+5.44%)', status: 'OPEN' },
    { symbol: 'rTSLAUSDT', side: 'LONG', by: 'WHATSAPP AGENT', notional: '$8,450', entry: '$248.80', mark: '$252.30', pnl: '+$118.90 (+1.41%)', status: 'OPEN' },
    { symbol: 'rAAPLUSDT', side: 'SHORT', by: 'MANUAL / WA', notional: '$9,500', entry: '$234.10', mark: '$233.10', pnl: '+$168.85 (CLOSED)', status: 'CLOSED' },
  ];

  const currentDecision = newsItems.find((n) => n.id === selectedDecisionId) || newsItems[0];

  return (
    <div className="w-full bg-[#0d0d0f] border border-[#202024] rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans text-[#e4e4e7]">
      {/* 1. Terminal Top Ticker & State Header */}
      <div className="bg-[#121216] border-b border-[#202024] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Cascadr-grade Terminal Identity & Bitget Price Ribbon */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pr-3 border-r border-[#26262c]">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold tracking-tight text-white flex items-center gap-1">
              Exbit <span className="text-cyan-400 font-mono text-[11px]">Contagion Terminal</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-[#9ca3af] shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20">
              BITGET rTOKENS 24/7
            </span>
            <span>rNVDA <span className="text-emerald-400 font-medium">$132.80 +3.38%</span></span>
            <span className="text-[#3f3f46]">|</span>
            <span>rMSTR <span className="text-emerald-400 font-medium">$141.50 +5.44%</span></span>
            <span className="text-[#3f3f46]">|</span>
            <span>rTSLA <span className="text-emerald-400 font-medium">$252.30 +1.41%</span></span>
            <span className="text-[#3f3f46]">|</span>
            <span>SKHY <span className="text-rose-400 font-medium">170.53 -1.79%</span></span>
          </div>
        </div>

        {/* Right: Agent Armed Countdown & Live WhatsApp CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/12018291736"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all font-medium text-[11px]"
            title="Chat with Exbit Agent live on WhatsApp"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Bot: +1 201-829-1736</span>
          </a>

          <div className="flex items-center gap-2 bg-[#18181f] px-2.5 py-1 rounded-full border border-[#2b2b36] font-mono text-[11px]">
            <span className="text-[#9ca3af]">AGENT</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              Armed
            </span>
            <span className="text-[#6b7280]">next read {formatCountdown(secondsUntilRead)}</span>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. Main 3-Column Cascadr-Grade Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px] divide-y lg:divide-y-0 lg:divide-x divide-[#202024]">
        
        {/* COLUMN 1: LIVE NEWS · AGENT INPUT (Left, 3.5 cols) */}
        <div className="lg:col-span-4 p-4 flex flex-col justify-between gap-4 bg-[#0f0f13]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#202024] text-xs">
              <span className="font-semibold tracking-wider text-[#9ca3af] uppercase text-[10px]">
                Live News · Agent Input
              </span>
              <span className="text-[#6b7280] font-mono text-[11px]">{cycleCount} reasoned</span>
            </div>

            {/* News Cards Feed */}
            <div className="mt-3 space-y-3 max-h-[440px] overflow-y-auto pr-1 no-scrollbar">
              {newsItems.map((item) => {
                const isSelected = item.id === selectedDecisionId;
                const isProposed = item.status === 'PROPOSED';
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDecisionId(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#181822] border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-[#14141a] border-[#22222a] hover:border-[#30303c]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-[#9ca3af] font-medium tracking-tight">
                        {item.source} · <span className="text-[#6b7280]">{item.timeAgo}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                          isProposed
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-xs font-medium text-white leading-snug line-clamp-2 mb-2.5">
                      {item.title}
                    </p>

                    {/* Metadata & Arithmetic Pill */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono mb-2.5">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold">
                        {item.ticker}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        shock {item.shockScore.toFixed(2)} {item.shockLevel}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        β {item.assetBeta}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        conf {item.confidence.toFixed(2)}
                      </span>
                    </div>

                    {/* Action Links & Why Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#23232c] text-[11px]">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                      >
                        <span>read source ↗</span>
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExplainModalItem(item);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] transition-all"
                      >
                        <span>why</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {isSelected && (
                      <div className="mt-2 text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>FOLLOWING THIS DECISION</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Selected Decision Slider */}
          <div className="p-3 rounded-xl bg-[#14141a] border border-[#22222a]">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-semibold text-zinc-400 tracking-wider text-[10px] uppercase">
                Contagion · Selected Decision #{currentDecision.id.replace('DEC-', '')}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                {currentDecision.ticker}
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  ORIGIN
                </span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                implied +{currentDecision.impliedMovePercent}%
              </span>
            </div>
            {/* Visual Slider Bar */}
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(15, currentDecision.impliedMovePercent * 18))}%` }}
              />
            </div>
          </div>
        </div>

        {/* COLUMN 2: SUPPLY CHAIN KNOWLEDGE GRAPH & POSITIONS (Center, 5 cols) */}
        <div className="lg:col-span-5 p-4 flex flex-col justify-between gap-4 bg-[#0c0c0e]">
          <div>
            {/* Knowledge Graph Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#202024] text-xs">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold tracking-wider text-[#9ca3af] uppercase text-[10px]">
                  Supply Chain Knowledge Graph
                </span>
              </div>
              <span className="text-[#6b7280] font-mono text-[11px]">19 companies · 24 sourced links</span>
            </div>

            {/* Decision Status Pill */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-[#14141a] border border-[#22222a] flex items-center justify-between">
              <div className="text-[11px] font-medium text-zinc-300 truncate max-w-[280px]">
                <span className="text-cyan-400 font-mono mr-1.5">● DECISION #{currentDecision.id.replace('DEC-', '')}:</span>
                {currentDecision.title}
              </div>
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">Graph live</span>
            </div>

            {/* Interactive SVG Supply Chain Graph */}
            <div className="relative mt-3 h-[250px] w-full rounded-xl bg-[#101015] border border-[#1f1f26] overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 520 310">
                <defs>
                  <linearGradient id="transmissionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Edges */}
                {CONTAGION_EDGES.map((edge, idx) => {
                  const src = CONTAGION_NODES.find((n) => n.id === edge.from);
                  const tgt = CONTAGION_NODES.find((n) => n.id === edge.to);
                  if (!src || !tgt) return null;
                  const isHighlighted = edge.from === selectedNode || edge.to === selectedNode;

                  return (
                    <g key={idx}>
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke={isHighlighted ? 'url(#transmissionGrad)' : '#262630'}
                        strokeWidth={isHighlighted ? 2.5 : 1}
                        strokeDasharray={isHighlighted ? '4,3' : undefined}
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {CONTAGION_NODES.map((node) => {
                  const isSelected = node.id === selectedNode;
                  const isRToken = node.role === 'rtoken';

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setSelectedNode(node.id)}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 16 : isRToken ? 13 : 11}
                        fill={
                          isSelected
                            ? '#06b6d4'
                            : isRToken
                            ? '#059669'
                            : '#1c1c24'
                        }
                        stroke={isSelected ? '#ffffff' : '#3f3f4e'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fontSize={isRToken ? '9' : '8'}
                        fontWeight="bold"
                        fill="#ffffff"
                        fontFamily="monospace"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Overlay Node Info Card */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-white font-semibold">
                  Selected: <span className="text-cyan-400">{selectedNode}</span> ({CONTAGION_NODES.find(n => n.id === selectedNode)?.name})
                </span>
                <span className="text-emerald-400">
                  {CONTAGION_NODES.find(n => n.id === selectedNode)?.marketCap}
                </span>
              </div>
            </div>
          </div>

          {/* Paper Positions Table (Bitget Demo) */}
          <div className="rounded-xl bg-[#121216] border border-[#202024] p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#24242c] text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-300 text-[10px] uppercase tracking-wider">
                  Paper Positions
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  ● BITGET DEMO
                </span>
              </div>
              <div className="text-[11px] font-mono">
                <span className="text-zinc-500 mr-2">UPL $0.00</span>
                <span className="text-emerald-400 font-bold">RPL +$168.85</span>
              </div>
            </div>

            {/* Positions Table */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-[11px] font-mono">
                <thead>
                  <tr className="text-zinc-500 border-b border-[#22222a] text-[10px]">
                    <th className="pb-1.5 font-medium">SYMBOL</th>
                    <th className="pb-1.5 font-medium">SIDE</th>
                    <th className="pb-1.5 font-medium">BY</th>
                    <th className="pb-1.5 font-medium">NOTIONAL</th>
                    <th className="pb-1.5 font-medium">ENTRY</th>
                    <th className="pb-1.5 font-medium">MARK</th>
                    <th className="pb-1.5 font-medium text-right">PNL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24]">
                  {positions.map((pos, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-1.5 font-bold text-white">{pos.symbol}</td>
                      <td className={`py-1.5 ${pos.side === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pos.side}
                      </td>
                      <td className="py-1.5 text-zinc-400 text-[10px]">{pos.by}</td>
                      <td className="py-1.5 text-zinc-300">{pos.notional}</td>
                      <td className="py-1.5 text-zinc-400">{pos.entry}</td>
                      <td className="py-1.5 text-zinc-200">{pos.mark}</td>
                      <td className={`py-1.5 text-right font-bold ${pos.pnl.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pos.pnl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COLUMN 3: AGENT LOG & WHATSAPP SYNC (Right, 3 cols) */}
        <div className="lg:col-span-3 p-4 flex flex-col justify-between gap-4 bg-[#0f0f13]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#202024] text-xs">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold tracking-wider text-[#9ca3af] uppercase text-[10px]">
                  Agent Log
                </span>
              </div>
              <span className="text-[#6b7280] font-mono text-[11px]">120 events</span>
            </div>

            {/* Event Timeline Feed */}
            <div className="mt-3 space-y-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {agentLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#14141a] border border-[#22222a] hover:border-[#30303c] transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono text-zinc-500 text-[10px]">{log.time}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        log.status === 'PROPOSED'
                          ? 'bg-cyan-500/15 text-cyan-400'
                          : log.status === 'FILLED' || log.status === 'EXECUTED'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-white mb-1.5">
                    {log.action}
                  </p>

                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">
                    {log.details}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1.5 border-t border-[#202026]">
                    <span>model: {log.model}</span>
                    <button
                      onClick={() => {
                        const matched = newsItems.find((n) => log.action.includes(n.ticker) || log.action.includes(n.id)) || newsItems[0];
                        setExplainModalItem(matched);
                      }}
                      className="text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      why <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Button to Launch WhatsApp */}
          <div className="p-3 rounded-xl bg-gradient-to-tr from-emerald-950/40 to-slate-900 border border-emerald-500/30">
            <p className="text-xs font-semibold text-white mb-1">
              Conversational Trading Live
            </p>
            <p className="text-[11px] text-zinc-400 mb-2.5">
              Send <code className="text-emerald-300 font-mono">STATUS</code> or <code className="text-emerald-300 font-mono">SCAN</code> to Exbit on WhatsApp.
            </p>
            <a
              href="https://wa.me/12018291736"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Chat on WhatsApp (+1 201-829-1736)</span>
            </a>
          </div>
        </div>

      </div>

      {/* 3. Terminal Footer Status Bar */}
      <div className="bg-[#101014] border-t border-[#202024] px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-[#71717a] font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> API OK
          </span>
          <span>● AGENT ARMED · {cycleCount} cycles</span>
          <span>● LLM deepseek-r1 / claude-3.5</span>
          <span>● BITGET PAPER</span>
          <span className="text-emerald-400">● WHATSAPP +1 201-829-1736 CONNECTED</span>
        </div>
        <div className="flex items-center gap-3">
          <span>GRAPH 19 nodes · 24 edges</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400 font-medium">EXBIT AI · BITGET AI BASE CAMP S2</span>
        </div>
      </div>

      {/* 4. Explainability / "Why >" Modal Drawer */}
      {explainModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141a] border border-[#2c2c38] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setExplainModalItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase font-mono ${
                explainModalItem.status === 'PROPOSED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {explainModalItem.status}
              </span>
              <span className="text-xs font-mono text-zinc-400">DECISION #{explainModalItem.id}</span>
            </div>

            <h3 className="text-base font-bold text-white mb-4">
              {explainModalItem.title}
            </h3>

            <div className="space-y-4 text-xs font-mono">
              {/* Provenance */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-cyan-400 font-semibold block mb-1">SOURCED PROVENANCE & PRIMARY CITATION:</span>
                <p className="text-zinc-300 mb-1.5">"{explainModalItem.quote}"</p>
                <a
                  href={explainModalItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {explainModalItem.linkText} <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Transmission Arithmetic */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-cyan-400 font-semibold block mb-1">TRANSMISSION ARITHMETIC & REASONING:</span>
                <div className="grid grid-cols-3 gap-2 py-1.5 text-center">
                  <div className="bg-zinc-800/60 p-2 rounded">
                    <span className="text-[10px] text-zinc-500 block">SHOCK SCORE</span>
                    <span className="font-bold text-white text-sm">{explainModalItem.shockScore}</span>
                  </div>
                  <div className="bg-zinc-800/60 p-2 rounded">
                    <span className="text-[10px] text-zinc-500 block">ASSET BETA (β)</span>
                    <span className="font-bold text-white text-sm">{explainModalItem.assetBeta}</span>
                  </div>
                  <div className="bg-zinc-800/60 p-2 rounded">
                    <span className="text-[10px] text-zinc-500 block">IMPLIED OPEN GAP</span>
                    <span className="font-bold text-emerald-400 text-sm">+{explainModalItem.impliedMovePercent}%</span>
                  </div>
                </div>
                <p className="text-zinc-300 mt-2">{explainModalItem.thesis}</p>
              </div>

              {/* Falsification */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="text-rose-400 font-semibold block mb-1">FALSIFICATION CONDITION:</span>
                <p className="text-rose-200/90">{explainModalItem.falsification}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setExplainModalItem(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
