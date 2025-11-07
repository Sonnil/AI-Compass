
import type { LanguageCode } from './types.js';

function normalizeQuery(query: string): string {
  let normalized = query.toLowerCase().trim();
  const typoMap: Record<string, string> = {
    'chatgpt': 'chatgpt', 'chat gpt': 'chatgpt', 'copilot': 'microsoft copilot',
    'recomend': 'recommend', 'reccomend': 'recommend', 'sugest': 'suggest',
    'ecommend': 'recommend',
    'compair': 'compare', 'comparision': 'comparison', 'analitics': 'analytics',
    'wht': 'what', 'whats': 'what is', 'hows': 'how is', 'thx': 'thanks', 'ty': 'thank you',
  };

  Object.entries(typoMap).forEach(([typo, correction]) => {
    const regex = new RegExp(`\\b${typo}\\b`, 'gi');
    normalized = normalized.replace(regex, correction);
  });

  return normalized.replace(/\s+/g, ' ').trim();
}

export function detectLanguage(query: string): LanguageCode {
  const lowerQuery = query.toLowerCase();
  if (/bonjour|merci|français/i.test(lowerQuery)) return 'fr';
  if (/hola|gracias|español/i.test(lowerQuery)) return 'es';
  if (/hallo|danke|deutsch/i.test(lowerQuery)) return 'de';
  if (/olá|obrigado|português/i.test(lowerQuery)) return 'pt';
  if (/[\u4e00-\u9fa5]/.test(query)) return 'zh';
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(query)) return 'ja';
  if (/xin chào|cảm ơn|tiếng việt/i.test(lowerQuery)) return 'vi';
  return 'en';
}

export function decideToolCall(query: string, tools: any[]): { toolName: string, toolInput: any } | null {
  const normalizedQuery = normalizeQuery(query);
  const lowerQuery = normalizedQuery.toLowerCase();

  // Audience keyword mapping for better recommendations
  const AUDIENCE_TO_KEYWORDS: Record<string, string[]> = {
    manufacturing: ['manufacturing', 'plant', 'factory', 'shop floor', 'operations', 'production', 'gxp', 'gmp', 'quality', 'qa', 'qc', 'inspection', 'supply chain'],
    scientist: ['scientist', 'r&d', 'research', 'lab', 'biology', 'chemistry'],
    clinicians: ['clinician', 'medical', 'doctor', 'hcp', 'clinical'],
    finance: ['finance', 'fp&a', 'accounting', 'budget', 'cost'],
    marketing: ['marketing', 'brand', 'campaign', 'content'],
    it: ['it', 'engineering', 'developers', 'dev', 'platform', 'infra', 'security']
  };

  function normalizeAudienceToKeywords(text: string): string[] {
    const q = text.toLowerCase().trim();
    const found: string[] = [];
    // Phrase synonyms expansion
    const PHRASE_SYNONYMS: Record<string, string[]> = {
      'shop floor qa': ['quality', 'quality assurance', 'inspection', 'manufacturing', 'plant'],
      'shop floor': ['manufacturing', 'plant', 'operations'],
      'production operations': ['production', 'operations', 'manufacturing', 'plant'],
      'quality assurance': ['quality', 'qa', 'inspection'],
    };
    Object.entries(PHRASE_SYNONYMS).forEach(([phrase, syns]) => {
      if (q.includes(phrase)) found.push(...syns);
    });

    // Token synonyms expansion
    const TOKEN_SYNONYMS: Record<string, string[]> = {
      qa: ['quality', 'inspection', 'quality assurance'],
      ops: ['operations'],
      prod: ['production'],
      rd: ['r&d', 'research'],
    };
    q.split(/[^a-zA-Z0-9&]+/).forEach(tok => {
      const syns = TOKEN_SYNONYMS[tok as keyof typeof TOKEN_SYNONYMS];
      if (syns) found.push(...syns);
    });

    for (const [aud, kws] of Object.entries(AUDIENCE_TO_KEYWORDS)) {
      if (q.includes(aud)) found.push(...kws);
    }
    return Array.from(new Set([...found, ...q.split(/\s+/).filter(Boolean)]));
  }

  if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('difference between')) {
    const mentionedTools = tools.filter(tool => lowerQuery.includes(tool.name.toLowerCase()));
    if (mentionedTools.length >= 2) {
      return { toolName: 'compareTools', toolInput: { toolIds: mentionedTools.map(t => t.name) } };
    }
    const categories = ['productivity', 'research', 'creative', 'data', 'collaboration'];
    const matchedCategory = categories.find(cat => lowerQuery.includes(cat));
    if (matchedCategory) {
        const categoryTools = tools.filter(tool => (tool.tags || []).includes(matchedCategory));
        if (categoryTools.length >= 2) {
            return { toolName: 'compareTools', toolInput: { toolIds: categoryTools.map(t => t.name), category: matchedCategory } };
        }
    }
  }

  // NEW: catch “recommend/best/which tool … for <audience/topic>”
  const recForMatch =
    lowerQuery.match(/\b(recommend|suggest)\b.*\btool(s)?\b.*\bfor\b\s+(.+)$/) ||
    lowerQuery.match(/\b(which|what)\b.*\btool(s)?\b.*\b(best|good)\b.*\bfor\b\s+(.+)$/);
  if (recForMatch) {
    const audience = (recForMatch[recForMatch.length - 1] || '').trim();
    if (audience) {
      return { toolName: 'recommendTool', toolInput: { keywords: normalizeAudienceToKeywords(audience) } };
    }
  }

  // Short queries like “manufacturing users” or “best for manufacturing”
  if (/\bmanufacturing\b/.test(lowerQuery)) {
    return { toolName: 'recommendTool', toolInput: { keywords: normalizeAudienceToKeywords('manufacturing') } };
  }

  const hasActionKeyword = /\b(recommend|suggest|find|need|looking for|about)\b/i.test(normalizedQuery);
  const hasToolKeyword = /\b(tool|app|software)\b/i.test(normalizedQuery);
  const hasTopicKeyword = /\b(data|analytics|productivity|creative|research|collaboration|writing|analysis)\b/i.test(normalizedQuery)

  if ((hasActionKeyword && hasToolKeyword) || (hasActionKeyword && hasTopicKeyword)) {
    return { toolName: 'recommendTool', toolInput: { query: normalizedQuery } };
  }
  
  if (!hasActionKeyword && hasTopicKeyword) {
    return { toolName: 'recommendTool', toolInput: { query: normalizedQuery } };
  }
  
  // Generic "find tool" or "find perfect tool" requests
  if (/\b(find|get|show|give)\b.*\b(tool|AI\s+tool)/i.test(normalizedQuery)) {
    return { toolName: 'recommendTool', toolInput: { query: normalizedQuery } };
  }

  // Check for specific tool name mentions (use word boundaries to avoid substring matches like "plai" in "explain")
  const toolMatch = tools.find(tool => {
    const toolName = tool.name.toLowerCase();
    // Use word boundary regex to match whole words only
    const regex = new RegExp(`\\b${toolName}\\b`, 'i');
    return regex.test(lowerQuery);
  });
  if (toolMatch) {
    return { toolName: toolMatch.name, toolInput: { query: normalizedQuery } };
  }

  if (lowerQuery.includes('sanofi')) {
    return { toolName: 'getSanofiInfo', toolInput: { query: normalizedQuery } };
  }
  
  if (lowerQuery.includes('compass') && (lowerQuery.includes('feature') || lowerQuery.includes('about ai compass'))) {
      return { toolName: 'getAICompassFeatures', toolInput: { query: normalizedQuery } };
  }

  if (lowerQuery.includes('fact') || lowerQuery.includes('joke') || lowerQuery.includes('tip')) {
    if (lowerQuery.includes('fact')) return { toolName: 'getFunFact', toolInput: {} };
    if (lowerQuery.includes('joke')) return { toolName: 'getAIJoke', toolInput: {} };
    if (lowerQuery.includes('tip')) return { toolName: 'getAITip', toolInput: {} };
  }

  return null;
}
