import React, { useState } from 'react';
import { getCropAnalytics } from '../ai/cropService';
import type { 
  CropAnalyticsResponse, 
  MarketAnalysis, 
} from '../ai/cropService';
import { 
  BarChart3, 
  TrendingUp, 
  Scale, 
} from 'lucide-react';

interface CropAdvisoryProps {
  t: (key: string) => string;
}

// Indian states and major agricultural cities
const INDIAN_STATES = [
  'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 
  'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Gujarat'
];

const MAJOR_CROPS = [
  'Rice', 'Wheat', 'Cotton', 'Sugarcane', 
  'Pulses', 'Soybeans', 'Maize', 'Groundnut'
];

const CropAdvisory: React.FC<CropAdvisoryProps> = () => {
  // State Management
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<CropAnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalytics = async () => {
    if (!selectedCity || !selectedState || !selectedCrop) {
      setError('Please select all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getCropAnalytics({
        city: selectedCity,
        state: selectedState,
        cropName: selectedCrop,
        dateRange: 'current',
        options: {
          includeHistorical: true,
          logErrors: true
        }
      });
      setAnalyticsData(response);
    } catch (err) {
      setError('Failed to fetch crop analytics. Please try again.');
      console.error('Crop Analytics Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderMarketAnalysis = (data: MarketAnalysis) => (
    <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-2">
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <div className="flex gap-2 items-center mb-4">
          <BarChart3 className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-semibold">Market Overview</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Current Price</span>
            <span className="font-semibold">₹{data.summary.currentPrice}/quintal</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Trading Volume</span>
            <span className="font-semibold">{data.summary.tradingVolume} MT</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg">
        <div className="flex gap-2 items-center mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Market Sentiment</h3>
        </div>
        <div className="space-y-4">
          {data.insights.map((insight, index) => (
            <div key={index} className="pl-3 border-l-4 border-blue-500">
              <p className="text-sm font-medium">{insight.key}</p>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Crop Advisory System
          </h1>
          <p className="mt-2 text-gray-600">
            Get detailed agricultural insights and market analysis for crops across India
          </p>
        </div>

        {/* Selection Panel */}
        <div className="p-6 mb-8 bg-white rounded-xl shadow-lg">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                className="p-2 w-full rounded-md border border-gray-300"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                className="p-2 w-full rounded-md border border-gray-300"
                placeholder="Enter city name"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Crop
              </label>
              <select
                className="p-2 w-full rounded-md border border-gray-300"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option value="">Select Crop</option>
                {MAJOR_CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAnalytics}
            disabled={loading}
            className="px-4 py-2 mt-6 w-full text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {loading ? 'Analyzing...' : 'Get Crop Analysis'}
          </button>

          {error && (
            <div className="p-3 mt-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Analytics Display */}
        {analyticsData && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Market Analysis */}
            {renderMarketAnalysis(analyticsData.marketAnalysis)}

            {/* Quality Metrics */}
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="flex gap-2 items-center mb-4">
                <Scale className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Quality Grades</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(analyticsData.qualityMetrics.gradeDistribution).map(([grade, percentage]) => (
                  <div key={grade} className="flex justify-between items-center">
                    <span className="capitalize">{grade}</span>
                    <span className="font-semibold">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forecast */}
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="flex gap-2 items-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold">Price Forecast</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Next Week</span>
                  <span className="font-semibold">
                    ₹{analyticsData.forecastMetrics.priceProjection.nextWeek}/quintal
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Next Month</span>
                  <span className="font-semibold">
                    ₹{analyticsData.forecastMetrics.priceProjection.nextMonth}/quintal
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Confidence: {analyticsData.forecastMetrics.priceProjection.confidence}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropAdvisory;