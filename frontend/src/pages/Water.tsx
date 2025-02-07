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

  const getStatusColor = (waterLevel: number) => {
    if (waterLevel >= 70) return {
      bg: 'from-green-300/80 to-green-100/80',
      text: 'text-green-600'
    };
    if (waterLevel >= 40) return {
      bg: 'from-yellow-300/80 to-yellow-100/80',
      text: 'text-yellow-600'
    };
    return {
      bg: 'from-red-300/80 to-red-100/80',
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

  const fetchCityData = (cityData: CityData) => {
    setIsLoading(true);
    toast.info("Loading data...", { autoClose: 1500 });
    
    setTimeout(() => {
      setSelectedCity(cityData);
      setIsLoading(false);
      toast.success(`Data loaded for ${cityData.city}`, { autoClose: 2000 });
    }, 1500);
  };

  const CardSkeleton = () => (
    <div className="p-4 rounded-xl shadow-lg animate-pulse bg-white/40 md:p-6 lg:p-8">
      <div className="mb-4 w-12 h-12 rounded-full bg-gray-200/80"></div>
      <div className="mb-2 w-1/2 h-6 rounded bg-gray-200/80"></div>
      <div className="w-3/4 h-4 rounded bg-gray-200/80"></div>
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
      bgColor: 'from-blue-300/80 to-blue-100/80',
      iconColor: 'text-blue-600',
    },
    {
      icon: Calendar,
      title: 'Last Updated',
      content: selectedCity.lastUpdated,
      bgColor: 'from-purple-300/80 to-purple-100/80',
      iconColor: 'text-purple-600',
    },
    {
      icon: Leaf,
      title: 'Conservation Status',
      content: selectedCity.waterAdvisory.status,
      bgColor: 'from-emerald-300/80 to-emerald-100/80',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="px-4 py-6 mx-auto max-w-7xl md:py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center transition-all duration-500 ease-out transform md:mb-16">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 md:text-4xl">
            Water Management Dashboard
          </h1>
          <p className="mt-3 text-sm text-gray-600 md:mt-4 md:text-base">Monitor water levels and get plant recommendations</p>
          <p className="mt-2 text-sm text-gray-600 md:mt-2 md:text-base">Data as of NITI AYOG & GSDA 2021-2023 Survey</p>
        </div>
        <div className="px-4 mx-auto mb-8 max-w-xl md:mb-12 sm:px-0">
          <div className="p-2 rounded-xl backdrop-blur-sm bg-white/20">
            <Select
              cacheOptions
              loadOptions={loadOptions}
              onChange={(option: any) => {
                if (option) {
                  // @ts-ignore 
                  fetchCityData(data.cityData[option.value]);
                }
              }}
              className="text-base md:text-lg"
              placeholder="Search for a city..."
              styles={{
                control: (base) => ({
                  ...base,
                  background: 'transparent',
                  borderColor: '#0000',
                  borderRadius: '0.75rem',
                  padding: '0.25rem'
                })
              }}
              defaultOptions
              isDisabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 lg:gap-8 md:mb-12">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : selectedCity && (
            advisoryCards.map((card, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 ease-out rounded-xl bg-gradient-to-br ${card.bgColor} p-4 md:p-6 lg:p-8 shadow-lg backdrop-blur-sm hover:scale-102`}
              >
                <div className="inline-flex p-3 rounded-full backdrop-blur-sm md:p-4 bg-white/20">
                  <card.icon className={`h-6 w-6 md:h-8 md:w-8 ${card.iconColor}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 md:mt-6 md:text-xl">{card.title}</h3>
                <p className="mt-2 text-base font-medium text-gray-800 md:text-lg">{card.content}</p>
              </div>
            ))
          )}
        </div>

        {(selectedCity || isLoading) && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <div className="p-4 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-500 ease-out transform md:p-8 bg-white/60">
              <h2 className="mb-4 text-xl font-bold text-gray-900 md:mb-6 md:text-2xl">Water Advisory</h2>
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-24 rounded bg-gray-200/80"></div>
                  <div className="h-24 rounded bg-gray-200/80"></div>
                </div>
              ) : selectedCity && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-blue-100 transition-all duration-300 transform md:p-6 bg-blue-50/40 hover:scale-101">
                    <p className="text-sm text-gray-800 md:text-base">{selectedCity.waterAdvisory.message}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-blue-100 transition-all duration-300 transform md:p-6 bg-blue-50/40 hover:scale-101">
                    <p className="text-sm text-gray-800 md:text-base">{selectedCity.waterAdvisory.conservation}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-500 ease-out transform md:p-8 bg-white/60">
              <h2 className="mb-4 text-xl font-bold text-gray-900 md:mb-6 md:text-2xl">Recommended Plants</h2>
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-32 rounded bg-gray-200/80"></div>
                  <div className="h-32 rounded bg-gray-200/80"></div>
                </div>
              ) : selectedCity && (
                <div className="space-y-4">
                  {selectedCity.recommendedPlants.lowWaterRequirement.length > 0 && (
                    <div className="p-4 rounded-lg border border-green-100 transition-all duration-300 transform md:p-6 bg-green-50/40 hover:scale-101">
                      <h3 className="mb-3 text-base font-medium text-gray-900 md:mb-4 md:text-lg">Low Water Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCity.recommendedPlants.lowWaterRequirement.map((plant) => (
                          <span
                            key={plant}
                            className="px-2 md:px-3 py-1 md:py-1.5 bg-green-100/60 text-green-800 rounded-full text-xs md:text-sm transform transition-all duration-300 hover:scale-105"
                          >
                            {plant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedCity.recommendedPlants.highWaterRequirement.length > 0 && (
                    <div className="p-4 rounded-lg border border-blue-100 transition-all duration-300 transform md:p-6 bg-blue-50/40 hover:scale-101">
                      <h3 className="mb-3 text-base font-medium text-gray-900 md:mb-4 md:text-lg">High Water Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCity.recommendedPlants.highWaterRequirement.map((plant) => (
                          <span
                            key={plant}
                            className="px-2 md:px-3 py-1 md:py-1.5 bg-blue-100/60 text-blue-800 rounded-full text-xs md:text-sm transform transition-all duration-300 hover:scale-105"
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
      <ToastContainer 
        position="top-right"
        className="toast-container"
      />
    </div>
  );
};

export default WaterPrediction;