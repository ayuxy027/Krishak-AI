import React, { useState, useCallback, useEffect } from 'react';
import { Droplet, Leaf, AlertCircle, Calendar } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStages, setLoadingStages] = useState({
    waterData: false,
    advisory: false,
    plants: false
  });

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
      setTimeout(() => {
        const filteredCities = data.cityData
          .filter((city) =>
            city.city.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((city, index) => ({
            value: index,
            label: city.city,
          }));
        resolve(filteredCities);
      }, 300);
    });
  }, []);

  const simulateDataFetch = (cityData: CityData) => {
    setIsLoading(true);
    setLoadingStages({ waterData: true, advisory: false, plants: false });

    toast.info("Fetching water data...", { autoClose: 1000 });

    setTimeout(() => {
      setLoadingStages({ waterData: true, advisory: true, plants: false });
      toast.info("Loading advisory information...", { autoClose: 1000 });

      setTimeout(() => {
        setLoadingStages({ waterData: true, advisory: true, plants: true });
        toast.info("Getting plant recommendations...", { autoClose: 1000 });

        setTimeout(() => {
          setSelectedCity(cityData);
          setIsLoading(false);
          setLoadingStages({ waterData: false, advisory: false, plants: false });
          toast.success(`Data loaded for ${cityData.city}`, { autoClose: 3000 });
        }, 1000);
      }, 600);
    }, 500);
  };

  const CardSkeleton = () => (
    <div className="p-8 rounded-xl shadow-lg animate-pulse bg-white/50">
      <div className="mb-4 w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="mb-2 w-1/2 h-6 bg-gray-200 rounded"></div>
      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
    </div>
  );

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="py-12 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center transition-all duration-500 ease-out transform">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            Water Management Dashboard
          </h1>
          <p className="mt-4 text-gray-600">Monitor water levels and get plant recommendations</p>
        </div>

        <div className="mx-auto mb-12 max-w-xl">
          <div className="p-2 rounded-xl backdrop-blur-sm bg-white/30">
            <Select
              cacheOptions
              loadOptions={loadOptions}
              onChange={(option: any) => {
                if (option) {
                  // @ts-ignore 
                  simulateDataFetch(data.cityData[option.value]);
                }
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
              isDisabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading && loadingStages.waterData ? (
            Array(4).fill(0).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : selectedCity && (
            advisoryCards.map((card, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 ease-out rounded-xl bg-gradient-to-br ${card.bgColor} p-8 shadow-lg backdrop-blur-sm hover:scale-102`}
              >
                <div className="p-4 rounded-full backdrop-blur-sm bg-white/30">
                  <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-lg font-medium text-gray-800">{card.content}</p>
              </div>
            ))
          )}
        </div>

        {(selectedCity || loadingStages.advisory) && (
          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
            <div className="p-8 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-500 ease-out transform bg-white/70">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Water Advisory</h2>
              {loadingStages.advisory ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              ) : selectedCity && (
                <div className="space-y-4">
                  <div className="p-6 rounded-lg border border-blue-100 transition-all duration-300 transform bg-blue-50/50 hover:scale-101">
                    <p className="text-gray-800">{selectedCity.waterAdvisory.message}</p>
                  </div>
                  <div className="p-6 rounded-lg border border-blue-100 transition-all duration-300 transform bg-blue-50/50 hover:scale-101">
                    <p className="text-gray-800">{selectedCity.waterAdvisory.conservation}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-500 ease-out transform bg-white/70">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Recommended Plants</h2>
              {loadingStages.plants ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ) : selectedCity && (
                <div className="space-y-4">
                  {selectedCity.recommendedPlants.lowWaterRequirement.length > 0 && (
                    <div className="p-6 rounded-lg border border-green-100 transition-all duration-300 transform bg-green-50/50 hover:scale-101">
                      <h3 className="mb-4 font-medium text-gray-900">Low Water Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCity.recommendedPlants.lowWaterRequirement.map((plant) => (
                          <span
                            key={plant}
                            className="px-3 py-1.5 bg-green-100/80 text-green-800 rounded-full text-sm transform transition-all duration-300 hover:scale-105"
                          >
                            {plant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedCity.recommendedPlants.highWaterRequirement.length > 0 && (
                    <div className="p-6 rounded-lg border border-blue-100 transition-all duration-300 transform bg-blue-50/50 hover:scale-101">
                      <h3 className="mb-4 font-medium text-gray-900">High Water Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCity.recommendedPlants.highWaterRequirement.map((plant) => (
                          <span
                            key={plant}
                            className="px-3 py-1.5 bg-blue-100/80 text-blue-800 rounded-full text-sm transform transition-all duration-300 hover:scale-105"
                          >
                            {plant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default WaterPrediction;