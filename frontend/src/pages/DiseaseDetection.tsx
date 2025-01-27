import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface DiseaseDetectionProps {
  t: (key: string) => string;
}

export const DiseaseDetection: React.FC<DiseaseDetectionProps> = ({ t }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setIsAnalyzing(true);
        // Simulate analysis (replace with actual API call)
        setTimeout(() => setIsAnalyzing(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
          }`}
        >
          <input {...getInputProps()} />
          {image ? (
            <div className="relative inline-block">
              <img src={image} alt="Uploaded crop" className="max-h-64 rounded" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-600">{t('diseaseDetection.dragDropText')}</p>
              <p className="text-sm text-gray-500">{t('diseaseDetection.uploadInstructions')}</p>
            </div>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      )}

      {image && !isAnalyzing && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Leaf Blight Detected</h3>
              <p className="mt-1 text-gray-500">
                Our AI has detected signs of Leaf Blight in your crop. Here are the recommended actions:
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {['chemical', 'organic', 'preventive'].map((type) => (
                <div key={type} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t(`diseaseDetection.${type}`)}
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Solution 1</li>
                    <li>• Solution 2</li>
                    <li>• Solution 3</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            {t('common.contactExpert')}
          </button>
        </div>
      )}
    </div>
  );
};