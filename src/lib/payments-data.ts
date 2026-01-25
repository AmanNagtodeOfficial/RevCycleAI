
export type PaymentAdjustment = {
  reasonCode: string;
  description: string;
  amount: number;
};

export type Payment = {
  id: string;
  claimId: string;
  payerName: string;
  paymentDate: string;
  amountPaid: number;
  remittanceCode: string; // e.g., 'CAS' for Contractual Obligation
  patientName: string;
  billedAmount: number;
  patientResponsibility: number;
  paymentMethod: 'ERA' | 'Check';
  checkNumber?: string;
  adjustments: PaymentAdjustment[];
};

export const payments: Payment[] = [];
