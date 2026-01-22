'use server';

/**
 * @fileOverview Summarizes a patient's insurance benefits in real-time.
 *
 * - summarizeInsuranceBenefits - A function that handles the summarization process.
 * - SummarizeInsuranceBenefitsInput - The input type for the summarizeInsuranceBenefits function.
 * - SummarizeInsuranceBenefitsOutput - The return type for the summarizeInsuranceBenefits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInsuranceBenefitsInputSchema = z.object({
  insuranceCardPhotoDataUri: z
    .string()
    .describe(
      "A photo of the patient's insurance card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  ehrData: z.string().describe('Relevant patient data from the EHR.'),
});
export type SummarizeInsuranceBenefitsInput = z.infer<
  typeof SummarizeInsuranceBenefitsInputSchema
>;

const SummarizeInsuranceBenefitsOutputSchema = z.object({
  deductibleRemaining: z.string().describe('The patient\'s remaining deductible.'),
  copay: z.string().describe('The patient\'s copay amount.'),
  coveredServices: z
    .string()
    .describe('A summary of the services covered by the insurance plan.'),
});
export type SummarizeInsuranceBenefitsOutput = z.infer<
  typeof SummarizeInsuranceBenefitsOutputSchema
>;

export async function summarizeInsuranceBenefits(
  input: SummarizeInsuranceBenefitsInput
): Promise<SummarizeInsuranceBenefitsOutput> {
  return summarizeInsuranceBenefitsFlow(input);
}

const summarizeInsuranceBenefitsPrompt = ai.definePrompt({
  name: 'summarizeInsuranceBenefitsPrompt',
  input: {schema: SummarizeInsuranceBenefitsInputSchema},
  output: {schema: SummarizeInsuranceBenefitsOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing patient insurance benefits.

  Given the following information, provide a concise summary of the patient's insurance benefits, including deductible remaining, copay, and covered services.

  Insurance Card Photo: {{media url=insuranceCardPhotoDataUri}}
  EHR Data: {{{ehrData}}}

  Please provide the summary in the following format:

  Deductible Remaining: <amount>
  Copay: <amount>
  Covered Services: <summary>
  `,
});

const summarizeInsuranceBenefitsFlow = ai.defineFlow(
  {
    name: 'summarizeInsuranceBenefitsFlow',
    inputSchema: SummarizeInsuranceBenefitsInputSchema,
    outputSchema: SummarizeInsuranceBenefitsOutputSchema,
  },
  async input => {
    const {output} = await summarizeInsuranceBenefitsPrompt(input);
    return output!;
  }
);
