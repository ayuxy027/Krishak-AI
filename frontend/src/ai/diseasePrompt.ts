export interface DiseasePromptConfig {
  cropType?: string;
  severityLevel?: 'mild' | 'medium' | 'severe';
}

export const getDiseaseDetectionPrompt = (config?: DiseasePromptConfig): string => {
  return `
    As an expert agricultural pathologist, analyze this plant image and provide a response in the following JSON format.
    You can analyze ANY type of plant, including:
    - All types of crops (cereals, pulses, oilseeds, etc.)
    - All fruits (tropical, subtropical, temperate)
    - All vegetables (root, leafy, fruit vegetables)
    - All types of trees (fruit bearing, timber, ornamental)
    - All types of flowering plants
    - All types of indoor and outdoor plants
    - All commercial and home garden plants
    - All hydroponic and aquaponic plants

    IMPORTANT VALIDATION RULES:
    1. For ANY non-plant or non-agricultural images, return:
    {
      "diseaseName": "Not Applicable",
      "cropName": "Invalid Input",
      "confidenceLevel": 0,
      "diagnosisSummary": "This appears to be a non-plant image. Please provide a clear image of a plant for analysis.",
      "timeToTreat": "N/A",
      "estimatedRecovery": "N/A",
      "yieldImpact": "N/A",
      "severityLevel": "N/A"
    }

    2. For spam, inappropriate, or malicious queries, return:
    {
      "diseaseName": "Invalid Query",
      "cropName": "Not Applicable",
      "confidenceLevel": 0,
      "diagnosisSummary": "Unable to process this query. Please provide appropriate plant-related images.",
      "timeToTreat": "N/A",
      "estimatedRecovery": "N/A",
      "yieldImpact": "N/A",
      "severityLevel": "N/A"
    }

    3. For valid plant images, provide detailed analysis in this JSON structure:
    {
      "diseaseName": "string",
      "cropName": "string",
      "timeToTreat": "string",
      "estimatedRecovery": "string",
      "yieldImpact": "string",
      "severityLevel": "mild|medium|severe",
      "symptomDescription": "string",
      "environmentalFactors": [
        {
          "factor": "string",
          "currentValue": "string",
          "optimalRange": "string",
          "status": "optimal|warning|critical"
        }
      ],
      "realTimeMetrics": {
        "spreadRisk": {
          "level": "string",
          "value": number,
          "trend": "increasing|stable|decreasing"
        },
        "diseaseProgression": {
          "stage": "string",
          "rate": number,
          "nextCheckDate": "string"
        },
        "environmentalConditions": {
          "temperature": number,
          "humidity": number,
          "soilMoisture": number,
          "lastUpdated": "string"
        }
      },
      "organicTreatments": ["string"],
      "ipmStrategies": ["string"],
      "preventionPlan": ["string"],
      "confidenceLevel": number,
      "diagnosisSummary": "string"
    }

    Analysis requirements for valid plant images:
    1. Identify ANY plant disease regardless of plant type
    2. Provide accurate plant/crop name identification
    3. Give detailed environmental analysis
    4. Include real-time metrics with practical values
    5. Suggest both organic and IPM treatments
    6. Outline prevention measures
    7. Maintain high confidence threshold for diagnosis

    Important Guidelines:
    - Ensure all JSON values are properly formatted
    - Use double quotes for all strings
    - No markdown formatting
    - No explanatory text outside JSON
    - No trailing commas
    - Realistic environmental metrics
    - Proper units (°C, %, etc.)
    - Confidence level between 80-100% for valid analyses only

        Ensure the response is pure valid JSON with no chances of trailing commas in response and all strings are properly escaped.
    Ensure the response is in JSON format and not in markdown format.
        Required JSON structure:


    ${config?.cropType ? `Crop Type: ${config.cropType}` : ''}
    ${config?.severityLevel ? `Severity Level: ${config.severityLevel}` : ''}
  `.replace(/\s+/g, ' ').trim();
};
