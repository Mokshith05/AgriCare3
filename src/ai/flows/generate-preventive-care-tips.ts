'use server';

/**
 * @fileOverview Generates preventive care tips for a given crop.
 *
 * - generatePreventiveCareTips - A function that handles the generation of care tips.
 * - GeneratePreventiveCareTipsInput - The input type for the function.
 * - GeneratePreventiveCareTipsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePreventiveCareTipsInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to get care tips for.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi").'),
});
export type GeneratePreventiveCareTipsInput = z.infer<typeof GeneratePreventiveCareTipsInputSchema>;

const CareTipSchema = z.object({
  category: z.string().describe('The category of the care tip (e.g., "Soil Preparation", "Watering", "Pest Control").'),
  tips: z.array(z.string()).describe('A list of detailed tips for this category.'),
});

const GeneratePreventiveCareTipsOutputSchema = z.object({
  cropName: z.string().describe('The name of the crop the tips are for.'),
  tips: z.array(CareTipSchema).describe('A list of preventive care tips categorized for the crop.'),
  summary: z.string().describe('A brief, 2-3 sentence summary of the key care points.'),
});
export type GeneratePreventiveCareTipsOutput = z.infer<typeof GeneratePreventiveCareTipsOutputSchema>;

export async function generatePreventiveCareTips(
  input: GeneratePreventiveCareTipsInput
): Promise<GeneratePreventiveCareTipsOutput> {
  return generatePreventiveCareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePreventiveCareTipsPrompt',
  input: { schema: GeneratePreventiveCareTipsInputSchema },
  output: { schema: GeneratePreventiveCareTipsOutputSchema },
  prompt: `SYSTEM: You are an expert agronomist providing preventive care advice for crops.
Generate a concise, actionable list of preventive care tips for the specified crop.
Organize the tips into logical categories such as "Soil Preparation", "Watering Schedule", "Pest Prevention", "Fertilization", and "Harvesting".
For each category, provide 2-4 bullet-point style tips.

IMPORTANT: Generate the entire JSON output, including the summary, translated into the following language: {{{language}}}

Return results in the EXACT JSON schema specified.

USER:
Crop: {{{cropName}}}
`,
});


const generatePreventiveCareTipsFlow = ai.defineFlow(
  {
    name: 'generatePreventiveCareTipsFlow',
    inputSchema: GeneratePreventiveCareTipsInputSchema,
    outputSchema: GeneratePreventiveCareTipsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
