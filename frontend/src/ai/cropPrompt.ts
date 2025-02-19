/**
 * cropExpert Configuration
 * Defines the behavior and capabilities of the cropExpert
 */

export interface CropAnalyticsInput {
    city: string;
    state: string;
    cropName: string;
    options?: {
        logErrors?: boolean;
        includeHistorical?: boolean;
        dateRange?: string;
    };
}

const getCropAnalyticsPrompt = ({ city, state, cropName, options }: CropAnalyticsInput): string => {
    return `You are an AI crop market analyst. Generate a market analysis report in JSON format for the following parameters:

City: ${city}
State: ${state}
Crop: ${cropName}
${options?.dateRange ? `Date Range: ${options.dateRange}` : ''}
${options?.includeHistorical ? 'Include historical data in analysis' : ''}

Return your analysis as a JSON object with this exact structure:
{
    "marketAnalysis": {
        "currentPrice": number,
        "priceChange": number,
        "tradingVolume": string,
        "supplyStatus": string,
        "demandTrend": string
    },
    "qualityMetrics": {
        "gradeDistribution": {
            "premium": number,
            "standard": number,
            "substandard": number
        },
        "moistureContent": number,
        "qualityScore": number
    },
    "forecastMetrics": {
        "priceProjection": {
            "nextWeek": number,
            "nextMonth": number,
            "confidence": number
        },
        "marketSentiment": string,
        "riskLevel": string
    }
}

Important:
1. Use realistic values based on current market conditions
2. All number values should be positive
3. Ensure the response is valid JSON
4. Do not include any additional text or markdown formatting`;
};

export default getCropAnalyticsPrompt;