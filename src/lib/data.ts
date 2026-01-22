export type Claim = {
  id: string;
  patient: string;
  patientId: string;
  payer: string;
  amount: number;
  status: "Paid" | "Denied" | "Pending" | "Submitted";
  date: string;
  denialReason?: string;
  riskScore?: number;
};

export const claims: Claim[] = [
  {
    id: "C20240715001",
    patient: "Eleanor Vance",
    patientId: "P001",
    payer: "Aetna",
    amount: 1250.75,
    status: "Paid",
    date: "2024-07-15",
    riskScore: 10,
  },
  {
    id: "C20240714002",
    patient: "Marcus Thorne",
    patientId: "P002",
    payer: "Cigna",
    amount: 850.0,
    status: "Denied",
    denialReason: "Medical Necessity",
    date: "2024-07-14",
    riskScore: 92,
  },
  {
    id: "C20240712003",
    patient: "Seraphina Moon",
    patientId: "P003",
    payer: "United Healthcare",
    amount: 2300.0,
    status: "Pending",
    date: "2024-07-12",
    riskScore: 78,
  },
  {
    id: "C20240710004",
    patient: "Julian Croft",
    patientId: "P004",
    payer: "BlueCross BlueShield",
    amount: 450.25,
    status: "Submitted",
    date: "2024-07-10",
    riskScore: 35,
  },
  {
    id: "C20240709005",
    patient: "Isabella Chen",
    patientId: "P005",
    payer: "Humana",
    amount: 1800.5,
    status: "Paid",
    date: "2024-07-09",
    riskScore: 5,
  },
   {
    id: "C20240708006",
    patient: "Liam O'Connell",
    patientId: "P006",
    payer: "Aetna",
    amount: 760.0,
    status: "Pending",
    date: "2024-07-08",
    riskScore: 65,
  },
  {
    id: "C20240705007",
    patient: "Sophia Rodriguez",
    patientId: "P007",
    payer: "Cigna",
    amount: 3100.0,
    status: "Denied",
    denialReason: "Payer Policy Mismatch",
    date: "2024-07-05",
    riskScore: 85,
  },
  {
    id: "C20240701008",
    patient: "Kenji Tanaka",
    patientId: "P008",
    payer: "United Healthcare",
    amount: 990.9,
    status: "Paid",
    date: "2024-07-01",
    riskScore: 12,
  },
];
