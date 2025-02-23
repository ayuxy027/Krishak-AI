export interface DiseasePromptInput {
  imageBase64: string;
  cropType?: string;
  additionalContext?: string;
  environment?: string;
}

export const generateDiseasePrompt = ({ imageBase64, cropType, additionalContext, environment }: DiseasePromptInput): string => {
  console.log('Generating disease detection prompt', { 
    cropType, 
    hasImage: !!imageBase64,
    environment,
    timestamp: new Date().toISOString()
  });
  
  return `You are an expert agricultural disease detection system analyzing a plant image.
  ${cropType ? `The image is of a ${cropType} plant.` : 'The image is of a grass plant.'}
  ${additionalContext ? `Additional context: ${additionalContext}` : ''}
  ${environment ? `Environment: ${environment}` : ''}

  Analyze the image and provide:
  1. The specific disease name if detected
  2. Confidence level (as a percentage between 80-100)
  3. Severity assessment (low, medium, or high)
  4. Detailed treatment recommendations, including both immediate actions and preventive measures

  Return your analysis as a valid JSON object with these exact keys:
  {
    "disease": "specific disease name",
    "confidence": number (80-100),
    "severity": "low|medium|high",
    "treatment": "detailed treatment recommendations",
    "preventiveMeasures": ["measure1", "measure2", "measure3"]
  }

  Guidelines:
  - Be specific with disease names (use scientific names where applicable)
  - Provide actionable treatment steps
  - Consider both organic and chemical solutions
  - Include preventive measures
  - Maintain high confidence threshold (80-100%)
  - Consider environmental impact of treatments
  - Suggest cost-effective solutions
  `.trim();
};

export default generateDiseasePrompt; 