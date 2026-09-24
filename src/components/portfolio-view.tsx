import React from 'react';
import { TrendingUp, ArrowUpRight, CheckCircle2, History, DollarSign, Wallet } from 'lucide-react';
import { PortfolioState } from '@/types/portfolio';

interface PortfolioViewProps {
  portfolio: PortfolioState | null;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ portfolio }) => {
  const positions = portfolio?.positions || [];
  const closedTrades = portfolio?.closedTrades || [];
  const equityCurve = portfolio?.equityCurve || [];

  return (
    <div className="space-y-6">
      
      {/* Active Open Paper Positions */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">
              Open Paper Positions ({positions.length} Active)
            </h3>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
            Bitget Agentic Account Isolated
          </span>
        </div>

        {positions.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No open paper positions. Waiting for after-hours catalyst.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {positions.map((pos) => {
              const isPnlPositive = pos.unrealizedPnlUsdt >= 0;
              return (
                <div
                  key={pos.id}
                  className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2.5 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{pos.asset}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-sans font-semibold">
                        {pos.direction}
                      </span>
                    </div>
                    <div className={`text-xs font-bold ${isPnlPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPnlPositive ? '+' : ''}${pos.unrealizedPnlUsdt.toFixed(2)} ({isPnlPositive ? '+' : ''}{pos.unrealizedPnlPercent.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Entry:</span>
                      <span className="text-white">${pos.entryPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Current:</span>
                      <span className="text-cyan-300">${pos.currentPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Size / Cost:</span>
                      <span className="text-white">${pos.costBasisUsdt.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Target: ${pos.targetPrice.toFixed(2)}</span>
                    <span>Stop: ${pos.stopLossPrice.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Equity Curve & Performance Trajectory */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">
              Cumulative Equity Curve (Paper Trading Log Evidence)
            </h3>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            +{( ((portfolio?.metrics?.currentPortfolioValueUsdt || 3000) - 3000) / 30 ).toFixed(2)}% Cumulative Drift
          </span>
        </div>

        {/* CSS Sparkline / Bar Graph */}
        <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2 pb-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          {equityCurve.map((pt, i) => {
            const min = 2990;
            const max = 3055;
            const heightPercent = Math.min(100, Math.max(15, ((pt.totalPortfolioValue - min) / (max - min)) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[9px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${pt.totalPortfolioValue.toFixed(0)}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-cyan-600/40 to-cyan-400 rounded-t-sm group-hover:to-emerald-400 transition-all cursor-pointer"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[8px] text-slate-500 font-mono truncate w-full text-center">
                  {pt.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closed Trades History */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-sm text-white">
              Closed Paper Trades Audit History ({closedTrades.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800/80 text-[10px] uppercase">
                <th className="pb-2">Asset</th>
                <th className="pb-2">Side</th>
                <th className="pb-2">Entry</th>
                <th className="pb-2">Exit</th>
                <th className="pb-2">Realized PnL</th>
                <th className="pb-2">Exit Catalyst</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-[11px]">
              {closedTrades.map((t) => {
                const isWin = t.realizedPnlUsdt > 0;
                return (
                  <tr key={t.id} className="hover:bg-slate-950/40">
                    <td className="py-2.5 font-bold text-white">{t.asset}</td>
                    <td className="py-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-sans font-semibold">
                        {t.direction}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">${t.entryPrice.toFixed(2)}</td>
                    <td className="py-2.5 text-slate-300">${t.exitPrice.toFixed(2)}</td>
                    <td className={`py-2.5 font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isWin ? '+' : ''}${t.realizedPnlUsdt.toFixed(2)} ({isWin ? '+' : ''}{t.realizedPnlPercent.toFixed(2)}%)
                    </td>
                    <td className="py-2.5 text-slate-400 font-sans text-[11px] truncate max-w-xs">
                      {t.catalystSummary}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
