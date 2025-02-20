'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Droplet, Leaf, AlertCircle, Calendar, Info, Activity, Database } from 'lucide-react';
import Select from 'react-select/async';
import { toast } from 'react-toastify';
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
  const [showSystemInfo, setShowSystemInfo] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate periodic data refresh
    const refreshInterval = setInterval(() => {
      if (selectedCity) {
        toast.info('Refreshing water data...', { autoClose: 1000 });
      }
    }, 300000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [selectedCity]);

  const SystemStatus = () => (
    <div className="absolute top-4 right-4 z-10">
      <div className="relative" onMouseEnter={() => setShowSystemInfo(true)} onMouseLeave={() => setShowSystemInfo(false)}>
        <button className="p-2 rounded-full shadow-lg transition-all bg-white/90 hover:bg-white">
          <Info className="w-5 h-5 text-blue-600" />
        </button>

        {showSystemInfo && (
          <div className="absolute right-0 p-4 mt-2 w-72 bg-white rounded-xl border border-blue-100 shadow-xl">
            <h4 className="mb-3 text-lg font-semibold text-gray-900">Water Monitoring</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Water Levels</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm text-blue-600">Monitoring</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Quality Data</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm text-blue-600">Updated</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl shadow-lg animate-pulse">
      <div className="mb-4 w-12 h-12 bg-gray-200 rounded-full" />
      <div className="mb-2 w-3/4 h-4 bg-gray-200 rounded" />
      <div className="w-1/2 h-4 bg-gray-200 rounded" />
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

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <SystemStatus />
      <div className="px-4 py-6 mx-auto max-w-7xl md:py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-16">
          <div className="inline-flex gap-2 items-center px-4 py-2 mb-4 bg-blue-50 rounded-full border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-600">Live Water Data</span>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 md:text-4xl">
            Water Management Dashboard
          </h1>
          <p className="mt-3 text-sm text-gray-600 md:text-base">
            Monitor water levels and get crop recommendations
          </p>
        </div>

        <div className="mb-8">
          <Select
            cacheOptions
            loadOptions={loadOptions}
            onChange={(option: any) => {
              if (option) {
                const cityData = data.cityData[option.value];
                fetchCityData({
                  ...cityData,
                  idealWaterLevel: cityData.idealWaterLevel as "yes" | "mediocre" | "no"
                });
              }
            }}
            className="mx-auto max-w-md"
            placeholder="Search for a city..."
            styles={{
              control: (base) => ({
                ...base,
                background: 'transparent',
                borderColor: '#0000',
                borderRadius: '0.75rem',
                padding: '0.25rem'
              }),
              menu: (base) => ({
                ...base,
                zIndex: 20
              })
            }}
            defaultOptions
            isDisabled={isLoading}
          />
        </div>

        {(selectedCity || isLoading) && (
          <div className="grid gap-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => <CardSkeleton key={index} />)
              ) : (
                advisoryCards.map((card, index) => (
                  <div key={index} className={`p-6 bg-gradient-to-br ${card.bgColor} rounded-xl shadow-sm`}>
                    <div className={`mb-4 p-3 w-12 h-12 bg-white/80 rounded-lg ${card.iconColor}`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <h3 className="mb-1 text-sm font-medium text-gray-600">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{card.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    <AlertCircle className="inline-block mr-2 w-5 h-5 text-blue-600" />
                    Water Advisory
                  </h2>
                </div>
                <div className="space-y-4">
                  {isLoading ? (
                    Array(2).fill(0).map((_, index) => (
                      <div key={index} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                    ))
                  ) : selectedCity && (
                    <>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-800">{selectedCity.waterAdvisory.message}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-800">{selectedCity.waterAdvisory.conservation}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    <Leaf className="inline-block mr-2 w-5 h-5 text-blue-600" />
                    Recommended Plants
                  </h2>
                </div>
                <div className="space-y-4">
                  {isLoading ? (
                    Array(2).fill(0).map((_, index) => (
                      <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                    ))
                  ) : selectedCity && (
                    <>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="mb-3 font-medium text-gray-900">Low Water Requirements</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCity.recommendedPlants.lowWaterRequirement.map((plant) => (
                            <span key={plant} className="px-3 py-1 text-sm text-green-800 rounded-full bg-green-100/60">
                              {plant}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="mb-3 font-medium text-gray-900">High Water Requirements</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCity.recommendedPlants.highWaterRequirement.map((plant) => (
                            <span key={plant} className="px-3 py-1 text-sm text-blue-800 rounded-full bg-blue-100/60">
                              {plant}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default WaterPrediction;
