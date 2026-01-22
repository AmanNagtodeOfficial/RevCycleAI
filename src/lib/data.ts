export type Claim = {
  id: string;
  patient: string;
  patientId: string;
  provider: string;
  payer: string;
  amount: number;
  status: "Paid" | "Denied" | "Pending" | "Submitted" | "Scrubbing";
  date: string;
  denialReason?: string;
  riskScore?: number;
  procedure: string;
  diagnosis: string;
  lastActivity: string;
  history: { status: string; date: string; user: string }[];
};

export type Patient = {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  insuranceProvider: string;
  insuranceId: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
};

export const claims: Claim[] = [
  {
    id: "C20240715001",
    patient: "Eleanor Vance",
    patientId: "P001",
    provider: "Dr. Evelyn Reed",
    payer: "Aetna",
    amount: 1250.75,
    status: "Paid",
    date: "2024-07-15",
    riskScore: 10,
    procedure: "99214 - Office Visit",
    diagnosis: "R05 - Cough",
    lastActivity: "2024-07-25",
    history: [
        { status: "Paid", date: "2024-07-25", user: "System" },
        { status: "Submitted", date: "2024-07-15", user: "Admin" },
    ]
  },
  {
    id: "C20240714002",
    patient: "Marcus Thorne",
    patientId: "P002",
    provider: "Dr. Ben Carter",
    payer: "Cigna",
    amount: 850.0,
    status: "Denied",
    denialReason: "Medical Necessity",
    date: "2024-07-14",
    riskScore: 92,
    procedure: "88305 - Tissue Exam",
    diagnosis: "D48.5 - Neoplasm",
    lastActivity: "2024-07-24",
    history: [
        { status: "Denied", date: "2024-07-24", user: "Cigna" },
        { status: "Submitted", date: "2024-07-14", user: "Admin" },
    ]
  },
  {
    id: "C20240712003",
    patient: "Seraphina Moon",
    patientId: "P003",
    provider: "Dr. Evelyn Reed",
    payer: "United Healthcare",
    amount: 2300.0,
    status: "Pending",
    date: "2024-07-12",
    riskScore: 78,
    procedure: "71046 - Chest X-Ray",
    diagnosis: "J44.9 - COPD",
    lastActivity: "2024-07-22",
    history: [
        { status: "Pending", date: "2024-07-22", user: "UHC" },
        { status: "Submitted", date: "2024-07-12", user: "Admin" },
    ]
  },
  {
    id: "C20240710004",
    patient: "Julian Croft",
    patientId: "P004",
    provider: "Dr. Samira Khan",
    payer: "BlueCross BlueShield",
    amount: 450.25,
    status: "Scrubbing",
    date: "2024-07-10",
    riskScore: 35,
    procedure: "99213 - Office Visit",
    diagnosis: "M54.5 - Low back pain",
    lastActivity: "2024-07-11",
    history: [
        { status: "Scrubbing", date: "2024-07-11", user: "AI System" },
        { status: "Created", date: "2024-07-10", user: "Admin" },
    ]
  },
  {
    id: "C20240709005",
    patient: "Isabella Chen",
    patientId: "P005",
    provider: "Dr. Ben Carter",
    payer: "Humana",
    amount: 1800.5,
    status: "Paid",
    date: "2024-07-09",
    riskScore: 5,
    procedure: "93000 - EKG",
    diagnosis: "I10 - Hypertension",
    lastActivity: "2024-07-19",
    history: [
        { status: "Paid", date: "2024-07-19", user: "System" },
        { status: "Submitted", date: "2024-07-09", user: "Admin" },
    ]
  },
   {
    id: "C20240708006",
    patient: "Liam O'Connell",
    patientId: "P006",
    provider: "Dr. Samira Khan",
    payer: "Aetna",
    amount: 760.0,
    status: "Pending",
    date: "2024-07-08",
    riskScore: 65,
    procedure: "99396 - Preventive Visit",
    diagnosis: "Z00.00 - Health Exam",
    lastActivity: "2024-07-18",
    history: [
      { status: "Pending", date: "2024-07-18", user: "Aetna" },
      { status: "Submitted", date: "2024-07-08", user: "Admin" },
    ]
  },
  {
    id: "C20240705007",
    patient: "Sophia Rodriguez",
    patientId: "P007",
    provider: "Dr. Evelyn Reed",
    payer: "Cigna",
    amount: 3100.0,
    status: "Denied",
    denialReason: "Payer Policy Mismatch",
    date: "2024-07-05",
    riskScore: 85,
    procedure: "27447 - Knee Replacement",
    diagnosis: "M17.11 - Osteoarthritis",
    lastActivity: "2024-07-15",
    history: [
      { status: "Denied", date: "2024-07-15", user: "Cigna" },
      { status: "Submitted", date: "2024-07-05", user: "Admin" },
    ]
  },
  {
    id: "C20240701008",
    patient: "Kenji Tanaka",
    patientId: "P008",
    provider: "Dr. Ben Carter",
    payer: "United Healthcare",
    amount: 990.9,
    status: "Paid",
    date: "2024-07-01",
    riskScore: 12,
    procedure: "99204 - New Patient Visit",
    diagnosis: "E11.9 - Type 2 Diabetes",
    lastActivity: "2024-07-10",
    history: [
        { status: "Paid", date: "2024-07-10", user: "System" },
        { status: "Submitted", date: "2024-07-01", user: "Admin" },
    ]
  },
];

export const patients: Patient[] = [
  {
    id: "P001",
    name: "Eleanor Vance",
    dob: "1985-05-22",
    gender: "Female",
    insuranceProvider: "Aetna",
    insuranceId: "AET123456789",
    lastVisit: "2024-07-15",
    status: "Active",
  },
  {
    id: "P002",
    name: "Marcus Thorne",
    dob: "1978-11-03",
    gender: "Male",
    insuranceProvider: "Cigna",
    insuranceId: "CIG987654321",
    lastVisit: "2024-07-14",
    status: "Active",
  },
  {
    id: "P003",
    name: "Seraphina Moon",
    dob: "1992-02-14",
    gender: "Female",
    insuranceProvider: "United Healthcare",
    insuranceId: "UHC246813579",
    lastVisit: "2024-07-12",
    status: "Active",
  },
  {
    id: "P004",
    name: "Julian Croft",
    dob: "1965-09-30",
    gender: "Male",
    insuranceProvider: "BlueCross BlueShield",
    insuranceId: "BCBS135792468",
    lastVisit: "2024-07-10",
    status: "Active",
  },
  {
    id: "P005",
    name: "Isabella Chen",
    dob: "2001-03-18",
    gender: "Female",
    insuranceProvider: "Humana",
    insuranceId: "HUM555444333",
    lastVisit: "2024-07-09",
    status: "Inactive",
  },
  {
    id: "P006",
    name: "Liam O'Connell",
    dob: "1988-07-07",
    gender: "Male",
    insuranceProvider: "Aetna",
    insuranceId: "AET998877665",
    lastVisit: "2024-07-08",
    status: "Active",
  },
  {
    id: "P007",
    name: "Sophia Rodriguez",
    dob: "1955-12-25",
    gender: "Female",
    insuranceProvider: "Cigna",
    insuranceId: "CIG112233445",
    lastVisit: "2024-07-05",
    status: "Active",
  },
  {
    id: "P008",
    name: "Kenji Tanaka",
    dob: "1995-08-15",
    gender: "Male",
    insuranceProvider: "United Healthcare",
    insuranceId: "UHC777888999",
    lastVisit: "2024-07-01",
    status: "Inactive",
  },
];
