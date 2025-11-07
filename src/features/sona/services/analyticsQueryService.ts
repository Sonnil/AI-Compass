import type { Tool } from '../../../types'

export class AnalyticsQueryService {
  constructor(private tools: Tool[]) {}
  
  // Natural language to analytics queries
  processAnalyticsQuestion(question: string, entities: Record<string, any> = {}): string {
    const lowerQ = question.toLowerCase()
    
    // Specific metric queries
    if (lowerQ.includes('how many') || lowerQ.includes('count') || lowerQ.includes('total')) {
      return this.handleCountQuery(lowerQ)
    }
    
    if (lowerQ.includes('most popular') || lowerQ.includes('top')) {
      return this.getTopTools()
    }
    
    if (lowerQ.includes('capability') || lowerQ.includes('capabilities') || lowerQ.includes('can do')) {
      return this.getCapabilityStats()
    }
    
    if (lowerQ.includes('technology') || lowerQ.includes('tech stack')) {
      return this.getTechnologyBreakdown()
    }
    
    if (lowerQ.includes('use case') || lowerQ.includes('purpose')) {
      return this.getUseCaseBreakdown()
    }
    
    if (lowerQ.includes('internal') && lowerQ.includes('external') && (lowerQ.includes('vs') || lowerQ.includes('versus') || lowerQ.includes('compared'))) {
      return this.getInternalVsExternal()
    }
    
    if (lowerQ.includes('cost') || lowerQ.includes('price') || lowerQ.includes('pricing')) {
      return this.getCostBreakdown()
    }
    
    if (lowerQ.includes('tag') || lowerQ.includes('category') || lowerQ.includes('categories')) {
      return this.getCategoryBreakdown()
    }
    
    // Default: provide summary stats
    return this.getSummaryStats()
  }
  
  private handleCountQuery(query: string): string {
    if (query.includes('internal')) {
      return this.getInternalToolCount()
    }
    if (query.includes('external')) {
      return this.getExternalToolCount()
    }
    if (query.includes('code') || query.includes('coding')) {
      const count = this.tools.filter(t => t.capabilities?.codeGeneration || t.capabilities?.codeGeneration === true).length
      return `📊 **${count} tools** support code generation capabilities.`
    }
    if (query.includes('image') || query.includes('visual')) {
      const count = this.tools.filter(t => t.imageGeneration || t.capabilities?.imageGeneration).length
      return `📊 **${count} tools** support image generation capabilities.`
    }
    if (query.includes('search') || query.includes('web')) {
      const count = this.tools.filter(t => t.realTimeWebSearch || t.capabilities?.realTimeSearch).length
      return `📊 **${count} tools** have real-time web search capabilities.`
    }
    
    const total = this.tools.length
    return `📊 AI-Compass has **${total} tools** in total.`
  }
  
  private getInternalToolCount(): string {
    const internal = this.tools.filter(t => t.type === 'internal').length
    const total = this.tools.length
    const percentage = Math.round((internal / total) * 100)
    
    return `📊 **Internal Tools Statistics:**

- **${internal}** internal tools (${percentage}% of catalog)
- **${total - internal}** external tools (${100 - percentage}%)
- **Total**: ${total} tools

Internal tools are Sanofi-specific solutions built for our unique needs.`
  }
  
  private getExternalToolCount(): string {
    const external = this.tools.filter(t => t.type === 'external').length
    const total = this.tools.length
    const percentage = Math.round((external / total) * 100)
    
    return `📊 **External Tools Statistics:**

- **${external}** external tools (${percentage}% of catalog)
- **${total - external}** internal tools (${100 - percentage}%)
- **Total**: ${total} tools

External tools provide industry-leading capabilities.`
  }
  
  private getTopTools(): string {
    const top30 = this.tools.filter(t => t.tags?.includes('top30'))
    
    if (top30.length === 0) {
      // Fallback: show tools sorted by rating or random selection
      const topList = this.tools.slice(0, 10)
      const names = topList.map(t => `• **${t.name}** - ${t.primaryPurpose}`).join('\n')
      return `🏆 **Popular Tools:**\n\n${names}`
    }
    
    const names = top30.map(t => `• **${t.name}** - ${t.primaryPurpose}`).join('\n')
    return `🏆 **Top Tools:**\n\n${names}\n\n*These tools are widely used across Sanofi*`
  }
  
  private getCapabilityStats(): string {
    const capabilities = {
      realTimeWebSearch: this.tools.filter(t => t.realTimeWebSearch || t.capabilities?.realTimeSearch).length,
      codeGeneration: this.tools.filter(t => t.capabilities?.codeGeneration).length,
      imageGeneration: this.tools.filter(t => t.imageGeneration || t.capabilities?.imageGeneration).length
    }
    
    const total = this.tools.length
    
    return `📊 **Capability Breakdown:**

🌐 **Real-time Web Search**: ${capabilities.realTimeWebSearch} tools (${Math.round((capabilities.realTimeWebSearch/total)*100)}%)
💻 **Code Generation**: ${capabilities.codeGeneration} tools (${Math.round((capabilities.codeGeneration/total)*100)}%)
🎨 **Image Generation**: ${capabilities.imageGeneration} tools (${Math.round((capabilities.imageGeneration/total)*100)}%)

*Most tools offer multiple capabilities!*`
  }
  
  private getTechnologyBreakdown(): string {
    const techCount = new Map<string, number>()
    this.tools.forEach(tool => {
      const tech = tool.technology || 'Unknown'
      techCount.set(tech, (techCount.get(tech) || 0) + 1)
    })
    
    const sorted = Array.from(techCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
    
    const breakdown = sorted.map(([tech, count]) => {
      const percentage = Math.round((count / this.tools.length) * 100)
      return `• **${tech}**: ${count} tools (${percentage}%)`
    }).join('\n')
    
    return `🔧 **Technology Stack Overview:**\n\n${breakdown}\n\n*Visit the Analytics dashboard for detailed technology insights*`
  }
  
  private getUseCaseBreakdown(): string {
    const useCases = new Map<string, number>()
    this.tools.forEach(tool => {
      const useCase = tool.bestUseCase || 'General Purpose'
      useCases.set(useCase, (useCases.get(useCase) || 0) + 1)
    })
    
    const sorted = Array.from(useCases.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
    
    const breakdown = sorted.map(([useCase, count]) => {
      const percentage = Math.round((count / this.tools.length) * 100)
      return `• **${useCase}**: ${count} tools (${percentage}%)`
    }).join('\n')
    
    return `🎯 **Use Case Distribution:**\n\n${breakdown}`
  }
  
  private getInternalVsExternal(): string {
    const internal = this.tools.filter(t => t.type === 'internal')
    const external = this.tools.filter(t => t.type === 'external')
    
    const internalCodeGen = internal.filter(t => t.capabilities?.codeGeneration).length
    const externalCodeGen = external.filter(t => t.capabilities?.codeGeneration).length
    
    const internalImageGen = internal.filter(t => t.imageGeneration || t.capabilities?.imageGeneration).length
    const externalImageGen = external.filter(t => t.imageGeneration || t.capabilities?.imageGeneration).length
    
    const internalWebSearch = internal.filter(t => t.realTimeWebSearch || t.capabilities?.realTimeSearch).length
    const externalWebSearch = external.filter(t => t.realTimeWebSearch || t.capabilities?.realTimeSearch).length
    
    return `⚖️ **Internal vs External Analysis:**

**Count:**
• Internal: ${internal.length} tools
• External: ${external.length} tools

**Capabilities Comparison:**
💻 Code Generation:
  - Internal: ${internalCodeGen} (${Math.round((internalCodeGen/internal.length)*100)}%)
  - External: ${externalCodeGen} (${Math.round((externalCodeGen/external.length)*100)}%)

🎨 Image Generation:
  - Internal: ${internalImageGen} (${Math.round((internalImageGen/internal.length)*100)}%)
  - External: ${externalImageGen} (${Math.round((externalImageGen/external.length)*100)}%)

🌐 Web Search:
  - Internal: ${internalWebSearch} (${Math.round((internalWebSearch/internal.length)*100)}%)
  - External: ${externalWebSearch} (${Math.round((externalWebSearch/external.length)*100)}%)

*Internal tools are optimized for Sanofi's needs; External tools offer broad industry capabilities.*`
  }
  
  private getCostBreakdown(): string {
    const costTypes = new Map<string, number>()
    this.tools.forEach(tool => {
      const cost = tool.cost || 'Not specified'
      costTypes.set(cost, (costTypes.get(cost) || 0) + 1)
    })
    
    const sorted = Array.from(costTypes.entries())
      .sort((a, b) => b[1] - a[1])
    
    const breakdown = sorted.map(([cost, count]) => {
      const percentage = Math.round((count / this.tools.length) * 100)
      return `• **${cost}**: ${count} tools (${percentage}%)`
    }).join('\n')
    
    return `💰 **Cost Distribution:**\n\n${breakdown}`
  }
  
  private getCategoryBreakdown(): string {
    const allTags = new Set<string>()
    this.tools.forEach(tool => {
      tool.tags?.forEach(tag => allTags.add(tag))
    })
    
    const tagCounts = Array.from(allTags).map(tag => ({
      tag,
      count: this.tools.filter(t => t.tags?.includes(tag)).length
    })).sort((a, b) => b.count - a.count).slice(0, 10)
    
    const breakdown = tagCounts.map(({ tag, count }) => {
      const percentage = Math.round((count / this.tools.length) * 100)
      return `• #${tag}: ${count} tools (${percentage}%)`
    }).join('\n')
    
    return `🏷️ **Top Categories/Tags:**\n\n${breakdown}\n\n*Total unique tags: ${allTags.size}*`
  }
  
  private getSummaryStats(): string {
    const total = this.tools.length
    const internal = this.tools.filter(t => t.type === 'internal').length
    const external = total - internal
    
    const withCodeGen = this.tools.filter(t => t.capabilities?.codeGeneration).length
    const withImageGen = this.tools.filter(t => t.imageGeneration || t.capabilities?.imageGeneration).length
    const withWebSearch = this.tools.filter(t => t.realTimeWebSearch || t.capabilities?.realTimeSearch).length
    
    const uniqueTags = new Set(this.tools.flatMap(t => t.tags || [])).size
    const uniqueTechs = new Set(this.tools.map(t => t.technology)).size
    
    return `📊 **AI-Compass Platform Overview:**

**Tool Distribution:**
• Total Tools: **${total}**
• Internal: **${internal}** (${Math.round((internal/total)*100)}%)
• External: **${external}** (${Math.round((external/total)*100)}%)

**Key Capabilities:**
• Code Generation: ${withCodeGen} tools
• Image Generation: ${withImageGen} tools
• Web Search: ${withWebSearch} tools

**Diversity:**
• ${uniqueTags} unique categories/tags
• ${uniqueTechs} different technologies

*Want more details? Ask about specific metrics or visit the Analytics dashboard!*`
  }
}
