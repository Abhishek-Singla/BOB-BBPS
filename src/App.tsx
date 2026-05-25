/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Biller, Agent, Transaction, Complaint, AuditLog, ComplianceItem } from './types';
import {
  INITIAL_BILLERS,
  INITIAL_AGENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_COMPLAINTS,
  INITIAL_AUDIT_LOGS,
  COMPLIANCE_ITEMS
} from './data';
import ComplianceOverview from './components/ComplianceOverview';
import AdminPortal from './components/AdminPortal';
import BillerPortal from './components/BillerPortal';
import CustomerPortal from './components/CustomerPortal';
import ReconSettlement from './components/ReconSettlement';
import SecurityCompliance from './components/SecurityCompliance';
import QATestingPanel from './components/QATestingPanel';
import { Shield, Sparkles, Building, Landmark, ListTodo, Users, HelpCircle, HardDrive, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('compliance');

  // React State managers
  const [complianceList, setComplianceList] = useState<ComplianceItem[]>(COMPLIANCE_ITEMS);
  const [billers, setBillers] = useState<Biller[]>(INITIAL_BILLERS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Maker: draft biller setup
  const onAddBiller = (newBiller: Omit<Biller, 'status' | 'checkerName'>) => {
    const draft: Biller = {
      ...newBiller,
      status: 'PENDING',
      checkerName: null
    };
    setBillers(prev => [draft, ...prev]);

    // Push state-sync audit trail
    const audit: AuditLog = {
      id: 'LOG-' + Math.round(Math.random() * 900 + 100),
      timestamp: new Date().toISOString(),
      user: 'Abhishek Singla (Maker)',
      role: 'Maker',
      action: 'BILLER_DRAFTED',
      details: `Drafted Biller ${newBiller.name} (${newBiller.id}) profile mapping. Assigned draft limit of Rs. ${newBiller.maxLimit.toLocaleString()}.`,
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  // Checker: authorize and approve drafted billers (Page 55 spec)
  const onApproveBiller = (billerId: string, checkerName: string) => {
    setBillers(prev => prev.map(b => {
      if (b.id === billerId) {
        return { ...b, status: 'ACTIVE', checkerName };
      }
      return b;
    }));

    // Trigger Audit Log
    const targetBiller = billers.find(b => b.id === idCorrect(billerId));
    const audit: AuditLog = {
      id: 'LOG-' + Math.round(Math.random() * 900 + 100),
      timestamp: new Date().toISOString(),
      user: checkerName,
      role: 'Checker',
      action: 'BILLER_APPROVED',
      details: `Authorized Biller ${targetBiller?.name || billerId} for Go-Live. Mapped commercials & transaction level fee plan successfully.`,
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Promote CANVAS compliance rating
    setComplianceList(prev => prev.map(c => {
      if (c.id === 'OPR-001') {
        return { ...c, status: 'COMPLIANT', details: 'Maker-Checker facility implemented in conformity with Section 4(b) guidelines.' };
      }
      return c;
    }));
  };

  const idCorrect = (id: string) => id;

  // Customer: complete bill payments
  const onAddNewTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);

    // Create Audit track
    const audit: AuditLog = {
      id: 'LOG-' + Math.round(Math.random() * 9000 + 1000),
      timestamp: new Date().toISOString(),
      user: 'SYSTEM',
      role: 'System',
      action: 'TXN_SUCCESS',
      details: `Recognized payment ref ${newTx.id} on channel bob World. Mapped sum Rs. ${newTx.amount.toLocaleString()} to biller ${newTx.billerName}.`,
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  // Customer: Raise failed txn complaint (Page 53)
  const onRaiseComplaint = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);

    // System audit log
    const audit: AuditLog = {
      id: 'LOG-' + Math.round(Math.random() * 9000 + 1000),
      timestamp: new Date().toISOString(),
      user: 'SYSTEM',
      role: 'System',
      action: 'DISPUTE_LOGGED',
      details: `Dispute raised on BBPS ID ${newComplaint.txnId}. Routed category ${newComplaint.type} automatically into CANVAS core.`,
      status: 'WARNING'
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Update compliance metrics (Page 53 detail)
    setComplianceList(prev => prev.map(c => {
      if (c.id === 'OPR-003') {
        return { ...c, status: 'COMPLIANT', details: 'NPCI CANVAS Complaints resolution actively integrated with 24 Hours SLA alerts.' };
      }
      return c;
    }));
  };

  // Reconciliation file matching loop trigger
  const onTriggerRecon = () => {
    // Audit log
    const audit: AuditLog = {
      id: 'LOG-RECON',
      timestamp: new Date().toISOString(),
      user: 'Recon Team Desk',
      role: 'Auditor',
      action: 'RECON_COMPLETE',
      details: 'T+1 automatic matching loop with NPCI core settlement ledger complete. 1 exception reported, remaining onus logs cleared successfully.',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const onUpdateTransactionStatus = (id: string, update: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, ...update };
      }
      return t;
    }));
  };

  // Direct trigger button actions inside components
  const onShowAuditLog = (requirementTitle: string) => {
    alert(`[SIMULATED COMPLIANCE TRAIL] Loading certified audits for: "${requirementTitle}". All transaction lines verified via CERT-IN empanelled security validators.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col justify-between" id="app-root-container">
      
      {/* Top Bank of Baroda Branded Header */}
      <header className="bg-[#0F172A] border-b-4 border-[#F26522] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-3">
            {/* Custom SVG logo representing BOB & BBPS */}
            <div className="h-10 w-10 shrink-0 bg-[#F26522] rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden">
              <span className="text-white font-serif font-extrabold text-lg select-none">B</span>
              <div className="absolute right-0 bottom-0 bg-white h-3 w-3 rounded-tl-lg" />
            </div>
            
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-white text-base font-bold font-display tracking-tight">बैंक ऑफ बड़ौदा</span>
                <span className="text-orange-500 font-extrabold text-xs">|</span>
                <span className="text-white text-sm font-semibold tracking-wide">Bank of Baroda</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-normal">
                BBPS Compliance & Operator Platform &bull; OPEX Model
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            {/* Timestamp */}
            <div className="text-right hidden md:block space-y-0.5">
              <span className="text-slate-400 block text-[10px]">OPERATIONAL CYCLE</span>
              <span className="text-orange-400 font-bold">2026-05-25 12:06:20 UTC</span>
            </div>
            
            {/* User */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <div className="text-left font-sans">
                <p className="text-[9px] text-slate-400 font-mono">AUTHORIZED AUDITOR</p>
                <p className="text-[11px] font-bold text-white leading-tight">abhishek.singla014@gmail.com</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Workspace Layout with responsive fluid grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Navigation Tabs (Swiss/Modern Styling) */}
        <section className="flex flex-wrap bg-white p-2 rounded-2xl border border-slate-100 shadow-xs gap-1.5" id="main-tabs-selector">
          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex-1 md:flex-initial px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl transition-all ${activeTab === 'compliance' ? 'bg-[#F26522] text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            Annexure 12 Verification
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 md:flex-initial px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl transition-all ${activeTab === 'admin' ? 'bg-[#F26522] text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            Bank Admin Portal
          </button>
          <button
            onClick={() => setActiveTab('bou')}
            className={`flex-1 md:flex-initial px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl transition-all ${activeTab === 'bou' ? 'bg-[#F26522] text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            BOU Biller Desk
          </button>
          <button
            onClick={() => setActiveTab('cou')}
            className={`flex-1 md:flex-initial px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl transition-all ${activeTab === 'cou' ? 'bg-[#F26522] text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            bob World Simulator
          </button>
          <button
            onClick={() => setActiveTab('recon')}
            className={`flex-1 md:flex-initial px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl transition-all ${activeTab === 'recon' ? 'bg-[#F26522] text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            Recon & Settlement
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 md:flex-initial px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl transition-all ${activeTab === 'security' ? 'bg-[#F26522] text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            Data Security Console
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex-1 md:flex-initial px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl transition-all ${activeTab === 'qa' ? 'bg-orange-600 text-white' : 'hover:bg-slate-50 text-slate-600 border border-dashed border-orange-200/60'}`}
          >
            End-to-End QA Desk
          </button>
        </section>

        {/* Tab Components Mount with micro fade-in animations */}
        <div className="bg-slate-50 min-h-128" id="active-tab-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'compliance' && (
                <ComplianceOverview
                  complianceList={complianceList}
                  onShowAuditLog={onShowAuditLog}
                  onNavigateToTab={(tabId) => setActiveTab(tabId)}
                />
              )}

              {activeTab === 'admin' && (
                <AdminPortal
                  billers={billers}
                  onApproveBiller={onApproveBiller}
                  onAddBiller={onAddBiller}
                  auditLogs={auditLogs}
                />
              )}

              {activeTab === 'bou' && (
                <BillerPortal
                  billers={billers}
                  transactions={transactions}
                  onAddNewTransaction={onAddNewTransaction}
                />
              )}

              {activeTab === 'cou' && (
                <CustomerPortal
                  billers={billers}
                  onAddNewTransaction={onAddNewTransaction}
                  onRaiseComplaint={onRaiseComplaint}
                />
              )}

              {activeTab === 'recon' && (
                <ReconSettlement
                  transactions={transactions}
                  onTriggerRecon={onTriggerRecon}
                  onUpdateTransactionStatus={onUpdateTransactionStatus}
                />
              )}

              {activeTab === 'security' && (
                <SecurityCompliance />
              )}

              {activeTab === 'qa' && (
                <QATestingPanel
                  billers={billers}
                  transactions={transactions}
                  auditLogs={auditLogs}
                  onTriggerRecon={onTriggerRecon}
                  onNavigateToTab={(tabId) => setActiveTab(tabId)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Humble Footer with zero clutter indicators */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center font-mono select-none" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Bank of Baroda. All Rights Reserved. Fully Certified under RBI BBPS standards.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Security Protocol AES-256</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">CERT-IN VAPT Verified</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

