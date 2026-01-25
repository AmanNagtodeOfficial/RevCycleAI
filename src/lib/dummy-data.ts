import { Practice, Patient, Claim, Statement, Appointment, RecentActivity } from './data';
import { InsurancePlan } from './insurance-data';
import { Payment } from './payments-data';

export const practices: Practice[] = [
    { id: 'practice-test', name: 'Test Practice' },
    { id: 'practice-2', name: 'Wellness Clinic' },
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
        practiceId: 'practice-test'
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
        practiceId: 'practice-test'
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
        practiceId: 'practice-test'
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
        practiceId: 'practice-test'
    },
    {
        id: 'patient-5',
        name: 'Sarah Connor',
        dob: '1965-05-13',
        gender: 'Female',
        status: 'Active',
        lastVisit: '2024-05-20',
        address: '2501 E. 5th Street',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90033',
        phone: '555-867-5309',
        email: 'sarah.c@example.com',
        subscriberName: 'Sarah Connor',
        subscriberDob: '1965-05-13',
        subscriberRelationship: 'Self',
        primaryInsuranceProvider: 'BlueCross BlueShield',
        primaryInsuranceId: 'BCBS-SC1984',
        primaryInsuranceGroup: 'GROUP-T800',
        practiceId: 'practice-test'
    },
    {
        id: 'patient-6',
        name: 'Kyle Reese',
        dob: '2002-11-22',
        gender: 'Male',
        status: 'Inactive',
        lastVisit: '2023-01-15',
        address: '1428 Elm Street',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90033',
        phone: '555-198-4000',
        email: 'kyle.r@example.com',
        subscriberName: 'Kyle Reese',
        subscriberDob: '2002-11-22',
        subscriberRelationship: 'Self',
        primaryInsuranceProvider: 'Aetna',
        primaryInsuranceId: 'AETNA-KR2029',
        primaryInsuranceGroup: 'GROUP-RESIST',
        practiceId: 'practice-test'
    },
    {
        id: 'patient-7',
        name: 'Peter Venkman',
        dob: '1950-10-19',
        gender: 'Male',
        status: 'Active',
        lastVisit: '2024-07-18',
        address: '14 N Moore St',
        city: 'New York',
        state: 'NY',
        zip: '10013',
        phone: '555-236-8000',
        email: 'pvenkman@example.com',
        subscriberName: 'Peter Venkman',
        subscriberDob: '1950-10-19',
        subscriberRelationship: 'Self',
        primaryInsuranceProvider: 'Cigna',
        primaryInsuranceId: 'CIGNA-PV1984',
        primaryInsuranceGroup: 'GB-NYC',
        practiceId: 'practice-2'
    },
    {
        id: 'patient-8',
        name: 'Dana Barrett',
        dob: '1955-12-08',
        gender: 'Female',
        status: 'Active',
        lastVisit: '2024-07-22',
        address: '55 Central Park West',
        city: 'New York',
        state: 'NY',
        zip: '10023',
        phone: '555-236-8001',
        email: 'dana.b@example.com',
        subscriberName: 'Dana Barrett',
        subscriberDob: '1955-12-08',
        subscriberRelationship: 'Self',
        primaryInsuranceProvider: 'United Healthcare',
        primaryInsuranceId: 'UHC-DB1984',
        primaryInsuranceGroup: 'ORCHESTRA',
        practiceId: 'practice-2'
    }
];

export const appointments: (Omit<Appointment, 'patientName'>)[] = [
    { id: 'appt-1', patientId: 'patient-1', date: '2024-07-25', time: '10:00', provider: 'Dr. Evelyn Reed', procedure: 'Annual Checkup', status: 'Scheduled', room: '101', practiceId: 'practice-test' },
    { id: 'appt-2', patientId: 'patient-2', date: '2024-07-26', time: '14:30', provider: 'Dr. Ben Carter', procedure: 'Follow-up', status: 'Scheduled', room: '102', practiceId: 'practice-test' },
    { id: 'appt-3', patientId: 'patient-3', date: '2024-07-15', time: '09:00', provider: 'Dr. Samira Khan', procedure: 'Vaccination', status: 'Checked Out', room: 'P1', practiceId: 'practice-test' },
    { id: 'appt-4', patientId: 'patient-4', date: '2024-07-01', time: '11:00', provider: 'Dr. Samira Khan', procedure: 'Well-child visit', status: 'Checked Out', room: 'P2', practiceId: 'practice-test' },
    { id: 'appt-5', patientId: 'patient-5', date: '2024-07-28', time: '13:00', provider: 'Dr. Evelyn Reed', procedure: 'Consultation', status: 'Scheduled', room: '103', practiceId: 'practice-test' },
    { id: 'appt-6', patientId: 'patient-1', date: '2024-07-29', time: '11:00', provider: 'Dr. Ben Carter', procedure: 'Physical Therapy', status: 'Scheduled', room: 'Gym', practiceId: 'practice-test' },
    { id: 'appt-7', patientId: 'patient-7', date: '2024-08-01', time: '10:30', provider: 'Dr. Egon Spengler', procedure: 'Psych eval', status: 'Scheduled', room: '201', practiceId: 'practice-2' },
    { id: 'appt-8', patientId: 'patient-8', date: '2024-08-02', time: '15:00', provider: 'Dr. Ray Stantz', procedure: 'Follow-up', status: 'Scheduled', room: '202', practiceId: 'practice-2' },
];

export const claims: Omit<Claim, 'date' | 'dateOfService' | 'lastActivity'>[] & { date: string, dateOfService: string, lastActivity: string }[] = [
    {
        id: 'claim-1', patient: 'John Doe', patientId: 'patient-1', provider: 'Dr. Evelyn Reed', payer: 'Aetna', amount: 150, status: 'Pending', date: '2024-07-11', dateOfService: '2024-07-10', procedure: '99213 - Office Visit', diagnosis: 'R05 - Cough', lastActivity: '2024-07-11',
        history: [{ status: 'Submitted', date: '2024-07-11', user: 'Admin' }], submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-test', riskScore: 15,
    },
    {
        id: 'claim-2', patient: 'Jane Smith', patientId: 'patient-2', provider: 'Dr. Ben Carter', payer: 'BlueCross BlueShield', amount: 450, status: 'Denied', date: '2024-07-01', dateOfService: '2024-06-25', denialReason: 'Medical Necessity', riskScore: 92, procedure: '99395 - Preventive Visit', diagnosis: 'Z00.129 - Well-Child Check', lastActivity: '2024-07-10',
        history: [{ status: 'Submitted', date: '2024-07-01', user: 'Admin' }, { status: 'Denied', date: '2024-07-10', user: 'System' }],
        aiSuggestions: [{ category: 'Coding', field: 'Diagnosis Code', suggestion: 'Diagnosis code Z00.129 may not be appropriate for an adult patient. Verify patient age and visit type.', actionType: 'Correct Code' }],
        submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-test',
    },
    {
        id: 'claim-3', patient: 'Mike Johnson', patientId: 'patient-3', provider: 'Dr. Samira Khan', payer: 'United Healthcare', amount: 75, status: 'Paid', date: '2024-07-16', dateOfService: '2024-07-15', procedure: '90471 - Immunization admin', diagnosis: 'Z23 - Encounter for immunization', lastActivity: '2024-07-25',
        history: [{ status: 'Submitted', date: '2024-07-16', user: 'Admin' }, { status: 'Paid', date: '2024-07-25', user: 'System' }],
        submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-test', riskScore: 5,
    },
    {
        id: 'claim-4', patient: 'Emily Williams', patientId: 'patient-4', provider: 'Dr. Samira Khan', payer: 'Cigna', amount: 250, status: 'Scrubbing', date: '2024-07-02', dateOfService: '2024-07-01', riskScore: 78, procedure: '99392 - Periodic reevaluation', diagnosis: 'Z00.121 - Routine child health examination', lastActivity: '2024-07-02',
        history: [{ status: 'Created', date: '2024-07-02', user: 'Admin' }, { status: 'Scrubbing', date: '2024-07-02', user: 'AI System' }],
        aiSuggestions: [{ category: 'Patient Info', field: 'Subscriber ID', suggestion: 'Subscriber ID format appears incorrect for Cigna. Please verify.', actionType: 'Verify Info' }],
        submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-test',
    },
    {
        id: 'claim-5', patient: 'Sarah Connor', patientId: 'patient-5', provider: 'Dr. Evelyn Reed', payer: 'BlueCross BlueShield', amount: 300, status: 'Submitted', date: '2024-05-22', dateOfService: '2024-05-20', procedure: '99204 - Office visit, new patient', diagnosis: 'F43.10 - PTSD', lastActivity: '2024-05-22',
        history: [{ status: 'Created', date: '2024-05-22', user: 'Admin' }, { status: 'Submitted', date: '2024-05-22', user: 'Admin' }],
        submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-test', riskScore: 25,
    },
    {
        id: 'claim-6', patient: 'Peter Venkman', patientId: 'patient-7', provider: 'Dr. Egon Spengler', payer: 'Cigna', amount: 500, status: 'Paid', date: '2024-07-20', dateOfService: '2024-07-18', procedure: '90837 - Psychotherapy, 60 minutes', diagnosis: 'F41.9 - Anxiety disorder, unspecified', lastActivity: '2024-07-28',
        history: [{ status: 'Submitted', date: '2024-07-20', user: 'Billing' }, { status: 'Paid', date: '2024-07-28', user: 'System' }],
        submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-2', riskScore: 10,
    },
    {
        id: 'claim-7', patient: 'Dana Barrett', patientId: 'patient-8', provider: 'Dr. Ray Stantz', payer: 'United Healthcare', amount: 220, status: 'Denied', date: '2024-07-23', dateOfService: '2024-07-22', denialReason: 'Incorrect Diagnosis Code', riskScore: 88, procedure: '99214 - Office Visit', diagnosis: 'G47.00 - Insomnia', lastActivity: '2024-07-30',
        history: [{ status: 'Submitted', date: '2024-07-23', user: 'Billing' }, { status: 'Denied', date: '2024-07-30', user: 'System' }],
        aiSuggestions: [{ category: 'Coding', field: 'Diagnosis Code', suggestion: 'G47.00 may be too general. Consider a more specific code if documentation supports it, or add secondary diagnosis.', actionType: 'Correct Code' }],
        submissionType: 'EMC', formType: 'CMS 1500', priority: 'Primary', claimCount: 1, practiceId: 'practice-2',
    }
];

export const statements: Statement[] = [
    { id: 'stmt-1', patientId: 'patient-1', patientName: 'John Doe', dateIssued: '2024-06-30', amountDue: 50.00, status: 'Overdue', practiceId: 'practice-test' },
    { id: 'stmt-2', patientId: 'patient-2', patientName: 'Jane Smith', dateIssued: '2024-07-15', amountDue: 25.00, status: 'Sent', practiceId: 'practice-test' },
    { id: 'stmt-3', patientId: 'patient-3', patientName: 'Mike Johnson', dateIssued: '2024-07-20', amountDue: 15.00, status: 'Paid', practiceId: 'practice-test' },
    { id: 'stmt-4', patientId: 'patient-4', patientName: 'Emily Williams', dateIssued: '2024-07-25', amountDue: 0, status: 'Draft', practiceId: 'practice-test' },
    { id: 'stmt-5', patientId: 'patient-5', patientName: 'Sarah Connor', dateIssued: '2024-06-20', amountDue: 75.00, status: 'Sent', practiceId: 'practice-test' },
    { id: 'stmt-6', patientId: 'patient-7', patientName: 'Peter Venkman', dateIssued: '2024-07-28', amountDue: 50.00, status: 'Paid', practiceId: 'practice-2' },
    { id: 'stmt-7', patientId: 'patient-8', patientName: 'Dana Barrett', dateIssued: '2024-07-30', amountDue: 40.00, status: 'Overdue', practiceId: 'practice-2' },
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
    },
    {
        id: 'payment-2', claimId: 'claim-6', payerName: 'Cigna', paymentDate: '2024-07-28', amountPaid: 450.00, remittanceCode: 'CAS', patientName: 'Peter Venkman', billedAmount: 500.00, patientResponsibility: 50.00, paymentMethod: 'ERA',
        adjustments: [{ reasonCode: 'CO-45', description: 'Contractual Obligation', amount: 50.00 }]
    }
];

export const recentActivity: Omit<RecentActivity, 'createdAt'>[] & { createdAt: string }[] = [
    { id: 'activity-1', user: 'Admin', avatar: 'https://picsum.photos/seed/admin/40/40', action: 'submitted claim', target: 'claim-1', time: '2h ago', practiceId: 'practice-test', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-2', user: 'AI System', avatar: 'https://picsum.photos/seed/ai/40/40', action: 'flagged claim for review', target: 'claim-2', time: '3h ago', practiceId: 'practice-test', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-3', user: 'Admin', avatar: 'https://picsum.photos/seed/admin/40/40', action: 'updated patient info for', target: 'Jane Smith', time: '5h ago', practiceId: 'practice-test', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-4', user: 'System', avatar: 'https://picsum.photos/seed/sys/40/40', action: 'received payment for claim', target: 'claim-3', time: '1d ago', practiceId: 'practice-test', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-5', user: 'AI System', avatar: 'https://picsum.photos/seed/ai/40/40', action: 'identified scrubbing issue on', target: 'claim-4', time: '2d ago', practiceId: 'practice-test', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-6', user: 'Billing', avatar: 'https://picsum.photos/seed/billing/40/40', action: 'submitted claim', target: 'claim-6', time: '1d ago', practiceId: 'practice-2', createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() },
    { id: 'activity-7', user: 'System', avatar: 'https://picsum.photos/seed/sys2/40/40', action: 'denied claim', target: 'claim-7', time: '18h ago', practiceId: 'practice-2', createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
];
