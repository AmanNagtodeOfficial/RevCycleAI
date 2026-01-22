export type InsurancePlan = {
    id: string;
    payerName: string;
    planName: string;
    planType: 'PPO' | 'HMO' | 'EPO' | 'POS';
    memberCount: number;
    totalClaims: number;
    timelyFilingLimit: number; // TFL
    claimsCorrectionLimit: number; // CCFL
    status: 'Active' | 'Terminated';
};

export const insurancePlans: InsurancePlan[] = [
    {
        id: 'INS-001',
        payerName: 'Aetna',
        planName: 'Aetna Choice® POS II',
        planType: 'POS',
        memberCount: 1250,
        totalClaims: 850,
        timelyFilingLimit: 90,
        claimsCorrectionLimit: 180,
        status: 'Active',
    },
    {
        id: 'INS-002',
        payerName: 'Cigna',
        planName: 'Cigna Connect HMO',
        planType: 'HMO',
        memberCount: 800,
        totalClaims: 620,
        timelyFilingLimit: 120,
        claimsCorrectionLimit: 120,
        status: 'Active',
    },
    {
        id: 'INS-003',
        payerName: 'United Healthcare',
        planName: 'UHC Navigate® PPO',
        planType: 'PPO',
        memberCount: 2100,
        totalClaims: 1500,
        timelyFilingLimit: 90,
        claimsCorrectionLimit: 365,
        status: 'Active',
    },
    {
        id: 'INS-004',
        payerName: 'BlueCross BlueShield',
        planName: 'BCBS Blue Advantage (HMO)',
        planType: 'HMO',
        memberCount: 1500,
        totalClaims: 1100,
        timelyFilingLimit: 180,
        claimsCorrectionLimit: 180,
        status: 'Active',
    },
    {
        id: 'INS-005',
        payerName: 'Humana',
        planName: 'Humana Gold Plus HMO',
        planType: 'HMO',
        memberCount: 650,
        totalClaims: 400,
        timelyFilingLimit: 90,
        claimsCorrectionLimit: 90,
        status: 'Terminated',
    },
     {
        id: 'INS-006',
        payerName: 'Aetna',
        planName: 'Aetna Open Access® Managed Choice®',
        planType: 'POS',
        memberCount: 950,
        totalClaims: 710,
        timelyFilingLimit: 90,
        claimsCorrectionLimit: 180,
        status: 'Active',
    },
    {
        id: 'INS-007',
        payerName: 'United Healthcare',
        planName: 'UHC Core Essential (EPO)',
        planType: 'EPO',
        memberCount: 1800,
        totalClaims: 1300,
        timelyFilingLimit: 90,
        claimsCorrectionLimit: 365,
        status: 'Active',
    },
];
