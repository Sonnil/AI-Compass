// scripts/generate-feed.mjs
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

const FEED_PATH = 'public/ai-tools-feed.json'

function getOfficialLink(toolName) {
  const links = {
    'Claude 3': 'https://claude.ai',
    'Google Gemini': 'https://gemini.google.com',
    'Perplexity AI': 'https://perplexity.ai',
    'Jasper AI': 'https://jasper.ai',
    'Midjourney': 'https://midjourney.com',
    'Runway ML': 'https://runwayml.com',
    'Stable Diffusion': 'https://stability.ai',
    'Mistral AI': 'https://mistral.ai',
    'Cohere Command R+': 'https://cohere.com',
    'IBM Watsonx': 'https://watsonx.ai',
    'Salesforce Agentforce': 'https://salesforce.com/products/agentforce',
    'Amazon Q': 'https://aws.amazon.com/q',
    'Hugging Face': 'https://huggingface.co',
    'Replit Ghostwriter': 'https://replit.com/ai',
    'Notion AI': 'https://notion.so/product/ai'
  }
  return links[toolName] || '#'
}

function getLogoUrl(toolName) {
  // Using local SVG logos to avoid external 404 errors
  const logos = {
    'Concierge': '/Concierge.svg',
    'Plai': '/Plai.svg',
    'Claude 3': '/logos/claude.svg',
    'Google Gemini': '/logos/gemini.svg',
    'Perplexity AI': '/logos/perplexity.svg',
    'Jasper AI': '/logos/jasper.svg',
    'Midjourney': '/logos/midjourney.svg',
    'Runway ML': '/logos/runway.svg',
    'Stable Diffusion': '/logos/stable-diffusion.svg',
    'Mistral AI': '/logos/mistral.svg',
    'Cohere Command R+': '/logos/cohere.svg',
    'IBM Watsonx': '/logos/ibm-watsonx.svg',
    'Salesforce Agentforce': '/logos/salesforce.svg',
    'Amazon Q': '/logos/amazon-q.svg',
    'Hugging Face': '/logos/huggingface.svg',
    'Replit Ghostwriter': '/logos/replit.svg',
    'Notion AI': '/logos/notion.svg',
    'Microsoft Copilot': '/logos/microsoft-copilot.svg',
    'ChatGPT': '/logos/chatgpt.svg'
  }
  return logos[toolName] || ''
}

function dedupeByName(list) {
  const m = new Map()
  for (const item of list) {
    if (!item?.name) continue
    m.set(item.name.toLowerCase(), item)
  }
  return Array.from(m.values())
}

async function run() {
  let existingTools = []
  try {
    const raw = await readFile(FEED_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      existingTools = parsed
    } else if (Array.isArray(parsed?.tools)) {
      existingTools = parsed.tools
    }
  } catch {
    console.warn('No existing feed found, starting from curated defaults')
  }

  const curated = existingTools.length ? existingTools : [
    {
      name: 'Perplexity AI',
      primaryPurpose: 'AI-powered search and discovery engine',
      targetUsers: 'Researchers, analysts, knowledge workers',
      technology: 'Hybrid search + LLMs (OpenAI / Claude)',
      realTimeWebSearch: true,
      codeGeneration: false,
      imageGeneration: false,
      bestUseCase: 'Fact-checked, cited research responses',
      cost: 'Free / Pro tier',
      tags: ['search', 'research', 'citation', 'web']
    },
    {
      name: 'Claude 3',
      primaryPurpose: 'General-purpose AI assistant emphasizing safety and reasoning',
      targetUsers: 'Enterprise, researchers, and individuals',
      technology: 'Anthropic Constitutional AI',
      realTimeWebSearch: true,
      codeGeneration: true,
      imageGeneration: false,
      bestUseCase: 'Long-form reasoning, safe and accurate text generation',
      cost: 'Free / Pro / API tiered pricing',
      tags: ['assistant', 'reasoning', 'text', 'enterprise']
    }
  ]

  const normalized = dedupeByName(curated).map(tool => {
  const curatedLogo = getLogoUrl(tool.name)
  const logoUrl = curatedLogo || tool.logoUrl
    const accessLink = tool.accessLink || getOfficialLink(tool.name)
    const tags = Array.isArray(tool.tags) ? tool.tags : []
    const type = tool.type || (tags.includes('internal') ? 'internal' : 'external')
    return {
      ...tool,
      ...(logoUrl ? { logoUrl } : {}),
      ...(accessLink ? { accessLink } : {}),
      tags,
      type
    }
  })

  const outDir = path.dirname(FEED_PATH)
  await mkdir(outDir, { recursive: true })
  const output = {
    lastUpdated: new Date().toISOString(),
    totalTools: normalized.length,
    tools: normalized
  }
  await writeFile(FEED_PATH, JSON.stringify(output, null, 2))
  console.log(`Wrote ${normalized.length} tools → ${FEED_PATH}`)
}

run().catch(e => { console.error(e); process.exit(1) })
