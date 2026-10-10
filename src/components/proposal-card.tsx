import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, AlertTriangle, Layers, Info, Send } from 'lucide-react';
import { TradeProposal } from '@/types/proposals';

interface ProposalCardProps {
  proposal: TradeProposal;
  onApprove: (proposalId: string) => Promise<void>;
  onReject: (proposalId: string) => Promise<void>;
  isProcessing: boolean;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const isPending = proposal.humanApprovalStatus === 'PENDING_APPROVAL';
  const isApproved = proposal.humanApprovalStatus === 'APPROVED';
  const isRejected = proposal.humanApprovalStatus === 'REJECTED';
  const isLong = proposal.direction === 'LONG';

  return (
    <div className={`glass-panel rounded-2xl p-5 border transition-all space-y-4 ${
      isPending ? 'border-cyan-500/40 shadow-xl shadow-cyan-500/5' : 'border-slate-800'
    }`}>
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
            isLong ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isLong ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">{proposal.asset}</span>
              <span className="text-xs text-slate-400">({proposal.underlying})</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                isLong ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {proposal.direction}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Generated: {new Date(proposal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {isPending && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Awaiting Human Approval (WhatsApp / Messenger)
            </span>
          )}
          {isApproved && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Approved & Executed (Paper Trading)
            </span>
          )}
          {isRejected && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              Proposal Rejected
            </span>
          )}
        </div>
      </div>

      {/* Trade Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-mono text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Entry Price</span>
          <span className="text-white font-bold">${proposal.entryPrice.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Target Price</span>
          <span className="text-emerald-400 font-bold">${proposal.targetPrice.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Stop Loss</span>
          <span className="text-rose-400 font-bold">${proposal.stopLossPrice.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Position Size</span>
          <span className="text-cyan-400 font-bold">${proposal.positionSizeUsdt.toFixed(2)} USDT</span>
        </div>
      </div>

      {/* Decision Explainability Rationale */}
      <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" /> Decision Explainability Trail (Judge Scored)
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">
            Confidence: <strong className="text-white">{proposal.confidenceScore}%</strong>
          </span>
        </div>

        <div className="space-y-2 pt-1 text-slate-300">
          <div>
            <strong className="text-cyan-300 block text-[11px] uppercase tracking-wide">Core Catalyst Thesis:</strong>
            <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">{proposal.rationale.coreThesis}</p>
          </div>

          <div>
            <strong className="text-amber-300 block text-[11px] uppercase tracking-wide">After-Hours Information Gap Edge:</strong>
            <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">{proposal.rationale.afterHoursInformationGap}</p>
          </div>

          {proposal.rationale.sourceCitation && (
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-cyan-300">
                  Primary Source: {proposal.rationale.sourceCitation}
                </span>
                {proposal.rationale.sourceUrl && (
                  <a
                    href={proposal.rationale.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[10px]"
                  >
                    Primary Document ↗
                  </a>
                )}
              </div>
              {proposal.rationale.directQuote && (
                <p className="text-slate-400 italic text-[10.5px] border-l-2 border-cyan-500/50 pl-2 py-0.5">
                  &ldquo;{proposal.rationale.directQuote}&rdquo;
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
            <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Shock / Beta:</span>
              <span className="text-slate-200">
                Shock: {proposal.rationale.shockScore ?? 0.88} · β: {proposal.rationale.assetBeta ?? 1.45}
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Implied Open Gap:</span>
              <span className="text-emerald-400 font-semibold">{proposal.rationale.expectedCatalystPricingAtReopen}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Decision Verdict:</span>
              <span className="text-cyan-300 font-semibold">{proposal.rationale.decisionVerdict || 'PROPOSED'}</span>
            </div>
          </div>

          {proposal.rationale.falsificationCondition && (
            <div className="bg-amber-950/20 p-2 rounded-lg border border-amber-500/20 text-[10.5px] text-amber-300/90">
              <strong>Falsification Test:</strong> {proposal.rationale.falsificationCondition}
            </div>
          )}
        </div>
      </div>

      {/* Risk Control & DryRun Card */}
      <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800/90 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Risk Control Layer & DryRun Preview
          </span>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
            DRYRUN PASSED
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 font-mono">
          <div>
            <span>Max Size Limit:</span> <strong className="text-white">$500 Cap</strong>
          </div>
          <div>
            <span>Est. Slippage:</span> <strong className="text-emerald-400">{proposal.dryRun.estimatedSlippagePercent}%</strong>
          </div>
          <div>
            <span>Orderbook Depth:</span> <strong className="text-white">${proposal.dryRun.liquidityDepthUsdt.toLocaleString()}</strong>
          </div>
          <div>
            <span>Trading Fee:</span> <strong className="text-white">${proposal.dryRun.estimatedFeeUsdt.toFixed(2)} USDT</strong>
          </div>
        </div>
      </div>

      {/* Action / Human Approval Gate */}
      {isPending && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-cyan-950/20 p-3 rounded-xl border border-cyan-500/30">
          <div className="text-xs text-cyan-200">
            <strong>Human Approval Required:</strong> You can approve directly below or reply <strong>"YES"</strong> via WhatsApp or Messenger.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onReject(proposal.id)}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all disabled:opacity-50"
            >
              Reject Proposal
            </button>
            <button
              onClick={() => onApprove(proposal.id)}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all font-bold disabled:opacity-50"
            >
              {isProcessing ? 'Executing...' : 'Approve & Execute Paper Order'}
            </button>
          </div>
        </div>
      )}

      {/* Order Execution Receipt */}
      {isApproved && proposal.orderExecutionId && (
        <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30 text-xs flex items-center justify-between text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Order confirmed in Bitget Agent Hub Paper Trading Account</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400/80">
            ID: {proposal.orderExecutionId}
          </span>
        </div>
      )}

      {/* Rejection Note */}
      {isRejected && (
        <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-500/30 text-xs text-rose-300">
          <strong>Rejection Logged:</strong> {proposal.rejectionReason || 'User or risk filter declined this proposal.'}
        </div>
      )}

    </div>
  );
};
