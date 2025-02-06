import React, { useState } from 'react';
import { Calendar, Droplets, Sun, Wind } from 'lucide-react';

interface CropAdvisoryProps {
  t: (key: string) => string;
}

export const CropAdvisory: React.FC<CropAdvisoryProps> = ({ t }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const advisoryCards = [
    {
      icon: Calendar,
      title: t('cropAdvisory.plantingSchedule'),
      content: 'Optimal planting window: March 15 - April 1',
      bgColor: 'from-green-300 to-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Droplets,
      title: t('cropAdvisory.soilReadiness'),
      content: 'Soil moisture: Optimal for planting',
      bgColor: 'from-blue-300 to-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Sun,
      title: t('cropAdvisory.seasonalAdvice'),
      content: 'Current season: Spring planting phase',
      bgColor: 'from-yellow-300 to-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      icon: Wind,
      title: t('cropAdvisory.weatherUpdates'),
      content: 'Upcoming: Light rain expected',
      bgColor: 'from-purple-300 to-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  const scheduleData = {
    fertilizer: [
      { week: 1, schedule: 'NPK 20-20-20' },
      { week: 2, schedule: 'NPK 20-20-20' },
      { week: 3, schedule: 'NPK 20-20-20' },
    ],
    irrigation: [
      { time: 'Morning', duration: '30 minutes' },
      { time: 'Afternoon', duration: '30 minutes' },
      { time: 'Evening', duration: '30 minutes' },
    ],
  };

  return (
    <div className="py-12 min-h-screen bg-gradient-to-br from-gray-100 to-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">🌾 Crop Advisory Dashboard</h1>
          <p className="mt-4 text-gray-600">Get real-time agricultural insights for better crop management</p>
        </div>

        {/* Advisory Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {advisoryCards.map((card, index) => (
            <div
              key={index}
              className={`relative rounded-xl bg-gradient-to-br ${card.bgColor} p-8 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`p-4 rounded-full bg-opacity-20 ${hoveredCard === index ? 'scale-110' : ''}`}>
                <card.icon className={`h-10 w-10 ${card.iconColor}`} />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-2 text-gray-700">{card.content}</p>
            </div>
          ))}
        </div>

        {/* Schedule Sections */}
        <div className="grid grid-cols-1 gap-12 mt-16 md:grid-cols-2">
          {/* Fertilizer Schedule */}
          <div className="overflow-hidden bg-white rounded-xl shadow-md">
            <div className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Fertilizer Schedule</h2>
              <div className="space-y-4">
                {scheduleData.fertilizer.map((item) => (
                  <div
                    key={item.week}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-lg transition-all duration-300 hover:bg-gray-200"
                  >
                    <span className="text-lg font-medium text-gray-700">Week {item.week}</span>
                    <span className="text-gray-600">{item.schedule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Irrigation Plan */}
          <div className="overflow-hidden bg-white rounded-xl shadow-md">
            <div className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Irrigation Plan</h2>
              <div className="space-y-4">
                {scheduleData.irrigation.map((item) => (
                  <div
                    key={item.time}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-lg transition-all duration-300 hover:bg-gray-200"
                  >
                    <span className="text-lg font-medium text-gray-700">{item.time}</span>
                    <span className="text-gray-600">{item.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropAdvisory;
