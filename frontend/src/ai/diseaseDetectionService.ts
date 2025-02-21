import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = import.meta.env.VITE_GEMINI_API_URL;

export interface DiseaseDetectionResult {
  confidence: number;
  disease: string;
  severity: 'low' | 'medium' | 'high';
  treatment: string;
  detectedAt: string;
}

export const detectDisease = async (imageFile: File): Promise<DiseaseDetectionResult> => {
  if (!API_KEY || !API_URL) {
    throw new Error("Missing required Gemini API configuration");
  }

  // Convert image to base64
  const base64Image = await fileToBase64(imageFile);

  const requestData = {
    contents: [{
      parts: [
        {
          text: `You are an expert agricultural disease detection system. Analyze this plant image and provide:
          1. The name of any disease detected
          2. Confidence level (as a percentage)
          3. Severity level (low, medium, or high)
          4. Recommended treatment
          
          Format your response as a valid JSON object with these exact keys:
          {
            "disease": "disease name",
            "confidence": number,
            "severity": "low|medium|high",
            "treatment": "treatment description"
          }`
        },
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
    }
  };

  try {
    const response = await axios.post(`${API_URL}?key=${API_KEY}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const textResponse = response.data.candidates[0].content.parts[0].text;
    const result = JSON.parse(textResponse);

    return {
      ...result,
      detectedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Gemini API Error:', {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`Gemini API Error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export default {
  detectDisease,
};