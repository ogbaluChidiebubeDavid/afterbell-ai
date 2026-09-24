import React, { useState } from 'react';
import { Radio, Newspaper, TrendingUp, BarChart3, ShieldCheck, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { MarketCatalyst } from '@/types/signals';

interface PerceptionFeedProps {
  catalysts: MarketCatalyst[];
  onTriggerCatalyst: (presetKey: string) => Promise<void>;
  isTriggering: boolean;
}

export const PerceptionFeed: React.FC<PerceptionFeedProps> = ({
  catalysts,
  onTriggerCatalyst,
  isTriggering,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('nvda_chips');

  const presets = [
    {
      key: 'nvda_chips',
      label: 'Sunday Blackwell Chip Policy (rNVDA)',
      skill: 'news-briefing',
      summary: 'Commerce Dept clarifies export licensing to Middle East AI clusters, removing weekend overhang.',
      ticker: 'rNVDA',
    },
    {
      key: 'tsla_fsd',
      label: 'Weekend Shanghai FSD Approval (rTSLA)',
      skill: 'sentiment-analyst',
      summary: 'Municipal authorities grant road permits for driverless robo-fleet testing.',
      ticker: 'rTSLA',
    },
    {
      key: 'mstr_btc',
      label: 'Sunday Bitcoin $68.5k Surge (rMSTR)',
      skill: 'market-intel',
      summary: 'Weekend liquidity pushes BTC through resistance; MSTR beta implies gap up on Monday.',
      ticker: 'rMSTR',
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      
      {/* Header & Simulator Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Perception Layer: Bitget Signal Stream
              <span className="text-[10px] text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-500/20 font-mono">
                5 Skills Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Aggregating after-hours catalysts across macro, news, sentiment, and order flow
            </p>
          </div>
        </div>

        {/* Live Catalyst Injector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {presets.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => onTriggerCatalyst(selectedPreset)}
            disabled={isTriggering}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{isTriggering ? 'Reasoning...' : 'Inject Event'}</span>
          </button>
        </div>
      </div>

      {/* Catalyst List */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {catalysts.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  {cat.sourceSkill}
                </span>
                {cat.relevantTickers.map(ticker => (
                  <span key={ticker} className="text-[10px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded">
                    {ticker}
                  </span>
                ))}
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  cat.urgency === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-300'
                }`}>
                  {cat.urgency} URGENCY
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(cat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h4 className="text-xs font-semibold text-slate-200 leading-snug">
              {cat.title}
            </h4>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {cat.summary}
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
              <span className="flex items-center gap-1 text-slate-400">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Confidence: <strong className="text-cyan-300">{cat.confidenceScore}%</strong>
              </span>
              <span className="text-amber-400/90 font-mono">
                {cat.metadata.underlyingUSMarketStatus === 'CLOSED_WEEKEND' ? '⚡ Weekend Closed Gap' : 'Overnight'}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
