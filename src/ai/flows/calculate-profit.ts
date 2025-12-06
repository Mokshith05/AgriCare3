'use server';

/**
 * @fileOverview Calculates potential crop profit and generates a summary.
 *
 * - calculateProfit - A function that handles the profit calculation.
 * - CalculateProfitInput - The input type for the calculateProfit function.
 * - CalculateProfitOutput - The return type for the calculateProfit function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateProfitInputSchema = z.object({
  crop_name: z.string().describe('The name of the crop.'),
  acreage: z.number().describe('The total acreage of the farm.'),
  yield_per_acre: z.number().describe('The expected yield in kilograms per acre.'),
  market_price: z.number().describe('The market price per kilogram.'),
  total_costs: z.number().describe('The total costs for cultivation.'),
  language_preference: z.string().describe('The language for the summary (e.g., "en", "hi").'),
});
export type CalculateProfitInput = z.infer<typeof CalculateProfitInputSchema>;

const CalculateProfitOutputSchema = z.object({
  total_yield: z.string().describe('The calculated total yield in kg.'),
  total_revenue: z.string().describe('The calculated total revenue in the local currency format.'),
  profit: z.string().describe('The calculated profit in the local currency format.'),
  profit_margin_percent: z.string().describe('The calculated profit margin as a percentage string (e.g., "25.5%").'),
  summary: z.string().describe('A human-readable summary of the financial projection.'),
});
export type CalculateProfitOutput = z.infer<typeof CalculateProfitOutputSchema>;

export async function calculateProfit(
  input: CalculateProfitInput
): Promise<CalculateProfitOutput> {
  return calculateProfitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateProfitPrompt',
  input: { schema: z.object({
      total_yield: z.number(),
      total_revenue: z.number(),
      profit: z.number(),
      profit_margin_percent: z.number(),
      crop_name: z.string(),
      language_preference: z.string(),
      market_price: z.number(),
      total_costs: z.number(),
  }) },
  output: { schema: z.object({ summary: z.string() }) },
  prompt: `SYSTEM: You are a helpful agricultural financial advisor.
Based on the provided calculations, generate a brief, encouraging, and insightful summary (2-3 sentences) for the farmer.
Mention the crop name and key financial metrics like profit and profit margin.
The market price is in Philippine Pesos (₱).

IMPORTANT: Generate the summary in the following language: {{{language_preference}}}

DATA:
Crop: {{{crop_name}}}
Total Yield: {{{total_yield}}} kg
Total Revenue: ₱{{{total_revenue}}}
Profit: ₱{{{profit}}}
Profit Margin: {{{profit_margin_percent}}}%
Market Price: ₱{{{market_price}}}/kg
Total Costs: ₱{{{total_costs}}}
`,
});

const calculateProfitFlow = ai.defineFlow(
  {
    name: 'calculateProfitFlow',
    inputSchema: CalculateProfitInputSchema,
    outputSchema: CalculateProfitOutputSchema,
  },
  async (input) => {
    const total_yield = input.acreage * input.yield_per_acre;
    const total_revenue = total_yield * input.market_price;
    const profit = total_revenue - input.total_costs;
    const profit_margin_percent = total_revenue > 0 ? (profit / total_revenue) * 100 : 0;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    });
    
    const { output } = await prompt({
        ...input,
        total_yield,
        total_revenue,
        profit,
        profit_margin_percent,
    });

    if (!output) {
        throw new Error("Failed to generate summary from AI.");
    }
    
    return {
      total_yield: `${total_yield.toLocaleString()} kg`,
      total_revenue: formatter.format(total_revenue),
      profit: formatter.format(profit),
      profit_margin_percent: `${profit_margin_percent.toFixed(1)}%`,
      summary: output.summary,
    };
  }
);
