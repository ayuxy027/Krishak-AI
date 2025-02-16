import React, { useState, useCallback } from 'react';
import { TrendingUp, Users, Bell, DollarSign, BarChart2, Building } from 'lucide-react';
import Select from 'react-select/async';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import marketData from '../data/market.json';

interface MarketInsightsProps {
  t: (key: string) => string;
}

export const MarketInsights: React.FC<MarketInsightsProps> = () => {
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = useCallback((inputValue: string) => {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        const filteredCities = marketData.cities
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

  const fetchCityData = (cityData: any) => {
    setIsLoading(true);
    toast.info("Loading market data...", { autoClose: 1500 });

    setTimeout(() => {
      setSelectedCity(cityData);
      setIsLoading(false);
      toast.success(`Market data loaded for ${cityData.city}`, { autoClose: 2000 });
    }, 1500);
  };

  const CardSkeleton = () => (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
      <div className="mb-4 w-1/3 h-6 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
            Market Insights
          </h1>
          <p className="mt-2 text-gray-600">Real-time updates from Indian agricultural markets</p>
        </div>

        {/* City Selector */}
        <div className="px-4 mx-auto mb-8 max-w-xl sm:px-0">
          <div className="relative z-10 p-2 rounded-xl backdrop-blur-sm bg-white/20">
            <Select
              cacheOptions
              loadOptions={() => {
                const sortedCities = [...marketData.cities].sort((a, b) =>
                  a.city.localeCompare(b.city)
                );
                const options = sortedCities.map((city, index) => ({
                  value: index,
                  label: city.city
                }));
                return Promise.resolve(options);
              }}
              onChange={(option: any) => {
                if (option) {
                  fetchCityData(marketData.cities[option.value]);
                }
              }}
              className="text-base"
              placeholder="Select a city..."
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
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : selectedCity && getMarketStats(selectedCity).map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 transform hover:scale-102">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <stat.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">{stat.title}</h3>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last week
                </p>
              </div>
            </div>
          ))}
        </div>

        {(selectedCity || isLoading) && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Markets List */}
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  <Building className="inline-block mr-2 w-5 h-5 text-green-600" />
                  Local Markets
                </h2>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                  ))
                ) : (
                  selectedCity.markets.map((market: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">
                      <h3 className="font-medium text-gray-900">{market.name}</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {Object.entries(market.cropPrices).map(([crop, price], idx) => (
                          <div key={idx} className="text-sm">
                            <span className="text-gray-600">{crop}:</span>
                            {/* @ts-ignore  */}
                            <span className="ml-1 font-medium text-gray-900">{price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Price Alerts */}
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  <Bell className="inline-block mr-2 w-5 h-5 text-green-600" />
                  Price Alerts
                </h2>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  Array(2).fill(0).map((_, index) => (
                    <div key={index} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))
                ) : (
                  selectedCity.priceAlerts.map((alert: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-50 rounded-lg">
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
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default MarketInsights;