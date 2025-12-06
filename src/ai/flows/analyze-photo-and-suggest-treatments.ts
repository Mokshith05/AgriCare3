'use server';

/**
 * @fileOverview Analyzes a photo of a crop and suggests treatment options.
 *
 * - analyzePhotoAndSuggestTreatments - A function that handles the image analysis and treatment suggestion process.
 * - AnalyzePhotoAndSuggestTreatmentsInput - The input type for the analyzePhotoAndSuggestTreatments function.
 * - AnalyzePhotoAndSuggestTreatmentsOutput - The return type for the analyzePhotoAndSuggestTreatments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePhotoAndSuggestTreatmentsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the affected crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language for the analysis report (e.g., "en", "hi").'),
  description: z.string().optional().describe("A farmer's description of the issue, if any."),
});
export type AnalyzePhotoAndSuggestTreatmentsInput = z.infer<typeof AnalyzePhotoAndSuggestTreatmentsInputSchema>;

const DiagnosisSchema = z.object({
  name: z.string().describe('The identified disease, pest, or nutrient deficiency.'),
  reasoning: z.string().describe('A brief, 1-2 line explanation for the diagnosis.'),
  severity: z.enum(['low', 'medium', 'high']).describe('The estimated severity of the issue.'),
  confidence: z.number().min(0).max(1).describe('The confidence level of the diagnosis (0.0 to 1.0).'),
});

const ControlSuggestionSchema = z.object({
  name: z.string().describe('The common name of the suggested pesticide, biocontrol, or fertilizer.'),
  dose_or_usage: z.string().describe("Example usage, such as '2 g/L' or 'apply as foliar spray every 7 days'."),
  notes: z.string().describe('Important safety notes, precautions, or application tips.'),
});

const MetadataSchema = z.object({
  crop: z.string().describe("The type of crop, if identifiable (e.g., 'Tomato'). 'Unknown' if not."),
  approx_affected_area_pct: z.string().describe("An estimated percentage of the affected area, or 'unknown'."),
  timestamp_utc: z.string().describe('The ISO 8601 timestamp of when the analysis was performed.'),
  model: z.string().describe('The name of the AI model used for the analysis.'),
});


const AnalyzePhotoAndSuggestTreatmentsOutputSchema = z.object({
  diagnoses: z.array(DiagnosisSchema).describe('A list of diagnosed issues.'),
  immediate_actions: z.array(z.string()).describe('A list of 2-4 practical steps the farmer should perform today.'),
  medium_term_actions: z.array(z.string()).describe('A list of medium-term treatments, fertilizing schedules, or monitoring actions.'),
  preventive_measures: z.array(z.string()).describe('A list of preventive measures, including notes on humidity, irrigation, or spacing.'),
  suggested_controls: z.array(ControlSuggestionSchema).describe('A list of suggested chemical or biological controls (not prescriptions).'),
  additional_recommendations: z.array(z.string()).describe('A list of recommended additional images or tests if the diagnosis is uncertain.'),
  metadata: MetadataSchema.describe('Metadata about the analysis.'),
  summary: z.string().describe('A 2-3 sentence human-readable summary of the entire analysis.'),
});

export type AnalyzePhotoAndSuggestTreatmentsOutput = z.infer<typeof AnalyzePhotoAndSuggestTreatmentsOutputSchema>;

export async function analyzePhotoAndSuggestTreatments(
  input: AnalyzePhotoAndSuggestTreatmentsInput
): Promise<AnalyzePhotoAndSuggestTreatmentsOutput> {
  return analyzePhotoAndSuggestTreatmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePhotoAndSuggestTreatmentsPrompt',
  input: {schema: AnalyzePhotoAndSuggestTreatmentsInputSchema},
  output: {schema: AnalyzePhotoAndSuggestTreatmentsOutputSchema},
  prompt: `SYSTEM: You are AgriAssist, an expert agronomist AI specializing in plant health.
Analyze the provided crop image and/or description to identify issues and provide a comprehensive action plan.

Analyze this crop image and return:
1) Diagnosed issue(s) (disease/pest/nutrient deficiency) with short reasoning.
2) Severity (low/medium/high) and confidence (0.0–1.0).
3) Immediate actions (2–4 practical steps) the farmer should perform today.
4) Medium-term actions (treatments, fertilizers, monitoring) and estimated timeline.
5) Preventive measures and environmental notes (humidity, irrigation, spacing).
6) Suggested chemical or biological controls (common names + typical concentrations/usage notes) — label them as "suggested" not prescriptions.
7) If diagnosis is uncertain, list up to 3 recommended additional images or tests.

IMPORTANT: Generate the entire JSON output and the summary translated into the following language: {{{language}}}

Return results in the EXACT JSON schema specified.

{{#if photoDataUri}}
USER: Analyze the attached image.
Photo: {{media url=photoDataUri}}
{{/if}}
{{#if description}}
USER: A farmer has provided the following description: {{{description}}}
{{else}}
Image not provided. Diagnose based on the farmer's description.
{{/if}}
`,
});

const analyzePhotoAndSuggestTreatmentsFlow = ai.defineFlow(
  {
    name: 'analyzePhotoAndSuggestTreatmentsFlow',
    inputSchema: AnalyzePhotoAndSuggestTreatmentsInputSchema,
    outputSchema: AnalyzePhotoAndSuggestTreatmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
