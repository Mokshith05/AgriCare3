import { config } from 'dotenv';
config();

import '@/ai/flows/determine-infestation-severity.ts';
import '@/ai/flows/generate-treatment-recommendations.ts';
import '@/ai/flows/analyze-photo-and-suggest-treatments.ts';
import '@/ai/flows/generate-chat-response.ts';
import '@/ai/flows/generate-audio-from-text.ts';
