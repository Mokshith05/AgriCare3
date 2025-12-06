'use server';

import {
  analyzePhotoAndSuggestTreatments,
  type AnalyzePhotoAndSuggestTreatmentsOutput,
} from '@/ai/flows/analyze-photo-and-suggest-treatments';
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

export async function getChatbotResponse(input: GenerateChatResponseInput): Promise<{
  success: boolean;
  message?: string;
  audioDataUri?: string;
  error?: string;
}> {
  try {
    const message = await generateChatResponse(input);
    const { audioDataUri } = await generateAudioFromText(message);
    
    return {
      success: true,
      message,
      audioDataUri,
    };
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    return {
      success: false,
      error:
        'An unexpected error occurred while getting a response. Please try again.',
    };
  }
}
