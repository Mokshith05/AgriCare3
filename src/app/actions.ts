'use server';

import {
  analyzePhotoAndSuggestTreatments,
  type AnalyzePhotoAndSuggestTreatmentsOutput,
} from '@/ai/flows/analyze-photo-and-suggest-treatments';

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
