import { Practice, Patient, Claim, Statement, Appointment, RecentActivity } from './data';
import { InsurancePlan } from './insurance-data';
import { Payment } from './payments-data';

export const practices: Practice[] = [
    { id: 'practice-1', name: 'General Hospital' },
    { id: 'practice-2', name: 'Pediatrics Clinic' },
];

export const patients: Patient[] = [
    {
        id: 'patient-1',
        name: 'John Doe',
        dob: '1985-02-20',
        gender: 'Male',
        status: 'Active',
        lastVisit: '2024-07-10',
        address: '123 Maple St',
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        phone: '555-123-4567',
        email: 'john.doe@example.com',
        subscriberName: 'John Doe',
        subscriberDob: '1985-02-20',
        subscriberRelationship: 'Self',
        primaryInsuranceProvider: 'Aetna',
        primaryInsuranceId: 'AETNA123456',
        primaryInsuranceGroup: 'GROUP1',
        secondaryInsuranceProvider: 'Cigna',
        secondaryInsuranceId: 'CIGNA654321',
        secondaryInsuranceGroup: 'GROUPSEC2',
        practiceId: 'practice-1'
    },
    {
        id: 'patient-2',
        name: 'Jane Smith',
        dob: '1990-06-15',
        gender: 'Female',
        status: 'Active',
        lastVisit: '2024-06-25',
        address: '456 Oak Ave',
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        phone: '555-987-6543',
        email: 'jane.smith@example.com',
        subscriberName: 'Jane Smith',
        subscriberDob: '1990-06-15',
        subscriberRelationship: 'Self',
        primaryInsuranceProvider: 'BlueCross BlueShield',
        primaryInsuranceId: 'BCBS987654',
        primaryInsuranceGroup: 'GROUP2',
        practiceId: 'practice-1'
    },
    {
        id: 'patient-3',
        name: 'Mike Johnson',
        dob: '2018-10-01',
        gender: 'Male',
        status: 'Active',
        lastVisit: '2024-07-15',
        address: '789 Pine Ln',
        city: 'Smallville',
        state: 'TX',
        zip: '75001',
        phone: '555-555-1212',
        email: 'mike.j@example.com',
        subscriberName: 'Robert Johnson',
        subscriberDob: '1980-01-01',
        subscriberRelationship: 'Child',
        primaryInsuranceProvider: 'United Healthcare',
        primaryInsuranceId: 'UHC112233',
        primaryInsuranceGroup: 'GROUP3',
        practiceId: 'practice-2'
    },
    {
        id: 'patient-4',
        name: 'Emily Williams',
        dob: '2020-03-22',
        gender: 'Female',
        status: 'Active',
        lastVisit: '2024-07-01',
        address: '101 Birch Rd',
        city: 'Smallville',
        state: 'TX',
        zip: '75001',
        phone: '555-222-3333',
        email: 'emily.w@example.com',
        subscriberName: 'Sarah Williams',
        subscriberDob: '1992-05-18',
        subscriberRelationship: 'Child',
        primaryInsuranceProvider: 'Cigna',
        primaryInsuranceId: 'CIGNA445566',
        primaryInsuranceGroup: 'GROUP4',
        practiceId: 'practice-2'
    }
];

export const appointments: (Omit<Appointment, 'patientName'>)[] = [
    { id: 'appt-1', patientId: 'patient-1', date: '2024-07-25', time: '10:00', provider: 'Dr. Evelyn Reed', procedure: 'Annual Checkup', status: 'Scheduled', room: '101', practiceId: 'practice-1' },
    { id: 'appt-2', patientId: 'patient-2', date: '2024-07-26', time: '14:30', provider: 'Dr. Ben Carter', procedure: 'Follow-up', status: 'Scheduled', room: '102', practiceId: 'practice-1' },
    { id: 'appt-3', patientId: 'patient-3', date: '2024-07-15', time: '09:00', provider: 'Dr. Samira Khan', procedure: 'Vaccination', status: 'Checked Out', room: 'P1', practiceId: 'practice-2' },
    { id: 'appt-4', patientId: 'patient-4', date: '2024-07-01', time: '11:00', provider: 'Dr. Samira Khan', procedure: 'Well-child visit', status: 'Checked Out', room: 'P2', practiceId: 'practice-2' },
];

export const claims: Omit<Claim, 'date' | 'dateOfService' | 'lastActivity'>[] & { date: string, dateOfService: string, lastActivity: string }[] = [
    {
        id: 'claim-1', patient: 'John Doe', patientId: 'patient-1', provider: 'Dr. Evelyn Reed', payer: 'Aetna', amount: 150, status: 'Pending', date: '2024-07-11', dateOfService: '2024-07-10', procedure: '99213 - Office Visit', diagnosis: 'R05 - Cough', lastActivity: '2024-07-11',
        history: [{ status: 'Submitted', date: '2024-07-11', user: 'Admin' }], submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-1', riskScore: 15,
    },
    {
        id: 'claim-2', patient: 'Jane Smith', patientId: 'patient-2', provider: 'Dr. Ben Carter', payer: 'BlueCross BlueShield', amount: 450, status: 'Denied', date: '2024-07-01', dateOfService: '2024-06-25', denialReason: 'Medical Necessity', riskScore: 92, procedure: '99395 - Preventive Visit', diagnosis: 'Z00.129 - Well-Child Check', lastActivity: '2024-07-10',
        history: [{ status: 'Submitted', date: '2024-07-01', user: 'Admin' }, { status: 'Denied', date: '2024-07-10', user: 'System' }],
        aiSuggestions: [{ category: 'Coding', field: 'Diagnosis Code', suggestion: 'Diagnosis code Z00.129 may not be appropriate for an adult patient. Verify patient age and visit type.', actionType: 'Correct Code' }],
        submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-1',
    },
    {
        id: 'claim-3', patient: 'Mike Johnson', patientId: 'patient-3', provider: 'Dr. Samira Khan', payer: 'United Healthcare', amount: 75, status: 'Paid', date: '2024-07-16', dateOfService: '2024-07-15', procedure: '90471 - Immunization admin', diagnosis: 'Z23 - Encounter for immunization', lastActivity: '2024-07-25',
        history: [{ status: 'Submitted', date: '2024-07-16', user: 'Admin' }, { status: 'Paid', date: '2024-07-25', user: 'System' }],
        submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-2', riskScore: 5,
    },
    {
        id: 'claim-4', patient: 'Emily Williams', patientId: 'patient-4', provider: 'Dr. Samira Khan', payer: 'Cigna', amount: 250, status: 'Scrubbing', date: '2024-07-02', dateOfService: '2024-07-01', riskScore: 78, procedure: '99392 - Periodic reevaluation', diagnosis: 'Z00.121 - Routine child health examination', lastActivity: '2024-07-02',
        history: [{ status: 'Created', date: '2024-07-02', user: 'Admin' }, { status: 'Scrubbing', date: '2024-07-02', user: 'AI System' }],
        aiSuggestions: [{ category: 'Patient Info', field: 'Subscriber ID', suggestion: 'Subscriber ID format appears incorrect for Cigna. Please verify.', actionType: 'Verify Info' }],
        submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-2',
    }
];

export const statements: Statement[] = [
    { id: 'stmt-1', patientId: 'patient-1', patientName: 'John Doe', dateIssued: '2024-06-30', amountDue: 50.00, status: 'Overdue', practiceId: 'practice-1' },
    { id: 'stmt-2', patientId: 'patient-2', patientName: 'Jane Smith', dateIssued: '2024-07-15', amountDue: 25.00, status: 'Sent', practiceId: 'practice-1' },
    { id: 'stmt-3', patientId: 'patient-3', patientName: 'Mike Johnson', dateIssued: '2024-07-20', amountDue: 15.00, status: 'Paid', practiceId: 'practice-2' },
    { id: 'stmt-4', patientId: 'patient-4', patientName: 'Emily Williams', dateIssued: '2024-07-25', amountDue: 0, status: 'Draft', practiceId: 'practice-2' }
];

export const insurancePlans: InsurancePlan[] = [
    {
        id: 'plan-1', payerName: 'Aetna', planName: 'Aetna Choice® POS II', planType: 'POS', memberCount: 1250, totalClaims: 850, timelyFilingLimit: 90, claimsCorrectionLimit: 180, status: 'Active',
        benefits: { individualDeductible: { inNetwork: '$1,500', outOfNetwork: '$5,000' }, familyDeductible: { inNetwork: '$3,000', outOfNetwork: '$10,000' }, individualOOPMax: { inNetwork: '$6,000', outOfNetwork: '$15,000' }, familyOOPMax: { inNetwork: '$12,000', outOfNetwork: '$30,000' } },
        coveredCpt: [{ code: '99213', description: 'Office visit, established patient', requiresAuth: false, notes: 'Standard coverage' }],
        coveredDx: [{ code: 'I10', description: 'Essential (primary) hypertension' }]
    },
    {
        id: 'plan-2', payerName: 'Cigna', planName: 'Cigna Connect HMO', planType: 'HMO', memberCount: 800, totalClaims: 600, timelyFilingLimit: 120, claimsCorrectionLimit: 120, status: 'Active',
        benefits: { individualDeductible: { inNetwork: '$2,000', outOfNetwork: 'N/A' }, familyDeductible: { inNetwork: '$4,000', outOfNetwork: 'N/A' }, individualOOPMax: { inNetwork: '$8,000', outOfNetwork: 'N/A' }, familyOOPMax: { inNetwork: '$16,000', outOfNetwork: 'N/A' } },
        coveredCpt: [{ code: '99203', description: 'Office visit, new patient', requiresAuth: true, notes: 'Referral Required' }],
        coveredDx: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }]
    },
    {
        id: 'plan-3', payerName: 'United Healthcare', planName: 'UHC Navigate', planType: 'PPO', memberCount: 2500, totalClaims: 1500, timelyFilingLimit: 90, claimsCorrectionLimit: 180, status: 'Active'
    },
    {
        id: 'plan-4', payerName: 'BlueCross BlueShield', planName: 'Blue Advantage HMO', planType: 'HMO', memberCount: 1800, totalClaims: 1200, timelyFilingLimit: 180, claimsCorrectionLimit: 180, status: 'Terminated'
    }
];

export const payments: Payment[] = [
    {
        id: 'payment-1', claimId: 'claim-3', payerName: 'United Healthcare', paymentDate: '2024-07-25', amountPaid: 60.00, remittanceCode: 'CAS', patientName: 'Mike Johnson', billedAmount: 75.00, patientResponsibility: 15.00, paymentMethod: 'ERA',
        adjustments: [{ reasonCode: 'CO-45', description: 'Contractual Obligation', amount: 15.00 }]
    }
];

export const recentActivity: Omit<RecentActivity, 'createdAt'>[] & { createdAt: string }[] = [
    { id: 'activity-1', user: 'Admin', avatar: 'https://picsum.photos/seed/admin/40/40', action: 'submitted claim', target: 'claim-1', time: '2h ago', practiceId: 'practice-1', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-2', user: 'AI System', avatar: 'https://picsum.photos/seed/ai/40/40', action: 'flagged claim for review', target: 'claim-2', time: '3h ago', practiceId: 'practice-1', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-3', user: 'Admin', avatar: 'https://picsum.photos/seed/admin/40/40', action: 'updated patient info for', target: 'Jane Smith', time: '5h ago', practiceId: 'practice-1', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-4', user: 'System', avatar: 'https://picsum.photos/seed/sys/40/40', action: 'received payment for claim', target: 'claim-3', time: '1d ago', practiceId: 'practice-2', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-5', user: 'AI System', avatar: 'https://picsum.photos/seed/ai/40/40', action: 'identified scrubbing issue on', target: 'claim-4', time: '2d ago', practiceId: 'practice-2', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
];
