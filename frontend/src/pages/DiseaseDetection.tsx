import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Microscope, Leaf, Shield, Upload, RefreshCcw, Check, Cpu
} from 'lucide-react';
import clsx from 'clsx';

interface EnvironmentalFactors {
  humidity: string;
  temperature: string;
  soilCondition: string;
  soilPH: string;
  sunlight: string;
}

interface DiseaseDetectionResult {
  disease: string;
  scientificName: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  preventiveMeasures: string[];
  treatment: string;
  detectedAt: string;
  affectedArea: string;
  spreadRisk: 'low' | 'moderate' | 'high';
  environmentalFactors: EnvironmentalFactors;
  recommendedActions: string[];
  timeToTreat: string;
  estimatedRecovery: string;
  potentialYieldImpact: string;
}

interface DiseaseDetectionProps {
  t: (key: string) => string;
  onAnalysisComplete?: (result: DiseaseDetectionResult) => void;
  maxImageSize?: number;
}

const DEFAULT_MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const possibleDiseases: DiseaseDetectionResult[] = [
  {
    disease: "Leaf Rust",
    scientificName: "Puccinia triticina",
    confidence: 94.7,
    severity: "medium",
    preventiveMeasures: [
      "Use resistant cultivars",
      "Maintain proper plant spacing (15-20cm)",
      "Monitor humidity levels daily",
      "Apply preventive fungicides bi-weekly",
      "Implement crop rotation strategy"
    ],
    treatment: "Apply systemic fungicide (propiconazole 25% EC @ 0.1%)",
    detectedAt: new Date().toISOString(),
    affectedArea: "23% of leaf surface",
    spreadRisk: "high",
    environmentalFactors: {
      humidity: "75% (Above optimal)",
      temperature: "22°C (Favorable for spread)",
      soilCondition: "Slightly acidic",
      soilPH: "6.2",
      sunlight: "Partial shade"
    },
    recommendedActions: [
      "Immediate fungicide application",
      "Increase plant spacing",
      "Improve air circulation",
      "Monitor neighboring plants"
    ],
    timeToTreat: "Within 48 hours",
    estimatedRecovery: "2-3 weeks with treatment",
    potentialYieldImpact: "15-20% reduction if untreated"
  },
  {
    disease: "Powdery Mildew",
    scientificName: "Blumeria graminis",
    confidence: 88.3,
    severity: "low",
    preventiveMeasures: [
      "Improve air circulation",
      "Reduce nitrogen fertilization",
      "Morning irrigation only",
      "Weekly monitoring",
      "Remove infected plant debris"
    ],
    treatment: "Apply sulfur-based fungicide or neem oil solution (5ml/L)",
    detectedAt: new Date().toISOString(),
    affectedArea: "12% of leaf surface",
    spreadRisk: "moderate",
    environmentalFactors: {
      humidity: "65% (Moderate)",
      temperature: "20°C (Within control range)",
      soilCondition: "Well-balanced",
      soilPH: "6.8",
      sunlight: "Full sun"
    },
    recommendedActions: [
      "Apply organic fungicide",
      "Adjust watering schedule",
      "Prune affected areas",
      "Monitor humidity levels"
    ],
    timeToTreat: "Within 5 days",
    estimatedRecovery: "1-2 weeks with treatment",
    potentialYieldImpact: "5-10% reduction if untreated"
  },
  {
    disease: "Bacterial Blight",
    scientificName: "Xanthomonas oryzae",
    confidence: 91.5,
    severity: "high",
    preventiveMeasures: [
      "Use certified disease-free seeds",
      "Hot water seed treatment",
      "Field sanitation",
      "Balanced fertilization",
      "Proper drainage"
    ],
    treatment: "Apply copper-based bactericide (2g/L) + streptocycline (0.3g/L)",
    detectedAt: new Date().toISOString(),
    affectedArea: "35% of leaf surface",
    spreadRisk: "high",
    environmentalFactors: {
      humidity: "85% (High risk)",
      temperature: "28°C (Optimal for disease)",
      soilCondition: "Waterlogged",
      soilPH: "7.2",
      sunlight: "Intermittent"
    },
    recommendedActions: [
      "Immediate bactericide application",
      "Improve drainage",
      "Remove severely infected plants",
      "Adjust irrigation practices"
    ],
    timeToTreat: "Within 24 hours",
    estimatedRecovery: "3-4 weeks with treatment",
    potentialYieldImpact: "30-40% reduction if untreated"
  }
];

const DiseaseDetection: React.FC<DiseaseDetectionProps> = ({
  t,
  onAnalysisComplete,
  maxImageSize = DEFAULT_MAX_IMAGE_SIZE
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<DiseaseDetectionResult | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    modelLoaded: false,
    apiConnected: false,
    processingReady: false
  });
  const [_errorMessage, setErrorMessage] = useState<string | null>(null);
  const [_weatherConditions, setWeatherConditions] = useState({
    temperature: '24°C',
    humidity: '65%',
    windSpeed: '8 km/h'
  });

  useEffect(() => {
    console.log('Initializing Disease Detection component');
    const loadSystem = async () => {
      try {
        await simulateSystemLoad();
        console.log('System initialization complete');
      } catch (error) {
        console.error('System initialization failed:', error);
      }
    };

    loadSystem();
  }, [t]);

  const simulateSystemLoad = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSystemStatus(prev => ({ ...prev, modelLoaded: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    setSystemStatus(prev => ({ ...prev, apiConnected: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    setSystemStatus(prev => ({ ...prev, processingReady: true }));
  };

  const processFile = async (file: File) => {
    try {
      console.log('Processing file:', { name: file.name, size: file.size });
      const reader = new FileReader();

      reader.onload = () => {
        setImage(reader.result as string);
        analyzeImage(file);
      };

      reader.onerror = (error) => {
        console.error('File reading failed:', error);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File processing failed:', error);
    }
  };

  const simulateProgress = () => {
    let progress = 0;
    return setInterval(() => {
      progress += 5;
      if (progress <= 90) {
        setAnalysisProgress(progress);
      }
    }, 500);
  };

  const analyzeImage = async (_file: File) => {
    console.log('Starting analysis');
    setIsAnalyzing(true);
    setIsResultsVisible(false);
    setAnalysisProgress(0);
    setErrorMessage(null);

    const progressInterval = simulateProgress();

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Simulate weather data fetch
      setWeatherConditions({
        temperature: `${20 + Math.random() * 10}°C`,
        humidity: `${50 + Math.random() * 30}%`,
        windSpeed: `${5 + Math.random() * 10} km/h`
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      const randomResult = possibleDiseases[Math.floor(Math.random() * possibleDiseases.length)];
      setAnalysisResult(randomResult);
      setIsResultsVisible(true);

      onAnalysisComplete?.(randomResult);
      console.log('Analysis completed', randomResult);
    } catch (error) {
      console.error('Analysis failed:', error);
      setErrorMessage('Analysis failed. Please try again.');
      clearInterval(progressInterval);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: maxImageSize,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        setErrorMessage(
          error.code === 'file-too-large'
            ? `File is too large. Maximum size is ${maxImageSize / (1024 * 1024)}MB`
            : 'Invalid file type. Please upload a valid image.'
        );
        return;
      }
      if (acceptedFiles.length > 0) {
        setErrorMessage(null);
        processFile(acceptedFiles[0]);
      }
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  const solutions = [
    {
      title: t('diseaseDetection.chemical'),
      icon: Microscope,
      solutions: [
        'Apply balanced NPK fertilizer',
        'Use iron supplements',
        'Fungicide treatment if needed'
      ],
      color: 'blue',
    },
    {
      title: t('diseaseDetection.organic'),
      icon: Leaf,
      solutions: [
        'Organic compost application',
        'Natural grass clippings',
        'Seaweed solution spray'
      ],
      color: 'green',
    },
    {
      title: t('diseaseDetection.preventive'),
      icon: Shield,
      solutions: [
        'Proper mowing height',
        'Adequate drainage',
        'Regular aeration'
      ],
      color: 'purple',
    },
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* System Status Panel */}
      <div className="p-4 mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex gap-2 items-center text-lg font-semibold">
            <Cpu className="w-5 h-5 text-primary-600" />
            System Status
          </h3>
          <div className="flex gap-2">
            {Object.values(systemStatus).every(status => status) ? (
              <span className="flex gap-1 items-center text-sm text-green-600">
                <Check className="w-4 h-4" /> Ready
              </span>
            ) : (
              <span className="flex gap-1 items-center text-sm text-amber-600">
                <RefreshCcw className="w-4 h-4 animate-spin" /> Initializing
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(systemStatus).map(([key, status]) => (
            <div key={key} className="flex gap-2 items-center">
              {status ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <RefreshCcw className="w-4 h-4 text-amber-600 animate-spin" />
              )}
              <span className="text-sm text-gray-600">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div
          {...getRootProps()}
          className={clsx(
            "p-8 text-center rounded-xl border-2 border-dashed transition-colors duration-200",
            {
              "border-primary-500 bg-primary-50": isDragActive,
              "border-gray-300 hover:border-primary-500": !isDragActive,
            }
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 w-12 h-12 text-gray-400" />
          <p className="mb-2 text-gray-600">{t('diseaseDetection.dragDropText')}</p>
          <p className="text-sm text-gray-500">{t('diseaseDetection.uploadInstructions')}</p>
        </div>
      </div>

      {/* Analysis Progress */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Analysis Progress</h3>
                <span className="text-sm text-gray-600">{analysisProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <motion.div
                  className="h-2 rounded-full bg-primary-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {isResultsVisible && analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2"
          >
            {/* Analysis Results */}
            <div className="p-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl border border-gray-100 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-white">Analysis Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">Confidence Score</span>
                  <span className="font-semibold text-yellow-300">
                    {analysisResult.confidence}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">Detected Disease</span>
                  <span className="font-semibold text-red-300">
                    {analysisResult.disease}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">Severity Level</span>
                  <span className={clsx("font-semibold", {
                    "text-yellow-300": analysisResult.severity === "medium",
                    "text-red-300": analysisResult.severity === "high",
                    "text-green-300": analysisResult.severity === "low",
                  })}>
                    {analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {image && (
              <img
                src={image}
                alt="Analyzed crop"
                className="object-contain w-full max-h-48 rounded-lg shadow-md"
              />
            )}

            {/* Preventive Measures */}
            <div className="p-4 mt-4 bg-white rounded-lg shadow-md">
              <h4 className="mb-2 font-semibold text-gray-800">Preventive Measures:</h4>
              <ul className="pl-5 space-y-1 list-disc text-gray-700">
                {analysisResult.preventiveMeasures.map((measure, index) => (
                  <li key={index}>{measure}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solutions Grid */}
      {isResultsVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className={clsx(
                "p-6 bg-white rounded-xl border border-gray-100 shadow-sm",
                "transition-transform transform hover:scale-105"
              )}
            >
              <solution.icon
                className={clsx("w-12 h-12 mb-4", {
                  "text-blue-600": solution.color === "blue",
                  "text-green-600": solution.color === "green",
                  "text-purple-600": solution.color === "purple",
                })}
              />
              <h3 className="mb-4 text-lg font-semibold">{solution.title}</h3>
              <ul className="space-y-2">
                {solution.solutions.map((item, index) => (
                  <li key={index} className="flex gap-2 items-center text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DiseaseDetection;