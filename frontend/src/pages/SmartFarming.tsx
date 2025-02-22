import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Droplets, Sun, Wind,
  TrendingUp, AlertCircle, Settings2,
  BarChart3, Cpu, Database, Info, Activity
} from 'lucide-react';
import { getModernFarmingAnalysis } from '../ai/modernFarmingService';
import type { ModernFarmingResponse } from '../ai/modernFarmingService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const techniques = [
  { id: 'hydroponics', name: 'Hydroponics', icon: Droplets },
  { id: 'vertical', name: 'Vertical Farming', icon: Leaf },
  { id: 'precision', name: 'Precision Agriculture', icon: Settings2 },
  { id: 'greenhouse', name: 'Smart Greenhouse', icon: Sun },
  { id: 'aquaponics', name: 'Aquaponics', icon: Wind }
];

const budgetOptions = [
  { value: 'low', label: 'Small Scale (< ₹5L)' },
  { value: 'medium', label: 'Medium Scale (₹5L - ₹20L)' },
  { value: 'high', label: 'Large Scale (> ₹20L)' }
];

const SmartFarming: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<'low' | 'medium' | 'high'>('medium');
  const [farmSize, setFarmSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<ModernFarmingResponse | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Refresh data every 5 minutes if analysis exists
    const refreshInterval = setInterval(() => {
      if (analysisData) {
        handleAnalysis();
      }
    }, 300000);

    return () => clearInterval(refreshInterval);
  }, [analysisData]);

  const handleAnalysis = async () => {
    if (!selectedTechnique || !farmSize) {
      toast.error('Please select technique and farm size', {
        style: {
          background: '#FF5757',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
      return;
    }

    setLoading(true);
    const analysisPromise = getModernFarmingAnalysis({
      technique: selectedTechnique,
      farmSize,
      budget: selectedBudget
    });

    toast.promise(
      analysisPromise,
      {
        loading: 'Generating farming analysis...',
        success: 'Analysis completed successfully',
        error: 'Failed to generate analysis',
      },
      {
        style: {
          minWidth: '250px',
          padding: '16px',
          borderRadius: '8px',
        },
      }
    );

    try {
      const data = await analysisPromise;
      setAnalysisData(data);
      setLoading(false);
    } catch (err) {
      console.error('Analysis Error:', err);
      setLoading(false);
    }
  };

  const SystemStatus = () => (
    <div className="absolute top-4 right-4 z-10">
      <div
        className="relative"
        onMouseEnter={() => setShowSystemInfo(true)}
        onMouseLeave={() => setShowSystemInfo(false)}
      >
        <button className="p-2 rounded-full shadow-lg transition-all bg-white/90 hover:bg-white">
          <Info className="w-5 h-5 text-blue-600" />
        </button>

        {showSystemInfo && (
          <div className="absolute right-0 p-4 mt-2 w-72 bg-white rounded-xl border border-blue-100 shadow-xl">
            <h4 className="mb-3 text-lg font-semibold text-gray-900">Smart Farming Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Analysis Engine</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Tech Database</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Updated</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">AI Model</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Online</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SystemStatus />
      <div className="px-4 py-6 mx-auto max-w-7xl md:py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center md:mb-16">
          <div className="inline-flex gap-2 items-center px-4 py-2 mb-4 bg-blue-50 rounded-full border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-600">AI-Powered Analysis</span>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 md:text-4xl">
            Smart Farming Techniques
          </h1>
          <p className="mt-3 text-sm text-gray-600 md:mt-4 md:text-base">
            Get AI-powered insights for modern farming implementation
          </p>
        </div>

        {/* Selection Panel */}
        <div className="px-4 mx-auto mb-8 max-w-xl md:mb-12 sm:px-0">
          <div className="p-6 rounded-xl border border-blue-50 shadow-sm backdrop-blur-sm bg-white/20">
            <div className="space-y-4">
              {/* Technique Selection */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {techniques.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTechnique(tech.id)}
                    className={`p-3 rounded-lg border transition-all ${selectedTechnique === tech.id
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                      }`}
                  >
                    <tech.icon className="mx-auto mb-2 w-6 h-6" />
                    <span className="text-xs font-medium">{tech.name}</span>
                  </button>
                ))}
              </div>

              {/* Farm Size Input */}
              <input
                type="text"
                placeholder="Farm Size (in acres)"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="block px-4 py-2.5 w-full rounded-lg border border-gray-200 bg-white/50 focus:border-blue-500 focus:ring-blue-500"
              />

              {/* Budget Selection */}
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value as 'low' | 'medium' | 'high')}
                className="block px-4 py-2.5 w-full rounded-lg border border-gray-200 bg-white/50 focus:border-blue-500 focus:ring-blue-500"
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Analysis Button */}
              <button
                onClick={handleAnalysis}
                disabled={loading}
                className="flex justify-center items-center px-6 py-3 w-full text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="mr-2 w-5 h-5 rounded-full border-white animate-spin border-3 border-t-transparent" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="mr-2 w-5 h-5" />
                    <span>Generate Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Display */}
        <AnimatePresence>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl shadow-lg animate-pulse">
                  <div className="mb-4 w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="mb-2 w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : analysisData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {/* Overview Card */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg">
                <div className="flex gap-3 items-center mb-4">
                  <div className="p-2.5 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {analysisData.techniqueAnalysis.overview.name}
                    </h3>
                    <p className="text-sm text-gray-600">Implementation Overview</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="p-3 rounded-lg bg-white/50">
                    <p className="text-sm text-gray-600">Estimated Cost</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{analysisData.techniqueAnalysis.overview.estimatedCost.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/50">
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="text-xl font-bold text-green-600">
                      {analysisData.techniqueAnalysis.overview.roi}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Implementation Steps */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg">
                <div className="flex gap-3 items-center mb-4">
                  <div className="p-2.5 bg-purple-100 rounded-lg">
                    <Settings2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Implementation Steps</h3>
                </div>
                <div className="mt-4 space-y-3">
                  {analysisData.implementation.phases.map((phase, index) => (
                    <div key={index} className="p-3 rounded-lg bg-white/50">
                      <p className="text-sm font-medium text-purple-600">{phase.name}</p>
                      <p className="mt-1 text-xs text-gray-500">{phase.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Card */}
              <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg">
                <div className="flex gap-3 items-center mb-4">
                  <div className="p-2.5 bg-orange-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                </div>
                <div className="mt-4">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: 'Water', value: analysisData.metrics.resourceEfficiency.water },
                        { name: 'Labor', value: analysisData.metrics.resourceEfficiency.labor },
                        { name: 'Energy', value: analysisData.metrics.resourceEfficiency.energy }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#f97316" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-8 text-center rounded-xl border backdrop-blur-sm bg-white/50 border-blue-100/50">
              <div className="inline-block p-4 mb-4 bg-blue-50 rounded-full">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-700">
                Select a technique and farm size to begin analysis
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Get AI-powered insights for implementation
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex gap-2 items-center px-4 py-2 rounded-full border border-blue-100 bg-white/50">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">Powered by Advanced AI Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFarming;