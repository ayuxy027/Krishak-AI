export interface DiseasePromptConfig {
  cropType?: string;
  severityLevel?: 'mild' | 'medium' | 'severe';
}

export const getDiseaseDetectionPrompt = (config?: DiseasePromptConfig): string => {
  return `
    As an expert agricultural pathologist, analyze this plant image and provide a response in the following JSON format.
    Ensure the response is pure valid JSON with no chances of trailing commas in response and all strings are properly escaped.
    Ensure the response is in JSON format and not in markdown format.
    Required JSON structure:
    {
      "diseaseName": "string",
      "cropName": "string",
      "timeToTreat": "string",
      "estimatedRecovery": "string",
      "yieldImpact": "string",
      "severityLevel": "mild|medium|severe",
      "symptomDescription": "string",
      "environmentalFactors": ["string"],
      "organicTreatments": ["string"],
      "ipmStrategies": ["string"],
      "preventionPlan": ["string"],
      "confidenceLevel": number,
      "diagnosisSummary": "string"
    }

    Analysis requirements:
    1. Identify disease(s) with crop name
    2. Describe symptoms with technical terms
    3. List environmental contributing factors
    4. Provide organic treatment protocols
    5. Recommend integrated pest management strategies
    6. Outline prevention measures for future crops

    Important:
    - Ensure all JSON values are properly formatted
    - Use double quotes for all strings
    - Do not include any markdown formatting
    - Do not include any explanatory text outside the JSON
    - Ensure all arrays are properly closed
    - Do not include trailing commas

    For waste queries or spam queries:
    - Return a JSON with not applicable in all fields and confidence level 0
    - Add a message to the response to say that the query is not applicable
    - Do not include any other text in the response
    - Do not include any other fields in the JSON
    - Prompt user to ask a valid question 
    - Do this when you see a query that is not related to agriculture or plant diseases
    ${config?.cropType ? `Crop Type: ${config.cropType}` : ''}
    ${config?.severityLevel ? `Severity Level: ${config.severityLevel}` : ''}
  `.replace(/\s+/g, ' ').trim();
};