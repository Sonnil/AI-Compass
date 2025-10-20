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
  // Using reliable logo URLs from CDNs and public sources
  const logos = {
    'Concierge': '/Concierge.svg',
    'Plai': '/Plai.svg',
    'Claude 3': 'https://claude.ai/favicon.ico',
    'Google Gemini': 'https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg',
    'Perplexity AI': 'https://yt3.googleusercontent.com/0hMC-6W0zIznMJLaaPGQRhbkb_0SZCkqpRVjQZ8XzXcRiA9KjVgE_4J6-DFG1NhMpzjJZf-0=s900-c-k-c0x00ffffff-no-rj',
    'Jasper AI': 'https://www.jasper.ai/favicon.ico',
    'Midjourney': 'https://cdn.midjourney.com/b07dac22-026b-4ceb-ad83-5d3c4c6c8b98/0_0.png',
    'Runway ML': 'https://runwayml.com/favicon.ico',
    'Stable Diffusion': 'https://stability.ai/favicon.ico',
    'Mistral AI': 'https://mistral.ai/favicon.ico',
    'Cohere Command R+': 'https://cohere.com/favicon.ico',
    'IBM Watsonx': 'https://www.ibm.com/favicon.ico',
    'Salesforce Agentforce': 'https://www.salesforce.com/favicon.ico',
    'Amazon Q': 'https://aws.amazon.com/favicon.ico',
    'Hugging Face': 'https://huggingface.co/favicon.ico',
    'Replit Ghostwriter': 'https://replit.com/favicon.ico',
    'Notion AI': 'https://www.notion.so/favicon.ico'
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
