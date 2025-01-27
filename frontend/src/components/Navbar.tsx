import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Leaf, Brain, BarChart3, MessageSquare, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';
import { cn } from '../utils/cn';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const Navbar: React.FC<NavbarProps> = ({ language, setLanguage, t }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/disease-detection', icon: Leaf, label: t('navbar.diseaseDetection') },
    { path: '/crop-advisory', icon: Brain, label: t('navbar.cropAdvisory') },
    { path: '/market-insights', icon: BarChart3, label: t('navbar.marketInsights') },
    { path: '/chatbot', icon: MessageSquare, label: t('navbar.chatbot') },
  ];

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 shadow-md backdrop-blur-md bg-white/80">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <NavLink 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="p-2 rounded-lg transition-colors bg-primary-50 group-hover:bg-primary-100">
                <Leaf className="w-8 h-8 text-primary-600" />
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">
                Kisan AI
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:text-primary-600 hover:bg-primary-50 hover:scale-105',
                    isActive
                      ? 'text-primary-600 bg-primary-50 shadow-sm'
                      : 'text-gray-600'
                  )
                }
              >
                <item.icon className="mr-2 w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="py-2 pr-12 pl-4 text-sm bg-white rounded-lg border border-gray-200 transition-shadow appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
              <Globe2 className="absolute right-4 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex justify-center items-center p-2 text-gray-600 rounded-lg transition-colors hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-t backdrop-blur-md bg-white/95 md:hidden"
          >
            <div className="px-4 pt-3 pb-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                      'hover:text-primary-600 hover:bg-primary-50',
                      isActive
                        ? 'text-primary-600 bg-primary-50 shadow-sm'
                        : 'text-gray-600'
                    )
                  }
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 w-5 h-5" />
                    {item.label}
                  </div>
                </NavLink>
              ))}
              <div className="px-4 py-3">
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="py-2 pr-12 pl-4 w-full text-sm bg-white rounded-lg border border-gray-200 transition-shadow appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="mr">मराठी</option>
                  </select>
                  <Globe2 className="absolute right-4 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;