import React, { useRef, useState } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'

type Msg = { role: 'user' | 'assistant', content: string }

type Props = {
  toolsCatalog: any[]
  /** Optional: override API path (default uses VITE_CHAT_API_PATH or '/api/ai-chat') */
  apiPath?: string
}

function getApiPath(override?: string) {
  // TypeScript-safe way to access Vite environment variables
  const envPath = (import.meta as any)?.env?.VITE_CHAT_API_PATH as string | undefined
  return override || envPath || '/api/ai-chat'
}

export default function ChatWidget({ toolsCatalog, apiPath }: Props) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi! Ask about AI tools, capabilities, or which one fits your use case.' }
  ])
  const abortRef = useRef<AbortController | null>(null)

  async function send() {
    if (!input.trim()) return
    const newMsgs: Msg[] = [...messages, { role: 'user', content: input }]
    setMessages(newMsgs)
    setInput('')

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const resp = await fetch(getApiPath(apiPath), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, toolsCatalog }),
        signal: ctrl.signal
      })

      if (!resp.ok || !resp.body) {
        setMessages(m => [...m, { role: 'assistant', content: 'Sorry — I hit an error calling the assistant.' }])
        return
      }

      // Stream the answer (SSE-like text stream from the proxy)
      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      setMessages(m => [...m, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })

        // Supports both raw text streaming and OpenAI SSE 'data:' lines
        if (chunk.includes('\ndata:')) {
          chunk.split('\n').forEach(line => {
            if (!line.startsWith('data:')) return
            const data = line.replace(/^data:\s*/, '')
            if (data === '[DONE]') return
            try {
              const json = JSON.parse(data)
              const delta = json?.choices?.[0]?.delta?.content || ''
              if (delta) {
                assistantText += delta
                setMessages(prev => {
                  const copy = [...prev]
                  copy[copy.length - 1] = { role: 'assistant', content: assistantText }
                  return copy
                })
              }
            } catch {}
          })
        } else {
          // naive: treat as plain text stream
          assistantText += chunk
          setMessages(prev => {
            const copy = [...prev]
            copy[copy.length - 1] = { role: 'assistant', content: assistantText }
            return copy
          })
        }
      }
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'The request was interrupted. Please try again.' }])
    }
  }

  return (
    <>
      <button
        className="fixed bottom-5 right-5 h-12 px-4 rounded-2xl shadow-lg border bg-white dark:bg-slate-900 flex items-center gap-2"
        onClick={() => setOpen(o => !o)}
        aria-label="Open AI Compass chat"
      >
        <MessageSquare className="w-5 h-5" /> AI Compass
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-[360px] max-h-[70vh] rounded-2xl border bg-white dark:bg-slate-900 shadow-xl flex flex-col overflow-hidden z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="font-medium">AI Compass Assistant</div>
            <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={()=>setOpen(false)}><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role==='user' ? 'text-right' : ''}>
                <div className={"inline-block rounded-2xl px-3 py-2 text-sm " + (m.role==='user'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800')}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center gap-2">
            <input
              className="flex-1 h-10 px-3 rounded-xl border bg-transparent"
              placeholder="Ask about a tool or capability…"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter') send() }}
            />
            <button className="h-10 px-3 rounded-xl border" onClick={send}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
