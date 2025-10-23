# SONA Analytics Capabilities

## Overview

SONA, the AI Compass chatbot assistant, now has comprehensive analytics and data analysis capabilities. Users can ask SONA to analyze tool data, provide insights, compare performance metrics, and get strategic recommendations—all through natural conversation.

## New Capabilities

### 1. **Capability Analysis** 📊
SONA can analyze and score tools across 8 capability dimensions on a 0-5 scale:

- **Code Generation** - Programming & development assistance
- **Data Analysis** - Analytics, insights, and intelligence
- **Content Creation** - Writing, documents, and creative work
- **Collaboration** - Team features and shared workflows
- **Compliance** - Regulatory awareness and security
- **Real-Time Search** - Web access and current information
- **Visualization** - Charts, images, and diagrams
- **Automation** - Workflow optimization and efficiency

**Example Queries:**
- "Show me capability scores"
- "What are the tool capabilities?"
- "Analyze capabilities"
- "Which capability is strongest?"

**What SONA Provides:**
- Overall capability scores for all tools
- Internal vs External comparison
- Visual bar charts (using unicode characters)
- Strongest and weakest capability identification
- Strategic insights and recommendations

### 2. **Comparison Analytics** 🔄
SONA can perform comprehensive internal vs external tool benchmarking.

**Example Queries:**
- "Compare internal vs external tools"
- "Show comparison analytics"
- "Internal vs external analysis"
- "Compare tool data"

**What SONA Provides:**
- Tool distribution breakdown (counts and percentages)
- Side-by-side capability comparison tables
- Internal tool advantages
- External tool advantages
- Strategic recommendations (when to use internal vs external)
- Hybrid approach suggestions

### 3. **Distribution Analysis** 📈
SONA analyzes how tools are distributed across categories and technologies.

**Example Queries:**
- "Show use case distribution"
- "Analyze technology breakdown"
- "Tool distribution"
- "Category breakdown"

**What SONA Provides:**
- Use case distribution (with percentages)
- Technology breakdown
- Most common use cases
- Leading technologies
- Coverage analysis
- Visual distribution charts

### 4. **Top Performers Analysis** 🏆
SONA ranks and analyzes the highest-scoring tools based on capability metrics.

**Example Queries:**
- "What are the best tools?"
- "Show top performers"
- "Highest scoring tools"
- "Top 10 tools"
- "Leading tools"

**What SONA Provides:**
- Top 10 ranked tools with overall scores
- Best use case for each tool
- Top 3 capabilities per tool
- Type (Internal/External) mix
- Performance benchmarks
- Excellence thresholds

### 5. **Analytics Dashboard Guide** 🎯
SONA can guide users through the Analytics Dashboard features.

**Example Queries:**
- "How do I use the analytics dashboard?"
- "Where is analytics?"
- "Show me the dashboard"
- "Analytics dashboard guide"
- "How to view analytics?"

**What SONA Provides:**
- Step-by-step access instructions
- Key metrics card explanations
- View mode descriptions (Overview, Comparison, Trends)
- Filter options guide
- Capability scoring system explanation
- Mobile responsiveness highlights
- Best practices for using the dashboard

### 6. **General Analytics Overview** 📋
SONA provides quick stats and comprehensive overview of available analytics.

**Example Queries:**
- "Show me analytics"
- "Analytics overview"
- "Tool statistics"
- "Show me data"

**What SONA Provides:**
- Quick stats summary (total tools, internal/external counts)
- Average capability score
- Featured insights (top tool, strongest capability, most common use case)
- Navigation guide to other analytics features
- Suggested analytics queries

## Intent Detection

SONA recognizes analytics-related queries through keyword detection:

**Detected Keywords:**
- analytics, analyze, analysis
- data, statistics, stats
- metrics, insights
- dashboard, report
- capability score, performance
- comparison data, tool data
- breakdown, distribution

## Example Conversations

### Example 1: Capability Analysis
**User:** "Show me capability scores"

**SONA Response:**
```
## 📊 Capability Analysis

Analyzing 26 AI tools across 8 key capability dimensions:

### Overall Capability Scores (0-5 scale)

**Code Generation:** ████░ 4.2/5
  • Internal: 3.8/5 | External: 4.5/5

**Data Analysis:** ███▒░ 3.5/5
  • Internal: 4.0/5 | External: 3.2/5

[... continues with all capabilities ...]

### Key Insights:

🏆 **Strongest Capability:** Code Generation (4.2/5)
  Tools in our catalog excel at code generation

📈 **Growth Opportunity:** Visualization (2.8/5)
  Consider exploring more tools for visualization

🔵 **Internal Tools Average:** 3.6/5
🔗 **External Tools Average:** 3.8/5

---

💡 **Pro Tip:** Click the Analytics button in the header to explore interactive capability charts!
```

### Example 2: Top Performers
**User:** "What are the best tools?"

**SONA Response:**
```
## 🏆 Top Performing AI Tools

Based on comprehensive capability analysis across 8 dimensions:

### 🥇 ChatGPT 🔗
**Overall Score:** 4.5/5 | **Type:** External

**Best For:** General-purpose AI assistance, content creation
**Technology:** GPT-4

**Top Capabilities:** Content Creation: 5/5 | Code Generation: 4/5 | Real Time Search: 4/5

### 🥈 GitHub Copilot 🔗
**Overall Score:** 4.3/5 | **Type:** External

**Best For:** Code generation and development assistance
**Technology:** GPT-4 (Codex)

[... continues with Top 10 ...]
```

### Example 3: Dashboard Guide
**User:** "How do I use the analytics dashboard?"

**SONA Response:**
```
## 📊 AI Tools Analytics Dashboard Guide

### How to Access

1. **Click the Analytics button** in the top header (bar chart icon 📊)
2. You'll be taken to the comprehensive Analytics Dashboard
3. Use filters and view modes to explore different perspectives

### Dashboard Features

#### 📈 Key Metrics Cards
• **Total Tools:** See overall catalog size
• **Internal Tools:** Count of Sanofi-built tools
• **External Tools:** Count of market AI solutions
• **Avg Capability:** Overall performance score

[... continues with full guide ...]
```

## Technical Implementation

### Functions Added

1. **`getAnalyticsInsights(input, toolsCatalog, detectedIntents)`**
   - Main router function for analytics queries
   - Determines specific type of analytics requested
   - Routes to appropriate analysis function

2. **`calculateToolStatistics(toolsCatalog)`**
   - Calculates comprehensive statistics
   - Scores all tools across 8 capabilities
   - Computes averages, distributions, rankings
   - Returns structured data object

3. **`getCapabilityScore(tool, capability)`**
   - Smart scoring algorithm
   - Analyzes tool tags, purpose, use case
   - Domain-specific scoring logic
   - Returns normalized 0-5 score

4. **`getCapabilityAnalysis(toolsCatalog, stats)`**
   - Generates capability analysis response
   - Visual bar charts with unicode
   - Internal vs External comparison
   - Strategic insights

5. **`getComparisonAnalytics(toolsCatalog, stats)`**
   - Internal vs External benchmarking
   - Formatted comparison tables
   - Advantage analysis
   - Recommendations

6. **`getDistributionAnalysis(toolsCatalog, stats)`**
   - Use case distribution breakdown
   - Technology breakdown
   - Visual percentage bars
   - Key findings

7. **`getTopPerformersAnalysis(toolsCatalog, stats)`**
   - Ranked tool list (Top 10)
   - Detailed scoring information
   - Top capabilities per tool
   - Performance insights

8. **`getAnalyticsDashboardGuide()`**
   - Complete dashboard tutorial
   - Feature-by-feature guide
   - Mobile responsiveness info
   - Best practices

9. **`getGeneralAnalyticsOverview(toolsCatalog, stats)`**
   - Quick stats summary
   - Featured insights
   - Navigation guide
   - Suggested queries

### Capability Scoring Algorithm

The scoring algorithm analyzes three key attributes:
- **Tags** - Categorization labels
- **Primary Purpose** - Main tool purpose
- **Best Use Case** - Optimal use scenario

**Scoring Logic Example (Code Generation):**
```
+3 points: Contains "code", "programming", "development"
+2 points: Tool name includes "GitHub" or "Copilot"
+1 point: Contains "script" or "automation"
Maximum: 5 points (normalized)
```

Each capability has domain-specific scoring logic optimized for accuracy.

### Data Structure

**Stats Object:**
```typescript
{
  total: number                    // Total tool count
  internalCount: number            // Internal tools
  externalCount: number            // External tools
  toolsWithScores: Array<{         // Tools with calculated scores
    ...tool,
    capabilities: {
      codeGeneration: number,
      dataAnalysis: number,
      contentCreation: number,
      collaboration: number,
      compliance: number,
      realTimeSearch: number,
      visualization: number,
      automation: number
    },
    avgScore: number               // Overall average score
  }>
  capabilityAverages: Array<{      // Average scores per capability
    name: string,
    overall: number,
    internal: number,
    external: number
  }>
  useCaseDistribution: Array<{     // Use case breakdown
    name: string,
    count: number,
    percentage: number
  }>
  technologyBreakdown: Array<{     // Technology distribution
    name: string,
    count: number,
    percentage: number
  }>
  topPerformers: Array<Tool>       // Top 10 ranked tools
}
```

## Response Formatting

SONA uses rich formatting for analytics responses:

### Visual Elements
- **Bar Charts:** `████░ 4.2/5` (using █ and ░ unicode)
- **Tables:** Markdown tables for comparisons
- **Emoji Icons:** For visual hierarchy (📊, 🏆, 🔵, 🔗, etc.)
- **Structured Sections:** Clear headers with ##, ###
- **Bullet Points:** • for lists
- **Separators:** `---` for visual breaks

### Content Structure
1. **Main Heading** - Clear title with relevant emoji
2. **Introduction** - Context and scope
3. **Data Sections** - Organized by category
4. **Key Insights** - Highlighted findings
5. **Recommendations** - Actionable advice
6. **Navigation** - Links to other features
7. **Sources** - Attribution and transparency

## Integration with Existing Features

SONA's analytics capabilities integrate seamlessly with:

1. **Tool Catalog** - Real-time data from 26 tools
2. **Comparison Feature** - Enhanced with data analysis
3. **Analytics Dashboard** - Guides users to visual interface
4. **Knowledge Base** - Combines with AI facts, tips, and platform info
5. **Suggested Questions** - 6 new analytics suggestions added

## Suggested Questions

SONA now suggests analytics-related follow-up questions:

- "Show me capability scores"
- "What are the top performing tools?"
- "Analyze use case distribution"
- "Compare internal vs external analytics"
- "How do I access the analytics dashboard?"
- "Show me technology breakdown"

## User Benefits

### 1. **Instant Insights**
Get analytics without leaving the chat interface

### 2. **Data-Driven Decisions**
Make informed tool selection based on quantitative metrics

### 3. **Strategic Guidance**
Receive recommendations based on comprehensive analysis

### 4. **Learning Support**
Understand how to use the Analytics Dashboard

### 5. **Comprehensive Coverage**
Access multiple analytics perspectives in one place

### 6. **Natural Interaction**
Ask questions in plain language, get formatted insights

## Use Cases

### For Managers
- "Show me top performing tools" → Get ranked list for team recommendations
- "Compare internal vs external" → Understand strategic tool mix
- "Show capability scores" → Assess tool coverage across dimensions

### For Individual Users
- "What are the best tools for data analysis?" → Get targeted recommendations
- "How do I use the analytics dashboard?" → Learn to explore data visually
- "Show use case distribution" → Understand tool landscape

### For Decision Makers
- "Analyze tool capabilities" → Assess organizational AI maturity
- "Show technology breakdown" → Understand tech investments
- "Top performers analysis" → Identify high-value tools

### For New Users
- "Show me analytics" → Get comprehensive overview
- "What is capability scoring?" → Learn the system
- "Analytics dashboard guide" → Step-by-step tutorial

## Future Enhancements

Potential future additions:
- Time-series analysis (tool adoption over time)
- User satisfaction metrics
- ROI calculations
- Custom capability weighting
- Export analytics data
- Predictive recommendations
- Cross-functional comparisons
- Industry benchmarking

## Technical Notes

### Performance
- Real-time calculations (no pre-computed data)
- Optimized for 26 tools (scales to 100+)
- Efficient scoring algorithm (O(n) complexity)
- Minimal memory overhead

### Accuracy
- Scoring based on verified tool metadata
- Regular updates with catalog changes
- Domain expert validation of scoring logic
- Conservative normalization (prevents over-scoring)

### Maintenance
- Scoring logic in `getCapabilityScore()` function
- Easy to add new capabilities
- Modular response functions
- Centralized statistics calculation

## Support

For questions about SONA's analytics capabilities:
- Ask SONA: "How do analytics work?"
- Email: ai-compass@sanofi.com
- Explore: Click Analytics button in header

---

**Version:** 1.0  
**Last Updated:** October 23, 2025  
**Author:** AI Compass Team  
**Related Documentation:** ANALYTICS.md, README.md
