'use server';

/**
 * @fileOverview Recommends crops based on farm data.
 *
 * - recommendCrops - A function that handles the crop recommendation process.
 * - RecommendCropsInput - The input type for the recommendCrops function.
 * - RecommendCropsOutput - The return type for the recommendCrops function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendCropsInputSchema = z.object({
  location: z.string().describe('The geographical location of the farm (e.g., City, State, Region).'),
  soil_type: z.string().describe('The predominant soil type in the field (e.g., Loamy, Sandy, Clay).'),
  past_crop_rotation: z.string().optional().describe('A list of crops grown in the last 1-3 seasons.'),
  additional_information: z.string().optional().describe('Any other details like climate, water access, irrigation, market demands, etc.'),
  language_preference: z.string().describe('The language for the recommendation report (e.g., "en", "hi").'),
});
export type RecommendCropsInput = z.infer<typeof RecommendCropsInputSchema>;

const RecommendedCropSchema = z.object({
    crop: z.string().describe("The name of the recommended crop."),
    why_suitable: z.string().describe("A detailed explanation of why this crop is suitable for the given conditions, referencing soil, climate, and crop rotation."),
    organic_fertilizers: z.array(z.string()).describe("A list of 2-3 recommended organic fertilizers for this crop."),
    planting_season: z.string().describe("The optimal planting season for the crop in the specified location (e.g., 'Early Spring (March-April)')."),
    expected_yield_note: z.string().describe("A note on the expected yield under good conditions, including any factors that might influence it.")
});

const RecommendCropsOutputSchema = z.object({
  recommended_crops: z.array(RecommendedCropSchema).describe('A list of 2-3 data-driven crop recommendations.'),
  summary: z.string().describe('A 2-3 sentence, human-readable summary of the key recommendations and rationale.'),
});
export type RecommendCropsOutput = z.infer<typeof RecommendCropsOutputSchema>;


export async function recommendCrops(
  input: RecommendCropsInput
): Promise<RecommendCropsOutput> {
  return recommendCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCropsPrompt',
  input: { schema: RecommendCropsInputSchema },
  output: { schema: RecommendCropsOutputSchema },
  prompt: `SYSTEM: You are an expert agronomist AI. Your task is to provide accurate, data-driven crop recommendations based on the provided farm details.
Analyze the soil type, local climate (inferred from location), past crop rotation, and any additional information.
Do not provide mock or random data. Base your recommendations on real agricultural science.

Location: {{{location}}}
Soil Type: {{{soil_type}}}
Past Crop Rotation: {{{past_crop_rotation}}}
Additional Information: {{{additional_information}}}

Based on this data, provide 2-3 crop recommendations. For each crop, explain why it's suitable, suggest organic fertilizers, specify the best planting season, and add a note about expected yield.

IMPORTANT: Generate the entire JSON output, including the summary, translated into the following language: {{{language_preference}}}

Return results in the EXACT JSON schema specified.`,
});

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: RecommendCropsInputSchema,
    outputSchema: RecommendCropsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
