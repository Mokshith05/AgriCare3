import { config } from 'dotenv';
config();

import '@/ai/flows/determine-infestation-severity.ts';
import '@/ai/flows/generate-treatment-recommendations.ts';
import '@/ai/flows/analyze-photo-and-suggest-treatments.ts';
import '@/ai/flows/recommend-crops.ts';
import '@/ai/flows/calculate-profit.ts';
import '@/ai/flows/generate-chat-response';
import '@/ai/flows/generate-audio-from-text';
import '@/ai/flows/generate-preventive-care-tips';
