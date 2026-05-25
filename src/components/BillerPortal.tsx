import React, { useState } from 'react';
import { Biller, Transaction } from '../types';
import { CheckCircle2, ChevronRight, Upload, Search, Download, CreditCard, Award, HelpCircle, FileSpreadsheet, Heart } from 'lucide-react';
import { maskMobile } from '../data';

interface BillerPortalProps {
  billers: Biller[];
  transactions: Transaction[];
  onAddNewTransaction: (newTx: Transaction) => void;
}

export default function BillerPortal({
  billers,
  transactions,
  onAddNewTransaction
}: BillerPortalProps) {
  const [selectedBillerId, setSelectedBillerId] = useState<string>(billers[0]?.id || '');
  const [billerTab, setBillerTab] = useState<'onboarded-billers' | 'offline-upload' | 'donation-desk'>('onboarded-billers');

  // Donation Desk State (Section 80G)
  const [donorName, setDonorName] = useState('');
  const [donorMobile, setDonorMobile] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [donationAmount, setDonationAmount] = useState('10000');
  const [donationReceipt, setDonationReceipt] = useState<any | null>(null);

  // File Upload State
  const [uploadState, setUploadState] = useState<'idle' | 'parsing' | 'active'>('idle');
  const [uploadedRecords, setUploadedRecords] = useState<any[]>([]);

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState('');

  const currentBiller = billers.find(b => b.id === selectedBillerId) || billers[0];

  // Donation Submit Handler (Page 54 spec: donation category, returns 80G benefits)
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorPan.trim() || !donationAmount) return;

    const amountNum = parseFloat(donationAmount);
    const mockRefId = 'BOB-BBPS-DN' + Math.round(Math.random() * 900000 + 100000);
    const mockRrn = '614502' + Math.round(Math.random() * 900000 + 100000);

    // Create a client transaction for it
    const donationTx: Transaction = {
      id: mockRefId,
      rrn: mockRrn,
      billerId: 'BIL-ETH-005',
      billerName: 'Vidarbha Educational Trust (Donations)',
      customerName: donorName,
      customerMobile: donorMobile,
      amount: amountNum,
      channel: 'bob World',
      paymentMode: 'UPI',
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      reconStatus: 'RECONCILED',
      repushAttempts: 0,
      acknowledgedByBiller: true
    };

    onAddNewTransaction(donationTx);

    // Construct 80G tax receipt payload
    setDonationReceipt({
      refId: mockRefId,
      rrn: mockRrn,
      donor: donorName,
      pan: donorPan.toUpperCase(),
      amount: amountNum,
      taxWaiver: amountNum * 0.5, // 50% waiver under Sec 80G
      timestamp: new Date().toLocaleString(),
    });

    // Reset fields
    setDonorName('');
    setDonorMobile('');
    setDonorPan('');
  };

  // Upload Offline File Simulation (Page 54 spec: parsing of presentment files with GST/Fee computations)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadState('parsing');
    setTimeout(() => {
      // Mock rows
      const parsed = [
        { accountNo: 'CON-100293041', consumerName: 'Girish Kulkarni', amount: 3500, dueDate: '2026-06-15' },
        { accountNo: 'CON-100293042', consumerName: 'Vasundhara Shinde', amount: 1850, dueDate: '2026-06-15' },
        { accountNo: 'CON-100293043', consumerName: 'Deepak Sawant', amount: 5200, dueDate: '2026-06-12' },
        { accountNo: 'CON-100293044', consumerName: 'Shaila Deshpande', amount: 940, dueDate: '2026-06-20' },
      ];
      setUploadedRecords(parsed);
      setUploadState('active');
    }, 1500);
  };

  // GST of 18% applies on the fixed service fee
  const calculateFeesForUpload = (amount: number) => {
    const feeRate = currentBiller ? currentBiller.fixedFee : 0.012;
    const baseFee = amount * feeRate;
    const gstValue = baseFee * 0.18;
    return {
      baseFee: parseFloat(baseFee.toFixed(2)),
      gst: parseFloat(gstValue.toFixed(2)),
      total: parseFloat((baseFee + gstValue).toFixed(2))
    };
  };

  const totalUploadedAmount = uploadedRecords.reduce((acc, curr) => acc + curr.amount, 0);
  const totalUploadedFees = uploadedRecords.reduce((acc, curr) => {
    const feeInfo = calculateFeesForUpload(curr.amount);
    return acc + feeInfo.total;
  }, 0);

  const filteredBillerTransactions = transactions.filter(tx => {
    if (tx.billerId !== selectedBillerId) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      tx.customerName.toLowerCase().includes(q) ||
      tx.id.toLowerCase().includes(q) ||
      tx.rrn.includes(q)
    );
  });

  return (
    <div className="space-y-6" id="biller-portal-section">
      {/* Selector of Active Biller */}
      <div className="bg-white p-4 border border-slate-100 shadow-xs rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5">
          <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Select Biller Profile Context</label>
          <select
            value={selectedBillerId}
            onChange={(e) => setSelectedBillerId(e.target.value)}
            className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-semibold focus:outline-hidden focus:border-orange-500"
          >
            {billers.filter(b => b.status === 'ACTIVE').map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
            ))}
          </select>
        </div>

        {/* Biller info snippet */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs text-slate-500 font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold leading-normal">Category Mapping</span>
            <span className="font-bold text-slate-700">{currentBiller?.category}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold leading-normal font-mono">Mapped Transaction Fee</span>
            <span className="font-bold text-slate-700">{(currentBiller?.fixedFee * 100).toFixed(1)}% + GST</span>
          </div>
          <div className="hidden md:block">
            <span className="text-[10px] text-slate-400 block font-semibold leading-normal font-mono">Audit Auth Level</span>
            <span className="font-bold text-emerald-600">Checker Approved</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-lg gap-2 text-slate-600 self-start">
        <button
          onClick={() => setBillerTab('onboarded-billers')}
          className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-medium rounded-md transition-all ${billerTab === 'onboarded-billers' ? 'bg-white text-orange-600 font-semibold shadow-xs' : 'hover:text-slate-800'}`}
        >
          Transaction History
        </button>
        <button
          onClick={() => setBillerTab('offline-upload')}
          className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-medium rounded-md transition-all ${billerTab === 'offline-upload' ? 'bg-white text-orange-600 font-semibold shadow-xs' : 'hover:text-slate-800'}`}
        >
          Upload Offline Presentments
        </button>
        <button
          onClick={() => setBillerTab('donation-desk')}
          className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-medium rounded-md transition-all ${billerTab === 'donation-desk' ? 'bg-white text-orange-600 font-semibold shadow-xs' : 'hover:text-slate-800'}`}
        >
          Donation (Sec 80G Receipts)
        </button>
      </div>

      {/* Panels */}
      {billerTab === 'onboarded-billers' && (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="font-display font-medium text-slate-800 text-sm">Onboarded Biller Transactions</h3>
            
            <div className="relative w-full max-w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by consumer name or BBPS Ref / RRN..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 text-slate-700"
              />
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-2.5 top-1.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 font-mono">
              <thead className="text-[10px] uppercase text-slate-400 border-b border-slide-100">
                <tr>
                  <th className="py-2">BBPS Ref ID / RRN</th>
                  <th className="py-2">Consumer</th>
                  <th className="py-2 text-right">Payment Amount</th>
                  <th className="py-2">Mode / Channel</th>
                  <th className="py-2">Recon Cycle</th>
                  <th className="py-2 text-right">Fixed Fee + GST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBillerTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                      No matching transaction files found for the selected biller and query.
                    </td>
                  </tr>
                ) : (
                  filteredBillerTransactions.map(tx => {
                    const feeInfo = calculateFeesForUpload(tx.amount);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="py-3">
                          <p className="font-bold text-slate-700">{tx.id}</p>
                          <p className="text-[9px] text-slate-400">RRN: {tx.rrn}</p>
                        </td>
                        <td className="py-3 font-sans">
                          <p className="font-medium text-slate-800">{tx.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{maskMobile(tx.customerMobile)}</p>
                        </td>
                        <td className="py-3 text-right font-bold text-slate-800 font-mono">
                          Rs. {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3">
                          <p className="text-slate-700">{tx.paymentMode}</p>
                          <p className="text-[10px] text-slate-400">{tx.channel}</p>
                        </td>
                        <td className="py-3">
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${tx.reconStatus === 'RECONCILED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                            {tx.reconStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-slate-500">
                          Rs. {feeInfo.total.toFixed(2)}
                          <span className="block text-[8px] text-slate-400">Fee: {feeInfo.baseFee} | GST: {feeInfo.gst}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {billerTab === 'offline-upload' && (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-5 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="font-display font-medium text-slate-800 text-base">Bulk Presentment Upload Module</h3>
            <p className="text-xs text-slate-500">Submit bulk consumer bills offline (MHD cycle csv format). Parameters like fixed transaction commissions & GST are generated dynamically (page 54 RFP).</p>
          </div>

          <div className="border-2 border-dashed border-slate-200 hover:border-orange-300 rounded-xl p-8 text-center transition-all bg-slate-50/50">
            <input
              type="file"
              id="csv-file-upload-input"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadState === 'idle' && (
              <label htmlFor="csv-file-upload-input" className="cursor-pointer space-y-3 block">
                <Upload className="w-10 h-10 text-slate-400 mx-auto" strokeWidth={1.5} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 uppercase">Browse & Select consumer billing CSV</p>
                  <p className="text-[10px] text-slate-400 font-mono">Expected: CustomerID, Name, Billing Amount, Grace Date</p>
                </div>
              </label>
            )}

            {uploadState === 'parsing' && (
              <div className="space-y-3 py-4">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent animate-spin rounded-full mx-auto" />
                <p className="text-xs font-mono text-slate-500">Decrypting & validating bulk records via Core Bank Bridge...</p>
              </div>
            )}

            {uploadState === 'active' && (
              <div className="space-y-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-800 uppercase">Static Validation Successful</p>
                  <p className="text-[10px] text-slate-500 font-mono">Parsed {uploadedRecords.length} records. System checksum generated successfully.</p>
                </div>
                <label htmlFor="csv-file-upload-input" className="inline-block py-1 px-3 border border-slate-200 rounded text-[11px] text-slate-600 hover:bg-slate-50 cursor-pointer">
                  Replace File
                </label>
              </div>
            )}
          </div>

          {uploadState === 'active' && (
            <div className="space-y-4 pt-4 border-t border-slate-100 animate-slideUp">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Consumer Volume</span>
                  <span className="text-base font-bold font-mono text-slate-800">Rs. {totalUploadedAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Projected Fixed Commission</span>
                  <span className="text-base font-bold font-mono text-slate-800">Rs. {totalUploadedFees.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Compliance Hash Status</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full inline-block font-mono tracking-wider">SECURE SHIELDED</span>
                </div>
              </div>

              {/* Parsed entries preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-600 uppercase font-mono">Parsed Record Line Preview</h4>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-[11px] text-left text-slate-600 font-mono">
                    <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase">
                      <tr>
                        <th className="p-2">Account No</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Amt</th>
                        <th className="p-2 text-right">Mapped Fee + GST (18%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {uploadedRecords.map((rec, i) => {
                        const recFees = calculateFeesForUpload(rec.amount);
                        return (
                          <tr key={i}>
                            <td className="p-2 py-1.5 font-bold">{rec.accountNo}</td>
                            <td className="p-2 py-1.5 font-sans">{rec.consumerName}</td>
                            <td className="p-2 py-1.5 font-bold">Rs. {rec.amount}</td>
                            <td className="p-2 py-1.5 text-right text-slate-500">Rs. {recFees.total} <span className="text-[9px] text-slate-400">(incl. {recFees.gst} GST)</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {billerTab === 'donation-desk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
          {/* Donation Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="font-display font-medium text-slate-800 text-sm flex items-center gap-1.5">
                <Heart className="w-4.5 h-4.5 text-orange-500" />
                Donation category processing desk
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                For non-presentment billers (page 54). Generates 50% waiver receipts under section 80G of the Indian income tax act dynamically.
              </p>
            </div>

            <form onSubmit={handleDonationSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Donor Human Name</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra Verma"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Donor Mobile</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={donorMobile}
                    onChange={(e) => setDonorMobile(e.target.value)}
                    placeholder="9988112233"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 text-slate-700 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">PAN Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={donorPan}
                    onChange={(e) => setDonorPan(e.target.value)}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 text-slate-700 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Donation Amount (INR)</label>
                <select
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 bg-white text-slate-700 font-mono"
                >
                  <option value="5000">Rs. 5,000</option>
                  <option value="10000">Rs. 10,000</option>
                  <option value="25000">Rs. 25,000</option>
                  <option value="50000">Rs. 50,000</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg text-xs leading-normal transition-all uppercase tracking-wide"
              >
                Validate Donation & Generate Tax Receipt
              </button>
            </form>
          </div>

          {/* Receipt View on success */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-xl block shadow-xs space-y-4 relative overflow-hidden border border-slate-800">
            {/* Decors */}
            <div className="absolute top-0 right-0 p-3 text-[10px] text-orange-400 font-mono">
              VERIFIED
            </div>

            <h3 className="font-display text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Section 80G Certificate Portal</h3>

            {donationReceipt ? (
              <div className="space-y-3.5 divide-y divide-slate-800 text-xs animate-slideUp">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 font-mono">DONATION SUCCESSFUL</p>
                  <h4 className="text-sm font-bold text-white">Vidarbha Educational Trust</h4>
                  <p className="text-[11px] text-slate-400">Reg No: BOB-BBPS-DIPP-1029</p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Donor Name</span>
                    <span className="text-white font-sans">{donationReceipt.donor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">PAN ID</span>
                    <span className="text-white">{donationReceipt.pan}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">BBPS Ref Trans ID</span>
                    <span className="text-orange-400 text-[10px]">{donationReceipt.refId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Date Generated</span>
                    <span className="text-white text-[10px]">{donationReceipt.timestamp}</span>
                  </div>
                </div>

                <div className="pt-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Paid Donation sum:</span>
                    <span className="text-white font-bold">Rs. {donationReceipt.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono border-t border-dashed border-slate-800 pt-1.5">
                    <span className="text-emerald-400 font-semibold font-sans">80G Tax Deductible (50%):</span>
                    <span className="text-emerald-400 font-bold">Rs. {donationReceipt.taxWaiver.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Digitally Executed by BOB-HSM</span>
                  <button 
                    onClick={() => alert(`[SIMULATED RECIEPT DOWNLOAD] Document saved successfully to local downloads.`)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-mono font-medium flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 space-y-2 font-display">
                <Award className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-sm font-medium text-slate-300">Awaiting Donation Validation</p>
                <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">Fill in the donor PAN and Amount to compile a compliant Section 80G benefit receipt.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
