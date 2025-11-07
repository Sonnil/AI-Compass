import React, { useState, useMemo } from 'react'
import { BarChart3, PieChart, TrendingUp, Users, Zap, Filter, Download, RefreshCw, X, ChevronRight } from 'lucide-react'
import { Tool } from '../types';

interface AnalyticsProps {
  tools: Tool[]
  onBack: () => void
}

interface KPIDetails {
  title: string
  value: number
  description: string
  breakdown: Array<{ label: string; value: number; percentage: number }>
  insights: string[]
}

// Helper function to resolve logo URLs with base path
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

export default function Analytics({ tools, onBack }: AnalyticsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMetric, setSelectedMetric] = useState<string>('capabilities')
  const [viewMode, setViewMode] = useState<'overview' | 'comparison' | 'trends'>('overview')
  const [showKPIModal, setShowKPIModal] = useState(false)
  const [selectedKPI, setSelectedKPI] = useState<KPIDetails | null>(null)

  // Enhanced tools with capability scores
  const enhancedTools = useMemo(() => {
    return tools.map(tool => ({
      ...tool,
      capabilities: {
        codeGeneration: getCapabilityScore(tool, 'code'),
        dataAnalysis: getCapabilityScore(tool, 'data'),
        contentCreation: getCapabilityScore(tool, 'content'),
        collaboration: getCapabilityScore(tool, 'collaboration'),
        compliance: getCapabilityScore(tool, 'compliance'),
        realTimeSearch: getCapabilityScore(tool, 'search'),
        visualization: getCapabilityScore(tool, 'visual'),
        automation: getCapabilityScore(tool, 'automation')
      }
    }))
  }, [tools])

  function getCapabilityScore(tool: Tool, capability: string): number {
    // Smart scoring based on tool properties and tags
    let score = 0
    const tags = tool.tags?.join(' ').toLowerCase() || ''
    const purpose = tool.primaryPurpose?.toLowerCase() || ''
    const useCase = tool.bestUseCase?.toLowerCase() || ''
    const combined = `${tags} ${purpose} ${useCase}`

    switch (capability) {
      case 'code':
        if (tool.capabilities?.codeGeneration) score += 3;
        if (combined.includes('code') || combined.includes('programming') || combined.includes('development')) score += 2
        if (tool.name.includes('GitHub') || tool.name.includes('Copilot')) score += 1
        if (combined.includes('script') || combined.includes('automation')) score += 1
        break
      case 'data':
        if (tool.capabilities?.dataAnalysis) score += 3;
        if (combined.includes('data') || combined.includes('analytics') || combined.includes('intelligence')) score += 2
        if (combined.includes('dashboard') || combined.includes('visualization') || combined.includes('insights')) score += 1
        if (tool.name.includes('Plai') || combined.includes('decision')) score += 1
        break
      case 'content':
        if (tool.capabilities?.textGeneration) score += 3;
        if (combined.includes('writing') || combined.includes('content') || combined.includes('creative')) score += 2
        if (combined.includes('document') || combined.includes('text') || combined.includes('assistant')) score += 1
        break
      case 'collaboration':
        if (tool.capabilities?.chat) score += 2;
        if (combined.includes('collaboration') || combined.includes('meeting') || combined.includes('team')) score += 2
        if (combined.includes('office') || combined.includes('productivity') || combined.includes('workplace')) score += 1
        if (tool.name.includes('Concierge') || tool.name.includes('Microsoft')) score += 1
        break
      case 'compliance':
        if (tool.complianceAwareness) score += 2;
        if (combined.includes('compliance') || combined.includes('medical') || combined.includes('regulatory')) score += 2
        if (tool.type === 'internal') score += 2
        if (combined.includes('enterprise') || combined.includes('security')) score += 1
        break
      case 'search':
        if (tool.capabilities?.realTimeSearch) score += 3;
        if (combined.includes('search') || combined.includes('web') || combined.includes('real-time')) score += 2
        if (combined.includes('knowledge') || combined.includes('research') || combined.includes('literature')) score += 1
        break
      case 'visual':
        if (tool.capabilities?.imageGeneration || tool.capabilities?.vision) score += 3;
        if (combined.includes('image') || combined.includes('visual') || combined.includes('diagram')) score += 2
        if (combined.includes('design') || combined.includes('creative') || combined.includes('generation')) score += 1
        if (combined.includes('dashboard') || combined.includes('chart')) score += 1
        break
      case 'automation':
        if (combined.includes('automation') || combined.includes('workflow') || combined.includes('process')) score += 3
        if (combined.includes('productivity') || combined.includes('integration') || combined.includes('platform')) score += 2
        break
    }
    return Math.min(5, Math.max(0, score))
  }

  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') return enhancedTools
    if (selectedCategory === 'internal') return enhancedTools.filter(t => t.type === 'internal')
    if (selectedCategory === 'external') return enhancedTools.filter(t => t.type === 'external')
    return enhancedTools.filter(t => t.tags?.includes(selectedCategory))
  }, [enhancedTools, selectedCategory])

  const categories = useMemo(() => {
    const baseCategories = ['all', 'internal', 'external']
    const seen = new Set(baseCategories)
    for (const tool of enhancedTools) {
      for (const tag of tool.tags || []) {
        if (!tag) continue
        const normalizedTag = tag.trim()
        if (!normalizedTag) continue
        if (!seen.has(normalizedTag)) {
          seen.add(normalizedTag)
          baseCategories.push(normalizedTag)
        }
      }
    }
    return baseCategories
  }, [enhancedTools])

  const capabilityData = useMemo(() => {
    const capabilities = ['codeGeneration', 'dataAnalysis', 'contentCreation', 'collaboration', 'compliance', 'realTimeSearch', 'visualization', 'automation']
    return capabilities.map(cap => {
      const scores = filteredTools.map(t => t.capabilities?.[cap as keyof typeof t.capabilities] || 0)
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      const internal = enhancedTools.filter(t => t.type === 'internal').map(t => t.capabilities?.[cap as keyof typeof t.capabilities] || 0).reduce((a, b) => a + b, 0) / enhancedTools.filter(t => t.type === 'internal').length
      const external = enhancedTools.filter(t => t.type === 'external').map(t => t.capabilities?.[cap as keyof typeof t.capabilities] || 0).reduce((a, b) => a + b, 0) / enhancedTools.filter(t => t.type === 'external').length
      
      return {
        name: cap.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        average: Math.round(avg * 10) / 10,
        internal: Math.round(internal * 10) / 10,
        external: Math.round(external * 10) / 10,
        total: Math.round(avg * 20) // for bar chart percentage
      }
    })
  }, [filteredTools, enhancedTools])

  const useCaseDistribution = useMemo(() => {
    const useCases = enhancedTools.reduce((acc, tool) => {
      const useCase = tool.bestUseCase || 'Other'
      acc[useCase] = (acc[useCase] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(useCases).map(([name, count]) => ({
      name,
      count: count as number,
      percentage: Math.round((count as number / enhancedTools.length) * 100)
    })).sort((a, b) => (b.count as number) - (a.count as number))
  }, [enhancedTools])

  const technologyBreakdown = useMemo(() => {
    const techs = enhancedTools.reduce((acc, tool) => {
      const tech = tool.technology || 'Unknown'
      acc[tech] = (acc[tech] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(techs).map(([name, count]) => ({
      name,
      count: count as number,
      percentage: Math.round((count as number / enhancedTools.length) * 100)
    })).sort((a, b) => (b.count as number) - (a.count as number))
  }, [enhancedTools])

  const topPerformers = useMemo(() => {
    return filteredTools.map(tool => {
      const capabilities = tool.capabilities || {}
      const values = Object.values(capabilities).filter((v): v is number => typeof v === 'number')
      const avgScore = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
      return {
        ...tool,
        avgScore: Math.round(avgScore * 10) / 10
      }
    }).sort((a, b) => b.avgScore - a.avgScore).slice(0, 10)
  }, [filteredTools])

  // Generate detailed KPI data for drill-through
  const getKPIDetails = (kpiType: 'total' | 'internal' | 'external' | 'capability'): KPIDetails => {
    switch (kpiType) {
      case 'total':
        const statusBreakdown = enhancedTools.reduce((acc, tool) => {
          const status = tool.projectStatus || 'Unknown'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        return {
          title: 'Total Tools Overview',
          value: enhancedTools.length,
          description: 'Complete inventory of AI tools across the organization',
          breakdown: Object.entries(statusBreakdown).map(([label, value]) => ({
            label,
            value,
            percentage: Math.round((value / enhancedTools.length) * 100)
          })).sort((a, b) => b.value - a.value),
          insights: [
            `${enhancedTools.filter(t => t.type === 'internal').length} internal tools (${Math.round((enhancedTools.filter(t => t.type === 'internal').length / enhancedTools.length) * 100)}%)`,
            `${enhancedTools.filter(t => t.type === 'external').length} external tools (${Math.round((enhancedTools.filter(t => t.type === 'external').length / enhancedTools.length) * 100)}%)`,
            `Most common use case: ${useCaseDistribution[0]?.name || 'Various'}`,
            `Average tool rating: ${(topPerformers.reduce((sum, t) => sum + t.avgScore, 0) / topPerformers.length).toFixed(1)}/5.0`
          ]
        }
      
      case 'internal':
        const internalTools = enhancedTools.filter(t => t.type === 'internal')
        const internalByPhase = internalTools.reduce((acc, tool) => {
          const phase = tool.deploymentPhase || 'Unknown'
          acc[phase] = (acc[phase] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        return {
          title: 'Internal Tools Analysis',
          value: internalTools.length,
          description: 'Sanofi-developed and managed AI tools',
          breakdown: Object.entries(internalByPhase).map(([label, value]) => ({
            label,
            value,
            percentage: Math.round((value / internalTools.length) * 100)
          })).sort((a, b) => b.value - a.value),
          insights: [
            `${internalTools.filter(t => t.projectStatus === 'Production').length} tools in production`,
            `${internalTools.filter(t => t.deploymentPhase?.includes('Pilot')).length} tools in pilot phase`,
            `Compliance-aware tools: ${internalTools.filter(t => t.complianceAwareness).length}`,
            `Tools with training required: ${internalTools.filter(t => t.trainingRequired).length}`
          ]
        }
      
      case 'external':
        const externalTools = enhancedTools.filter(t => t.type === 'external')
        const originalExternalTools = tools.filter(t => t.type === 'external')
        const externalByTech = externalTools.reduce((acc, tool) => {
          const tech = tool.technology || 'Unknown'
          acc[tech] = (acc[tech] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        return {
          title: 'External Tools Analysis',
          value: externalTools.length,
          description: 'Third-party AI tools and services',
          breakdown: Object.entries(externalByTech).map(([label, value]) => ({
            label,
            value,
            percentage: Math.round((value / externalTools.length) * 100)
          })).sort((a, b) => b.value - a.value).slice(0, 5),
          insights: [
            `${originalExternalTools.filter(t => t.capabilities?.codeGeneration).length} tools with code generation`,
            `${originalExternalTools.filter(t => t.capabilities?.imageGeneration || t.imageGeneration).length} tools with image generation`,
            `${originalExternalTools.filter(t => t.capabilities?.realTimeSearch || t.realTimeWebSearch).length} tools with real-time search`,
            `AI-powered tools: ${originalExternalTools.filter(t => t.technology?.toLowerCase().includes('ai') || t.technology?.toLowerCase().includes('genai')).length}`
          ]
        }
      
      case 'capability':
        const avgCapability = Math.round(capabilityData.reduce((a, b) => a + b.average, 0) / capabilityData.length * 10) / 10
        
        return {
          title: 'Average Capability Score',
          value: avgCapability,
          description: 'Overall capability maturity across all tools',
          breakdown: capabilityData.slice(0, 5).map(cap => ({
            label: cap.name,
            value: cap.average,
            percentage: Math.round((cap.average / 5) * 100)
          })),
          insights: [
            `Highest capability: ${capabilityData[0]?.name} (${capabilityData[0]?.average}/5)`,
            `Lowest capability: ${capabilityData[capabilityData.length - 1]?.name} (${capabilityData[capabilityData.length - 1]?.average}/5)`,
            `Internal avg: ${(capabilityData.reduce((sum, cap) => sum + cap.internal, 0) / capabilityData.length).toFixed(1)}/5`,
            `External avg: ${(capabilityData.reduce((sum, cap) => sum + cap.external, 0) / capabilityData.length).toFixed(1)}/5`
          ]
        }
      
      default:
        return {
          title: 'Unknown',
          value: 0,
          description: '',
          breakdown: [],
          insights: []
        }
    }
  }

  const handleKPIClick = (kpiType: 'total' | 'internal' | 'external' | 'capability') => {
    const details = getKPIDetails(kpiType)
    setSelectedKPI(details)
    setShowKPIModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button 
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors touch-manipulation flex-shrink-0"
                aria-label="Go back"
              >
                ←
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3">
                  <BarChart3 className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                  <span className="truncate">AI Tools Analytics</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden sm:block">Comprehensive insights into the AI tools landscape</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm sm:text-base touch-manipulation w-full sm:w-auto"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 w-full sm:w-auto">
                {(['overview', 'comparison', 'trends'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation flex-1 sm:flex-initial ${
                      viewMode === mode 
                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <button 
            onClick={() => handleKPIClick('total')}
            className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm truncate">Total Tools</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{enhancedTools.length}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => handleKPIClick('internal')}
            className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm truncate">Internal Tools</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{enhancedTools.filter(t => t.type === 'internal').length}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-green-600 transition-colors" />
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => handleKPIClick('external')}
            className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm truncate">External Tools</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{enhancedTools.filter(t => t.type === 'external').length}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => handleKPIClick('capability')}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Avg Capability</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {Math.round(capabilityData.reduce((a, b) => a + b.average, 0) / capabilityData.length * 10) / 10}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-orange-600 transition-colors" />
              </div>
            </div>
          </button>
        </div>

        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Capability Matrix */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Capability Analysis</h3>
              <div className="space-y-4">
                {capabilityData.map((cap, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cap.name}</span>
                      <span className="text-sm text-slate-500">{cap.average}/5</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${cap.total}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Internal: {cap.internal}</span>
                      <span>External: {cap.external}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Case Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Use Case Distribution</h3>
              <div className="space-y-3">
                {useCaseDistribution.slice(0, 8).map((useCase, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 bg-gradient-to-r ${
                        idx % 4 === 0 ? 'from-blue-400 to-blue-600' :
                        idx % 4 === 1 ? 'from-green-400 to-green-600' :
                        idx % 4 === 2 ? 'from-purple-400 to-purple-600' :
                        'from-orange-400 to-orange-600'
                      }`} />
                      <span className="text-sm text-slate-700 dark:text-slate-300 break-words">{useCase.name}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{useCase.count}</div>
                      <div className="text-xs text-slate-500">{useCase.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Technology Stack</h3>
              <div className="grid grid-cols-2 gap-4">
                {technologyBreakdown.map((tech, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{tech.count}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 truncate">{tech.name}</div>
                    <div className="text-xs text-slate-500">{tech.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Top Performers</h3>
              <div className="space-y-3">
                {topPerformers.slice(0, 8).map((tool, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg text-sm font-bold">
                      {idx + 1}
                    </div>
                    {tool.logoUrl && (
                      <img 
                        src={resolveLogoUrl(tool.logoUrl) || tool.logoUrl} 
                        alt={tool.name} 
                        className="w-8 h-8 rounded-lg object-contain bg-white/50 p-1"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white">{tool.name}</div>
                      <div className="text-xs text-slate-500 truncate">{tool.primaryPurpose}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">{tool.avgScore}</div>
                      <div className="text-xs text-slate-500">avg score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'comparison' && (
          <div className="space-y-8">
            {/* Capability Comparison Matrix */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Capability Comparison Matrix
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-3">
                  ({filteredTools.length} tools)
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Tool</th>
                      {Object.keys(enhancedTools[0]?.capabilities || {}).map(cap => (
                        <th key={cap} className="text-center p-3 font-medium text-slate-700 dark:text-slate-300 min-w-[100px]">
                          {cap.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </th>
                      ))}
                      <th className="text-center p-3 font-medium text-slate-700 dark:text-slate-300">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTools.map((tool, idx) => (
                      <tr key={idx} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {tool.logoUrl && (
                              <img 
                                src={resolveLogoUrl(tool.logoUrl) || tool.logoUrl} 
                                alt={tool.name} 
                                className="w-6 h-6 rounded object-contain bg-white/50 p-0.5"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                              />
                            )}
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{tool.name}</div>
                              <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                                tool.type === 'internal' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              }`}>
                                {tool.type}
                              </div>
                            </div>
                          </div>
                        </td>
                        {Object.entries(tool.capabilities || {}).map(([cap, score]) => (
                          <td key={cap} className="p-3 text-center">
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                              (score as number) >= 4 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              (score as number) >= 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                              (score as number) >= 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                              'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                              {score as number}
                            </div>
                          </td>
                        ))}
                        <td className="p-3 text-center">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {(() => {
                              const values = Object.values(tool.capabilities || {}).filter((v): v is number => typeof v === 'number')
                              return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 10) / 10 : 0
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'trends' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Internal vs External Comparison */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Internal vs External Analysis</h3>
              <div className="space-y-6">
                {capabilityData.map((cap, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cap.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Internal</span>
                          <span>{cap.internal}/5</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(cap.internal / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>External</span>
                          <span>{cap.external}/5</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(cap.external / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capability Radar */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Capability Radar</h3>
              <div className="relative w-full h-80 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Grid lines */}
                  {[1, 2, 3, 4, 5].map(ring => (
                    <circle
                      key={ring}
                      cx="100"
                      cy="100"
                      r={ring * 16}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-slate-300 dark:text-slate-600"
                    />
                  ))}
                  
                  {/* Axis lines */}
                  {capabilityData.slice(0, 8).map((_, idx) => {
                    const angle = (idx * 45) * (Math.PI / 180) - Math.PI / 2
                    const x2 = 100 + Math.cos(angle) * 80
                    const y2 = 100 + Math.sin(angle) * 80
                    return (
                      <line
                        key={idx}
                        x1="100"
                        y1="100"
                        x2={x2}
                        y2={y2}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-slate-300 dark:text-slate-600"
                      />
                    )
                  })}
                  
                  {/* Internal tools polygon */}
                  <polygon
                    points={capabilityData.slice(0, 8).map((cap, idx) => {
                      const angle = (idx * 45) * (Math.PI / 180) - Math.PI / 2
                      const radius = (cap.internal / 5) * 80
                      const x = 100 + Math.cos(angle) * radius
                      const y = 100 + Math.sin(angle) * radius
                      return `${x},${y}`
                    }).join(' ')}
                    fill="rgba(34, 197, 94, 0.2)"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="2"
                  />
                  
                  {/* External tools polygon */}
                  <polygon
                    points={capabilityData.slice(0, 8).map((cap, idx) => {
                      const angle = (idx * 45) * (Math.PI / 180) - Math.PI / 2
                      const radius = (cap.external / 5) * 80
                      const x = 100 + Math.cos(angle) * radius
                      const y = 100 + Math.sin(angle) * radius
                      return `${x},${y}`
                    }).join(' ')}
                    fill="rgba(59, 130, 246, 0.2)"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                  
                  {/* Labels */}
                  {capabilityData.slice(0, 8).map((cap, idx) => {
                    const angle = (idx * 45) * (Math.PI / 180) - Math.PI / 2
                    const x = 100 + Math.cos(angle) * 95
                    const y = 100 + Math.sin(angle) * 95
                    return (
                      <text
                        key={idx}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs fill-current text-slate-700 dark:text-slate-300"
                      >
                        {cap.name.split(' ')[0]}
                      </text>
                    )
                  })}
                </svg>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Internal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">External</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Drill-Through Modal */}
      {showKPIModal && selectedKPI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedKPI.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedKPI.description}</p>
              </div>
              <button
                onClick={() => setShowKPIModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Main Metric */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Current Value</p>
                <p className="text-5xl font-bold text-slate-900 dark:text-white">{selectedKPI.value}</p>
              </div>

              {/* Breakdown */}
              {selectedKPI.breakdown.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Breakdown</h3>
                  <div className="space-y-3">
                    {selectedKPI.breakdown.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600 dark:text-slate-400">{item.value}</span>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{item.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              {selectedKPI.insights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Insights</h3>
                  <div className="grid gap-3">
                    {selectedKPI.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{idx + 1}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowKPIModal(false)}
                className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
