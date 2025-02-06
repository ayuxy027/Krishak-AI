import React, { useState, useCallback, ChangeEvent } from 'react';
import { Upload, X, AlertCircle, ChevronRight, Microscope, Leaf, Shield } from 'lucide-react';
import clsx from 'clsx'; // Ensure you have clsx installed for className management

interface DiseaseDetectionProps {
  t: (key: string) => string;
}

const DiseaseDetection: React.FC<DiseaseDetectionProps> = ({ t }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
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
    setTimeout(() => {
      setIsAnalyzing(false);
      setTimeout(() => setIsResultsVisible(true), 100);
    }, 2000);
  };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) processFile(acceptedFiles[0]);
  }, []);

  const handleDragEnter = useCallback(() => setIsDragActive(true), []);
  const handleDragLeave = useCallback(() => setIsDragActive(false), []);

  const solutions = [
    {
      title: 'Chemical Treatment',
      icon: Microscope,
      solutions: ['Fungicide application', 'Copper-based sprays', 'Systemic treatments'],
      color: 'blue',
    },
    {
      title: 'Organic Solutions',
      icon: Leaf,
      solutions: ['Neem oil spray', 'Compost tea', 'Beneficial bacteria'],
      color: 'green',
    },
    {
      title: 'Preventive Measures',
      icon: Shield,
      solutions: ['Crop rotation', 'Proper spacing', 'Soil management'],
      color: 'purple',
    },
  ];

  return (
    <div className="p-4 mx-auto space-y-6 max-w-6xl">
      <div className="overflow-hidden bg-white rounded-xl shadow-lg transition-transform duration-500 hover:shadow-xl">
        <div className="p-6">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              handleDrop(files);
              setIsDragActive(false);
            }}
            className={clsx(
              'border-2 border-dashed rounded-xl p-8 md:p-12 transition-all',
              {
                'border-green-500 bg-green-50 scale-105': isDragActive,
                'border-gray-300': !isDragActive && !image,
                'bg-gray-50': image,
              }
            )}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="file-upload"
            />

            {image ? (
              <div className="relative group">
                <img
                  src={image}
                  alt="Uploaded crop"
                  className="mx-auto max-h-96 rounded-lg shadow-md transition-transform duration-500 transform group-hover:scale-105"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setIsResultsVisible(false);
                  }}
                  className="absolute -top-3 -right-3 p-2 text-white bg-red-500 rounded-full shadow-lg transition-transform hover:bg-red-600"
                  aria-label="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="block cursor-pointer">
                <div className="space-y-4 text-center">
                  <div className="relative mx-auto w-20 h-20">
                    <Upload className="mx-auto w-12 h-12 text-green-600 transition-transform hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    {t('diseaseDetection.dragDropText')}
                  </h3>
                  <p className="text-sm text-gray-500">{t('diseaseDetection.uploadInstructions')}</p>
                </div>
              </label>
            )}
          </div>
        </div>
      </div>

      {isAnalyzing && (
        <div className="flex justify-center items-center p-6 space-x-4 bg-white rounded-xl shadow-lg">
          <div className="w-8 h-8 rounded-full border-4 border-green-500 animate-spin border-t-transparent" />
          <p className="text-lg text-gray-600">{t('common.loading')}</p>
        </div>
      )}

      {image && !isAnalyzing && isResultsVisible && (
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 shadow-md">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Leaf Blight Detected</h3>
                <p className="mt-1 text-yellow-700">
                  Our AI has detected signs of Leaf Blight in your crop. Review the recommended actions below.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {solutions.map(({ title, icon: Icon, solutions, color } ) => (
              <div
                key={title}
                className={clsx(
                  'p-6 bg-white rounded-xl shadow-lg transition-transform duration-500 hover:shadow-xl',
                  `text-${color}-600`
                )}
              >
                <div className="flex items-center mb-4 space-x-3">
                  <Icon className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <ul className="space-y-3">
                  {solutions.map((solution, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-gray-600">
                      <ChevronRight className={`w-4 h-4 text-${color}-500`} />
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;