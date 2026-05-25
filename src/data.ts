import { Biller, Agent, Transaction, Complaint, AuditLog, ComplianceItem } from './types';

export const INITIAL_BILLERS: Biller[] = [
  {
    id: 'BIL-MHD-001',
    name: 'Maha Mumbai Electricity Board',
    category: 'Electricity',
    makerName: 'Abhishek Singla (Maker)',
    checkerName: 'Prasoon Padhye (Checker)',
    status: 'ACTIVE',
    maxLimit: 1000000,
    fixedFee: 0.015, // 1.5% fixed GST inclusive fee
    onboardingDate: '2026-05-10',
  },
  {
    id: 'BIL-BOB-002',
    name: 'Baroda Gas Corporation Limited',
    category: 'Piped Gas',
    makerName: 'Abhishek Singla (Maker)',
    checkerName: 'Prasoon Padhye (Checker)',
    status: 'ACTIVE',
    maxLimit: 500000,
    fixedFee: 0.012, // 1.2% fee
    onboardingDate: '2026-05-12',
  },
  {
    id: 'BIL-TNE-003',
    name: 'Tamil Nadu Water Supply',
    category: 'Water',
    makerName: 'Abhishek Singla (Maker)',
    checkerName: null,
    status: 'PENDING', // requires Maker-Checker approval simulation
    maxLimit: 300000,
    fixedFee: 0.010,
    onboardingDate: '2026-05-24',
  },
  {
    id: 'BIL-DEL-004',
    name: 'Delhi Municipal Corporation Taxes',
    category: 'Municipal Taxes',
    makerName: 'Sanjay Kumar (Maker)',
    checkerName: null,
    status: 'PENDING',
    maxLimit: 1500000,
    fixedFee: 0.008,
    onboardingDate: '2026-05-25',
  },
  {
    id: 'BIL-ETH-005',
    name: 'Vidarbha Educational Trust (Donations)',
    category: 'Donation', // special category (no presentment file, instant receipts with 80G tax benefit details)
    makerName: 'Abhishek Singla (Maker)',
    checkerName: 'Prasoon Padhye (Checker)',
    status: 'ACTIVE',
    maxLimit: 2000000,
    fixedFee: 0.005,
    onboardingDate: '2026-05-15',
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'AI-MUM-901',
    name: 'Saraswat Cooperative Bank AI',
    institution: 'Saraswat Bank',
    limitScore: 92,
    currentLimit: 5000000,
    status: 'ACTIVE',
  },
  {
    id: 'AI-HYD-902',
    name: 'Southern Retail Bill-Point Service',
    institution: 'Southern Retail Corp',
    limitScore: 58,
    currentLimit: 1200000,
    status: 'ACTIVE',
  },
  {
    id: 'AI-DEL-903',
    name: 'Apex Multipurpose BC Point',
    institution: 'Apex Finance Ltd',
    limitScore: 24, // low score triggering warnings or limits
    currentLimit: 300000,
    status: 'DISABLED',
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'BOB-BBPS-RE293021',
    rrn: '614502123904',
    billerId: 'BIL-MHD-001',
    billerName: 'Maha Mumbai Electricity Board',
    customerName: 'Shrikant Deshmukh',
    customerMobile: '9845012354',
    amount: 2450.00,
    channel: 'bob World',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    timestamp: '2026-05-25T09:10:00Z',
    reconStatus: 'RECONCILED',
    repushAttempts: 0,
    acknowledgedByBiller: true,
  },
  {
    id: 'BOB-BBPS-RE293022',
    rrn: '614502123905',
    billerId: 'BIL-BOB-002',
    billerName: 'Baroda Gas Corporation Limited',
    customerName: 'Meenakshi Iyer',
    customerMobile: '9211048892',
    amount: 1120.00,
    channel: 'bob World',
    paymentMode: 'Debit Card',
    status: 'SUCCESS',
    timestamp: '2026-05-25T10:14:00Z',
    reconStatus: 'RECONCILED',
    repushAttempts: 0,
    acknowledgedByBiller: true,
  },
  {
    id: 'BOB-BBPS-RE293023',
    rrn: '614502123906',
    billerId: 'BIL-MHD-001',
    billerName: 'Maha Mumbai Electricity Board',
    customerName: 'Vikram Aditya Rathore',
    customerMobile: '8105523490',
    amount: 4500.00,
    channel: 'Internet Banking',
    paymentMode: 'Net Banking',
    status: 'TECHNICAL_DECLINE', // trigger for re-push / credit adjustment
    declineReason: 'NPCI Bridge Timeout - Host Unreachable',
    timestamp: '2026-05-25T10:20:00Z',
    reconStatus: 'EXCEPTION',
    repushAttempts: 1,
    acknowledgedByBiller: false,
  },
  {
    id: 'BOB-BBPS-RE293024',
    rrn: '614502123907',
    billerId: 'BIL-TNE-003',
    billerName: 'Tamil Nadu Water Supply',
    customerName: 'Anantha Raghavan',
    customerMobile: '9444053912',
    amount: 850.00,
    channel: 'bob World',
    paymentMode: 'UPI',
    status: 'BUSINESS_DECLINE', // customer balance check, non-technical
    declineReason: 'Insufficient Account Funds',
    timestamp: '2026-05-25T11:05:00Z',
    reconStatus: 'RECONCILED',
    repushAttempts: 0,
    acknowledgedByBiller: false,
  },
  {
    id: 'BOB-BBPS-RE293025',
    rrn: '614502123908',
    billerId: 'BIL-ETH-005',
    billerName: 'Vidarbha Educational Trust (Donations)',
    customerName: 'Prof. Ramchandra Rao',
    customerMobile: '7720045611',
    amount: 15000.00,
    channel: 'UPI BHIM Baroda Pay',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    timestamp: '2026-05-25T11:45:00Z',
    reconStatus: 'RECONCILED',
    repushAttempts: 0,
    acknowledgedByBiller: true,
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-90312',
    txnId: 'BOB-BBPS-RE293023',
    billerName: 'Maha Mumbai Electricity Board',
    type: 'Double Debit',
    status: 'OPEN',
    dateRaised: '2026-05-25T10:35:00Z',
    description: 'Transaction failed but Rs. 4,500 was debited from account. Please process standard refund.',
  },
  {
    id: 'CMP-2026-90110',
    txnId: 'BOB-BBPS-RE248911',
    billerName: 'Baroda Gas Corporation Limited',
    type: 'Payment Not Credited',
    status: 'RESOLVED',
    dateRaised: '2026-05-24T14:20:00Z',
    description: 'Successfully paid gas bill of Rs. 980 but gas agency dashboard shows outstanding.',
    resolutionNotes: 'Verified at NPCI core ledger. Biller acknowledged credit file on T+1 cycle. Resolved.',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-05-25T12:00:10Z',
    user: 'Abhishek Singla',
    role: 'Maker',
    action: 'BILLER_DRAFTED',
    details: 'Drafted Tamil Nadu Water Supply (BIL-TNE-003) for review.',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-05-25T12:01:45Z',
    user: 'Prasoon Padhye',
    role: 'Checker',
    action: 'BILLER_APPROVED',
    details: 'Approved Maha Mumbai Electricity Board commercials and mapped parameters.',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-05-25T12:04:12Z',
    user: 'SYSTEM',
    role: 'System',
    action: 'HSM_HEARTBEAT',
    details: 'Physical HSM integration verified. Static & dynamic key rotation sync completed successfully.',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-004',
    timestamp: '2026-05-25T12:05:00Z',
    user: 'C-SOC Daemon',
    role: 'System',
    action: 'DDOS_MONITOR',
    details: 'No suspicious traffic patterns detected. Core host firewalls running in Active-Active HA mode.',
    status: 'SUCCESS',
  }
];

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: 'SEC-001',
    requirement: 'End-to-end Data Encryption at all layers (Data at Rest & Data in Motion).',
    rfpSection: 'Annexure 12 - Section 12 (System Capabilities)',
    status: 'COMPLIANT',
    details: 'AES-256 and TLS 1.3 enforced across Bank Core, channels (bob World), and NPCI interfaces.',
    weight: 15,
  },
  {
    id: 'SEC-002',
    requirement: 'Masking of PII (Personal Identifiable Information) in logs & plains.',
    rfpSection: 'Annexure 12 - Section 12 (PII Shielding)',
    status: 'COMPLIANT',
    details: 'PCI-DSS and Indian privacy regulations compliant. Mobile numbers, card numbers, and emails are auto-masked.',
    weight: 15,
  },
  {
    id: 'SEC-003',
    requirement: 'Integration with Physical Hardware Security Module (HSM) for keys.',
    rfpSection: 'Annexure 12A - Item 10',
    status: 'COMPLIANT',
    details: 'Physical HSM is active. Dynamic key exchange handles the encryption of transaction-level hashes.',
    weight: 10,
  },
  {
    id: 'SEC-004',
    requirement: 'OWASP Top 10 & SANS Top 25 Vulnerability Free certification.',
    rfpSection: 'Annexure 12A - Items 16 & 17',
    status: 'COMPLIANT',
    details: 'Quarterly CERT-IN audits and automated weekly static scan reports uploaded for Reserve Bank inspection.',
    weight: 10,
  },
  {
    id: 'OPR-001',
    requirement: 'Maker-Checker facility for all Bank Admin Portal functionalities.',
    rfpSection: 'Annexure 12 - Section 4(b)',
    status: 'COMPLIANT',
    details: 'Any draft, onboarding, or commercial adjustment demands two-factor authorization and separate Checker approval.',
    weight: 10,
  },
  {
    id: 'OPR-002',
    requirement: 'Reconciliation & Automated Re-push with configurable attempts.',
    rfpSection: 'Annexure 12 - Section 8(o)',
    status: 'COMPLIANT',
    details: 'System schedules automatic T+1 checks and re-pushes outstanding non-acknowledged transactions iteratively.',
    weight: 15,
  },
  {
    id: 'OPR-003',
    requirement: 'NPCI CANVAS CMS integration for complaints handling (TAT 24 Hr).',
    rfpSection: 'Annexure 12 - Section 9',
    status: 'PARTIAL',
    details: 'Integrated with principal CANVAS API. Live auto-callback tracking scheduled for next sprint rollout.',
    weight: 15,
  },
  {
    id: 'OPR-004',
    requirement: 'Centralized Multi-Channel Reconciliation Parameterization.',
    rfpSection: 'Annexure 12 - Section 8(c)',
    status: 'COMPLIANT',
    details: 'Parameterized settlement scripts process credit files automatically without hardcoded logic.',
    weight: 10,
  }
];

// Utility Security Functions
export function maskMobile(mobile: string): string {
  if (mobile.length < 10) return mobile;
  return `${mobile.substring(0, 3)}*****${mobile.substring(8)}`;
}

export function maskName(name: string): string {
  const parts = name.split(' ');
  return parts.map(p => p[0] + '*'.repeat(Math.max(1, p.length - 1))).join(' ');
}

// Simulated Encryption Engine (AES-256 Mock)
export function simulateEncryption(text: string): { plaintext: string; ciphertext: string; hash: string } {
  let ciphertext = '';
  // Generate a mock hex representation
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    ciphertext += (charCode ^ 42).toString(16).padStart(2, '0');
  }
  // Hex fill up to 32 bits simulated
  ciphertext = 'ENC_AES256_' + ciphertext.toUpperCase() + 'f9a2e38b';
  
  // SHA-256 Simulated Hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const hashHex = 'SHA256_' + Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();

  return {
    plaintext: text,
    ciphertext,
    hash: hashHex
  };
}
