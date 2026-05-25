import React, { useState } from 'react';
import { Biller, AuditLog } from '../types';
import { ShieldCheck, UserCheck, Activity, Download, PlusCircle, AlertCircle, CheckCircle2, ChevronRight, Ban, RefreshCw } from 'lucide-react';

interface AdminPortalProps {
  billers: Biller[];
  onApproveBiller: (billerId: string, checkerName: string) => void;
  onAddBiller: (newBiller: Omit<Biller, 'status' | 'checkerName'>) => void;
  auditLogs: AuditLog[];
}

export default function AdminPortal({
  billers,
  onApproveBiller,
  onAddBiller,
  auditLogs
}: AdminPortalProps) {
  // Tabs inside Admin Portal
  const [activeSubTab, setActiveSubTab] = useState<'maker-checker' | 'monitoring' | 'reporting' | 'privileges'>('maker-checker');

  // Maker States (Form inputs)
  const [billerName, setBillerName] = useState('');
  const [billerCategory, setBillerCategory] = useState('Electricity');
  const [fixedFee, setFixedFee] = useState('0.012');
  const [maxLimit, setMaxLimit] = useState('1000000');
  const [makerMessage, setMakerMessage] = useState('');

  // Reporting State
  const [reportPeriod, setReportPeriod] = useState<'Hourly' | 'Daily' | 'Monthly' | 'Yearly'>('Daily');
  const [reportFormat, setReportFormat] = useState<'Excel' | 'CSV' | 'PDF' | 'TXT'>('CSV');
  const [reportOutputMsg, setReportOutputMsg] = useState('');

  // Channel Status state for alert triggers
  const [channels, setChannels] = useState([
    { name: 'bob World Mobile', status: 'ACTIVE', uptime: '99.98%', latency: '42ms' },
    { name: 'bob World Internet Post-Login', status: 'ACTIVE', uptime: '99.95%', latency: '65ms' },
    { name: 'UPI BHIM Baroda Pay', status: 'ACTIVE', uptime: '99.99%', latency: '28ms' },
    { name: 'Kiosk channel', status: 'DEGRADED', uptime: '98.54%', latency: '240ms' },
  ]);

  // Privileges List
  const [privilegeMapping, setPrivilegeMapping] = useState([
    { role: 'Bank Admin Maker', action: 'Draft Biller setup, Onboard Agent, Upload Parameters', allowed: true },
    { role: 'Bank Admin Checker', action: 'Approve Biller commercial modifications, Authorize Limits', allowed: true },
    { role: 'Biller Representative', action: 'Download custom settlement file, View transaction dashboard', allowed: true },
    { role: 'S-SOC Security Auditor', action: 'Review encryption status, Inspect HSM logs, Verify CERT-IN certs', allowed: true },
  ]);

  const handleMakerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billerName.trim()) return;

    onAddBiller({
      id: 'BIL-' + billerCategory.substring(0, 3).toUpperCase() + '-' + Math.round(Math.random() * 900 + 100),
      name: billerName,
      category: billerCategory,
      makerName: 'Abhishek Singla (Maker)',
      maxLimit: parseFloat(maxLimit),
      fixedFee: parseFloat(fixedFee),
      onboardingDate: new Date().toISOString().split('T')[0]
    });

    setBillerName('');
    setMakerMessage('Biller draft submitted to the pending Checker approval pool successfully.');
    setTimeout(() => setMakerMessage(''), 4000);
  };

  const triggerAlertEmail = (channelName: string) => {
    alert(`[SIMULATED ALERT] Notification trigger successfully sent to Configured Email Addresses (recon-alerts@bankofbaroda.co.in) regarding ${channelName} fluctuations/latency anomaly.`);
  };

  const generateReport = () => {
    setReportOutputMsg('Processing logs from highly secure HSM datastores...');
    setTimeout(() => {
      setReportOutputMsg(`SUCCESS: Mapped ${reportPeriod} compliance dataset correctly. MOCK DOWNLOAD ready: BBPS_BOB_RECON_${reportPeriod}_REPORT.${reportFormat.toLowerCase()}`);
    }, 1500);
  };

  return (
    <div className="space-y-6" id="admin-portal-dashboard">
      {/* Sub tabs header */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveSubTab('maker-checker')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${activeSubTab === 'maker-checker' ? 'border-orange-500 text-orange-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4" /> Maker-Checker Engine</span>
        </button>
        <button
          onClick={() => setActiveSubTab('monitoring')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${activeSubTab === 'monitoring' ? 'border-orange-500 text-orange-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Channel Monitoring & Downtime</span>
        </button>
        <button
          onClick={() => setActiveSubTab('reporting')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${activeSubTab === 'reporting' ? 'border-orange-500 text-orange-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <span className="flex items-center gap-1.5"><Download className="w-4 h-4" /> Comprehensive MIS Reports</span>
        </button>
        <button
          onClick={() => setActiveSubTab('privileges')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${activeSubTab === 'privileges' ? 'border-orange-500 text-orange-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Privilege & Role Management</span>
        </button>
      </div>

      {/* Sub Tab Content */}
      {activeSubTab === 'maker-checker' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
          {/* Maker Board */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-display font-medium text-slate-800 text-base flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-orange-500" />
              Onboard New Utility Biller [Maker Interface]
            </h3>
            
            <form onSubmit={handleMakerSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 font-mono">Biller Display Name</label>
                  <input
                    type="text"
                    required
                    value={billerName}
                    onChange={(e) => setBillerName(e.target.value)}
                    placeholder="e.g. Pune Gas Distrib Limited"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 font-mono">Biller Category</label>
                  <select
                    value={billerCategory}
                    onChange={(e) => setBillerCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 bg-white text-slate-700"
                  >
                    <option>Electricity</option>
                    <option>Water</option>
                    <option>Piped Gas</option>
                    <option>Municipal Taxes</option>
                    <option>Donation</option>
                    <option>Education</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 font-mono">Fixed Fee Plan (e.g. 0.01 = 1% + GST)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="0.1"
                    required
                    value={fixedFee}
                    onChange={(e) => setFixedFee(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 font-mono">Single Transaction Tx limit</label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={maxLimit}
                    onChange={(e) => setMaxLimit(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 text-slate-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg text-xs tracking-wide transition-all uppercase"
              >
                Submit Draft Biller to Checker Pool
              </button>
            </form>

            {makerMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs leading-relaxed flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {makerMessage}
              </div>
            )}
          </div>

          {/* Checker Approval Board */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-display font-medium text-slate-800 text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-500" />
              Pending System Authorizations [Checker Pool]
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {billers.filter(b => b.status === 'PENDING').length === 0 ? (
                <div className="py-12 bg-slate-50 text-center rounded-lg border border-dashed border-slate-200 space-y-1">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" strokeWidth={1.5} />
                  <p className="text-xs text-slate-500 font-medium">Clear Authorization Desk</p>
                  <p className="text-[10px] text-slate-400">All drafted billers currently verified and fully active.</p>
                </div>
              ) : (
                billers.filter(b => b.status === 'PENDING').map((biller) => (
                  <div key={biller.id} className="p-3 border border-slate-100 rounded-lg space-y-2 hover:border-orange-200 transition-colors bg-orange-50/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 scale-95 origin-left">
                          <span className="text-[10px] font-mono bg-orange-100 text-orange-800 font-medium px-1.5 py-0.5 rounded-full">{biller.category}</span>
                          <span className="text-xs font-mono text-slate-400 font-medium">{biller.id}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-1">{biller.name}</h4>
                      </div>
                      <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Awaiting Checker</span>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-50 pt-1.5 font-mono">
                      <p>Drafted By: <span className="font-medium text-slate-700">{biller.makerName}</span></p>
                      <p>Mapped Limit: <span className="font-medium text-slate-700">Rs. {biller.maxLimit.toLocaleString()}</span></p>
                      <p>Mapped Fee Rate: <span className="font-medium text-slate-700">{(biller.fixedFee * 100).toFixed(1)}% + GST</span></p>
                    </div>

                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={() => onApproveBiller(biller.id, 'Prasoon Padhye (Checker)')}
                        className="flex-1 py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-all shadow-xs uppercase tracking-wider"
                      >
                        Approve & Activate Go-Live
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'monitoring' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Alert Notification Header */}
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Configure Downtime Fluctuations Email Hook</h4>
                <p className="text-[11px] text-slate-500">Auto-triggers alert notifications to the configured email IDs at Bank level (page 55 rfp) if any channel experiences technical declines.</p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 font-mono px-3 py-1.5 rounded-lg">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              Hooks Active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {channels.map((ch, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-800 max-w-36 leading-tight">{ch.name}</h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${ch.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'}`}>
                    {ch.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center py-1">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-mono block">Uptime</span>
                    <span className="text-xs font-bold font-mono text-slate-700">{ch.uptime}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-mono block">Latency</span>
                    <span className="text-xs font-bold font-mono text-slate-700">{ch.latency}</span>
                  </div>
                </div>

                <button
                  onClick={() => triggerAlertEmail(ch.name)}
                  className="w-full py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-[11px] font-medium transition-all"
                >
                  Test Auto-Email Alerts
                </button>
              </div>
            ))}
          </div>

          {/* Audit Logs Table representation */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-3">
            <h3 className="font-display font-medium text-slate-800 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              Administrative Audit Logs (Real-time Integration Trails)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 font-mono">
                <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-2">Time</th>
                    <th className="py-2">User / Actor</th>
                    <th className="py-2">Trigger Key</th>
                    <th className="py-2">Audit Details</th>
                    <th className="py-2 text-right">Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {auditLogs.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2.5 font-bold text-slate-700">{log.user} <span className="font-normal text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded font-mono">({log.role})</span></td>
                      <td className="py-2.5 text-orange-600 font-bold font-mono">{log.action}</td>
                      <td className="py-2.5 max-w-sm font-sans text-slate-500">{log.details}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-[10px]">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'reporting' && (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-5 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="font-display font-medium text-slate-800 text-base">Comprehensive Bank Admin Report Scheduler</h3>
            <p className="text-xs text-slate-500">Generate compliance metrics, billing volumes, decline rates, and audit logs based on the bank's parameter requirements (page 55).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 font-mono uppercase">Reporting Time Period</label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 bg-white text-slate-700"
              >
                <option>Hourly</option>
                <option>Daily</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 font-mono uppercase">Extract Format</label>
              <select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 bg-white text-slate-700"
              >
                <option>CSV (Comma Separated Values)</option>
                <option>Excel (Standard XLSX)</option>
                <option>PDF (Auditor Sealed)</option>
                <option>TXT (Log Format)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={generateReport}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Pull Records & Compile File
              </button>
            </div>
          </div>

          {reportOutputMsg && (
            <div className={`p-4 rounded-lg border text-xs leading-relaxed font-mono ${reportOutputMsg.startsWith('SUCCESS') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600 animate-pulse'}`}>
              {reportOutputMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
            <div className="p-4 border border-slate-100 rounded-lg space-y-2">
              <h4 className="font-semibold text-slate-700 font-mono uppercase">Day-wise Transaction Decline reports</h4>
              <p>Reports are auto-compiled at 23:59:00 IST daily and dispatched via encrypted mail routes directly to the Recon desk.</p>
              <div className="flex justify-between items-center text-[10px] font-mono bg-slate-50 p-2 rounded">
                <span>Auto-Mail Despatch</span>
                <span className="text-emerald-600 font-bold uppercase">Active config</span>
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-lg space-y-2">
              <h4 className="font-semibold text-slate-700 font-mono uppercase">Failure reports with error codes</h4>
              <p>Contains detailed billing fetch discrepancies with technical decline error code classifications defined by NPCI.</p>
              <div className="flex justify-between items-center text-[10px] font-mono bg-slate-50 p-2 rounded">
                <span>MAPPED SPECIFICATION</span>
                <span className="text-orange-600 font-bold uppercase">NPCI Bridge Schema v1.4</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'privileges' && (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="font-display font-medium text-slate-800 text-base">Role privilege Allocation Matrix</h3>
            <p className="text-xs text-slate-500">Verify user credentials security, limit updates, and authorization boundaries as required by Bank guidelines (page 55).</p>
          </div>

          <div className="space-y-3">
            {privilegeMapping.map((p, idx) => (
              <div key={idx} className="p-3 border border-slate-100 rounded-lg flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 font-mono uppercase">{p.role}</h4>
                  <p className="text-xs text-slate-500">{p.action}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 font-mono px-2.5 py-1 rounded">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  MFA Privileged Access
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-orange-50/10 border border-orange-200/50 rounded-lg text-xs leading-relaxed text-slate-600">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-orange-600" /> Active-Active Security Assurance</h4>
            Any modifications to are static-audited by the system, ensuring complete defense against unauthorized privilege elevation. All sessions expire after 15 minutes of inactivity as parsed by Bank security policy.
          </div>
        </div>
      )}
    </div>
  );
}
