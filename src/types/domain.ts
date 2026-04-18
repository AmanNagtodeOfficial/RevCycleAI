// src/types/domain.ts

// Revenue Cycle Management (RCM) domain models

// Claim Types
type ClaimType = {  
  id: string;  
  name: string;  
  description?: string;  
};

// Patient Types
interface PatientType {  
  id: string;  
  firstName: string;  
  lastName: string;  
  dateOfBirth: Date;  
  gender: 'Male' | 'Female' | 'Other';  
  insuranceId?: string;  
}

// Provider Types
interface ProviderType {  
  id: string;  
  name: string;  
  specialty: string;  
  npi: string;
  contactInfo: {  
    phone: string;  
    email: string;  
  };  
}

// Audit Types
interface AuditType {  
  id: string;  
  description: string;  
  status: 'Pending' | 'Completed' | 'In Progress';  
  createdOn: Date;  
  updatedOn: Date;  
}

// Other Healthcare Domain Entities
interface HealthcareEntity {  
  id: string;  
  name: string;  
  type: 'Facility' | 'Organization' | 'Individual';  
  address: {  
    street: string;  
    city: string;  
    state: string;  
    zip: string;  
  };  
}

// Exporting Types and Interfaces
export type { ClaimType, PatientType, ProviderType, AuditType, HealthcareEntity };