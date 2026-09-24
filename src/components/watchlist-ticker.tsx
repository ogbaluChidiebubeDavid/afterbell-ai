import React from 'react';
import { TrendingUp, Activity, Globe } from 'lucide-react';
import { WATCHLIST_RTOKENS } from '@/config/rtokens';

export const WatchlistTicker: React.FC = () => {
  return (
    <div className="w-full bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto py-2 px-4 scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-max">
        
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider pr-4 border-r border-slate-800">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Bitget rTokens (24/7):</span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          {WATCHLIST_RTOKENS.map((token) => (
            <div key={token.symbol} className="flex items-center gap-2 group cursor-pointer">
              <span className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                {token.symbol}
              </span>
              <span className="font-mono text-slate-300">
                ${token.basePrice.toFixed(2)}
              </span>
              <span className="flex items-center text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-1 rounded">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +2.4%
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {token.underlyingTicker}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-cyan-400/80 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>Reality Protocol 1:1 Reserves Audited</span>
        </div>

      </div>
    </div>
  );
};
