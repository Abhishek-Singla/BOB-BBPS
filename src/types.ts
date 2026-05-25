export interface Biller {
  id: string;
  name: string;
  category: string;
  makerName: string;
  checkerName: string | null;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
  maxLimit: number;
  fixedFee: number;
  onboardingDate: string;
}

export interface Agent {
  id: string;
  name: string;
  institution: string;
  limitScore: number;
  currentLimit: number;
  status: 'ACTIVE' | 'DISABLED';
}

export interface Transaction {
  id: string; // BBPS Ref ID
  rrn: string; // Retrieval Reference Number
  billerId: string;
  billerName: string;
  customerName: string;
  customerMobile: string; // Masked in security screens
  amount: number;
  channel: 'bob World' | 'Internet Banking' | 'UPI BHIM Baroda Pay' | 'Kiosk' | 'Agent';
  paymentMode: 'Cash' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'UPI' | 'IMPS';
  status: 'SUCCESS' | 'TECHNICAL_DECLINE' | 'BUSINESS_DECLINE';
  declineReason?: string;
  timestamp: string;
  reconStatus: 'RECONCILED' | 'EXCEPTION' | 'CREDIT_ADJUSTMENT_REFUNDED';
  repushAttempts: number;
  acknowledgedByBiller: boolean;
}

export interface Complaint {
  id: string;
  txnId: string;
  billerName: string;
  type: 'Double Debit' | 'Bill Amount Mismatch' | 'Payment Not Credited' | 'Technical Error';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  dateRaised: string;
  description: string;
  resolutionNotes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: 'Maker' | 'Checker' | 'Auditor' | 'System';
  action: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

export interface ComplianceItem {
  id: string;
  requirement: string;
  rfpSection: string;
  status: 'COMPLIANT' | 'PARTIAL' | 'ACTION_REQUIRED';
  details: string;
  weight: number;
}
