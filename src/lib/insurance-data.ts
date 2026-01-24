export type BenefitDetails = {
    inNetwork: string;
    outOfNetwork: string;
};

export type CoveredCpt = {
    code: string;
    description: string;
    requiresAuth: boolean;
    notes: string;
};

export type CoveredDx = {
    code: string;
    description: string;
};

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
    benefits?: {
        individualDeductible: BenefitDetails;
        familyDeductible: BenefitDetails;
        individualOOPMax: BenefitDetails;
        familyOOPMax: BenefitDetails;
    };
    coveredCpt?: CoveredCpt[];
    coveredDx?: CoveredDx[];
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
        benefits: {
            individualDeductible: { inNetwork: '$1,500', outOfNetwork: '$5,000' },
            familyDeductible: { inNetwork: '$3,000', outOfNetwork: '$10,000' },
            individualOOPMax: { inNetwork: '$6,000', outOfNetwork: '$15,000' },
            familyOOPMax: { inNetwork: '$12,000', outOfNetwork: '$30,000' },
        },
        coveredCpt: [
            { code: '99213', description: 'Office visit, established patient, 15-25 min', requiresAuth: false, notes: 'Standard coverage' },
            { code: '99214', description: 'Office visit, established patient, 25-39 min', requiresAuth: false, notes: 'Standard coverage' },
            { code: '99396', description: 'Preventive visit, established patient, 40-64 yrs', requiresAuth: false, notes: 'Covered once annually' },
            { code: '93000', description: 'Electrocardiogram, routine (EKG)', requiresAuth: false, notes: 'Covered if medically necessary' },
            { code: '71046', description: 'Chest X-Ray, 2 views', requiresAuth: true, notes: 'Prior authorization needed' },
            { code: '27447', description: 'Total knee arthroplasty', requiresAuth: true, notes: 'Prior auth & medical necessity review' },
        ],
        coveredDx: [
            { code: 'I10', description: 'Essential (primary) hypertension' },
            { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
            { code: 'R05', description: 'Cough' },
            { code: 'M54.5', description: 'Low back pain' },
            { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
        ]
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
