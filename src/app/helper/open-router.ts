import OpenAI from 'openai';
import { envVars } from '../config';

export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: envVars.openRouterApiKey, 
});

