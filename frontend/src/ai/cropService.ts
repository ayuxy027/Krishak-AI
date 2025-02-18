import axios from "axios";
import getCropAnalyticsPrompt from "./cropPrompt";
import type { CropAnalyticsInput } from "./cropPrompt";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = import.meta.env.VITE_GEMINI_API_URL;

// Input types for the analytics service
export interface CropAnalyticsRequest {
    city: string;
    state: string;
    cropName: string;
    dateRange?: string;
    options?: {
        logErrors?: boolean;
        includeHistorical?: boolean;
    };
}

// Response types
export interface MarketAnalysis {
    summary: {
        currentPrice: number;
        priceChange: number;
        tradingVolume: number;
        marketSentiment: string;
    };
    visualizations: {
        type: string;
        title: string;
        description: string;
        data: any[];
        annotations?: any[];
    }[];
    insights: {
        category: string;
        key: string;
        description: string;
        impact: string;
        recommendation: string;
    }[];
}

export interface QualityMetrics {
    gradeDistribution: {
        premium: number;
        standard: number;
        substandard: number;
    };
    qualityParameters: {
        parameter: string;
        value: number;
        unit: string;
        benchmark: number;
    }[];
}

export interface ForecastMetrics {
    priceProjection: {
        nextWeek: number;
        nextMonth: number;
        confidence: number;
    };
    supplyOutlook: {
        trend: string;
        factors: {
            factor: string;
            impact: string;
        }[];
    };
}

export interface CropAnalyticsResponse {
    marketAnalysis: MarketAnalysis;
    qualityMetrics: QualityMetrics;
    forecastMetrics: ForecastMetrics;
}

export const getCropAnalytics = async (
    request: CropAnalyticsRequest
): Promise<CropAnalyticsResponse> => {
    if (!API_KEY) {
        throw new Error("Missing required GEMINI_API_KEY environment variable");
    }

    if (!API_URL) {
        throw new Error("Missing required GEMINI_API_URL environment variable");
    }

    const promptInput: CropAnalyticsInput = {
        city: request.city,
        state: request.state,
        cropName: request.cropName,
        options: {
            logErrors: request.options?.logErrors,
            includeHistorical: request.options?.includeHistorical,
            dateRange: request.dateRange,
        },
    };

    const requestData = {
        contents: [{ parts: [{ text: getCropAnalyticsPrompt(promptInput) }] }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
    };

    try {
        const response = await axios.post(`${API_URL}?key=${API_KEY}`, requestData, { headers: { "Content-Type": "application/json" } });
        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response format from Gemini API");
        }
        return JSON.parse(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error("Crop Analytics API Error:", error);
        throw error;
    }
};

export default { getCropAnalytics };
