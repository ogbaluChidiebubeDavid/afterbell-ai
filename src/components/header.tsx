import React from 'react';
import { Bell, ShieldCheck, Clock, ExternalLink, Zap } from 'lucide-react';
import { USMarketState } from '@/services/market-clock';

interface HeaderProps {
  marketState: USMarketState | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSimulateClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  marketState,
  activeTab,
  setActiveTab,
  onSimulateClick,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Track Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bell className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                  Afterbell<span className="text-cyan-400">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Bitget S2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                After-Hours Information Pricing on Bitget rTokens
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Temporal Status Pill */}
        <div className="hidden md:flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">
              {marketState?.sessionName || 'US Equities Closed (Weekend Gap)'}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-xs text-cyan-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Bitget rToken: 24/7 Active</span>
          </div>
        </div>

        {/* Right Nav Tabs & Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onSimulateClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 transition-all shadow-md shadow-cyan-500/15"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Catalyst</span>
          </button>

          <nav className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === 'audit'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audit Log
            </button>
            <button
              onClick={() => setActiveTab('submission')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === 'submission'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Submission Pack
            </button>
          </nav>
        </div>

      </div>
    </header>
  );
};
