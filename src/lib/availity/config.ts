// src/lib/availity/config.ts

// Define API Endpoints
const API_BASE_URL = 'https://api.availity.com'; // Base URL for Availity API

export const AvailityEndpoints = {
    getPatients: `${API_BASE_URL}/patients`,
    getClaims: `${API_BASE_URL}/claims`,
    getEligibility: `${API_BASE_URL}/eligibility`,
    // Add more endpoints as needed
};

// Define Types
export type Patient = {
    id: string;
    name: string;
    dateOfBirth: string;
    // Add additional patient properties as needed
};

export type Claim = {
    id: string;
    status: string;
    totalAmount: number;
    // Add additional claim properties as needed
};

export type Eligibility = {
    patientId: string;
    isEligible: boolean;
    coverageDetails: string;
    // Add additional eligibility properties as needed
};

// Export the endpoints and types for use in the application