import axios from "axios"
import getAIPrompt from "./aiPrompt"

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL = import.meta.env.VITE_GEMINI_API_URL

interface GeminiPart {
  text: string
}

interface GeminiContent {
  parts: GeminiPart[]
}

interface GeminiRequest {
  contents: GeminiContent[]
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
    stopSequences?: string[]
  }
  safetySettings?: {
    category: string
    threshold: string
  }[]
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string
      }[]
    }
    finishReason: string
    safetyRatings: {
      category: string
      probability: string
    }[]
  }[]
  promptFeedback: {
    safetyRatings: {
      category: string
      probability: string
    }[]
  }
}

export const getAIResponse = async (userInput: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Missing required GEMINI_API_KEY environment variable")
  }

  if (!API_URL) {
    throw new Error("Missing required GEMINI_API_URL environment variable")
  }

  const requestData: GeminiRequest = {
    contents: [
      {
        parts: [
          {
            text: getAIPrompt(userInput), // Generates an AI prompt specifically for Kisan-AI
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.8, // Keeps responses informative yet precise
      topK: 50,
      topP: 1,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  }

  try {
    const response = await axios.post<GeminiResponse>(`${API_URL}?key=${API_KEY}`, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from Gemini API")
    }

    return response.data.candidates[0].content.parts[0].text
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Kisan-AI API Error:", {
        status: error.response?.status,
        data: error.response?.data,
      })
      throw new Error(`Kisan-AI API Error: ${error.response?.data?.error?.message || error.message}`)
    }
    console.error("Error fetching response from Kisan-AI API:", error)
    throw error
  }
}

export default {
  getAIResponse,
}