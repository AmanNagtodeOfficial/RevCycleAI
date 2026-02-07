
import { Timestamp } from "firebase/firestore";

export type Claim = {
  id: string;
  patient: string;
  patientId: string;
  provider: string;
  payer: string;
  amount: number;
  status: "Paid" | "Denied" | "Pending" | "Submitted" | "Scrubbing";
  date: string | Timestamp;
  dateOfService: string | Timestamp;
  denialReason?: string;
  riskScore?: number;
  procedure: string;
  diagnosis: string;
  lastActivity: string | Timestamp;
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
  practiceId: string;
};

export type Patient = {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  status: 'Active' | 'Inactive';
  lastVisit: string;
  
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;

  subscriberName: string;
  subscriberDob: string;
  subscriberRelationship: 'Self' | 'Spouse' | 'Child' | 'Other';

  primaryInsuranceProvider: string;
  primaryInsuranceId: string;
  primaryInsuranceGroup: string;

  secondaryInsuranceProvider?: string;
  secondaryInsuranceId?: string;
  secondaryInsuranceGroup?: string;

  practiceId: string;
};

export type Statement = {
  id: string;
  patientId: string;
  patientName: string;
  dateIssued: string;
  amountDue: number;
  status: "Paid" | "Sent" | "Overdue" | "Draft";
  practiceId: string;
};

export type Practice = {
  id: string;
  name: string;
};

export type RecentActivity = {
    id: string;
    user: string;
    avatar: string;
    action: string;
    target: string;
    time: string;
    practiceId: string;
    createdAt: Timestamp;
}

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  provider: string;
  procedure: string;
  status: "Scheduled" | "Checked In" | "In Room" | "Checked Out" | "Cancelled" | "No Show";
  room: string;
  notes?: string;
  practiceId: string;
};

export type PatientDocument = {
  id: string;
  patientId: string;
  name: string;
  category: "Medical Record" | "Progress Note" | "Insurance Card" | "Authorization";
  dateUploaded: string | Timestamp;
  url: string;
  practiceId: string;
};

export const practices: Practice[] = [];
export const claims: Claim[] = [];
export const patients: Patient[] = [];
export const statements: Statement[] = [];
export const appointments: Appointment[] = [];
