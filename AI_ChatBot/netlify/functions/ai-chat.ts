import type { Handler } from '@netlify/functions'
import fetch from 'node-fetch'

const OPENAI_BASE = process.env.OPENAI_BASE || 'https://api.openai.com/v1'
const OPENAI_KEY  = process.env.OPENAI_API_KEY!
const MODEL       = process.env.CHAT_MODEL || 'gpt-4o-mini'

function rankTools(query: string, tools: any[], k = 8) {
  const q = (query || '').toLowerCase()
  return (tools || [])
    .map((t: any) => {
      const hay = [
        t.name, t.primaryPurpose, t.targetUsers, t.technology,
        (t.tags||[]).join(' '),
      ].join(' ').toLowerCase()
      const score = q.split(/\s+/).reduce((s, w) => s + (w && hay.includes(w) ? 1 : 0), 0)
      return { score, tool: t }
    })
    .sort((a,b)=>b.score-a.score)
    .slice(0, k)
    .map(x => x.tool)
}

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Use POST' }
  try {
    const body = JSON.parse(event.body || '{}')
    const { messages, toolsCatalog } = body
    if (!Array.isArray(messages)) return { statusCode: 400, body: JSON.stringify({ error: 'messages required' }) }

    const userMsg = [...messages].reverse().find((m:any) => m.role === 'user')
    const query = userMsg?.content ?? ''
    const topTools = Array.isArray(toolsCatalog) ? rankTools(query, toolsCatalog, 10) : []

    const systemPrompt = [
      'You are AI Compass, an internal assistant for Sanofians.',
      'Answer using the provided AI tools catalog when possible.',
      'If unsure, say so. Prefer concise, practical guidance.',
      'When listing tools, include 1–2 key strengths and when to use them.',
    ].join(' ')

    const payload = {
      model: MODEL,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `User question: ${query}\n\nRelevant tools (JSON): ${JSON.stringify(topTools).slice(0, 12000)}` },
      ]
    }

    const r = await fetch(`${OPENAI_BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!r.ok || !r.body) {
      const text = await r.text().catch(()=> 'Upstream error')
      return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI error', details: text }) }
    }

    // Buffer mode for broad compatibility
    const chunks: Uint8Array[] = []
    for await (const chunk of r.body as any) {
      chunks.push(chunk)
    }
    const text = Buffer.concat(chunks).toString('utf-8')
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: text
    }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || 'unknown error' }) }
  }
}
