'use server';
/**
 * @fileOverview An AI agent to automatically fill in patient data using OCR and EHR autofetch.
 *
 * - autoFillPatientData - A function that handles the patient data auto-fill process.
 * - AutoFillPatientDataInput - The input type for the autoFillPatientData function.
 * - AutoFillPatientDataOutput - The return type for the autoFillPatientData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoFillPatientDataInputSchema = z.object({
  insuranceCardDataUri: z
    .string()
    .describe(
      "A photo of the patient's insurance card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  idCardDataUri: z
    .string()
    .describe(
      "A photo of the patient's ID card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  ehrData: z.string().describe('Patient data fetched from EHR.').optional(),
});
export type AutoFillPatientDataInput = z.infer<typeof AutoFillPatientDataInputSchema>;

const AutoFillPatientDataOutputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  dateOfBirth: z.string().describe('The date of birth of the patient.'),
  address: z.string().describe('The address of the patient.'),
  insuranceProvider: z.string().describe('The insurance provider of the patient.'),
  policyNumber: z.string().describe('The policy number of the patient.'),
});
export type AutoFillPatientDataOutput = z.infer<typeof AutoFillPatientDataOutputSchema>;

export async function autoFillPatientData(input: AutoFillPatientDataInput): Promise<AutoFillPatientDataOutput> {
  return autoFillPatientDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoFillPatientDataPrompt',
  input: {schema: AutoFillPatientDataInputSchema},
  output: {schema: AutoFillPatientDataOutputSchema},
  prompt: `You are an AI assistant designed to extract patient data from various sources such as insurance cards, ID cards, and EHR systems to automatically fill in patient registration forms.

  Please extract the following information:
  - Patient Name
  - Date of Birth
  - Address
  - Insurance Provider
  - Policy Number

  Consider the following data sources:
  {% if insuranceCardDataUri %}Insurance Card: {{media url=insuranceCardDataUri}}{% endif %}
  {% if idCardDataUri %}ID Card: {{media url=idCardDataUri}}{% endif %}
  {% if ehrData %}EHR Data: {{{ehrData}}}{% endif %}

  Ensure that the output is accurate and complete.
  Output in JSON format.
  `,
});

const autoFillPatientDataFlow = ai.defineFlow(
  {
    name: 'autoFillPatientDataFlow',
    inputSchema: AutoFillPatientDataInputSchema,
    outputSchema: AutoFillPatientDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
