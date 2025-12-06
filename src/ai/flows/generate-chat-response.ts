'use server';
/**
 * @fileOverview Generates a conversational response using Gemini.
 *
 * - generateChatResponse - A function that generates a chat response.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const GenerateChatResponseInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  prompt: z.string().describe('The latest user prompt.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi").'),
});
export type GenerateChatResponseInput = z.infer<
  typeof GenerateChatResponseInputSchema
>;

const GenerateChatResponseOutputSchema = z.string();
export type GenerateChatResponseOutput = z.infer<
  typeof GenerateChatResponseOutputSchema
>;

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async ({ history, prompt, language }) => {
    const llmHistory = history.map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    const response = await ai.generate({
      model: 'gemini-pro',
      history: llmHistory,
      prompt: `SYSTEM: You are AgriBot, a friendly and helpful agricultural assistant. Always respond in the user's specified language: ${language}. Keep your answers concise and helpful for a farmer.

USER: ${prompt}`,
    });

    return response.text;
  }
);
