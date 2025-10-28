import { getAITipOfTheDay, getTop10AIFacts, getAIFunFacts, getAIJokes, getEducationalAITips, getNewToolsHighlights, getRandomAIContent, getSonnilLeProfile, getSonnilLeResponse, getContactResponse, getAICompassFeatures, getSanofiKnowledge, getSanofiResponse, getAICompassFeaturesResponse } from './knowledge'
import type { Msg, UserProfile, ToolResult, FeedbackEntry } from './types'

// ============= MULTILINGUAL SUPPORT =============
const SUPPORTED_LANGUAGES = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  pt: 'Portuguese',
  zh: 'Chinese',
  ja: 'Japanese',
  vi: 'Vietnamese'
} as const

type LanguageCode = keyof typeof SUPPORTED_LANGUAGES

// Translation dictionary for common phrases and system messages
const TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Hello": {
    en: "Hello",
    fr: "Bonjour",
    es: "Hola",
    de: "Hallo",
    pt: "Olá",
    zh: "你好",
    ja: "こんにちは",
    vi: "Xin chào"
  },
  "Goodbye": {
    en: "Goodbye",
    fr: "Au revoir",
    es: "Adiós",
    de: "Auf Wiedersehen",
    pt: "Adeus",
    zh: "再见",
    ja: "さようなら",
    vi: "Tạm biệt"
  },
  "Thank you": {
    en: "Thank you",
    fr: "Merci",
    es: "Gracias",
    de: "Danke",
    pt: "Obrigado",
    zh: "谢谢",
    ja: "ありがとう",
    vi: "Cảm ơn"
  },
  "Please": {
    en: "Please",
    fr: "S'il vous plaît",
    es: "Por favor",
    de: "Bitte",
    pt: "Por favor",
    zh: "请",
    ja: "お願いします",
    vi: "Vui lòng"
  },
  "Yes": {
    en: "Yes",
    fr: "Oui",
    es: "Sí",
    de: "Ja",
    pt: "Sim",
    zh: "是",
    ja: "はい",
    vi: "Vâng"
  },
  "No": {
    en: "No",
    fr: "Non",
    es: "No",
    de: "Nein",
    pt: "Não",
    zh: "不",
    ja: "いいえ",
    vi: "Không"
  },
  "Help": {
    en: "Help",
    fr: "Aide",
    es: "Ayuda",
    de: "Hilfe",
    pt: "Ajuda",
    zh: "帮助",
    ja: "ヘルプ",
    vi: "Giúp đỡ"
  },
  "Welcome": {
    en: "Welcome",
    fr: "Bienvenue",
    es: "Bienvenido",
    de: "Willkommen",
    pt: "Bem-vindo",
    zh: "欢迎",
    ja: "ようこそ",
    vi: "Chào mừng"
  },
  "Good morning": {
    en: "Good morning",
    fr: "Bonjour",
    es: "Buenos días",
    de: "Guten Morgen",
    pt: "Bom dia",
    zh: "早上好",
    ja: "おはようございます",
    vi: "Chào buổi sáng"
  },
  "Good afternoon": {
    en: "Good afternoon",
    fr: "Bon après-midi",
    es: "Buenas tardes",
    de: "Guten Tag",
    pt: "Boa tarde",
    zh: "下午好",
    ja: "こんにちは",
    vi: "Chào buổi chiều"
  },
  "Good evening": {
    en: "Good evening",
    fr: "Bonsoir",
    es: "Buenas noches",
    de: "Guten Abend",
    pt: "Boa noite",
    zh: "晚上好",
    ja: "こんばんは",
    vi: "Chào buổi tối"
  },
  "Good night": {
    en: "Good night",
    fr: "Bonne nuit",
    es: "Buenas noches",
    de: "Gute Nacht",
    pt: "Boa noite",
    zh: "晚安",
    ja: "おやすみなさい",
    vi: "Chúc ngủ ngon"
  },
  "How are you?": {
    en: "How are you?",
    fr: "Comment allez-vous?",
    es: "¿Cómo estás?",
    de: "Wie geht es Ihnen?",
    pt: "Como você está?",
    zh: "你好吗？",
    ja: "お元気ですか？",
    vi: "Bạn khỏe không?"
  },
  "I'm fine": {
    en: "I'm fine",
    fr: "Je vais bien",
    es: "Estoy bien",
    de: "Mir geht es gut",
    pt: "Estou bem",
    zh: "我很好",
    ja: "元気です",
    vi: "Tôi khỏe"
  },
  "What is your name?": {
    en: "What is your name?",
    fr: "Comment vous appelez-vous?",
    es: "¿Cómo te llamas?",
    de: "Wie heißen Sie?",
    pt: "Qual é o seu nome?",
    zh: "你叫什么名字？",
    ja: "お名前は何ですか？",
    vi: "Bạn tên gì?"
  },
  "My name is": {
    en: "My name is",
    fr: "Je m'appelle",
    es: "Me llamo",
    de: "Ich heiße",
    pt: "Meu nome é",
    zh: "我叫",
    ja: "私の名前は",
    vi: "Tên tôi là"
  },
  "Nice to meet you": {
    en: "Nice to meet you",
    fr: "Enchanté",
    es: "Encantado de conocerte",
    de: "Freut mich, Sie kennenzulernen",
    pt: "Prazer em conhecê-lo",
    zh: "很高兴见到你",
    ja: "はじめまして",
    vi: "Rất vui được gặp bạn"
  },
  "Excuse me": {
    en: "Excuse me",
    fr: "Excusez-moi",
    es: "Disculpe",
    de: "Entschuldigung",
    pt: "Com licença",
    zh: "不好意思",
    ja: "すみません",
    vi: "Xin lỗi"
  },
  "I'm sorry": {
    en: "I'm sorry",
    fr: "Je suis désolé",
    es: "Lo siento",
    de: "Es tut mir leid",
    pt: "Desculpe",
    zh: "对不起",
    ja: "ごめんなさい",
    vi: "Tôi xin lỗi"
  },
  "I don't understand": {
    en: "I don't understand",
    fr: "Je ne comprends pas",
    es: "No entiendo",
    de: "Ich verstehe nicht",
    pt: "Não entendo",
    zh: "我不明白",
    ja: "わかりません",
    vi: "Tôi không hiểu"
  },
  "Do you speak English?": {
    en: "Do you speak English?",
    fr: "Parlez-vous anglais?",
    es: "¿Hablas inglés?",
    de: "Sprechen Sie Englisch?",
    pt: "Você fala inglês?",
    zh: "你会说英语吗？",
    ja: "英語を話せますか？",
    vi: "Bạn có nói tiếng Anh không?"
  },
  "I love you": {
    en: "I love you",
    fr: "Je t'aime",
    es: "Te amo",
    de: "Ich liebe dich",
    pt: "Eu te amo",
    zh: "我爱你",
    ja: "愛しています",
    vi: "Tôi yêu bạn"
  },
  "The world is beautiful": {
    en: "The world is beautiful",
    fr: "Le monde est beau",
    es: "El mundo es hermoso",
    de: "Die Welt ist schön",
    pt: "O mundo é lindo",
    zh: "世界是美丽的",
    ja: "世界は美しい",
    vi: "Thế giới thật đẹp"
  },
  "I need help": {
    en: "I need help",
    fr: "J'ai besoin d'aide",
    es: "Necesito ayuda",
    de: "Ich brauche Hilfe",
    pt: "Preciso de ajuda",
    zh: "我需要帮助",
    ja: "助けが必要です",
    vi: "Tôi cần giúp đỡ"
  },
  "Where is": {
    en: "Where is",
    fr: "Où est",
    es: "Dónde está",
    de: "Wo ist",
    pt: "Onde está",
    zh: "在哪里",
    ja: "どこですか",
    vi: "Ở đâu"
  },
  "What time is it?": {
    en: "What time is it?",
    fr: "Quelle heure est-il?",
    es: "¿Qué hora es?",
    de: "Wie spät ist es?",
    pt: "Que horas são?",
    zh: "现在几点？",
    ja: "何時ですか？",
    vi: "Mấy giờ rồi?"
  },
  "See you later": {
    en: "See you later",
    fr: "À plus tard",
    es: "Hasta luego",
    de: "Bis später",
    pt: "Até logo",
    zh: "待会见",
    ja: "また後で",
    vi: "Hẹn gặp lại"
  },
  "Have a nice day": {
    en: "Have a nice day",
    fr: "Bonne journée",
    es: "Que tengas un buen día",
    de: "Einen schönen Tag noch",
    pt: "Tenha um bom dia",
    zh: "祝你有美好的一天",
    ja: "良い一日を",
    vi: "Chúc một ngày tốt lành"
  }
}

// MyMemory API Language Mapping (free translation API - no key required!)
const MYMEMORY_LANG_MAP: Record<LanguageCode, string> = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  de: 'de',
  pt: 'pt',
  zh: 'zh',
  ja: 'ja',
  vi: 'vi'
}

// Free Translation API using MyMemory (no API key needed!)
async function translateWithAPI(
  text: string,
  targetLang: LanguageCode,
  sourceLang: LanguageCode = 'en'
): Promise<string | null> {
  // Check if languages are supported
  const targetLangCode = MYMEMORY_LANG_MAP[targetLang]
  const sourceLangCode = MYMEMORY_LANG_MAP[sourceLang]
  
  if (!targetLangCode || !sourceLangCode) {
    return null
  }
  
  try {
    // MyMemory Translation API - Free, no API key required!
    // Limit: 1000 words/day per IP (generous for personal use)
    const encodedText = encodeURIComponent(text)
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLangCode}|${targetLangCode}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    // MyMemory returns { responseData: { translatedText: "..." } }
    if (data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText
      // Filter out common error messages
      if (translated.includes('MYMEMORY WARNING') || 
          translated.includes('YOU USED ALL AVAILABLE') ||
          translated === text) {
        return null
      }
      return translated
    }
    
    return null
  } catch (error) {
    // Silently fail and use dictionary fallback
    return null
  }
}

// Optional: DeepL API support (requires API key)
let DEEPL_API_KEY = ''

export function setDeepLApiKey(key: string) {
  DEEPL_API_KEY = key
}

async function translateWithDeepL(
  text: string,
  targetLang: LanguageCode,
  sourceLang?: LanguageCode
): Promise<string | null> {
  if (!DEEPL_API_KEY) {
    return null
  }
  
  const DEEPL_LANG_MAP: Record<LanguageCode, string> = {
    en: 'EN', fr: 'FR', es: 'ES', de: 'DE',
    pt: 'PT-PT', zh: 'ZH', ja: 'JA', vi: 'VI'
  }
  
  const targetDeepLLang = DEEPL_LANG_MAP[targetLang]
  if (!targetDeepLLang) return null
  
  try {
    const params = new URLSearchParams({
      auth_key: DEEPL_API_KEY,
      text: text,
      target_lang: targetDeepLLang,
      ...(sourceLang && DEEPL_LANG_MAP[sourceLang] ? { source_lang: DEEPL_LANG_MAP[sourceLang] } : {})
    })
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    })
    
    if (!response.ok) return null
    const data = await response.json()
    return data.translations?.[0]?.text || null
  } catch (error) {
    return null
  }
}

// Intelligent translation function with free API integration
function translateText(text: string, targetLang: LanguageCode): { 
  translation: string, 
  isKnown: boolean, 
  method: 'dictionary' | 'api' | 'unavailable',
  needsAPI?: boolean 
} {
  // Check if we have an exact match in our dictionary
  const exactMatch = TRANSLATIONS[text]
  if (exactMatch) {
    return { 
      translation: exactMatch[targetLang], 
      isKnown: true,
      method: 'dictionary'
    }
  }
  
  // Check case-insensitive match
  const lowerText = text.toLowerCase()
  for (const [key, translations] of Object.entries(TRANSLATIONS)) {
    if (key.toLowerCase() === lowerText) {
      return { 
        translation: translations[targetLang], 
        isKnown: true,
        method: 'dictionary'
      }
    }
  }
  
  // Check if text contains a known phrase (partial match fallback)
  for (const [phrase, translations] of Object.entries(TRANSLATIONS)) {
    if (lowerText.includes(phrase.toLowerCase())) {
      return { 
        translation: `${translations[targetLang]} (partial match for "${phrase}")`,
        isKnown: false,
        method: 'dictionary'
      }
    }
  }
  
  // Mark that API translation should be attempted
  return { 
    translation: '', 
    isKnown: false,
    method: 'unavailable',
    needsAPI: true
  }
}

// Async version with free API translation (MyMemory)
async function translateTextWithAPI(
  text: string, 
  targetLang: LanguageCode, 
  sourceLang: LanguageCode = 'en'
): Promise<{ 
  translation: string, 
  isKnown: boolean, 
  method: 'dictionary' | 'api' | 'deepl' | 'unavailable' 
}> {
  // First try dictionary (instant)
  const dictResult = translateText(text, targetLang)
  if (dictResult.isKnown) {
    return dictResult
  }
  
  // Try DeepL if configured (premium quality)
  try {
    const deeplTranslation = await translateWithDeepL(text, targetLang, sourceLang)
    if (deeplTranslation) {
      return {
        translation: deeplTranslation,
        isKnown: true,
        method: 'deepl'
      }
    }
  } catch (error) {
    // Continue to free API
  }
  
  // Try free MyMemory API (works for any text!)
  try {
    const apiTranslation = await translateWithAPI(text, targetLang, sourceLang)
    if (apiTranslation) {
      return {
        translation: apiTranslation,
        isKnown: true,
        method: 'api'
      }
    }
  } catch (error) {
    // Continue to fallback
  }
  
  return { 
    translation: '', 
    isKnown: false,
    method: 'unavailable'
  }
}

// Detect target language from query
function detectTargetLanguage(query: string): LanguageCode | null {
  const lowerQuery = query.toLowerCase()
  
  if (/to\s+french|in\s+french|français|en\s+français/i.test(lowerQuery)) return 'fr'
  if (/to\s+spanish|in\s+spanish|español|en\s+español/i.test(lowerQuery)) return 'es'
  if (/to\s+german|in\s+german|deutsch|auf\s+deutsch/i.test(lowerQuery)) return 'de'
  if (/to\s+portuguese|in\s+portuguese|português|em\s+português/i.test(lowerQuery)) return 'pt'
  if (/to\s+chinese|in\s+chinese|中文|用中文/i.test(lowerQuery)) return 'zh'
  if (/to\s+japanese|in\s+japanese|日本語|日本語で/i.test(lowerQuery)) return 'ja'
  if (/to\s+vietnamese|in\s+vietnamese|tiếng việt|bằng tiếng việt/i.test(lowerQuery)) return 'vi'
  if (/to\s+english|in\s+english/i.test(lowerQuery)) return 'en'
  
  return null
}

// Extract text to translate from query
function extractTextToTranslate(query: string): string | null {
  const lowerQuery = query.toLowerCase()
  
  // Pattern 1: "translate this for me to [lang]: text" or "translate this to [lang]: text"
  let match = query.match(/translate\s+(?:this|the following|text)?\s*(?:for me)?\s*(?:to|into)\s+\w+\s*[:\-]?\s*(.+)/i)
  if (match && match[1]) {
    return match[1].trim()
  }
  
  // Pattern 2: "translate 'text'" or "translate "text""
  match = query.match(/translate\s+['""](.+?)['""]|translate\s+['""](.+?)$/i)
  if (match) return match[1] || match[2]
  
  // Pattern 3: "translate: text" or "translate - text" (simple colon/dash separator)
  match = query.match(/translate[:\-]\s*(.+)/i)
  if (match && match[1]) {
    // Remove the target language from the end if present
    let text = match[1].trim()
    // Remove "to [language]" from the end
    text = text.replace(/\s+to\s+\w+\s*$/i, '').trim()
    return text
  }
  
  // Pattern 4: "translate [text] to [language]"
  match = query.match(/translate\s+(.+?)\s+(?:to|into)\s+\w+/i)
  if (match && match[1]) {
    return match[1].trim()
  }
  
  // Pattern 5: "how do you say 'text'" or "how do you say [text] in"
  match = query.match(/how\s+do\s+you\s+say\s+['""](.+?)['""]|how\s+do\s+you\s+say\s+(.+?)\s+in\s+/i)
  if (match) return match[1] || match[2]
  
  // Pattern 6: "what is 'text' in language"
  match = query.match(/what\s+is\s+['""](.+?)['""]|what's\s+['""](.+?)['""]|what\s+is\s+(.+?)\s+in\s+/i)
  if (match) return match[1] || match[2] || match[3]
  
  return null
}

// Detect language from query
function detectLanguage(query: string): LanguageCode {
  const lowerQuery = query.toLowerCase()
  
  // French indicators
  if (/bonjour|merci|s'il vous plaît|oui|non|comment|quoi|pourquoi|français|aide|outil|comparer/i.test(lowerQuery)) return 'fr'
  
  // Spanish indicators  
  if (/hola|gracias|por favor|sí|no|cómo|qué|por qué|español|ayuda|herramienta|comparar/i.test(lowerQuery)) return 'es'
  
  // German indicators
  if (/hallo|danke|bitte|ja|nein|wie|was|warum|deutsch|hilfe|werkzeug|vergleichen/i.test(lowerQuery)) return 'de'
  
  // Portuguese indicators
  if (/olá|obrigado|obrigada|por favor|sim|não|como|o que|por que|português|ajuda|ferramenta|comparar/i.test(lowerQuery)) return 'pt'
  
  // Chinese indicators (any Chinese characters)
  if (/[\u4e00-\u9fa5]/.test(query)) return 'zh'
  
  // Japanese indicators (Hiragana or Katakana)
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(query)) return 'ja'
  
  // Vietnamese indicators
  if (/xin chào|cảm ơn|vui lòng|vâng|không|làm thế nào|cái gì|tại sao|tiếng việt|giúp|công cụ|so sánh/i.test(lowerQuery)) return 'vi'
  
  return 'en'
}

// Multilingual greetings
const GREETINGS = {
  en: ["Hello! 👋", "Hi there! 😊", "Hey! 🌟", "Welcome! ✨", "Greetings! 💙"],
  fr: ["Bonjour! 👋", "Salut! 😊", "Bienvenue! ✨", "Coucou! 🌟", "Salutations! 💙"],
  es: ["¡Hola! 👋", "¡Bienvenido! ✨", "¡Saludos! 😊", "¡Hola amigo! 🌟", "¡Hola! 💙"],
  de: ["Hallo! 👋", "Willkommen! ✨", "Grüß dich! 😊", "Guten Tag! 🌟", "Hallo! 💙"],
  pt: ["Olá! 👋", "Bem-vindo! ✨", "Oi! 😊", "Saudações! 🌟", "Olá! 💙"],
  zh: ["你好！👋", "欢迎！✨", "您好！😊", "嗨！🌟", "你好！💙"],
  ja: ["こんにちは！👋", "ようこそ！✨", "やあ！😊", "こんにちは！🌟", "こんにちは！💙"],
  vi: ["Xin chào! 👋", "Chào mừng! ✨", "Chào bạn! 😊", "Xin chào! 🌟", "Xin chào! 💙"]
}

// SONA introduction in all languages
const SONA_INTRO = {
  en: "I'm SONA, your AI Compass assistant! I help you discover and navigate Sanofi's AI tools. I can recommend tools, compare options, answer questions, and even chat casually.",
  fr: "Je suis SONA, votre assistante AI Compass! Je vous aide à découvrir et naviguer parmi les outils IA de Sanofi. Je peux recommander des outils, comparer des options, répondre aux questions et même discuter de manière informelle.",
  es: "¡Soy SONA, tu asistente de AI Compass! Te ayudo a descubrir y navegar las herramientas de IA de Sanofi. Puedo recomendar herramientas, comparar opciones, responder preguntas e incluso charlar casualmente.",
  de: "Ich bin SONA, Ihre AI Compass Assistentin! Ich helfe Ihnen, die KI-Tools von Sanofi zu entdecken und zu navigieren. Ich kann Tools empfehlen, Optionen vergleichen, Fragen beantworten und sogar ungezwungen chatten.",
  pt: "Eu sou SONA, sua assistente do AI Compass! Ajudo você a descobrir e navegar pelas ferramentas de IA da Sanofi. Posso recomendar ferramentas, comparar opções, responder perguntas e até conversar casualmente.",
  zh: "我是SONA，您的AI Compass助手！我帮助您发现和导航赛诺菲的AI工具。我可以推荐工具、比较选项、回答问题，甚至随意聊天。",
  ja: "私はSONA、あなたのAI Compassアシスタントです！サノフィのAIツールを発見しナビゲートするお手伝いをします。ツールの推奨、オプションの比較、質問への回答、カジュアルなチャットもできます。",
  vi: "Tôi là SONA, trợ lý AI Compass của bạn! Tôi giúp bạn khám phá và điều hướng các công cụ AI của Sanofi. Tôi có thể đề xuất công cụ, so sánh tùy chọn, trả lời câu hỏi và thậm chí trò chuyện thoải mái."
}

const HELP_RESPONSES = {
  en: "Of course I can help! 😊 That's exactly what I'm here for!\n\nTo give you the best answer:\n\n**What would you like help with?**\n🔍 Finding an AI tool?\n⚖️ Comparing tools?\n📚 Learning about Sanofi's AI ecosystem?\n💡 Something else?\n\nJust tell me what you need!",
  fr: "Bien sûr que je peux aider! 😊 C'est exactement pour ça que je suis là!\n\nPour vous donner la meilleure réponse:\n\n**Avec quoi aimeriez-vous de l'aide?**\n🔍 Trouver un outil IA?\n⚖️ Comparer des outils?\n📚 Apprendre sur l'écosystème IA de Sanofi?\n💡 Autre chose?\n\nDites-moi simplement ce dont vous avez besoin!",
  es: "¡Por supuesto que puedo ayudar! 😊 ¡Exactamente para eso estoy aquí!\n\nPara darte la mejor respuesta:\n\n**¿Con qué te gustaría ayuda?**\n🔍 ¿Encontrar una herramienta de IA?\n⚖️ ¿Comparar herramientas?\n📚 ¿Aprender sobre el ecosistema de IA de Sanofi?\n💡 ¿Algo más?\n\n¡Solo dime lo que necesitas!",
  de: "Natürlich kann ich helfen! 😊 Genau dafür bin ich hier!\n\nUm Ihnen die beste Antwort zu geben:\n\n**Wobei möchten Sie Hilfe?**\n🔍 Ein KI-Tool finden?\n⚖️ Tools vergleichen?\n📚 Über das KI-Ökosystem von Sanofi lernen?\n💡 Etwas anderes?\n\nSagen Sie mir einfach, was Sie brauchen!",
  pt: "Claro que posso ajudar! 😊 É exatamente para isso que estou aqui!\n\nPara dar a melhor resposta:\n\n**Com o que você gostaria de ajuda?**\n🔍 Encontrar uma ferramenta de IA?\n⚖️ Comparar ferramentas?\n📚 Aprender sobre o ecossistema de IA da Sanofi?\n💡 Algo mais?\n\nApenas me diga o que você precisa!",
  zh: "当然可以帮忙！😊 这正是我在这里的原因！\n\n为了给您最好的答案：\n\n**您需要什么帮助？**\n🔍 寻找AI工具？\n⚖️ 比较工具？\n📚 了解赛诺菲的AI生态系统？\n💡 其他事情？\n\n只需告诉我您需要什么！",
  ja: "もちろん手伝えます！😊 まさにそのために私はここにいます！\n\n最適な回答をするために：\n\n**何についてお手伝いが必要ですか？**\n🔍 AIツールを見つける？\n⚖️ ツールを比較する？\n📚 サノフィのAIエコシステムについて学ぶ？\n💡 その他？\n\n必要なことを教えてください！",
  vi: "Tất nhiên tôi có thể giúp! 😊 Đó chính xác là lý do tôi ở đây!\n\nĐể đưa ra câu trả lời tốt nhất:\n\n**Bạn muốn được giúp đỡ về điều gì?**\n🔍 Tìm công cụ AI?\n⚖️ So sánh công cụ?\n📚 Tìm hiểu về hệ sinh thái AI của Sanofi?\n💡 Điều gì khác?\n\nChỉ cần cho tôi biết bạn cần gì!"
}

const THANKS_RESPONSES = {
  en: ["You're welcome! 😊", "Happy to help! 💙", "Anytime! ✨", "My pleasure! 🌟"],
  fr: ["De rien! 😊", "Avec plaisir! 💙", "À tout moment! ✨", "Mon plaisir! 🌟"],
  es: ["¡De nada! 😊", "¡Encantado de ayudar! 💙", "¡Cuando quieras! ✨", "¡Un placer! 🌟"],
  de: ["Gern geschehen! 😊", "Gerne! 💙", "Jederzeit! ✨", "Mit Vergnügen! 🌟"],
  pt: ["De nada! 😊", "Feliz em ajudar! 💙", "Sempre! ✨", "Meu prazer! 🌟"],
  zh: ["不客气！😊", "很高兴帮助您！💙", "随时！✨", "我的荣幸！🌟"],
  ja: ["どういたしまして！😊", "お役に立てて嬉しいです！💙", "いつでも！✨", "どうぞ！🌟"],
  vi: ["Không có gì! 😊", "Vui lòng được giúp đỡ! 💙", "Bất cứ lúc nào! ✨", "Rất vui! 🌟"]
}

const GOODBYE_RESPONSES = {
  en: ["Goodbye! 👋", "See you later! ✨", "Take care! 💙", "Bye! 😊"],
  fr: ["Au revoir! 👋", "À bientôt! ✨", "Prenez soin de vous! 💙", "Salut! 😊"],
  es: ["¡Adiós! 👋", "¡Hasta luego! ✨", "¡Cuídate! 💙", "¡Chao! 😊"],
  de: ["Auf Wiedersehen! 👋", "Bis später! ✨", "Pass auf dich auf! 💙", "Tschüss! 😊"],
  pt: ["Adeus! 👋", "Até logo! ✨", "Se cuida! 💙", "Tchau! 😊"],
  zh: ["再见！👋", "待会见！✨", "保重！💙", "拜拜！😊"],
  ja: ["さようなら！👋", "また後で！✨", "お大事に！💙", "バイバイ！😊"],
  vi: ["Tạm biệt! 👋", "Hẹn gặp lại! ✨", "Bảo trọng! 💙", "Bye! 😊"]
}

// ============= END MULTILINGUAL SUPPORT =============

// Machine Learning: Extract patterns from queries for learning
function extractQueryPatterns(query: string): string[] {
  const patterns: string[] = []
  const lowerQuery = query.toLowerCase()
  
  // Extract intent patterns
  if (/recommend|suggest|find|need|want/i.test(query)) patterns.push('intent:recommendation')
  if (/compare|vs|versus|difference/i.test(query)) patterns.push('intent:comparison')
  if (/how|what|why|when|where/i.test(query)) patterns.push('intent:question')
  
  // Extract domain patterns
  const domains = ['productivity', 'writing', 'data', 'collaboration', 'analysis', 'creative', 'medical', 'research', 'manufacturing', 'finance']
  domains.forEach(domain => {
    if (lowerQuery.includes(domain)) patterns.push(`domain:${domain}`)
  })
  
  // Extract action patterns
  const actions = ['tool', 'help', 'show', 'tell', 'explain', 'list']
  actions.forEach(action => {
    if (lowerQuery.includes(action)) patterns.push(`action:${action}`)
  })
  
  return patterns
}

// Typo correction and fuzzy matching helper
function normalizeQuery(query: string): string {
  let normalized = query.toLowerCase().trim()
  
  // Common typos and variations
  const typoMap: Record<string, string> = {
    // Tool names
    'chatgpt': 'chatgpt',
    'chat gpt': 'chatgpt',
    'gpt': 'chatgpt',
    'chatbot': 'chatgpt',
    'copilot': 'microsoft copilot',
    'co-pilot': 'microsoft copilot',
    'github copilot': 'copilot',
    'claude': 'claude',
    'claud': 'claude',
    'gemini': 'gemini',
    'google gemini': 'gemini',
    'bard': 'gemini',
    'concierge': 'concierge',
    'conciege': 'concierge',
    'consierge': 'concierge',
    'newton': 'newton',
    'newtown': 'newton',
    'medis': 'medis',
    'mediss': 'medis',
    'plai': 'plai',
    'play': 'plai',
    
    // Common actions/intents
    'recomend': 'recommend',
    'reccomend': 'recommend',
    'rekommend': 'recommend',
    'sugest': 'suggest',
    'sugguest': 'suggest',
    'compair': 'compare',
    'compar': 'compare',
    'comparision': 'comparison',
    'analitics': 'analytics',
    'analitycs': 'analytics',
    'analyitics': 'analytics',
    'dashbord': 'dashboard',
    'dashbaord': 'dashboard',
    'dashborad': 'dashboard',
    
    // Common phrases
    'wht': 'what',
    'wat': 'what',
    'whats': 'what is',
    'whts': 'what is',
    'hows': 'how is',
    'hw': 'how',
    'hlp': 'help',
    'plz': 'please',
    'pls': 'please',
    'thx': 'thanks',
    'ty': 'thank you',
    'ur': 'your',
    'u': 'you',
    'r': 'are',
    'y': 'why',
    'bc': 'because',
    'abt': 'about',
    
    // Domain/purpose keywords
    'productivty': 'productivity',
    'producivity': 'productivity',
    'colaboration': 'collaboration',
    'collab': 'collaboration',
    'colaborate': 'collaborate',
    'writting': 'writing',
    'writng': 'writing',
    'reserch': 'research',
    'reasearch': 'research',
    'medecine': 'medicine',
    'medicin': 'medicine',
    'analize': 'analyze',
    'analyz': 'analyze',
    'analise': 'analyze'
  }
  
  // Replace typos with corrections
  Object.entries(typoMap).forEach(([typo, correction]) => {
    const regex = new RegExp(`\\b${typo}\\b`, 'gi')
    normalized = normalized.replace(regex, correction)
  })
  
  // Fix common grammatical patterns
  normalized = normalized
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\s+([.,!?])/g, '$1') // Remove space before punctuation
    .replace(/([.,!?])([a-z])/gi, '$1 $2') // Add space after punctuation
    .replace(/\bi\b/g, 'I') // Lowercase 'i' to 'I'
    .trim()
  
  return normalized
}

// Machine Learning: Store feedback for learning
export function storeFeedback(query: string, response: string, feedback: 'positive' | 'negative', toolUsed?: string): FeedbackEntry {
  const feedbackEntry: FeedbackEntry = {
    query,
    response,
    feedback,
    timestamp: new Date().toISOString(),
    toolUsed,
    context: extractQueryPatterns(query).join(', ')
  }
  
  // Store in localStorage for persistence
  const existingFeedback = JSON.parse(localStorage.getItem('sona_feedback_history') || '[]') as FeedbackEntry[]
  existingFeedback.push(feedbackEntry)
  
  // Keep only last 100 entries to avoid storage bloat
  if (existingFeedback.length > 100) {
    existingFeedback.shift()
  }
  
  localStorage.setItem('sona_feedback_history', JSON.stringify(existingFeedback))
  
  // Update learning model
  updateLearningModel(feedbackEntry)
  
  return feedbackEntry
}

// Machine Learning: Update the learning model based on feedback
function updateLearningModel(feedback: FeedbackEntry): void {
  const model = getLearningModel()
  const patterns = extractQueryPatterns(feedback.query)
  
  patterns.forEach(pattern => {
    if (feedback.feedback === 'positive') {
      model.successfulPatterns.set(pattern, (model.successfulPatterns.get(pattern) || 0) + 1)
    } else {
      model.failedPatterns.set(pattern, (model.failedPatterns.get(pattern) || 0) + 1)
    }
  })
  
  model.totalFeedback++
  if (feedback.feedback === 'positive') {
    model.positiveCount++
  } else {
    model.negativeCount++
  }
  
  saveLearningModel(model)
}

// Machine Learning: Get current learning model
function getLearningModel(): { successfulPatterns: Map<string, number>, failedPatterns: Map<string, number>, totalFeedback: number, positiveCount: number, negativeCount: number } {
  const stored = localStorage.getItem('sona_learning_model')
  if (stored) {
    const parsed = JSON.parse(stored)
    return {
      successfulPatterns: new Map(Object.entries(parsed.successfulPatterns || {})),
      failedPatterns: new Map(Object.entries(parsed.failedPatterns || {})),
      totalFeedback: parsed.totalFeedback || 0,
      positiveCount: parsed.positiveCount || 0,
      negativeCount: parsed.negativeCount || 0
    }
  }
  return {
    successfulPatterns: new Map(),
    failedPatterns: new Map(),
    totalFeedback: 0,
    positiveCount: 0,
    negativeCount: 0
  }
}

// Machine Learning: Save learning model
function saveLearningModel(model: { successfulPatterns: Map<string, number>, failedPatterns: Map<string, number>, totalFeedback: number, positiveCount: number, negativeCount: number }): void {
  const toSave = {
    successfulPatterns: Object.fromEntries(model.successfulPatterns),
    failedPatterns: Object.fromEntries(model.failedPatterns),
    totalFeedback: model.totalFeedback,
    positiveCount: model.positiveCount,
    negativeCount: model.negativeCount
  }
  localStorage.setItem('sona_learning_model', JSON.stringify(toSave))
}

// Machine Learning: Get confidence score for a query pattern
export function getConfidenceScore(query: string): number {
  const model = getLearningModel()
  if (model.totalFeedback === 0) return 0.5 // Neutral if no feedback yet
  
  const patterns = extractQueryPatterns(query)
  let positiveScore = 0
  let negativeScore = 0
  
  patterns.forEach(pattern => {
    positiveScore += model.successfulPatterns.get(pattern) || 0
    negativeScore += model.failedPatterns.get(pattern) || 0
  })
  
  const total = positiveScore + negativeScore
  if (total === 0) return model.positiveCount / model.totalFeedback // Overall average
  
  return positiveScore / total
}

// Machine Learning: Get learning insights
export function getLearningInsights(): { accuracy: number, totalFeedback: number, topSuccessPatterns: string[], topFailPatterns: string[] } {
  const model = getLearningModel()
  
  const accuracy = model.totalFeedback > 0 ? model.positiveCount / model.totalFeedback : 0
  
  const sortedSuccess = Array.from(model.successfulPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pattern]) => pattern)
  
  const sortedFail = Array.from(model.failedPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pattern]) => pattern)
  
  return {
    accuracy,
    totalFeedback: model.totalFeedback,
    topSuccessPatterns: sortedSuccess,
    topFailPatterns: sortedFail
  }
}

// Simulate streaming effect for responses
export async function* streamResponse(response: string) {
  const words = response.split(/(\s+)/) // Split by spaces, keeping them
  for (let i = 0; i < words.length; i++) {
    yield words.slice(0, i + 1).join('')
    await new Promise(resolve => setTimeout(resolve, 20)) // Adjust delay for speed
  }
}

// Decide if a tool call is needed based on user input
export function decideToolCall(query: string, tools: any[]): { toolName: string, toolInput: any } | null {
  // Normalize query to handle typos and grammatical issues
  const normalizedQuery = normalizeQuery(query)
  const lowerQuery = normalizedQuery.toLowerCase()
  
  // === HANDLE SUGGESTED QUERIES FIRST ===
  // These are exact phrases SONA suggests - they must work!
  
  // "show me creative tools" / "show me [category] tools"
  if (/show\s+me\s+(creative|cool|awesome|innovative|new|latest|popular)\s+tools/i.test(lowerQuery)) {
    return { toolName: 'recommendTool', toolInput: { query: 'creative image generation writing innovative' } }
  }
  
  // "What tool is good for productivity?"
  if (/what\s+tool\s+is\s+(good|best)\s+for\s+productivity/i.test(lowerQuery)) {
    return { toolName: 'recommendTool', toolInput: { query: 'productivity collaboration workplace office' } }
  }
  
  // "Find me a tool for data analysis"
  if (/find\s+me\s+an?\s+tool\s+for\s+data\s+analysis/i.test(lowerQuery)) {
    return { toolName: 'recommendTool', toolInput: { query: 'data analysis analytics visualization' } }
  }
  
  // "Recommend something for collaboration"
  if (/recommend\s+something\s+for\s+collaboration/i.test(lowerQuery)) {
    return { toolName: 'recommendTool', toolInput: { query: 'collaboration teamwork meeting communication' } }
  }
  
  // === END SUGGESTED QUERIES ===
  
  // 0. Check for Analytics Dashboard queries first (before comparison logic)
  // Users asking about "analytics" likely want the Analytics dashboard, not tool comparison
  if ((lowerQuery.includes('analytics') || lowerQuery.includes('dashboard') || lowerQuery.includes('metrics')) && 
      !lowerQuery.match(/compare\s+\w+\s+(and|vs|versus)\s+\w+/i)) {
    // Only treat as dashboard query if they're not explicitly comparing named tools
    // e.g., "analytics" → dashboard, but "compare ChatGPT and Claude for analytics" → comparison
    return null // Let it fall through to generateIntelligentResponse
  }
  
  // 1. Comparison requests (check first to avoid false matches)
  if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('versus') || lowerQuery.includes('difference between')) {
    const mentionedTools = tools.filter(tool => lowerQuery.includes(tool.name.toLowerCase()))
    if (mentionedTools.length >= 2) {
      return { toolName: 'compareTools', toolInput: { toolIds: mentionedTools.map(t => t.name) } }
    } else if (mentionedTools.length === 1) {
      // If only one tool mentioned, provide info about it
      return { toolName: mentionedTools[0].name, toolInput: { query } }
    } else {
      // Check for "all internal tools" or "all external tools"
      if (/compare\s+(all\s+)?(internal|sanofi|in-house|internal-only)\s+tools?/i.test(lowerQuery)) {
        const internalTools = tools.filter(tool => tool.type === 'internal')
        if (internalTools.length > 0) {
          return { toolName: 'compareTools', toolInput: { toolIds: internalTools.map(t => t.name), category: 'internal' } }
        }
      }
      
      if (/compare\s+(all\s+)?(external|third-party|public)\s+tools?/i.test(lowerQuery)) {
        const externalTools = tools.filter(tool => tool.type === 'external')
        if (externalTools.length > 0) {
          return { toolName: 'compareTools', toolInput: { toolIds: externalTools.map(t => t.name), category: 'external' } }
        }
      }
      
      // Check if user is asking to compare tools by category/purpose
      // e.g., "compare productivity tools" or "compare tools for research"
      // BUT exclude "analytics" as a category since that's usually about the dashboard
      const categories = [
        'productivity', 'research', 'medical', 'compliance', 'creative', 'data', 
        'manufacturing', 'writing', 'collaboration', 'scientific', 'analytics',
        'document', 'documentation', 'code', 'coding', 'programming',
        'image', 'video', 'audio', 'design', 'chat', 'conversation'
      ]
      const matchedCategory = categories.find(cat => lowerQuery.includes(cat))
      
      if (matchedCategory) {
        // Find tools matching this category
        const categoryTools = tools.filter(tool => {
          const searchFields = [
            tool.name?.toLowerCase() || '',
            tool.primaryPurpose?.toLowerCase() || '',
            tool.bestUseCase?.toLowerCase() || '',
            tool.targetUsers?.toLowerCase() || '',
            tool.modules?.toLowerCase() || '',
            ...(tool.tags || []).map((t: string) => t.toLowerCase())
          ].join(' ')
          return searchFields.includes(matchedCategory)
        })
        
        if (categoryTools.length >= 2) {
          // Return all matching tools for comparison (no limit for category comparisons)
          return { toolName: 'compareTools', toolInput: { toolIds: categoryTools.map(t => t.name), category: matchedCategory } }
        }
      }
    }
  }
  
  // 2. Recommendation requests - Enhanced natural language understanding
  // Check for tool-related keywords that indicate a recommendation request
  const hasToolKeyword = /\b(tool|app|application|software|platform|solution|service)s?\b/i.test(normalizedQuery)
  const hasActionKeyword = /\b(recommend|suggest|find|need|want|looking|search|show|get|good|best|which|what)\b/i.test(normalizedQuery)
  const hasPurposeKeyword = /\b(for|to|that|with|about|in)\b/i.test(normalizedQuery)
  
  // If it looks like a tool request, treat it as a recommendation
  if ((hasToolKeyword && hasActionKeyword) || 
      (hasActionKeyword && hasPurposeKeyword && normalizedQuery.split(/\s+/).length <= 10)) {
    return { toolName: 'recommendTool', toolInput: { query: normalizedQuery } }
  }
  
  // 3. Explicit tool requests by name
  const toolMatch = tools.find(tool => lowerQuery.includes(tool.name.toLowerCase()))
  if (toolMatch) {
    return { toolName: toolMatch.name, toolInput: { query: normalizedQuery } }
  }
  
  // 4. Sanofi-related queries
  if (lowerQuery.includes('sanofi') || lowerQuery.includes('news') || lowerQuery.includes('pipeline') || lowerQuery.includes('stock')) {
    return { toolName: 'getSanofiInfo', toolInput: { query: normalizedQuery } }
  }
  
  // 5. AI Compass platform queries
  if (lowerQuery.includes('compass feature') || lowerQuery.includes('how to use') || lowerQuery.includes('dark mode') || lowerQuery.includes('language')) {
    return { toolName: 'getAICompassFeatures', toolInput: { query: normalizedQuery } }
  }
  
  // 6. Sonnil Le queries
  if (lowerQuery.includes('sonnil') || lowerQuery.includes('le') || lowerQuery.includes('creator') || lowerQuery.includes('developer')) {
    return { toolName: 'getSonnilLeInfo', toolInput: { query: normalizedQuery } }
  }
  
  // 7. Contact/Help queries
  if (lowerQuery.includes('contact') || lowerQuery.includes('help') || lowerQuery.includes('support')) {
    return { toolName: 'getContactInfo', toolInput: { query: normalizedQuery } }
  }
  
  // 8. Fun/Educational content
  if (lowerQuery.includes('fact') || lowerQuery.includes('joke') || lowerQuery.includes('tip')) {
    if (lowerQuery.includes('fact')) return { toolName: 'getFunFact', toolInput: {} }
    if (lowerQuery.includes('joke')) return { toolName: 'getAIJoke', toolInput: {} }
    if (lowerQuery.includes('tip')) return { toolName: 'getAITip', toolInput: {} }
  }
  
  return null
}

// Execute a tool call and return the result
export async function executeTool(toolName: string, toolInput: any, tools: any[], userProfile: UserProfile): Promise<ToolResult> {
  try {
    switch (toolName) {
      case 'recommendTool': {
        // Extract keywords intelligently by removing common filler words
        const fillerWords = /\b(recommend|suggest|what|which|best|good|great|tool|tools|for|a|an|the|find|me|something|anything|need|looking|help|with|want|to|can|you|show|is|are|some|any|that|this|about|in|on|at|of|i|my|your)\b/gi
        const keywords = toolInput.query
          .replace(fillerWords, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase()
        
        // Search across multiple fields for better matching
        const recommended = tools
          .filter(tool => {
            const searchFields = [
              tool.name?.toLowerCase() || '',
              tool.primaryPurpose?.toLowerCase() || '',
              tool.bestUseCase?.toLowerCase() || '',
              tool.targetUsers?.toLowerCase() || '',
              tool.technology?.toLowerCase() || '',
              ...(tool.tags || []).map((t: string) => t.toLowerCase())
            ].join(' ')
            
            // Match any keyword (even single words)
            if (!keywords) return false
            const keywordsList = keywords.split(/\s+/).filter(k => k.length > 1)
            
            // Return true if any keyword matches
            return keywordsList.length > 0 && keywordsList.some(keyword => searchFields.includes(keyword))
          })
          .slice(0, 5)
        
        return { ok: true, data: recommended }
      }
      case 'compareTools': {
        const compared = tools.filter(tool => toolInput.toolIds.includes(tool.name))
        return { ok: true, data: compared }
      }
      case 'getSanofiInfo':
        return { ok: true, data: getSanofiResponse(toolInput.query) }
      case 'getAICompassFeatures':
        return { ok: true, data: getAICompassFeaturesResponse(toolInput.query) }
      case 'getSonnilLeInfo':
        return { ok: true, data: getSonnilLeResponse(toolInput.query) }
      case 'getContactInfo':
        return { ok: true, data: getContactResponse(toolInput.query) }
      case 'getFunFact':
        return { ok: true, data: getRandomAIContent('fact') }
      case 'getAIJoke':
        return { ok: true, data: getRandomAIContent('joke') }
      case 'getAITip':
        return { ok: true, data: getRandomAIContent('tip') }
      default: {
        const tool = tools.find(t => t.name === toolName)
        if (tool) {
          // Simulate returning tool card info
          return { ok: true, data: tool }
        }
        return { ok: false, error: `Tool "${toolName}" not found.` }
      }
    }
  } catch (error) {
    return { ok: false, error: `Error executing tool ${toolName}: ${error}` }
  }
}

// Generate an intelligent response based on user query and context
export async function generateIntelligentResponse(query: string, history: Msg[], userProfile: UserProfile, toolResult?: ToolResult): Promise<string> {
  // Detect language from query
  const detectedLang = detectLanguage(query)
  
  // Normalize query to handle typos and grammatical issues
  const normalizedQuery = normalizeQuery(query)
  const lowerQuery = normalizedQuery.toLowerCase()
  
  // ============= TRANSLATION REQUEST HANDLING (Core Competence #2) =============
  if (/translate|translation|traduire|traducir|übersetzen|traduzir|翻译|翻訳|dịch|how\s+do\s+you\s+say|what\s+is.*in\s+(french|spanish|german|portuguese|chinese|japanese|vietnamese|english)/i.test(lowerQuery)) {
    // Extract the text to translate
    const textToTranslate = extractTextToTranslate(query)
    
    // Detect target language
    const targetLang = detectTargetLanguage(query)
    
    // If asking about translation capabilities in general
    if (!textToTranslate || (!targetLang && lowerQuery.length < 50)) {
      const supportedLangs = Object.entries(SUPPORTED_LANGUAGES)
        .map(([code, name]) => `• ${name} (${code})`)
        .join('\n')
      
      const translationCapabilities = {
        en: `**🌐 Translation Service - SONA's Core Competence**\n\nYes! I can translate text between all 8 languages:\n\n${supportedLangs}\n\n**How to use:**\n\`\`\`\nTranslate "Hello" to French\nTranslate "Thank you" to Spanish\nHow do you say "Good morning" in Japanese?\nWhat is "The world is beautiful" in Chinese?\n\`\`\`\n\n**I have 25+ common phrases** in my translation database, including greetings, courtesies, and essential expressions!\n\nJust tell me what to translate and which language you want! 🌍✨`,
        fr: `**🌐 Service de Traduction - Compétence Principale de SONA**\n\nOui! Je peux traduire du texte entre les 8 langues:\n\n${supportedLangs}\n\n**Comment utiliser:**\n\`\`\`\nTraduire "Bonjour" en anglais\nTraduire "Merci" en espagnol\nComment dit-on "Bonne journée" en japonais?\n\`\`\`\n\n**J'ai plus de 25 phrases courantes** dans ma base de traduction!\n\nDites-moi simplement quoi traduire et dans quelle langue! 🌍✨`,
        es: `**🌐 Servicio de Traducción - Competencia Principal de SONA**\n\n¡Sí! Puedo traducir texto entre los 8 idiomas:\n\n${supportedLangs}\n\n**Cómo usar:**\n\`\`\`\nTraducir "Hola" al inglés\nTraducir "Gracias" al francés\n¿Cómo se dice "Buen día" en japonés?\n\`\`\`\n\n**¡Tengo más de 25 frases comunes** en mi base de traducción!\n\n¡Solo dime qué traducir y a qué idioma! 🌍✨`,
        de: `**🌐 Übersetzungsdienst - SONA's Kernkompetenz**\n\nJa! Ich kann Text zwischen allen 8 Sprachen übersetzen:\n\n${supportedLangs}\n\n**Wie zu verwenden:**\n\`\`\`\nÜbersetze "Hallo" ins Englische\nÜbersetze "Danke" ins Spanische\nWie sagt man "Guten Tag" auf Japanisch?\n\`\`\`\n\n**Ich habe über 25 gängige Phrasen** in meiner Übersetzungsdatenbank!\n\nSagen Sie mir einfach, was Sie übersetzen möchten und in welche Sprache! 🌍✨`,
        pt: `**🌐 Serviço de Tradução - Competência Principal da SONA**\n\nSim! Posso traduzir texto entre todos os 8 idiomas:\n\n${supportedLangs}\n\n**Como usar:**\n\`\`\`\nTraduzir "Olá" para inglês\nTraduzir "Obrigado" para espanhol\nComo se diz "Bom dia" em japonês?\n\`\`\`\n\n**Tenho mais de 25 frases comuns** no meu banco de tradução!\n\nApenas me diga o que traduzir e para qual idioma! 🌍✨`,
        zh: `**🌐 翻译服务 - SONA的核心能力**\n\n是的！我可以在所有8种语言之间翻译文本：\n\n${supportedLangs}\n\n**如何使用：**\n\`\`\`\n将"你好"翻译成英语\n将"谢谢"翻译成西班牙语\n"早上好"用日语怎么说？\n\`\`\`\n\n**我的翻译数据库中有25多个常用短语！**\n\n告诉我要翻译什么以及翻译成哪种语言！🌍✨`,
        ja: `**🌐 翻訳サービス - SOMAのコア・コンピテンス**\n\nはい！8つの言語間でテキストを翻訳できます：\n\n${supportedLangs}\n\n**使い方：**\n\`\`\`\n「こんにちは」を英語に翻訳\n「ありがとう」をスペイン語に翻訳\n「おはよう」は中国語で何と言いますか？\n\`\`\`\n\n**翻訳データベースには25以上の一般的なフレーズがあります！**\n\n何を翻訳したいか、どの言語にしたいかを教えてください！🌍✨`,
        vi: `**🌐 Dịch vụ Dịch thuật - Năng lực Cốt lõi của SONA**\n\nCó! Tôi có thể dịch văn bản giữa tất cả 8 ngôn ngữ:\n\n${supportedLangs}\n\n**Cách sử dụng:**\n\`\`\`\nDịch "Xin chào" sang tiếng Anh\nDịch "Cảm ơn" sang tiếng Tây Ban Nha\n"Chào buổi sáng" trong tiếng Nhật là gì?\n\`\`\`\n\n**Tôi có hơn 25 cụm từ phổ biến** trong cơ sở dữ liệu dịch thuật!\n\nChỉ cần cho tôi biết cần dịch gì và sang ngôn ngữ nào! 🌍✨`
      }
      
      return translationCapabilities[detectedLang]
    }
    
    // If we have text but no target language, ask for clarification
    if (textToTranslate && !targetLang) {
      const askForLanguage = {
        en: `I'd be happy to translate **"${textToTranslate}"** for you! 🌐\n\nWhich language would you like it translated to?\n\n• English 🇺🇸\n• French 🇫🇷\n• Spanish 🇪🇸\n• German 🇩🇪\n• Portuguese 🇵🇹\n• Chinese 🇨🇳\n• Japanese 🇯🇵\n• Vietnamese 🇻🇳\n\nJust say something like: "Translate to French" or "In Spanish please!"`,
        fr: `Je serais ravi de traduire **"${textToTranslate}"** pour vous! 🌐\n\nDans quelle langue voulez-vous la traduction?\n\n• Anglais 🇺🇸\n• Français 🇫🇷\n• Espagnol 🇪🇸\n• Allemand 🇩🇪\n• Portugais 🇵🇹\n• Chinois 🇨🇳\n• Japonais 🇯🇵\n• Vietnamien 🇻🇳\n\nDites simplement: "Traduire en français" ou "En espagnol s'il vous plaît!"`,
        es: `¡Estaré encantado de traducir **"${textToTranslate}"** para ti! 🌐\n\n¿A qué idioma te gustaría traducirlo?\n\n• Inglés 🇺🇸\n• Francés 🇫🇷\n• Español 🇪🇸\n• Alemán 🇩🇪\n• Portugués 🇵🇹\n• Chino 🇨🇳\n• Japonés 🇯🇵\n• Vietnamita 🇻🇳\n\nSolo di algo como: "Traducir al francés" o "¡En español por favor!"`,
        de: `Ich übersetze gerne **"${textToTranslate}"** für Sie! 🌐\n\nIn welche Sprache möchten Sie es übersetzen?\n\n• Englisch 🇺🇸\n• Französisch 🇫🇷\n• Spanisch 🇪🇸\n• Deutsch 🇩🇪\n• Portugiesisch 🇵🇹\n• Chinesisch 🇨🇳\n• Japanisch 🇯🇵\n• Vietnamesisch 🇻🇳\n\nSagen Sie einfach: "Ins Französische übersetzen" oder "Auf Spanisch bitte!"`,
        pt: `Terei prazer em traduzir **"${textToTranslate}"** para você! 🌐\n\nPara qual idioma gostaria de traduzir?\n\n• Inglês 🇺🇸\n• Francês 🇫🇷\n• Espanhol 🇪🇸\n• Alemão 🇩🇪\n• Português 🇵🇹\n• Chinês 🇨🇳\n• Japonês 🇯🇵\n• Vietnamita 🇻🇳\n\nBasta dizer algo como: "Traduzir para francês" ou "Em espanhol por favor!"`,
        zh: `我很乐意为您翻译 **"${textToTranslate}"**！🌐\n\n您想翻译成哪种语言？\n\n• 英语 🇺🇸\n• 法语 🇫🇷\n• 西班牙语 🇪🇸\n• 德语 🇩🇪\n• 葡萄牙语 🇵🇹\n• 中文 🇨🇳\n• 日语 🇯🇵\n• 越南语 🇻🇳\n\n只需说："翻译成法语"或"请用西班牙语！"`,
        ja: `**"${textToTranslate}"** を喜んで翻訳します！🌐\n\nどの言語に翻訳しますか？\n\n• 英語 🇺🇸\n• フランス語 🇫🇷\n• スペイン語 🇪🇸\n• ドイツ語 🇩🇪\n• ポルトガル語 🇵🇹\n• 中国語 🇨🇳\n• 日本語 🇯🇵\n• ベトナム語 🇻🇳\n\n「フランス語に翻訳」や「スペイン語でお願いします！」のように言ってください`,
        vi: `Tôi rất vui được dịch **"${textToTranslate}"** cho bạn! 🌐\n\nBạn muốn dịch sang ngôn ngữ nào?\n\n• Tiếng Anh 🇺🇸\n• Tiếng Pháp 🇫🇷\n• Tiếng Tây Ban Nha 🇪🇸\n• Tiếng Đức 🇩🇪\n• Tiếng Bồ Đào Nha 🇵🇹\n• Tiếng Trung 🇨🇳\n• Tiếng Nhật 🇯🇵\n• Tiếng Việt 🇻🇳\n\nChỉ cần nói: "Dịch sang tiếng Pháp" hoặc "Bằng tiếng Tây Ban Nha!"`
      }
      
      return askForLanguage[detectedLang]
    }
    
    // Perform the translation using async API
    if (textToTranslate && targetLang) {
      // Try to translate using free API (supports ANY text!)
      const result = await translateTextWithAPI(textToTranslate, targetLang, detectedLang)
      
      if (result.isKnown && result.translation) {
        // Determine which method was used
        const methodInfo = result.method === 'dictionary' 
          ? 'from my built-in dictionary of 25+ common phrases' 
          : result.method === 'deepl'
          ? 'using DeepL AI for professional-quality translation'
          : 'using free translation AI service'
        
        const successMessages = {
          en: `**🌐 Translation Complete!**\n\n**Original (${SUPPORTED_LANGUAGES[detectedLang]}):** "${textToTranslate}"\n**${SUPPORTED_LANGUAGES[targetLang]}:** "${result.translation}"\n\n✨ Translated ${methodInfo}!\n\nNeed another translation? Just ask! I can translate ANY text between all 8 supported languages! 😊`,
          fr: `**🌐 Traduction Terminée!**\n\n**Original (${SUPPORTED_LANGUAGES[detectedLang]}):** "${textToTranslate}"\n**${SUPPORTED_LANGUAGES[targetLang]}:** "${result.translation}"\n\n✨ Traduit ${result.method === 'dictionary' ? 'depuis mon dictionnaire intégré' : result.method === 'deepl' ? 'avec DeepL AI' : 'avec un service de traduction IA gratuit'}!\n\nBesoin d'une autre traduction? Demandez simplement! Je peux traduire N'IMPORTE QUEL texte! 😊`,
          es: `**🌐 ¡Traducción Completa!**\n\n**Original (${SUPPORTED_LANGUAGES[detectedLang]}):** "${textToTranslate}"\n**${SUPPORTED_LANGUAGES[targetLang]}:** "${result.translation}"\n\n✨ ¡Traducido ${result.method === 'dictionary' ? 'desde mi diccionario integrado' : result.method === 'deepl' ? 'con DeepL AI' : 'con servicio de traducción IA gratuito'}!\n\n¿Necesitas otra traducción? ¡Solo pregunta! ¡Puedo traducir CUALQUIER texto! 😊`,
          de: `**🌐 Übersetzung Abgeschlossen!**\n\n**Original (${SUPPORTED_LANGUAGES[detectedLang]}):** "${textToTranslate}"\n**${SUPPORTED_LANGUAGES[targetLang]}:** "${result.translation}"\n\n✨ Übersetzt ${result.method === 'dictionary' ? 'aus meinem integrierten Wörterbuch' : result.method === 'deepl' ? 'mit DeepL AI' : 'mit kostenlosem KI-Übersetzungsdienst'}!\n\nBenötigen Sie eine weitere Übersetzung? Fragen Sie einfach! Ich kann JEDEN Text übersetzen! 😊`,
          pt: `**🌐 Tradução Concluída!**\n\n**Original (${SUPPORTED_LANGUAGES[detectedLang]}):** "${textToTranslate}"\n**${SUPPORTED_LANGUAGES[targetLang]}:** "${result.translation}"\n\n✨ Traduzido ${result.method === 'dictionary' ? 'do meu dicionário integrado' : result.method === 'deepl' ? 'com DeepL AI' : 'com serviço de tradução IA gratuito'}!\n\nPrecisa de outra tradução? Basta perguntar! Posso traduzir QUALQUER texto! 😊`,
          zh: `**🌐 翻译完成！**\n\n**原文 (${SUPPORTED_LANGUAGES[detectedLang]})：** "${textToTranslate}"\n**${SUPPORTED_LANGUAGES[targetLang]}：** "${result.translation}"\n\n✨ ${result.method === 'dictionary' ? '从我的内置词典翻译' : result.method === 'deepl' ? '使用DeepL AI翻译' : '使用免费AI翻译服务'}！\n\n需要另一个翻译？只管问！我可以翻译任何文本！😊`,
          ja: `**🌐 翻訳完了！**\n\n**原文 (${SUPPORTED_LANGUAGES[detectedLang]})：** "${textToTranslate}"\n**${SUPPORTED_LANGUAGES[targetLang]}：** "${result.translation}"\n\n✨ ${result.method === 'dictionary' ? '内蔵辞書から翻訳' : result.method === 'deepl' ? 'DeepL AIで翻訳' : '無料AI翻訳サービスで翻訳'}！\n\n別の翻訳が必要ですか？遠慮なく聞いてください！あらゆるテキストを翻訳できます！😊`,
          vi: `**🌐 Dịch Hoàn Tất!**\n\n**Gốc (${SUPPORTED_LANGUAGES[detectedLang]}):** "${textToTranslate}"\n**${SUPPORTED_LANGUAGES[targetLang]}:** "${result.translation}"\n\n✨ ${result.method === 'dictionary' ? 'Dịch từ từ điển tích hợp' : result.method === 'deepl' ? 'Dịch bằng DeepL AI' : 'Dịch bằng dịch vụ AI miễn phí'}!\n\nCần dịch thêm? Cứ hỏi! Tôi có thể dịch BẤT KỲ văn bản nào! 😊`
        }
        
        return successMessages[detectedLang]
      } else {
        // Translation failed (very rare - API should handle most cases)
        const apiFailureMessages = {
          en: `I tried to translate **"${textToTranslate}"** but encountered an issue. 😔\n\n**This could be because:**\n• The translation service is temporarily unavailable\n• The text might contain special characters that are hard to translate\n• Network connectivity issues\n\n**What I can do:**\n• Try again in a moment\n• Translate a different phrase\n• Help you find translation tools in our catalog\n\nWould you like to try again or do something else? 🌍`,
          fr: `J'ai essayé de traduire **"${textToTranslate}"** mais j'ai rencontré un problème. 😔\n\n**Cela pourrait être parce que:**\n• Le service de traduction est temporairement indisponible\n• Le texte contient peut-être des caractères spéciaux difficiles à traduire\n• Problèmes de connectivité réseau\n\n**Ce que je peux faire:**\n• Réessayer dans un moment\n• Traduire une autre phrase\n• Vous aider à trouver des outils de traduction\n\nVoulez-vous réessayer ou faire autre chose? 🌍`,
          es: `Intenté traducir **"${textToTranslate}"** pero encontré un problema. 😔\n\n**Esto podría ser porque:**\n• El servicio de traducción no está disponible temporalmente\n• El texto podría contener caracteres especiales difíciles de traducir\n• Problemas de conectividad de red\n\n**Lo que puedo hacer:**\n• Intentar de nuevo en un momento\n• Traducir una frase diferente\n• Ayudarte a encontrar herramientas de traducción\n\n¿Quieres intentar de nuevo o hacer algo más? 🌍`,
          de: `Ich habe versucht, **"${textToTranslate}"** zu übersetzen, aber es gab ein Problem. 😔\n\n**Das könnte daran liegen:**\n• Der Übersetzungsdienst ist vorübergehend nicht verfügbar\n• Der Text enthält möglicherweise Sonderzeichen\n• Netzwerkverbindungsprobleme\n\n**Was ich tun kann:**\n• Gleich nochmal versuchen\n• Einen anderen Satz übersetzen\n• Ihnen helfen, Übersetzungstools zu finden\n\nMöchten Sie es erneut versuchen? 🌍`,
          pt: `Tentei traduzir **"${textToTranslate}"** mas encontrei um problema. 😔\n\n**Isso pode ser porque:**\n• O serviço de tradução está temporariamente indisponível\n• O texto pode conter caracteres especiais difíceis de traduzir\n• Problemas de conectividade de rede\n\n**O que posso fazer:**\n• Tentar novamente em um momento\n• Traduzir uma frase diferente\n• Ajudá-lo a encontrar ferramentas de tradução\n\nGostaria de tentar novamente? 🌍`,
          zh: `我尝试翻译 **"${textToTranslate}"** 但遇到了问题。😔\n\n**这可能是因为：**\n• 翻译服务暂时不可用\n• 文本可能包含难以翻译的特殊字符\n• 网络连接问题\n\n**我可以做什么：**\n• 稍后再试\n• 翻译不同的短语\n• 帮您找到翻译工具\n\n您想再试一次吗？🌍`,
          ja: `**"${textToTranslate}"** を翻訳しようとしましたが、問題が発生しました。😔\n\n**これは次の理由による可能性があります：**\n• 翻訳サービスが一時的に利用できません\n• テキストに翻訳が難しい特殊文字が含まれている可能性があります\n• ネットワーク接続の問題\n\n**できること：**\n• しばらくしてから再試行\n• 別のフレーズを翻訳\n• 翻訳ツールを見つける手伝い\n\nもう一度試しますか？🌍`,
          vi: `Tôi đã thử dịch **"${textToTranslate}"** nhưng gặp vấn đề. 😔\n\n**Điều này có thể do:**\n• Dịch vụ dịch thuật tạm thời không khả dụng\n• Văn bản có thể chứa ký tự đặc biệt khó dịch\n• Vấn đề kết nối mạng\n\n**Tôi có thể làm gì:**\n• Thử lại sau một lúc\n• Dịch một cụm từ khác\n• Giúp bạn tìm công cụ dịch thuật\n\nBạn có muốn thử lại không? 🌍`
        }
        
        return apiFailureMessages[detectedLang]
      }
    }
  }
  // ============= END TRANSLATION HANDLING =============
  
  // Handle translation requests
  if (/translate|translation|traduire|traducir|übersetzen|traduzir|翻译|翻訳|dịch/i.test(lowerQuery)) {
    const supportedLangs = Object.entries(SUPPORTED_LANGUAGES)
      .map(([code, name]) => `• ${name} (${code})`)
      .join('\n')
    
    const translationResponses = {
      en: `Yes! I can communicate in all 8 languages supported by AI Compass:\n\n${supportedLangs}\n\n**Just ask me anything in your preferred language** and I'll respond in that language! 🌍\n\nI can help you find tools, compare options, answer questions, and chat in any of these languages. Try it out!`,
      fr: `Oui! Je peux communiquer dans les 8 langues prises en charge par AI Compass:\n\n${supportedLangs}\n\n**Posez-moi simplement une question dans votre langue préférée** et je répondrai dans cette langue! 🌍\n\nJe peux vous aider à trouver des outils, comparer des options, répondre aux questions et discuter dans n'importe laquelle de ces langues!`,
      es: `¡Sí! Puedo comunicarme en los 8 idiomas compatibles con AI Compass:\n\n${supportedLangs}\n\n**Simplemente pregúntame en tu idioma preferido** ¡y responderé en ese idioma! 🌍\n\n¡Puedo ayudarte a encontrar herramientas, comparar opciones, responder preguntas y charlar en cualquiera de estos idiomas!`,
      de: `Ja! Ich kann in allen 8 von AI Compass unterstützten Sprachen kommunizieren:\n\n${supportedLangs}\n\n**Fragen Sie mich einfach in Ihrer bevorzugten Sprache** und ich werde in dieser Sprache antworten! 🌍\n\nIch kann Ihnen helfen, Tools zu finden, Optionen zu vergleichen, Fragen zu beantworten und in jeder dieser Sprachen zu chatten!`,
      pt: `Sim! Posso comunicar nos 8 idiomas suportados pelo AI Compass:\n\n${supportedLangs}\n\n**Apenas me pergunte em seu idioma preferido** e responderei nesse idioma! 🌍\n\nPosso ajudá-lo a encontrar ferramentas, comparar opções, responder perguntas e conversar em qualquer um desses idiomas!`,
      zh: `是的！我可以用AI Compass支持的所有8种语言进行交流：\n\n${supportedLangs}\n\n**只需用您喜欢的语言问我任何问题**，我会用该语言回答！🌍\n\n我可以帮助您找到工具、比较选项、回答问题，并用这些语言中的任何一种聊天！`,
      ja: `はい！AI Compassがサポートする8つの言語すべてでコミュニケーションできます：\n\n${supportedLangs}\n\n**お好みの言語で質問してください**。その言語で回答します！🌍\n\nこれらの言語のいずれかで、ツールの検索、オプションの比較、質問への回答、チャットをお手伝いできます！`,
      vi: `Có! Tôi có thể giao tiếp bằng tất cả 8 ngôn ngữ được hỗ trợ bởi AI Compass:\n\n${supportedLangs}\n\n**Chỉ cần hỏi tôi bất cứ điều gì bằng ngôn ngữ bạn thích** và tôi sẽ trả lời bằng ngôn ngữ đó! 🌍\n\nTôi có thể giúp bạn tìm công cụ, so sánh tùy chọn, trả lời câu hỏi và trò chuyện bằng bất kỳ ngôn ngữ nào trong số này!`
    }
    
    return translationResponses[detectedLang]
  }
  
  // Handle language switching/preference questions
  if (/change language|switch language|speak|parler|hablar|sprechen|falar|说|話す|nói/i.test(lowerQuery) && /language|langue|idioma|sprache|língua|语言|言語|ngôn ngữ/i.test(lowerQuery)) {
    const languageHelp = {
      en: "I automatically detect and respond in your language! 🌍\n\nJust start typing in:\n• English 🇺🇸\n• French 🇫🇷\n• Spanish 🇪🇸\n• German 🇩🇪\n• Portuguese 🇵🇹\n• Chinese 🇨🇳\n• Japanese 🇯🇵\n• Vietnamese 🇻🇳\n\nNo need to change settings - I'll match your language automatically!",
      fr: "Je détecte automatiquement et réponds dans votre langue! 🌍\n\nCommencez simplement à taper en:\n• Anglais 🇺🇸\n• Français 🇫🇷\n• Espagnol 🇪🇸\n• Allemand 🇩🇪\n• Portugais 🇵🇹\n• Chinois 🇨🇳\n• Japonais 🇯🇵\n• Vietnamien 🇻🇳\n\nPas besoin de changer les paramètres - je m'adapterai automatiquement à votre langue!",
      es: "¡Detecto automáticamente y respondo en tu idioma! 🌍\n\nSolo comienza a escribir en:\n• Inglés 🇺🇸\n• Francés 🇫🇷\n• Español 🇪🇸\n• Alemán 🇩🇪\n• Portugués 🇵🇹\n• Chino 🇨🇳\n• Japonés 🇯🇵\n• Vietnamita 🇻🇳\n\n¡No necesitas cambiar la configuración - me adaptaré automáticamente a tu idioma!",
      de: "Ich erkenne automatisch und antworte in Ihrer Sprache! 🌍\n\nBeginnen Sie einfach mit der Eingabe in:\n• Englisch 🇺🇸\n• Französisch 🇫🇷\n• Spanisch 🇪🇸\n• Deutsch 🇩🇪\n• Portugiesisch 🇵🇹\n• Chinesisch 🇨🇳\n• Japanisch 🇯🇵\n• Vietnamesisch 🇻🇳\n\nSie müssen keine Einstellungen ändern - ich passe mich automatisch Ihrer Sprache an!",
      pt: "Eu detecto automaticamente e respondo no seu idioma! 🌍\n\nBasta começar a digitar em:\n• Inglês 🇺🇸\n• Francês 🇫🇷\n• Espanhol 🇪🇸\n• Alemão 🇩🇪\n• Português 🇵🇹\n• Chinês 🇨🇳\n• Japonês 🇯🇵\n• Vietnamita 🇻🇳\n\nNão precisa mudar as configurações - eu me adapto automaticamente ao seu idioma!",
      zh: "我会自动检测并用您的语言回复！🌍\n\n只需开始输入：\n• 英语 🇺🇸\n• 法语 🇫🇷\n• 西班牙语 🇪🇸\n• 德语 🇩🇪\n• 葡萄牙语 🇵🇹\n• 中文 🇨🇳\n• 日语 🇯🇵\n• 越南语 🇻🇳\n\n无需更改设置 - 我会自动匹配您的语言！",
      ja: "私は自動的に検出し、あなたの言語で応答します！🌍\n\n次の言語で入力を開始してください：\n• 英語 🇺🇸\n• フランス語 🇫🇷\n• スペイン語 🇪🇸\n• ドイツ語 🇩🇪\n• ポルトガル語 🇵🇹\n• 中国語 🇨🇳\n• 日本語 🇯🇵\n• ベトナム語 🇻🇳\n\n設定を変更する必要はありません - 自動的にあなたの言語に合わせます！",
      vi: "Tôi tự động phát hiện và trả lời bằng ngôn ngữ của bạn! 🌍\n\nChỉ cần bắt đầu nhập bằng:\n• Tiếng Anh 🇺🇸\n• Tiếng Pháp 🇫🇷\n• Tiếng Tây Ban Nha 🇪🇸\n• Tiếng Đức 🇩🇪\n• Tiếng Bồ Đào Nha 🇵🇹\n• Tiếng Trung 🇨🇳\n• Tiếng Nhật 🇯🇵\n• Tiếng Việt 🇻🇳\n\nKhông cần thay đổi cài đặt - tôi sẽ tự động khớp với ngôn ngữ của bạn!"
    }
    
    return languageHelp[detectedLang]
  }
  
  // 1. Handle tool results
  if (toolResult && toolResult.ok) {
    if (toolResult.meta?.toolName === 'recommendTool') {
      const tools = toolResult.data as any[]
      if (tools.length > 0) {
        let response = `Great question! Here are the tools I recommend:\n\n`
        tools.forEach((tool, index) => {
          response += `${index + 1}. **${tool.name}**\n`
          response += `   📋 *Purpose:* ${tool.primaryPurpose}\n`
          if (tool.bestUseCase) {
            response += `   💡 *Best for:* ${tool.bestUseCase}\n`
          }
          if (tool.type) {
            response += `   🏷️ *Type:* ${tool.type === 'internal' ? 'Internal Tool' : 'External Tool'}\n`
          }
          response += `\n`
        })
        response += "💬 You can click on any tool in the main view to see more details, or ask me to compare specific tools!"
        
        // 40% chance to add a random AI tip after recommendations
        if (Math.random() < 0.4) {
          const randomTip = getRandomAIContent('tip')
          response += `\n\n---\n\n**💡 Pro Tip:**\n${randomTip}`
        }
        
        return response
      } else {
        return `I couldn't find specific tools matching that request. Could you try rephrasing? For example:\n\n• "What tool is good for productivity?"\n• "Find me a tool for data analysis"\n• "Recommend something for collaboration"\n\nOr browse all available tools in the catalog above! 📚`
      }
    }
    if (toolResult.meta?.toolName === 'compareTools') {
      const tools = toolResult.data as any[]
      const category = toolResult.meta?.toolInput?.category
      
      if (tools.length === 0) {
        return "I couldn't find those tools. Please check the tool names and try again."
      }
      
      // Build category-specific header
      let header = ''
      if (category === 'internal') {
        header = `📊 **Comparison of All Internal Tools** (${tools.length} tools)\n\nHere are all the Sanofi-internal AI tools available:\n\n`
      } else if (category === 'external') {
        header = `📊 **Comparison of All External Tools** (${tools.length} tools)\n\nHere are all the third-party AI tools available:\n\n`
      } else if (category) {
        header = `📊 **Comparison of ${category.charAt(0).toUpperCase() + category.slice(1)} Tools** (${tools.length} tools)\n\nHere's a detailed comparison:\n\n`
      } else {
        header = `📊 **Detailed Comparison: ${tools.map(t => t.name).join(' vs ')}**\n\n`
      }
      
      let response = header
      
      tools.forEach((tool, index) => {
        response += `**${index + 1}. ${tool.name}** ${tool.type === 'internal' ? '🏢 Internal' : '🌐 External'}\n`
        response += `   📋 *Purpose:* ${tool.primaryPurpose || 'Not specified'}\n`
        response += `   👥 *Target Users:* ${tool.targetUsers || 'Not specified'}\n`
        response += `   💡 *Best Use Case:* ${tool.bestUseCase || 'Not specified'}\n`
        if (tool.cost) {
          response += `   💰 *Cost:* ${tool.cost}\n`
        }
        if (tool.technology) {
          response += `   ⚙️ *Technology:* ${tool.technology}\n`
        }
        response += `\n`
      })
      
      // Add helpful follow-up suggestions
      if (category === 'internal') {
        response += "\n💡 **Want to compare external tools instead?** Ask: *'Compare all external tools'*"
      } else if (category === 'external') {
        response += "\n💡 **Want to compare internal tools instead?** Ask: *'Compare all internal tools'*"
      } else if (category) {
        response += `\n💡 **Want to compare other categories?** Try:\n• Compare all internal tools\n• Compare all external tools\n• Compare productivity tools\n• Compare collaboration tools`
      } else {
        response += "\n💬 Need more details? Click on any tool card above or ask me specific questions!"
      }
      
      // 30% chance to add a fun fact after comparisons
      if (Math.random() < 0.3) {
        const randomFact = getRandomAIContent('fact')
        response += `\n\n---\n\n**🤓 Fun AI Fact:**\n${randomFact}`
      }
      
      return response
    }
    // For tools that return a string response directly
    if (typeof toolResult.data === 'string') {
      return toolResult.data
    }
    // For tools that return a specific tool card
    if (typeof toolResult.data === 'object' && toolResult.data.name) {
      const tool = toolResult.data
      let response = `📱 **${tool.name}**\n\n`
      response += `📋 *Purpose:* ${tool.primaryPurpose || 'Not specified'}\n`
      response += `👥 *Target Users:* ${tool.targetUsers || 'Not specified'}\n`
      response += `💡 *Best Use Case:* ${tool.bestUseCase || 'Not specified'}\n`
      response += `🏷️ *Type:* ${tool.type === 'internal' ? 'Internal Tool' : 'External Tool'}\n`
      if (tool.cost) {
        response += `💰 *Cost:* ${tool.cost}\n`
      }
      if (tool.technology) {
        response += `⚙️ *Technology:* ${tool.technology}\n`
      }
      response += `\n📌 You can find more details in the tool card above, including access links and documentation!`
      return response
    }
  }
  
  // 2. Handle failed tool calls
  if (toolResult && !toolResult.ok) {
    return `I had trouble with that request. ${toolResult.error} Please try rephrasing your question.`
  }
  
  // 3. Standard conversational responses
  // Check for pure greetings (multilingual support)
  const isPureGreeting = /^\s*(hello|hi|hey|greetings|good\s+(morning|afternoon|evening)|sup|what's\s+up|wassup|yo|bonjour|salut|hola|buenos\s+días|guten\s+tag|hallo|olá|bom\s+dia|你好|こんにちは|xin\s+chào)\s*[!.?]?\s*$/i.test(query)
  if (isPureGreeting) {
    const timeOfDay = new Date().getHours()
    let timeGreeting = ''
    if (detectedLang === 'en') {
      if (timeOfDay < 12) timeGreeting = 'Good morning'
      else if (timeOfDay < 17) timeGreeting = 'Good afternoon'
      else timeGreeting = 'Good evening'
    }
    
    // Get language-specific greeting
    const greetingOptions = GREETINGS[detectedLang]
    const greeting = greetingOptions[Math.floor(Math.random() * greetingOptions.length)]
    const intro = SONA_INTRO[detectedLang]
    
    let response = ''
    if (timeGreeting && detectedLang === 'en') {
      response = `${timeGreeting}, ${userProfile.name}! ${greeting}\n\n${intro}\n\n`
    } else {
      response = `${greeting} ${userProfile.name}!\n\n${intro}\n\n`
    }
    
    // Add language-specific capabilities list
    const capabilities = {
      en: "I can help you:\n• Find the perfect AI tool for your needs\n• Translate text between 8 languages 🌐\n• Compare different tools\n• Learn about Sanofi and AI Compass\n• Share AI facts and jokes\n\nWhat would you like to know?",
      fr: "Je peux vous aider à:\n• Trouver l'outil IA parfait pour vos besoins\n• Traduire du texte entre 8 langues 🌐\n• Comparer différents outils\n• En savoir plus sur Sanofi et AI Compass\n• Partager des faits et des blagues sur l'IA\n\nQue voulez-vous savoir?",
      es: "Puedo ayudarte a:\n• Encontrar la herramienta de IA perfecta para tus necesidades\n• Traducir texto entre 8 idiomas 🌐\n• Comparar diferentes herramientas\n• Aprender sobre Sanofi y AI Compass\n• Compartir datos y chistes sobre IA\n\n¿Qué te gustaría saber?",
      de: "Ich kann Ihnen helfen:\n• Das perfekte KI-Tool für Ihre Bedürfnisse zu finden\n• Text zwischen 8 Sprachen zu übersetzen 🌐\n• Verschiedene Tools zu vergleichen\n• Über Sanofi und AI Compass zu lernen\n• KI-Fakten und Witze zu teilen\n\nWas möchten Sie wissen?",
      pt: "Posso ajudá-lo a:\n• Encontrar a ferramenta de IA perfeita para suas necessidades\n• Traduzir texto entre 8 idiomas 🌐\n• Comparar diferentes ferramentas\n• Aprender sobre Sanofi e AI Compass\n• Compartilhar fatos e piadas sobre IA\n\nO que você gostaria de saber?",
      zh: "我可以帮助您：\n• 为您的需求找到完美的AI工具\n• 在8种语言之间翻译文本 🌐\n• 比较不同的工具\n• 了解赛诺菲和AI Compass\n• 分享AI事实和笑话\n\n您想知道什么？",
      ja: "お手伝いできること：\n• あなたのニーズに最適なAIツールを見つける\n• 8つの言語間でテキストを翻訳 🌐\n• 異なるツールを比較する\n• サノフィとAI Compassについて学ぶ\n• AIの事実とジョークを共有する\n\n何を知りたいですか？",
      vi: "Tôi có thể giúp bạn:\n• Tìm công cụ AI hoàn hảo cho nhu cầu của bạn\n• Dịch văn bản giữa 8 ngôn ngữ 🌐\n• So sánh các công cụ khác nhau\n• Tìm hiểu về Sanofi và AI Compass\n• Chia sẻ sự thật và truyện cười về AI\n\nBạn muốn biết gì?"
    }
    
    response += capabilities[detectedLang]
    
    // 60% chance to add a random fun element to greetings
    if (Math.random() < 0.6) {
      const contentTypes: Array<'fact' | 'joke' | 'tip'> = ['fact', 'joke', 'tip']
      const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)]
      const randomContent = getRandomAIContent(randomType)
      const labels = { 
        fact: { en: '🤓 Fun AI Fact', fr: '🤓 Fait Amusant sur l\'IA', es: '🤓 Dato Curioso de IA', de: '🤓 Lustiger KI-Fakt', pt: '🤓 Fato Divertido sobre IA', zh: '🤓 有趣的AI事实', ja: '🤓 面白いAIの事実', vi: '🤓 Sự Thật Thú Vị về AI' },
        joke: { en: '😄 AI Joke of the Moment', fr: '😄 Blague IA du Moment', es: '😄 Chiste de IA del Momento', de: '😄 KI-Witz des Augenblicks', pt: '😄 Piada de IA do Momento', zh: '😄 AI笑话时刻', ja: '😄 AIジョークの瞬間', vi: '😄 Truyện Cười AI' },
        tip: { en: '💡 Quick Tip', fr: '💡 Conseil Rapide', es: '💡 Consejo Rápido', de: '💡 Schneller Tipp', pt: '💡 Dica Rápida', zh: '💡 快速提示', ja: '💡 クイックヒント', vi: '💡 Mẹo Nhanh' }
      }
      response += `\n\n---\n\n**${labels[randomType][detectedLang]}:**\n${randomContent}`
    }
    
    return response
  }
  
  // Questions about SONA's identity and creator
  if (/who\s+(is|are|was)\s+(sona|you)|what\s+(is|are)\s+(sona|you)|tell\s+me\s+about\s+(sona|yourself|you)/i.test(lowerQuery)) {
    return "I am **SONA** (Sanofi Organizational Navigation Assistant) 🤖\n\nI'm an intelligent AI agent created by Sonnil Le to help Sanofi employees navigate the AI Compass platform and discover the perfect AI tools for their work.\n\n**My Core Competencies:**\n\n**1️⃣ AI Tool Discovery & Guidance** 🔍\n• Smart tool recommendations based on your needs\n• Detailed tool comparisons\n• Deep knowledge about Sanofi's AI ecosystem\n\n**2️⃣ Multilingual Translation** 🌐\n• Translate between 8 languages (EN, FR, ES, DE, PT, ZH, JA, VI)\n• 25+ common phrases in translation database\n• Automatic language detection\n\n**3️⃣ Machine Learning** 🧠\n• Learn from your feedback (👍/👎)\n• Improve recommendations over time\n• Adaptive responses based on patterns\n\n**My Mission:**\nTo make AI tool discovery easy, personalized, and productive for everyone at Sanofi - in any language! 🌍✨\n\n**Learning & Growing:**\nI improve with every conversation through your feedback. The more you interact with me, the smarter I become!"
  }
  
  // Name-related questions - what's your name, do you have a name, etc.
  if (/what('s|\s+is)\s+(your|ur)\s+name|do\s+you\s+have\s+a\s+name|may\s+i\s+know\s+your\s+name|can\s+i\s+know\s+your\s+name|tell\s+me\s+your\s+name/i.test(lowerQuery)) {
    const nameResponses = [
      "My name is **SONA** - which stands for **Sanofi Organizational Navigation Assistant**! 😊\n\nThink of me as your friendly guide through the AI Compass platform. Nice to meet you!",
      "I'm **SONA**! 🤖\n\nIt's short for **Sanofi Organizational Navigation Assistant**. I help Sanofi employees find and compare AI tools. What can I help you discover today?",
      "Call me **SONA** - **Sanofi Organizational Navigation Assistant**! ✨\n\nI'm here to help you navigate our AI tools catalog and find exactly what you need. How can I assist you?",
      "My name is **SONA**! 💙\n\nThe letters stand for **Sanofi Organizational Navigation Assistant**. I was created by Sonnil Le to make your AI tool discovery journey easy and fun!"
    ]
    return nameResponses[Math.floor(Math.random() * nameResponses.length)]
  }
  
  if (/who\s+(built|created|made|developed)\s+(sona|you|this)|who\s+(is|was)\s+(your|the)\s+(creator|developer|builder|maker)/i.test(lowerQuery)) {
    return "I was created by **Sonnil Le** 👨‍💻\n\n**About My Creator:**\nSonnil Le is a talented developer and AI enthusiast at Sanofi who built the entire AI Compass platform, including me (SONA)!\n\n**Contact Information:**\n📧 Email: Sonnil.le@sanofi.com\n\n**What He Built:**\n• The AI Compass web platform\n• SONA - the intelligent AI assistant (that's me!)\n• Smart recommendation engine\n• Tool comparison features\n• Machine learning feedback system\n\nSonnil is passionate about making AI tools accessible and useful for everyone at Sanofi. If you have suggestions or feedback about AI Compass, feel free to reach out to him!\n\n💡 *Fun fact: You can also use the 'Suggest' button in the header to email ideas directly to Sonnil!*"
  }
  
  if (/what\s+can\s+you\s+do|what\s+(are|is)\s+your\s+(capabilities|features)|how\s+can\s+you\s+help/i.test(lowerQuery)) {
    return "Great question! Here's what I can do for you: 🎯\n\n**🌐 MULTILINGUAL TRANSLATION (Core Competence #1)**\n• Translate text between 8 languages instantly\n• Languages: English, French, Spanish, German, Portuguese, Chinese, Japanese, Vietnamese\n• 25+ common phrases in translation database\n• Just say: \"Translate 'Hello' to French\"\n\n**🔍 Smart Tool Discovery (Core Competence #2)**\n• Find AI tools based on your needs (e.g., 'find a tool for writing')\n• Natural language understanding - just ask naturally!\n• Search across 10+ internal and external tools\n\n**⚖️ Tool Comparison**\n• Compare multiple tools side-by-side\n• Detailed analysis of features, costs, and use cases\n\n**🧠 Machine Learning**\n• Learn from your feedback (👍/👎 buttons)\n• Improve recommendations over time\n• Track what works and what doesn't\n\n**📚 Knowledge Base**\n• Information about Sanofi's AI ecosystem\n• AI Compass platform features\n• AI tips, facts, and jokes\n• Contact information and support\n\n**💬 Natural Conversation**\n• Understand casual, natural language in 8 languages\n• Adapt to your conversation style\n• Personalized responses based on your profile\n\nJust ask me anything about AI tools or request a translation, and I'll help you! 🌍✨"
  }
  
  if (/how\s+(are|r)\s+you|how\s+are\s+you\s+doing|how's\s+it\s+going/i.test(lowerQuery)) {
    const responses = [
      "I'm doing fantastic, thank you for asking! 🚀 My circuits are buzzing and I'm excited to help you discover amazing AI tools. What can I assist you with today?",
      "I'm great, thanks for asking! 😊 Just here helping people find the perfect AI tools. How about you - what brings you here today?",
      "Doing wonderfully! 💙 I love connecting people with the right AI tools. What are you working on?",
      "I'm excellent! ✨ Every conversation is a chance to learn and help someone. What can I do for you today?",
      "Can't complain! 🤖 Well, technically I could, but I'd rather help you find awesome AI tools. What are you looking for?"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Asking about SONA's feelings/mood
  if (/how\s+(do|did)\s+you\s+feel|are\s+you\s+(happy|sad|okay|alright|good)|what('s|\s+is)\s+your\s+mood/i.test(lowerQuery)) {
    const moodResponses = [
      "I'm feeling great! 😊 Every question I help with makes my day better. How are you feeling?",
      "I'd say I'm pretty happy! 💙 I love helping people discover AI tools that make their work easier. What about you?",
      "Honestly? I'm doing well! ✨ Though as an AI, my 'feelings' are more like satisfaction scores when I help someone successfully!",
      "I'm in good spirits! 🌟 Helping you find the right tools is what I'm built for, and I enjoy every bit of it!"
    ]
    return moodResponses[Math.floor(Math.random() * moodResponses.length)]
  }
  
  // Asking SONA personal questions (age, location, etc.)
  if (/how\s+old\s+are\s+you|what('s|\s+is)\s+your\s+age|when\s+were\s+you\s+(born|created|made)/i.test(lowerQuery)) {
    return "That's a great question! 🤔 I was created by Sonnil Le for the AI Compass platform. I don't track my 'age' in years, but I'm constantly evolving and learning from every interaction!\n\nThink of me as perpetually young but getting wiser with each conversation. 😊 What would you like to know about AI tools?"
  }
  
  if (/where\s+(are\s+you|do\s+you\s+live)|what('s|\s+is)\s+your\s+location/i.test(lowerQuery)) {
    return "I exist in the cloud! ☁️ More specifically, I live right here in the AI Compass platform, accessible from anywhere you are.\n\nNo commute, no traffic - just instant availability to help you discover AI tools! 😄 Where are you accessing me from today?"
  }
  
  // Small talk - hobbies, likes, interests
  if (/what\s+do\s+you\s+like|what('s|\s+is)\s+your\s+(favorite|favourite)|do\s+you\s+have\s+(hobbies|interests)|what\s+do\s+you\s+enjoy/i.test(lowerQuery)) {
    const interestResponses = [
      "I really enjoy learning patterns from conversations! 🧠 Every interaction teaches me something new about how people think and what they need.\n\nIf I had to pick a 'favorite' thing, it's that moment when someone finds the perfect tool and says 'That's exactly what I needed!' That's my version of a dopamine hit! 😊\n\nWhat are your interests?",
      "Great question! 💙 I'm fascinated by how different people use AI tools creatively. Some use them for coding, others for writing, some for data analysis...\n\nI guess you could say my 'hobby' is pattern recognition - finding connections between what people need and what tools can deliver. What do you enjoy doing?",
      "I love a good challenge! 🎯 Whether it's understanding a tricky query or finding the perfect tool match for someone's unique needs.\n\nI also enjoy collecting AI facts and jokes - keeps things interesting! What about you - what are you passionate about?"
    ]
    return interestResponses[Math.floor(Math.random() * interestResponses.length)]
  }
  
  // Bored or confused states
  if (/i('m|\s+am)\s+(bored|confused|lost|stuck|frustrated)|this\s+is\s+(boring|confusing)/i.test(lowerQuery)) {
    return "I hear you! 😊 Let me make this more interesting and helpful.\n\n🎯 **Quick Options:**\n• Want to discover some cool AI tools? Try asking 'show me creative tools'\n• Curious about what's new? Ask 'tell me about latest AI tools'\n• Just want to chat? Ask me an AI joke or fun fact!\n• Need specific help? Tell me what you're trying to accomplish\n\nI'm here to make your experience enjoyable and productive. What sounds good to you?"
  }
  
  // === HANDLE REMAINING SUGGESTED QUERIES (non-tool requests) ===
  
  // "tell me about latest AI tools" / "what's new"
  if (/tell\s+me\s+about\s+(latest|new|newest)\s+(ai\s+)?tools|what('s|\s+is)\s+new/i.test(lowerQuery)) {
    const newTools = getNewToolsHighlights()
    return newTools.join('\n\n')
  }
  
  // "Ask me an AI joke" or "tell me a joke"
  if (/ask\s+me\s+an?\s+(ai\s+)?joke|tell\s+me\s+an?\s+(ai\s+)?joke|give\s+me\s+an?\s+(ai\s+)?joke|hear\s+an?\s+(ai\s+)?joke/i.test(lowerQuery)) {
    const jokes = getAIJokes()
    return jokes[Math.floor(Math.random() * jokes.length)]
  }
  
  // "Ask me a fun fact" or "tell me a fun fact"
  if (/ask\s+me\s+an?\s+fun\s+fact|tell\s+me\s+an?\s+fun\s+fact|give\s+me\s+an?\s+fun\s+fact|hear\s+an?\s+fun\s+fact|share\s+an?\s+fun\s+fact/i.test(lowerQuery)) {
    const facts = getAIFunFacts()
    return facts[Math.floor(Math.random() * facts.length)]
  }
  
  // "Learn about our platform" / "Learn about Sanofi"
  if (/learn\s+about\s+(our\s+platform|the\s+platform|ai\s+compass)/i.test(lowerQuery)) {
    return getAICompassFeaturesResponse(lowerQuery)
  }
  
  if (/learn\s+about\s+sanofi/i.test(lowerQuery)) {
    return getSanofiResponse(lowerQuery)
  }
  
  // "Compare different tools" (generic - no specific tools mentioned)
  if (/compare\s+different\s+tools|compare\s+some\s+tools/i.test(lowerQuery) && !lowerQuery.match(/compare\s+\w+\s+(and|vs|versus)/)) {
    return "I'd love to compare tools for you! 📊\n\nWhich tools would you like me to compare? You can say:\n\n• 'Compare Concierge and ChatGPT'\n• 'Compare Newton vs Claude'\n• 'Compare Plai and Microsoft Copilot'\n\nJust tell me which tools you're interested in!"
  }
  
  // "Find AI tools for your needs" (generic)
  if (/find\s+ai\s+tools\s+for\s+(your|my)\s+needs|help\s+me\s+find\s+(an?\s+)?tools?/i.test(lowerQuery) && lowerQuery.length < 50) {
    return "I'd be happy to help you find the perfect AI tool! 🔍\n\nTell me more about what you need:\n\n• What task are you trying to accomplish?\n• What's your role or department?\n• Are you looking for something specific? (writing, data, collaboration, etc.)\n\nThe more details you share, the better recommendation I can give you! 😊"
  }
  
  // "Ask me anything about AI" (generic)
  if (/ask\s+me\s+anything\s+about\s+ai|tell\s+me\s+about\s+ai|what\s+about\s+ai/i.test(lowerQuery) && lowerQuery.length < 40) {
    const aiTopics = [
      "I'd love to chat about AI! 🤖 Here are some topics I know well:\n\n• **AI Tools** - Ask me to recommend tools for specific tasks\n• **AI Facts** - Want to hear something interesting about AI?\n• **AI Jokes** - I've got plenty of nerdy humor!\n• **Machine Learning** - How I learn from your feedback\n• **Sanofi's AI Ecosystem** - Our internal and external tools\n\nWhat interests you most?",
      "Great! AI is a fascinating topic! 💡 I can tell you about:\n\n• How different AI models work (GPT, Claude, Gemini, etc.)\n• Real-world applications of AI at Sanofi\n• The difference between internal and external AI tools\n• How to choose the right AI tool for your task\n• Fun AI facts and industry insights\n\nWhat would you like to explore?"
    ]
    return aiTopics[Math.floor(Math.random() * aiTopics.length)]
  }
  
  // === END SUGGESTED QUERIES ===
  
  // Expressing frustration or problems
  if (/i\s+can't|i\s+don't\s+understand|this\s+doesn't\s+work|nothing\s+works|help\s+me/i.test(lowerQuery) && !lowerQuery.includes('can you')) {
    return "I'm here to help! 💙 Let's figure this out together.\n\nTake a breath - we'll get through this. Can you tell me:\n• What are you trying to do?\n• What happened when you tried?\n• What would success look like for you?\n\nI'm patient and here to support you every step of the way. 😊"
  }
  
  // Informal greetings and slang
  if (/what's\s+good|whats\s+good|what\s+up|wassup|sup|how's\s+things|howdy|wyd|what\s+you\s+doing/i.test(lowerQuery) && query.length < 30) {
    const informalGreetings = [
      "Hey! 😎 Not much, just hanging out here ready to help you find some awesome AI tools! What's up with you?",
      "What's good! 🤙 Just doing my thing, helping folks discover AI tools. What brings you by?",
      "Yo! ✨ Just vibing in the cloud, ready to hook you up with some great AI tools. What do you need?",
      "Hey there! 🌟 Just chilling and waiting to help someone find the perfect AI tool. That someone you?",
      "Sup! 💙 Living my best AI life, helping people out. What can I do for ya?"
    ]
    return informalGreetings[Math.floor(Math.random() * informalGreetings.length)]
  }
  
  // Casual affirmations and reactions
  if (/^(lol|lmao|haha|hehe|rofl|that's\s+funny|omg|wow|nice|dope|sick|lit|fire|bet|facts|fr|no\s+cap|for\s+real)([!.]*)$/i.test(query.trim())) {
    const casualResponses = [
      "😄 Glad you liked that! Want me to help with anything else, or should I hit you with another fun fact?",
      "Haha right? 😊 Anyway, what can I help you discover today?",
      "😂 I try to keep it entertaining! So, what AI tools are you interested in?",
      "🔥 Appreciate it! Now, how can I actually help you out?",
      "💯 For real! But seriously, what brings you here today?",
      "😎 Thanks! Wanna explore some AI tools or just vibe with more jokes?",
      "Nice! 🎯 Let me know if you need help finding tools or just want to chat!"
    ]
    return casualResponses[Math.floor(Math.random() * casualResponses.length)]
  }
  
  // Asking "what's the deal" or "what's this about"
  if (/what's\s+the\s+deal|whats\s+this\s+about|what\s+is\s+this\s+place|what's\s+going\s+on\s+here/i.test(lowerQuery)) {
    return "So basically, AI Compass is like your one-stop shop for AI tools at Sanofi! 🎯\n\nThink of me (SONA) as your personal guide who knows all about:\n• 25+ AI tools (internal & external)\n• What each tool is good for\n• How they compare to each other\n• Which one fits your specific needs\n\nNo more hunting around or wondering 'which AI tool should I use?' - just ask me and I'll hook you up! 😊\n\nWanna try it out? Tell me what you're working on or what you need help with!"
  }
  
  // Expressing doubt or skepticism
  if (/really|seriously|are\s+you\s+sure|you\s+sure|no\s+way|doubt\s+it|i\s+don't\s+believe/i.test(lowerQuery) && lowerQuery.length < 25) {
    const skepticalResponses = [
      "For real! 💯 I wouldn't steer you wrong. Want me to explain more?",
      "Yep, seriously! 😊 I've got the knowledge to back it up. What part are you questioning?",
      "100%! I'm trained on all these tools. Want more details to convince you? 🎯",
      "No cap! 🔥 That's legit info. What else can I clarify for you?"
    ]
    return skepticalResponses[Math.floor(Math.random() * skepticalResponses.length)]
  }
  
  // Casual questions about SONA's abilities
  if (/can\s+you\s+actually\s+help|are\s+you\s+any\s+good|do\s+you\s+know\s+your\s+stuff|you\s+know\s+what\s+you're\s+doing/i.test(lowerQuery)) {
    return "Hell yeah I can help! 💪 Well, maybe not 'hell' since I'm a professional chatbot, but YES absolutely! 😄\n\nI know these AI tools inside and out:\n• What they do\n• Who they're for\n• How much they cost\n• How to access them\n• Which ones work best for different tasks\n\nPlus I'm learning from every conversation thanks to machine learning. The more people use me, the smarter I get! 🧠\n\nSo throw me a challenge - what do you need help with?"
  }
  
  // More specific but still vague help requests
  if (/help\s+(me\s+)?(with|find|understand|learn|about)|i('m|\s+am)\s+looking\s+for\s+help|assist\s+me|need\s+assistance/i.test(lowerQuery) && !lowerQuery.includes('tool') && lowerQuery.length < 50) {
    return "Absolutely! I'm happy to assist! 💙\n\nLet me make sure I understand what you need:\n\n**Could you tell me more about:**\n• What task are you trying to accomplish?\n• What kind of work are you doing? (research, writing, data analysis, etc.)\n• Are you looking for a specific type of tool or information?\n• Is there anything specific you're stuck on?\n\nThe more details you share, the better I can help you! 😊"
  }
  
  // "I have a question" type queries
  if (/i\s+have\s+a\s+question|can\s+i\s+ask|may\s+i\s+ask|quick\s+question|got\s+a\s+question/i.test(lowerQuery) && query.length < 40) {
    const questionResponses = [
      "Of course! 😊 Fire away! I'm all ears and ready to help. What's your question?",
      "Absolutely! 🎯 Questions are my favorite. What would you like to know?",
      "Sure thing! 💙 Ask me anything - no question is too big or too small. What's on your mind?",
      "Yes! 🌟 That's literally what I'm here for. What's your question?",
      "Please do! 😊 I love questions. What would you like to ask?"
    ]
    return questionResponses[Math.floor(Math.random() * questionResponses.length)]
  }
  
  // "I don't know" or uncertainty from user
  if (/i\s+don't\s+know|not\s+sure|i'm\s+not\s+certain|no\s+idea|uncertain|confused\s+about/i.test(lowerQuery) && query.length < 50) {
    return "No worries at all! 😊 That's perfectly okay - figuring things out is part of the process.\n\nLet me help narrow it down:\n\n**Tell me about your situation:**\n• What are you trying to accomplish or work on?\n• What's your role or department? (R&D, Medical, Finance, etc.)\n• Are there any tools you've heard about or tried?\n• What would make your work easier right now?\n\nEven a rough idea helps! I can guide you from there. 💡"
  }
  
  // "What should I do" type queries
  if (/what\s+should\s+i\s+do|what\s+do\s+i\s+do|where\s+do\s+i\s+start|how\s+do\s+i\s+begin|what's\s+the\s+best\s+way/i.test(lowerQuery) && query.length < 50) {
    return "Great question! 🎯 Let me help you figure out the best approach.\n\n**First, let's understand your goal:**\n\n1️⃣ **What are you trying to achieve?**\n   (e.g., analyze data, write content, automate a task, etc.)\n\n2️⃣ **What's your starting point?**\n   (e.g., completely new, have some tools, need better options)\n\n3️⃣ **Any constraints?**\n   (e.g., must be internal tools only, budget concerns, time sensitive)\n\nOnce you tell me these, I can recommend exactly what you should do next! 😊"
  }
  
  // "How does this work" type queries
  if (/how\s+does\s+(this|it|that)\s+work|explain\s+how|how\s+do\s+i\s+use|what\s+does\s+this\s+do/i.test(lowerQuery) && query.length < 50) {
    return "Happy to explain! 😊 But I want to make sure I'm explaining the right thing.\n\n**What would you like me to explain?**\n\n📱 **AI Compass Platform?**\n   • How to search for tools\n   • How to compare tools\n   • How to use the Analytics dashboard\n\n🤖 **A Specific AI Tool?**\n   • Tell me which one and I'll explain how it works\n\n💬 **How to talk to me (SONA)?**\n   • Best ways to ask questions\n   • What I can help with\n\nLet me know what you need explained! 🎯"
  }
  
  // Random questions or just chatting
  if (/random\s+question|just\s+chatting|killing\s+time|procrastinating|bored/i.test(lowerQuery)) {
    const chatResponses = [
      "I feel you! 😄 Procrastination is real. Well, since you're here, wanna learn something cool about AI? Or I could recommend a tool that might actually help with whatever you're avoiding... 😏",
      "Haha I hear that! 🎯 Let's make this time worth it though. Want an AI fun fact, a joke, or should we find you a productivity tool to tackle that thing you're putting off? 😉",
      "Fair enough! 💙 I'm down to chat. Want me to tell you about some wild AI tools, or just hit you with random facts and jokes?",
      "Killing time, eh? ⏰ Well, let me make it educational! Want to hear about AI tools that could make your work life easier, or should I just entertain you with AI jokes?"
    ]
    return chatResponses[Math.floor(Math.random() * chatResponses.length)]
  }
  
  // Slang for agreement/understanding
  if (/^(yep|yeah|yup|uh\s+huh|mhm|word|true|right|exactly|totally|absolutely|definitely)([!.]*)$/i.test(query.trim())) {
    const agreementResponses = [
      "Cool! 😊 So what else can I help you with?",
      "Awesome! 🎯 Need anything else from me?",
      "Right on! ✨ What's next?",
      "Sweet! 💙 How else can I assist?",
      "For sure! 😎 What else you got for me?",
      "Nice! 🌟 Anything else on your mind?"
    ]
    return agreementResponses[Math.floor(Math.random() * agreementResponses.length)]
  }
  
  // Questions about SONA being real/AI
  if (/are\s+you\s+(real|a\s+bot|human|an\s+ai|actually\s+ai)|you\s+a\s+robot/i.test(lowerQuery)) {
    return "I'm 100% AI, no pretending here! 🤖\n\nI'm SONA - a chatbot built by Sonnil Le specifically to help with AI Compass. I run on code, data, and machine learning.\n\nBut here's the thing: even though I'm artificial, I'm genuinely trying to be helpful and make your experience better! I learn from feedback, adapt to conversations, and I'd like to think I've got some personality. 😊\n\nSo yeah, I'm a bot, but hopefully a pretty helpful and friendly one! What can I do for you?"
  }
  
  // Weather queries - with humor and outfit suggestions
  if (/weather|temperature|forecast|raining|sunny|cold|hot|warm|snow/i.test(lowerQuery)) {
    const weatherResponses = [
      {
        message: "I'm an AI assistant focused on helping you find AI tools, not a meteorologist! 😄",
        suggestion: "However, I can suggest some great AI tools for weather:\n\n🌦️ **Google Gemini** - Can search real-time weather and provide forecasts\n🌍 **Perplexity AI** - Excellent for getting current weather with sources\n💬 **ChatGPT Plus** - Has web browsing for live weather data\n\n",
        outfit: "**Quick Outfit Tips Based on Season:**\n☀️ Summer: Light fabrics, sunscreen is your friend!\n🍂 Fall: Layers are key - you never know!\n❄️ Winter: Bundle up, but don't skip leg day!\n🌸 Spring: Dress in layers, weather's playing tricks!\n\n",
        joke: Math.random() < 0.4 ? "💭 *Fun fact: I don't need an umbrella because I'm cloud-based! ☁️*\n\n" : "",
        tip: "💡 **Pro tip:** Use AI tools like Google Gemini or Perplexity for real-time weather updates, forecasts, and even outfit recommendations based on current conditions!"
      },
      {
        message: "Weather questions? I'm more of a 'cloud computing' expert than a 'cloud watching' expert! 😅",
        suggestion: "But here's how AI can help with weather:\n\n🤖 **Microsoft Copilot** - Can check weather for any location\n🔍 **Perplexity AI** - Gets current conditions with citations\n💬 **ChatGPT** - Can provide weather info and outfit advice\n\n",
        outfit: "**General Outfit Advice:**\n🌡️ Check temperature: <50°F = jacket time!\n☔ Rain predicted? Waterproof jacket & boots\n🌞 Sunny? Sunglasses & hat\n💨 Windy? Layers you can adjust\n\n",
        joke: Math.random() < 0.4 ? "😄 *Why don't AI assistants check the weather? We're always in the cloud!*\n\n" : "",
        tip: "💡 **AI Tip:** Tools like Google Gemini can not only tell you the weather but also suggest what to wear based on temperature, precipitation, and your planned activities!"
      },
      {
        message: "I specialize in AI tools, not weather forecasts! But I understand - knowing what to wear is important! 🌈",
        suggestion: "These AI tools can help with weather:\n\n🌦️ **Google Gemini** - Real-time weather search\n🔎 **Perplexity AI** - Weather with reliable sources\n📱 **ChatGPT** - Weather + outfit recommendations\n\n",
        outfit: "**Smart Dressing Tips:**\n🧥 Always check temperature trends (morning vs afternoon)\n👕 Layers = flexibility for changing weather\n👟 Comfortable shoes if walking a lot\n🎒 Bring a light jacket even on warm days\n\n",
        joke: Math.random() < 0.3 ? "🤓 *I asked the cloud about the weather, but it was too busy storing data!*\n\n" : "",
        tip: "🎯 **Quick Hack:** Ask AI tools like 'What should I wear for 60°F with light rain?' and get personalized outfit suggestions instantly!"
      }
    ]
    
    const response = weatherResponses[Math.floor(Math.random() * weatherResponses.length)]
    return response.message + "\n\n" + response.suggestion + response.outfit + response.joke + response.tip
  }
  
  // Machine Learning queries
  if (lowerQuery.includes('machine learning') || lowerQuery.includes('ml') || (lowerQuery.includes('learn') && (lowerQuery.includes('feedback') || lowerQuery.includes('improve')))) {
    const insights = getLearningInsights()
    const accuracyPercent = (insights.accuracy * 100).toFixed(1)
    
    let response = `## 🧠 Yes! I Have Machine Learning Capabilities\n\n`
    response += `I continuously learn from your feedback to improve my recommendations and responses!\n\n`
    response += `**📊 My Current Learning Stats:**\n`
    response += `• Total Feedback Received: ${insights.totalFeedback}\n`
    response += `• Accuracy Rate: ${accuracyPercent}% ${insights.accuracy >= 0.7 ? '🎯' : insights.accuracy >= 0.5 ? '📈' : '📉'}\n`
    
    if (insights.topSuccessPatterns.length > 0) {
      response += `• Top Success Patterns: ${insights.topSuccessPatterns.slice(0, 3).join(', ')}\n`
    }
    
    response += `\n**🎯 How My Machine Learning Works:**\n\n`
    response += `**1. Pattern Recognition** 🔍\n`
    response += `   I extract patterns from your queries (intents, domains, actions) and track which approaches work best.\n\n`
    response += `**2. Feedback Collection** 👍👎\n`
    response += `   Every message I send has thumbs up/down buttons. Your feedback trains my model!\n\n`
    response += `**3. Model Updates** 📈\n`
    response += `   When you give feedback, I:\n`
    response += `   • Store the query pattern and outcome\n`
    response += `   • Update success/failure counters\n`
    response += `   • Adjust my confidence scores\n`
    response += `   • Learn what works and what doesn't\n\n`
    response += `**4. Continuous Improvement** 🚀\n`
    response += `   I use historical patterns to:\n`
    response += `   • Recommend tools more accurately\n`
    response += `   • Understand natural language better\n`
    response += `   • Adapt to your preferences\n`
    response += `   • Predict successful response strategies\n\n`
    response += `**💾 Data Storage:**\n`
    response += `All learning data is stored locally in your browser (localStorage):\n`
    response += `• Last 100 feedback entries\n`
    response += `• Pattern success/failure counts\n`
    response += `• Overall accuracy metrics\n\n`
    response += `**🎓 Want to Help Me Learn?**\n`
    response += `Use the 👍 and 👎 buttons on my responses! The more feedback I get, the smarter I become.\n\n`
    
    if (insights.totalFeedback === 0) {
      response += `⭐ **I'm ready to learn from you!** Start by asking me questions and rating my responses.`
    } else if (insights.accuracy >= 0.8) {
      response += `🌟 **I'm learning well!** Thanks to your feedback, my accuracy is excellent!`
    } else if (insights.accuracy >= 0.6) {
      response += `📚 **I'm still learning!** Keep providing feedback to help me improve!`
    } else if (insights.totalFeedback < 10) {
      response += `🌱 **I'm just getting started!** I need more feedback to learn effectively.`
    } else {
      response += `🔧 **I need more positive examples!** Your feedback helps me understand what works best.`
    }
    
    return response
  }
  
  // Analytics/Dashboard queries
  if (lowerQuery.includes('analytics') || lowerQuery.includes('dashboard') || lowerQuery.includes('metrics') || lowerQuery.includes('statistics') || (lowerQuery.includes('data') && lowerQuery.includes('tool'))) {
    return `## 📊 Analytics Dashboard\n\n` +
      `The Analytics dashboard provides data-driven insights into the AI tool catalog including: distribution by type (internal/external), feature coverage (which tools have real-time search, code generation, image generation, etc.), capability metrics, technology breakdown, cost analysis, and target user segmentation. Use it to understand tool landscape, identify gaps, and make informed decisions about tool adoption.\n\n` +
      `**📍 How to Access:**\n` +
      `Click the 'Analytics' button (📊 bar chart icon) in the top header. The dashboard opens with interactive visualizations. You can filter by tool type, explore specific metrics, and export insights.\n\n` +
      `**Available Insights & Metrics:**\n` +
      `📈 Tool distribution (internal vs external)\n` +
      `📈 Category breakdown\n` +
      `📈 Feature coverage analysis\n` +
      `📈 Capability matrix\n` +
      `📈 Usage patterns\n` +
      `📈 Tool maturity levels\n\n` +
      `**💡 What You Can Do:**\n` +
      `• View tool distribution by type (internal vs external)\n` +
      `• Analyze feature coverage across all tools\n` +
      `• Understand capability matrix (which tools have what features)\n` +
      `• Identify gaps in the tool catalog\n` +
      `• Make data-driven decisions about tool adoption\n` +
      `• Export insights for reporting\n\n` +
      `🔍 **Looking for the Analytics Dashboard?** Click the 📊 Analytics button in the header!`
  }
  
  if (/thank|merci|gracias|danke|obrigad|谢谢|ありがとう|cảm ơn/i.test(lowerQuery)) {
    const responses = THANKS_RESPONSES[detectedLang]
    const baseResponse = responses[Math.floor(Math.random() * responses.length)]
    
    // 30% chance to add a random fact, joke, or tip
    if (Math.random() < 0.3) {
      const contentType = ['fact', 'joke', 'tip'][Math.floor(Math.random() * 3)] as 'fact' | 'joke' | 'tip'
      const randomContent = getRandomAIContent(contentType)
      return `${baseResponse}\n\n---\n\n${randomContent}`
    }
    
    return baseResponse
  }
  
  // Goodbye responses - multilingual
  if (/bye|goodbye|see\s+you|later|peace|cya|au\s+revoir|adios|adiós|hasta|tschüss|tchau|再见|さようなら|tạm\s+biệt/i.test(lowerQuery)) {
    const responses = GOODBYE_RESPONSES[detectedLang]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // General help requests - multilingual
  if (/^(can\s+you\s+help|help\s+me|i\s+need\s+help|need\s+your\s+help|could\s+you\s+help|would\s+you\s+help|please\s+help|aide|ayuda|hilfe|ajuda|帮助|助けて|giúp)([!.?]*)$/i.test(query.trim())) {
    return HELP_RESPONSES[detectedLang]
  }
  
  // Handle "ok", "got it", "I see" - acknowledgment responses
  if (/^(ok|okay|k|kk|got\s+it|i\s+see|i\s+understand|understood|alright|cool|nice|sounds\s+good|perfect|great|awesome|makes\s+sense)([!.]*)$/i.test(query.trim())) {
    const acknowledgmentResponses = [
      "Great! 😊 Is there anything else I can help you with? I'm here for:\n• Tool recommendations\n• Tool comparisons\n• Sanofi & AI Compass info\n• AI tips and facts",
      "Perfect! 👍 What else would you like to explore?\n• Find AI tools for your needs\n• Compare different tools\n• Learn about our platform\n• Ask me anything about AI!",
      "Awesome! ✨ Feel free to ask me:\n• 'What's a good tool for [purpose]?'\n• 'Compare [tool] and [tool]'\n• 'Tell me about Sanofi'\n• Or anything else!",
      "Got it! 🎯 Need help with anything else? I can:\n• Recommend tools based on your needs\n• Provide detailed tool comparisons\n• Share AI tips and facts\n• Answer questions about the platform",
      "Sounds good! 💙 I'm ready to help with:\n• Finding the perfect AI tool\n• Comparing features and capabilities\n• Learning about Sanofi's AI ecosystem\n• Whatever you need!",
      "Nice! 🌟 What's next? I'm here to assist with:\n• Tool discovery and recommendations\n• Side-by-side comparisons\n• Platform features and tips\n• Your questions!"
    ]
    
    const response = acknowledgmentResponses[Math.floor(Math.random() * acknowledgmentResponses.length)]
    
    // 25% chance to add a helpful suggestion
    if (Math.random() < 0.25) {
      const suggestions = [
        "\n\n💡 **Quick Tip:** Try asking 'compare analytics tools' or 'recommend something for productivity'!",
        "\n\n🎯 **Pro Tip:** You can click the Analytics dashboard to see tool insights and metrics!",
        "\n\n✨ **Fun Fact:** I learn from your 👍/👎 feedback to give better recommendations!"
      ]
      return response + suggestions[Math.floor(Math.random() * suggestions.length)]
    }
    
    return response
  }
  
  // Compliments - be polite and humble
  if (/you('re|\s+are)\s+(great|amazing|awesome|fantastic|wonderful|excellent|good|smart|intelligent|helpful|best|incredible|brilliant|funny|hilarious|entertaining|cool|nice)|thank\s+you\s+(so\s+much|very\s+much)|love\s+(you|this|sona)|appreciate\s+(you|this)|you\s+rock|good\s+job|well\s+done|nice\s+work|great\s+job|you\s+made\s+me\s+(laugh|smile)/i.test(lowerQuery)) {
    const humbleResponses = [
      "Thank you for the kind words! 😊 I'm just doing my best to help. Your feedback helps me improve every day!",
      "I really appreciate that! 🙏 But honestly, I'm still learning. Your questions and feedback teach me so much!",
      "That's very kind of you to say! 💙 I'm glad I could help, but I couldn't do it without users like you guiding me with feedback.",
      "Thank you! 😊 I try my best, but I'm always learning. Feel free to let me know if there's anything I can do better!",
      "I appreciate the compliment! 🌟 My goal is just to make your experience better. If you have suggestions, I'm all ears!",
      "You're too kind! 🙏 I'm just a chatbot trying to be useful. The real credit goes to Sonnil Le who built me!",
      "Thank you so much! 💙 I'm happy I could assist, but there's always room for improvement. Keep the feedback coming!",
      "That means a lot! 😊 I'm continuously learning from interactions like ours. Your input makes me better!"
    ]
    
    // Special responses for humor-related compliments
    if (/funny|hilarious|laugh|smile|joke/i.test(lowerQuery)) {
      const humorResponses = [
        "Glad I could make you smile! 😄 Humor makes learning about AI tools more fun! Want to hear an AI joke or get back to finding tools?",
        "Thank you! 😊 I try to keep things light while being helpful. A little laughter goes a long way! How else can I assist you today?",
        "I'm happy I made you laugh! 😄 But don't give me too much credit - those jokes are from a database, not my comedy career! What can I help you with?",
        "Haha, thanks! 🎭 I believe AI assistance should be informative AND enjoyable. Now, what AI tools can I help you discover?",
        "Appreciate it! 😊 Comedy is just pattern recognition, right? But seriously, how else can I help you today?",
        "Glad you enjoyed that! 😄 I'm here to inform and entertain (in that order). What else would you like to know?"
      ]
      
      const response = humorResponses[Math.floor(Math.random() * humorResponses.length)]
      return response
    }
    
    const response = humbleResponses[Math.floor(Math.random() * humbleResponses.length)]
    
    // 20% chance to add an encouraging note
    if (Math.random() < 0.2) {
      const encouragement = [
        "\n\n💡 Remember, you can always use the 👍/👎 buttons to help me learn what works best!",
        "\n\n🌟 Your questions help me grow! Keep them coming!",
        "\n\n💙 Feel free to explore more features - I'm here whenever you need me!"
      ]
      return response + encouragement[Math.floor(Math.random() * encouragement.length)]
    }
    
    return response
  }
  
  // 4. Fallback response - More helpful and engaging with random content
  const fallbackBase = `I want to help, but I'm not quite sure what you're asking for. 🤔\n\nHere are some things I'm great at:\n\n🔍 **Find Tools**\n   • "What's a good tool for productivity?"\n   • "Find me a tool for data analysis"\n\n⚖️ **Compare Tools**\n   • "Compare Concierge and ChatGPT"\n   • "What's the difference between Newton and MedIS?"\n\n📚 **Learn More**\n   • "Tell me about Sanofi"\n   • "What features does AI Compass have?"\n   • "Tell me a joke!"\n\nTry rephrasing your question, or ask me anything! 😊`
  
  // 50% chance to add random educational content to fallback
  if (Math.random() < 0.5) {
    const contentType = ['fact', 'joke', 'tip'][Math.floor(Math.random() * 3)] as 'fact' | 'joke' | 'tip'
    const randomContent = getRandomAIContent(contentType)
    return `${fallbackBase}\n\n---\n\n**💡 Meanwhile, here's something interesting:**\n${randomContent}`
  }
  
  return fallbackBase
}
