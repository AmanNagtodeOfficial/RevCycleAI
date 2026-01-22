'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting medical codes based on clinical documentation.
 *
 * - suggestMedicalCodes - A function that suggests relevant ICD-10, CPT, and HCPCS codes.
 * - SuggestMedicalCodesInput - The input type for the suggestMedicalCodes function.
 * - SuggestMedicalCodesOutput - The return type for the suggestMedicalCodes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMedicalCodesInputSchema = z.object({
  clinicalNotes: z
    .string()
    .describe('Clinical notes, operative reports, or discharge summaries.'),
});
export type SuggestMedicalCodesInput = z.infer<typeof SuggestMedicalCodesInputSchema>;

const SuggestMedicalCodesOutputSchema = z.object({
  suggestedCodes: z.array(
    z.object({
      code: z.string().describe('The suggested medical code (ICD-10, CPT, or HCPCS).'),
      type: z.string().describe('The type of the code, e.g., "ICD-10", "CPT", "HCPCS".'),
      explanation: z.string().describe('Explanation of why the code was suggested.'),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe('Confidence score for the suggested code (0-1).'),
    })
  ).describe('An array of suggested medical codes with confidence scores and explanations.'),
});
export type SuggestMedicalCodesOutput = z.infer<typeof SuggestMedicalCodesOutputSchema>;

export async function suggestMedicalCodes(input: SuggestMedicalCodesInput): Promise<SuggestMedicalCodesOutput> {
  return suggestMedicalCodesFlow(input);
}

const suggestMedicalCodesPrompt = ai.definePrompt({
  name: 'suggestMedicalCodesPrompt',
  input: {schema: SuggestMedicalCodesInputSchema},
  output: {schema: SuggestMedicalCodesOutputSchema},
  prompt: `You are an AI medical coding assistant.  Given the clinical notes, provide a list of suggested medical codes (ICD-10, CPT, and HCPCS) with confidence scores and explanations.

Clinical Notes: {{{clinicalNotes}}}

Format your response as a JSON array of objects, where each object has 'code', 'type', 'confidence', and 'explanation' keys. The confidence score should be a number between 0 and 1. The type should identify the code system (e.g. "ICD-10", "CPT").

Example:
[
  {
    "code": "I25.10",
    "type": "ICD-10",
    "confidence": 0.95,
    "explanation": "Based on the clinical notes, the patient likely has Atherosclerotic heart disease."
  },
  {
    "code": "99213",
    "type": "CPT",
    "confidence": 0.80,
    "explanation": "Office or other outpatient visit for the evaluation and management of an established patient."
  }
]
`,
});

const suggestMedicalCodesFlow = ai.defineFlow(
  {
    name: 'suggestMedicalCodesFlow',
    inputSchema: SuggestMedicalCodesInputSchema,
    outputSchema: SuggestMedicalCodesOutputSchema,
  },
  async input => {
    const {output} = await suggestMedicalCodesPrompt(input);
    return output!;
  }
);
