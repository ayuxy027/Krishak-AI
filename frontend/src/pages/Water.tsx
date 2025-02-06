import React, { useState } from 'react';
import { Droplet, Leaf, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import data from '../data/water.json';

interface CityData {
  city: string;
  state: string;
  waterLevel: number;
  idealWaterLevel: "yes" | "mediocre" | "no";
  recommendedPlants: {
    lowWaterRequirement: string[];
    highWaterRequirement: string[];
  };
}

const WaterPrediction: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  const getStatusColor = (waterLevel: number): string => {
    if (waterLevel >= 70) return "bg-green-100 text-green-600";
    if (waterLevel >= 40) return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  const getWaterLevelColor = (waterLevel: number): string => {
    if (waterLevel >= 70) return "from-green-500 to-green-600";
    if (waterLevel >= 40) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/30">
      {/* Main Content */}
      <div className="p-6 mx-auto max-w-4xl">
        {/* City Selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <select
            onChange={(e) =>
              // @ts-ignore 
              setSelectedCity(data.cityData[parseInt(e.target.value)] || null)
            }
            className="p-4 w-full bg-white rounded-xl border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a city</option>
            {data.cityData.map((city, index) => (
              <option key={city.city} value={index}>
                {city.city}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Results Display */}
        {selectedCity && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Water Level Card */}
            <div className="p-6 bg-white rounded-3xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCity.city}</h2>
                  <p className="text-gray-500">{selectedCity.state}</p>
                </div>
                <div className={`p-2 rounded-xl ${getStatusColor(selectedCity.waterLevel)}`}>
                  <Droplet size={24} />
                </div>
              </div>

              {/* Water Level Indicator */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Water Level</span>
                  <span className="text-sm font-medium">{selectedCity.waterLevel}%</span>
                </div>
                <div className="overflow-hidden h-4 bg-gray-100 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedCity.waterLevel}%` }}
                    className={`h-full bg-gradient-to-r ${getWaterLevelColor(selectedCity.waterLevel)}`}
                  />
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <Leaf size={20} className="text-green-600" />
                  <h3 className="font-semibold">Recommended Plants</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <h4 className="mb-2 font-medium">Low Water Requirements</h4>
                    <ul className="space-y-1 text-sm">
                      {selectedCity.recommendedPlants.lowWaterRequirement.map((plant) => (
                        <li key={plant}>{plant}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="mb-2 font-medium">High Water Requirements</h4>
                    <ul className="space-y-1 text-sm">
                      {selectedCity.recommendedPlants.highWaterRequirement.map((plant) => (
                        <li key={plant}>{plant}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Status Message */}
                <div
                  className={`mt-4 p-4 rounded-xl flex items-center gap-2 ${selectedCity.idealWaterLevel === "yes"
                      ? "bg-green-100"
                      : selectedCity.idealWaterLevel === "mediocre"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}
                >
                  <AlertCircle
                    size={20}
                    className={
                      selectedCity.idealWaterLevel === "yes"
                        ? "text-green-600"
                        : selectedCity.idealWaterLevel === "mediocre"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }
                  />
                  <span className="text-sm">
                    {selectedCity.idealWaterLevel === "yes"
                      ? "Water level is ideal for most plants"
                      : selectedCity.idealWaterLevel === "mediocre"
                        ? "Water level requires monitoring"
                        : "Water level is below recommended levels"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WaterPrediction;
