import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Microscope, Leaf, Shield, Upload, RefreshCcw, Check, Cpu
} from 'lucide-react';
import clsx from 'clsx';
import { analyzePlantImage, DiseaseAnalysisResult } from '../ai/diseaseDetectionService';
import { DiseasePromptConfig } from '../ai/diseasePrompt';

interface DiseaseDetectionProps {
  t: (key: string) => string;
  onAnalysisComplete?: (result: DiseaseAnalysisResult) => void;
  maxImageSize?: number;
  cropType?: string;
  severityLevel?: 'mild' | 'medium' | 'severe';
}

const DEFAULT_MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const DiseaseDetection: React.FC<DiseaseDetectionProps> = ({
  t,
  onAnalysisComplete,
  maxImageSize = DEFAULT_MAX_IMAGE_SIZE,
  cropType,
  severityLevel
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResult | null>(null);
  const [systemStatus, _setSystemStatus] = useState({
    modelLoaded: true,
    apiConnected: true,
    processingReady: true
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = async (file: File) => {
    try {
      setErrorMessage(null);
      setIsAnalyzing(true);
      setIsResultsVisible(false);
      setAnalysisProgress(0);

      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        setImage(imageData);

        try {
          // Start progress animation
          const progressInterval = setInterval(() => {
            setAnalysisProgress(prev => prev < 90 ? prev + 5 : prev);
          }, 500);

          // Configure analysis parameters
          const config: DiseasePromptConfig = {
            cropType,
            severityLevel
          };

          // Perform analysis
          const result = await analyzePlantImage(imageData, config);

          // Update UI with results
          clearInterval(progressInterval);
          setAnalysisProgress(100);
          setAnalysisResult(result);
          setIsResultsVisible(true);
          onAnalysisComplete?.(result);
        } catch (error) {
          setErrorMessage(error instanceof Error ? error.message : 'Analysis failed');
        } finally {
          setIsAnalyzing(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File processing failed:', error);
      setErrorMessage('File processing failed');
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
      solutions: analysisResult?.organicTreatments || ['Solution 1', 'Solution 2', 'Solution 3'],
      color: 'blue',
    },
    {
      title: t('diseaseDetection.organic'),
      icon: Leaf,
      solutions: analysisResult?.ipmStrategies || ['Solution 1', 'Solution 2', 'Solution 3'],
      color: 'green',
    },
    {
      title: t('diseaseDetection.preventive'),
      icon: Shield,
      solutions: analysisResult?.preventionPlan || ['Solution 1', 'Solution 2', 'Solution 3'],
      color: 'purple',
    },
  ];

  const getStatusColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'green';
    if (confidence >= 0.6) return 'yellow';
    return 'red';
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
          Plant Disease Detection Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600 md:text-base">
          Upload and analyze plant images for disease detection
        </p>
      </div>

      {/* System Status Panel */}
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

      {/* Upload Section */}
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

      {/* Analysis Progress */}
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

      {/* Results Section */}
      <AnimatePresence>
        {isResultsVisible && analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Primary Results Card */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-lg md:p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Detection Results</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-gray-600">Disease</td>
                        <td className="py-3 font-medium text-right text-gray-900">{analysisResult.diseaseName}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-gray-600">Name of Crop</td>
                        <td className="py-3 font-medium text-right text-gray-900">{analysisResult.cropName}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-gray-600">Confidence</td>
                        <td className="py-3 font-medium text-right text-primary-600">
                          {(analysisResult.confidenceLevel * 100).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600">Severity</td>
                        <td className="py-3 text-right">
                          <span className={clsx(
                            "px-3 py-1 text-sm font-medium rounded-full",
                            {
                              "bg-red-100 text-red-700": analysisResult.severityLevel === "severe",
                              "bg-yellow-100 text-yellow-700": analysisResult.severityLevel === "medium",
                              "bg-green-100 text-green-700": analysisResult.severityLevel === "mild",
                            }
                          )}>
                            {analysisResult.severityLevel.toUpperCase()}
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
                  </div>
                )}
              </div>
            </div>

            {/* Environmental Factors */}
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
                      {analysisResult.environmentalFactors.map((factor, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 text-sm text-gray-900 capitalize">
                            {factor}
                          </td>
                          <td className="py-3 text-sm font-medium text-gray-900">N/A</td>
                          <td className="py-3">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(analysisResult.confidenceLevel)}`}>
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

            {/* Treatment Timeline */}
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
                  <p className="text-lg font-semibold text-red-600">{analysisResult.yieldImpact}</p>
                </div>
              </div>
            </div>

            {/* Solutions Grid */}
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

            {/* Real-time Updates Section */}
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
                  <p className="text-sm text-gray-600">Spread Risk</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-semibold text-gray-900">N/A</span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-3 h-3 bg-gray-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Handling */}
      {errorMessage && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;