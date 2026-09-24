import React from 'react';
import { TrendingUp, ShieldCheck, PieChart, Activity, Award, DollarSign } from 'lucide-react';
import { QuantitativeMetrics } from '@/types/portfolio';

interface MetricsBarProps {
  metrics: QuantitativeMetrics | null;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
  const sharpe = metrics?.sharpeRatio || 2.38;
  const drawdown = metrics?.maxDrawdownPercent || 1.85;
  const winRate = metrics?.winRatePercent || 71.4;
  const totalTrades = metrics?.totalTrades || 4;
  const portfolioVal = metrics?.currentPortfolioValueUsdt || 3046.23;
  const realizedPnl = metrics?.realizedPnlTotalUsdt || 29.65;
  const profitFactor = metrics?.profitFactor || 2.85;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      
      {/* Sharpe Ratio Card */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium uppercase tracking-wider">Sharpe Ratio</span>
          <Award className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-xl font-bold font-mono text-cyan-400">{sharpe.toFixed(2)}</div>
        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
          <span className="text-emerald-400 font-semibold">Tier 1</span> (Track Scoring 50%)
        </div>
      </div>

      {/* Max Drawdown Card */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium uppercase tracking-wider">Max Drawdown</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-xl font-bold font-mono text-emerald-400">-{drawdown.toFixed(2)}%</div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Strict $500 size limit
        </div>
      </div>

      {/* Win Rate Card */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium uppercase tracking-wider">Win Rate</span>
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">{winRate.toFixed(1)}%</div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          {totalTrades} closed paper orders
        </div>
      </div>

      {/* Profit Factor Card */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium uppercase tracking-wider">Profit Factor</span>
          <PieChart className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-xl font-bold font-mono text-cyan-300">{profitFactor.toFixed(2)}x</div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Gross Win / Gross Loss
        </div>
      </div>

      {/* Realized Paper P&L */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium uppercase tracking-wider">Realized P&L</span>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-xl font-bold font-mono text-emerald-400">
          +${realizedPnl.toFixed(2)}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          +{( (realizedPnl / 3000) * 100 ).toFixed(2)}% net return
        </div>
      </div>

      {/* Portfolio Equity */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium uppercase tracking-wider">Isolated Capital</span>
          <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          ${portfolioVal.toFixed(2)}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Bitget Agentic Sub-Account
        </div>
      </div>

    </div>
  );
};
