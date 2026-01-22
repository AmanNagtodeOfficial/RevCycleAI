'use server';

/**
 * @fileOverview Predicts the expected payment date for a claim using AI.
 *
 * - predictPaymentDate - A function that predicts the payment date.
 * - PredictPaymentDateInput - The input type for the predictPaymentDate function.
 * - PredictPaymentDateOutput - The return type for the predictPaymentDate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictPaymentDateInputSchema = z.object({
  claimDetails: z
    .string()
    .describe('Detailed information about the claim, including the submission date, claim amount, payer, and patient demographics.'),
  historicalPaymentData: z
    .string()
    .describe('Historical payment data for similar claims, including payment dates and amounts.'),
});

export type PredictPaymentDateInput = z.infer<typeof PredictPaymentDateInputSchema>;

const PredictPaymentDateOutputSchema = z.object({
  predictedPaymentDate: z
    .string()
    .describe('The predicted payment date for the claim, in ISO 8601 format (YYYY-MM-DD).'),
  confidenceScore: z
    .number()
    .describe('A confidence score between 0 and 1 indicating the certainty of the prediction.'),
  rationale: z
    .string()
    .describe('A brief explanation of why the AI predicted this payment date, including key factors considered.'),
});

export type PredictPaymentDateOutput = z.infer<typeof PredictPaymentDateOutputSchema>;

export async function predictPaymentDate(input: PredictPaymentDateInput): Promise<PredictPaymentDateOutput> {
  return predictPaymentDateFlow(input);
}

const predictPaymentDatePrompt = ai.definePrompt({
  name: 'predictPaymentDatePrompt',
  input: {schema: PredictPaymentDateInputSchema},
  output: {schema: PredictPaymentDateOutputSchema},
  prompt: `You are an AI Revenue Cycle Management expert specializing in predicting claim payment dates. Given the following information, predict the payment date for the claim.

Claim Details: {{{claimDetails}}}
Historical Payment Data: {{{historicalPaymentData}}}

Respond with the predicted payment date, a confidence score (0-1), and a brief rationale for the prediction. The predicted payment date should be formatted in ISO 8601 format (YYYY-MM-DD).

Ensure the response includes the predicted payment date, confidence score, and rationale, following the output schema.`,
});

const predictPaymentDateFlow = ai.defineFlow(
  {
    name: 'predictPaymentDateFlow',
    inputSchema: PredictPaymentDateInputSchema,
    outputSchema: PredictPaymentDateOutputSchema,
  },
  async input => {
    const {output} = await predictPaymentDatePrompt(input);
    return output!;
  }
);
