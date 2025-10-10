# AI_ChatBot (Drop-in Feature)

Adds a ChatGPT-powered assistant to AI Compass.

## Files
- `src/components/AI_ChatBot/ChatWidget.tsx` — floating chat widget (client)
- `api/ai-chat.ts` (Vercel serverless) — secure proxy to OpenAI with lightweight retrieval
- `netlify/functions/ai-chat.ts` (Netlify function) — alternate API target
- `.env.example` — environment variables

## Setup (Vercel)
1. Copy `api/ai-chat.ts` into your project root under `/api/`.
2. Set env vars in Vercel:
   - `OPENAI_API_KEY`
   - `CHAT_MODEL` (e.g., `gpt-4o-mini`)
   - (Optional) `OPENAI_BASE` if using Azure OpenAI
3. Deploy. The client will call `/api/ai-chat` by default.
4. In your React app:
   ```tsx
   import ChatWidget from '@/components/AI_ChatBot/ChatWidget'
   // after you compute merged `tools` array:
   <ChatWidget toolsCatalog={tools} />
   ```

## Setup (Netlify)
1. Copy `netlify/functions/ai-chat.ts` into your project.
2. Set env vars in Netlify UI:
   - `OPENAI_API_KEY`, `CHAT_MODEL`, `OPENAI_BASE` (optional)
3. In the client, set `VITE_CHAT_API_PATH='/.netlify/functions/ai-chat'`

## Local Dev
- Vite dev server for client (port 5173)
- For Vercel API: `vercel dev` in parallel, or use a Vite dev proxy to port 3000.

## Security
- API key stays on the serverless side.
- The widget sends user message + compact `toolsCatalog` to the API.
- Retrieval: fast keyword overlap; upgrade to embeddings later if needed.

## Notes
- Streaming: Vercel route streams token-by-token; Netlify version returns a single chunk for compatibility.
- You can customize the system prompt inside the API file.
