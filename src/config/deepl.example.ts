/**
 * DeepL Translation Configuration Example
 * 
 * This file shows how to enable DeepL API for SONA's translation feature.
 * DeepL provides professional-quality AI translation for any text.
 * 
 * Setup Instructions:
 * 1. Get a free DeepL API key from https://www.deepl.com/pro-api
 * 2. Copy this file to src/config/deepl.ts
 * 3. Replace 'YOUR_DEEPL_API_KEY' with your actual API key
 * 4. Import and call initializeDeepL() in your main.tsx
 * 
 * Free tier: 500,000 characters/month
 * Supported languages: EN, FR, ES, DE, PT, ZH, JA (Vietnamese may have limited support)
 */

import { setDeepLApiKey } from '../features/sona/agent'

export function initializeDeepL() {
  // Replace with your actual DeepL API key
  const apiKey = 'YOUR_DEEPL_API_KEY'
  
  // Only initialize if API key is provided and not the placeholder
  if (apiKey && apiKey !== 'YOUR_DEEPL_API_KEY') {
    setDeepLApiKey(apiKey)
    console.log('✅ DeepL translation enabled')
  } else {
    console.log('ℹ️ DeepL translation not configured - using dictionary fallback')
  }
}

/**
 * For production deployments:
 * 
 * Option 1: Environment Variables (Recommended)
 * ------------------------------------------------
 * Create a .env file:
 * VITE_DEEPL_API_KEY=your-api-key-here
 * 
 * Then use:
 * const apiKey = import.meta.env.VITE_DEEPL_API_KEY
 * 
 * 
 * Option 2: Backend Proxy (Most Secure)
 * ------------------------------------------------
 * Don't expose API keys in client-side code.
 * Create a backend endpoint that:
 * 1. Receives translation requests from frontend
 * 2. Calls DeepL API with server-side API key
 * 3. Returns translated text to frontend
 * 
 * This prevents API key exposure and allows:
 * - Rate limiting per user
 * - Usage monitoring
 * - Caching of common translations
 * - Better error handling
 * 
 * 
 * Option 3: Serverless Function
 * ------------------------------------------------
 * Use Netlify/Vercel functions:
 * - Create /.netlify/functions/translate.ts
 * - Store API key in Netlify environment variables
 * - Call function from frontend instead of DeepL directly
 */
