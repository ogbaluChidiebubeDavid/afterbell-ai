import React, { useState } from 'react';
import { Download, FileText, Filter, CheckCircle2, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { TradeProposal, HumanApprovalStatus } from '@/types/proposals';

interface AuditLogTableProps {
  proposals: TradeProposal[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ proposals }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredProposals = proposals.filter((p) => {
    if (filter === 'APPROVED') return p.humanApprovalStatus === 'APPROVED';
    if (filter === 'REJECTED') return p.humanApprovalStatus === 'REJECTED';
    if (filter === 'PENDING') return p.humanApprovalStatus === 'PENDING_APPROVAL';
    return true;
  });

  const handleDownloadCsv = () => {
    window.open('/api/export?format=csv', '_blank');
  };

  const handleDownloadJson = () => {
    window.open('/api/export?format=json', '_blank');
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
      
      {/* Table Header & Download Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Decision Explainability Audit Log (Judge Review Surface)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full audit trail of approved, executed, and rejected proposals demonstrating risk control and pricing rationale
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 flex items-center gap-1 font-medium mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {['ALL', 'APPROVED', 'REJECTED', 'PENDING'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg transition-all font-semibold ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {f} ({
              f === 'ALL' ? proposals.length :
              f === 'APPROVED' ? proposals.filter(p => p.humanApprovalStatus === 'APPROVED').length :
              f === 'REJECTED' ? proposals.filter(p => p.humanApprovalStatus === 'REJECTED').length :
              proposals.filter(p => p.humanApprovalStatus === 'PENDING_APPROVAL').length
            })
          </button>
        ))}
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 text-[10px] uppercase font-mono">
              <th className="pb-3">Timestamp</th>
              <th className="pb-3">Asset</th>
              <th className="pb-3">Direction</th>
              <th className="pb-3">Size (USDT)</th>
              <th className="pb-3">Confidence</th>
              <th className="pb-3">Risk Gate</th>
              <th className="pb-3">Approval Status</th>
              <th className="pb-3">Decision Rationale & Explainability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredProposals.map((p) => {
              const isApproved = p.humanApprovalStatus === 'APPROVED';
              const isRejected = p.humanApprovalStatus === 'REJECTED';
              const isRiskPassed = p.riskCheckStatus === 'PASSED';

              return (
                <tr key={p.id} className="hover:bg-slate-950/40 align-top">
                  <td className="py-3 text-slate-400 font-mono whitespace-nowrap">
                    {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 font-bold text-white font-mono">
                    {p.asset}
                    <span className="text-[10px] text-slate-500 block font-sans">{p.underlying}</span>
                  </td>
                  <td className="py-3 font-mono">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      p.direction === 'LONG' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {p.direction}
                    </span>
                  </td>
                  <td className="py-3 text-slate-200 font-mono font-semibold">
                    ${p.positionSizeUsdt.toFixed(2)}
                  </td>
                  <td className="py-3 font-mono">
                    <span className={`font-bold ${p.confidenceScore >= 75 ? 'text-cyan-400' : 'text-rose-400'}`}>
                      {p.confidenceScore}%
                    </span>
                  </td>
                  <td className="py-3">
                    {isRiskPassed ? (
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-medium font-mono">
                        <CheckCircle2 className="w-3 h-3" /> Passed
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 text-[11px] font-medium font-mono">
                        <ShieldAlert className="w-3 h-3" /> Blocked
                      </span>
                    )}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    {isApproved && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Executed (Paper)
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Rejected
                      </span>
                    )}
                    {p.humanApprovalStatus === 'PENDING_APPROVAL' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        Pending User
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-slate-300 text-[11px] max-w-md">
                    <p className="font-medium text-slate-200">{p.rationale.coreThesis}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5 italic">
                      Edge: {p.rationale.afterHoursInformationGap}
                    </p>
                    {isRejected && (
                      <p className="text-rose-300 text-[10px] mt-1 font-mono">
                        Rejection reason: {p.rejectionReason || p.riskRejectionReason}
                      </p>
                    )}
                    {isApproved && p.orderExecutionId && (
                      <p className="text-emerald-400 text-[10px] mt-1 font-mono">
                        Bitget Paper Order ID: {p.orderExecutionId}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
