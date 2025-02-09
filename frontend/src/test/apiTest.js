import dotenv from 'dotenv'
dotenv.config()

console.log("API_KEY:", process.env.VITE_GEMINI_API_KEY)
console.log("API_URL:", process.env.VITE_GEMINI_API_URL)
