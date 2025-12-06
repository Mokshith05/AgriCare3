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
  searchEncyclopedia,
  type SearchEncyclopediaOutput,
} from '@/ai/flows/search-encyclopedia';

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

export async function getEncyclopediaArticle(
  query: string,
  language: string
): Promise<{
  success: boolean;
  data?: SearchEncyclopediaOutput;
  error?: string;
}> {
  try {
    const result = await searchEncyclopedia({ query, language });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error searching encyclopedia:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while searching the encyclopedia.',
    };
  }
}
