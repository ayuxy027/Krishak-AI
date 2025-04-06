"use client"

import React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  Trash2,
  X,
  Minimize2,
  Maximize2,
  Send,
  Bot,
  Tractor,
  Sprout,
  Bot as RobotIcon,
  Smartphone,
  Loader
} from "lucide-react"
import { FaRocketchat } from "react-icons/fa"
import aiService from "../ai/aiService"
import { useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism"

interface Message {
  text: string
  sender: "user" | "ai"
  animate?: boolean
  timestamp: number
  status?: "sending" | "sent" | "error"
}

interface AgriTechChatbotProps {
  darkMode: boolean
  characterLimit?: number
  cooldownDuration?: number
  language?: "en" | "es" | "fr"
  showTimer?: boolean
  showCharacterCount?: boolean
  userLocation?: string
}

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { darkMode: boolean; variant?: "primary" | "secondary" }
>(({ className = "", darkMode, variant = "primary", children, ...props }, ref) => {
  const baseStyle =
    "inline-flex items-center justify-center text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none rounded-xl"
  const variantStyles = {
    primary: darkMode
      ? "bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 focus:ring-primary-500"
      : "bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 focus:ring-primary-500",
    secondary: darkMode
      ? "bg-gray-800/90 hover:bg-gray-700/90 text-primary-300 border border-primary-700/30 hover:border-primary-600/50 focus:ring-primary-500"
      : "bg-white/90 hover:bg-gray-50/90 text-primary-700 border border-primary-200/30 hover:border-primary-300/50 focus:ring-primary-500",
  }

  return (
    <button ref={ref} className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
})

Button.displayName = "Button"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { darkMode: boolean }
>(({ className = "", darkMode, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`flex px-4 py-3 w-full text-sm rounded-xl border shadow-lg transition-all duration-300 backdrop-blur-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:border-transparent ${darkMode
        ? "bg-gray-800/90 border-primary-700/30 focus:ring-primary-500 text-primary-200"
        : "bg-white/90 border-primary-200/30 focus:ring-primary-500 text-primary-800"
        } ${className}`}
      {...props}
    />
  )
})

Input.displayName = "Input"

const ThinkingIndicator: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="flex justify-start"
  >
    <div
      className={`p-4 rounded-xl max-w-[70%] backdrop-blur-sm shadow-lg ${darkMode ? "bg-gray-800/90 text-primary-300" : "bg-white/90 text-primary-700"
        }`}
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
        className="flex gap-2 items-center text-sm font-medium"
      >
        <Loader className="w-4 h-4 animate-spin" />
        <span>Thinking</span>
      </motion.div>
    </div>
  </motion.div>
)

const translations = {
  en: {
    placeholder: "How can I help you?",
    remainingChars: "characters remaining",
    cooldownMessage: "You can send another message in",
    seconds: "seconds",
    errorEmpty: "Message cannot be empty",
    errorLimit: "Character limit exceeded",
    errorCooldown: "Please wait before sending another message",
  },
  es: {
    placeholder: "Pregunta sobre tus necesidades agrícolas...",
    remainingChars: "caracteres restantes",
    cooldownMessage: "Puedes enviar otro mensaje en",
    seconds: "segundos",
    errorEmpty: "El mensaje no puede estar vacío",
    errorLimit: "Límite de caracteres excedido",
    errorCooldown: "Por favor espera antes de enviar otro mensaje",
  },
  fr: {
    placeholder: "Comment puis-je aider avec vos besoins agricoles ?",
    remainingChars: "caractères restants",
    cooldownMessage: "Vous pouvez envoyer un autre message dans",
    seconds: "secondes",
    errorEmpty: "Le message ne peut pas être vide",
    errorLimit: "Limite de caractères dépassée",
    errorCooldown: "Veuillez patienter avant d'envoyer un autre message",
  },
}

const CustomLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const navigate = useNavigate()
  const isInternalLink = href.startsWith('/')

  const handleClick = (e: React.MouseEvent) => {
    if (isInternalLink) {
      e.preventDefault()
      navigate(href)
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="underline text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 decoration-dotted underline-offset-4"
      target={isInternalLink ? undefined : "_blank"}
      rel={isInternalLink ? undefined : "noopener noreferrer"}
    >
      {children}
    </a>
  )
}

const MarkdownMessage: React.FC<{ content: string; darkMode: boolean }> = ({ content, darkMode }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ node, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <SyntaxHighlighter
            // @ts-ignore 
            style={darkMode ? vscDarkPlus : vs}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        )
      },
      // @ts-ignore 
      a: ({ node, ...props }) => <CustomLink href={props.href || ''} {...props} />,
      h1: ({ children }) => <h1 className="mb-2 text-xl font-bold">{children}</h1>,
      h2: ({ children }) => <h2 className="mb-2 text-lg font-bold">{children}</h2>,
      ul: ({ children }) => <ul className="mb-2 list-disc list-inside">{children}</ul>,
      ol: ({ children }) => <ol className="mb-2 list-decimal list-inside">{children}</ol>,
      blockquote: ({ children }) => (
        <blockquote className="pl-4 my-2 italic border-l-4 border-primary-500">{children}</blockquote>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
)

const MessageComponent: React.FC<{ message: Message; darkMode: boolean }> = ({ message, darkMode }) => (
  <motion.div
    initial={message.animate ? { opacity: 0, y: 10 } : false}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[90%] sm:max-w-[80%] p-4 rounded-xl backdrop-blur-sm shadow-lg 
      ${message.sender === "user"
          ? darkMode
            ? "bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-primary-500/20"
            : "bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-primary-500/20"
          : darkMode
            ? "bg-gray-800/90 text-primary-300 border border-primary-700/20"
            : "bg-white/90 text-primary-700 border border-primary-200/20"
        }`}
    >
      {message.sender === "ai" ? (
        <MarkdownMessage content={message.text} darkMode={darkMode} />
      ) : (
        <div className="whitespace-pre-wrap">{message.text}</div>
      )}
    </div>
  </motion.div>
)

const QuickActions: React.FC<{ darkMode: boolean; onSelect: (action: string) => void }> = ({ darkMode, onSelect }) => {
  const actions = [
    {
      icon: <Tractor className="w-5 h-5" />,
      label: "Precision Farming",
      action: "What is precision agriculture and how can it benefit my farm?",
    },
    {
      icon: <Sprout className="w-5 h-5" />,
      label: "Smart Solutions",
      action: "Tell me about smart farming technologies for small farms",
    },
    {
      icon: <RobotIcon className="w-5 h-5" />,
      label: "Agri-Robotics",
      action: "How can I start using agricultural robots on my farm?",
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      label: "Digital Tools",
      action: "What are the essential digital farming tools for beginners?",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {actions.map(({ icon, label, action }) => (
        <motion.button
          key={label}
          onClick={() => onSelect(action)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${darkMode
            ? "border bg-gray-800/90 border-primary-700/30 hover:border-primary-600/50"
            : "border bg-white/90 border-primary-200/30 hover:border-primary-300/50"
            }`}
        >
          <motion.div
            className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${darkMode ? "bg-primary-400" : "bg-primary-500"
              }`}
          />
          <span className={`mr-3 ${darkMode ? "text-primary-300" : "text-primary-600"}`}>{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </motion.button>
      ))}
    </div>
  )
}

const AgriTechChatbot: React.FC<AgriTechChatbotProps> = ({
  darkMode,
  characterLimit = 100,
  cooldownDuration = 15,
  language = "en",
  showTimer = true,
  showCharacterCount = true,
  userLocation,
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState<number>(0)
  const [lastMessageTime, setLastMessageTime] = useState<number>(0)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const t = translations[language]

  const predefinedQuestions: string[] = [
    "Cost of precision farming",
    "Beginner automation tools",
    "Smart irrigation systems",
    "Drone technology benefits",
    "Digital farming basics",
    "ROI of modern farming",
  ]

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldown])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value
    if (newInput.length <= characterLimit) {
      setInput(newInput)
      setError(null)
    } else {
      setError(t.errorLimit)
    }
  }

  const getInputColor = () => {
    const ratio = input.length / characterLimit
    if (ratio < 0.8) return darkMode ? "text-primary-300" : "text-primary-700"
    if (ratio < 1) return "text-yellow-500"
    return "text-red-500"
  }

  const handleSendMessage = useCallback(async () => {
    if (input.trim() === "") {
      setError(t.errorEmpty)
      return
    }

    if (input.length > characterLimit) {
      setError(t.errorLimit)
      return
    }

    const currentTime = Date.now()
    if (currentTime - lastMessageTime < cooldownDuration * 1000) {
      setError(t.errorCooldown)
      return
    }

    setIsLoading(true)
    setError(null)
    const userMessage = input
    setMessages((prev) => [...prev, { text: userMessage, sender: "user", timestamp: currentTime, status: "sending" }])
    setInput("")
    setLastMessageTime(currentTime)
    setCooldown(cooldownDuration)

    try {
      let accumulatedResponse = ""

      await aiService.getAIResponse(
        userMessage,
        {
          userLanguage: language,
          userLocation,
          previousMessages: messages.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text
          }))
        },
        ({ text, done }) => {
          if (!done) {
            accumulatedResponse += text
            setCurrentStreamingMessage(accumulatedResponse)
          } else {
            setMessages(prev => [
              ...prev.slice(0, -1),
              { text: userMessage, sender: "user", timestamp: currentTime, status: "sent" },
              { text: accumulatedResponse, sender: "ai", timestamp: Date.now() }
            ])
            setCurrentStreamingMessage("")
          }
        }
      )
    } catch (error) {
      console.error("Error getting AI response:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: userMessage, sender: "user", timestamp: currentTime, status: "error" },
        {
          text: "I apologize, but I'm having trouble responding right now. Please try again.",
          sender: "ai",
          timestamp: Date.now()
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, characterLimit, cooldownDuration, lastMessageTime, t, language, userLocation, messages])

  const handleClearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const containerVariants: Variants = {
    open: (isExpanded) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      width: isExpanded ? "min(90vw, 800px)" : "min(90vw, 400px)",
      height: isExpanded ? "min(90vh, 800px)" : "min(90vh, 600px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
    closed: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 md:right-8 md:bottom-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
            custom={isExpanded}
            className={`flex flex-col overflow-hidden shadow-2xl rounded-2xl backdrop-blur-sm ${darkMode ? "bg-gray-900/95" : "bg-white/95"
              }`}
            style={{
              boxShadow: darkMode
                ? "0 25px 50px -12px rgba(16,185,129,0.25)"
                : "0 25px 50px -12px rgba(5,150,105,0.25)",
            }}
          >
            <motion.div
              drag
              dragConstraints={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              dragElastic={0.1}
              className={`flex justify-between items-center p-6 text-white rounded-t-2xl cursor-move ${darkMode
                ? "bg-gradient-to-r from-primary-600 to-primary-800"
                : "bg-gradient-to-r from-primary-600 to-primary-800"
                }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`flex justify-center items-center w-12 h-12 rounded-xl shadow-inner backdrop-blur-sm ${darkMode ? "bg-gray-800/90 text-primary-300" : "bg-white/90 text-primary-700"
                    }`}
                >
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Krishak AI</h3>
                  <p className="text-sm opacity-90">Your Agriculture Innovation Guide</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  darkMode={darkMode}
                  variant="secondary"
                  onClick={handleClearChat}
                  className="p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
                <Button
                  darkMode={darkMode}
                  variant="secondary"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  darkMode={darkMode}
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            <div className="overflow-hidden relative flex-1">
              <div
                className={`absolute inset-0 ${darkMode
                  ? "bg-gradient-to-br from-gray-900 via-gray-900 to-primary-900/10"
                  : "bg-gradient-to-br from-white via-white to-primary-50/10"
                  }`}
              />
              <div
                ref={chatContainerRef}
                className="overflow-y-auto relative p-6 space-y-6 h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 text-sm rounded-xl shadow-lg ${darkMode ? "text-red-300 bg-red-900/20" : "text-red-600 bg-red-50/90"
                      }`}
                  >
                    {error}
                  </motion.div>
                )}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <QuickActions darkMode={darkMode} onSelect={handleQuickAction} />
                  </motion.div>
                )}
                {messages.map((message, index) => (
                  <MessageComponent
                    key={index}
                    message={message}
                    darkMode={darkMode}
                  />
                ))}
                {currentStreamingMessage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-xl max-w-[80%] shadow-lg ${darkMode ? "bg-gray-800/90 text-primary-300" : "bg-white/90 text-primary-700"
                      }`}
                  >
                    <MarkdownMessage content={currentStreamingMessage} darkMode={darkMode} />
                  </motion.div>
                )}
                {isLoading && !currentStreamingMessage && <ThinkingIndicator darkMode={darkMode} />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div
              className={`relative p-6 ${darkMode
                ? "bg-gradient-to-t from-gray-900 via-gray-900 to-transparent"
                : "bg-gradient-to-t from-white via-white to-transparent"
                }`}
            >
              {showCharacterCount && (
                <div className={`mb-2 text-xs ${getInputColor()}`}>
                  {characterLimit - input.length} {t.remainingChars}
                </div>
              )}
              <div className="flex mb-4 space-x-3">
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder={t.placeholder}
                  className="flex-grow"
                  darkMode={darkMode}
                  disabled={cooldown > 0}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || cooldown > 0 || input.length > characterLimit}
                  className="p-3"
                  darkMode={darkMode}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              {showTimer && cooldown > 0 && (
                <div className={`mb-4 text-xs text-center ${darkMode ? "text-primary-300" : "text-primary-700"}`}>
                  {t.cooldownMessage} {cooldown} {t.seconds}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    onClick={() => setInput(question)}
                    className="px-4 py-2 text-xs"
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
          className={`p-4 text-white rounded-xl shadow-lg transition-all duration-300 ${darkMode
            ? "bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-600 shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
            : "bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-600 shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
            }`}
        >
          <FaRocketchat className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  )
}

export default AgriTechChatbot
