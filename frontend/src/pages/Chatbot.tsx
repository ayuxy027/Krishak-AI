import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Leaf, ChevronRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  t: (key: string) => string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const Chatbot: React.FC<ChatbotProps> = ({ t }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickActions] = useState([
    'How to treat leaf rust in wheat?',
    'Best practices for organic fertilization',
    'Current maize market trends',
    'Water conservation techniques'
  ]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'This is a simulated AI response. The actual implementation would connect to your AI backend.',
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center p-4 ml-14 space-x-2 w-max bg-gray-100 rounded-2xl"
    >
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-green-600 rounded-full delay-150 animate-pulse" />
        <div className="w-2 h-2 bg-green-600 rounded-full delay-300 animate-pulse" />
      </div>
      <span className="text-sm text-gray-600">AgriAI is analyzing...</span>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-green-50/30">
      {/* Enhanced Header */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="px-6 py-6 border-b backdrop-blur-md bg-white/80"
      >
        <div className="flex items-center mx-auto max-w-7xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Leaf className="text-green-600" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold">AgriAssist AI</h1>
              <p className="text-sm text-gray-500">Expert Agricultural Assistant</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">
        {/* Welcome Card */}
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-8 mt-12 space-y-6 bg-white rounded-3xl ring-1 shadow-lg ring-gray-900/5"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Leaf className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Hello! I'm AgriAI</h3>
                    <p className="text-gray-600">Your intelligent farming assistant</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(action)}
                    className="flex justify-between items-center p-4 bg-white rounded-xl border transition-all group hover:border-green-500 hover:shadow-md"
                  >
                    <span className="text-left">{action}</span>
                    <div className="pl-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <ChevronRight size={16} className="text-green-600" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Container */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
                  {!message.isUser && (
                    <div className="p-2 mb-4 bg-green-100 rounded-xl">
                      <Leaf className="text-green-600" size={20} />
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`max-w-2xl p-4 rounded-3xl ${
                      message.isUser
                        ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg'
                        : 'bg-white text-gray-900 shadow-md ring-1 ring-gray-900/5'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {isLoading && <TypingIndicator />}
          </AnimatePresence>
        </div>

        {/* Enhanced Input Area */}
        <motion.div
          layout
          className="sticky bottom-0 p-6 border-t backdrop-blur-md bg-white/90"
        >
          <div className="flex relative gap-4 items-center">
            <div className="relative flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chatbot.placeholder')}
                className="px-6 py-4 pr-24 w-full bg-gray-50 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:shadow-lg"
              />
              <div className="absolute right-4 top-3.5 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl hover:bg-gray-200"
                >
                  <Mic size={18} className="text-gray-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  className="p-2 text-white bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};