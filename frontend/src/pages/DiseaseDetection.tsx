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
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      {/* Dashboard Header - Made Responsive */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
          Plant Disease Detection Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600 md:text-base">
          Upload and analyze plant images for disease detection
        </p>
      </div>

      {/* System Status Panel - Made Responsive */}
      <div className="p-4 mb-8 bg-white rounded-xl border border-gray-200 shadow-lg md:p-6">
        <div className="flex flex-col gap-4 justify-between items-start mb-6 md:flex-row md:items-center">
          <div className="flex gap-3 items-center">
            <Cpu className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-800 md:text-xl">System Diagnostics</h3>
          </div>
          <div className="px-4 py-2 bg-gray-50 rounded-full">
            {Object.values(systemStatus).every(status => status) ? (
              <span className="flex gap-2 items-center text-sm font-medium text-green-600">
                <Check className="w-4 h-4" /> System Ready
              </span>
            ) : (
              <span className="flex gap-2 items-center text-sm font-medium text-amber-600">
                <RefreshCcw className="w-4 h-4 animate-spin" /> Initializing Systems
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {Object.entries(systemStatus).map(([key, status]) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-3 items-center">
                {status ? (
                  <div className="p-2 bg-green-100 rounded-full">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-amber-100 rounded-full">
                    <RefreshCcw className="w-5 h-5 text-amber-600 animate-spin" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500">
                    {status ? 'Operational' : 'Initializing...'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Section - Enhanced Responsive Design */}
      <div className="mb-8">
        <div
          {...getRootProps()}
          className={clsx(
            "relative p-4 rounded-xl border-dashed transition-all duration-300 md:p-8 border-3",
            "bg-gradient-to-r from-gray-50 to-white",
            "transform hover:shadow-lg hover:-translate-y-1",
            {
              "border-primary-500 bg-primary-50": isDragActive,
              "border-gray-300 hover:border-primary-500": !isDragActive,
            }
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <div className={clsx(
              "p-4 mb-4 rounded-full transition-all duration-300",
              isDragActive ? "bg-primary-100" : "bg-gray-100"
            )}>
              <Upload className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {t('diseaseDetection.dragDropText')}
            </h3>
            <p className="mb-4 text-sm text-gray-600">{t('diseaseDetection.uploadInstructions')}</p>
            <button className="px-6 py-2 text-sm font-medium text-white rounded-full bg-primary-600 hover:bg-primary-700">
              Select File
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Progress - Sophisticated */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3 items-center">
                  <RefreshCcw className="w-6 h-6 animate-spin text-primary-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Analysis in Progress</h3>
                </div>
                <span className="px-4 py-2 text-sm font-medium rounded-full text-primary-600 bg-primary-50">
                  {analysisProgress}% Complete
                </span>
              </div>
              <div className="overflow-hidden relative mb-4 w-full h-3 bg-gray-100 rounded-full">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-primary-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {['Image Processing', 'Disease Analysis', 'Risk Assessment', 'Report Generation'].map((step, index) => (
                  <div key={step} className="text-center">
                    <div className={clsx(
                      "mx-auto mb-2 w-8 h-8 rounded-full flex items-center justify-center",
                      analysisProgress >= (index + 1) * 25 ? "bg-primary-100" : "bg-gray-100"
                    )}>
                      <span className={clsx(
                        "text-sm font-medium",
                        analysisProgress >= (index + 1) * 25 ? "text-primary-600" : "text-gray-400"
                      )}>{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section - Enhanced Responsive Grid */}
      <AnimatePresence>
        {isResultsVisible && analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Primary Results Card - Responsive Layout */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-lg md:p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Detection Results</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-gray-600">Disease</td>
                        <td className="py-3 font-medium text-right text-gray-900">{analysisResult.disease}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-gray-600">Scientific Name</td>
                        <td className="py-3 font-medium text-right text-gray-900">{analysisResult.scientificName}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-gray-600">Confidence</td>
                        <td className="py-3 font-medium text-right text-primary-600">{analysisResult.confidence}%</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600">Severity</td>
                        <td className="py-3 text-right">
                          <span className={clsx(
                            "px-3 py-1 text-sm font-medium rounded-full",
                            {
                              "bg-red-100 text-red-700": analysisResult.severity === "high",
                              "bg-yellow-100 text-yellow-700": analysisResult.severity === "medium",
                              "bg-green-100 text-green-700": analysisResult.severity === "low",
                            }
                          )}>
                            {analysisResult.severity.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Image Preview */}
                {image && (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Analyzed crop"
                      className="w-full h-full rounded-lg shadow-lg"
                    />
                    <div className="absolute right-0 bottom-0 left-0 p-4 bg-gradient-to-t to-transparent rounded-b-lg from-black/70">
                      <p className="text-sm font-medium text-white">
                        Affected Area: {analysisResult.affectedArea}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Environmental Factors - Responsive Table */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-lg md:p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl">
                Environmental Analysis
              </h3>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-3 text-sm font-medium text-left text-gray-500">Factor</th>
                        <th className="pb-3 text-sm font-medium text-left text-gray-500">Current Value</th>
                        <th className="pb-3 text-sm font-medium text-left text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(analysisResult.environmentalFactors).map(([factor, value]) => (
                        <tr key={factor} className="border-b border-gray-100">
                          <td className="py-3 text-sm text-gray-900 capitalize">
                            {factor.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </td>
                          <td className="py-3 text-sm font-medium text-gray-900">{value}</td>
                          <td className="py-3">
                            <span className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                              Monitoring
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Treatment Timeline - Responsive Stack */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-lg md:p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl">
                Treatment Timeline
              </h3>
              <div className="flex flex-col justify-between items-stretch md:flex-row md:items-center">
                <div className="flex-1 p-4 text-center">
                  <p className="mb-2 text-sm text-gray-600">Time to Treat</p>
                  <p className="text-lg font-semibold text-primary-600">{analysisResult.timeToTreat}</p>
                </div>
                <div className="flex-1 p-4 text-center border-gray-200 border-x">
                  <p className="mb-2 text-sm text-gray-600">Estimated Recovery</p>
                  <p className="text-lg font-semibold text-green-600">{analysisResult.estimatedRecovery}</p>
                </div>
                <div className="flex-1 p-4 text-center">
                  <p className="mb-2 text-sm text-gray-600">Yield Impact</p>
                  <p className="text-lg font-semibold text-red-600">{analysisResult.potentialYieldImpact}</p>
                </div>
              </div>
            </div>

            {/* Solutions Grid - Responsive Layout */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {solutions.map((solution) => (
                <div
                  key={solution.title}
                  className="p-4 md:p-6 bg-white rounded-xl border border-gray-200 shadow-lg 
                           transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                           transform hover:-translate-y-1"
                >
                  <div className={clsx(
                    "p-3 w-fit rounded-full mb-4",
                    {
                      "bg-blue-100": solution.color === "blue",
                      "bg-green-100": solution.color === "green",
                      "bg-purple-100": solution.color === "purple",
                    }
                  )}>
                    <solution.icon
                      className={clsx("w-6 h-6", {
                        "text-blue-600": solution.color === "blue",
                        "text-green-600": solution.color === "green",
                        "text-purple-600": solution.color === "purple",
                      })}
                    />
                  </div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">{solution.title}</h3>
                  <ul className="space-y-3">
                    {solution.solutions.map((item, index) => (
                      <li key={index} className="flex gap-3 items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Real-time Updates Section - New Addition */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-lg md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 md:text-xl">Real-time Monitoring</h3>
                <span className="flex gap-2 items-center text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Disease Spread Risk</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-semibold text-gray-900">{analysisResult.spreadRisk}</span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={clsx("w-3 h-3 rounded-full", {
                        "bg-red-500": analysisResult.spreadRisk === "high",
                        "bg-yellow-500": analysisResult.spreadRisk === "moderate",
                        "bg-green-500": analysisResult.spreadRisk === "low",
                      })}
                    />
                  </div>
                </div>
                {/* Add more real-time monitoring widgets as needed */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseDetection;