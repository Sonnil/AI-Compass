
import type { LanguageCode } from './types.js';

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  pt: 'Portuguese',
  zh: 'Chinese',
  ja: 'Japanese',
  vi: 'Vietnamese'
} as const;

export const TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
    "Hello": { en: "Hello", fr: "Bonjour", es: "Hola", de: "Hallo", pt: "Olá", zh: "你好", ja: "こんにちは", vi: "Xin chào" },
    "Goodbye": { en: "Goodbye", fr: "Au revoir", es: "Adiós", de: "Auf Wiedersehen", pt: "Adeus", zh: "再见", ja: "さようなら", vi: "Tạm biệt" },
    "Thank you": { en: "Thank you", fr: "Merci", es: "Gracias", de: "Danke", pt: "Obrigado", zh: "谢谢", ja: "ありがとう", vi: "Cảm ơn" },
    "Please": { en: "Please", fr: "S'il vous plaît", es: "Por favor", de: "Bitte", pt: "Por favor", zh: "请", ja: "お願いします", vi: "Vui lòng" },
    "Yes": { en: "Yes", fr: "Oui", es: "Sí", de: "Ja", pt: "Sim", zh: "是", ja: "はい", vi: "Vâng" },
    "No": { en: "No", fr: "Non", es: "No", de: "Nein", pt: "Não", zh: "不", ja: "いいえ", vi: "Không" },
};

export const GREETINGS = {
  en: ["Hello! 👋", "Hi there! 😊", "Hey! 🌟", "Welcome! ✨", "Greetings! 💙"],
  fr: ["Bonjour! 👋", "Salut! 😊", "Bienvenue! ✨", "Coucou! 🌟", "Salutations! 💙"],
  es: ["¡Hola! 👋", "¡Bienvenido! ✨", "¡Saludos! 😊", "¡Hola amigo! 🌟", "¡Hola! 💙"],
  de: ["Hallo! 👋", "Willkommen! ✨", "Grüß dich! 😊", "Guten Tag! 🌟", "Hallo! 💙"],
  pt: ["Olá! 👋", "Bem-vindo! ✨", "Oi! 😊", "Saudações! 🌟", "Olá! 💙"],
  zh: ["你好！👋", "欢迎！✨", "您好！😊", "嗨！🌟", "你好！💙"],
  ja: ["こんにちは！👋", "ようこそ！✨", "やあ！😊", "こんにちは！🌟", "こんにちは！💙"],
  vi: ["Xin chào! 👋", "Chào mừng! ✨", "Chào bạn! 😊", "Xin chào! 🌟", "Xin chào! 💙"]
};

export const SONA_INTRO = {
  en: "I'm SONA, your AI Compass assistant! I help you discover and navigate Sanofi's AI tools.",
  fr: "Je suis SONA, votre assistante AI Compass! Je vous aide à découvrir et naviguer parmi les outils IA de Sanofi.",
  es: "¡Soy SONA, tu asistente de AI Compass! Te ayudo a descubrir y navegar las herramientas de IA de Sanofi.",
  de: "Ich bin SONA, Ihre AI Compass Assistentin! Ich helfe Ihnen, die KI-Tools von Sanofi zu entdecken und zu navigieren.",
  pt: "Eu sou SONA, sua assistente do AI Compass! Ajudo você a descobrir e navegar pelas ferramentas de IA da Sanofi.",
  zh: "我是SONA，您的AI Compass助手！我帮助您发现和导航赛诺菲的AI工具。",
  ja: "私はSONA、あなたのAI Compassアシスタントです！サノフィのAIツールを発見しナビゲートするお手伝いをします。",
  vi: "Tôi là SONA, trợ lý AI Compass của bạn! Tôi giúp bạn khám phá và điều hướng các công cụ AI của Sanofi."
};

export const HELP_RESPONSES = {
  en: "Of course I can help! 😊 That's exactly what I'm here for!\n\n**What would you like help with?**\n🔍 Finding an AI tool?\n⚖️ Comparing tools?\n📚 Learning about Sanofi's AI ecosystem?\n💡 Something else?",
  fr: "Bien sûr que je peux aider! 😊 C'est exactement pour ça que je suis là!\n\n**Avec quoi aimeriez-vous de l'aide?**\n🔍 Trouver un outil IA?\n⚖️ Comparer des outils?\n📚 Apprendre sur l'écosystème IA de Sanofi?\n💡 Autre chose?",
  es: "¡Por supuesto que puedo ayudar! 😊 ¡Exactamente para eso estoy aquí!\n\n**¿Con qué te gustaría ayuda?**\n🔍 ¿Encontrar una herramienta de IA?\n⚖️ ¿Comparar herramientas?\n📚 ¿Aprender sobre el ecosistema de IA de Sanofi?\n💡 ¿Algo más?",
  de: "Natürlich kann ich helfen! 😊 Genau dafür bin ich hier!\n\n**Wobei möchten Sie Hilfe?**\n🔍 Ein KI-Tool finden?\n⚖️ Tools vergleichen?\n📚 Über das KI-Ökosystem von Sanofi lernen?\n💡 Etwas anderes?",
  pt: "Claro que posso ajudar! 😊 É exatamente para isso que estou aqui!\n\n**Com o que você gostaria de ajuda?**\n🔍 Encontrar uma ferramenta de IA?\n⚖️ Comparar ferramentas?\n📚 Aprender sobre o ecossistema de IA da Sanofi?\n💡 Algo mais?",
  zh: "当然可以帮忙！😊 这正是我在这里的原因！\n\n**您需要什么帮助？**\n🔍 寻找AI工具？\n⚖️ 比较工具？\n📚 了解赛诺菲的AI生态系统？\n💡 其他事情？",
  ja: "もちろん手伝えます！😊 まさにそのために私はここにいます！\n\n**何についてお手伝いが必要ですか？**\n🔍 AIツールを見つける？\n⚖️ ツールを比較する？\n📚 サノフィのAIエコシステムについて学ぶ？\n💡 その他？",
  vi: "Tất nhiên tôi có thể giúp! 😊 Đó chính xác là lý do tôi ở đây!\n\n**Bạn muốn được giúp đỡ về điều gì?**\n🔍 Tìm công cụ AI?\n⚖️ So sánh công cụ?\n📚 Tìm hiểu về hệ sinh thái AI của Sanofi?\n💡 Điều gì khác?"
};

export const THANKS_RESPONSES = {
  en: ["You're welcome! 😊", "Happy to help! 💙", "Anytime! ✨", "My pleasure! 🌟"],
  fr: ["De rien! 😊", "Avec plaisir! 💙", "À tout moment! ✨", "Mon plaisir! 🌟"],
  es: ["¡De nada! 😊", "¡Encantado de ayudar! 💙", "¡Cuando quieras! ✨", "¡Un placer! 🌟"],
  de: ["Gern geschehen! 😊", "Gerne! 💙", "Jederzeit! ✨", "Mit Vergnügen! 🌟"],
  pt: ["De nada! 😊", "Feliz em ajudar! 💙", "Sempre! ✨", "Meu prazer! 🌟"],
  zh: ["不客气！😊", "很高兴帮助您！💙", "随时！✨", "我的荣幸！🌟"],
  ja: ["どういたしまして！😊", "お役に立てて嬉しいです！💙", "いつでも！✨", "どうぞ！🌟"],
  vi: ["Không có gì! 😊", "Vui lòng được giúp đỡ! 💙", "Bất cứ lúc nào! ✨", "Rất vui! 🌟"]
};

export const GOODBYE_RESPONSES = {
  en: ["Goodbye! 👋", "See you later! ✨", "Take care! 💙", "Bye! 😊"],
  fr: ["Au revoir! 👋", "À bientôt! ✨", "Prenez soin de vous! 💙", "Salut! 😊"],
  es: ["¡Adiós! 👋", "¡Hasta luego! ✨", "¡Cuídate! 💙", "¡Chao! 😊"],
  de: ["Auf Wiedersehen! 👋", "Bis später! ✨", "Pass auf dich auf! 💙", "Tschüss! 😊"],
  pt: ["Adeus! 👋", "Até logo! ✨", "Se cuida! 💙", "Tchau! 😊"],
  zh: ["再见！👋", "待会见！✨", "保重！💙", "拜拜！😊"],
  ja: ["さようなら！👋", "また後で！✨", "お大事に！💙", "バイバイ！😊"],
  vi: ["Tạm biệt! 👋", "Hẹn gặp lại! ✨", "Bảo trọng! 💙", "Bye! 😊"]
};

const MYMEMORY_LANG_MAP: Record<LanguageCode, string> = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  de: 'de',
  pt: 'pt',
  zh: 'zh',
  ja: 'ja',
  vi: 'vi'
};

let deeplApiKey: string | null = null;

export function setDeepLApiKey(apiKey: string) {
  deeplApiKey = apiKey;
}

async function translateWithAPI(
  text: string,
  targetLang: LanguageCode,
  sourceLang: LanguageCode = 'en'
): Promise<string | null> {
  if (deeplApiKey) {
    // DeepL API call
    try {
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
        },
        body: JSON.stringify({
          text: [text],
          target_lang: targetLang.toUpperCase(),
          source_lang: sourceLang.toUpperCase(),
        }),
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.translations[0].text;
    } catch (error) {
      console.error('DeepL API error:', error);
      return null;
    }
  }

  // Fallback to MyMemory
  const targetLangCode = MYMEMORY_LANG_MAP[targetLang];
  const sourceLangCode = MYMEMORY_LANG_MAP[sourceLang];
  
  if (!targetLangCode || !sourceLangCode) {
    return null;
  }
  
  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLangCode}|${targetLangCode}`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      if (translated.includes('MYMEMORY WARNING') || translated === text) {
        return null;
      }
      return translated;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function translateText(
  text: string, 
  targetLang: LanguageCode, 
  sourceLang: LanguageCode = 'en'
): Promise<{ translation: string, method: 'dictionary' | 'api' | 'unavailable' }> {
  const lowerText = text.toLowerCase();
  for (const [key, translations] of Object.entries(TRANSLATIONS)) {
    if (key.toLowerCase() === lowerText) {
      return { translation: translations[targetLang], method: 'dictionary' };
    }
  }

  // Cross-language dictionary lookup: if the input matches any known translation
  // (e.g., 'bonjour'), map it back through the canonical entry and return in targetLang.
  for (const [, translations] of Object.entries(TRANSLATIONS)) {
    for (const val of Object.values(translations)) {
      if (val.toLowerCase() === lowerText) {
        return { translation: translations[targetLang], method: 'dictionary' };
      }
    }
  }

  // Try API translation with timeout for longer phrases
  try {
    const apiTranslation = await Promise.race([
      translateWithAPI(text, targetLang, sourceLang),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ]);
    if (apiTranslation) {
      return { translation: apiTranslation, method: 'api' };
    }
  } catch (err) {
    // Timeout or API error - fall through to unavailable
  }

  return { translation: '', method: 'unavailable' };
}
