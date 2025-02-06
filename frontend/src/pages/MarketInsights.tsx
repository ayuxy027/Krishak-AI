import React from 'react';
import { TrendingUp, Users, Bell, DollarSign, BarChart2 } from 'lucide-react';
interface MarketInsightsProps {
  t: (key: string) => string;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({}) => {
  const marketStats = [
    {
      title: 'Daily Trading Volume',
      value: '₹1.2 Cr',
      change: '+4.5%',
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Active Buyers',
      value: '320',
      change: '+1.2%',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Average Price per Quintal',
      value: '₹2,800',
      change: '-0.8%',
      icon: BarChart2,
      trend: 'down',
    }
  ];

  const priceAlerts = [
    {
      crop: 'Wheat',
      change: '+3.5%',
      price: '₹2,200/quintal',
      time: '2 hours ago',
      status: 'increase',
    },
    {
      crop: 'Rice',
      change: '-1.2%',
      price: '₹3,000/quintal',
      time: '4 hours ago',
      status: 'decrease',
    },
    {
      crop: 'Tur Dal',
      change: '+2.1%',
      price: '₹6,000/quintal',
      time: '1 day ago',
      status: 'increase',
    }
  ];

  const buyers = [
    {
      name: 'Maharashtra Agro Traders',
      type: 'Local Buyer',
      status: 'Active',
      lastActive: 'Today',
      volume: '15,000 quintals',
    },
    {
      name: 'Desi Grains Pvt Ltd',
      type: 'Processor',
      status: 'Inactive',
      lastActive: '2 days ago',
      volume: '8,000 quintals',
    },
    {
      name: 'Kisan Agro Hub',
      type: 'Wholesale Distributor',
      status: 'Active',
      lastActive: 'Today',
      volume: '20,000 quintals',
    },
    {
      name: 'Fresh Harvest Exports',
      type: 'Exporter',
      status: 'Active',
      lastActive: 'Yesterday',
      volume: '12,500 quintals',
    }
  ];

  return (
    <div className="py-8 min-h-screen bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market Insights</h1>
          <p className="mt-2 text-gray-600">Real-time updates from Indian agricultural markets</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {marketStats.map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Price Alerts */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                <Bell className="inline-block mr-2 w-5 h-5 text-green-600" />
                Price Alerts
              </h2>
              <button className="text-sm font-medium text-green-600 hover:text-green-700">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {priceAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        alert.status === 'increase' ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <TrendingUp
                        className={`h-5 w-5 ${
                          alert.status === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{alert.crop}</h3>
                      <p className="text-sm text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{alert.price}</p>
                    <p
                      className={`text-sm ${
                        alert.status === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {alert.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer Directory */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                <Users className="inline-block mr-2 w-5 h-5 text-green-600" />
                Active Buyers
              </h2>
              <button className="text-sm font-medium text-green-600 hover:text-green-700">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {buyers.map((buyer, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border transition-colors cursor-pointer hover:border-green-500 group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-green-600">
                        {buyer.name}
                      </h3>
                      <p className="text-sm text-gray-500">{buyer.type}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      {buyer.status}
                    </span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">Volume: {buyer.volume}</p>
                    <p className="mt-1 text-xs text-gray-500">Last active: {buyer.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;