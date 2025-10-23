import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Download, Search, Languages, Compass, Sparkles, GitCompare, Send, RefreshCw, ListFilter, X, Lightbulb, Database, Globe, Moon, Sun, Heart, Mail, BarChart3, LogOut, User, Info, Settings } from 'lucide-react'
import { BRAND } from './branding'
import Analytics from './Analytics'
import Authentication from './Authentication'
import ChatWidget from './components/AI_ChatBot/ChatWidget'
import AboutAICompass from './components/AboutAICompass'
import * as analytics from './utils/analytics'

type Tool = {
  name: string
  type?: 'internal' | 'external'
  primaryPurpose?: string
  targetUsers?: string
  accessLink?: string
  trainingLink?: string
  supportLink?: string
  documentationLink?: string
  modules?: string
  logoUrl?: string
  accessToSanofiSystems?: boolean | string
  meetingScheduling?: boolean | string
  emailManagement?: boolean | string
  peopleSearch?: boolean | string
  documentCreation?: boolean | string
  knowledgeBase?: boolean | string
  qualipsoAccess?: boolean | string
  oneSupportTickets?: boolean | string
  scientificLiterature?: boolean | string
  patentAnalysis?: boolean | string
  chemicalStructure?: boolean | string
  dataViz?: boolean | string
  predictiveAnalytics?: boolean | string
  office365Integration?: boolean | string
  excelDataAnalysis?: boolean | string
  pptCreation?: boolean | string
  generalKnowledge?: boolean | string
  creativeWriting?: boolean | string
  codeGeneration?: boolean | string
  realTimeWebSearch?: boolean | string
  imageGeneration?: boolean | string
  diagramCreation?: boolean | string
  complianceAwareness?: boolean | string
  trainingRequired?: string
  cost?: string
  bestUseCase?: string
  technology?: string
  tags?: string[]
}

// ---- i18n (subset for brevity) ----
const translations = {
  en: {
    title: "AI Compass",
    subtitle: "Navigate the Future of AI at Sanofi.",
    searchPlaceholder: "Search tools, features, capabilities…",
    internal: "Internal",
    external: "External",
    allTools: "All tools",
    compare: "Compare",
    clear: "Clear",
    results: "Results",
    features: "Features",
    targetUsers: "Target Users",
    bestUseCase: "Best Use Case",
    tech: "Underlying Technology",
    cost: "Cost",
    comparison: "Comparison",
    suggestionBox: "Suggestion Box",
    suggestionHelp: "Add a wish for an AI Agent or Generative AI capability.",
    yourIdea: "Your idea",
    submit: "Submit",
    exportJson: "Export JSON",
    language: "Language",
    scope: "Scope",
    noMatches: "No tools match your search.",
    new: "New",
    updated: "Updated",
    analytics: "Analytics",
    refresh: "Refresh",
    addToCompare: "Add to compare",
    remove: "Remove",
    access: "Access",
    website: "Website",
    docs: "Docs",
    training: "Training",
    support: "Support",
    quickAccess: "Quick Access",
    externalLinks: "External Links",
    modules: "Modules",
    light: "Light",
    dark: "Dark",
  },
  fr: {
    title: "AI Compass",
    subtitle: "Naviguez vers l'avenir de l'IA chez Sanofi.",
    searchPlaceholder: "Rechercher des outils, fonctionnalités, capacités…",
    internal: "Interne",
    external: "Externe",
    allTools: "Tous les outils",
    compare: "Comparer",
    clear: "Effacer",
    results: "Résultats",
    features: "Fonctionnalités",
    targetUsers: "Utilisateurs Cibles",
    bestUseCase: "Meilleur Cas d'Usage",
    tech: "Technologie Sous-jacente",
    cost: "Coût",
    comparison: "Comparaison",
    suggestionBox: "Boîte à Suggestions",
    suggestionHelp: "Ajoutez un souhait pour un Agent IA ou une capacité d'IA Générative.",
    yourIdea: "Votre idée",
    submit: "Soumettre",
    exportJson: "Exporter JSON",
    language: "Langue",
    scope: "Portée",
    noMatches: "Aucun outil ne correspond à votre recherche.",
    new: "Nouveau",
    updated: "Mis à jour",
    analytics: "Analytique",
    refresh: "Actualiser",
    addToCompare: "Ajouter pour comparer",
    remove: "Retirer",
    access: "Accès",
    website: "Site web",
    docs: "Documents",
    training: "Formation",
    support: "Assistance",
    quickAccess: "Accès Rapide",
    externalLinks: "Liens Externes",
    modules: "Modules",
    light: "Clair",
    dark: "Sombre",
  },
  es: {
    title: "AI Compass",
    subtitle: "Navega hacia el futuro de la IA en Sanofi.",
    searchPlaceholder: "Buscar herramientas, características, capacidades…",
    internal: "Interno",
    external: "Externo",
    allTools: "Todas las herramientas",
    compare: "Comparar",
    clear: "Limpiar",
    results: "Resultados",
    features: "Características",
    targetUsers: "Usuarios Objetivo",
    bestUseCase: "Mejor Caso de Uso",
    tech: "Tecnología Subyacente",
    cost: "Costo",
    comparison: "Comparación",
    suggestionBox: "Caja de Sugerencias",
    suggestionHelp: "Agrega un deseo para un Agente IA o capacidad de IA Generativa.",
    yourIdea: "Tu idea",
    submit: "Enviar",
    exportJson: "Exportar JSON",
    language: "Idioma",
    scope: "Alcance",
    noMatches: "Ninguna herramienta coincide con tu búsqueda.",
    new: "Nuevo",
    updated: "Actualizado",
    analytics: "Analítica",
    refresh: "Actualizar",
    addToCompare: "Agregar para comparar",
    remove: "Quitar",
    access: "Acceso",
    website: "Sitio web",
    docs: "Documentos",
    training: "Capacitación",
    support: "Soporte",
    quickAccess: "Acceso Rápido",
    externalLinks: "Enlaces Externos",
    modules: "Módulos",
    light: "Claro",
    dark: "Oscuro",
  },
  de: {
    title: "AI Compass",
    subtitle: "Navigieren Sie in die Zukunft der KI bei Sanofi.",
    searchPlaceholder: "Tools, Features, Fähigkeiten suchen…",
    internal: "Intern",
    external: "Extern",
    allTools: "Alle Tools",
    compare: "Vergleichen",
    clear: "Löschen",
    results: "Ergebnisse",
    features: "Features",
    targetUsers: "Zielnutzer",
    bestUseCase: "Bester Anwendungsfall",
    tech: "Zugrunde liegende Technologie",
    cost: "Kosten",
    comparison: "Vergleich",
    suggestionBox: "Vorschlagsbox",
    suggestionHelp: "Fügen Sie einen Wunsch für einen KI-Agenten oder eine Generative KI-Fähigkeit hinzu.",
    yourIdea: "Ihre Idee",
    submit: "Einreichen",
    exportJson: "JSON exportieren",
    language: "Sprache",
    scope: "Bereich",
    noMatches: "Keine Tools entsprechen Ihrer Suche.",
    new: "Neu",
    updated: "Aktualisiert",
    analytics: "Analytik",
    refresh: "Aktualisieren",
    addToCompare: "Zum Vergleich hinzufügen",
    remove: "Entfernen",
    access: "Zugriff",
    website: "Webseite",
    docs: "Dokumente",
    training: "Schulung",
    support: "Unterstützung",
    quickAccess: "Schnellzugriff",
    externalLinks: "Externe Links",
    modules: "Module",
    light: "Hell",
    dark: "Dunkel",
  },
  pt: {
    title: "AI Compass",
    subtitle: "Navegue para o futuro da IA na Sanofi.",
    searchPlaceholder: "Pesquisar ferramentas, recursos, capacidades…",
    internal: "Interno",
    external: "Externo",
    allTools: "Todas as ferramentas",
    compare: "Comparar",
    clear: "Limpar",
    results: "Resultados",
    features: "Recursos",
    targetUsers: "Usuários Alvo",
    bestUseCase: "Melhor Caso de Uso",
    tech: "Tecnologia Subjacente",
    cost: "Custo",
    comparison: "Comparação",
    suggestionBox: "Caixa de Sugestões",
    suggestionHelp: "Adicione um desejo para um Agente IA ou capacidade de IA Generativa.",
    yourIdea: "Sua ideia",
    submit: "Enviar",
    exportJson: "Exportar JSON",
    language: "Idioma",
    scope: "Escopo",
    noMatches: "Nenhuma ferramenta corresponde à sua busca.",
    new: "Novo",
    updated: "Atualizado",
    analytics: "Análise",
    refresh: "Atualizar",
    addToCompare: "Adicionar para comparar",
    remove: "Remover",
    access: "Acesso",
    website: "Site",
    docs: "Documentos",
    training: "Treinamento",
    support: "Suporte",
    quickAccess: "Acesso Rápido",
    externalLinks: "Links Externos",
    modules: "Módulos",
    light: "Claro",
    dark: "Escuro",
  },
  zh: {
    title: "AI Compass",
    subtitle: "在赛诺菲导航AI的未来。",
    searchPlaceholder: "搜索工具、功能、能力…",
    internal: "内部",
    external: "外部",
    allTools: "所有工具",
    compare: "比较",
    clear: "清除",
    results: "结果",
    features: "功能",
    targetUsers: "目标用户",
    bestUseCase: "最佳用例",
    tech: "底层技术",
    cost: "成本",
    comparison: "比较",
    suggestionBox: "建议箱",
    suggestionHelp: "为AI代理或生成式AI能力添加愿望。",
    yourIdea: "您的想法",
    submit: "提交",
    exportJson: "导出JSON",
    language: "语言",
    scope: "范围",
    noMatches: "没有工具匹配您的搜索。",
    new: "新",
    updated: "已更新",
    analytics: "分析",
    refresh: "刷新",
    addToCompare: "添加到比较",
    remove: "移除",
    access: "访问",
    website: "网站",
    docs: "文档",
    training: "培训",
    support: "支持",
    quickAccess: "快速访问",
    externalLinks: "外部链接",
    modules: "模块",
    light: "浅色",
    dark: "深色",
  },
  ja: {
    title: "AI Compass",
    subtitle: "サノフィでAIの未来をナビゲートする。",
    searchPlaceholder: "ツール、機能、能力を検索…",
    internal: "内部",
    external: "外部",
    allTools: "すべてのツール",
    compare: "比較",
    clear: "クリア",
    results: "結果",
    features: "機能",
    targetUsers: "対象ユーザー",
    bestUseCase: "最適な使用例",
    tech: "基盤技術",
    cost: "コスト",
    comparison: "比較",
    suggestionBox: "提案ボックス",
    suggestionHelp: "AIエージェントまたは生成AI機能への願いを追加してください。",
    yourIdea: "あなたのアイデア",
    submit: "送信",
    exportJson: "JSON出力",
    language: "言語",
    scope: "範囲",
    noMatches: "検索に一致するツールがありません。",
    new: "新規",
    updated: "更新済み",
    analytics: "分析",
    refresh: "更新",
    addToCompare: "比較に追加",
    remove: "削除",
    access: "アクセス",
    website: "ウェブサイト",
    docs: "ドキュメント",
    training: "トレーニング",
    support: "サポート",
    quickAccess: "クイックアクセス",
    externalLinks: "外部リンク",
    modules: "モジュール",
    light: "ライト",
    dark: "ダーク",
  },
  vi: {
    title: "AI Compass",
    subtitle: "Dẫn đường tương lai AI tại Sanofi.",
    searchPlaceholder: "Tìm kiếm công cụ, tính năng, khả năng…",
    internal: "Nội bộ",
    external: "Bên ngoài",
    allTools: "Tất cả công cụ",
    compare: "So sánh",
    clear: "Xóa",
    results: "Kết quả",
    features: "Tính năng",
    targetUsers: "Người dùng mục tiêu",
    bestUseCase: "Trường hợp sử dụng tốt nhất",
    tech: "Công nghệ cơ bản",
    cost: "Chi phí",
    comparison: "So sánh",
    suggestionBox: "Hộp gợi ý",
    suggestionHelp: "Thêm mong muốn cho Đại lý AI hoặc khả năng AI Sinh tạo.",
    yourIdea: "Ý tưởng của bạn",
    submit: "Gửi",
    exportJson: "Xuất JSON",
    language: "Ngôn ngữ",
    scope: "Phạm vi",
    noMatches: "Không có công cụ nào phù hợp với tìm kiếm của bạn.",
    new: "Mới",
    updated: "Đã cập nhật",
    analytics: "Phân tích",
    refresh: "Làm mới",
    addToCompare: "Thêm vào so sánh",
    remove: "Xóa",
    access: "Truy cập",
    website: "Trang web",
    docs: "Tài liệu",
    training: "Đào tạo",
    support: "Hỗ trợ",
    quickAccess: "Truy cập nhanh",
    externalLinks: "Liên kết ngoài",
    modules: "Mô-đun",
    light: "Sáng",
    dark: "Tối",
  }
} as const

// ---- Seed internal + external (from your table) ----
const seededTools: Tool[] = [
  { name: "Concierge", type: "internal", primaryPurpose: "Workplace productivity & collaboration", targetUsers: "All employees", accessLink: "https://concierge.sanofi.com", trainingLink: "Digital Month Workshops: Concierge Workshops", supportLink: "Concierge Legends (Ambassador List)", logoUrl: "/Concierge.svg", accessToSanofiSystems: true, meetingScheduling: true, emailManagement: true, peopleSearch: true, documentCreation: true, knowledgeBase: true, qualipsoAccess: true, oneSupportTickets: true, dataViz: false, predictiveAnalytics: false, office365Integration: "Limited", excelDataAnalysis: false, generalKnowledge: true, creativeWriting: true, codeGeneration: true, realTimeWebSearch: false, imageGeneration: true, diagramCreation: true, complianceAwareness: "Sanofi", trainingRequired: "No", cost: "Included for employees", bestUseCase: "Daily work tasks", technology: "OpenAI GPT", tags: ["productivity","collaboration","internal"] },
  { name: "Newton", type: "internal", primaryPurpose: "R&D scientific assistant", targetUsers: "R&D teams", accessLink: "Through R&D portal", documentationLink: "Available through R&D SharePoint", supportLink: "Contact R&D Digital team", accessToSanofiSystems: true, documentCreation: true, knowledgeBase: "R&D", qualipsoAccess: "Limited", scientificLiterature: true, patentAnalysis: true, chemicalStructure: true, dataViz: true, predictiveAnalytics: true, excelDataAnalysis: "Scientific", pptCreation: "Scientific", generalKnowledge: "Science", creativeWriting: "Limited", codeGeneration: "Scientific", realTimeWebSearch: true, imageGeneration: "Scientific", diagramCreation: "Molecular", complianceAwareness: "R&D", trainingRequired: "No", cost: "For R&D employees", bestUseCase: "Scientific R&D", technology: "OpenAI GPT", tags: ["R&D","science","literature","patents"] },
  { name: "Plai", type: "internal", primaryPurpose: "Decision intelligence across functions", targetUsers: "10,000+ employees across functions", accessLink: "https://plai.sanofi.com/", documentationLink: "Plai SharePoint", modules: "Plai.qa (Quality), Plai.m&s (Manufacturing & Supply), Plai.fin (Finance)", logoUrl: "/Plai.svg", accessToSanofiSystems: true, peopleSearch: "Limited", knowledgeBase: "Enterprise data", qualipsoAccess: true, dataViz: "Dashboards", predictiveAnalytics: "What-if scenarios", office365Integration: false, excelDataAnalysis: "Plai.fin", complianceAwareness: "Enterprise", trainingRequired: "Role-specific", cost: "Included for employees", bestUseCase: "Data-driven decisions", technology: "Aily Labs AI", tags: ["decision-intelligence","dashboards","finance"] },
  { name: "MedIS", type: "internal", primaryPurpose: "Medical insights engine", targetUsers: "Medical & R&D teams", accessLink: "https://medinsights.sanofi.com", documentationLink: "MedIS SharePoint", supportLink: "Access Form", trainingLink: "Responsible AI Training", accessToSanofiSystems: true, documentCreation: true, knowledgeBase: "Medical", scientificLiterature: true, dataViz: true, predictiveAnalytics: true, generalKnowledge: "Medical only", complianceAwareness: "Medical", trainingRequired: "RAISE", cost: "For Medical/R&D", bestUseCase: "Medical insights", technology: "GenAI Platform", tags: ["medical","insights"] },
  { name: "Medvi", type: "internal", primaryPurpose: "Medical compliance tool", targetUsers: "Medical teams", accessLink: "Through Medical Affairs portal", documentationLink: "Medvi SharePoint", accessToSanofiSystems: true, knowledgeBase: "Compliance", complianceAwareness: "Specialized", trainingRequired: "Medical", cost: "For Medical teams", bestUseCase: "Compliance checks", technology: "AI compliance", tags: ["compliance","medical"] },
  { name: "GenAI Platform", type: "internal", primaryPurpose: "Foundation for AI applications", targetUsers: "Developers & business users", accessLink: "https://genai-ctd.sanofi.com/", documentationLink: "https://docs.sanofi.com/genaiplatform", supportLink: "https://docs.sanofi.com/genaiplatform/65075089739", accessToSanofiSystems: true, documentCreation: true, knowledgeBase: "Via applications", qualipsoAccess: "Via applications", scientificLiterature: "Via applications", patentAnalysis: "Via applications", chemicalStructure: "Via applications", dataViz: true, predictiveAnalytics: true, excelDataAnalysis: "Via applications", pptCreation: "Via applications", creativeWriting: true, codeGeneration: true, imageGeneration: true, diagramCreation: true, complianceAwareness: "Via applications", trainingRequired: "RAISE", cost: "For developers", bestUseCase: "Building AI applications", technology: "Various AI models", tags: ["platform","developers","foundation"] },
  { name: "Digital Twins", type: "internal", primaryPurpose: "Manufacturing simulation", targetUsers: "Manufacturing teams", accessLink: "Ballroom Twin: Access through Manufacturing systems", documentationLink: "Available through Manufacturing SharePoint", supportLink: "Contact Manufacturing Digital team", accessToSanofiSystems: true, knowledgeBase: "Manufacturing", dataViz: true, predictiveAnalytics: true, diagramCreation: true, complianceAwareness: "Manufacturing", trainingRequired: "Manufacturing", cost: "For Manufacturing", bestUseCase: "Manufacturing optimization", technology: "Simulation models", tags: ["manufacturing","simulation"] },
  { name: "AI Research Factory", type: "internal", primaryPurpose: "R&D drug discovery acceleration", targetUsers: "R&D scientists", accessLink: "Through R&D systems", documentationLink: "Available in R&D SharePoint", accessToSanofiSystems: true, knowledgeBase: "R&D", scientificLiterature: true, patentAnalysis: true, chemicalStructure: true, dataViz: true, predictiveAnalytics: true, generalKnowledge: "Science only", complianceAwareness: "R&D", trainingRequired: "R&D", cost: "For R&D", bestUseCase: "Drug discovery", technology: "Various AI models", tags: ["R&D","discovery"] },
  { name: "Microsoft Copilot", type: "external", primaryPurpose: "Microsoft 365 productivity", targetUsers: "All employees with M365", meetingScheduling: true, emailManagement: true, peopleSearch: true, documentCreation: true, dataViz: true, predictiveAnalytics: "Limited", office365Integration: "Full", excelDataAnalysis: "Advanced", pptCreation: true, generalKnowledge: true, creativeWriting: true, codeGeneration: true, realTimeWebSearch: true, imageGeneration: true, diagramCreation: "Limited", complianceAwareness: "General", trainingRequired: "No", cost: "With M365 license", bestUseCase: "Office productivity", technology: "Microsoft AI", tags: ["office","productivity","m365"] },
  { name: "ChatGPT", type: "external", primaryPurpose: "General-purpose AI", targetUsers: "Public", documentCreation: true, generalKnowledge: "Extensive", creativeWriting: "Strongest", codeGeneration: true, realTimeWebSearch: "Depends on version", imageGeneration: "Plus/Pro", trainingRequired: "No", cost: "Free/Paid tiers", bestUseCase: "General research", technology: "OpenAI GPT", tags: ["general","research","writing"] },
]

const FEED_ACCESS_LINKS: Record<string, string> = {
  "Claude 3": "https://claude.ai",
  "Google Gemini": "https://gemini.google.com",
  "Perplexity AI": "https://perplexity.ai",
  "Jasper AI": "https://jasper.ai",
  "Midjourney": "https://midjourney.com",
  "Runway ML": "https://runwayml.com",
  "Stable Diffusion": "https://stability.ai",
  "Mistral AI": "https://mistral.ai",
  "Cohere Command R+": "https://cohere.com",
  "IBM Watsonx": "https://watsonx.ai",
  "Salesforce Agentforce": "https://salesforce.com/products/agentforce",
  "Amazon Q": "https://aws.amazon.com/q",
  "Hugging Face": "https://huggingface.co",
  "Replit Ghostwriter": "https://replit.com/ai",
  "Notion AI": "https://www.notion.so/product/ai",
  "Microsoft Copilot": "https://www.microsoft.com/microsoft-365/copilot"
}

const FEED_LOGO_OVERRIDES: Record<string, string> = {
  "Claude 3": "/logos/claude.svg",
  "Google Gemini": "/logos/gemini.svg",
  "Perplexity AI": "/logos/perplexity.svg",
  "Jasper AI": "/logos/jasper.svg",
  "Midjourney": "/logos/midjourney.svg",
  "Runway ML": "/logos/runway.svg",
  "Stable Diffusion": "/logos/stable-diffusion.svg",
  "Mistral AI": "/logos/mistral.svg",
  "Cohere Command R+": "/logos/cohere.svg",
  "IBM Watsonx": "/logos/ibm-watsonx.svg",
  "Salesforce Agentforce": "/logos/salesforce.svg",
  "Amazon Q": "/logos/amazon-q.svg",
  "Hugging Face": "/logos/huggingface.svg",
  "Replit Ghostwriter": "/logos/replit.svg",
  "Notion AI": "/logos/notion.svg",
  "Microsoft Copilot": "/logos/microsoft-copilot.svg",
  "ChatGPT": "/logos/chatgpt.svg"
}

// Resolve asset URLs so they work with Vite's BASE_URL (important for GitHub Pages)
function resolveLogoUrl(url?: string): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  // External or data URLs: return as-is
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed
  // Normalize relative paths against the base URL
  const base = (import.meta as any)?.env?.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : base + '/'
  const relative = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return normalizedBase + relative
}

function useLocalStorage<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const v = localStorage.getItem(key)
      return v ? JSON.parse(v) : initial
    } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }, [key, value])
  return [value, setValue]
}

function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage<boolean>('aihub_theme_dark', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark'); else root.classList.remove('dark')
  }, [isDark])
  return [isDark, setIsDark] as const
}

function hashRecord(obj: any) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).slice(0,24) } catch { return Math.random().toString(36).slice(2,10) }
}

// Welcome popup content generator
function getWelcomePopupContent(): { type: string; emoji: string; title: string; content: string } {
  const contentOptions = [
    // Fun Facts
    {
      type: 'Fun Fact',
      emoji: '🤖',
      title: 'AI Fun Fact',
      content: 'The term "Artificial Intelligence" was coined by John McCarthy in 1956 at the Dartmouth Conference, where the field of AI research was officially born!'
    },
    {
      type: 'Fun Fact',
      emoji: '🧠',
      title: 'Did You Know?',
      content: 'GPT-3 has 175 billion parameters and was trained on 45TB of text data - that\'s like reading millions of books!'
    },
    {
      type: 'Fun Fact',
      emoji: '🎯',
      title: 'AI Milestone',
      content: 'In 2016, AlphaGo became the first AI to defeat a world champion Go player, marking a historic moment in AI development.'
    },
    {
      type: 'Fun Fact',
      emoji: '💡',
      title: 'Amazing AI Fact',
      content: 'Modern AI can generate images, write code, compose music, and even help discover new drugs - all from natural language prompts!'
    },
    // AI Jokes
    {
      type: 'AI Joke',
      emoji: '😄',
      title: 'AI Humor Break',
      content: 'Why did the AI go to therapy? Because it had too many deep learning issues! 🤓'
    },
    {
      type: 'AI Joke',
      emoji: '🤣',
      title: 'Tech Humor',
      content: 'What do you call an AI that sings? A-dell! (Adele) 🎤'
    },
    {
      type: 'AI Joke',
      emoji: '😂',
      title: 'Just for Fun',
      content: 'Why don\'t AI assistants ever get tired? Because they run on renewable energy... and caffeine-free code! ☕'
    },
    {
      type: 'AI Joke',
      emoji: '🎭',
      title: 'AI Comedy',
      content: 'How does an AI flirt? "Hey baby, are you a neural network? Because you\'ve got me making all the right connections!" 💕'
    },
    // Educational Tips
    {
      type: 'Pro Tip',
      emoji: '📚',
      title: 'AI Pro Tip',
      content: 'When crafting prompts, be specific and provide context. Instead of "write code," try "write a Python function that calculates fibonacci numbers recursively."'
    },
    {
      type: 'Pro Tip',
      emoji: '⚡',
      title: 'Productivity Tip',
      content: 'Use AI tools iteratively! Start with a basic prompt, review the output, then refine with follow-up questions for better results.'
    },
    {
      type: 'Pro Tip',
      emoji: '🔒',
      title: 'Security Reminder',
      content: 'Never share sensitive data, passwords, or confidential information with AI tools. Always review and validate AI-generated content before using it.'
    },
    {
      type: 'Pro Tip',
      emoji: '🎨',
      title: 'Creative Tip',
      content: 'AI excels at brainstorming! Use it to generate multiple variations of ideas, then combine the best elements for innovative solutions.'
    },
    // New Tools Highlights
    {
      type: 'New Tool',
      emoji: '🆕',
      title: 'Explore New Tools',
      content: 'Check out Claude 3 - Anthropic\'s latest AI assistant with improved reasoning and coding capabilities!'
    },
    {
      type: 'New Tool',
      emoji: '✨',
      title: 'Tool Spotlight',
      content: 'Gemini by Google offers multimodal AI capabilities - it can understand text, images, audio, and video all at once!'
    },
    {
      type: 'New Tool',
      emoji: '🔍',
      title: 'Discover More',
      content: 'Perplexity AI combines search with AI chat - get answers with real-time sources and citations!'
    },
    {
      type: 'New Tool',
      emoji: '🎨',
      title: 'Creative AI',
      content: 'Midjourney and DALL-E 3 are revolutionizing visual content creation with stunning AI-generated images!'
    }
  ]

  // Random selection
  const randomIndex = Math.floor(Math.random() * contentOptions.length)
  return contentOptions[randomIndex]
}

const FeedManager: React.FC<{onSync: (urls: string[]) => Promise<void>, lastSync: string | null}> = ({ onSync, lastSync }) => {
  const [feeds, setFeeds] = useLocalStorage<string[]>('aihub_feeds', [])
  const [open, setOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  return (
    <div className="relative">
      <button className="px-3 h-10 rounded-2xl border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-slate-900/70 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100 dark:hover:from-slate-700 dark:hover:to-green-900 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              onClick={() => setOpen(v => !v)}>
        <RefreshCw className="w-4 h-4 group-hover:rotate-180 group-hover:text-green-500 transition-all duration-300" /> 
        <span className="group-hover:scale-110 transition-transform duration-300">Sync</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[420px] p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xl z-30">
          <div className="text-sm font-medium mb-2">External Catalogs</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Add multiple JSON feeds; the app merges & dedupes by tool name.</div>
          <div className="grid gap-2">
            {(feeds || []).map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={f} onChange={e => {
                  const next = [...feeds]; next[i] = e.target.value; setFeeds(next);
                }} className="flex-1 h-10 px-3 rounded-xl border bg-transparent" placeholder="https://.../ai-tools-feed.json" />
                <button className="px-2 h-10 rounded-xl border" onClick={() => { const next=[...feeds]; next.splice(i,1); setFeeds(next) }}><X className="w-4 h-4"/></button>
              </div>
            ))}
            <button className="h-10 rounded-xl border" onClick={() => setFeeds([...(feeds||[]), ""])}>+ Add feed</button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="px-3 h-9 rounded-xl border bg-slate-50 dark:bg-slate-800"
              onClick={async () => { setSyncing(true); await onSync(feeds); setSyncing(false); }}>
              <RefreshCw className="w-4 h-4 inline mr-2" /> {syncing ? 'Syncing…' : 'Sync all now'}
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">{lastSync ? `Last sync: ${new Date(lastSync).toLocaleString()}` : 'Never synced'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

const App: React.FC = () => {
  const [isDark, setIsDark] = useDarkMode()
  const [lang, setLang] = useLocalStorage<string>('aihub_lang', 'en')
  const [user, setUser] = useLocalStorage<any>('aihub_user', null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const t = (translations as any)[lang] || translations.en

  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<'all'|'internal'|'external'>('all')
  const [currentView, setCurrentView] = useState<'main' | 'analytics' | 'about'>('main')
  const baseTools = useMemo(() => seededTools, [])
  const [externalTools, setExternalTools] = useLocalStorage<Tool[]>('aihub_external', [])
  const [externalMeta, setExternalMeta] = useLocalStorage<Record<string, {hash:string, addedAt?:string, updatedAt?:string}>>('aihub_external_meta', {})
  const [hasInitialSync, setHasInitialSync] = useLocalStorage<boolean>('aihub_initial_sync', false)
  const [newNames, setNewNames] = useState<Set<string>>(new Set())
  const [updatedNames, setUpdatedNames] = useState<Set<string>>(new Set())
  const [lastSync, setLastSync] = useLocalStorage<string | null>('aihub_last_sync', null)

  const [compareList, setCompareList] = useLocalStorage<string[]>('aihub_compare', [])
  const [ideas, setIdeas] = useLocalStorage<{text:string, ts:string}[]>('aihub_ideas', [])
  const [ideaText, setIdeaText] = useState('')
  const [showComparePanel, setShowComparePanel] = useState(false)
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showComparisonView, setShowComparisonView] = useState(false)
  const [isComparisonMaximized, setIsComparisonMaximized] = useState(false)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const settingsMenuRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)

  // Show welcome popup on page load (once per session)
  useEffect(() => {
    // Always show popup on page load with a small delay for better UX
    setTimeout(() => {
      setShowWelcomePopup(true)
      analytics.trackWelcomePopup('shown')
    }, 800)
  }, [])

  // Track initial page view
  useEffect(() => {
    analytics.trackPageView(window.location.pathname, 'AI Compass - Home')
  }, [])

  // Track view changes
  useEffect(() => {
    if (currentView === 'analytics') {
      analytics.trackNavigation('main', 'analytics')
      analytics.trackPageView('/analytics', 'AI Compass - Analytics')
    } else if (currentView === 'about') {
      analytics.trackNavigation('main', 'about')
      analytics.trackPageView('/about', 'AI Compass - About')
    } else if (currentView === 'main') {
      analytics.trackPageView('/', 'AI Compass - Home')
    }
  }, [currentView])

  // Scroll to comparison when it's shown
  useEffect(() => {
    if (showComparisonView && comparisonRef.current) {
      comparisonRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showComparisonView])

  // Close settings menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function normalizeFeeds(urls: string[]): string[] {
    const cleaned = (urls || []).filter(Boolean)
    if (cleaned.length === 0) return defaultFeedUrls
    const set = new Set<string>()
    for (const url of cleaned) set.add(url)
    return Array.from(set.values())
  }

  // Authentication handlers
  const handleAuthenticated = (userData: any) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('aihub_user')
  }

  // Check if user is already authenticated on app load
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
    }
  }, [user])

  const tools = useMemo(() => {
    const map = new Map<string, Tool>()
    for (const t of baseTools) {
      if (!t?.name) continue
      map.set(t.name.toLowerCase(), t)
    }
    for (const e of externalTools) {
      if (!e?.name) continue
      const key = e.name.toLowerCase()
      const tags = Array.isArray(e.tags) ? e.tags : []
      const inferredType: Tool['type'] = e.type || (tags.includes('internal') ? 'internal' : 'external')
      const existing = map.get(key)
      if (existing && existing.type === 'internal' && inferredType !== 'external') {
        map.set(key, { ...existing, ...e, type: 'internal' })
      } else {
        map.set(key, { ...(existing || {}), ...e, type: inferredType })
      }
    }
    return Array.from(map.values())
  }, [baseTools, externalTools])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return tools.filter(tool => {
      if (scope !== 'all' && tool.type !== scope) return false
      if (!q) return true
      const hay = [
        tool.name, tool.type, tool.primaryPurpose, tool.targetUsers, tool.technology, ...(tool.tags||[])
      ].concat(Object.values(tool).filter(v => typeof v === 'string') as string[]).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [tools, scope, query])

  const defaultFeedUrls = useMemo(() => {
    try {
      const base = import.meta.env.BASE_URL || '/'
      const normalizedBase = base.endsWith('/') ? base : `${base}/`
      const origin = window.location.origin
      return [new URL('ai-tools-feed.json', `${origin}${normalizedBase}`).toString()]
    } catch {
      return ['/ai-tools-feed.json']
    }
  }, [])

  async function fetchExternalToolsFrom(url: string): Promise<Tool[]> {
    if (!url) return []
    console.log('Fetching tools from:', url)
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' }, cache: 'no-store' })
      console.log('Fetch response:', res.status, res.statusText)
      if (!res.ok) {
        console.warn('Failed to fetch tools:', res.status, res.statusText)
        return []
      }
      const payload = await res.json()
      console.log('Feed payload received:', payload)
      const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.tools) ? payload.tools : [])
      console.log('Extracted tools count:', list.length)
      return list
        .filter(item => item && typeof item.name === 'string')
        .map(item => {
          const tags = Array.isArray(item.tags) ? item.tags : []
          const inferredType: Tool['type'] = (item.type as Tool['type']) || (tags.includes('internal') ? 'internal' : 'external')
          const logoUrl = item.logoUrl || FEED_LOGO_OVERRIDES[item.name] || undefined
          const accessLink = item.accessLink || FEED_ACCESS_LINKS[item.name] || undefined
          return {
            ...item,
            ...(accessLink ? { accessLink } : {}),
            ...(logoUrl ? { logoUrl } : {}),
            tags,
            type: inferredType
          }
        }) as Tool[]
    } catch (error) {
      console.error('Failed to fetch tools from', url, error)
      return []
    }
  }

  async function onSyncAll(feeds: string[]) {
    console.log('onSyncAll called with feeds:', feeds)
    const lists = await Promise.all((feeds || []).map(fetchExternalToolsFrom))
    console.log('All feeds fetched, lists:', lists.map(l => l.length))
    const merged = lists.flat()
      .filter(x => x && typeof x.name === 'string')
      .map(x => {
        const tags = Array.isArray(x.tags) ? x.tags : []
        const inferredType: Tool['type'] = (x.type as Tool['type']) || (tags.includes('internal') ? 'internal' : 'external')
        return { ...x, tags, type: inferredType }
      })
    console.log('Merged tools:', merged.length, 'tools')
    console.log('Loaded external tools:', merged.map(t => ({ name: t.name, type: t.type, logoUrl: t.logoUrl })))

    const meta = { ...(externalMeta || {}) }
    const nSet = new Set<string>()
    const uSet = new Set<string>()
    const byName = new Map<string, Tool>()
    for (const item of merged) {
      const key = (item.name || '').toLowerCase()
      const clean = { ...item }; delete (clean as any).type
      const h = hashRecord(clean)
      const prevMeta = meta[key]
      if (!prevMeta) {
        meta[key] = { hash: h, addedAt: new Date().toISOString() }
        nSet.add(key)
      } else if (prevMeta.hash !== h) {
        meta[key] = { ...prevMeta, hash: h, updatedAt: new Date().toISOString() }
        uSet.add(key)
      }

      const existing = byName.get(key)
      if (!existing) {
        byName.set(key, item)
      } else {
        const incomingInternal = (item.type as Tool['type']) === 'internal'
        const existingInternal = (existing.type as Tool['type']) === 'internal'
        // Prefer internal definitions regardless of feed order
        if (incomingInternal && !existingInternal) {
          byName.set(key, item)
        } else if (existingInternal && !incomingInternal) {
          // keep existing internal
        } else if (existingInternal && incomingInternal) {
          // both internal: keep the first (assumed official internal feed)
        } else {
          // both external: latest wins
          byName.set(key, item)
        }
      }
    }
    setExternalMeta(meta)
    setExternalTools(Array.from(byName.values()))
    setNewNames(nSet)
    setUpdatedNames(uSet)
    setLastSync(new Date().toISOString())
  }

  useEffect(() => {
    // Always sync on load to prevent stale localStorage from blocking updates
    const stored = JSON.parse(localStorage.getItem('aihub_feeds') || '[]') as string[]
    console.log('Initial sync - stored feeds:', stored)
    console.log('Default feed URLs:', defaultFeedUrls)
    
    if (stored.length) {
      console.log('Syncing from stored custom feeds...')
      onSyncAll(normalizeFeeds(stored))
    } else {
      console.log('Syncing default catalog feed...')
      onSyncAll(defaultFeedUrls).then(() => {
        console.log('Default feed sync completed, external tools loaded:', externalTools.length)
      })
      setHasInitialSync(true)
    }
  }, [defaultFeedUrls])

  function renderValue(val: any) {
    if (val === true) return <span className="text-xs px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border">✅ Yes</span>
    if (val === false) return <span className="text-xs px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border">❌ No</span>
    if (typeof val === 'string') return <span className="text-sm text-slate-500 dark:text-slate-400">{val}</span>
    return <span className="text-sm text-slate-400">—</span>
  }

  const compareTools = filtered.filter(t => compareList.includes(t.name))

  // Authentication check
  if (!isAuthenticated) {
    return <Authentication onAuthenticated={handleAuthenticated} />
  }

  // Analytics view
  if (currentView === 'analytics') {
    return <Analytics tools={tools} onBack={() => setCurrentView('main')} />
  }

  // About view
  if (currentView === 'about') {
    return (
      <div className="relative">
        <button
          onClick={() => setCurrentView('main')}
          className="fixed top-4 left-4 z-50 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
        <AboutAICompass />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100" style={{ backgroundImage: 'linear-gradient(135deg, rgba(0, 64, 161, 0.03) 0%, rgba(0, 166, 166, 0.03) 100%)' }}>
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 dark:bg-slate-900/80 border-b border-blue-200/50 dark:border-blue-700/50 shadow-lg" style={{ boxShadow: '0 10px 15px -3px rgba(0, 64, 161, 0.1), 0 4px 6px -2px rgba(0, 64, 161, 0.05)' }}>
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND.colors.gradient }}>
            <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-xl font-bold leading-tight bg-clip-text text-transparent truncate" style={{ backgroundImage: BRAND.colors.gradient }}>{t.title}</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 hidden sm:block">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Analytics Button */}
            <button className="px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-slate-900/70 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 dark:hover:from-slate-700 dark:hover:to-blue-900 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 hover:scale-105 text-xs sm:text-sm group touch-manipulation"
              onClick={() => {
                setCurrentView('analytics')
                analytics.trackFeatureUse('analytics_dashboard')
              }} aria-label="Open analytics dashboard">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:text-blue-500 transition-all duration-300" />
              <span className="hidden sm:inline">{t.analytics}</span>
            </button>
            
            {/* About Button */}
            <button className="px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-slate-900/70 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-slate-700 dark:hover:to-purple-900 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 hover:scale-105 text-xs sm:text-sm group touch-manipulation"
              onClick={() => {
                setCurrentView('about')
                analytics.trackFeatureUse('about_section')
              }} aria-label="About AI Compass">
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:text-purple-500 transition-all duration-300" />
              <span className="hidden sm:inline">About</span>
            </button>
            
            {/* Suggest Button */}
            <button className="px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-slate-900/70 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-pink-100 dark:hover:from-slate-700 dark:hover:to-yellow-900 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 hover:scale-105 text-xs sm:text-sm group touch-manipulation"
              onClick={() => {
                setShowSuggestionModal(true)
                analytics.trackFeatureUse('suggestion_box')
              }} aria-label="Open suggestion box">
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:text-yellow-500 transition-all duration-300" />
              <span className="hidden sm:inline">Suggest</span>
            </button>
            
            {/* Settings Dropdown */}
            <div className="relative" ref={settingsMenuRef}>
              <button 
                className="px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-slate-900/70 hover:bg-gradient-to-r hover:from-slate-100 hover:to-blue-100 dark:hover:from-slate-700 dark:hover:to-slate-600 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 hover:scale-105 text-xs sm:text-sm group touch-manipulation"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                aria-label="Settings"
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-all duration-300" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              
              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden">
                  {/* Language Selector */}
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                      <Languages className="w-3.5 h-3.5" />
                      Language
                    </div>
                    <select 
                      value={lang} 
                      onChange={e => {
                        const newLang = e.target.value
                        setLang(newLang)
                        analytics.trackLanguageChange(newLang)
                      }} 
                      className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer"
                    >
                      <option value="en">🇺🇸 English</option>
                      <option value="fr">🇫🇷 Français</option>
                      <option value="es">🇪🇸 Español</option>
                      <option value="de">🇩🇪 Deutsch</option>
                      <option value="pt">🇧🇷 Português (BR)</option>
                      <option value="zh">🇨🇳 中文</option>
                      <option value="ja">🇯🇵 日本語</option>
                      <option value="vi">🇻🇳 Tiếng Việt</option>
                    </select>
                  </div>
                  
                  {/* Theme Toggle */}
                  <button
                    className="w-full px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-all text-sm"
                    onClick={() => {
                      const newTheme = !isDark
                      setIsDark(newTheme)
                      setShowSettingsMenu(false)
                      analytics.trackThemeChange(newTheme ? 'dark' : 'light')
                    }}
                  >
                    {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
                    <span className="flex-1 text-left">{isDark ? t.light : t.dark} Mode</span>
                  </button>
                  
                  {/* Refresh Catalog */}
                  <button
                    className="w-full px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-all text-sm border-t border-slate-200 dark:border-slate-700"
                    onClick={async () => {
                      try {
                        setRefreshing(true)
                        setShowSettingsMenu(false)
                        const stored = JSON.parse(localStorage.getItem('aihub_feeds') || '[]') as string[]
                        const feedsToUse = (stored && stored.length) ? normalizeFeeds(stored) : defaultFeedUrls
                        await onSyncAll(feedsToUse)
                      } finally {
                        setRefreshing(false)
                      }
                    }}
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-green-600' : 'text-green-500'}`} />
                    <span className="flex-1 text-left">{refreshing ? 'Refreshing…' : 'Refresh Catalog'}</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-3 ml-2 border-l border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <div className="text-xs">
                  <div className="font-medium text-slate-900 dark:text-white">{user?.name || 'User'}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{user?.jobTitle || 'Employee'}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg border border-red-200 dark:border-red-700 bg-white/70 dark:bg-slate-900/70 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300 hover:scale-105 group"
                aria-label="Logout"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 grid gap-4 sm:gap-6 transition-all duration-300 ${showComparisonView && compareTools.length > 0 ? (isComparisonMaximized ? 'pb-[95vh]' : 'pb-[52vh]') : ''}`}>
        {/* Controls */}
        <div className="rounded-2xl border border-blue-200/50 dark:border-blue-700/50 p-3 sm:p-4 bg-white/80 dark:bg-slate-900/60 shadow-lg backdrop-blur" style={{ boxShadow: '0 10px 15px -3px rgba(0, 64, 161, 0.1), 0 4px 6px -2px rgba(0, 64, 161, 0.05)' }}>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: BRAND.colors.primary }} />
              <input
                value={query}
                onChange={e => {
                  const newQuery = e.target.value
                  setQuery(newQuery)
                  // Track search after user stops typing (debounced)
                  if (newQuery.length >= 3) {
                    setTimeout(() => {
                      analytics.trackSearch(newQuery, filtered.length)
                    }, 1000)
                  }
                }}
                placeholder={t.searchPlaceholder}
                className="pl-9 h-11 sm:h-12 rounded-2xl w-full border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-slate-800/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base touch-manipulation"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Globe className="w-4 h-4" />
              <div className="rounded-2xl border border-blue-200 dark:border-blue-700 overflow-hidden flex flex-1 sm:flex-initial">
                {(['all','internal','external'] as const).map(s => (
                  <button key={s} onClick={() => {
                    setScope(s)
                    analytics.trackFilter('scope', s)
                  }}
                    className={"px-2 sm:px-3 h-10 sm:h-11 transition-all duration-300 hover:scale-105 hover:z-10 relative group text-xs sm:text-base touch-manipulation flex-1 sm:flex-initial " + (scope===s ? "text-white shadow-lg hover:shadow-xl" : "bg-white/50 dark:bg-slate-800/50 hover:text-blue-700 dark:hover:text-blue-300")}
                    style={scope === s ? { background: BRAND.colors.gradient } : {}}
                    onMouseEnter={(e) => {
                      if (scope !== s) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 64, 161, 0.1) 0%, rgba(0, 166, 166, 0.1) 100%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (scope !== s) {
                        e.currentTarget.style.background = '';
                      }
                    }}>
                    <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
                      {s === 'all' ? t.allTools : (s === 'internal' ? t.internal : t.external)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 h-11 rounded-2xl border border-slate-300 dark:border-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-lg group" onClick={() => setCompareList([])}>
                <RefreshCw className="w-4 h-4 inline mr-2 group-hover:rotate-180 transition-transform duration-300" /> {t.clear}
              </button>
              <button 
                className={"px-3 h-11 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl group " + (compareList.length > 0 ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-400 hover:to-purple-400 hover:shadow-blue-500/30" : "border border-slate-300 dark:border-slate-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent hover:shadow-purple-500/30")} 
                onClick={() => {
                  if (compareList.length > 0) {
                    setShowComparisonView(!showComparisonView)
                  } else {
                    setShowComparePanel(v => !v)
                  }
                }}
              >
                <GitCompare className="w-4 h-4 inline mr-2 group-hover:scale-110 transition-transform duration-300" /> {t.comparison} ({compareList.length})
              </button>
            </div>
          </div>

          {showComparePanel && (
            <div className="mt-3 border rounded-xl p-3">
              <div className="text-sm font-medium mb-2">{t.comparison}</div>
              {compareList.length === 0 ? (
                <p className="text-sm text-slate-500">Select tools to compare.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {compareList.map((name) => (
                    <span key={name} className="rounded-xl border px-2 py-1 text-sm flex items-center gap-2">
                      {name}
                      <button onClick={() => setCompareList(compareList.filter(n => n !== name))}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results - Split view when comparison is active */}
        <section className={`grid gap-3 ${showComparisonView && compareTools.length > 0 ? (isComparisonMaximized ? 'h-[10vh]' : 'h-[45vh]') : ''}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.results} ({filtered.length})</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><ListFilter className="w-4 h-4" />{t.scope}: {scope}</div>
          </div>

          {filtered.length === 0 && (
            <div className="border rounded-2xl p-6 text-center text-slate-500">{t.noMatches}</div>
          )}

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ${showComparisonView && compareTools.length > 0 ? (isComparisonMaximized ? 'overflow-y-auto max-h-[calc(10vh-60px)]' : 'overflow-y-auto max-h-[calc(45vh-60px)]') : ''}`}>
            {filtered.map(tool => {
              const key = (tool.name||'').toLowerCase()
              const isNew = newNames.has(key)
              const isUpdated = !isNew && updatedNames.has(key)
              const isInComparison = compareList.includes(tool.name)
              
              // Collapsed view when in comparison mode
              if (showComparisonView && compareTools.length > 0) {
                return (
                  <div 
                    key={tool.name} 
                    className={`rounded-xl border p-3 transition-all duration-300 bg-white/80 dark:bg-slate-900/60 hover:shadow-lg ${isInComparison ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={"text-xs px-2 py-0.5 rounded-lg font-medium whitespace-nowrap " + (tool.type==='internal' ? "bg-emerald-500 text-white" : "bg-orange-500 text-white")}>
                          {tool.type==='internal' ? t.internal : t.external}
                        </span>
                        <h3 className="text-sm font-semibold truncate">{tool.name}</h3>
                        {isInComparison && <GitCompare className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                      </div>
                      {tool.logoUrl && (
                        <img 
                          src={resolveLogoUrl(tool.logoUrl) || tool.logoUrl} 
                          alt={`${tool.name} logo`}
                          className="w-8 h-8 rounded-lg object-contain bg-white/50 p-1 border border-slate-200 dark:border-slate-700"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      )}
                      <button 
                        className={"ml-2 px-2 py-1 rounded-lg text-xs transition-all " + (isInComparison ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-500 text-white hover:bg-blue-600")}
                        onClick={() => {
                          if (isInComparison) {
                            setCompareList(compareList.filter(n => n !== tool.name))
                          } else {
                            setCompareList([...compareList, tool.name])
                          }
                        }}
                      >
                        {isInComparison ? '✕' : '+'}
                      </button>
                    </div>
                  </div>
                )
              }
              
              // Full card view when not in comparison mode
              return (
              <div key={tool.name} className="rounded-2xl border border-blue-200/50 dark:border-blue-700/50 p-3 sm:p-4 hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-slate-900/60 backdrop-blur sm:hover:-translate-y-2 sm:hover:scale-105 hover:border-blue-400/80 dark:hover:border-blue-500/80 cursor-pointer group" style={{ boxShadow: 'var(--hover-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.25))' }} onMouseEnter={(e) => e.currentTarget.style.setProperty('--hover-shadow', '0 25px 50px -12px rgba(0, 64, 161, 0.3)')} onMouseLeave={(e) => e.currentTarget.style.removeProperty('--hover-shadow')}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={"text-xs px-2 py-1 rounded-xl font-medium transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg whitespace-nowrap " + (tool.type==='internal' ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md group-hover:from-emerald-400 group-hover:to-teal-400" : "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md group-hover:from-orange-400 group-hover:to-pink-400")}>
                        {tool.type==='internal' ? t.internal : t.external}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {tool.name}
                        {isNew && <span className="text-xs px-2 py-0.5 rounded-xl bg-emerald-600 text-white animate-pulse whitespace-nowrap">{t.new}</span>}
                        {isUpdated && <span className="text-xs px-2 py-0.5 rounded-xl border group-hover:border-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">{t.updated}</span>}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{tool.primaryPurpose}</p>
                  </div>
                  {/* Company Logo for Tools with logoUrl */}
                  {tool.logoUrl && (
                    <div className="flex-shrink-0 sm:ml-4">
                      <img 
                        src={resolveLogoUrl(tool.logoUrl) || tool.logoUrl} 
                        alt={`${tool.name} logo`}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain bg-white/50 p-1.5 sm:p-2 border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          console.log(`Failed to load logo for ${tool.name}:`, tool.logoUrl)
                          e.currentTarget.style.display = 'none'
                        }}
                        onLoad={() => {
                          console.log(`Successfully loaded logo for ${tool.name}:`, tool.logoUrl)
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className={"px-2 sm:px-3 h-9 sm:h-10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-xs sm:text-sm touch-manipulation flex-1 sm:flex-initial " + (compareList.includes(tool.name) ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md hover:from-red-400 hover:to-pink-400 hover:shadow-red-500/30" : "border border-purple-200 dark:border-purple-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white hover:border-transparent hover:shadow-purple-500/30")}
                      onClick={() => {
                        const isAdding = !compareList.includes(tool.name)
                        setCompareList(prev => prev.includes(tool.name) ? prev.filter(n => n !== tool.name) : [...prev, tool.name])
                        analytics.trackEvent(isAdding ? 'tool_added_to_compare' : 'tool_removed_from_compare', {
                          tool_name: tool.name,
                          tool_type: tool.type,
                          event_category: 'Comparison'
                        })
                      }}>
                      <GitCompare className="w-4 h-4 inline mr-2 transition-transform group-hover:rotate-12" />
                      {compareList.includes(tool.name) ? t.remove : t.addToCompare}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  <InfoRow label={t.targetUsers} value={tool.targetUsers} />
                  <InfoRow label={t.bestUseCase} value={tool.bestUseCase} />
                  <InfoRow label={t.tech} value={tool.technology} />
                  <InfoRow label={t.cost} value={tool.cost} />
                </div>
                
                {/* Access Links for All Tools */}
                {(tool.accessLink || tool.documentationLink || tool.trainingLink || tool.supportLink) && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {tool.type === 'internal' ? t.quickAccess : t.externalLinks}
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                      {tool.accessLink && (
                        <AccessLink href={tool.accessLink} label={tool.type === 'internal' ? t.access : t.website} toolName={tool.name} linkType="access" />
                      )}
                      {tool.documentationLink && (
                        <AccessLink href={tool.documentationLink} label={t.docs} toolName={tool.name} linkType="documentation" />
                      )}
                      {tool.trainingLink && (
                        <AccessLink href={tool.trainingLink} label={t.training} toolName={tool.name} linkType="training" />
                      )}
                      {tool.supportLink && (
                        <AccessLink href={tool.supportLink} label={t.support} toolName={tool.name} linkType="support" />
                      )}
                    </div>
                    {tool.modules && (
                      <div className="mt-2">
                        <div className="text-xs text-slate-500 dark:text-slate-400">{t.modules}: {tool.modules}</div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(tool.tags||[]).map(tag => <span key={tag} className="text-xs px-2 py-1 rounded-xl border">{tag}</span>)}
                </div>
              </div>
            )})}
          </div>
        </section>

        {/* Comparison Table - Fixed Bottom Panel */}
        {showComparisonView && compareTools.length > 0 && (
          <section ref={comparisonRef} className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t-4 border-blue-500 shadow-2xl z-30 overflow-hidden transition-all duration-300 ${isComparisonMaximized ? 'h-[90vh]' : 'h-[50vh]'}`}>
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <GitCompare className="w-5 h-5" /> {t.comparison} - {compareTools.length} Tools
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all text-sm flex items-center gap-2"
                    onClick={() => setIsComparisonMaximized(!isComparisonMaximized)}
                    title={isComparisonMaximized ? 'Minimize' : 'Maximize'}
                  >
                    {isComparisonMaximized ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                    {isComparisonMaximized ? 'Minimize' : 'Maximize'}
                  </button>
                  <button 
                    className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all text-sm flex items-center gap-2"
                    onClick={() => setCompareList([])}
                  >
                    <RefreshCw className="w-4 h-4" /> Clear All
                  </button>
                  <button 
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
                    onClick={() => {
                      setShowComparisonView(false)
                      setIsComparisonMaximized(false)
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Comparison Table */}
              <div className="flex-1 overflow-auto p-4 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10">
                      <tr>
                        <th className="text-left p-3 sticky left-0 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-w-[220px] shadow-sm">
                          <span className="font-semibold">Features</span>
                        </th>
                        {compareTools.map(tool => (
                          <th key={tool.name} className="text-left p-3 border-r border-slate-200 dark:border-slate-700 min-w-[220px]">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {tool.logoUrl && (
                                  <img 
                                    src={resolveLogoUrl(tool.logoUrl) || tool.logoUrl} 
                                    alt={`${tool.name} logo`}
                                    className="w-6 h-6 rounded object-contain"
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                  />
                                )}
                                <div>
                                  <div className="font-semibold">{tool.name}</div>
                                  <span className={"text-xs px-1.5 py-0.5 rounded mt-1 inline-block " + (tool.type==='internal' ? "bg-emerald-500 text-white" : "bg-orange-500 text-white")}>
                                    {tool.type==='internal' ? t.internal : t.external}
                                  </span>
                                </div>
                              </div>
                              <button 
                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                                onClick={() => setCompareList(compareList.filter(n => n !== tool.name))}
                                title="Remove from comparison"
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['primaryPurpose','Primary Purpose'],
                        ['targetUsers',t.targetUsers],
                        ['accessToSanofiSystems','Access to Sanofi Systems'],
                        ['meetingScheduling','Meeting Scheduling'],
                        ['emailManagement','Email Management'],
                        ['peopleSearch','People Search'],
                        ['documentCreation','Document Creation'],
                        ['knowledgeBase','Sanofi Knowledge Base'],
                        ['qualipsoAccess','QualiPSO Access'],
                        ['oneSupportTickets','OneSupport Tickets'],
                        ['scientificLiterature','Scientific Literature'],
                        ['patentAnalysis','Patent Analysis'],
                        ['chemicalStructure','Chemical Structure Analysis'],
                        ['dataViz','Data Visualization'],
                        ['predictiveAnalytics','Predictive Analytics'],
                        ['office365Integration','Office 365 Integration'],
                        ['excelDataAnalysis','Excel Data Analysis'],
                        ['pptCreation','PowerPoint Creation'],
                        ['generalKnowledge','General Knowledge'],
                        ['creativeWriting','Creative Writing'],
                        ['codeGeneration','Code Generation'],
                        ['realTimeWebSearch','Real-time Web Search'],
                        ['imageGeneration','Image Generation'],
                        ['diagramCreation','Diagram Creation'],
                        ['complianceAwareness','Compliance Awareness'],
                        ['trainingRequired','Training Required'],
                        ['cost',t.cost],
                        ['bestUseCase',t.bestUseCase],
                        ['technology',t.tech],
                      ].map(([key,label]) => (
                        <tr key={key as string} className="even:bg-slate-50/50 odd:bg-white dark:even:bg-slate-900/50 dark:odd:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
                          <td className="p-3 sticky left-0 bg-inherit border-r border-slate-200 dark:border-slate-700 font-medium shadow-sm">{label}</td>
                          {compareTools.map(tool => (
                            <td className="p-3 border-r border-slate-200 dark:border-slate-700 align-top" key={tool.name + key}>
                              {renderValue((tool as any)[key as string])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Old Comparison Table - Only show when NOT in split view */}
        {!showComparisonView && compareTools.length > 0 && (
          <section className="grid gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2"><GitCompare className="w-5 h-5" /> {t.comparison}</h2>
              <button className="px-3 h-9 rounded-xl border" onClick={() => setCompareList([])}><X className="w-4 h-4 inline mr-2" />{t.clear}</button>
            </div>
            <div className="rounded-2xl border overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="text-left p-3 sticky left-0 bg-slate-50 dark:bg-slate-900 border-r min-w-[220px]">Features</th>
                    {compareTools.map(tool => (
                      <th key={tool.name} className="text-left p-3 border-r min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <span className={"text-xs px-2 py-1 rounded-xl border " + (tool.type==='internal' ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-transparent")}>
                            {tool.type==='internal' ? t.internal : t.external}
                          </span>
                          <span className="font-medium">{tool.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['primaryPurpose','Primary Purpose'],
                    ['targetUsers',t.targetUsers],
                    ['accessToSanofiSystems','Access to Sanofi Systems'],
                    ['meetingScheduling','Meeting Scheduling'],
                    ['emailManagement','Email Management'],
                    ['peopleSearch','People Search'],
                    ['documentCreation','Document Creation'],
                    ['knowledgeBase','Sanofi Knowledge Base'],
                    ['qualipsoAccess','QualiPSO Access'],
                    ['oneSupportTickets','OneSupport Tickets'],
                    ['scientificLiterature','Scientific Literature'],
                    ['patentAnalysis','Patent Analysis'],
                    ['chemicalStructure','Chemical Structure Analysis'],
                    ['dataViz','Data Visualization'],
                    ['predictiveAnalytics','Predictive Analytics'],
                    ['office365Integration','Office 365 Integration'],
                    ['excelDataAnalysis','Excel Data Analysis'],
                    ['pptCreation','PowerPoint Creation'],
                    ['generalKnowledge','General Knowledge'],
                    ['creativeWriting','Creative Writing'],
                    ['codeGeneration','Code Generation'],
                    ['realTimeWebSearch','Real-time Web Search'],
                    ['imageGeneration','Image Generation'],
                    ['diagramCreation','Diagram Creation'],
                    ['complianceAwareness','Compliance Awareness'],
                    ['trainingRequired','Training Required'],
                    ['cost',t.cost],
                    ['bestUseCase',t.bestUseCase],
                    ['technology',t.tech],
                  ].map(([key,label]) => (
                    <tr key={key as string} className="even:bg-white odd:bg-slate-50/40">
                      <td className="p-3 sticky left-0 bg-inherit border-r font-medium">{label}</td>
                      {compareTools.map(tool => (
                        <td className="p-3 border-r align-top" key={tool.name + key}>
                          {renderValue((tool as any)[key as string])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Suggestion Modal */}
        {showSuggestionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-purple-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    <Lightbulb className="w-5 h-5 text-yellow-500 animate-pulse" /> {t.suggestionBox}
                  </h2>
                  <button 
                    onClick={() => setShowSuggestionModal(false)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{t.suggestionHelp}</p>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!ideaText.trim()) return;
                  
                  // Create mailto link
                  const subject = encodeURIComponent('AI Tools Suggestion from AI-COMPASS');
                  const body = encodeURIComponent(`Hi Sonnil,\n\nI have a suggestion for AI tools:\n\n${ideaText.trim()}\n\nBest regards,\nSubmitted via AI-COMPASS on ${new Date().toLocaleString()}`);
                  const mailtoLink = `mailto:Sonnil.le@sanofi.com?subject=${subject}&body=${body}`;
                  
                  // Save to local storage
                  setIdeas([{ text: ideaText.trim(), ts: new Date().toISOString() }, ...ideas]);
                  
                  // Open email client
                  window.location.href = mailtoLink;
                  
                  // Clear form and close modal
                  setIdeaText('');
                  setShowSuggestionModal(false);
                }} className="space-y-4">
                  <textarea 
                    value={ideaText} 
                    onChange={e => setIdeaText(e.target.value)} 
                    placeholder={t.yourIdea} 
                    className="w-full h-32 p-4 rounded-2xl border border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-slate-800/80 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                    required
                  />
                  
                  <div className="flex gap-3 justify-end">
                    <button 
                      type="button"
                      onClick={() => setShowSuggestionModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!ideaText.trim()}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" /> Email to Sonnil
                    </button>
                  </div>
                </form>
                
                {ideas.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-700 dark:text-slate-300">Recent Suggestions</h3>
                      <button onClick={() => {
                        const blob = new Blob([JSON.stringify(ideas, null, 2)], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a'); a.href = url; a.download = `ai-compass-suggestions-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url)
                      }} className="text-xs px-3 py-1 rounded-xl border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all flex items-center gap-1">
                        <Download className="w-3 h-3" /> Export
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {ideas.slice(0, 5).map((i, idx) => (
                        <div key={idx} className="text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{new Date(i.ts).toLocaleString()}</div>
                          <div className="text-slate-700 dark:text-slate-300">{i.text}</div>
                        </div>
                      ))}
                      {ideas.length > 5 && (
                        <div className="text-xs text-center text-slate-500 dark:text-slate-400 py-2">
                          And {ideas.length - 5} more suggestions...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Chatbot */}
        <ChatWidget 
          toolsCatalog={tools}
        />

        <footer className="py-8 text-center border-t border-purple-200/50 dark:border-purple-700/50 mt-8">
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col md:flex-row gap-4 items-center text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Seeded with your internal list; extend via external feeds or edit <code className="px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">seededTools</code>.</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span>Have suggestions? Click the <strong>Suggest</strong> button above to email ideas to Sonnil!</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600 dark:text-slate-300">Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span className="text-slate-600 dark:text-slate-300">by:</span>
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">Sonnil Le</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Welcome Popup */}
      {showWelcomePopup && (() => {
        const popupContent = getWelcomePopupContent()
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
              {/* Header */}
              <div className="relative h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <div className="text-6xl">{popupContent.emoji}</div>
                <button
                  onClick={() => {
                    setShowWelcomePopup(false)
                    analytics.trackWelcomePopup('closed', popupContent.type)
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Close popup"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300">
                  {popupContent.type}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                  {popupContent.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {popupContent.content}
                </p>
                
                {/* Action Button */}
                <button
                  onClick={() => {
                    setShowWelcomePopup(false)
                    analytics.trackWelcomePopup('action_clicked', popupContent.type)
                  }}
                  className="w-full h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ 
                    background: BRAND.colors.gradient,
                    color: 'white'
                  }}
                >
                  Got it! Let's explore 🚀
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

const InfoRow: React.FC<{label: string, value: any}> = ({ label, value }) => (
  <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 border dark:border-slate-800">
    <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    <div className="text-sm mt-0.5">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value ?? '—')}</div>
  </div>
)

const AccessLink: React.FC<{href: string, label: string, toolName?: string, linkType?: string}> = ({ href, label, toolName, linkType }) => {
  const isValidLink = href.startsWith('http')
  const isDisabled = !isValidLink || href === '#'
  
  const handleClick = () => {
    if (toolName && linkType) {
      analytics.trackToolAccess(toolName, href)
      analytics.trackExternalLink(href, `${toolName} - ${label}`)
    }
  }
  
  if (isDisabled) {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50">
        {label}
      </span>
    )
  }
  
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
      style={{ color: BRAND.colors.primary }}
    >
      {label}
      <span className="text-xs">↗</span>
    </a>
  )
}

export default App
