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
  ExternalLink,
  TrendingUp,
  Clock
} from 'lucide-react';

interface HomeProps {
  t: (key: string) => string;
}

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const StatDisplay = ({ stat }: { stat: Stat }) => (
  <div className="p-4 rounded-xl backdrop-blur-sm transition-colors duration-300 bg-white/10 hover:bg-white/15">
    <div className="flex justify-between items-center mb-1">
      <p className="text-2xl font-bold">{stat.value}</p>
      {stat.trend && (
        <span className={`flex items-center text-xs ${stat.trend > 0 ? 'text-green-300' : 'text-red-300'}`}>
          <TrendingUp className={`w-3 h-3 mr-1 ${stat.trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(stat.trend)}%
        </span>
      )}
    </div>
    <div className="flex items-center space-x-1">
      {stat.icon}
      <p className="text-xs opacity-75">{stat.label}</p>
    </div>
  </div>
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
    whileHover={{ scale: 1.01 }}
    className={`
      ${color} 
      rounded-2xl p-6 
      transition-all duration-300 
      hover:shadow-xl 
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
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
            <Icon className="flex-shrink-0 w-5 h-5" />
          </div>
          <div>
            {badge && (
              <span className="inline-block px-2 py-1 mb-2 text-xs font-medium rounded-full bg-white/20">
                {badge}
              </span>
            )}
            <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          </div>
        </div>
        {link && (
          <Link to="#" className="opacity-0 transition-all duration-300 group-hover:opacity-100">
            <motion.div whileHover={{ x: 3 }} className="p-2">
              <ExternalLink className="w-4 h-4" />
            </motion.div>
          </Link>
        )}
      </div>
      
      <p className="flex-1 max-w-lg opacity-90 text-sm/relaxed">{description}</p>
      
      {stats && (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {stats.map((stat, i) => (
            <StatDisplay key={i} stat={stat} />
          ))}
        </div>
      )}
    </div>
    
    <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none from-white/10" />
    <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-50 blur-3xl transition-opacity bg-white/10 group-hover:opacity-70" />
  </motion.div>
);

export const Home: React.FC<HomeProps> = ({ t }) => {
  const features: Feature[] = [
    {
      icon: Plant,
      title: t('home.features.diseaseDetection.title'),
      description: t('home.features.diseaseDetection.description'),
      color: 'bg-gradient-to-br from-primary-600 to-primary-800 text-white',
      size: 'large',
      badge: 'New AI Model',
      stats: [
        { 
          value: '98.2%', 
          label: 'Detection Accuracy',
          trend: 2.4,
          icon: <span className="mr-1 w-3 h-3 bg-green-400 rounded-full" />
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
      title: t('home.features.cropAdvisory.title'),
      description: t('home.features.cropAdvisory.description'),
      color: 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white',
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
      title: t('home.features.marketInsights.title'),
      description: t('home.features.marketInsights.description'),
      color: 'bg-gradient-to-br from-orange-500 to-amber-700 text-white',
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
      title: t('home.features.aiAssistant.title'),
      description: t('home.features.aiAssistant.description'),
      color: 'bg-gradient-to-br from-teal-500 to-emerald-700 text-white',
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
      title: t('home.features.community.title'),
      description: t('home.features.community.description'),
      color: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
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
      title: t('home.features.innovation.title'),
      description: t('home.features.innovation.description'),
      color: 'bg-gradient-to-br from-rose-500 to-pink-700 text-white',
      badge: 'Coming Soon',
      link: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <motion.div 
            className="inline-block mb-4"
            variants={fadeInUp}
          >
            <span className="px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
              {t('home.hero.badge')}
            </span>
          </motion.div>
          
          <motion.h1 
            className="mb-6 text-4xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r md:text-5xl lg:text-6xl from-primary-600 to-primary-400"
            variants={fadeInUp}
          >
            {t('home.hero.title')}
          </motion.h1>
          
          <motion.p 
            className="mx-auto mb-8 max-w-xl text-lg text-gray-600"
            variants={fadeInUp}
          >
            {t('home.hero.description')}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            variants={fadeInUp}
          >
            <Link
              to="/disease-detection"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-0.5"
            >
              {t('home.hero.getStarted')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/chatbot"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg shadow-gray-200/50 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t('home.hero.tryAI')}
              <MessageSquare className="ml-2 w-4 h-4" />
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