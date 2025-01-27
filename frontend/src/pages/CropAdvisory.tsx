import React from 'react';
import { Calendar, Droplets, Sun, Wind } from 'lucide-react';

interface CropAdvisoryProps {
  t: (key: string) => string;
}

export const CropAdvisory: React.FC<CropAdvisoryProps> = ({ t }) => {
  const cards = [
    {
      icon: Calendar,
      title: t('cropAdvisory.plantingSchedule'),
      content: 'Optimal planting window: March 15 - April 1',
    },
    {
      icon: Droplets,
      title: t('cropAdvisory.soilReadiness'),
      content: 'Soil moisture: Optimal for planting',
    },
    {
      icon: Sun,
      title: t('cropAdvisory.seasonalAdvice'),
      content: 'Current season: Spring planting phase',
    },
    {
      icon: Wind,
      title: t('cropAdvisory.weatherUpdates'),
      content: 'Upcoming: Light rain expected',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{card.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Regional Map</h2>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg">
            {/* Replace with actual map implementation */}
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Interactive Map Coming Soon</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fertilizer Schedule</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((week) => (
              <div key={week} className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-600">Week {week}</span>
                <span className="text-sm text-gray-500">NPK 20-20-20</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Irrigation Plan</h2>
          <div className="space-y-4">
            {['Morning', 'Evening'].map((time) => (
              <div key={time} className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-600">{time}</span>
                <span className="text-sm text-gray-500">30 minutes</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};