export type Payment = {
  id: string;
  claimId: string;
  payerName: string;
  paymentDate: string;
  amountPaid: number;
  remittanceCode: string; // e.g., 'CAS' for Contractual Obligation
  patientName: string;
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
  },
  {
    id: "PAY-002",
    claimId: "C20240709005",
    payerName: "Humana",
    paymentDate: "2024-07-19",
    amountPaid: 1800.5,
    remittanceCode: "CO-45",
    patientName: "Isabella Chen",
  },
  {
    id: "PAY-003",
    claimId: "C20240701008",
    payerName: "United Healthcare",
    paymentDate: "2024-07-10",
    amountPaid: 990.9,
    remittanceCode: "PR-1",
    patientName: "Kenji Tanaka",
  },
  {
    id: "PAY-004",
    claimId: "C20240715001", // Duplicate for demonstration
    payerName: "Cigna",
    paymentDate: "2024-07-28",
    amountPaid: 25.0,
    remittanceCode: "PR-2",
    patientName: "Eleanor Vance",
  },
  {
    id: "PAY-005",
    claimId: "C20240708006",
    payerName: "Aetna",
    paymentDate: "2024-07-29",
    amountPaid: 700.0,
    remittanceCode: "CO-45",
    patientName: "Liam O'Connell",
  },
];
