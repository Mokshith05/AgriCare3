'use server';

/**
 * @fileOverview Searches for and retrieves information about a crop disease or pest.
 *
 * - searchEncyclopedia - A function that handles the encyclopedia search process.
 * - SearchEncyclopediaInput - The input type for the searchEncyclopedia function.
 * - SearchEncyclopediaOutput - The return type for the searchEncyclopedia function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SearchEncyclopediaInputSchema = z.object({
  query: z.string().describe('The name of the disease, pest, or crop issue to search for.'),
  language: z.string().describe('The language for the search results (e.g., "en", "hi").'),
});
export type SearchEncyclopediaInput = z.infer<typeof SearchEncyclopediaInputSchema>;

const SearchEncyclopediaOutputSchema = z.object({
  title: z.string().describe('The common name of the disease or pest.'),
  category: z.enum(['Disease', 'Pest', 'Nutrient Deficiency', 'Other']).describe('The category of the issue.'),
  description: z.string().describe('A detailed, paragraph-long description of the issue.'),
  symptoms: z.array(z.string()).describe('A list of 3-5 common symptoms.'),
  prevention: z.array(z.string()).describe('A list of 3-5 key preventive measures.'),
  treatment: z.array(z.string()).describe('A list of 3-5 common organic treatment methods.'),
});
export type SearchEncyclopediaOutput = z.infer<typeof SearchEncyclopediaOutputSchema>;

export async function searchEncyclopedia(
  input: SearchEncyclopediaInput
): Promise<SearchEncyclopediaOutput> {
  return searchEncyclopediaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchEncyclopediaPrompt',
  input: { schema: SearchEncyclopediaInputSchema },
  output: { schema: SearchEncyclopediaOutputSchema },
  prompt: `SYSTEM: You are an expert agricultural encyclopedia.
A user wants to learn about a specific crop issue. Provide a detailed, accurate, and easy-to-understand entry for them.
Do not provide mock or random data. Base your answer on real agricultural science.
Generate the entire JSON output in the following language: {{{language}}}

USER QUERY: "{{{query}}}"

Based on the user's query, provide a detailed encyclopedia entry.
Return results in the EXACT JSON schema specified.
`,
});

const searchEncyclopediaFlow = ai.defineFlow(
  {
    name: 'searchEncyclopediaFlow',
    inputSchema: SearchEncyclopediaInputSchema,
    outputSchema: SearchEncyclopediaOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
