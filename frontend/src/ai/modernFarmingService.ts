import axios from 'axios';
import { generateModernFarmingPrompt } from './modernFarmingPrompt';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = import.meta.env.VITE_GEMINI_API_URL;

export interface ModernFarmingRequest {
  technique: string;
  farmSize: string;
  budget: 'low' | 'medium' | 'high';
}

export interface ModernFarmingResponse {
  techniqueAnalysis: {
    overview: {
      name: string;
      estimatedCost: number;
      roi: number;
    };
  };
  implementation: {
    phases: Array<{
      name: string;
      duration: string;
    }>;
  };
  metrics: {
    resourceEfficiency: {
      water: number;
      labor: number;
      energy: number;
    };
  };
}

export const getModernFarmingAnalysis = async (
  request: ModernFarmingRequest
): Promise<ModernFarmingResponse> => {
  if (!API_KEY || !API_URL) {
    throw new Error("Missing required environment variables");
  }

  try {
    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      prompt: generateModernFarmingPrompt(request),
      temperature: 0.7,
      maxTokens: 1000,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data
      });
    }
    throw error;
  }
}; 