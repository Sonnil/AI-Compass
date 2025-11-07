import http from 'node:http'

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (url === '/api/ai-chat' && method === 'GET') {
    const hasKey = !!process.env.OPENAI_API_KEY
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, hasKey }))
    return
  }

  if (url === '/api/ai-chat' && method === 'POST') {
    // Minimal SSE mock stream compatible with our client parser
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    })
    const lines = [
      'data: {"choices":[{"delta":{"content":"Hello "}}]}\n',
      'data: {"choices":[{"delta":{"content":"from "}}]}\n',
      'data: {"choices":[{"delta":{"content":"local API 👋"}}]}\n',
      'data: [DONE]\n'
    ]
    let i = 0
    const iv = setInterval(() => {
      if (i >= lines.length) {
        clearInterval(iv)
        res.end()
        return
      }
      res.write(lines[i++])
    }, 200)
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'not found' }))
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
server.listen(PORT, () => {
  console.log(`dev api server listening on http://localhost:${PORT}`)
})
