export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete';
    requestResourceData?: any;
  };
  
  export class FirestorePermissionError extends Error {
    constructor(public context: SecurityRuleContext) {
      const { path, operation } = context;
      super(`Firestore - Insufficient permissions.
  
  The following request was denied by Firestore Security Rules:
  
  Operation: ${operation}
  Path: ${path}
  
  Please check your security rules to ensure the user has the correct permissions.
      `);
      this.name = 'FirestorePermissionError';
    }
  }
