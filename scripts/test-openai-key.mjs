#!/usr/bin/env node
import 'dotenv/config'

const OPENAI_KEY = process.env.OPENAI_API_KEY
const OPENAI_BASE = process.env.OPENAI_BASE || 'https://api.openai.com/v1'
const MODEL = process.env.CHAT_MODEL || 'gpt-4o-mini'

if (!OPENAI_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment')
  process.exit(1)
}

console.log('🔑 API Key:', OPENAI_KEY.substring(0, 20) + '...')
console.log('🌐 Base URL:', OPENAI_BASE)
console.log('🤖 Model:', MODEL)
console.log('\n📡 Testing OpenAI API connection...\n')

async function testOpenAI() {
  try {
    const response = await fetch(`${OPENAI_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say "Hello from AI Compass!" in exactly 5 words.' }
        ],
        max_tokens: 20
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ API Error:', response.status, error)
      process.exit(1)
    }

    const data = await response.json()
    const message = data.choices[0]?.message?.content || 'No response'
    
    console.log('✅ API Connection: SUCCESS')
    console.log('📝 Response:', message)
    console.log('\n✓ Your OpenAI API key is working correctly!')
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message)
    process.exit(1)
  }
}

testOpenAI()
