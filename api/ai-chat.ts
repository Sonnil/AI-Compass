import type { VercelRequest, VercelResponse } from '@vercel/node'
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' })
  try {
    const { messages, toolsCatalog } = req.body || {}
    if (!Array.isArray(messages)) return res.status(400).json({ error: 'messages required' })
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
      return res.status(500).json({ error: 'OpenAI error', details: text })
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')

    for await (const chunk of r.body as any) {
      res.write(chunk)
    }
    res.end()
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'unknown error' })
  }
}
