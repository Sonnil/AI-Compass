import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Download, Search, Languages, Compass, Sparkles, GitCompare, Send, RefreshCw, ListFilter, X, Lightbulb, Database, Globe, Moon, Sun, Heart, Mail, BarChart3, LogOut, User, Info, Settings, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react'
import { BRAND } from './config/branding'
import Analytics from './pages/Analytics'
import Authentication from './pages/Authentication'
import QMS from './pages/QMS'
import ChatWidget from './features/sona/ChatWidget'
import AboutAICompass from './pages/About'
import ScrollToTop from './components/ScrollToTop'
import * as analytics from './utils/analytics'
import { Tool } from './types'
import { translations } from './translations'
import { useComparisonStore } from './stores/comparison'
import ToolCard from './components/ToolCard'
import { ComparisonBar } from './components/ComparisonBar'





import { loadToolsFeed } from './services/toolsService';
import { resolveLogoUrl } from './utils/url';

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



function App(): React.ReactElement {
  const [isDark, setIsDark] = useDarkMode()
  const [lang, setLang] = useLocalStorage<string>('aihub_lang', 'en')
  const [user, setUser] = useLocalStorage<any>('aihub_user', null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const t = (translations as any)[lang] || translations.en

  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<'all'|'internal'|'external'>('all')
  const [sortBy, setSortBy] = useState<'name-asc'|'name-desc'|'type-internal'|'type-external'|'rating'|'category'>('name-asc')
  const [currentView, setCurrentView] = useState<'main' | 'analytics' | 'about' | 'qms'>('main')
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { items: compareList, clear: clearCompare } = useComparisonStore()

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        const loadedTools = await loadToolsFeed();
        setTools(loadedTools);
        setError(null);
      } catch (err) {
        setError('Failed to load tools. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);



  const [ideas, setIdeas] = useLocalStorage<{text:string, ts:string}[]>('aihub_ideas', [])
  const [ideaText, setIdeaText] = useState('')
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const [welcomePopupContent, setWelcomePopupContent] = useState(() => getWelcomePopupContent())
  const settingsMenuRef = useRef<HTMLDivElement>(null)

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
    } else if (currentView === 'qms') {
      analytics.trackNavigation('main', 'qms')
      analytics.trackPageView('/qms', 'AI Compass - QMS')
    } else if (currentView === 'main') {
      analytics.trackPageView('/', 'AI Compass - Home')
    }
  }, [currentView])

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



  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const results = tools.filter(tool => {
      if (scope !== 'all' && tool.type !== scope) return false
      if (!q) return true
      const hay = [
        tool.name, tool.type, tool.primaryPurpose, tool.targetUsers, tool.technology, ...(tool.tags||[])
      ].concat(Object.values(tool).filter(v => typeof v === 'string') as string[]).join(' ').toLowerCase()
      return hay.includes(q)
    })
    
    // Apply sorting
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '')
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '')
        case 'type-internal':
          if (a.type === 'internal' && b.type !== 'internal') return -1
          if (a.type !== 'internal' && b.type === 'internal') return 1
          return (a.name || '').localeCompare(b.name || '')
        case 'type-external':
          if (a.type === 'external' && b.type !== 'external') return -1
          if (a.type !== 'external' && b.type === 'external') return 1
          return (a.name || '').localeCompare(b.name || '')
        case 'rating':
          // Calculate average rating based on available boolean/numeric fields
          const ratingA = calculateRating(a)
          const ratingB = calculateRating(b)
          return ratingB - ratingA // Highest first
        case 'category':
          // Sort by primary purpose (category), then by name
          return (a.primaryPurpose || '').localeCompare(b.primaryPurpose || '') || (a.name || '').localeCompare(b.name || '')
        default:
          return 0
      }
    })
  }, [tools, scope, query, sortBy])
  
  // Helper function to calculate a tool's "rating" based on features
  function calculateRating(tool: Tool): number {
    let score = 0
    // Add points for key features
    if (tool.capabilities?.realTimeSearch) score += 1
    if (tool.capabilities?.codeGeneration) score += 1
    if (tool.capabilities?.imageGeneration) score += 1
    if (tool.knowledgeBase) score += 1
    if (tool.generalKnowledge) score += 1
    if (tool.accessToSanofiSystems) score += 1
    if (tool.office365Integration) score += 1
    // Add points for having documentation/training
    if (tool.documentationLink) score += 0.5
    if (tool.trainingLink) score += 0.5
    // Bonus for internal tools
    if (tool.type === 'internal') score += 0.5
    return score
  }



  

  function renderValue(val: any) {
    if (val === true) return <span className="text-xs px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border">✅ Yes</span>
    if (val === false) return <span className="text-xs px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border">❌ No</span>
    if (typeof val === 'string') return <span className="text-sm text-slate-500 dark:text-slate-400">{val}</span>
    return <span className="text-sm text-slate-400">—</span>
  }

  const compareTools = compareList

  // Authentication check
  if (!isAuthenticated) {
    return <Authentication onAuthenticated={handleAuthenticated} />
  }

  // Analytics view
  if (currentView === 'analytics') {
    return <Analytics tools={tools} onBack={() => setCurrentView('main')} />
  }

  // QMS view
  if (currentView === 'qms') {
    return <QMS onBack={() => setCurrentView('main')} />
  }

  // About view
  if (currentView === 'about') {
    return (
      <div className="relative min-h-screen">
        <button
          onClick={() => setCurrentView('main')}
          className="fixed top-4 left-4 z-50 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 shadow-lg border-2 border-slate-300 dark:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all flex items-center gap-2 text-slate-900 dark:text-white font-medium"
        >
          <X className="w-4 h-4" />
          <span>{t.close}</span>
        </button>
        <AboutAICompass lang={lang} />
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
            
            {/* QMS Button */}
            <button className="px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white/70 dark:bg-slate-900/70 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-green-100 dark:hover:from-slate-700 dark:hover:to-emerald-900 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 hover:scale-105 text-xs sm:text-sm group touch-manipulation"
              onClick={() => {
                setCurrentView('qms')
                analytics.trackFeatureUse('qms_dashboard')
              }} aria-label="Open QMS dashboard">
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:text-emerald-500 transition-all duration-300" />
              <span className="hidden sm:inline">{t.qms}</span>
            </button>
            
            {/* About Button */}
            <button className="px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-slate-900/70 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-slate-700 dark:hover:to-purple-900 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 hover:scale-105 text-xs sm:text-sm group touch-manipulation"
              onClick={() => {
                setCurrentView('about')
                analytics.trackFeatureUse('about_section')
              }} aria-label="About AI Compass">
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:text-purple-500 transition-all duration-300" />
              <span className="hidden sm:inline">{t.about}</span>
            </button>
            
            {/* Suggest Button */}
            <button className="px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-slate-900/70 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-pink-100 dark:hover:from-slate-700 dark:hover:to-yellow-900 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 hover:scale-105 text-xs sm:text-sm group touch-manipulation"
              onClick={() => {
                setShowSuggestionModal(true)
                analytics.trackFeatureUse('suggestion_box')
              }} aria-label="Open suggestion box">
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:text-yellow-500 transition-all duration-300" />
              <span className="hidden sm:inline">{t.suggest}</span>
            </button>
            
            {/* Settings Dropdown */}
            <div className="relative" ref={settingsMenuRef}>
              <button 
                className="px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-slate-900/70 hover:bg-gradient-to-r hover:from-slate-100 hover:to-blue-100 dark:hover:from-slate-700 dark:hover:to-slate-600 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 hover:scale-105 text-xs sm:text-sm group touch-manipulation"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                aria-label="Settings"
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-all duration-300" />
                <span className="hidden sm:inline">{t.settings}</span>
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
                        const loadedTools = await loadToolsFeed();
                        setTools(loadedTools);
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

      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 grid gap-4 sm:gap-6">
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
                className="pl-9 pr-9 h-11 sm:h-12 rounded-2xl w-full border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-slate-800/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base touch-manipulation"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
              )}
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
            
            {/* Sort Dropdown */}
            <ArrowUpDown className="w-4 h-4 ml-2" />
            <select
              value={sortBy}
              onChange={(e) => {
                const newSort = e.target.value as typeof sortBy
                setSortBy(newSort)
                analytics.trackFilter('sort', newSort)
              }}
              className="px-2 sm:px-3 h-10 sm:h-11 rounded-2xl border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-slate-800/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs sm:text-sm touch-manipulation cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700"
            >
              <option value="name-asc">{t.sortNameAsc}</option>
              <option value="name-desc">{t.sortNameDesc}</option>
              <option value="type-internal">{t.sortTypeInternal}</option>
              <option value="type-external">{t.sortTypeExternal}</option>
              <option value="rating">{t.sortRating}</option>
              <option value="category">{t.sortCategory}</option>
            </select>
          </div>
          </div>
        </div>
        {/* Results */}
        <section className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.results} ({filtered.length})</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><ListFilter className="w-4 h-4" />{t.scope}: {scope}</div>
          </div>

          {filtered.length === 0 && (
            <div className="border rounded-2xl p-6 text-center text-slate-500">{t.noMatches}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map(tool => (
              <ToolCard 
                key={tool.id}
                tool={tool}
                isNew={false}
                isUpdated={false}
                lang={lang}
              />
            ))}
          </div>
        </section>

        {/* Suggestion Modal */}
        {showSuggestionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
              {/* Header */}
              <div className="relative h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <div className="text-6xl">💡</div>
                <button
                  onClick={() => setShowSuggestionModal(false)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Close popup"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                  {t.suggestTitle}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {t.suggestDescription}
                </p>
                
                {/* Suggestion Form */}
                <div className="mb-4">
                  <textarea
                    value={ideaText}
                    onChange={e => setIdeaText(e.target.value)}
                    className="w-full h-24 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    placeholder={t.suggestPlaceholder}
                    aria-label="Your suggestion"
                  />
                </div>
                
                <button
                  onClick={async () => {
                    if (!ideaText.trim()) return
                    
                    const idea = { text: ideaText.trim(), ts: new Date().toISOString() }
                    
                    // Create mailto link to send suggestion via email
                    const subject = encodeURIComponent('AI Compass Suggestion');
                    const body = encodeURIComponent(`New Suggestion/Idea:\n\n${idea.text}\n\n---\nLanguage: ${lang}\nTimestamp: ${idea.ts}\n\nSent from AI Compass`);
                    const mailtoLink = `mailto:Sonnil.le@Sanofi.com?subject=${subject}&body=${body}`;
                    
                    // Save to localStorage as backup
                    setIdeas(ideas => [...ideas, idea])
                    
                    // Track analytics
                    analytics.trackFeatureUse('suggestion_submitted', { suggestion_text: idea.text });
                    
                    // Clear form and close modal
                    setIdeaText('')
                    setShowSuggestionModal(false)
                    
                    // Open email client
                    window.location.href = mailtoLink;
                    
                    // Show confirmation after a brief delay
                    setTimeout(() => {
                      alert(t.suggestThanks)
                    }, 500)
                  }}
                  className="w-full h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ 
                    background: BRAND.colors.gradient,
                    color: 'white'
                  }}
                >
                  {t.suggestSubmit}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Chatbot */}
        <ChatWidget 
          toolsCatalog={tools}
        />

        <ComparisonBar />

        <footer className="py-8 text-center border-t border-purple-200/50 dark:border-purple-700/50 mt-8">
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col md:flex-row gap-4 items-center text-xs text-slate-500 dark:text-slate-400">
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
      {showWelcomePopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={() => {
            setShowWelcomePopup(false)
            analytics.trackWelcomePopup('closed', welcomePopupContent.type)
          }}
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <div className="text-6xl">{welcomePopupContent.emoji}</div>
              <button
                onClick={() => {
                  setShowWelcomePopup(false)
                  analytics.trackWelcomePopup('closed', welcomePopupContent.type)
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
                {welcomePopupContent.type}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                {welcomePopupContent.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {welcomePopupContent.content}
              </p>
              
              {/* Action Button */}
              <button
                onClick={() => {
                  setShowWelcomePopup(false)
                  analytics.trackWelcomePopup('action_clicked', welcomePopupContent.type)
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
      )}
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}

export default App
