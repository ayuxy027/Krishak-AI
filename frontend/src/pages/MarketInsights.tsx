import React, { useState } from 'react';
import { TrendingUp, Users, Bell, DollarSign, BarChart2, Building, Database,RefreshCcw } from 'lucide-react';
import Select from 'react-select/async';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import marketData from '../data/market.json';

interface MarketInsightsProps {
  t: (key: string) => string;
}

interface MarketCropPrices {
  [key: string]: string | number;
}

interface Market {
  name: string;
  cropPrices: MarketCropPrices;
}

export const MarketInsights: React.FC<MarketInsightsProps> = () => {
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLastUpdated(new Date());
      toast.success('Market data updated successfully');
    } catch (error) {
      toast.error('Failed to update market data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCityData = async (cityData: any) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSelectedCity(cityData);
      setLastUpdated(new Date());
      toast.success(`Market data loaded for ${cityData.city}`);
    } catch (error) {
      toast.error('Failed to load market data');
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
      <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const getMarketStats = (cityData: any) => [
    {
      title: 'Daily Trading Volume',
      value: cityData.marketStats.dailyTradingVolume,
      change: '+4.5%',
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Active Buyers',
      value: cityData.marketStats.activeBuyers.toString(),
      change: '+1.2%',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Average Price per Quintal',
      value: cityData.marketStats.averagePricePerQuintal,
      change: '-0.8%',
      icon: BarChart2,
      trend: 'down',
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Status Bar */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Live</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 mx-auto max-w-7xl md:py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center md:mb-16">
          <div className="inline-flex gap-2 items-center px-4 py-2 mb-4 bg-amber-50 rounded-full border border-amber-100">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-amber-600">Live Market Updates</span>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 md:text-4xl">
            Market Insights
          </h1>
          <p className="mt-3 text-sm text-gray-600 md:mt-4 md:text-base">
            Real-time updates from Indian agricultural markets
          </p>
        </div>

        {/* City Selector */}
        <div className="px-4 mx-auto mb-8 max-w-xl md:mb-12 sm:px-0">
          <Select
            cacheOptions
            loadOptions={async (inputValue) => {
              await new Promise(resolve => setTimeout(resolve, 300));
              return marketData.cities
                .filter(city => city.city.toLowerCase().includes(inputValue.toLowerCase()))
                .map(city => ({
                  value: city.city,
                  label: city.city
                }));
            }}
            onChange={(option: any) => {
              if (option) {
                const selectedCity = marketData.cities.find(
                  city => city.city === option.value
                );
                if (selectedCity) fetchCityData(selectedCity);
              }
            }}
            isDisabled={isLoading}
            className="text-base"
            placeholder="Select a city..."
            styles={{
              control: (base) => ({
                ...base,
                background: 'rgba(255, 255, 255, 0.7)',
                borderColor: 'rgba(217, 119, 6, 0.1)',
                borderRadius: '0.75rem',
                padding: '0.25rem',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: 'rgba(217, 119, 6, 0.3)'
                }
              }),
              menu: (base) => ({
                ...base,
                zIndex: 20,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(217, 119, 6, 0.1)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }),
              option: (base, state) => ({
                ...base,
                background: state.isFocused ? 'rgba(217, 119, 6, 0.1)' : 'transparent',
                color: state.isFocused ? '#92400e' : '#374151',
                cursor: 'pointer'
              })
            }}
            defaultOptions
          />
        </div>

        {/* Market Stats */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
            {selectedCity && getMarketStats(selectedCity).map((stat, index) => (
              <div key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02] border border-amber-100/50">
                <div className="flex gap-3 items-center mb-4">
                  <div className="p-2.5 bg-amber-100 rounded-lg">
                    <stat.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{stat.title}</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-amber-600">{stat.value}</div>
                  <div className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last week
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Markets and Alerts Grid */}
        {selectedCity && !isLoading && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Markets List */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg backdrop-blur-sm border border-amber-100/50">
              <div className="flex gap-3 items-center mb-6">
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <Building className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Local Markets</h3>
              </div>

              <div className="space-y-4">
                {selectedCity.markets.map((market: Market, index: number) => (
                  <div key={index} className="p-4 rounded-lg border bg-white/50 border-amber-100/50 transition-colors hover:bg-white/70">
                    <h3 className="font-medium text-gray-900">{market.name}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {Object.entries(market.cropPrices).map(([crop, price], idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-gray-600">{crop}:</span>
                          <span className="ml-1 font-medium text-amber-600">{price.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Alerts */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg backdrop-blur-sm border border-amber-100/50">
              <div className="flex gap-3 items-center mb-6">
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <Bell className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Price Alerts</h3>
              </div>

              <div className="space-y-4">
                {selectedCity.priceAlerts.map((alert: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/50 rounded-lg transition-colors hover:bg-white/70">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <TrendingUp className={`h-5 w-5 ${alert.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{alert.crop}</h3>
                        <p className="text-sm text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{alert.price}</p>
                      <p className={`text-sm ${alert.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {alert.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex gap-2 items-center px-4 py-2 rounded-full border border-amber-100 bg-white/50">
            <Database className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-gray-600">Real-time data from Agricultural Ministry APIs</span>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        theme="light"
        closeButton={false}
        toastClassName="!rounded-xl !shadow-lg !backdrop-blur-sm"
      />
    </div>
  );
};

export default MarketInsights;