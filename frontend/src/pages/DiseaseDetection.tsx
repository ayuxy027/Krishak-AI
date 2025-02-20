import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Microscope, Leaf, Shield, Upload, RefreshCcw, Check, Cpu
} from 'lucide-react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

interface DiseaseDetectionProps {
  t: (key: string) => string;
}

interface AnalysisResult {
  confidence: number;
  disease: string;
  severity: 'low' | 'medium' | 'high';
  detectedAt: string;
}

const DiseaseDetection: React.FC<DiseaseDetectionProps> = ({ t }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [_mounted, setMounted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    modelLoaded: false,
    apiConnected: false,
    processingReady: false
  });

  // Simulate initial system loading
  useEffect(() => {
    setMounted(true);
    const loadSystem = async () => {
      // Simulate model loading
      toast.info('Initializing AI system...', { autoClose: 2000 });
      setTimeout(() => {
        setSystemStatus(prev => ({ ...prev, modelLoaded: true }));
        toast.info('AI model loaded successfully', { autoClose: 1500 });
      }, 2000);

      // Simulate API connection
      setTimeout(() => {
        setSystemStatus(prev => ({ ...prev, apiConnected: true }));
        toast.info('Connected to analysis server', { autoClose: 1500 });
      }, 3500);

      // Simulate processing ready
      setTimeout(() => {
        setSystemStatus(prev => ({ ...prev, processingReady: true }));
        toast.success('System ready for analysis', { autoClose: 2000 });
      }, 5000);
    };

    loadSystem();
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setIsResultsVisible(false);
    setAnalysisProgress(0);

    const stages = [
      { message: "Initializing image analysis...", progress: 15 },
      { message: "Processing image features...", progress: 35 },
      { message: "Applying AI model...", progress: 60 },
      { message: "Detecting disease patterns...", progress: 75 },
      { message: "Generating recommendations...", progress: 90 },
      { message: "Finalizing analysis...", progress: 100 }
    ];

    let currentStage = 0;
    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        toast.info(stage.message, { autoClose: 1500 });
        setAnalysisProgress(stage.progress);
        currentStage++;
      } else {
        clearInterval(stageInterval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisResult({
            confidence: 94.5,
            disease: "Leaf Blight",
            severity: "medium",
            detectedAt: new Date().toISOString()
          });
          setIsResultsVisible(true);
          toast.success("Analysis completed successfully!", { autoClose: 2000 });
        }, 1000);
      }
    }, 1200);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) processFile(acceptedFiles[0]);
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  const solutions = [
    {
      title: t('diseaseDetection.chemical'),
      icon: Microscope,
      solutions: ['Fungicide application', 'Copper-based sprays', 'Systemic treatments'],
      color: 'blue',
    },
    {
      title: t('diseaseDetection.organic'),
      icon: Leaf,
      solutions: ['Neem oil spray', 'Compost tea', 'Beneficial bacteria'],
      color: 'green',
    },
    {
      title: t('diseaseDetection.preventive'),
      icon: Shield,
      solutions: ['Crop rotation', 'Proper spacing', 'Soil management'],
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
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Analysis Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Confidence Score</span>
                  <span className="font-semibold text-primary-600">
                    {analysisResult.confidence}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Detected Disease</span>
                  <span className="font-semibold text-red-600">
                    {analysisResult.disease}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Severity Level</span>
                  <span className={clsx("font-semibold", {
                    "text-yellow-600": analysisResult.severity === "medium",
                    "text-red-600": analysisResult.severity === "high",
                    "text-green-600": analysisResult.severity === "low",
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
                className="object-contain w-full max-h-48 rounded-lg"
              />
            )}
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