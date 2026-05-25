import React, { useState } from 'react';
import { COMPLIANCE_ITEMS } from '../data';
import { ComplianceItem } from '../types';
import { CheckCircle2, AlertTriangle, Shield, Award, HelpCircle, FileCheck, Layers, FileClock } from 'lucide-react';
import { motion } from 'motion/react';

interface ComplianceOverviewProps {
  complianceList: ComplianceItem[];
  onShowAuditLog: (logSection: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function ComplianceOverview({
  complianceList,
  onShowAuditLog,
  onNavigateToTab
}: ComplianceOverviewProps) {
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

  // Calculate weighted score
  const totalWeight = complianceList.reduce((acc, item) => acc + item.weight, 0);
  const compliantWeight = complianceList.reduce((acc, item) => {
    if (item.status === 'COMPLIANT') return acc + item.weight;
    if (item.status === 'PARTIAL') return acc + (item.weight * 0.5);
    return acc;
  }, 0);

  const compliancePercentage = Math.round((compliantWeight / totalWeight) * 100);

  const getStatusBadge = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Full Compliance
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Partial / In Progress
          </span>
        );
      case 'ACTION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Action Required
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" id="compliance-overview-section">
      {/* Top Banner with score */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 w-1/3 flex items-center justify-center pointer-events-none">
          <Shield className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-xs">
              <Award className="w-3.5 h-3.5 text-amber-200" />
              Annexure 12 Regulatory Verification
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight">
              Bank of Baroda BBPS System Audit
            </h2>
            <p className="text-orange-50 text-sm max-w-xl">
              Compliance report mapping to Master Direction Reserve Bank of India (Bharat Bill Payment System) instructions and security requirements under the OPEX model.
            </p>
          </div>

          <div className="flex items-center gap-5 bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/20 min-w-56 shrink-0 justify-center">
            {/* SVG Progress Circle */}
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white transition-all duration-1000 ease-out"
                  strokeDasharray={`${compliancePercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-lg">
                {compliancePercentage}%
              </div>
            </div>
            <div>
              <div className="text-xs text-orange-100 uppercase tracking-wider font-mono">Current Grade</div>
              <div className="text-xl font-bold font-mono">Class - A</div>
              <div className="text-xs text-emerald-200 font-medium">Safe to Go-Live</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Main sections and details visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Checklist items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
              <span className="font-display font-medium text-slate-800 text-base">Scope of Work Compliance Matrix</span>
              <span className="text-xs text-slate-500 font-mono">Mapped to RFP GEM/2024/B/4911250</span>
            </div>

            <div className="divide-y divide-slate-100">
              {complianceList.map((item) => (
                <div 
                  key={item.id} 
                  className={`py-3.5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 px-2 rounded-lg transition-colors ${selectedItem?.id === item.id ? 'bg-slate-50 border-l-2 border-orange-500' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-slate-400 font-medium">{item.id} &bull; {item.rfpSection}</p>
                    <h4 className="text-sm font-medium text-slate-700 leading-tight">
                      {item.requirement}
                    </h4>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {getStatusBadge(item.status)}
                    <span className="text-[10px] font-mono text-slate-400">Weightage Score: {item.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Inspect Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 block">
            <h3 className="font-display font-medium text-slate-800 text-base mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" />
              Compliance Inspector
            </h3>
            
            {selectedItem ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                    <span>SECTION: {selectedItem.id}</span>
                    <span>SCORE: {selectedItem.weight}/100</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">{selectedItem.requirement}</h4>
                  <p className="text-xs font-mono text-slate-500 font-medium">{selectedItem.rfpSection}</p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-slate-500 uppercase font-mono">Current Standing</h5>
                  <div className="p-3 text-xs text-slate-600 bg-emerald-50/30 border border-emerald-100/50 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Validated by BCP Audit
                    </div>
                    <p>{selectedItem.details}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-500 leading-relaxed">
                  <p className="font-medium text-slate-700">Standards Verified:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    <li>OWASP Top 10 safe compile patterns</li>
                    <li>SANS Complete 25 code testing standard</li>
                    <li>Master Direction RBI 2024 compliance</li>
                    <li>Centralized Maker-Checker auditing</li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  {selectedItem.id.startsWith('SEC') ? (
                    <button 
                      onClick={() => onNavigateToTab('security')}
                      className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-medium text-center transition-colors"
                    >
                      Inspect Data Encryption Shield
                    </button>
                  ) : (
                    <button 
                      onClick={() => onNavigateToTab('recon')}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium text-center transition-colors"
                    >
                      Audit Recon & TTUM Files
                    </button>
                  )}
                  <button 
                    onClick={() => onShowAuditLog(selectedItem.requirement)}
                    className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileClock className="w-3.5 h-3.5" /> View Active Audit Trails
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <HelpCircle className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-sm font-medium">Select any compliance section to inspect audit evidence & operational controls.</p>
              </div>
            )}
          </div>

          {/* Quick Stats Block */}
          <div className="p-5 bg-slate-900 text-white rounded-xl space-y-3 relative overflow-hidden shadow-xs">
            <div className="absolute right-0 bottom-0 opacity-10 translate-y-3 translate-x-3 pointer-events-none">
              <FileCheck className="w-24 h-24" />
            </div>
            
            <h4 className="text-xs uppercase font-mono text-slate-400 tracking-wider">HSM System Integrity</h4>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold font-mono text-emerald-400">99.99%</div>
              <span className="text-xs text-slate-400">Core Uptime</span>
            </div>
            
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Active Channels</span>
                <span className="font-mono text-emerald-400">bob World, UPI, NetBanking</span>
              </div>
              <div className="flex justify-between">
                <span>Secure Keys</span>
                <span className="font-mono text-emerald-400">Shared Rotated via HSM</span>
              </div>
              <div className="flex justify-between">
                <span>Disaster Recovery Site</span>
                <span className="font-mono text-emerald-400">Sync (DR &gt; 250km)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
