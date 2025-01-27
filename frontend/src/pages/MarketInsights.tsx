import React from 'react';
import { TrendingUp, Users, Bell } from 'lucide-react';

interface MarketInsightsProps {
  t: (key: string) => string;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ t }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          <TrendingUp className="inline-block h-6 w-6 mr-2 text-green-600" />
          {t('marketInsights.trends')}
        </h2>
        <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-gray-500">Price Trend Chart Coming Soon</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <Bell className="inline-block h-6 w-6 mr-2 text-green-600" />
            {t('marketInsights.priceAlerts')}
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((alert) => (
              <div
                key={alert}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">Wheat Price Alert</h3>
                  <p className="text-sm text-gray-500">Price increased by 5%</p>
                </div>
                <span className="text-green-600 font-medium">₹2,500/quintal</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <Users className="inline-block h-6 w-6 mr-2 text-green-600" />
            {t('marketInsights.buyerDirectory')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((buyer) => (
              <div
                key={buyer}
                className="p-4 border rounded-lg hover:border-green-500 transition-colors cursor-pointer"
              >
                <h3 className="font-medium text-gray-900">Buyer {buyer}</h3>
                <p className="text-sm text-gray-500">Local Market</p>
                <p className="text-sm text-green-600 mt-2">Active Buyer</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((summary) => (
            <div key={summary} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Market {summary}</h3>
              <p className="text-sm text-gray-500 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};