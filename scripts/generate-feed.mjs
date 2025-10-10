// scripts/generate-feed.mjs
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'

// Read the external AI tools from the new JSON file
let externalTools = []
try {
  const externalData = await readFile('public/external-ai-tools-2025.json', 'utf8')
  externalTools = JSON.parse(externalData).map(tool => ({
    ...tool,
    // Add official website links and logos for external tools
    accessLink: getOfficialLink(tool.name),
    logoUrl: getLogoUrl(tool.name)
  }))
} catch (error) {
  console.log('No external tools file found, using default curated list')
}

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

const curated = externalTools.length > 0 ? externalTools : [
  {
    name: "Perplexity AI",
    primaryPurpose: "AI-powered search and discovery engine",
    targetUsers: "Researchers, analysts, knowledge workers",
    technology: "Hybrid search + LLMs (OpenAI / Claude)",
    realTimeWebSearch: true,
    codeGeneration: false,
    imageGeneration: false,
    bestUseCase: "Fact-checked, cited research responses",
    cost: "Free / Pro tier",
    tags: ["search","research","citation","web"]
  },
  {
    name: "Claude 3",
    primaryPurpose: "General-purpose AI assistant emphasizing safety and reasoning",
    targetUsers: "Enterprise, researchers, and individuals",
    technology: "Anthropic Constitutional AI",
    realTimeWebSearch: true,
    codeGeneration: true,
    imageGeneration: false,
    bestUseCase: "Long-form reasoning, safe and accurate text generation",
    cost: "Free / Pro / API tiered pricing",
    tags: ["assistant","reasoning","text","enterprise"]
  }
]

function dedupeByName(list) {
  const m = new Map()
  for (const item of list) {
    if (!item?.name) continue
    m.set(item.name.toLowerCase(), item)
  }
  return Array.from(m.values())
}

async function run() {
  const merged = dedupeByName([...curated])
  const outDir = 'public'
  const outFile = path.join(outDir, 'ai-tools-feed.json')
  await mkdir(outDir, { recursive: true })
  await writeFile(outFile, JSON.stringify(merged, null, 2))
  console.log(`Wrote ${merged.length} tools → ${outFile}`)
}

run().catch(e => { console.error(e); process.exit(1) })
