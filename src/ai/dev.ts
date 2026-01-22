import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-insurance-benefits.ts';
import '@/ai/flows/suggest-medical-codes.ts';
import '@/ai/flows/generate-fix-suggestions.ts';
import '@/ai/flows/auto-fill-patient-data.ts';
import '@/ai/flows/predict-payment-date.ts';