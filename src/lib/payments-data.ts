
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

export const payments: Payment[] = [
  {
    id: "PAY-001",
    claimId: "C20240715001",
    payerName: "Aetna",
    paymentDate: "2024-07-25",
    amountPaid: 1250.75,
    remittanceCode: "CO-45",
    patientName: "Eleanor Vance",
    billedAmount: 1500.00,
    patientResponsibility: 50.00,
    paymentMethod: 'ERA',
    adjustments: [
        { reasonCode: 'CO-45', description: 'Contractual Obligation', amount: -249.25 }
    ]
  },
  {
    id: "PAY-002",
    claimId: "C20240709005",
    payerName: "Humana",
    paymentDate: "2024-07-19",
    amountPaid: 1800.5,
    remittanceCode: "CO-45",
    patientName: "Isabella Chen",
    billedAmount: 2000.00,
    patientResponsibility: 0,
    paymentMethod: 'ERA',
    adjustments: [
        { reasonCode: 'CO-45', description: 'Contractual Obligation', amount: -199.50 }
    ]
  },
  {
    id: "PAY-003",
    claimId: "C20240701008",
    payerName: "United Healthcare",
    paymentDate: "2024-07-10",
    amountPaid: 990.9,
    remittanceCode: "PR-1",
    patientName: "Kenji Tanaka",
    billedAmount: 1100.00,
    patientResponsibility: 109.10,
    paymentMethod: 'Check',
    checkNumber: 'CHK12345',
    adjustments: [
        { reasonCode: 'PR-1', description: 'Patient Responsibility (Deductible)', amount: -109.10 }
    ]
  },
  {
    id: "PAY-004",
    claimId: "C20240715001", // Duplicate for demonstration
    payerName: "Cigna", // This is secondary payment
    paymentDate: "2024-07-28",
    amountPaid: 25.0,
    remittanceCode: "PR-2",
    patientName: "Eleanor Vance",
    billedAmount: 50.00, // Billed to secondary
    patientResponsibility: 25.00,
    paymentMethod: 'ERA',
    adjustments: [
        { reasonCode: 'PR-2', description: 'Patient Responsibility (Co-insurance)', amount: -25.00 }
    ]
  },
  {
    id: "PAY-005",
    claimId: "C20240708006",
    payerName: "Aetna",
    paymentDate: "2024-07-29",
    amountPaid: 700.0,
    remittanceCode: "CO-45",
    patientName: "Liam O'Connell",
    billedAmount: 760.00,
    patientResponsibility: 60.00,
    paymentMethod: 'Check',
    checkNumber: 'CHK54321',
    adjustments: [
        { reasonCode: 'CO-45', description: 'Contractual Obligation', amount: -60.00 }
    ]
  },
];
