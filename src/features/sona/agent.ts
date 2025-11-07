
import type { Msg, UserProfile, ToolResult } from './types.js';
import { decideToolCall } from './intents.js';
import { generateIntelligentResponse } from './responses.js';
import { getRandomAIContent, getSanofiResponse, getAICompassFeaturesResponse, getSonnilLeResponse, getContactResponse } from './knowledge.js';

export async function* streamResponse(response: string) {
  const words = response.split(/(\s+)/);
  for (let i = 0; i < words.length; i++) {
    yield words.slice(0, i + 1).join('');
    await new Promise(resolve => setTimeout(resolve, 20));
  }
}

export async function executeTool(toolName: string, toolInput: any, tools: any[], userProfile: UserProfile): Promise<ToolResult> {
  try {
    switch (toolName) {
      case 'recommendTool': {
        const fillerWords = /\b(recommend|suggest|what|which|best|good|tool|tools|for|a|an|the|find|me|is|to)\b/gi;
        const providedKeywords: string[] | undefined = toolInput?.keywords;
        const keywordsString = (toolInput?.query || '').replace(fillerWords, ' ').trim().toLowerCase();
        const keywords = (providedKeywords && providedKeywords.length > 0)
          ? providedKeywords.map(k => k.toLowerCase())
          : keywordsString.split(/\s+/).filter((k: string) => k.length > 1);

        function textIncludes(hay: string | undefined, needles: string[]): number {
          if (!hay) return 0;
          const h = String(hay).toLowerCase();
          return needles.reduce((s, n) => (h.includes(n) ? s + 1 : s), 0);
        }

        const weighted = tools.map(tool => {
          const nameScore = textIncludes(tool.name, keywords) * 2;
          const purposeScore = textIncludes(tool.primaryPurpose, keywords) * 2;
          const bestUseScore = textIncludes(tool.bestUseCase, keywords) * 2;
          const tagScore = Array.isArray(tool.tags) ? textIncludes(tool.tags.join(' '), keywords) * 3 : 0;
          const usersScore = textIncludes(tool.targetUsers, keywords) * 4; // emphasize audience fit
          const total = nameScore + purposeScore + bestUseScore + tagScore + usersScore;
          return { tool, score: total };
        });

        const top = weighted
          .filter(w => w.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(w => w.tool);

        return { ok: true, data: top, meta: { toolName, toolInput } };
      }
      case 'compareTools': {
        const compared = tools.filter(tool => toolInput.toolIds.includes(tool.name));
        return { ok: true, data: compared, meta: { toolName, toolInput } };
      }
      case 'getSanofiInfo':
        return { ok: true, data: getSanofiResponse(toolInput.query), meta: { toolName, toolInput } };
      case 'getAICompassFeatures':
        return { ok: true, data: getAICompassFeaturesResponse(toolInput.query), meta: { toolName, toolInput } };
      case 'getSonnilLeInfo':
        return { ok: true, data: getSonnilLeResponse(toolInput.query), meta: { toolName, toolInput } };
      case 'getContactInfo':
        return { ok: true, data: getContactResponse(toolInput.query), meta: { toolName, toolInput } };
      case 'getFunFact':
        return { ok: true, data: getRandomAIContent('fact'), meta: { toolName, toolInput } };
      case 'getAIJoke':
        return { ok: true, data: getRandomAIContent('joke'), meta: { toolName, toolInput } };
      case 'getAITip':
        return { ok: true, data: getRandomAIContent('tip'), meta: { toolName, toolInput } };
      default: {
        const tool = tools.find(t => t.name === toolName);
        if (tool) {
          return { ok: true, data: tool, meta: { toolName, toolInput } };
        }
        return { ok: false, error: `Tool "${toolName}" not found.` };
      }
    }
  } catch (error) {
    return { ok: false, error: `Error executing tool ${toolName}: ${error}` };
  }
}

export { decideToolCall, generateIntelligentResponse };
