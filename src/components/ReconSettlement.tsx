import React, { useState } from 'react';
import { Transaction } from '../types';
import { RefreshCw, Play, Download, AlertTriangle, FileSpreadsheet, CheckCircle2, ChevronRight, Settings } from 'lucide-react';

interface ReconSettlementProps {
  transactions: Transaction[];
  onTriggerRecon: () => void;
  onUpdateTransactionStatus: (id: string, update: Partial<Transaction>) => void;
}

export default function ReconSettlement({
  transactions,
  onTriggerRecon,
  onUpdateTransactionStatus
}: ReconSettlementProps) {
  const [reconState, setReconState] = useState<'idle' | 'matching' | 'reconciled'>('idle');
  const [repushProgress, setRepushProgress] = useState<string | null>(null);
  const [retryLimit, setRetryLimit] = useState<number>(3);
  const [showTtumPreview, setShowTtumPreview] = useState<any | null>(null);

  const exceptions = transactions.filter(tx => tx.reconStatus === 'EXCEPTION');
  const reconciled = transactions.filter(tx => tx.reconStatus === 'RECONCILED');

  const startReconciliationLoop = () => {
    setReconState('matching');
    setTimeout(() => {
      onTriggerRecon();
      setReconState('reconciled');
    }, 1500);
  };

  const executeAutoRepush = (txnId: string) => {
    setRepushProgress(txnId);
    setTimeout(() => {
      onUpdateTransactionStatus(txnId, {
        reconStatus: 'RECONCILED',
        acknowledgedByBiller: true,
        repushAttempts: 2
      });
      setRepushProgress(null);
      alert(`[SIMULATED RE-PUSH] Transaction ${txnId} successfully acknowledged by biller on 2nd attempt. TTUM settlement file cleared.`);
    }, 1200);
  };

  const generateAndDownloadTtum = () => {
    // Generate a core banking standard TTUM layout (Bank of Baroda values)
    // TTUM contains: Dr/Cr Account, Account Number, Branch Code, CCY, Dr/Cr Amount, Txn Particulars, GST code etc.
    const entries = transactions.filter(t => t.status === 'SUCCESS').map((t, idx) => {
      const isEven = idx % 2 === 0;
      const drAccount = '9012010293041'; // Host Channel Pool Account
      const crAccount = '29040400000417'; // BOB BBPS settlement account (from page 9 spec)
      const amtStr = t.amount.toFixed(2).padStart(15, '0');
      
      return `DR|${drAccount}|MUM-BKC|INR|${amtStr}|BBPS-SETTLE-FEES-DR|${t.id}\nCR|${crAccount}|MUM-BKC|INR|${amtStr}|BBPS-SETTLE-COMM-CR|${t.id}`;
    });

    const fileContent = `BOB-BBPS-CORE-TTUM-FILE\nDATE:${new Date().toISOString().split('T')[0]}\nSECURITY_HASH:BOB_HSM_91FA2D3\n------------------------------------------------------------\n` + entries.join('\n');
    
    setShowTtumPreview(fileContent);

    // Mock direct download
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BOB_BBPS_TTUM_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6" id="recon-settlement-engine">
      {/* Configuration Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-medium text-slate-800 text-base">T+1 Automated Reconciliation Controls</h3>
            <p className="text-xs text-slate-500 font-sans">Compare NPCI settlement files against local core journals, reconcile onus entries, and calculate GST commissions (page 61).</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs leading-normal">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold leading-normal mr-1.5">Max Retries:</span>
              <input
                type="number"
                min={1}
                max={5}
                value={retryLimit}
                onChange={(e) => setRetryLimit(parseInt(e.target.value) || 3)}
                className="w-10 text-center font-bold bg-white border border-slate-200 rounded text-slate-700 font-mono focus:outline-hidden"
              />
            </div>

            <button
              onClick={startReconciliationLoop}
              disabled={reconState === 'matching'}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reconState === 'matching' ? 'animate-spin' : ''}`} />
              Run Auto-Recon Cycle
            </button>
          </div>
        </div>

        {/* Dynamic Progress indicator during match */}
        {reconState === 'matching' && (
          <div className="p-4 bg-orange-50 border border-orange-200/50 rounded-lg text-xs font-mono space-y-2 text-slate-700 animate-pulse">
            <p className="font-semibold text-orange-850">EXECUTING MULTI-CHANNEL RECONCILIATION MATCHING...</p>
            <div className="w-full bg-orange-200/30 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-600 h-full w-2/3 rounded-full animate-progress" />
            </div>
            <p className="text-[10px] text-orange-600">Resolving ON-US and OFF-US logs against NPCI settlement file cycle...</p>
          </div>
        )}
      </div>

      {/* Exceptional and Reconciled Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Exception Logs Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-xs space-y-4">
            <h4 className="font-display font-medium text-slate-800 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
              Exception Ledger ({exceptions.length})
            </h4>

            {exceptions.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 border border-dashed border-slate-150 rounded-xl space-y-1">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-500 font-medium font-sans">Zero Outstanding Errors</p>
                <p className="text-[9px] text-slate-400">All entries fully settled with NPCI files.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {exceptions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-rose-50/25 border border-rose-100 rounded-lg space-y-2">
                    <div className="flex justify-between items-start text-[10px] font-mono">
                      <span className="font-bold text-rose-800">{tx.id}</span>
                      <span className="text-rose-500 font-bold uppercase">Decline Outbox</span>
                    </div>

                    <div className="text-xs space-y-1 font-sans">
                      <p className="font-bold text-slate-800">Consumer: {tx.customerName}</p>
                      <p className="text-slate-600 font-mono text-[11px]">Due Sum: Rs. {tx.amount.toLocaleString()}</p>
                      <p className="text-rose-600 font-mono text-[10px] bg-white border border-rose-100 p-1.5 rounded mt-1.5 leading-relaxed">
                        Reason: {tx.declineReason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-rose-100/50 flex gap-2 justify-end">
                      <button
                        onClick={() => executeAutoRepush(tx.id)}
                        disabled={repushProgress === tx.id}
                        className="py-1 px-2 text-[10px] bg-orange-600 hover:bg-orange-700 text-white rounded font-bold font-mono tracking-wide uppercase leading-normal"
                      >
                        {repushProgress === tx.id ? 'Re-pushing...' : 'Auto Re-push'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reconciled Logs Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-medium text-slate-800 text-sm">
                Cleared & Mapped Pool ({reconciled.length})
              </h4>

              <button
                onClick={generateAndDownloadTtum}
                className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Compile TTUM Settle File
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 font-mono">
                <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-2">Tx Ref ID / RRN</th>
                    <th className="py-2">Muted Biller</th>
                    <th className="py-2 text-right">Sum settled</th>
                    <th className="py-2 text-right">Retry Counts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reconciled.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50">
                      <td className="py-3">
                        <p className="font-bold text-slate-700">{tx.id}</p>
                        <p className="text-[9px] text-slate-400">RRN: {tx.rrn}</p>
                      </td>
                      <td className="py-3 font-sans font-medium text-slate-800">{tx.billerName}</td>
                      <td className="py-3 text-right font-bold text-slate-800 font-mono">Rs. {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 text-right font-bold font-mono text-emerald-600">
                        {tx.repushAttempts > 0 ? (
                          <span className="text-mono font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">Retry x{tx.repushAttempts}</span>
                        ) : (
                          <span className="text-mono font-bold text-emerald-600 font-medium">Instant Clear</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showTtumPreview && (
              <div className="p-4 bg-slate-950 text-slate-300 rounded-xl space-y-2 border border-slate-800 font-mono text-[10px] animate-slideUp">
                <div className="flex justify-between items-center text-slate-500 pb-1.5 border-b border-slate-800">
                  <span>BOB CORE BANKING TTUM PREVIEW</span>
                  <button onClick={() => setShowTtumPreview(null)} className="text-orange-400 hover:text-orange-300 font-semibold font-sans">Clear Preview</button>
                </div>
                <pre className="overflow-x-auto leading-relaxed">{showTtumPreview}</pre>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
