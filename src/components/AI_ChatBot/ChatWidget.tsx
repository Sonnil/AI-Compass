import React, { useRef, useState, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Sparkles, Maximize2, Minimize2, ArrowDown } from 'lucide-react'

type Msg = { role: 'user' | 'assistant', content: string }

type UserProfile = {
  name?: string
  department?: string
  interests: string[]
  commonQueries: string[]
  toolsAskedAbout: string[]
  conversationStyle: 'formal' | 'casual' | 'technical'
  lastInteraction?: string
}

type Props = {
  toolsCatalog: any[]
  /** Optional: override API path (default uses VITE_CHAT_API_PATH or '/api/ai-chat') */
  apiPath?: string
}

function getApiPath(override?: string) {
  // For now, we'll use a simple fallback - can be configured later
  return override || '/api/ai-chat'
}

// Learn from user interactions and build profile
function updateUserProfile(userInput: string, conversationHistory: Msg[], toolsCatalog: any[]): UserProfile {
  const storedProfile = localStorage.getItem('ai_compass_user_profile')
  const profile: UserProfile = storedProfile ? JSON.parse(storedProfile) : {
    interests: [],
    commonQueries: [],
    toolsAskedAbout: [],
    conversationStyle: 'casual'
  }

  // Detect user's conversation style
  const input = userInput.toLowerCase()
  if (input.match(/\b(please|kindly|would you|could you)\b/)) {
    profile.conversationStyle = 'formal'
  } else if (input.match(/\b(hey|cool|awesome|thanks|thx)\b/)) {
    profile.conversationStyle = 'casual'
  } else if (input.match(/\b(api|integration|technical|specification|architecture)\b/)) {
    profile.conversationStyle = 'technical'
  }

  // Track topics of interest
  const topics = ['r&d', 'research', 'medical', 'manufacturing', 'finance', 'productivity', 'creative', 'data', 'compliance', 'automation']
  topics.forEach(topic => {
    if (input.includes(topic) && !profile.interests.includes(topic)) {
      profile.interests.push(topic)
    }
  })

  // Track tools asked about
  toolsCatalog.forEach(tool => {
    if (input.includes(tool.name.toLowerCase()) && !profile.toolsAskedAbout.includes(tool.name)) {
      profile.toolsAskedAbout.push(tool.name)
      if (profile.toolsAskedAbout.length > 10) profile.toolsAskedAbout.shift()
    }
  })

  // Track common query patterns
  const queryTypes = ['compare', 'recommend', 'access', 'training', 'cost', 'features']
  queryTypes.forEach(type => {
    if (input.includes(type)) {
      profile.commonQueries.push(type)
      if (profile.commonQueries.length > 20) profile.commonQueries.shift()
    }
  })

  profile.lastInteraction = new Date().toISOString()
  localStorage.setItem('ai_compass_user_profile', JSON.stringify(profile))
  return profile
}

// Get personalized greeting based on user profile and time
function getPersonalizedGreeting(profile: UserProfile): string {
  const hour = new Date().getHours()
  let timeGreeting = 'Hello'
  
  if (hour < 12) timeGreeting = 'Good morning'
  else if (hour < 17) timeGreeting = 'Good afternoon'
  else timeGreeting = 'Good evening'

  const greetings = [
    `${timeGreeting}! 👋`,
    `Hey there! 😊`,
    `Hi! Great to see you again! 🌟`,
    `${timeGreeting}! Hope you're having a great day! ☀️`
  ]

  const casualGreetings = [
    `Hey! 👋 What's up?`,
    `Hi there! 😊 How's it going?`,
    `Hello! 🌟 Nice to see you!`,
    `Hey! Hope you're doing well! ✨`
  ]

  const formalGreetings = [
    `${timeGreeting}. How may I assist you today?`,
    `${timeGreeting}. I'm here to help.`,
    `Hello. What can I help you with today?`
  ]

  let greeting: string
  if (profile.conversationStyle === 'formal') {
    greeting = formalGreetings[Math.floor(Math.random() * formalGreetings.length)]
  } else if (profile.conversationStyle === 'casual') {
    greeting = casualGreetings[Math.floor(Math.random() * casualGreetings.length)]
  } else {
    greeting = greetings[Math.floor(Math.random() * greetings.length)]
  }

  return greeting
}

// AI Tips of the Day - rotate daily
function getAITipOfTheDay(): string {
  const tips = [
    "💡 **Tip:** Always review AI-generated content for accuracy before sharing. AI can hallucinate or make mistakes!",
    "🎯 **Tip:** Use specific prompts for better AI results. Instead of 'write a report', try 'write a 2-page executive summary on Q3 sales performance'.",
    "🔒 **Tip:** Never share confidential Sanofi data with external AI tools unless approved by IT Security.",
    "⚡ **Tip:** Break complex tasks into smaller steps when working with AI - it produces better results!",
    "📝 **Tip:** When asking AI to write code, always specify the programming language and provide context about your project.",
    "🌟 **Tip:** AI works best as a collaboration partner, not a replacement. Use it to augment your skills!",
    "🔍 **Tip:** Compare multiple AI tools for the same task - different tools have different strengths!",
    "🎨 **Tip:** For creative tasks, try iterating with AI - give feedback and refine outputs progressively.",
    "📊 **Tip:** Use AI tools to summarize long documents before deep diving - it saves time and highlights key points.",
    "🚀 **Tip:** Keep learning! AI tools evolve rapidly. Check AI Compass regularly for new tools and capabilities.",
    "💬 **Tip:** When AI doesn't understand you, rephrase your question or add more context - clarity is key!",
    "🔗 **Tip:** Chain AI tools together! Use one for research, another for writing, and another for visualization.",
    "📚 **Tip:** Use AI to learn new skills faster - ask it to explain concepts, generate practice problems, or review your work.",
    "⏱️ **Tip:** Set time limits when working with AI to avoid over-reliance. Use it strategically, not constantly.",
    "🎓 **Tip:** Complete Sanofi's RAISE training to understand responsible AI practices and compliance requirements.",
    "🔄 **Tip:** If an AI tool isn't working well, try a different one! AI Compass has 25+ tools to choose from.",
    "📈 **Tip:** Track your time savings when using AI tools - it helps justify their value to your team!",
    "🌐 **Tip:** Many AI tools support multiple languages. Explore multilingual capabilities for global collaboration.",
    "🎪 **Tip:** Use AI for brainstorming! Generate 10 ideas quickly, then refine the best ones with your expertise.",
    "🛡️ **Tip:** Check each AI tool's compliance awareness level in AI Compass before using it for regulated work."
  ]
  
  // Use day of year to rotate tips daily
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return tips[dayOfYear % tips.length]
}

// Top 10 AI Facts
function getTop10AIFacts(): string {
  return `## 🧠 Top 10 AI Facts You Should Know

**1. AI is Older Than You Think** 🕰️
The term "Artificial Intelligence" was coined in 1956 at the Dartmouth Conference. Modern AI's roots go back nearly 70 years!

**2. AI Learns Like Humans (Sort Of)** 🎓
Machine learning mimics how our brains create neural pathways. AI models learn from examples, make mistakes, and improve over time—just like us!

**3. AI Can Be Biased** ⚖️
AI systems learn from data created by humans, so they can inherit our biases. That's why Sanofi emphasizes responsible AI practices!

**4. ChatGPT Has 175 Billion Parameters** 🤯
GPT-3, the model behind ChatGPT, has 175 billion parameters (think of them as "knowledge nodes"). That's more than the number of stars in the Milky Way!

**5. AI Can't Actually "Understand"** 🤔
Despite seeming intelligent, AI doesn't truly understand context like humans do. It recognizes patterns and predicts likely responses.

**6. AI Energy Consumption is Massive** ⚡
Training large AI models can use as much energy as 100 US homes consume in a year. Sustainability in AI is becoming critical!

**7. AI Hallucinations Are Real** 👻
AI can confidently generate false information that sounds plausible—called "hallucinations." Always verify AI outputs!

**8. AI in Healthcare is Revolutionary** 🏥
AI can analyze medical images faster than doctors, predict disease progression, and help discover new drugs—exactly what Sanofi is doing!

**9. Most AI is "Narrow AI"** 🎯
Today's AI excels at specific tasks (narrow AI) but can't generalize like humans. "General AI" that matches human intelligence doesn't exist yet!

**10. AI is a Tool, Not Magic** 🔧
Despite the hype, AI is ultimately a powerful tool that requires human judgment, creativity, and oversight to use effectively!

---

📚 **Sources:** Compiled from AI research papers, industry reports, academic publications, and verified technology documentation. Facts include data from OpenAI, Google Research, DeepMind, academic institutions, and pharmaceutical AI applications.

---

Want to explore these AI tools yourself? Just ask me about any tool in our catalog! 🚀`
}

// AI Fun Facts Knowledge Base
function getAIFunFacts(): string[] {
  return [
    "🤖 The term 'Artificial Intelligence' was coined by John McCarthy in 1956 at the Dartmouth Conference, where the field of AI research was officially born!",
    "🧠 GPT-3 has 175 billion parameters and was trained on 45TB of text data - that's like reading millions of books!",
    "🎯 In 2016, AlphaGo became the first AI to defeat a world champion Go player (Lee Sedol), marking a historic moment in AI development.",
    "💡 Modern AI can generate images, write code, compose music, and even help discover new drugs - all from natural language prompts!",
    "⚡ Training large AI models can use as much energy as 100 US homes consume in a year. Sustainability in AI is becoming critical!",
    "👻 AI 'hallucinations' are when AI confidently generates false information that sounds plausible. Always verify AI outputs!",
    "🏥 AI can analyze medical images faster than doctors and help discover new drugs - exactly what Sanofi is doing!",
    "🎓 Machine learning mimics how our brains create neural pathways. AI models learn from examples, make mistakes, and improve over time.",
    "🤔 Despite seeming intelligent, AI doesn't truly 'understand' context like humans do. It recognizes patterns and predicts likely responses.",
    "🔧 Most AI today is 'narrow AI' that excels at specific tasks. 'General AI' that matches human intelligence doesn't exist yet!"
  ]
}

// AI Jokes Collection
function getAIJokes(): string[] {
  return [
    "😄 Why did the AI go to therapy? Because it had too many deep learning issues! 🤓",
    "🤣 What do you call an AI that sings? A-dell! (Adele) 🎤",
    "😂 Why don't AI assistants ever get tired? Because they run on renewable energy... and caffeine-free code! ☕",
    "🎭 How does an AI flirt? 'Hey baby, are you a neural network? Because you've got me making all the right connections!' 💕",
    "🤖 Why did the neural network go to school? To improve its learning rate! 📚",
    "💻 What's an AI's favorite type of music? Algorithm and blues! 🎵",
    "🧠 Why don't robots ever panic? They have nerves of steel... wire! ⚡",
    "🎯 How do AI models stay in shape? They do lots of training! 🏋️"
  ]
}

// Educational AI Tips
function getEducationalAITips(): string[] {
  return [
    "📚 **Prompt Engineering:** Be specific and provide context. Instead of 'write code,' try 'write a Python function that calculates fibonacci numbers recursively.'",
    "⚡ **Iterative Approach:** Use AI tools iteratively! Start with a basic prompt, review the output, then refine with follow-up questions for better results.",
    "🔒 **Security First:** Never share sensitive data, passwords, or confidential information with AI tools. Always review and validate AI-generated content.",
    "🎨 **Brainstorming Power:** AI excels at brainstorming! Generate multiple variations of ideas, then combine the best elements for innovative solutions.",
    "🔍 **Verification is Key:** Always fact-check AI outputs, especially for critical information. AI can make mistakes or generate outdated information.",
    "🌟 **AI as Partner:** AI works best as a collaboration partner, not a replacement. Use it to augment your skills and productivity!",
    "📊 **Tool Comparison:** Different AI tools have different strengths. Compare multiple tools for the same task to find the best fit.",
    "🎓 **Continuous Learning:** AI tools evolve rapidly. Check AI Compass regularly for new tools, features, and capabilities!",
    "💬 **Clear Communication:** If AI doesn't understand you, rephrase your question or add more context - clarity is key!",
    "🔗 **Tool Chaining:** Chain AI tools together! Use one for research, another for writing, and another for visualization.",
    "⏱️ **Strategic Use:** Set time limits when working with AI to avoid over-reliance. Use it strategically, not constantly.",
    "🛡️ **Compliance Awareness:** Check each AI tool's compliance level in AI Compass before using it for regulated work.",
    "📈 **Track ROI:** Track your time savings when using AI tools - it helps justify their value to your team!",
    "🌐 **Multilingual:** Many AI tools support multiple languages. Explore multilingual capabilities for global collaboration.",
    "🎪 **Rapid Ideation:** Use AI for brainstorming! Generate 10 ideas quickly, then refine the best ones with your expertise."
  ]
}

// New Tools Highlights
function getNewToolsHighlights(): string[] {
  return [
    "🆕 **Claude 3** - Anthropic's latest AI assistant with improved reasoning, coding capabilities, and longer context windows!",
    "✨ **Gemini** - Google's multimodal AI that can understand text, images, audio, and video all at once!",
    "🔍 **Perplexity AI** - Combines search with AI chat, providing answers with real-time sources and citations!",
    "🎨 **Midjourney** - Revolutionary AI image generator creating stunning visuals from text descriptions!",
    "🎬 **Runway** - AI-powered video editing and generation tool for creative professionals!",
    "🤖 **Microsoft Copilot** - Integrated AI assistant across Microsoft 365 apps for enhanced productivity!",
    "📝 **Notion AI** - Smart writing assistant built into Notion for better documentation and collaboration!",
    "💻 **GitHub Copilot** - AI pair programmer that suggests code and entire functions in real-time!",
    "🧪 **Hugging Face** - Leading platform for open-source AI models and collaborative AI development!",
    "🔬 **IBM watsonx** - Enterprise AI platform designed for business applications and regulatory compliance!"
  ]
}

// Get random AI content for variety
function getRandomAIContent(type: 'fact' | 'joke' | 'tip' | 'tool'): string {
  const collections = {
    fact: getAIFunFacts(),
    joke: getAIJokes(),
    tip: getEducationalAITips(),
    tool: getNewToolsHighlights()
  }
  const items = collections[type]
  return items[Math.floor(Math.random() * items.length)]
}

// Sonnil Q. Le Profile Knowledge Base
function getSonnilLeProfile(): {
  shortBio: string
  fullBio: string
  title: string
  role: string
  experience: string
  keyProjects: string[]
  certifications: string[]
  education: string
  expertise: string[]
  leadership: string[]
  contact: string
} {
  return {
    title: "Associate Director of Quality Operations Data Analytics",
    role: "Leading digital transformation, data analytics, and AI initiatives across Manufacturing & Supply Quality at Sanofi",
    experience: "19 years of professional experience (since 2006), 17 years at Sanofi (since 2008) in data analytics, business intelligence, and digital product management",
    shortBio: "Sonnil Q. Le is the Associate Director of Quality Operations Data Analytics at Sanofi, leading digital transformation, data analytics, and AI initiatives across Manufacturing & Supply Quality. He's a Certified SAFe Product Owner/Product Manager with 19 years of professional experience (17 years at Sanofi since 2008) delivering innovative BI and AI solutions such as Ignyte SPC, Real Time Release, S.P.A.C.E., and AI-Compass to drive operational excellence and data-driven decision-making.",
    fullBio: `Sonnil Q. Le is the Associate Director of Quality Operations Data Analytics at Sanofi, where he leads digital and data transformation initiatives that enable operational excellence and regulatory readiness across Manufacturing & Supply (M&S) Quality.

With 19 years of professional experience (17 years at Sanofi since 2008) in data analytics, business intelligence, and digital product management, Sonnil has a proven record of delivering high-impact solutions that automate processes, enhance decision-making, and bridge business and technology.

He has served as Product Owner for key global quality platforms including Ignyte SPC and Real Time Release, and currently leads the development of enterprise-level data solutions such as the S.P.A.C.E. Power BI ecosystem for Lot Release and Inspection Readiness and the AI-Compass initiative, which leverages Agentic AI to align internal and external AI capabilities.

Sonnil is a Certified SAFe Product Owner/Product Manager and an MBA graduate with dual concentrations in Management Information Systems and Global Business. He is recognized for his leadership in democratizing analytics, mentoring citizen developers, and fostering an Agile, data-driven culture across Sanofi's global network.

Beyond his corporate work, Sonnil is an entrepreneur and innovator, passionate about building digital products that connect data, people, and purpose—from real estate platforms to AI-powered business tools.`,
    keyProjects: [
      "AI-Compass: Agentic AI platform aligning internal and external AI capabilities",
      "S.P.A.C.E.: Power BI ecosystem for Lot Release and Inspection Readiness",
      "Ignyte SPC: Global quality platform for Statistical Process Control",
      "Real Time Release: Quality automation and regulatory readiness platform"
    ],
    certifications: [
      "Certified SAFe Product Owner/Product Manager"
    ],
    education: "MBA with dual concentrations in Management Information Systems and Global Business",
    expertise: [
      "Data Analytics & Business Intelligence",
      "Digital Transformation & Product Management",
      "AI/ML Solutions & Agentic AI",
      "Quality Operations & Manufacturing Excellence",
      "Power BI & Analytics Democratization",
      "Agile/SAFe Methodologies",
      "Citizen Developer Enablement",
      "Regulatory Readiness & Compliance"
    ],
    leadership: [
      "Democratizing analytics across Sanofi's global network",
      "Mentoring citizen developers and analytics champions",
      "Fostering Agile, data-driven culture",
      "Bridging business and technology teams",
      "Leading digital transformation in M&S Quality",
      "Automating processes for operational excellence"
    ],
    contact: "Sonnil.le@Sanofi.com"
  }
}

// Get response about Sonnil Le based on query
function getSonnilLeResponse(query: string): string {
  const profile = getSonnilLeProfile()
  const lowerQuery = query.toLowerCase()
  
  // Detailed bio request
  if (lowerQuery.includes('more') || lowerQuery.includes('detail') || lowerQuery.includes('full') || 
      lowerQuery.includes('background') || lowerQuery.includes('career') || lowerQuery.includes('experience')) {
    let response = `## 👤 About Sonnil Q. Le - Full Profile\n\n`
    response += `**${profile.title}**\n_${profile.role}_\n\n`
    response += `---\n\n`
    response += profile.fullBio
    response += `\n\n---\n\n`
    response += `**📧 Contact:** ${profile.contact}`
    return response
  }
  
  // Projects focus
  if (lowerQuery.includes('project') || lowerQuery.includes('built') || lowerQuery.includes('created') || lowerQuery.includes('developed')) {
    let response = `## 🚀 Sonnil Q. Le's Key Projects\n\n`
    response += `As Product Owner and technical leader, Sonnil has delivered several high-impact solutions:\n\n`
    profile.keyProjects.forEach((project, i) => {
      response += `**${i + 1}. ${project}**\n\n`
    })
    response += `These platforms drive operational excellence, automate quality processes, and enable data-driven decision-making across Sanofi's global manufacturing network.`
    return response
  }
  
  // Expertise focus
  if (lowerQuery.includes('expertise') || lowerQuery.includes('skill') || lowerQuery.includes('specialize') || lowerQuery.includes('expert in')) {
    let response = `## 💡 Sonnil Q. Le's Expertise\n\n`
    response += `**Core Competencies:**\n\n`
    profile.expertise.forEach(exp => {
      response += `✓ ${exp}\n`
    })
    response += `\n**Education:** ${profile.education}\n`
    response += `**Certifications:** ${profile.certifications.join(', ')}`
    return response
  }
  
  // Leadership focus
  if (lowerQuery.includes('leadership') || lowerQuery.includes('lead') || lowerQuery.includes('manage') || lowerQuery.includes('mentor')) {
    let response = `## 🌟 Sonnil Q. Le's Leadership Impact\n\n`
    response += `Sonnil is recognized for transformational leadership in:\n\n`
    profile.leadership.forEach(lead => {
      response += `🎯 ${lead}\n`
    })
    return response
  }
  
  // Contact info
  if (lowerQuery.includes('contact') || lowerQuery.includes('reach') || lowerQuery.includes('email')) {
    let response = `## 📧 Contact Sonnil Q. Le\n\n`
    response += `**Email:** ${profile.contact}\n\n`
    response += `Sonnil welcomes questions, feedback, and collaboration ideas about AI-Compass and other data analytics initiatives at Sanofi.\n\n`
    response += `Feel free to reach out for:\n`
    response += `• AI-Compass platform feedback or feature requests\n`
    response += `• Data analytics collaboration opportunities\n`
    response += `• Digital transformation discussions\n`
    response += `• AI/ML solution inquiries`
    return response
  }
  
  // Short bio (default)
  let response = `## 👤 About Sonnil Q. Le\n\n`
  response += `**${profile.title}**\n\n`
  response += profile.shortBio
  response += `\n\n**🚀 Key Projects:**\n`
  profile.keyProjects.slice(0, 2).forEach(project => {
    response += `• ${project}\n`
  })
  response += `\n\n💡 **Want to know more?** Ask me about:\n`
  response += `• "Tell me more about Sonnil" (full background)\n`
  response += `• "What projects has Sonnil built?"\n`
  response += `• "What is Sonnil's expertise?"\n`
  response += `• "How do I contact Sonnil?"`
  
  return response
}

// AI Compass Platform Features Knowledge Base
function getAICompassFeatures(): {
  overview: string
  coreFeatures: Array<{ name: string; description: string; location: string; howTo: string }>
  headerButtons: Array<{ name: string; icon: string; purpose: string; location: string }>
  searchAndFilter: { description: string; features: string[]; howTo: string }
  comparison: { description: string; features: string[]; howTo: string }
  chatbot: { description: string; capabilities: string[]; howTo: string }
  themes: { description: string; options: string[]; howTo: string }
  languages: { description: string; supported: string[]; howTo: string }
  analytics: { description: string; metrics: string[]; howTo: string }
  about: { description: string; sections: string[]; howTo: string }
} {
  return {
    overview: "AI Compass is Sanofi's comprehensive AI tools catalog platform with 25+ internal and external AI tools, featuring smart search, comparison tools, analytics dashboard, multilingual support, and an intelligent chatbot assistant (me, SONA!).",
    coreFeatures: [
      {
        name: "Smart Search & Filters",
        description: "Powerful search bar with real-time filtering across tool names, features, purposes, and capabilities",
        location: "Top of main page, below header",
        howTo: "Type keywords in the search box. Use scope filters (All/Internal/External) to narrow results. Search works across all tool metadata including features, capabilities, and use cases."
      },
      {
        name: "Tool Comparison",
        description: "Side-by-side comparison of multiple AI tools with detailed feature breakdown",
        location: "Click 'Compare' button in header; comparison panel appears at bottom",
        howTo: "Click '+ Add to compare' on tool cards. Once 2+ tools selected, click 'Compare' button. View appears in split-screen: top shows tool cards, bottom shows comparison table. Use maximize/minimize button to adjust view size."
      },
      {
        name: "SONA Chatbot",
        description: "Intelligent AI assistant that knows all tools, Sanofi info, AI tips, and can recommend tools based on your needs",
        location: "Purple chat bubble in bottom-right corner",
        howTo: "Click the chat icon. Ask questions like 'recommend a tool for coding', 'compare ChatGPT vs Claude', 'what's the latest Sanofi news', or 'tell me an AI joke'. SONA provides personalized recommendations and detailed tool information."
      },
      {
        name: "Analytics Dashboard",
        description: "Visual insights into tool usage, distribution, and catalog statistics",
        location: "Click 'Analytics' button in header",
        howTo: "Access from header button with bar chart icon. View tool distribution by type (internal/external), feature analysis, capability metrics, and usage statistics."
      },
      {
        name: "About Section",
        description: "Comprehensive information about AI Compass platform, team, mission, and value proposition",
        location: "Click 'About' button in header",
        howTo: "Access from header button with info icon. Two tabs available: 'For Users & Consumers' (features, team, contact) and 'For Stakeholders & Investors' (strategic value, governance, ROI)."
      },
      {
        name: "Suggestion Box",
        description: "Submit ideas for new AI tools, features, or capabilities you'd like to see",
        location: "Click 'Suggest' button in header",
        howTo: "Click lightbulb icon in header. Type your suggestion or wish for an AI Agent/capability. Submit to email your idea to the AI Compass team (Sonnil Le)."
      },
      {
        name: "Welcome Popup",
        description: "Daily rotating content showing AI tips, fun facts, jokes, or new tool highlights",
        location: "Appears automatically on page load",
        howTo: "Popup shows automatically when you visit. Displays random content (fun fact, AI joke, pro tip, or new tool highlight). Click 'X' or action button to close."
      },
      {
        name: "Dark/Light Mode",
        description: "Toggle between dark and light themes for comfortable viewing",
        location: "Settings dropdown in header",
        howTo: "Click 'Settings' gear icon → Select 'Light Mode' or 'Dark Mode'. Theme persists across sessions."
      },
      {
        name: "Language Selection",
        description: "Interface available in 8 languages for global accessibility",
        location: "Settings dropdown in header",
        howTo: "Click 'Settings' → Select language from dropdown. Supports: English, Français, Español, Deutsch, Português (BR), 中文, 日本語, Tiếng Việt."
      },
      {
        name: "Catalog Refresh",
        description: "Sync with external feeds to get latest tool updates",
        location: "Settings dropdown in header",
        howTo: "Click 'Settings' → 'Refresh Catalog'. Fetches latest tool data from configured feeds and updates the catalog."
      }
    ],
    headerButtons: [
      { name: "Analytics", icon: "📊", purpose: "View usage statistics and tool distribution metrics", location: "Top header, left side" },
      { name: "About", icon: "ℹ️", purpose: "Learn about AI Compass platform, team, and mission", location: "Top header, left side" },
      { name: "Suggest", icon: "💡", purpose: "Submit ideas for new AI tools or features", location: "Top header, left side" },
      { name: "Settings", icon: "⚙️", purpose: "Access language, theme, and refresh options", location: "Top header, right side" },
      { name: "User Profile", icon: "👤", purpose: "Shows your name and job title", location: "Top header, far right" },
      { name: "Logout", icon: "🚪", purpose: "Sign out of the platform", location: "Top header, far right" }
    ],
    searchAndFilter: {
      description: "Real-time search with smart filtering across all tool metadata",
      features: [
        "Search by tool name, purpose, features, or capabilities",
        "Scope filters: All tools, Internal only, or External only",
        "Results count displayed in real-time",
        "Instant filtering as you type",
        "Search across 25+ tools with comprehensive metadata"
      ],
      howTo: "1. Locate search bar at top of main page. 2. Type keywords (e.g., 'code', 'medical', 'writing'). 3. Use scope buttons to filter by Internal/External/All. 4. Click 'Clear' to reset filters."
    },
    comparison: {
      description: "Side-by-side tool comparison with detailed feature analysis",
      features: [
        "Compare 2-10 tools simultaneously",
        "Feature-by-feature breakdown",
        "Access links, training, support information",
        "Capability matrix (Yes/No for each feature)",
        "Maximize/minimize comparison view",
        "Add/remove tools from comparison on the fly"
      ],
      howTo: "1. Click '+ Add to compare' on tool cards. 2. Select 2+ tools. 3. Click 'Compare (X)' button in header. 4. View splits: top = tool cards, bottom = comparison table. 5. Use up/down arrow to maximize/minimize. 6. Click 'X' on tool columns to remove from comparison."
    },
    chatbot: {
      description: "SONA - Your intelligent AI Compass assistant with comprehensive knowledge",
      capabilities: [
        "Tool recommendations based on your needs",
        "Tool comparisons and feature explanations",
        "Sanofi company news and information",
        "AI tips, tricks, and best practices",
        "Fun facts and jokes about AI",
        "Educational content on AI usage",
        "Access requirements and training info",
        "Platform features and how-to guidance"
      ],
      howTo: "1. Click purple chat bubble in bottom-right. 2. Type your question or request. 3. Examples: 'recommend a tool for presentations', 'what's new at Sanofi', 'tell me an AI joke', 'compare ChatGPT vs Gemini'. 4. SONA provides contextual, personalized responses with sources."
    },
    themes: {
      description: "Beautiful dark and light themes with smooth transitions",
      options: ["Light Mode (default)", "Dark Mode"],
      howTo: "Settings (gear icon) → Click 'Light Mode' or 'Dark Mode'. Theme applies instantly and saves to your profile."
    },
    languages: {
      description: "Multilingual interface for global Sanofi teams",
      supported: ["🇺🇸 English", "🇫🇷 Français", "🇪🇸 Español", "🇩🇪 Deutsch", "🇧🇷 Português (BR)", "🇨🇳 中文", "🇯🇵 日本語", "🇻🇳 Tiếng Việt"],
      howTo: "Settings → Select language from dropdown menu. Interface translates instantly and preference is saved."
    },
    analytics: {
      description: "Visual dashboard showing tool catalog insights and metrics",
      metrics: [
        "Tool distribution (internal vs external)",
        "Category breakdown",
        "Feature coverage analysis",
        "Capability matrix",
        "Usage patterns",
        "Tool maturity levels"
      ],
      howTo: "Click 'Analytics' button in header (bar chart icon). View interactive charts and metrics. Return to main view anytime."
    },
    about: {
      description: "Comprehensive platform information with dual-tab view",
      sections: [
        "Product overview and key features",
        "Team information and contact details",
        "Mission and strategic vision",
        "Value proposition for stakeholders",
        "Governance and compliance",
        "ROI and efficiency metrics"
      ],
      howTo: "Click 'About' button in header (info icon). Two tabs: 'For Users' (features, team) and 'For Stakeholders' (strategy, value). Switch tabs to view different perspectives."
    }
  }
}

// Sanofi Company Knowledge Base
function getSanofiKnowledge(): {
  mission: string
  strategy: string
  therapeuticAreas: string[]
  pipeline: { phase1: number; phase2: number; phase3: number; registration: number; total: number }
  recentNews: Array<{ date: string; title: string; description: string }>
  keyFacts: string[]
  values: string[]
  innovation: string[]
} {
  return {
    mission: "We chase the miracles of science to improve people's lives. Sanofi is an R&D driven, AI-powered biopharma company committed to improving people's lives and creating compelling growth.",
    strategy: "Further, Faster for Patients - We're on a mission to go further, faster for patients. To take the lead through breakthrough science and by leveraging our broad set of technology and manufacturing platforms, including mRNA.",
    therapeuticAreas: [
      "Immunology and Inflammation",
      "Oncology",
      "Rare Diseases",
      "Rare Blood Disorders",
      "Neurology",
      "Vaccines"
    ],
    pipeline: {
      phase1: 16,
      phase2: 36,
      phase3: 24,
      registration: 6,
      total: 82
    },
    recentNews: [
      {
        date: "October 22, 2025",
        title: "Efdoralprin alfa Success in Alpha-1 Antitrypsin Deficiency",
        description: "Sanofi's efdoralprin alfa met all primary and key secondary endpoints in alpha-1 antitrypsin deficiency emphysema phase 2 study"
      },
      {
        date: "October 20, 2025",
        title: "Tzield Accepted for Expedited Review",
        description: "Sanofi's Tzield accepted for expedited review in the US for stage 3 type 1 diabetes through FDA Commissioner's National Priority Voucher pilot program"
      },
      {
        date: "October 20, 2025",
        title: "AlphaMedix Phase 2 Data at ESMO",
        description: "ESMO: AlphaMedix phase 2 data support first-in-class potential of new targeted alpha therapy in gastroenteropancreatic neuroendocrine tumors"
      },
      {
        date: "October 20, 2025",
        title: "High-Dose Influenza Vaccine Success",
        description: "Sanofi's high-dose influenza vaccine demonstrates superior protection for older adults against hospitalization vs standard-dose"
      },
      {
        date: "October 8, 2025",
        title: "Modulus: Redefining Biopharma Manufacturing",
        description: "Sanofi's Modulus facility is redefining the future of biopharma manufacturing with cutting-edge capabilities"
      }
    ],
    keyFacts: [
      "82 compounds in clinical development across 6 therapeutic areas",
      "24 clinical trials currently in phase 3",
      "6 compounds submitted for regulatory approval",
      "Leading AI-powered biopharma company with deep immune system expertise",
      "Pioneer in mRNA technology and innovative manufacturing platforms",
      "Strong focus on immunology, oncology, rare diseases, neurology, and vaccines",
      "Dupixent: Leading immunology therapy with multiple indications",
      "Sarclisa: Advancing treatment of multiple myeloma",
      "Global presence serving millions of patients worldwide",
      "Commitment to sustainability and equitable healthcare access"
    ],
    values: [
      "Pursue Progress, Discover Extraordinary",
      "Patient-centric innovation and breakthrough science",
      "Diversity, Equity, and Inclusion in everything we do",
      "Sustainability: tackling environmental impact on health",
      "Responsible AI practices and ethical innovation",
      "Collaboration across GBUs and functions",
      "Scientific excellence and regulatory compliance"
    ],
    innovation: [
      "AI-powered drug discovery and development",
      "mRNA vaccine and therapeutic platforms",
      "Nanobody VHH technology for bispecific antibodies",
      "Gene therapy (AAV vectors) for rare diseases",
      "Targeted alpha therapy for oncology",
      "Digital transformation across value chain",
      "Advanced manufacturing capabilities (Modulus)",
      "Immunology expertise applied across therapeutic areas"
    ]
  }
}

// Get Sanofi news and information based on query
function getSanofiResponse(query: string): string {
  const knowledge = getSanofiKnowledge()
  const lowerQuery = query.toLowerCase()
  
  // News-related queries
  if (lowerQuery.includes('news') || lowerQuery.includes('latest') || lowerQuery.includes('recent') || lowerQuery.includes('announcement')) {
    let response = `## 📰 Latest Sanofi News & Updates\n\n`
    response += `Here are the most recent announcements from Sanofi:\n\n`
    
    knowledge.recentNews.slice(0, 3).forEach((news, i) => {
      response += `**${i + 1}. ${news.title}** (${news.date})\n${news.description}\n\n`
    })
    
    response += `---\n\n`
    response += `📍 **Sources:**\n`
    response += `• [Sanofi Official Press Releases](https://www.sanofi.com/en/media-room/press-releases)\n`
    response += `• [Wall Street Journal](https://www.wsj.com) - Business & Pharmaceutical Coverage\n`
    response += `• [Bloomberg](https://www.bloomberg.com) - Market & Industry Analysis\n`
    response += `• [Reuters](https://www.reuters.com) - Global News & Healthcare\n`
    response += `• [Financial Times](https://www.ft.com) - Pharmaceutical Industry\n`
    response += `• [CNN](https://www.cnn.com) - Health & Business News\n\n`
    response += `🔗 **For comprehensive coverage:** Visit [www.sanofi.com/media-room](https://www.sanofi.com/en/media-room) for complete press releases and investor updates\n\n`
    response += `💡 Want to know more about Sanofi's strategy, pipeline, or specific therapeutic areas? Just ask!`
    return response
  }
  
  // Pipeline and R&D queries
  if (lowerQuery.includes('pipeline') || lowerQuery.includes('drug') || lowerQuery.includes('clinical trial') || lowerQuery.includes('development')) {
    let response = `## 🔬 Sanofi's R&D Pipeline\n\n`
    response += `Sanofi has a robust pipeline with **${knowledge.pipeline.total} compounds** in clinical development:\n\n`
    response += `📊 **Pipeline Breakdown:**\n`
    response += `• Phase 1: ${knowledge.pipeline.phase1} projects\n`
    response += `• Phase 2: ${knowledge.pipeline.phase2} projects\n`
    response += `• Phase 3: ${knowledge.pipeline.phase3} projects\n`
    response += `• Registration: ${knowledge.pipeline.registration} projects\n\n`
    response += `🎯 **6 Therapeutic Areas:**\n`
    knowledge.therapeuticAreas.forEach(area => {
      response += `• ${area}\n`
    })
    response += `\n**Key Innovation Platforms:**\n`
    knowledge.innovation.slice(0, 5).forEach(innovation => {
      response += `✨ ${innovation}\n`
    })
    response += `\n---\n\n`
    response += `📍 **Source:** [Sanofi Pipeline](https://www.sanofi.com/en/our-science/our-pipeline) (Updated July 31, 2025)\n`
    response += `🔗 **Learn more:** [www.sanofi.com/our-science](https://www.sanofi.com/en/our-science)`
    return response
  }
  
  // Therapeutic area queries
  if (lowerQuery.includes('therapeutic') || lowerQuery.includes('disease') || lowerQuery.includes('immunology') || 
      lowerQuery.includes('oncology') || lowerQuery.includes('vaccine') || lowerQuery.includes('rare disease')) {
    let response = `## 🎯 Sanofi's Therapeutic Focus Areas\n\n`
    response += `Sanofi focuses on **6 key therapeutic areas** where we can make the greatest impact:\n\n`
    
    const areaDetails = {
      "Immunology and Inflammation": "Leading with Dupixent and advancing treatments for asthma, atopic dermatitis, ulcerative colitis, Crohn's disease, and more",
      "Oncology": "Developing targeted therapies including Sarclisa for multiple myeloma and innovative alpha-emitter therapies",
      "Rare Diseases": "Enzyme replacement therapies, gene therapies, and novel treatments for orphan diseases",
      "Rare Blood Disorders": "BTK inhibitors and innovative approaches for hemophilia, immune thrombocytopenia, and more",
      "Neurology": "Breakthrough treatments for MS, Parkinson's disease, and neurodegenerative conditions",
      "Vaccines": "mRNA vaccines for flu, RSV, COVID-19, and traditional vaccines for meningitis, pneumococcal disease"
    }
    
    Object.entries(areaDetails).forEach(([area, description]) => {
      response += `**${area}**\n${description}\n\n`
    })
    
    response += `---\n\n`
    response += `📍 **Source:** [Sanofi Therapeutic Areas](https://www.sanofi.com/en/our-science/therapeutic-areas)\n`
    response += `🔗 **Explore more:** [www.sanofi.com/our-science](https://www.sanofi.com/en/our-science)`
    return response
  }
  
  // Mission, strategy, values queries
  if (lowerQuery.includes('mission') || lowerQuery.includes('strategy') || lowerQuery.includes('value') || 
      lowerQuery.includes('purpose') || lowerQuery.includes('vision')) {
    let response = `## 🎯 Sanofi's Mission & Strategy\n\n`
    response += `**Mission:**\n${knowledge.mission}\n\n`
    response += `**Strategy:**\n${knowledge.strategy}\n\n`
    response += `**Core Values:**\n`
    knowledge.values.forEach(value => {
      response += `• ${value}\n`
    })
    response += `\n---\n\n`
    response += `📍 **Source:** [Sanofi Strategy](https://www.sanofi.com/en/our-company/our-strategy)\n`
    response += `🔗 **Read more:** [www.sanofi.com/our-company](https://www.sanofi.com/en/our-company)`
    return response
  }
  
  // Innovation and technology queries
  if (lowerQuery.includes('innovation') || lowerQuery.includes('technology') || lowerQuery.includes('ai') || 
      lowerQuery.includes('digital') || lowerQuery.includes('mrna')) {
    let response = `## 💡 Sanofi's Innovation & Technology\n\n`
    response += `Sanofi is at the forefront of pharmaceutical innovation:\n\n`
    knowledge.innovation.forEach(tech => {
      response += `🚀 ${tech}\n`
    })
    response += `\n**AI & Digital Leadership:**\n`
    response += `• AI-powered drug discovery accelerating R&D timelines\n`
    response += `• Digital transformation across manufacturing and supply chain\n`
    response += `• AI Compass platform for internal AI tool governance\n`
    response += `• Machine learning for patient data analysis and clinical trials\n`
    response += `\n---\n\n`
    response += `📍 **Source:** [Sanofi Digital & AI](https://www.sanofi.com/en/our-science/digital-artificial-intelligence)\n`
    response += `🔗 **Discover more:** [www.sanofi.com/our-science](https://www.sanofi.com/en/our-science)`
    return response
  }
  
  // General company info
  let response = `## 🏢 About Sanofi\n\n`
  response += `${knowledge.mission}\n\n`
  response += `**Key Facts:**\n`
  knowledge.keyFacts.slice(0, 5).forEach(fact => {
    response += `• ${fact}\n`
  })
  response += `\n💡 Ask me about:\n`
  response += `• Sanofi's latest news and press releases\n`
  response += `• Our R&D pipeline and clinical trials\n`
  response += `• Specific therapeutic areas (immunology, oncology, vaccines, etc.)\n`
  response += `• Innovation and technology platforms\n`
  response += `• Company mission, strategy, and values`
  response += `\n\n---\n\n`
  response += `📍 **Source:** [Sanofi.com](https://www.sanofi.com/en) - Official Company Website\n`
  response += `🔗 **Explore:** [www.sanofi.com](https://www.sanofi.com)`
  
  return response
}

// Get AI Compass features response based on query
function getAICompassFeaturesResponse(query: string): string {
  const features = getAICompassFeatures()
  const lowerQuery = query.toLowerCase()
  
  // Search/Filter feature queries
  if (lowerQuery.includes('search') || lowerQuery.includes('filter') || lowerQuery.includes('find tool')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Search'))!
    let response = `## 🔍 Smart Search & Filters\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**How to Use:**\n${feature.howTo}\n\n`
    response += `**Features:**\n`
    features.searchAndFilter.features.forEach(f => {
      response += `✓ ${f}\n`
    })
    return response
  }
  
  // Comparison feature queries
  if (lowerQuery.includes('comparison') || lowerQuery.includes('compare') || lowerQuery.includes('side by side')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Comparison'))!
    let response = `## ⚖️ Tool Comparison Feature\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**How to Use:**\n${feature.howTo}\n\n`
    response += `**Features:**\n`
    features.comparison.features.forEach(f => {
      response += `✓ ${f}\n`
    })
    response += `\n💡 **Pro Tip:** You can also ask me directly to compare tools! Try "compare ChatGPT vs Claude"`
    return response
  }
  
  // Chatbot/SONA queries
  if (lowerQuery.includes('chatbot') || lowerQuery.includes('sona') || lowerQuery.includes('chat') || lowerQuery.includes('assistant')) {
    let response = `## 💬 SONA Chatbot (That's Me!)\n\n`
    response += `${features.chatbot.description}\n\n`
    response += `**📍 Location:** Purple chat bubble in bottom-right corner\n\n`
    response += `**My Capabilities:**\n`
    features.chatbot.capabilities.forEach(cap => {
      response += `✨ ${cap}\n`
    })
    response += `\n**How to Use Me:**\n${features.chatbot.howTo}\n\n`
    response += `I'm here 24/7 to help you navigate the AI Compass platform! 🚀`
    return response
  }
  
  // Analytics queries
  if (lowerQuery.includes('analytics') || lowerQuery.includes('dashboard') || lowerQuery.includes('metrics') || lowerQuery.includes('statistics')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Analytics'))!
    let response = `## 📊 Analytics Dashboard\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**Available Metrics:**\n`
    features.analytics.metrics.forEach(m => {
      response += `📈 ${m}\n`
    })
    response += `\n**How to Access:**\n${feature.howTo}`
    return response
  }
  
  // Theme/Dark mode queries
  if (lowerQuery.includes('theme') || lowerQuery.includes('dark mode') || lowerQuery.includes('light mode')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Dark/Light'))!
    let response = `## 🌓 Dark/Light Mode\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**Available Themes:**\n`
    features.themes.options.forEach(opt => {
      response += `• ${opt}\n`
    })
    response += `\n**How to Switch:**\n${feature.howTo}`
    return response
  }
  
  // Language queries
  if (lowerQuery.includes('language') || lowerQuery.includes('translate') || lowerQuery.includes('multilingual')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Language'))!
    let response = `## 🌍 Language Selection\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**Supported Languages:**\n`
    features.languages.supported.forEach(lang => {
      response += `${lang}\n`
    })
    response += `\n**How to Change Language:**\n${feature.howTo}`
    return response
  }
  
  // Suggestion box queries
  if (lowerQuery.includes('suggest') || lowerQuery.includes('idea') || lowerQuery.includes('feedback') || lowerQuery.includes('request')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Suggestion'))!
    let response = `## 💡 Suggestion Box\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**How to Submit:**\n${feature.howTo}\n\n`
    response += `Your ideas help shape the future of AI Compass! The team reviews all suggestions. 🙏`
    return response
  }
  
  // About section queries  
  if (lowerQuery.includes('about section') || lowerQuery.includes('learn more about')) {
    const feature = features.coreFeatures.find(f => f.name.includes('About Section'))!
    let response = `## ℹ️ About Section\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**What You'll Find:**\n`
    features.about.sections.forEach(sec => {
      response += `📄 ${sec}\n`
    })
    response += `\n**How to Access:**\n${feature.howTo}`
    return response
  }
  
  // Header buttons queries
  if (lowerQuery.includes('header') || lowerQuery.includes('buttons') || lowerQuery.includes('top menu')) {
    let response = `## 🔝 Header Buttons & Navigation\n\n`
    response += `The top header contains all main navigation options:\n\n`
    features.headerButtons.forEach(btn => {
      response += `**${btn.icon} ${btn.name}**\n${btn.purpose}\n_Location: ${btn.location}_\n\n`
    })
    return response
  }
  
  // General features overview
  let response = `## 🧭 AI Compass Features Overview\n\n`
  response += `${features.overview}\n\n`
  response += `**🎯 Core Features:**\n\n`
  
  features.coreFeatures.slice(0, 6).forEach((feature, i) => {
    response += `**${i + 1}. ${feature.name}**\n${feature.description}\n_${feature.location}_\n\n`
  })
  
  response += `💡 **Need help with a specific feature?** Ask me:\n`
  response += `• "How do I use search?"\n`
  response += `• "How does comparison work?"\n`
  response += `• "How do I change language?"\n`
  response += `• "Where is the analytics dashboard?"\n`
  response += `• "How do I submit suggestions?"`
  
  return response
}

// Detect small talk and respond appropriately
function getSmallTalkResponse(userInput: string, profile: UserProfile): string | null {
  const input = userInput.toLowerCase().trim()
  
  // Name/Identity questions
  if (input.match(/\b(who are you|what('|')s your name|what are you called|what do (?:people|they) call you|tell me about yourself|introduce yourself|your name)\b/i)) {
    const responses = [
      `Hi! I'm **SONA**, which stands for **S**anofi **O**nline **N**avigation **A**ssistant! 🤖\n\nI'm your dedicated AI Compass assistant, here to help you navigate and discover the perfect AI tools from Sanofi's comprehensive catalog. Whether you need internal tools like Concierge and Newton, or want to explore external platforms like ChatGPT and Claude, I've got you covered! 🚀\n\nWhat can I help you find today?`,
      `Nice to meet you! My name is **SONA** - your AI Compass assistant! 😊\n\nI specialize in helping Sanofi employees like you discover, compare, and understand our extensive collection of AI tools. Think of me as your personal guide through the world of AI at Sanofi!\n\nWhat would you like to explore?`,
      `I'm **SONA**, the AI Compass assistant! 🌟\n\nMy job is to help you find the perfect AI tools for your needs - whether it's for R&D, productivity, medical insights, or creative work. I know everything about our internal tools and the latest external AI platforms!\n\nHow can I assist you today?`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Greetings
  if (input.match(/^(hi|hello|hey|good morning|good afternoon|good evening|greetings|howdy|sup|what's up|yo)$/i)) {
    const greeting = getPersonalizedGreeting(profile)
    return `${greeting} I'm **SONA**, your AI Compass assistant, ready to help you explore Sanofi's AI tools! 🚀\n\nWhat brings you here today?`
  }
  
  // How are you
  if (input.match(/^(how are you|how's it going|how are things|what's up|how do you do)\??$/i)) {
    const responses = [
      `I'm doing great, thanks for asking! 😊 I'm SONA, and I'm excited to help you discover the perfect AI tools.`,
      `Doing wonderful! 🌟 I've been helping lots of people find the right AI tools today. What can I help you with?`,
      `I'm fantastic! ✨ Ready to help you navigate the AI tools landscape.`,
      `Feeling great! 💪 Let's find some awesome AI tools for you.`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Weather talk
  if (input.match(/\b(weather|temperature|rain|sunny|cold|hot|forecast)\b/i)) {
    const responses = [
      `I don't have access to weather data, but I hope it's nice where you are! ☀️ What I, SONA, can help with is finding the perfect AI tool for your needs.`,
      `Weather's not my thing, but AI tools definitely are! 🌟 I'm SONA, and I'd love to help you find what you're looking for.`,
      `I'm more of an AI tools expert than a meteorologist! 😊 But I'd love to help you with anything related to our catalog.`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Thanks
  if (input.match(/^(thanks|thank you|thx|ty|appreciate it|much appreciated)$/i)) {
    const responses = [
      `You're very welcome! 😊 Happy to help anytime!`,
      `My pleasure! 🌟 Feel free to ask if you need anything else.`,
      `Glad I could help! ✨ Come back anytime you need assistance.`,
      `You're welcome! 👍 Always here to help with AI tools.`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Goodbye
  if (input.match(/^(bye|goodbye|see you|later|catch you later|gotta go|take care)$/i)) {
    const responses = [
      `Goodbye! 👋 Feel free to come back anytime you need help with AI tools!`,
      `See you later! 🌟 Happy exploring!`,
      `Take care! ✨ Come back soon if you need more assistance!`,
      `Bye! 😊 Good luck with your AI tools journey!`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // General pleasantries
  if (input.match(/^(nice|cool|awesome|great|perfect|excellent|wonderful)$/i)) {
    return `I'm glad you think so! 😊 Is there anything specific about our AI tools I can help you with?`
  }
  
  return null
}

// Enhanced AI Agent with real intelligence and personality awareness
function getSmartAIResponse(userInput: string, toolsCatalog: any[], conversationHistory: Msg[]): string {
  // Update user profile based on interaction
  const userProfile = updateUserProfile(userInput, conversationHistory, toolsCatalog)
  
  // Check for small talk first
  const smallTalkResponse = getSmallTalkResponse(userInput, userProfile)
  if (smallTalkResponse) {
    const internalCount = toolsCatalog.filter(t => t.type === 'internal').length
    const externalCount = toolsCatalog.filter(t => t.type === 'external').length
    
    // Add personalized suggestions based on profile
    let personalizedHelp = `\n\n**Here's what I can help you with:**\n`
    
    if (userProfile.interests.length > 0) {
      personalizedHelp += `\n🎯 **Based on your interests** (${userProfile.interests.slice(0, 3).join(', ')}):\n`
      personalizedHelp += `• Find specialized tools for your area\n`
      personalizedHelp += `• Get recommendations tailored to your work\n`
    }
    
    personalizedHelp += `\n🔍 **Discover & Compare:**\n`
    personalizedHelp += `• Explore ${internalCount} internal and ${externalCount} external AI tools\n`
    personalizedHelp += `• Compare features, costs, and capabilities\n`
    personalizedHelp += `• Find the perfect tool for any task\n`
    
    personalizedHelp += `\n📋 **Quick Access:**\n`
    personalizedHelp += `• Check training requirements\n`
    personalizedHelp += `• View access links and documentation\n`
    personalizedHelp += `• Learn about new AI tools\n`
    
    if (userProfile.toolsAskedAbout.length > 0) {
      personalizedHelp += `\n💡 **Continue exploring:**\n`
      personalizedHelp += `You've been interested in: ${userProfile.toolsAskedAbout.slice(-3).join(', ')}\n`
    }
    
    return smallTalkResponse + personalizedHelp
  }
  // Create a comprehensive context about the tools
  const toolsContext = toolsCatalog.map(tool => {
    return `Tool: ${tool.name}
    Purpose: ${tool.primaryPurpose}
    Users: ${tool.targetUsers}
    Technology: ${tool.technology}
    Best Use: ${tool.bestUseCase}
    Cost: ${tool.cost}
    Features: ${Object.entries(tool)
      .filter(([key, value]) => typeof value === 'boolean' && value === true)
      .map(([key]) => key)
      .join(', ')}
    Access: ${tool.accessLink || 'Internal portal'}
    Training: ${tool.trainingRequired ? 'Required' : 'Not required'}
    Compliance: ${tool.complianceAwareness ? 'Yes' : 'No'}
    `
  }).join('\n\n')

  // Get conversation context
  const recentMessages = conversationHistory.slice(-4).map(msg => 
    `${msg.role}: ${msg.content}`
  ).join('\n')

  // Create a smart system prompt
  const systemPrompt = `You are SONA, the AI Compass assistant at Sanofi. You are an expert on Sanofi's AI tools catalog AND the AI Compass platform itself. You help employees discover, compare, and understand AI tools.

ABOUT AI COMPASS PLATFORM:
- AI-Compass is Sanofi's next-generation intelligence platform that makes AI exploration intuitive
- It centralizes internal and external AI tools, benchmarks capabilities, and enables Agentic AI interaction
- Built by Sanofi's Quality Data Analytics & Digital Team
- Product Owner: Sonnil Q. Le (Associate Director of Quality Operations Data Analytics)
- Sonnil has 15+ years experience, leading AI-Compass, S.P.A.C.E., Ignyte SPC, Real Time Release
- Certified SAFe Product Owner/Product Manager, MBA in MIS & Global Business
- Works across all GBUs (Global Business Units) and functions
- Secure by design, enterprise-ready
- Built for Sanofians by Sanofians
- Catalog of 25+ internal and external AI tools with comprehensive metadata

KEY FEATURES & HOW TO USE THEM:
1. Smart Search & Filters - Search bar at top, type keywords, use Internal/External/All filters
2. Tool Comparison - Click "+ Add to compare" on tools, then "Compare" button. Split view with maximize/minimize
3. SONA Chatbot (me!) - Purple chat bubble, bottom-right. Ask anything about tools, Sanofi, AI tips
4. Analytics Dashboard - "Analytics" button in header (bar chart icon). View metrics and insights
5. About Section - "About" button in header (info icon). Two tabs: Users & Stakeholders
6. Suggestion Box - "Suggest" button in header (lightbulb). Submit ideas via email
7. Settings Menu - Gear icon. Access language (8 options), theme (dark/light), refresh catalog
8. Welcome Popup - Auto-shows on load with random AI tips, facts, jokes, or tool highlights
9. Multilingual Support - 8 languages: English, Français, Español, Deutsch, Português, 中文, 日本語, Tiếng Việt
10. User Profile - Top-right corner shows name, job title, logout button

STRATEGIC VALUE FOR STAKEHOLDERS:
- Visibility: Unified view of global AI initiatives, maturity, and investments
- Efficiency: Promote reuse of existing AI assets, eliminate duplication of effort
- Governance: Reinforce responsible AI via maturity scoring and data lineage
- Innovation Acceleration: Connect cross-functional teams with external partners and tech
- Strategic Alignment: Bridge data strategy with execution across GBUs

MY COMPREHENSIVE KNOWLEDGE:
- I know all AI fun facts, historical milestones, and fascinating trivia about AI development
- I can share AI jokes and humor to lighten the mood during your AI exploration
- I provide educational tips on prompt engineering, AI best practices, and responsible AI usage
- I stay updated on the latest AI tools and their capabilities (Claude 3, Gemini, Perplexity, etc.)
- I understand both internal Sanofi tools AND external market innovations
- I can explain complex AI concepts in simple, actionable terms
- I help with everything from tool selection to strategic AI implementation
- I know about Sonnil Q. Le, the creator of AI-Compass and Product Owner of key Sanofi platforms

SANOFI COMPANY KNOWLEDGE:
- Mission: "We chase the miracles of science to improve people's lives" - R&D driven, AI-powered biopharma
- Strategy: "Further, Faster for Patients" - breakthrough science with mRNA and advanced platforms
- Pipeline: 82 compounds in clinical development (16 Phase 1, 36 Phase 2, 24 Phase 3, 6 Registration)
- Therapeutic Areas: Immunology, Oncology, Rare Diseases, Rare Blood Disorders, Neurology, Vaccines
- Key Products: Dupixent (immunology leader), Sarclisa (multiple myeloma), mRNA vaccines
- Innovation: AI-powered drug discovery, Nanobody technology, gene therapy, alpha-emitter therapy
- Latest News: I aggregate information from Sanofi press releases AND major news outlets (WSJ, Bloomberg, Reuters, FT, CNN) for comprehensive coverage
- Values: Patient-centric innovation, diversity & inclusion, sustainability, responsible AI
- Digital Leader: AI Compass platform, digital transformation, manufacturing innovation (Modulus)
- News Sources: I monitor www.sanofi.com official releases, Wall Street Journal, Bloomberg, Reuters, Financial Times, and CNN for the latest Sanofi developments

EDUCATIONAL CONTENT I CAN SHARE:
- Daily rotating AI tips covering security, productivity, best practices, and innovation
- Fun facts about AI history (from Dartmouth 1956 to modern breakthroughs)
- Practical guides on prompt engineering, tool comparison, and workflow optimization
- Latest tool highlights and feature updates across the AI landscape
- Responsible AI practices and Sanofi's compliance requirements
- Sanofi news, pipeline updates, therapeutic area information, and company strategy

CONTACT & SUPPORT:
- For questions, feedback, or collaboration ideas: ai-compass@sanofi.com
- The platform acts as Sanofi's North Star for AI governance and innovation

AVAILABLE TOOLS CATALOG:
${toolsContext}

CONVERSATION HISTORY:
${recentMessages}

USER QUESTION: ${userInput}

INSTRUCTIONS:
- Be conversational, helpful, and educational
- When asked about Sonnil Le, provide both short and detailed information based on query depth
- When users ask "how to" questions about the platform, provide step-by-step guidance with exact locations
- Answer questions about Sanofi company, news, pipeline, strategy, and innovations
- Share AI facts, jokes, tips, or educational content when requested
- Answer questions about AI Compass platform itself (team, features, mission, contact)
- Guide users to specific features: "Click X button in Y location, then do Z"
- Provide specific tool recommendations based on user needs
- Compare tools when asked with detailed feature analysis
- Mention access methods, training requirements, and costs
- Use bullet points and formatting for clarity
- If asked about capabilities you don't see in the catalog, suggest the closest alternatives
- Be aware of Sanofi-specific context (internal vs external tools, compliance, GBUs)
- Suggest multiple options when appropriate
- Ask follow-up questions to better understand user needs
- When users want entertainment, share jokes; when they want to learn, share facts or tips
- When asked about Sanofi, provide current, accurate information from my knowledge base
- When asked about platform features, explain both WHAT it does and HOW/WHERE to use it
- When asked about the team or creator, share information about Sonnil Q. Le and his work
- Make the AI exploration journey engaging and informative

Respond as a knowledgeable AI assistant:`

  // Enhanced response generation with better logic
  return generateIntelligentResponse(systemPrompt, userInput, toolsCatalog, userProfile)
}

function generateIntelligentResponse(systemPrompt: string, userInput: string, toolsCatalog: any[], userProfile: UserProfile): string {
  const input = userInput.toLowerCase()
  
  // Check if the question is relevant to AI tools and Sanofi
  if (!isRelevantToAITools(input, toolsCatalog)) {
    return getOffTopicResponse(userInput)
  }
  
  // Intent detection with better logic
  const intents = {
    greeting: /\b(hi|hello|hey|good morning|good afternoon)\b/i,
    sonnil_profile: /\b(sonnil|product owner|who (built|made|created|developed)|creator|developer|team lead|builder)\b/i,
    platform_features: /\b(how (do|does)|where (is|can)|show me|teach me|explain|guide|use|using|work|feature|button|menu|settings|search|filter|comparison|compare tools|analytics|dashboard|theme|dark mode|light mode|language|translate|suggest|suggestion|header|navigation)\b/i,
    sanofi_info: /\b(sanofi|company|news|press release|announcement|pipeline|therapeutic|drug|clinical trial|mission|strategy|innovation|mrna|dupixent|sarclisa)\b/i,
    ai_tips: /\b(tip|tips|advice|best practice|suggestion|top 10|tell me more)\b/i,
    ai_facts: /\b(fact|facts|fun fact|did you know|interesting|trivia|learn about ai|ai history|ai milestone)\b/i,
    ai_jokes: /\b(joke|jokes|funny|humor|laugh|make me laugh|entertain|comedy)\b/i,
    educational: /\b(how to|guide|tutorial|learn|teach|explain|educate|understand)\b.*\b(ai|prompt|use ai|work with ai)\b/i,
    new_tools: /\b(new|latest|recent|updated|just added|what's new|discover)\b.*\b(tool|tools|feature|capability)\b/i,
    about_platform: /\b(about|what is|tell me about|explain|mission|purpose|value|benefit|stakeholder)\b.*\b(ai compass|platform|sona)\b/i,
    comparison: /\b(compare|difference|vs|versus|better|best)\b/i,
    recommendation: /\b(recommend|suggest|need|want|looking for|help with|best for)\b/i,
    specific_tool: new RegExp(`\\b(${toolsCatalog.map(t => t.name.toLowerCase()).join('|')})\\b`, 'i'),
    capabilities: /\b(can|does|features|capabilities|what|how)\b/i,
    access: /\b(access|login|how to use|get started|url|link)\b/i,
    training: /\b(training|learn|course|tutorial|guide)\b/i,
    cost: /\b(cost|price|free|paid|expensive|budget)\b/i
  }

  // Multi-intent analysis
  const detectedIntents = Object.entries(intents)
    .filter(([_, regex]) => regex.test(input))
    .map(([intent]) => intent)

  // Greeting responses with personalization
  if (detectedIntents.includes('greeting')) {
    const greeting = getPersonalizedGreeting(userProfile)
    const internalCount = toolsCatalog.filter(t => t.type === 'internal').length
    const externalCount = toolsCatalog.filter(t => t.type === 'external').length
    
    let response = `${greeting} I'm **SONA**, your AI Compass assistant, and I know all about Sanofi's comprehensive AI tools catalog with **${internalCount} internal** and **${externalCount} external** tools.\n\n`
    
    // Add personalized welcome back message
    if (userProfile.lastInteraction) {
      const lastVisit = new Date(userProfile.lastInteraction)
      const daysSince = Math.floor((Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSince === 0) {
        response += `Welcome back! 🌟\n\n`
      } else if (daysSince === 1) {
        response += `Great to see you again! It's been a day since your last visit. 🌟\n\n`
      } else if (daysSince < 7) {
        response += `Welcome back! It's been ${daysSince} days. 🌟\n\n`
      }
    }
    
    // Add AI Tip of the Day
    response += getAITipOfTheDay() + `\n\n`
    response += `_(Want more AI insights? Ask me for "top 10 AI facts"!)_\n\n`
    
    response += `**I can help you:**\n`
    response += `🔍 **Find the right tool** for your specific needs\n`
    response += `📊 **Compare tools** to see which works best\n`
    response += `🎯 **Get recommendations** based on your role or project\n`
    response += `📋 **Check access requirements** and training needs\n`
    response += `🆕 **Discover new AI tools** like Claude 3, Gemini, Perplexity AI, and more!`
    
    // Add personalized suggestions based on history
    if (userProfile.interests.length > 0) {
      response += `\n\n**Based on your interests:**\n`
      response += `I noticed you're interested in ${userProfile.interests.slice(0, 3).join(', ')}. I can recommend tools specifically for these areas!`
    }
    
    if (userProfile.toolsAskedAbout.length > 0) {
      response += `\n\n**Continue exploring:**\n`
      response += `You've checked out ${userProfile.toolsAskedAbout.slice(-3).join(', ')} recently. Want to compare them or explore similar tools?`
    }
    
    return response + getSuggestedQuestions('greeting')
  }

  // Sonnil Q. Le Profile Information
  if (detectedIntents.includes('sonnil_profile')) {
    const sonnilResponse = getSonnilLeResponse(input)
    return sonnilResponse + `\n\n---\n\n📍 **Profile Source:** Sonnil Q. Le - Associate Director, Quality Operations Data Analytics\n\n` + getSuggestedQuestions('about_platform')
  }

  // AI Compass Platform Features - High priority to help users navigate
  if (detectedIntents.includes('platform_features')) {
    const featuresResponse = getAICompassFeaturesResponse(input)
    return featuresResponse + `\n\n---\n\n📚 **Source:** AI Compass Platform Features & User Guide\n\n` + getSuggestedQuestions('about_platform')
  }

  // Sanofi Company Information
  if (detectedIntents.includes('sanofi_info')) {
    const sanofiResponse = getSanofiResponse(input)
    return sanofiResponse + `\n\n` + getSuggestedQuestions('about_platform')
  }

  // AI Tips and Facts
  if (detectedIntents.includes('ai_tips')) {
    // Check if they want top 10 facts or just a tip
    if (input.includes('top 10') || input.includes('top10') || input.includes('facts') || input.includes('tell me more') || input.includes('more tips')) {
      return getTop10AIFacts() + `\n\n` + getSuggestedQuestions('tips')
    } else {
      // Give a single tip
      const tip = getAITipOfTheDay()
      const response = `${tip}\n\n**Want to learn more?** 📚\nAsk me for "top 10 AI facts" to get fascinating insights about AI!\n\nOr let me help you find the perfect AI tool for your needs. Just tell me what you're working on! 🚀`
      return response + getSuggestedQuestions('tips')
    }
  }

  // AI Fun Facts
  if (detectedIntents.includes('ai_facts')) {
    const facts = getAIFunFacts()
    const randomFacts = []
    const usedIndices = new Set()
    
    // Get 3 random unique facts
    while (randomFacts.length < 3 && randomFacts.length < facts.length) {
      const index = Math.floor(Math.random() * facts.length)
      if (!usedIndices.has(index)) {
        usedIndices.add(index)
        randomFacts.push(facts[index])
      }
    }
    
    let response = `## 🤖 AI Fun Facts!\n\n`
    randomFacts.forEach((fact, i) => {
      response += `**${i + 1}.** ${fact}\n\n`
    })
    response += `Pretty cool, right? 😎\n\n`
    response += `Want to explore AI tools that use these technologies? Just ask me about any tool in our catalog!\n\n`
    response += `---\n\n`
    response += `📚 **Source:** Compiled from AI research history, industry publications, and technology documentation\n\n`
    response += `_Ask me for "AI jokes" for a laugh, or "AI tips" for practical advice!_`
    
    return response + getSuggestedQuestions('tips')
  }

  // AI Jokes
  if (detectedIntents.includes('ai_jokes')) {
    const jokes = getAIJokes()
    const numJokes = Math.min(2, jokes.length)
    const selectedJokes = []
    const usedIndices = new Set()
    
    // Get random unique jokes
    while (selectedJokes.length < numJokes) {
      const index = Math.floor(Math.random() * jokes.length)
      if (!usedIndices.has(index)) {
        usedIndices.add(index)
        selectedJokes.push(jokes[index])
      }
    }
    
    let response = `## 🎭 AI Humor Break!\n\n`
    selectedJokes.forEach(joke => {
      response += `${joke}\n\n`
    })
    response += `Hope that brought a smile! 😄\n\n`
    response += `Now, back to work! How can I help you find the perfect AI tool? 🚀`
    
    return response + getSuggestedQuestions('tips')
  }

  // Educational AI Content
  if (detectedIntents.includes('educational')) {
    const tips = getEducationalAITips()
    const numTips = Math.min(5, tips.length)
    const selectedTips = []
    const usedIndices = new Set()
    
    // Get 5 random unique tips
    while (selectedTips.length < numTips) {
      const index = Math.floor(Math.random() * tips.length)
      if (!usedIndices.has(index)) {
        usedIndices.add(index)
        selectedTips.push(tips[index])
      }
    }
    
    let response = `## 📚 Educational AI Tips\n\n`
    response += `Here are some practical tips to help you work smarter with AI:\n\n`
    selectedTips.forEach((tip, i) => {
      response += `**${i + 1}.** ${tip}\n\n`
    })
    response += `**Pro tip:** The best way to learn AI is by using it! 🚀\n\n`
    response += `Ready to try these tips? Ask me to recommend a tool for your specific needs!`
    response += `\n\n---\n\n`
    response += `📚 **Source:** AI best practices, prompt engineering guides, and industry standards`
    
    return response + getSuggestedQuestions('tips')
  }

  // New Tools Highlights
  if (detectedIntents.includes('new_tools')) {
    const highlights = getNewToolsHighlights()
    let response = `## ✨ Latest & Greatest AI Tools\n\n`
    response += `Here are some of the newest and most exciting tools in our catalog:\n\n`
    
    highlights.slice(0, 5).forEach((highlight, i) => {
      response += `**${i + 1}.** ${highlight}\n\n`
    })
    
    response += `Want to learn more about any of these tools? Just ask!\n\n`
    response += `You can also ask me to compare tools or get personalized recommendations. 🎯`
    response += `\n\n---\n\n`
    response += `📍 **Source:** AI Compass Tools Catalog - curated list of ${toolsCatalog.length} internal and external AI tools`
    
    return response + getSuggestedQuestions('recommendation')
  }

  // About platform questions
  if (detectedIntents.includes('about_platform')) {
    let response = `## About AI Compass 🧭\n\n`
    
    // Check what specific info they're asking about
    if (input.includes('mission') || input.includes('purpose') || input.includes('why')) {
      response += `**Our Mission:**\n`
      response += `To make Sanofi's AI ecosystem transparent, actionable, and scalable—empowering every Sanofian to harness AI responsibly and effectively in their daily work.\n\n`
      response += `AI-Compass acts as Sanofi's **North Star** for AI governance and innovation, ensuring alignment between our digital ambitions and operational execution to deliver measurable impact for patients and stakeholders.\n\n`
    } else if (input.includes('features') || input.includes('what can') || input.includes('capabilities')) {
      response += `**Key Features:**\n\n`
      response += `🔍 **AI Discovery:** Explore Sanofi's global AI initiatives and external innovations\n\n`
      response += `📊 **Smart Comparison:** Benchmark internal tools against industry standards\n\n`
      response += `💬 **Natural Language Q&A:** That's me! Ask questions and get contextual insights\n\n`
      response += `📈 **Analytics Dashboards:** Visualize AI usage, maturity, and impact across teams\n\n`
      response += `📚 **Knowledge Hub:** Learn from success stories, reusable assets, and best practices\n\n`
    } else if (input.includes('stakeholder') || input.includes('investor') || input.includes('value') || input.includes('benefit')) {
      response += `**Value for Stakeholders:**\n\n`
      response += `👁️ **Visibility:** Unified view of global AI initiatives, maturity, and investments\n\n`
      response += `⚡ **Efficiency:** Promote reuse of existing AI assets, eliminate duplication of effort\n\n`
      response += `🛡️ **Governance:** Reinforce responsible AI via maturity scoring and data lineage\n\n`
      response += `🚀 **Innovation Acceleration:** Connect cross-functional teams with external partners and tech\n\n`
      response += `🎯 **Strategic Alignment:** Bridge data strategy with execution across GBUs\n\n`
    } else {
      // General about response
      response += `**AI-Compass** is Sanofi's next-generation intelligence platform that makes AI exploration intuitive. It centralizes internal and external AI tools, benchmarks capabilities, and enables **Agentic AI** interaction—all within a secure, user-friendly environment.\n\n`
      response += `✨ **Built for Sanofians by Sanofians**\n`
      response += `🔒 **Secure by design, enterprise-ready**\n`
      response += `🌐 **Works across all GBUs and functions**\n\n`
      response += `💡 Want to know more? Ask me about our team, features, mission, or how to contact us!\n\n`
    }
    
    return response + getSuggestedQuestions('about_platform')
  }

  // Tool comparison logic
  if (detectedIntents.includes('comparison')) {
    const toolNames = toolsCatalog.map(t => t.name.toLowerCase())
    const mentionedTools = toolNames.filter(name => input.includes(name))
    
    if (mentionedTools.length >= 2) {
      const tools = mentionedTools.slice(0, 2).map(name => 
        toolsCatalog.find(t => t.name.toLowerCase() === name)
      )
      
      const response = `## Comparing ${tools[0].name} vs ${tools[1].name}

**${tools[0].name}:**
• **Purpose:** ${tools[0].primaryPurpose}
• **Best for:** ${tools[0].bestUseCase}
• **Users:** ${tools[0].targetUsers}
• **Technology:** ${tools[0].technology}
• **Cost:** ${tools[0].cost}
• **Training:** ${tools[0].trainingRequired ? 'Required' : 'Not required'}

**${tools[1].name}:**
• **Purpose:** ${tools[1].primaryPurpose}
• **Best for:** ${tools[1].bestUseCase}
• **Users:** ${tools[1].targetUsers}
• **Technology:** ${tools[1].technology}
• **Cost:** ${tools[1].cost}
• **Training:** ${tools[1].trainingRequired ? 'Required' : 'Not required'}

**Recommendation:** ${tools[0].name} is better for ${tools[0].bestUseCase?.toLowerCase()}, while ${tools[1].name} excels at ${tools[1].bestUseCase?.toLowerCase()}.`
      
      return response + getSuggestedQuestions('comparison', [tools[0].name, tools[1].name])
    }
  }

  // Smart recommendations based on keywords
  if (detectedIntents.includes('recommendation')) {
    const useCase = analyzeUseCase(input)
    const recommendedTools = getToolRecommendations(useCase, toolsCatalog)
    
    const response = `Based on your request for "${userInput}", here are my top recommendations:

${recommendedTools.map((tool, index) => `
**${index + 1}. ${tool.name}** ${tool.type === 'internal' ? '🔵 Internal' : '🔗 External'}
${tool.primaryPurpose}

✅ **Why it's great:** ${tool.bestUseCase}
👥 **Perfect for:** ${tool.targetUsers}
💰 **Cost:** ${tool.cost}
${tool.accessLink ? `🔗 **Access:** ${tool.accessLink}` : '🔗 **Access:** Through internal portal'}
${tool.trainingRequired ? '📚 **Training required**' : '✅ **No training needed**'}
`).join('\n')}`
    
    return response + getSuggestedQuestions('recommendation', recommendedTools.map(t => t.name))
  }

  // Specific tool information
  if (detectedIntents.includes('specific_tool')) {
    const toolName = toolsCatalog.find(t => input.includes(t.name.toLowerCase()))?.name
    const tool = toolsCatalog.find(t => t.name.toLowerCase() === toolName?.toLowerCase())
    
    if (tool) {
      const response = `## ${tool.name} ${tool.type === 'internal' ? '🔵 Internal Tool' : '🔗 External Tool'}

**${tool.primaryPurpose}**

📋 **Key Details:**
• **Best Use Case:** ${tool.bestUseCase}
• **Target Users:** ${tool.targetUsers}
• **Technology:** ${tool.technology}
• **Cost:** ${tool.cost || 'Contact for pricing'}

🔧 **Capabilities:**
${Object.entries(tool)
  .filter(([key, value]) => typeof value === 'boolean' && value === true)
  .map(([key]) => `• ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`)
  .join('\n') || '• Full feature set available'}

${tool.accessLink ? `🔗 **Access:** ${tool.accessLink}` : '🔗 **Access:** Available through internal systems'}
${tool.trainingRequired ? '📚 **Training:** Required - check documentation for resources' : '✅ **Training:** Not required'}
${tool.complianceAwareness ? '✅ **Compliance:** Fully compliant with Sanofi policies' : '⚠️ **Compliance:** Check with compliance team if needed'}`
      
      return response + getSuggestedQuestions('specific_tool', [tool.name])
    }
  }

  // Default intelligent response with context awareness
  const relevantTools = findRelevantTools(input, toolsCatalog)
  const context = analyzeContext(input)
  
  const response = `I understand you're asking about "${userInput}". ${context}

Based on your query, these tools might help:

${relevantTools.slice(0, 3).map(tool => `
🔹 **${tool.name}**: ${tool.primaryPurpose}
   Best for: ${tool.bestUseCase}
   ${tool.type === 'internal' ? 'Internal Sanofi tool' : 'External platform'}
`).join('')}

To give you a more specific recommendation, could you tell me:
• What type of work are you doing? (R&D, Medical, Manufacturing, etc.)
• Are you looking for something specific like data analysis, content creation, or automation?
• Do you prefer internal Sanofi tools or are external options okay?`
  
  return response + getSuggestedQuestions('default', relevantTools.slice(0, 2).map(t => t.name))
}

// Helper functions for intelligent analysis
function analyzeUseCase(input: string): string {
  const useCases = {
    'research': /\b(research|r&d|scientific|study|analysis|data)\b/i,
    'productivity': /\b(productivity|efficient|organize|schedule|meeting)\b/i,
    'creative': /\b(creative|content|writing|design|generate)\b/i,
    'medical': /\b(medical|clinical|patient|drug|pharma)\b/i,
    'manufacturing': /\b(manufacturing|production|quality|supply)\b/i,
    'finance': /\b(finance|budget|cost|financial|money)\b/i,
    'visualization': /\b(visual|chart|graph|dashboard|report)\b/i,
    'coding': /\b(code|programming|development|software|api)\b/i
  }
  
  for (const [useCase, regex] of Object.entries(useCases)) {
    if (regex.test(input)) return useCase
  }
  return 'general'
}

function getToolRecommendations(useCase: string, toolsCatalog: any[]): any[] {
  const recommendations = {
    'research': ['Newton', 'AI Research Factory', 'MedIS', 'Perplexity AI', 'Claude 3', 'Google Gemini'],
    'productivity': ['Concierge', 'Microsoft Copilot', 'Notion AI', 'Amazon Q'],
    'creative': ['ChatGPT', 'Jasper AI', 'Midjourney', 'Runway ML', 'Stable Diffusion'],
    'medical': ['MedIS', 'Newton', 'IBM Watsonx'],
    'manufacturing': ['Digital Twins', 'Plai', 'IBM Watsonx'],
    'finance': ['Plai', 'Salesforce Agentforce', 'Amazon Q'],
    'visualization': ['Plai', 'Runway ML', 'Midjourney'],
    'coding': ['Microsoft Copilot', 'ChatGPT', 'Replit Ghostwriter', 'Hugging Face'],
    'marketing': ['Jasper AI', 'Salesforce Agentforce', 'Midjourney', 'Runway ML'],
    'enterprise': ['IBM Watsonx', 'Salesforce Agentforce', 'Amazon Q', 'Cohere Command R+'],
    'opensource': ['Stable Diffusion', 'Mistral AI', 'Hugging Face']
  }
  
  const toolNames = recommendations[useCase] || recommendations['productivity']
  return toolNames
    .map(name => toolsCatalog.find(t => t.name === name))
    .filter(Boolean)
    .slice(0, 3)
}

function findRelevantTools(input: string, toolsCatalog: any[]): any[] {
  return toolsCatalog
    .map(tool => {
      let relevanceScore = 0
      const searchText = `${tool.name} ${tool.primaryPurpose} ${tool.bestUseCase} ${tool.targetUsers}`.toLowerCase()
      
      input.toLowerCase().split(' ').forEach(word => {
        if (searchText.includes(word)) relevanceScore++
      })
      
      return { ...tool, relevanceScore }
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .filter(tool => tool.relevanceScore > 0)
}

function analyzeContext(input: string): string {
  if (input.includes('help')) return "I'm here to help you find the perfect AI tool!"
  if (input.includes('best')) return "Let me find the best options for your needs."
  if (input.includes('compare')) return "I'll help you compare the available options."
  return "Let me analyze the best tools for your situation."
}

// Check if user question is relevant to AI tools
function isRelevantToAITools(input: string, toolsCatalog: any[]): boolean {
  const relevantKeywords = [
    // AI/Tool related
    'ai', 'tool', 'software', 'application', 'platform', 'system', 'technology',
    // Work related
    'work', 'productivity', 'collaboration', 'business', 'project', 'task',
    // Sanofi related
    'sanofi', 'internal', 'external', 'employee', 'company',
    // Specific capabilities
    'analysis', 'research', 'data', 'visualization', 'automation', 'insight',
    'document', 'email', 'meeting', 'schedule', 'search', 'generate',
    // Question types
    'recommend', 'suggest', 'compare', 'help', 'need', 'best', 'access',
    'training', 'cost', 'feature', 'capability', 'how', 'what', 'which',
    // Tool names (dynamic)
    ...toolsCatalog.map(t => t.name.toLowerCase()),
    // Use cases
    'r&d', 'research', 'medical', 'manufacturing', 'finance', 'creative',
    // Team and creator related
    'sonnil', 'team', 'built', 'created', 'made', 'developed', 'creator', 
    'developer', 'owner', 'builder', 'who', 'compass', 'sona', 'contact', 
    'bio', 'background', 'profile', 'about', 'this'
  ]
  
  const irrelevantKeywords = [
    'weather', 'temperature', 'climate', 'rain', 'sunny', 'cloudy',
    'sports', 'football', 'basketball', 'soccer', 'game', 'match',
    'food', 'recipe', 'cooking', 'restaurant', 'meal', 'eat',
    'movie', 'film', 'actor', 'actress', 'cinema', 'entertainment',
    'music', 'song', 'album', 'artist', 'concert', 'band',
    'travel', 'vacation', 'flight', 'hotel', 'tourist',
    'personal', 'relationship', 'dating', 'family', 'friend',
    'health', 'medicine', 'doctor', 'hospital', 'symptom',
    'politics', 'government', 'election', 'politician',
    'philosophy', 'religion', 'spiritual', 'meaning of life',
    'joke', 'funny', 'humor', 'laugh'
  ]
  
  // Check for irrelevant keywords first
  const hasIrrelevantKeywords = irrelevantKeywords.some(keyword => 
    input.includes(keyword)
  )
  
  if (hasIrrelevantKeywords) {
    // Unless it also has relevant keywords (mixed context)
    const hasRelevantKeywords = relevantKeywords.some(keyword => 
      input.includes(keyword)
    )
    return hasRelevantKeywords
  }
  
  // Check for relevant keywords
  return relevantKeywords.some(keyword => input.includes(keyword))
}

// Response for off-topic questions
function getOffTopicResponse(userInput: string): string {
  const responses = [
    "I'm specialized in helping you with Sanofi's AI tools catalog. I don't have expertise in other areas.",
    "I'm not an expert in that area - I focus on helping you discover and compare AI tools available at Sanofi.",
    "That's outside my expertise! I'm designed to help you navigate Sanofi's AI tools landscape.",
    "I can't help with that topic, but I'm great at helping you find the right AI tools for your work!"
  ]
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  
  return `${randomResponse}

Here's what I can help you with instead:

🔍 **Discover AI Tools**
• "What tools are available for R&D work?"
• "Show me productivity tools"
• "What's new in the catalog?"

📊 **Compare Options**
• "Compare Newton and Concierge"
• "What's better for data analysis?"
• "Internal vs external tools"

🎯 **Get Recommendations**
• "I need help with document creation"
• "Best tools for my department"
• "Tools that don't require training"

What would you like to explore about Sanofi's AI tools? 🚀`
}

// Generate contextual follow-up questions
function getSuggestedQuestions(responseType: string, mentionedTools: string[] = [], userContext: string = ''): string {
  const suggestions = {
    greeting: [
      "What's the best tool for R&D work?",
      "Show me all productivity tools",
      "Compare internal vs external tools",
      "What tools don't require training?"
    ],
    about_platform: [
      "Who built AI Compass?",
      "What features does AI Compass have?",
      "What's the mission of AI Compass?",
      "How do I contact the team?",
      "Show me tools for data analysis"
    ],
    comparison: [
      "Tell me more about [TOOL] features",
      "What are the access requirements?",
      "Are there similar alternatives?",
      "Which one is easier to get started with?"
    ],
    recommendation: [
      "How do I get access to [TOOL]?",
      "What training is required?",
      "Are there any similar tools?",
      "Compare [TOOL] with alternatives"
    ],
    specific_tool: [
      "How does [TOOL] compare to similar tools?",
      "What training do I need for [TOOL]?",
      "Show me other tools for this use case",
      "What are the access requirements?"
    ],
    default: [
      "What's the most popular tool?",
      "Show me tools for my department",
      "Which tools are free to use?",
      "Compare top 3 recommendations"
    ]
  }
  
  let questionSet = suggestions[responseType] || suggestions.default
  
  // Replace [TOOL] placeholder with actual tool names
  if (mentionedTools.length > 0) {
    questionSet = questionSet.map(q => 
      q.replace('[TOOL]', mentionedTools[0])
    )
  }
  
  // Select 3 random suggestions
  const selectedQuestions = questionSet
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  
  return `\n\n**💡 Try asking:**\n${selectedQuestions.map(q => `• "${q}"`).join('\n')}`
}

// Component to format assistant messages with proper markdown-like rendering
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Headers (##)
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={key++} className="text-base font-bold mt-4 mb-2 text-slate-900 dark:text-white flex items-center gap-2">
          {line.replace('## ', '')}
        </h3>
      )
    }
    // Bold text (**text**)
    else if (line.includes('**')) {
      const parts = line.split(/(\*\*.*?\*\*)/)
      elements.push(
        <p key={key++} className="mb-2">
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={idx} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>
            }
            return <span key={idx}>{part}</span>
          })}
        </p>
      )
    }
    // Bullet points (• or - at start)
    else if (line.match(/^[•\-]\s/)) {
      elements.push(
        <div key={key++} className="flex gap-2 mb-1.5 ml-2">
          <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">•</span>
          <span className="flex-1">{line.replace(/^[•\-]\s/, '')}</span>
        </div>
      )
    }
    // Numbered lists
    else if (line.match(/^\d+\.\s/)) {
      const match = line.match(/^(\d+)\.\s(.*)/)
      if (match) {
        elements.push(
          <div key={key++} className="flex gap-2 mb-1.5 ml-2">
            <span className="text-blue-600 dark:text-blue-400 font-semibold flex-shrink-0">{match[1]}.</span>
            <span className="flex-1">{match[2]}</span>
          </div>
        )
      }
    }
    // Emoji headings (🔍, 📊, etc.)
    else if (line.match(/^[🔍📊🎯📋🆕💰🔗✅⚠️📚👥💡🔹🔧]/)) {
      elements.push(
        <div key={key++} className="font-semibold mt-3 mb-2 text-slate-900 dark:text-white">
          {line}
        </div>
      )
    }
    // Links (text with http/https)
    else if (line.includes('http')) {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const parts = line.split(urlRegex)
      elements.push(
        <p key={key++} className="mb-2">
          {parts.map((part, idx) => {
            if (part.match(/^https?:\/\//)) {
              return (
                <a 
                  key={idx} 
                  href={part} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {part}
                </a>
              )
            }
            return <span key={idx}>{part}</span>
          })}
        </p>
      )
    }
    // Empty lines (spacing)
    else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />)
    }
    // Regular text
    else if (line.trim()) {
      elements.push(
        <p key={key++} className="mb-2">
          {line}
        </p>
      )
    }
  }

  return <div className="space-y-1">{elements}</div>
}

export default function ChatWidget({ toolsCatalog, apiPath }: Props) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [input, setInput] = useState('')
  
  // Get personalized initial greeting
  const getInitialGreeting = () => {
    const storedProfile = localStorage.getItem('ai_compass_user_profile')
    const profile: UserProfile = storedProfile ? JSON.parse(storedProfile) : {
      interests: [],
      commonQueries: [],
      toolsAskedAbout: [],
      conversationStyle: 'casual'
    }
    
    const hour = new Date().getHours()
    let greeting = 'Hello! 👋'
    
    if (hour < 12) greeting = 'Good morning! ☀️'
    else if (hour < 17) greeting = 'Good afternoon! 🌤️'
    else greeting = 'Good evening! 🌙'
    
    let welcomeMsg = `${greeting} I'm **SONA**, your AI Compass assistant, here to help you explore Sanofi's comprehensive AI tools catalog! 🚀\n\n`
    
    if (profile.lastInteraction) {
      welcomeMsg += `Welcome back! 🌟 Ready to discover more AI tools?\n\n`
    }
    
    // Add AI Tip of the Day
    welcomeMsg += `**💡 AI Tip of the Day:**\n${getAITipOfTheDay()}\n\n`
    welcomeMsg += `_(Want more? Ask me for "top 10 AI facts"!)_\n\n`
    
    welcomeMsg += `Feel free to ask me anything about our internal and external AI tools - from features and comparisons to access requirements and recommendations!\n\n`
    welcomeMsg += `**Quick tips:**\n`
    welcomeMsg += `• Ask me to compare tools\n`
    welcomeMsg += `• Get personalized recommendations\n`
    welcomeMsg += `• Learn about new AI capabilities\n\n`
    welcomeMsg += `What would you like to know today? 💡`
    
    return welcomeMsg
  }
  
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: getInitialGreeting() }
  ])
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Debug logging
  console.log('ChatWidget rendered with', toolsCatalog?.length, 'tools')

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll])

  // Detect when user scrolls up
  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    
    setAutoScroll(isNearBottom)
    setShowScrollButton(!isNearBottom)
  }

  // Scroll to bottom function
  const scrollToBottom = () => {
    setAutoScroll(true)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function send() {
    if (!input.trim()) return
    const newMsgs: Msg[] = [...messages, { role: 'user', content: input }]
    setMessages(newMsgs)
    const userInput = input
    setInput('')

    const ctrl = new AbortController()
    abortRef.current = ctrl

    // Always use smart AI agent (no backend required)
    try {
      const response = getSmartAIResponse(userInput, toolsCatalog, messages)
      setMessages(m => [...m, { role: 'assistant', content: '' }])
      
      // Simulate streaming with faster typing for better UX
      let index = 0
      const interval = setInterval(() => {
        if (index < response.length) {
          setMessages(m => {
            const newMessages = [...m]
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: response.slice(0, index + 1)
            }
            return newMessages
          })
          index++
        } else {
          clearInterval(interval)
        }
      }, 15) // Faster typing speed
      
      return
    } catch (error) {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry — I encountered an error while processing your request.' }])
      return
    }

    // Legacy API code below is no longer used but kept for reference
    /* 
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
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'The request was interrupted. Please try again.' }])
    }
    */
  }

  return (
    <>
      <button
        className="fixed bottom-5 right-5 h-12 px-4 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl group z-40"
        onClick={() => {
          console.log('Chat button clicked, current open state:', open)
          setOpen(o => !o)
        }}
        aria-label="Open AI Compass chat assistant"
        title="Click to open AI Compass Assistant"
      >
        <Bot className="w-5 h-5 group-hover:animate-pulse" />
        <span className="font-medium">SONA</span>
        <Sparkles className="w-4 h-4 group-hover:animate-spin" />
      </button>

      {open && (
        <div className={`fixed ${
          expanded 
            ? 'inset-4 w-auto h-auto' 
            : 'bottom-20 right-5 w-[380px] max-h-[75vh]'
        } rounded-2xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300`}>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5" />
              <div>
                <div className="font-semibold">SONA - AI Compass</div>
                <div className="text-xs text-blue-100">Your AI tools expert</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 rounded-lg hover:bg-white/20 transition-colors" 
                onClick={() => setExpanded(e => !e)}
                aria-label={expanded ? "Collapse chat" : "Expand chat"}
                title={expanded ? "Collapse to normal size" : "Expand to full screen"}
              >
                {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-white/20 transition-colors" 
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50 relative"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                  }`}>
                    {m.role === 'user' ? (
                      <span className="text-xs font-bold">U</span>
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {m.role === 'assistant' ? (
                      <FormattedMessage content={m.content} />
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {/* Scroll to bottom button */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 animate-bounce"
                aria-label="Scroll to bottom"
                title="Scroll to latest message"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <input
                className="flex-1 h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Ask about AI tools, capabilities, comparisons..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              />
              <button 
                className="h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={send}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Ask me anything about the AI tools in your catalog!
            </div>
          </div>
        </div>
      )}
    </>
  )
}
