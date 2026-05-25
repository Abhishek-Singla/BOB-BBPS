import React, { useState } from 'react';
import { Biller, Transaction, Complaint } from '../types';
import { Phone, Search, FileText, CheckCircle, Smartphone, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Download, RefreshCw } from 'lucide-react';
import { maskName } from '../data';

interface CustomerPortalProps {
  billers: Biller[];
  onAddNewTransaction: (newTx: Transaction) => void;
  onRaiseComplaint: (complaint: Complaint) => void;
}

// Mock Consumer Register for Auto-Fetch simulation
const MOCK_CONSUMERS: Record<string, { name: string; amount: number }> = {
  'CON-MUM-1002': { name: 'Shrikant Deshmukh', amount: 2450.00 },
  'CON-BOB-2005': { name: 'Meenakshi Iyer', amount: 1120.00 },
  'CON-TNE-3009': { name: 'Anantha Raghavan', amount: 850.00 },
  'CON-GEN-9090': { name: 'Gopal Sreenivasan', amount: 3120.00 },
};

export default function CustomerPortal({
  billers,
  onAddNewTransaction,
  onRaiseComplaint
}: CustomerPortalProps) {
  // Navigation
  const [couTab, setCouTab] = useState<'quick-pay' | 'raise-complaint'>('quick-pay');

  // Fetch State
  const [selectedBillerId, setSelectedBillerId] = useState(billers[0]?.id || '');
  const [consumerId, setConsumerId] = useState('CON-MUM-1002');
  const [fetchState, setFetchState] = useState<'idle' | 'fetching' | 'success' | 'failed'>('idle');
  const [fetchedBill, setFetchedBill] = useState<{ name: string; amount: number } | null>(null);

  // Payment State
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Net Banking' | 'Debit Card' | 'Cash'>('UPI');
  const [paidTx, setPaidTx] = useState<Transaction | null>(null);

  // Complaint form state
  const [complaintTxnId, setComplaintTxnId] = useState('');
  const [complaintType, setComplaintType] = useState<'Double Debit' | 'Bill Amount Mismatch' | 'Payment Not Credited' | 'Technical Error'>('Double Debit');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintMessage, setComplaintMessage] = useState('');

  const currentBiller = billers.find(b => b.id === selectedBillerId) || billers[0];

  const handleBillFetch = (e: React.FormEvent) => {
    e.preventDefault();
    setFetchState('fetching');
    setPaidTx(null);

    setTimeout(() => {
      const match = MOCK_CONSUMERS[consumerId.toUpperCase().trim()];
      if (match) {
        setFetchedBill({
          name: match.name,
          amount: match.amount
        });
        setFetchState('success');
      } else {
        // Fallback random generation to keep experience bulletproof
        const randomAmount = Math.floor(Math.random() * 2000 + 400);
        setFetchedBill({
          name: 'Shrikant Deshmukh',
          amount: randomAmount
        });
        setFetchState('success');
      }
    }, 1200);
  };

  const handlePaymentSubmit = () => {
    if (!fetchedBill) return;

    const mockTxId = 'BOB-BBPS-RE' + Math.round(Math.random() * 900000 + 100000);
    const mockRrn = '614502' + Math.round(Math.random() * 900000 + 100000);

    const transaction: Transaction = {
      id: mockTxId,
      rrn: mockRrn,
      billerId: selectedBillerId,
      billerName: currentBiller.name,
      customerName: fetchedBill.name,
      customerMobile: '9845012354',
      amount: fetchedBill.amount,
      channel: 'bob World',
      paymentMode,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      reconStatus: 'RECONCILED',
      repushAttempts: 0,
      acknowledgedByBiller: true
    };

    onAddNewTransaction(transaction);
    setPaidTx(transaction);
    setFetchedBill(null);
    setFetchState('idle');
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTxnId.trim() || !complaintDesc.trim()) return;

    const matchedTx = MOCK_CONSUMERS[complaintTxnId]; // dummy check or fallback
    
    const newComplaint: Complaint = {
      id: 'CMP-2026-' + Math.round(Math.random() * 90000 + 10000),
      txnId: complaintTxnId,
      billerName: 'BBPS Core Billing Desk',
      type: complaintType,
      status: 'OPEN',
      dateRaised: new Date().toISOString(),
      description: complaintDesc,
    };

    onRaiseComplaint(newComplaint);
    setComplaintTxnId('');
    setComplaintDesc('');
    setComplaintMessage(`Complaint raised successfully in NPCI CANVAS Portal: Reference ID ${newComplaint.id}. Expected resolution TAT: 24 Hours.`);
    setTimeout(() => setComplaintMessage(''), 5000);
  };

  return (
    <div className="space-y-6" id="customer-portal-cou">
      {/* Mobile Frame Container (Aesthetic representation) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mock bob World Smartphone Screen */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg border-4 border-slate-800 max-w-xl mx-auto relative overflow-hidden">
            {/* Phone Top Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-800 w-32 h-4 rounded-b-xl z-20" />
            
            {/* Phone Header Block */}
            <div className="flex justify-between items-center text-xs font-mono mb-4 pt-2">
              <span className="text-orange-400 font-bold scale-90">bob World Channel</span>
              <div className="flex gap-2 text-[10px] text-slate-400">
                <span>5G &bull; 99%</span>
                <span className="text-emerald-400">&bull; Secure</span>
              </div>
            </div>

            {/* Inner Dashboard View */}
            <div className="bg-slate-950 rounded-2xl p-4 min-h-96 space-y-4 text-slate-100 font-sans">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-semibold tracking-wide font-display">BBPS Quick Pay</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded-md">BOU-COU Bridge</span>
              </div>

              {/* Subnavigation inside app */}
              <div className="flex bg-slate-900 p-1 rounded-lg text-xs justify-center font-mono">
                <button
                  onClick={() => setCouTab('quick-pay')}
                  className={`flex-1 py-1 rounded text-center transition-all ${couTab === 'quick-pay' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  Bill Fetch & Pay
                </button>
                <button
                  onClick={() => setCouTab('raise-complaint')}
                  className={`flex-1 py-1 rounded text-center transition-all ${couTab === 'raise-complaint' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  NPCI CANVAS CMS
                </button>
              </div>

              {couTab === 'quick-pay' && (
                <div className="space-y-4">
                  {fetchState === 'idle' && !paidTx && (
                    <form onSubmit={handleBillFetch} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Select Utility Category</label>
                        <select
                          value={selectedBillerId}
                          onChange={(e) => setSelectedBillerId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-250 focus:outline-hidden focus:border-orange-500"
                        >
                          {billers.filter(b => b.status === 'ACTIVE').map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Consumer Acc No</label>
                          <span className="text-[9px] text-orange-400 font-mono">Simulate: CON-MUM-1002</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={consumerId}
                          onChange={(e) => setConsumerId(e.target.value)}
                          placeholder="CON-MUM-1002"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-orange-500 font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Auto-Fetch Outstandings
                      </button>
                    </form>
                  )}

                  {fetchState === 'fetching' && (
                    <div className="py-12 text-center text-slate-400 font-mono space-y-3">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent animate-spin rounded-full mx-auto" />
                      <p className="text-xs">Connecting with secure Biller Operating Unit (BOU)...</p>
                      <p className="text-[10px] text-slate-600">Resolving parameter keys via HSM static-dynamic bridge</p>
                    </div>
                  )}

                  {fetchState === 'success' && fetchedBill && (
                    <div className="space-y-4 animate-slideUp">
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                          <span>Auto-Fetch Complete: Verified</span>
                          <span className="text-[10px] bg-indigo-950 text-indigo-300 font-medium px-2 py-0.5 rounded-full">Secured via TLS1.3</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-1">Consumer: {fetchedBill.name}</h4>
                        <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
                          <span className="text-xs text-slate-400">Total Bill Due Quantity:</span>
                          <span className="text-xl font-bold font-mono text-orange-400">Rs. {fetchedBill.amount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Preferred Payment Channel</label>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                          <button
                            onClick={() => setPaymentMode('UPI')}
                            className={`p-2 rounded-lg border text-center transition-all ${paymentMode === 'UPI' ? 'bg-orange-600/20 border-orange-500 text-white font-bold' : 'bg-slate-900 border-slate-850 hover:bg-slate-800'}`}
                          >
                            BHIM Baroda UPI
                          </button>
                          <button
                            onClick={() => setPaymentMode('Net Banking')}
                            className={`p-2 rounded-lg border text-center transition-all ${paymentMode === 'Net Banking' ? 'bg-orange-600/20 border-orange-500 text-white font-bold' : 'bg-slate-900 border-slate-850 hover:bg-slate-800'}`}
                          >
                            Net Banking Login
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => { setFetchedBill(null); setFetchState('idle'); }}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 font-medium rounded-lg text-xs leading-normal transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handlePaymentSubmit}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs uppercase leading-normal tracking-wide transition-all"
                        >
                          Authorize Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Receipt Renders */}
                  {paidTx && (
                    <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl space-y-4 animate-slideUp">
                      <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs font-mono">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        BILL PAYMENT RECOGNIZED BY BBOPU
                      </div>
                      
                      <div className="text-xs space-y-2 border-t border-b border-slate-800 py-3 font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-500">BBPS Ref ID</span>
                          <span className="text-slate-200 font-bold text-[11px]">{paidTx.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Biller Desk Name</span>
                          <span className="text-slate-200 font-sans">{paidTx.billerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Customer name</span>
                          <span className="text-slate-200 font-sans">{paidTx.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Payment sum total</span>
                          <span className="text-orange-400 font-bold">Rs. {paidTx.amount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 text-[10px] text-slate-400 pt-1 justify-between">
                        <span>Authorized via bob World</span>
                        <button 
                          onClick={() => alert(`[DOWNLOAD SIMULATION] BBPS receipt downloaded successfully to local files.`)}
                          className="text-orange-400 hover:text-orange-300 font-mono font-medium flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF Copy
                        </button>
                      </div>

                      <button
                        onClick={() => setPaidTx(null)}
                        className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono"
                      >
                        Make another Bill Payment
                      </button>
                    </div>
                  )}
                </div>
              )}

              {couTab === 'raise-complaint' && (
                <form onSubmit={handleComplaintSubmit} className="space-y-3 font-sans animate-slideUp">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Transaction Ref ID / SKU</label>
                    <input
                      type="text"
                      required
                      value={complaintTxnId}
                      onChange={(e) => setComplaintTxnId(e.target.value)}
                      placeholder="e.g. BOB-BBPS-RE293023"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Incident category</label>
                    <select
                      value={complaintType}
                      onChange={(e) => setComplaintType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-hidden focus:border-orange-500"
                    >
                      <option>Double Debit</option>
                      <option>Bill Amount Mismatch</option>
                      <option>Payment Not Credited</option>
                      <option>Technical Error</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Detailed issue Description</label>
                    <textarea
                      required
                      rows={3}
                      value={complaintDesc}
                      onChange={(e) => setComplaintDesc(e.target.value)}
                      placeholder="Include details about double debit, date of event, failure codes, etc."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-orange-500 resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs uppercase tracking-wide tracking-wider transition-all"
                  >
                    Post Dispute to CANVAS Console
                  </button>

                  {complaintMessage && (
                    <div className="p-3 bg-amber-950/40 border border-amber-900/50 text-amber-200 rounded-lg text-[11px] font-sans leading-relaxed">
                      {complaintMessage}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel: NPCI Regulatory Guidelines */}
        <div className="space-y-4">
          <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-4 block">
            <h4 className="font-display font-medium text-slate-850 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              BBPCU Customer Service SLA
            </h4>
            
            <div className="space-y-3.5 text-xs text-slate-500 font-sans leading-normal">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5">
                <p className="font-semibold text-slate-705 uppercase font-mono text-[9px] tracking-wider text-orange-600">Dispute Management</p>
                <p>NPCI mandates that disputed failed transactions must be tracked, logged, and updated in <strong>CANVAS</strong> instantly.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5">
                <p className="font-semibold text-slate-705 uppercase font-mono text-[9px] tracking-wider text-orange-600 font-mono">Auto-Refund Policy</p>
                <p>For double-debits (confirmed technical failures), online refund APIs are auto-hit to reverse account balances in <strong>T+1 cycles</strong> with zero manual intervention (page 60).</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5">
                <p className="font-semibold text-slate-705 uppercase font-mono text-[9px] tracking-wider text-orange-600 font-mono">Biller List Sync</p>
                <p>Outbox biller indexes are automatically updated against NPCI master directories hourly to shield transactions from stale endpoints.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
