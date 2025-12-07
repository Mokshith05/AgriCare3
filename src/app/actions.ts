'use server';

import {
  analyzePhotoAndSuggestTreatments,
  type AnalyzePhotoAndSuggestTreatmentsOutput,
} from '@/ai/flows/analyze-photo-and-suggest-treatments';
import {
  recommendCrops,
  type RecommendCropsInput,
  type RecommendCropsOutput,
} from '@/ai/flows/recommend-crops';
import {
  calculateProfit,
  type CalculateProfitInput,
  type CalculateProfitOutput,
} from '@/ai/flows/calculate-profit';
import {
  generateChatResponse,
  type GenerateChatResponseInput,
} from '@/ai/flows/generate-chat-response';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';

export async function analyzeCropImage(
  photoDataUri: string,
  language: string
): Promise<{
  success: boolean;
  data?: AnalyzePhotoAndSuggestTreatmentsOutput;
  error?: string;
}> {
  try {
    if (!photoDataUri) {
      throw new Error('No image data provided.');
    }
    const analysisResult = await analyzePhotoAndSuggestTreatments({
      photoDataUri,
      language,
    });
    return {
      success: true,
      data: analysisResult,
    };
  } catch (error) {
    console.error('Error analyzing crop image:', error);
    return {
      success: false,
      error:
        'An unexpected error occurred while analyzing the image. Please try again.',
    };
  }
}

export async function getCropRecommendations(
  input: RecommendCropsInput
): Promise<{
  success: boolean;
  data?: RecommendCropsOutput;
  error?: string;
}> {
  try {
    const result = await recommendCrops(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting crop recommendations:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while generating recommendations.',
    };
  }
}

export async function calculateCropProfit(
  input: CalculateProfitInput
): Promise<{
  success: boolean;
  data?: CalculateProfitOutput;
  error?: string;
}> {
  try {
    const result = await calculateProfit(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error calculating crop profit:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while calculating the profit.',
    };
  }
}

export async function getChatbotResponse(
  input: GenerateChatResponseInput
): Promise<{ success: boolean; message?: string; audioDataUri?: string; error?: string }> {
  try {
    const message = await generateChatResponse(input);
    
    // Generate audio in parallel, but don't block the response for it
    const audioPromise = generateAudioFromText(message)
      .then(result => result.audioDataUri)
      .catch(err => {
        console.error("Audio generation failed:", err);
        return undefined;
      });

    const audioDataUri = await audioPromise;

    return { success: true, message, audioDataUri };
  } catch (error) {
    console.error('Error in getChatbotResponse:', error);
    return {
      success: false,
      error: 'Sorry, I encountered an error. Please try again.',
    };
  }
}
