import React, { useState } from 'react';
import { ShieldCheck, Database, Key, Server, Lock, FileText, CheckCircle2, ChevronRight, Activity, Terminal } from 'lucide-react';
import { maskMobile, maskName, simulateEncryption } from '../data';

export default function SecurityCompliance() {
  const [inputText, setInputText] = useState('Anantha Raghavan');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptionOutput, setEncryptionOutput] = useState<any>({
    masked: 'A****** R*******',
    ciphertext: 'ENC_AES256_EFA89CC5B7D822A9f9a2e38b',
    hash: 'SHA256_7A28F30C'
  });

  const handleEncryptSandbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsEncrypting(true);
    setTimeout(() => {
      const isPhone = /^\d+$/.test(inputText.trim());
      const masked = isPhone ? maskMobile(inputText) : maskName(inputText);
      const enc = simulateEncryption(inputText);
      
      setEncryptionOutput({
        masked,
        ciphertext: enc.ciphertext,
        hash: enc.hash
      });
      setIsEncrypting(false);
    }, 800);
  };

  return (
    <div className="space-y-6" id="security-compliance-command">
      
      {/* Encryption Sandbox & Security Score card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left columns: Encryption Sandbox */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="font-display font-medium text-slate-800 text-base flex items-center gap-1.5">
                <Lock className="w-5 h-5 text-orange-500" />
                PII Shield & AES-256 HSM Sandbox
              </h3>
              <p className="text-xs text-slate-500">
                Type any sensitive plain core banking asset (mobile number, customer name, account sum) to test dynamic masking, active-dynamic encryption, and integrity hashing.
              </p>
            </div>

            <form onSubmit={handleEncryptSandbox} className="flex gap-2">
              <input
                type="text"
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type customer name or phone number..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 text-slate-700 font-mono"
              />
              <button
                type="submit"
                disabled={isEncrypting}
                className="py-1.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all font-mono"
              >
                {isEncrypting ? 'Encrypting...' : 'Encrypt Payloads'}
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 block font-semibold">1. Standard Masking Format</span>
                <span className="text-slate-700 font-bold">{encryptionOutput.masked}</span>
                <span className="block text-[8px] text-emerald-600 font-bold uppercase tracking-wider mt-1">✓ Log-Safe Masked</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 block font-semibold">2. AES-256 Storage Cipher</span>
                <span className="text-orange-600 font-bold truncate block" title={encryptionOutput.ciphertext}>
                  {encryptionOutput.ciphertext}
                </span>
                <span className="block text-[8px] text-emerald-600 font-bold uppercase tracking-wider mt-1">✓ Database Encrypted</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 block font-semibold">3. SHA-256 Integrity Verification</span>
                <span className="text-indigo-600 font-bold">{encryptionOutput.hash}</span>
                <span className="block text-[8px] text-emerald-600 font-bold uppercase tracking-wider mt-1">✓ Hash Match OK</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 text-slate-300 rounded-xl text-[11px] leading-relaxed font-mono space-y-1 border border-slate-800">
              <p className="text-slate-500 text-[9px] border-b border-slate-850 pb-1.5 uppercase font-semibold">Simulated SSL/TLS Transaction Payload</p>
              <pre className="overflow-x-auto text-[10px] text-emerald-400 leading-normal">{`{
  "header": { "version": "1.0", "timestamp": "${new Date().toISOString()}" },
  "payload": {
    "secureCustomerName": "${encryptionOutput.ciphertext}",
    "maskedLogParam": "${encryptionOutput.masked}",
    "ledgerIntegrityChecksum": "${encryptionOutput.hash}"
  }
}`}</pre>
            </div>
          </div>
        </div>

        {/* Right side: Security Scorecard */}
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-xs space-y-4 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-y-3 pointer-events-none">
              <ShieldCheck className="w-32 h-32" />
            </div>

            <h4 className="font-display font-medium text-slate-300 text-sm">Security Compliance Stats</h4>
            <div className="flex items-baseline gap-2 font-mono">
              <div className="text-3xl font-bold text-emerald-400">Class A+</div>
              <span className="text-xs text-emerald-300">CERT-IN Inspected</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 font-mono">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>VAPT Audit status</span>
                <span className="text-emerald-400 font-bold uppercase">Quarter Completed</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>OWASP Top 10 rating</span>
                <span className="text-emerald-400 font-bold uppercase">Zero Vuln</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>SANS Top 25 rating</span>
                <span className="text-emerald-400 font-bold uppercase">Zero Vuln</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Physical HSM sync</span>
                <span className="text-emerald-400 font-bold uppercase">Sync On</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Cyber Security Ops Terminal */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-3">
        <h3 className="font-display font-medium text-slate-800 text-sm flex items-center gap-1.5">
          <Terminal className="w-4.5 h-4.5 text-orange-500" />
          Active C-SOC Integrity Monitoring Stream
        </h3>

        <div className="p-3 bg-slate-950 text-slate-400 font-mono text-[10px] rounded-lg h-44 overflow-y-auto space-y-1 border border-slate-900 leading-normal scrollbar-thin">
          <p className="text-slate-600">[2026-05-25 12:00:00 PST] SYSTEM_STABLE - Multi-Channel active nodes: bob World, UPI, Internet Banking, Kiosk</p>
          <p className="text-emerald-500">[2026-05-25 12:01:45 PST] HSM_Rotated - Static key rotated, dynamic transaction-specific hashes active</p>
          <p className="text-slate-600">[2026-05-25 12:02:11 PST] SSL_Handshake - TLS 1.3 handshake recognized for IP range (bob World API Gateway)</p>
          <p className="text-slate-600">[2026-05-25 12:03:00 PST] VAPT_Deamon - Auto static analyzer completed with zero vulnerabilities found</p>
          <p className="text-slate-600">[2026-05-25 12:04:12 PST] PORT_LOCK - Admin API endpoints isolated behind reverse-proxy layer</p>
          <p className="text-amber-500">[2026-05-25 12:05:01 PST] WARN_CSOC - Mild latency fluctuation parsed on secondary Kiosk channel. Trigger sent to Email alerts pool.</p>
        </div>
      </div>
      
    </div>
  );
}
