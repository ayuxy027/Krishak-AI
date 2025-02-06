import React, { useState, useCallback } from 'react';
import { Droplet, Leaf, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Select from 'react-select/async';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import data from '../data/water.json';

interface CityData {
  city: string;
  state: string;
  waterLevel: number;
  idealWaterLevel: "yes" | "mediocre" | "no";
  waterQuality: string;
  lastUpdated: string;
  waterAdvisory: {
    status: string;
    message: string;
    conservation: string;
  };
  recommendedPlants: {
    lowWaterRequirement: string[];
    highWaterRequirement: string[];
  };
}

const WaterPrediction: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [_isLoading, setIsLoading] = useState(false);

  const getStatusColor = (waterLevel: number) => {
    if (waterLevel >= 70) return {
      bg: 'from-green-300 to-green-100',
      text: 'text-green-600'
    };
    if (waterLevel >= 40) return {
      bg: 'from-yellow-300 to-yellow-100',
      text: 'text-yellow-600'
    };
    return {
      bg: 'from-red-300 to-red-100',
      text: 'text-red-600'
    };
  };

  const loadOptions = useCallback((inputValue: string) => {
    return new Promise<any[]>((resolve) => {
      const filteredCities = data.cityData
        .filter((city) =>
          city.city.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((city, index) => ({
          value: index,
          label: city.city,
        }));
      resolve(filteredCities);
    });
  }, []);

  const advisoryCards = selectedCity ? [
    {
      icon: Droplet,
      title: 'Water Level',
      content: `${selectedCity.waterLevel}%`,
      bgColor: getStatusColor(selectedCity.waterLevel).bg,
      iconColor: getStatusColor(selectedCity.waterLevel).text,
    },
    {
      icon: AlertCircle,
      title: 'Water Quality',
      content: selectedCity.waterQuality,
      bgColor: 'from-blue-300 to-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Calendar,
      title: 'Last Updated',
      content: selectedCity.lastUpdated,
      bgColor: 'from-purple-300 to-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Leaf,
      title: 'Conservation Status',
      content: selectedCity.waterAdvisory.status,
      bgColor: 'from-emerald-300 to-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ] : [];

  return (
    <div className="py-12 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            💧 Water Management Dashboard
          </h1>
          <p className="mt-4 text-gray-600">Monitor water levels and get plant recommendations</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mx-auto mb-12 max-w-xl"
        >
          <div className="p-2 rounded-xl backdrop-blur-sm bg-white/30">
            <Select
              cacheOptions
              loadOptions={loadOptions}
              onChange={(option: any) => {
                setIsLoading(true);
                setTimeout(() => {
                  // @ts-ignore 
                  setSelectedCity(data.cityData[option.value]);
                  setIsLoading(false);
                  toast.success(`Loaded data for ${option.label}`);
                }, 500);
              }}
              className="text-lg"
              placeholder="Search for a city..."
              styles={{
                control: (base) => ({
                  ...base,
                  background: 'transparent',
                  borderColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '0.75rem',
                  padding: '0.25rem'
                })
              }}
              defaultOptions
            />
          </div>
        </motion.div>

        {selectedCity && (
          <motion.div layout>
            <motion.div 
              className="grid grid-cols-1 gap-8 mb-12 sm:grid-cols-2 lg:grid-cols-4"
              layout
            >
              {advisoryCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-xl bg-gradient-to-br ${card.bgColor} p-8 shadow-lg backdrop-blur-sm`}
                >
                  <div className="p-4 rounded-full backdrop-blur-sm bg-white/30">
                    <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{card.title}</h3>
                  <p className="mt-2 text-lg font-medium text-gray-800">{card.content}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 rounded-xl shadow-lg backdrop-blur-sm bg-white/70"
              >
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Water Advisory</h2>
                <motion.div layout className="space-y-4">
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-lg border border-blue-100 bg-blue-50/50"
                  >
                    <p className="text-gray-800">{selectedCity.waterAdvisory.message}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-lg border border-blue-100 bg-blue-50/50"
                  >
                    <p className="text-gray-800">{selectedCity.waterAdvisory.conservation}</p>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 rounded-xl shadow-lg backdrop-blur-sm bg-white/70"
              >
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Recommended Plants</h2>
                <motion.div layout className="space-y-4">
                  {selectedCity.recommendedPlants.lowWaterRequirement.length > 0 && (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="p-6 rounded-lg border border-green-100 bg-green-50/50"
                    >
                      <h3 className="mb-4 font-medium text-gray-900">Low Water Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCity.recommendedPlants.lowWaterRequirement.map((plant) => (
                          <motion.span
                            key={plant}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1.5 bg-green-100/80 text-green-800 rounded-full text-sm"
                          >
                            {plant}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {selectedCity.recommendedPlants.highWaterRequirement.length > 0 && (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="p-6 rounded-lg border border-blue-100 bg-blue-50/50"
                    >
                      <h3 className="mb-4 font-medium text-gray-900">High Water Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCity.recommendedPlants.highWaterRequirement.map((plant) => (
                          <motion.span
                            key={plant}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1.5 bg-blue-100/80 text-blue-800 rounded-full text-sm"
                          >
                            {plant}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default WaterPrediction;