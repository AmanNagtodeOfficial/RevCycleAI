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

export const insurancePlans: InsurancePlan[] = [];
