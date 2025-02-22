import type { ModernFarmingRequest } from "./modernFarmingService"

export const generateModernFarmingPrompt = ({ technique, farmSize, budget }: ModernFarmingRequest): string => {
  return `You are an AI agricultural technology expert. Generate a modern farming analysis report in JSON format for:

Technique: ${technique}
Farm Size: ${farmSize} acres
Budget Range: ${budget}

Return your analysis as a JSON object with this exact structure:
{
  "techniqueAnalysis": {
    "overview": {
      "name": string,
      "estimatedCost": number,
      "roi": number
    }
  },
  "implementation": {
    "phases": [
      {
        "name": string,
        "duration": string
      }
    ]
  },
  "metrics": {
    "resourceEfficiency": {
      "water": number,
      "labor": number,
      "energy": number
    }
  }
}

Guidelines:
1. Ensure realistic cost estimates based on budget range
2. ROI should be between 10-30%
3. Include 3-5 implementation phases
4. Resource efficiency metrics should be on a scale of 0-100
5. Consider local agricultural conditions
6. Provide practical implementation steps
7. Focus on sustainable practices
`.trim()
}