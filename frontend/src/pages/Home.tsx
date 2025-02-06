import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plane as Plant,
  Brain,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Users,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';

interface Stat {
  value: string;
  label: string;
  trend?: number;
  icon?: React.ReactNode;
}

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  size?: 'default' | 'large' | 'wide' | 'tall';
  stats?: Stat[];
  link?: boolean;
  badge?: string;
}

const StatDisplay = ({ stat }: { stat: Stat }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-4 rounded-xl shadow-sm transition-all duration-300 bg-white/95 hover:shadow-md"
  >
    <div className="flex justify-between items-center mb-2">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold text-gray-800"
      >
        {stat.value}
      </motion.p>
      {stat.trend && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${stat.trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
        >
          <TrendingUp className={`w-3 h-3 mr-1 ${stat.trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(stat.trend)}%
        </motion.span>
      )}
    </div>
    <div className="flex items-center space-x-2">
      {stat.icon}
      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
    </div>
  </motion.div>
);

const FeatureCard: React.FC<Feature & { index: number }> = ({
  icon: Icon,
  title,
  description,
  color,
  size = 'default',
  index,
  stats,
  link,
  badge
}) => (
  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          delay: index * 0.1
        }
      }
    }}
    whileHover={{ translateY: -4 }}
    className={`
      ${color} 
      rounded-2xl p-6 
      transition-all duration-300 
      shadow-lg hover:shadow-xl
      relative 
      overflow-hidden
      group
      flex flex-col
      ${size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
      ${size === 'wide' ? 'md:col-span-2' : ''}
      ${size === 'tall' ? 'md:row-span-2' : ''}
    `}
  >
    <div className="flex relative z-10 flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-3">
          <motion.div
            whileHover={{ rotate: 5 }}
            className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm"
          >
            <Icon className="w-5 h-5" />
          </motion.div>
          <div>
            {badge && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-2.5 py-1 mb-2 text-xs font-medium rounded-full bg-white/20"
              >
                {badge}
              </motion.span>
            )}
            <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          </div>
        </div>
        {link && (
          <Link
            to="#"
            className="opacity-0 transition-all duration-300 group-hover:opacity-100"
          >
            <motion.div
              whileHover={{ x: 3 }}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </Link>
        )}
      </div>

      <p className="flex-1 max-w-lg opacity-90 text-sm/relaxed">
        {description}
      </p>

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mt-6"
        >
          {stats.map((stat, i) => (
            <StatDisplay key={i} stat={stat} />
          ))}
        </motion.div>
      )}
    </div>

    <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none from-white/10" />
    <motion.div
      className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-40 blur-3xl transition-opacity duration-300 bg-white/10 group-hover:opacity-60"
    />
  </motion.div>
);

export const Home: React.FC = () => {
  const features: Feature[] = [
    {
      icon: Plant,
      title: "Early Disease Detection",
      description: "Take a photo of your crops to instantly identify diseases and get treatment recommendations",
      color: 'bg-gradient-to-br from-primary-600 to-primary-700 text-white',
      size: 'large',
      badge: 'New AI Model',
      stats: [
        {
          value: '98.2%',
          label: 'Detection Accuracy',
          trend: 2.4,
          icon: <span className="w-3 h-3 bg-green-400 rounded-full" />
        },
        {
          value: '24/7',
          label: 'Active Monitoring',
          icon: <Clock className="w-3 h-3 opacity-75" />
        },
        {
          value: '54',
          label: 'Supported Crops',
          trend: 12,
        },
        {
          value: '1.2M',
          label: 'Monthly Scans',
          trend: 8.7,
        }
      ],
      link: true
    },
    {
      icon: Brain,
      title: "Smart Crop Advisory",
      description: "Get personalized advice based on your soil, weather, and crop conditions",
      color: 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white',
      size: 'tall',
      badge: 'Beta',
      stats: [
        {
          value: '92%',
          label: 'Recommendation Accuracy',
          trend: 5.2
        },
        {
          value: '15K+',
          label: 'Active Users',
          trend: 18.3
        }
      ],
      link: true
    },
    {
      icon: BarChart3,
      title: "Market Prices",
      description: "Stay updated with real-time market prices and connect with buyers directly",
      color: 'bg-gradient-to-br from-green-600 to-green-700 text-white',
      stats: [
        {
          value: '45',
          label: 'Market Indicators',
          trend: 4.2
        }
      ],
      link: true
    },
    {
      icon: MessageSquare,
      title: "24/7 Farming Assistant",
      description: "Get instant answers to your farming questions in your preferred language",
      color: 'bg-gradient-to-br from-primary-600 to-primary-700 text-white',
      size: 'wide',
      badge: 'Popular',
      stats: [
        {
          value: '500K+',
          label: 'Queries Answered',
          trend: 15.8
        },
        {
          value: '97%',
          label: 'Satisfaction Rate',
          trend: 3.2
        }
      ],
      link: true
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow farmers and experts worldwide",
      color: 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white',
      stats: [
        {
          value: '25K+',
          label: 'Community Members',
          trend: 22.4
        }
      ],
      link: true
    },
    {
      icon: Sparkles,
      title: "Innovative Solutions",
      description: "Explore cutting-edge farming technologies and practices",
      color: 'bg-gradient-to-br from-green-600 to-green-700 text-white',
      badge: 'Coming Soon',
      link: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-medium">
              Launching Soon
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r md:text-5xl lg:text-6xl from-primary-600 to-primary-500"
          >
            Smart Farming Made Simple
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-xl text-lg text-gray-600"
          >
            Use AI to make better farming decisions, detect crop diseases early, and maximize your yield
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/crop-advisory"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/disease-detection"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg shadow-gray-200/40 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Disease Detection AI
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;