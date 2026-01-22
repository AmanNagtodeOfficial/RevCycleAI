'use server';

/**
 * @fileOverview AI-powered claim fix suggestion generator.
 *
 * - generateFixSuggestions - A function that generates fix suggestions for claims.
 * - GenerateFixSuggestionsInput - The input type for the generateFixSuggestions function.
 * - GenerateFixSuggestionsOutput - The return type for the generateFixSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFixSuggestionsInputSchema = z.object({
  claimData: z.string().describe('The claim data in JSON format.'),
  payerRules: z.string().describe('The payer-specific rules in JSON format.'),
  historicalDenialPatterns: z
    .string()
    .describe('The historical denial patterns in JSON format.'),
});
export type GenerateFixSuggestionsInput = z.infer<
  typeof GenerateFixSuggestionsInputSchema
>;

const GenerateFixSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('The AI-generated fix suggestions.'),
  riskScore: z
    .number()
    .describe('A risk score (0-100) indicating the likelihood of denial.'),
  explanation: z
    .string()
    .describe('An explanation of why the suggestions are being made.'),
});
export type GenerateFixSuggestionsOutput = z.infer<
  typeof GenerateFixSuggestionsOutputSchema
>;

export async function generateFixSuggestions(
  input: GenerateFixSuggestionsInput
): Promise<GenerateFixSuggestionsOutput> {
  return generateFixSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFixSuggestionsPrompt',
  input: {schema: GenerateFixSuggestionsInputSchema},
  output: {schema: GenerateFixSuggestionsOutputSchema},
  prompt: `You are an AI-powered claim scrubber that identifies potential issues in medical claims and provides fix suggestions to billing specialists. Your goal is to help submit clean claims on the first submission and reduce denials.

  Analyze the claim data, payer-specific rules, and historical denial patterns to identify potential issues.

  Claim Data:
  {{claimData}}

  Payer-Specific Rules:
  {{payerRules}}

  Historical Denial Patterns:
  {{historicalDenialPatterns}}

  Based on your analysis, provide the following:

  1.  A list of AI-generated fix suggestions.
  2.  A risk score (0-100) indicating the likelihood of denial.
  3.  An explanation of why the suggestions are being made.

  Ensure that the suggestions are clear, concise, and actionable. The risk score should be based on the severity of the potential issues and the likelihood of denial. The explanation should provide context and justification for the suggestions and risk score.

  Output MUST be a JSON object conforming to the following schema:
  {
    "suggestions": ["suggestion 1", "suggestion 2", ...],
    "riskScore": 50,
    "explanation": "Explanation of the suggestions and risk score."
  }`,
});

const generateFixSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateFixSuggestionsFlow',
    inputSchema: GenerateFixSuggestionsInputSchema,
    outputSchema: GenerateFixSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
