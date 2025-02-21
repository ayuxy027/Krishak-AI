import axios from 'axios';
import { generateDiseasePrompt } from './diseasePrompt';
import { getFallbackResponse } from '../utils/diseaseFallbacks';
import { z } from 'zod'; // For runtime type validation
import retry from 'async-retry'; // For API retry logic
import compress  from 'browser-image-compression'; // For image optimization

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = import.meta.env.VITE_GEMINI_API_URL;

export interface DiseaseDetectionResult {
  confidence: number;
  disease: string;
  severity: 'low' | 'medium' | 'high';
  treatment: string;
  preventiveMeasures: string[];
  detectedAt: string;
}

// Schema for validating API response
const DiseaseResultSchema = z.object({
  confidence: z.number().min(0).max(100),
  disease: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high']),
  treatment: z.string().min(1),
  preventiveMeasures: z.array(z.string()).default([]),
});

const makeApiRequest = async (base64Image: string) => {
  if (!API_KEY || !API_URL) {
    throw new Error("Missing required Gemini API configuration");
  }

  const requestData = {
    contents: [{
      parts: [
        { text: generateDiseasePrompt({ imageBase64: base64Image }) },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  return axios.post(`${API_URL}?key=${API_KEY}`, requestData, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
  });
};

const validateAndProcessResponse = (response: any): DiseaseDetectionResult => {
  if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Invalid API response structure");
  }

  let responseText = response.data.candidates[0].content.parts[0].text.trim();

  // Handle potential JSON wrapped in markdown code blocks
  if (responseText.includes('```')) {
    responseText = responseText
      .replace(/```json\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
  }

  try {
    const parsedData = JSON.parse(responseText);
    const validatedData = DiseaseResultSchema.parse(parsedData);

    return {
      ...validatedData,
      detectedAt: new Date().toISOString()
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      throw new Error('Invalid response format from API');
    }
    if (error instanceof SyntaxError) {
      console.error('JSON parse error:', error);
      throw new Error('Failed to parse API response');
    }
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      try {
        const base64String = reader.result as string;
        const base64 = base64String.split(',')[1];
        resolve(base64);
      } catch (error) {
        console.error('Base64 extraction failed:', error);
        reject(new Error('Failed to process image file'));
      }
    };
    reader.onerror = error => {
      console.error('File to Base64 conversion failed:', error);
      reject(error);
    };
  });
};

const analyzeImageBasics = async (_file: File): Promise<{ 
  isLeafSpot?: boolean;
  isWilting?: boolean;
  isDiscolored?: boolean;
}> => {
  // Basic image analysis could be implemented here
  // For now, return default values
  return {
    isLeafSpot: true,
    isWilting: false,
    isDiscolored: true
  };
};

export const detectDisease = async (imageFile: File): Promise<DiseaseDetectionResult> => {
  console.log('Starting disease detection process', { 
    fileName: imageFile.name, 
    fileSize: imageFile.size,
    timestamp: new Date().toISOString()
  });

  try {
    // Optimize image before processing
    const optimizedImage = await compress(imageFile, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    });

    // Retry logic for API calls
    const result = await retry(
      async (bail) => {
        try {
          const base64Image = await fileToBase64(optimizedImage);
          const response = await makeApiRequest(base64Image);
          return validateAndProcessResponse(response);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
              console.error('Validation error:', error.response.data);
              bail(error);
              return;
            }
            if (error.response?.status === 429) {
              // Retry on rate limit
              throw error;
            }
          }
          console.error('API request failed:', error);
          throw error;
        }
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (error, attempt) => {
          console.warn(`API attempt ${attempt} failed:`, error);
        },
      }
    );

    if (result) {
      return result;
    }

    // If no result, use fallback
    console.warn('No valid result from API, using fallback');
    const imageAnalysis = await analyzeImageBasics(imageFile);
    return getFallbackResponse(imageAnalysis);

  } catch (error) {
    console.error('Disease detection failed:', error);
    const imageAnalysis = await analyzeImageBasics(imageFile);
    return getFallbackResponse(imageAnalysis);
  }
};

export default {
  detectDisease,
};

