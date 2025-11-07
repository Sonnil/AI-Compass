import type { Msg } from '../features/sona/types'

export type AiChatResponse = { text: string }

// Parse OpenAI Chat Completions SSE stream and accumulate delta content
function parseOpenAISSELine(line: string): string | null {
  if (!line.startsWith('data:')) return null
  const payload = line.slice(5).trim()
  if (!payload || payload === '[DONE]') return null
  try {
    const json = JSON.parse(payload)
    const delta = json?.choices?.[0]?.delta?.content
    return typeof delta === 'string' ? delta : ''
  } catch {
    return null
  }
}

export async function callAiChat(messages: Msg[], toolsCatalog?: any[], signal?: AbortSignal): Promise<string> {
  const r = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, toolsCatalog }),
    signal,
  })

  if (!r.ok) {
    let errMsg = 'AI chat call failed'
    try { const j = await r.json(); errMsg = j?.error || errMsg } catch {}
    throw new Error(errMsg)
  }

  // Stream parsing (text/event-stream)
  const reader = r.body?.getReader()
  if (!reader) {
    return await r.text()
  }
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let idx
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim()
      buffer = buffer.slice(idx + 1)
      const delta = parseOpenAISSELine(line)
      if (typeof delta === 'string') {
        fullText += delta
      }
    }
  }

  // Flush remaining buffer line (if any)
  const leftover = buffer.trim()
  if (leftover) {
    const delta = parseOpenAISSELine(leftover)
    if (typeof delta === 'string') fullText += delta
  }

  return fullText.trim()
}

// Async generator variant to stream deltas to the UI in real time
export async function* callAiChatStream(messages: Msg[], toolsCatalog?: any[], signal?: AbortSignal): AsyncGenerator<string, void, unknown> {
  const r = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, toolsCatalog }),
    signal,
  })

  if (!r.ok || !r.body) {
    let errMsg = 'AI chat call failed'
    try { const j = await r.json(); errMsg = j?.error || errMsg } catch {}
    throw new Error(errMsg)
  }

  const reader = r.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let idx
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim()
      buffer = buffer.slice(idx + 1)
      const delta = parseOpenAISSELine(line)
      if (typeof delta === 'string' && delta) {
        yield delta
      }
    }
  }

  const leftover = buffer.trim()
  if (leftover) {
    const delta = parseOpenAISSELine(leftover)
    if (typeof delta === 'string' && delta) {
      yield delta
    }
  }
}
