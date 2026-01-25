export type Claim = {
  id: string;
  patient: string;
  patientId: string;
  provider: string;
  payer: string;
  amount: number;
  status: "Paid" | "Denied" | "Pending" | "Submitted" | "Scrubbing";
  date: string;
  dateOfService: string;
  denialReason?: string;
  riskScore?: number;
  procedure: string;
  diagnosis: string;
  lastActivity: string;
  history: { status: string; date: string; user: string }[];
  aiSuggestions?: {
    category: string;
    field: string;
    suggestion: string;
    actionType: string;
  }[];
  submissionType: 'EMC' | 'Paper';
  formType: 'CMS 1500' | 'UB04';
  priority: 'Primary' | 'Secondary' | 'Tertiary' | 'Non-Primary';
  claimCount: number;
};

export type Patient = {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  status: 'Active' | 'Inactive';
  lastVisit: string;
  
  // Demographics
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;

  // Subscriber Info
  subscriberName: string;
  subscriberDob: string;
  subscriberRelationship: 'Self' | 'Spouse' | 'Child' | 'Other';

  // Primary Insurance
  primaryInsuranceProvider: string;
  primaryInsuranceId: string;
  primaryInsuranceGroup: string;

  // Secondary Insurance (optional)
  secondaryInsuranceProvider?: string;
  secondaryInsuranceId?: string;
  secondaryInsuranceGroup?: string;
};

export type Statement = {
  id: string;
  patientId: string;
  patientName: string;
  dateIssued: string;
  amountDue: number;
  status: "Paid" | "Sent" | "Overdue" | "Draft";
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
    dateOfService: "2024-07-14",
    riskScore: 10,
    procedure: "99214 - Office Visit",
    diagnosis: "R05 - Cough",
    lastActivity: "2024-07-25",
    history: [
        { status: "Paid", date: "2024-07-25", user: "System" },
        { status: "Submitted", date: "2024-07-15", user: "Admin" },
    ],
    submissionType: 'EMC',
    formType: 'CMS 1500',
    priority: 'Primary',
    claimCount: 1,
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
    dateOfService: "2024-07-13",
    riskScore: 92,
    procedure: "88305 - Tissue Exam",
    diagnosis: "D48.5 - Neoplasm",
    lastActivity: "2024-07-24",
    history: [
        { status: "Denied", date: "2024-07-24", user: "Cigna" },
        { status: "Submitted", date: "2024-07-14", user: "Admin" },
    ],
    aiSuggestions: [
      {
        category: "Coding",
        field: "Procedure/Diagnosis",
        suggestion: "Procedure code 88305 may not be supported by diagnosis D48.5 for this payer. Review payer policy for covered diagnoses for this procedure.",
        actionType: "Review Codes"
      },
      {
        category: "Documentation",
        field: "Clinical Notes",
        suggestion: "Ensure clinical notes explicitly state the reason for the tissue exam and support the medical necessity.",
        actionType: "Verify Documentation"
      }
    ],
    submissionType: 'EMC',
    formType: 'CMS 1500',
    priority: 'Primary',
    claimCount: 1,
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
    dateOfService: "2024-07-11",
    riskScore: 78,
    procedure: "71046 - Chest X-Ray",
    diagnosis: "J44.9 - COPD",
    lastActivity: "2024-07-22",
    history: [
        { status: "Pending", date: "2024-07-22", user: "UHC" },
        { status: "Submitted", date: "2024-07-12", user: "Admin" },
    ],
    submissionType: 'EMC',
    formType: 'CMS 1500',
    priority: 'Primary',
    claimCount: 2,
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
    dateOfService: "2024-07-09",
    riskScore: 35,
    procedure: "99213 - Office Visit",
    diagnosis: "M54.5 - Low back pain",
    lastActivity: "2024-07-11",
    history: [
        { status: "Scrubbing", date: "2024-07-11", user: "AI System" },
        { status: "Created", date: "2024-07-10", user: "Admin" },
    ],
    aiSuggestions: [
        {
            category: "Coding",
            field: "Modifiers",
            suggestion: "Consider adding modifier 25 if a separate E/M service was provided on the same day as another procedure.",
            actionType: "Add Modifier"
        }
    ],
    submissionType: 'Paper',
    formType: 'CMS 1500',
    priority: 'Secondary',
    claimCount: 1,
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
    dateOfService: "2024-07-08",
    riskScore: 5,
    procedure: "93000 - EKG",
    diagnosis: "I10 - Hypertension",
    lastActivity: "2024-07-19",
    history: [
        { status: "Paid", date: "2024-07-19", user: "System" },
        { status: "Submitted", date: "2024-07-09", user: "Admin" },
    ],
    submissionType: 'EMC',
    formType: 'CMS 1500',
    priority: 'Primary',
    claimCount: 3,
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
    dateOfService: "2024-07-07",
    riskScore: 65,
    procedure: "99396 - Preventive Visit",
    diagnosis: "Z00.00 - Health Exam",
    lastActivity: "2024-07-18",
    history: [
      { status: "Pending", date: "2024-07-18", user: "Aetna" },
      { status: "Submitted", date: "2024-07-08", user: "Admin" },
    ],
    submissionType: 'Paper',
    formType: 'CMS 1500',
    priority: 'Primary',
    claimCount: 1,
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
    dateOfService: "2024-07-04",
    riskScore: 85,
    procedure: "27447 - Knee Replacement",
    diagnosis: "M17.11 - Osteoarthritis",
    lastActivity: "2024-07-15",
    history: [
      { status: "Denied", date: "2024-07-15", user: "Cigna" },
      { status: "Submitted", date: "2024-07-05", user: "Admin" },
    ],
    submissionType: 'EMC',
    formType: 'CMS 1500',
    priority: 'Primary',
    claimCount: 1,
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
    dateOfService: "2024-06-30",
    riskScore: 12,
    procedure: "99204 - New Patient Visit",
    diagnosis: "E11.9 - Type 2 Diabetes",
    lastActivity: "2024-07-10",
    history: [
        { status: "Paid", date: "2024-07-10", user: "System" },
        { status: "Submitted", date: "2024-07-01", user: "Admin" },
    ],
    submissionType: 'Paper',
    formType: 'CMS 1500',
    priority: 'Tertiary',
    claimCount: 2,
  },
];

export const patients: Patient[] = [
  {
    id: "P001",
    name: "Eleanor Vance",
    dob: "1985-05-22",
    gender: "Female",
    status: "Active",
    lastVisit: "2024-07-15",
    address: "123 Wellness Way",
    city: "Healthville",
    state: "CA",
    zip: "90210",
    phone: "555-123-4567",
    email: "eleanor.vance@example.com",
    subscriberName: "Eleanor Vance",
    subscriberDob: "1985-05-22",
    subscriberRelationship: "Self",
    primaryInsuranceProvider: "Aetna",
    primaryInsuranceId: "AET123456789",
    primaryInsuranceGroup: "GRP-XYZ1",
    secondaryInsuranceProvider: "Cigna",
    secondaryInsuranceId: "CIG-SEC-987",
    secondaryInsuranceGroup: "GRP-SEC-ABC",
  },
  {
    id: "P002",
    name: "Marcus Thorne",
    dob: "1978-11-03",
    gender: "Male",
    status: "Active",
    lastVisit: "2024-07-14",
    address: "456 Recovery Road",
    city: "Metropolis",
    state: "NY",
    zip: "10001",
    phone: "555-987-6543",
    email: "marcus.thorne@example.com",
    subscriberName: "Marcus Thorne",
    subscriberDob: "1978-11-03",
    subscriberRelationship: "Self",
    primaryInsuranceProvider: "Cigna",
    primaryInsuranceId: "CIG987654321",
    primaryInsuranceGroup: "GRP-QWE3",
  },
  {
    id: "P003",
    name: "Seraphina Moon",
    dob: "1992-02-14",
    gender: "Female",
    status: "Active",
    lastVisit: "2024-07-12",
    address: "789 Serenity Lane",
    city: "Starfall",
    state: "TX",
    zip: "75001",
    phone: "555-246-8135",
    email: "seraphina.moon@example.com",
    subscriberName: "Julian Moon",
    subscriberDob: "1990-01-01",
    subscriberRelationship: "Spouse",
    primaryInsuranceProvider: "United Healthcare",
    primaryInsuranceId: "UHC246813579",
    primaryInsuranceGroup: "GRP-RTY4",
  },
  {
    id: "P004",
    name: "Julian Croft",
    dob: "1965-09-30",
    gender: "Male",
    status: "Active",
    lastVisit: "2024-07-10",
    address: "101 Adventure Ave",
    city: "Explorers Hub",
    state: "FL",
    zip: "33101",
    phone: "555-135-7924",
    email: "julian.croft@example.com",
    subscriberName: "Julian Croft",
    subscriberDob: "1965-09-30",
    subscriberRelationship: "Self",
    primaryInsuranceProvider: "BlueCross BlueShield",
    primaryInsuranceId: "BCBS135792468",
    primaryInsuranceGroup: "GRP-UIO5",
  },
  {
    id: "P005",
    name: "Isabella Chen",
    dob: "2001-03-18",
    gender: "Female",
    status: "Inactive",
    lastVisit: "2024-07-09",
    address: "222 Innovation Drive",
    city: "Tech Park",
    state: "WA",
    zip: "98101",
    phone: "555-555-4443",
    email: "isabella.chen@example.com",
    subscriberName: "David Chen",
    subscriberDob: "1975-10-10",
    subscriberRelationship: "Child",
    primaryInsuranceProvider: "Humana",
    primaryInsuranceId: "HUM555444333",
    primaryInsuranceGroup: "GRP-PAS6",
  },
  {
    id: "P006",
    name: "Liam O'Connell",
    dob: "1988-07-07",
    gender: "Male",
    status: "Active",
    lastVisit: "2024-07-08",
    address: "333 Clover Court",
    city: "Dublin",
    state: "OH",
    zip: "43016",
    phone: "555-998-8776",
    email: "liam.oconnell@example.com",
    subscriberName: "Liam O'Connell",
    subscriberDob: "1988-07-07",
    subscriberRelationship: "Self",
    primaryInsuranceProvider: "Aetna",
    primaryInsuranceId: "AET998877665",
    primaryInsuranceGroup: "GRP-DFG7",
  },
  {
    id: "P007",
    name: "Sophia Rodriguez",
    dob: "1955-12-25",
    gender: "Female",
    status: "Active",
    lastVisit: "2024-07-05",
    address: "777 Sunshine Blvd",
    city: "Golden City",
    state: "AZ",
    zip: "85001",
    phone: "555-112-2334",
    email: "sophia.rodriguez@example.com",
    subscriberName: "Sophia Rodriguez",
    subscriberDob: "1955-12-25",
    subscriberRelationship: "Self",
    primaryInsuranceProvider: "Cigna",
    primaryInsuranceId: "CIG112233445",
    primaryInsuranceGroup: "GRP-HJK8",
  },
  {
    id: "P008",
    name: "Kenji Tanaka",
    dob: "1995-08-15",
    gender: "Male",
    status: "Inactive",
    lastVisit: "2024-07-01",
    address: "888 Blossom Lane",
    city: "Sakura Valley",
    state: "OR",
    zip: "97201",
    phone: "555-777-8889",
    email: "kenji.tanaka@example.com",
    subscriberName: "Kenji Tanaka",
    subscriberDob: "1995-08-15",
    subscriberRelationship: "Self",
    primaryInsuranceProvider: "United Healthcare",
    primaryInsuranceId: "UHC777888999",
    primaryInsuranceGroup: "GRP-LKM9",
  },
];


export const statements: Statement[] = [
    { id: 'STMT-001', patientId: 'P001', patientName: 'Eleanor Vance', dateIssued: '2024-07-20', amountDue: 50.00, status: 'Paid' },
    { id: 'STMT-002', patientId: 'P002', patientName: 'Marcus Thorne', dateIssued: '2024-07-21', amountDue: 150.00, status: 'Overdue' },
    { id: 'STMT-003', patientId: 'P003', patientName: 'Seraphina Moon', dateIssued: '2024-07-22', amountDue: 75.50, status: 'Sent' },
    { id: 'STMT-004', patientId: 'P004', patientName: 'Julian Croft', dateIssued: '2024-07-23', amountDue: 25.00, status: 'Paid' },
    { id: 'STMT-005', patientId: 'P006', patientName: "Liam O'Connell", dateIssued: '2024-07-24', amountDue: 200.00, status: 'Sent' },
    { id: 'STMT-006', patientId: 'P007', patientName: 'Sophia Rodriguez', dateIssued: '2024-07-25', amountDue: 300.00, status: 'Draft' },
    { id: 'STMT-007', patientId: 'P008', patientName: 'Kenji Tanaka', dateIssued: '2024-07-26', amountDue: 120.00, status: 'Overdue' },
];
