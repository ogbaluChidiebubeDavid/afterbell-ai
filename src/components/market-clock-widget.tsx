import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { USMarketState } from '@/services/market-clock';

interface MarketClockWidgetProps {
  marketState: USMarketState | null;
}

export const MarketClockWidget: React.FC<MarketClockWidgetProps> = ({ marketState }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(marketState?.secondsUntilNextOpen || 148500);

  useEffect(() => {
    if (marketState?.secondsUntilNextOpen) {
      setSecondsLeft(marketState.secondsUntilNextOpen);
    }
  }, [marketState]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const weekendProgress = marketState?.weekendProgressPercent || 64;

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800 relative overflow-hidden shadow-xl">
      {/* Background glow effect */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Col: The Temporal Gap Counter */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              US Equities Market Closed: {marketState?.sessionType === 'WEEKEND_CLOSED' ? 'Weekend 65.5h Gap' : 'Overnight Gap'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              NYC: {marketState?.nyTimeFormatted || 'Sun 18:42 EST'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            The After-Hours Gap: Native Equities Sleep. <span className="text-cyan-400">rToken Doesn't.</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {marketState?.edgeExplanation || 
              'US stock exchanges are locked until Monday 9:30 AM EST. Catalysts breaking over the weekend create massive information mispricings. Exbit monitors breaking news and executes on Bitget rTokens 24/7 ahead of the opening bell gap.'}
          </p>

          {/* Progress Bar of the Closed Gap */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Friday 4:00 PM Close</span>
              <span className="text-cyan-400 font-medium">{weekendProgress}% of Closed Gap Elapsed</span>
              <span>Monday 9:30 AM Bell</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${weekendProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Col: Countdown Card & Edge Contrast */}
        <div className="lg:col-span-5 bg-slate-950/90 rounded-xl p-4 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Countdown to Monday Open:
            </span>
            <span className="text-[11px] text-slate-500 font-mono">NYSE / NASDAQ</span>
          </div>

          {/* Digital Timer */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
              <div className="text-2xl font-black text-cyan-400">{String(hours).padStart(2, '0')}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Hours</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
              <div className="text-2xl font-black text-cyan-400">{String(minutes).padStart(2, '0')}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Mins</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
              <div className="text-2xl font-black text-cyan-400">{String(seconds).padStart(2, '0')}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Secs</div>
            </div>
          </div>

          {/* Institutional Comparison Table */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Traditional US Equity Broker:</span>
              <span className="text-rose-400 font-semibold bg-rose-500/10 px-1.5 py-0.5 rounded">
                ⛔ Market Locked
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-medium text-cyan-300">Bitget rToken (Tokenized Stocks):</span>
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                🟢 24/7 Live & Liquid
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Exbit Agent State:</span>
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Active Hunting
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
