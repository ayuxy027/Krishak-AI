import React, { useState } from 'react';
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

  const loadOptions = (inputValue: string) => {
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
  };

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
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">💧 Water Management Dashboard</h1>
          <p className="mt-4 text-gray-600">Monitor water levels and get plant recommendations</p>
        </div>

        {/* City Selection */}
        <div className="mb-12 max-w-xl mx-auto">
          <Select
            cacheOptions
            defaultOptions
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
          />
        </div>

        {selectedCity && (
          <>
            {/* Advisory Cards */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              {advisoryCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl bg-gradient-to-br ${card.bgColor} p-8 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="p-4 rounded-full bg-white bg-opacity-30">
                    <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{card.title}</h3>
                  <p className="mt-2 text-lg font-medium text-gray-800">{card.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Water Advisory */}
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Water Advisory</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="text-gray-800">{selectedCity.waterAdvisory.message}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="text-gray-800">{selectedCity.waterAdvisory.conservation}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Plant Recommendations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Plants</h2>
                  <div className="space-y-4">
                    {selectedCity.recommendedPlants.lowWaterRequirement.length > 0 && (
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Low Water Requirements</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCity.recommendedPlants.lowWaterRequirement.map((plant) => (
                            <span key={plant} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {plant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedCity.recommendedPlants.highWaterRequirement.length > 0 && (
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">High Water Requirements</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCity.recommendedPlants.highWaterRequirement.map((plant) => (
                            <span key={plant} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {plant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default WaterPrediction;
