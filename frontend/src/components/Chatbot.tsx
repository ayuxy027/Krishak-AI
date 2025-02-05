import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Trash2Icon, X, Minimize2, Maximize2, Send} from 'lucide-react';
import { FaRocketchat } from "react-icons/fa";
import aiService from '../ai/aiService';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface TwitterAnalyticsChatbotProps {
  darkMode: boolean;
  characterLimit?: number;
  cooldownDuration?: number;
  language?: 'en' | 'es' | 'fr';
  showTimer?: boolean;
  showCharacterCount?: boolean;
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { darkMode: boolean; variant?: 'primary' | 'secondary' }> = ({
  className = '',
  darkMode,
  variant = 'primary',
  children,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center text-sm font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-full";
  const variantStyles = {
    primary: darkMode
      ? "bg-dark-primary hover:bg-dark-secondary text-dark-background"
      : "bg-light-tertiary hover:bg-light-primary text-light-background",
    secondary: darkMode
      ? "bg-dark-background hover:bg-dark-secondary/20 text-dark-primary"
      : "bg-light-background hover:bg-light-secondary/20 text-light-tertiary"
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { darkMode: boolean }> = ({ 
  className = '', 
  darkMode, 
  ...props 
}) => {
  return (
    <input
      className={`flex px-4 py-2 w-full h-12 text-sm rounded-full border transition-all duration-300 backdrop-blur-sm placeholder:text-text-dim focus:outline-none focus:ring-2 focus:border-transparent ${
        darkMode
          ? 'bg-dark-background/80 border-dark-primary focus:ring-dark-primary text-dark-primary'
          : 'bg-light-background/80 border-light-tertiary focus:ring-light-tertiary text-light-tertiary'
      } ${className}`}
      {...props}
    />
  );
};

const ThinkingIndicator: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="flex justify-start"
  >
    <div className={`p-3 rounded-2xl max-w-[70%] ${
      darkMode
        ? 'bg-dark-background/80 text-dark-primary'
        : 'bg-light-background/80 text-light-tertiary'
    }`}>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="flex items-center text-sm font-medium"
      >
        <span className="mr-2">Thinking</span>
        <span className="flex space-x-1">
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}>.</motion.span>
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5, repeatDelay: 0.5 }}>.</motion.span>
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 1, repeatDelay: 0.5 }}>.</motion.span>
        </span>
      </motion.div>
    </div>
  </motion.div>
);

const translations = {
  en: {
    placeholder: 'How can I get started ?',
    remainingChars: 'characters remaining',
    cooldownMessage: 'You can send another message in',
    seconds: 'seconds',
    errorEmpty: 'Message cannot be empty',
    errorLimit: 'Character limit exceeded',
    errorCooldown: 'Please wait before sending another message',
  },
  es: {
    placeholder: 'Pregunta sobre tus análisis de Twitter...',
    remainingChars: 'caracteres restantes',
    cooldownMessage: 'Puedes enviar otro mensaje en',
    seconds: 'segundos',
    errorEmpty: 'El mensaje no puede estar vacío',
    errorLimit: 'Límite de caracteres excedido',
    errorCooldown: 'Por favor espera antes de enviar otro mensaje',
  },
  fr: {
    placeholder: 'Posez des questions sur vos analyses Twitter...',
    remainingChars: 'caractères restants',
    cooldownMessage: 'Vous pouvez envoyer un autre message dans',
    seconds: 'secondes',
    errorEmpty: 'Le message ne peut pas être vide',
    errorLimit: 'Limite de caractères dépassée',
    errorCooldown: 'Veuillez patienter avant d\'envoyer un autre message',
  },
};

const TwitterAnalyticsChatbot: React.FC<TwitterAnalyticsChatbotProps> = ({
  darkMode,
  characterLimit = 50,
  cooldownDuration = 30,
  language = 'en',
  showTimer = true,
  showCharacterCount = true,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  const predefinedQuestions: string[] = [
    "Best posting time",
    "Engagement metrics",
    "Content strategy",
    "Audience insights",
    "Trend analysis",
    "Performance stats",
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    if (newInput.length <= characterLimit) {
      setInput(newInput);
      setError(null);
    } else {
      setError(t.errorLimit);
    }
  };

  const getInputColor = () => {
    const ratio = input.length / characterLimit;
    if (ratio < 0.8) return darkMode ? 'text-dark-primary' : 'text-light-tertiary';
    if (ratio < 1) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleSendMessage = useCallback(async () => {
    if (input.trim() === '') {
      setError(t.errorEmpty);
      return;
    }

    if (input.length > characterLimit) {
      setError(t.errorLimit);
      return;
    }

    const currentTime = Date.now();
    if (currentTime - lastMessageTime < cooldownDuration * 1000) {
      setError(t.errorCooldown);
      return;
    }

    setIsLoading(true);
    setError(null);
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setLastMessageTime(currentTime);
    setCooldown(cooldownDuration);

    try {
      const aiResponse = await aiService.getAIResponse(userMessage);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble responding right now. Please try again.",
        sender: 'ai'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, characterLimit, cooldownDuration, lastMessageTime, t]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const containerVariants: Variants = {
    open: (isExpanded) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      width: isExpanded ? 'min(90vw, 800px)' : 'min(90vw, 400px)',
      height: isExpanded ? 'min(90vh, 800px)' : 'min(90vh, 600px)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }),
    closed: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="fixed right-2 bottom-2 z-50 sm:right-4 sm:bottom-4 md:right-8 md:bottom-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
            custom={isExpanded}
            className={`flex flex-col overflow-hidden shadow-2xl rounded-3xl backdrop-blur-sm ${
              darkMode ? 'bg-dark-background/95' : 'bg-light-background/95'
            }`}
            style={{
              boxShadow: darkMode
                ? '0 10px 25px -5px rgba(24,76,116,0.5), 0 8px 10px -6px rgba(24,76,116,0.3)'
                : '0 10px 25px -5px rgba(26,88,133,0.5), 0 8px 10px -6px rgba(26,88,133,0.3)',
            }}
          >
            <motion.div
              drag
              dragConstraints={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
              dragElastic={0.1}
              className={`flex justify-between items-center p-4 text-white rounded-t-3xl cursor-move sm:p-6 ${
                darkMode
                  ? 'bg-gradient-to-r from-dark-primary to-dark-tertiary'
                  : 'bg-gradient-to-r from-light-primary to-light-tertiary'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex justify-center items-center w-10 h-10 text-base font-bold rounded-full shadow-inner sm:w-12 sm:h-12 sm:text-lg backdrop-blur-sm ${
                  darkMode
                    ? 'bg-dark-background/80 text-dark-primary'
                    : 'bg-light-background/80 text-light-tertiary'
                }`}>
                  AI
                </div>
                <div>
                  <h3 className="text-sm font-semibold sm:text-md">Viralytics AI</h3>
                  <p className="text-xs opacity-90 sm:text-sm">Your social media optimizer</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button darkMode={darkMode} variant="secondary" onClick={handleClearChat} className="p-2 hover:bg-opacity-80">
                  <Trash2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button darkMode={darkMode} variant="secondary" onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-opacity-80">
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </Button>
                <Button darkMode={darkMode} variant="secondary" onClick={() => setIsOpen(false)} className="p-2 hover:bg-opacity-80">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </motion.div>

            <div className="overflow-hidden relative flex-1">
              <div className="absolute inset-0 bg-noise opacity-85" />
              <div className={`absolute inset-0 ${
                darkMode
                  ? 'bg-gradient-to-br from-dark-tertiary/90 via-dark-background to-dark-secondary/90'
                  : 'bg-gradient-to-br from-light-tertiary/90 via-light-background to-light-secondary/90'
              }`} />
              <div className="overflow-y-auto relative p-4 space-y-4 h-full sm:p-6">
                {error && (
                  <div className={`p-2 text-sm rounded-md ${
                    darkMode 
                      ? 'text-red-300 bg-red-900/20' 
                      : 'text-red-600 bg-red-100/20'
                  }`}>
                    {error}
                  </div>
                )}
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[90%] sm:max-w-[80%] p-2 sm:p-3 md:p-4 rounded-2xl backdrop-blur-sm shadow-lg ${
                          message.sender === 'user'
                            ? darkMode
                              ? 'bg-gradient-to-br from-dark-primary to-dark-secondary text-dark-background'
                              : 'bg-gradient-to-br from-light-primary to-light-secondary text-light-background'
                            : darkMode
                              ? 'bg-dark-background/80 text-dark-primary border border-dark-secondary/20'
                              : 'bg-light-background/80 text-light-tertiary border border-light-secondary/20'
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && <ThinkingIndicator darkMode={darkMode} />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className={`relative p-4 sm:p-6 ${
              darkMode
                ? 'bg-gradient-to-t to-transparent from-dark-background via-dark-background'
                : 'bg-gradient-to-t to-transparent from-light-background via-light-background'
            }`}>
              {showCharacterCount && (
                <div className={`mb-2 text-xs ${getInputColor()}`}>
                  {characterLimit - input.length} {t.remainingChars}
                </div>
              )}
              <div className="flex mb-4 space-x-2">
                <Input
                  // @ts-ignore 
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={t.placeholder}
                  className="flex-grow text-sm shadow-lg sm:text-base"
                  darkMode={darkMode}
                  disabled={cooldown > 0}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || cooldown > 0 || input.length > characterLimit}
                  className={`p-2 sm:p-3 shadow-lg transition-all duration-300 ${
                    darkMode
                      ? 'bg-gradient-to-r from-dark-primary to-dark-secondary hover:from-dark-secondary hover:to-dark-primary'
                      : 'bg-gradient-to-r from-light-primary to-light-secondary hover:from-light-secondary hover:to-light-primary'
                  }`}
                  darkMode={darkMode}
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
              {showTimer && cooldown > 0 && (
                <div className={`text-xs text-center ${
                  darkMode ? 'text-dark-primary' : 'text-light-tertiary'
                }`}>
                  {t.cooldownMessage} {cooldown} {t.seconds}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    onClick={() => setInput(question)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all duration-300 backdrop-blur-sm ${
                      darkMode
                        ? 'border-dark-primary/20 hover:bg-dark-background/50 hover:border-dark-primary'
                        : 'border-light-primary/20 hover:bg-light-background/50 hover:border-light-primary'
                    }`}
                    darkMode={darkMode}
                    variant="secondary"
                    disabled={cooldown > 0}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className={`p-4 text-white rounded-full shadow-lg transition-colors duration-500 ease-in-out ${
            darkMode
              ? 'bg-gradient-to-r from-dark-primary to-dark-tertiary hover:from-dark-tertiary hover:to-dark-primary'
              : 'bg-gradient-to-r from-light-primary to-light-tertiary hover:from-light-tertiary hover:to-light-primary'
          }`}
        >
          <FaRocketchat className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default TwitterAnalyticsChatbot;