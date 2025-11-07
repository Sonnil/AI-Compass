# SONA Enhanced Architecture - Visual Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          AI-COMPASS PLATFORM                             │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                      CHAT WIDGET (UI)                          │    │
│  │  • Message display                                              │    │
│  │  • Input field                                                  │    │
│  │  • Streaming responses                                          │    │
│  │  • Feedback buttons (👍/👎)                                      │    │
│  └───────────────────────┬────────────────────────────────────────┘    │
│                          │                                               │
│                          │ User Message                                 │
│                          ▼                                               │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │               AGENT ORCHESTRATION LAYER                        │    │
│  │                                                                 │    │
│  │  ┌──────────────────────────────────────────────────────┐     │    │
│  │  │  shouldUseEnhancedAgent(message)                     │     │    │
│  │  │  • Classify intent                                    │     │    │
│  │  │  • Check confidence ≥ 60%                            │     │    │
│  │  │  • Check intent type (recommendation, comparison,    │     │    │
│  │  │    analytics, help, details)                         │     │    │
│  │  └──────────────────┬───────────────────────────────────┘     │    │
│  │                     │                                          │    │
│  │          YES        │        NO                                │    │
│  │     (Confidence     │   (Low confidence or                    │    │
│  │      ≥ 60% +        │    special query)                       │    │
│  │   specific intent)  │                                          │    │
│  │                     │                                          │    │
│  └─────────────────────┼──────────────────────────────────────────┘    │
│                        │                                                │
└────────────────────────┼────────────────────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                │
         ▼                                ▼
┌─────────────────────┐         ┌─────────────────────┐
│   ENHANCED AGENT    │         │   ORIGINAL AGENT    │
│     (Phase 1)       │         │    (Fallback)       │
└─────────┬───────────┘         └─────────┬───────────┘
          │                               │
          │                               │
          ▼                               ▼
┌──────────────────────────────┐ ┌───────────────────────┐
│  1. INTENT CLASSIFIER        │ │  • Tool call decision │
│                              │ │  • Execute tool       │
│  ┌────────────────────────┐ │ │  • Template response  │
│  │ Pattern Matching       │ │ │  • External API       │
│  │ • Regex patterns       │ │ │    fallback           │
│  │ • Keyword detection    │ │ └───────────────────────┘
│  │ • Confidence scoring   │ │
│  └────────────────────────┘ │
│                              │
│  Returns: Intent {           │
│    type: UserIntent,         │
│    confidence: 0-1,          │
│    entities: {...}           │
│  }                           │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  2. RESPONSE GENERATOR       │
│                              │
│  Routes to handlers based    │
│  on intent type:             │
│                              │
│  ┌────────────────────────┐ │
│  │ TOOL_RECOMMENDATION    │ │
│  │ → handleRecommendation │ │
│  │   • Filter by type     │ │
│  │   • Filter by cap.     │ │
│  │   • Filter by use case │ │
│  │   • Rank by relevance  │ │
│  │   • Return top 5       │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ TOOL_COMPARISON        │ │
│  │ → handleComparison     │ │
│  │   • Find tools by name │ │
│  │   • Extract details    │ │
│  │   • Generate table     │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ ANALYTICS_QUERY        │ │
│  │ → handleAnalyticsQuery │ │
│  │   • Delegate to        │ │
│  │     Analytics Service  │ ├──────┐
│  └────────────────────────┘ │      │
│                              │      │
│  ┌────────────────────────┐ │      │
│  │ PLATFORM_HELP          │ │      │
│  │ → handlePlatformHelp   │ │      │
│  │   • Detect help topic  │ │      │
│  │   • Return guide       │ │      │
│  └────────────────────────┘ │      │
│                              │      │
│  ┌────────────────────────┐ │      │
│  │ TOOL_DETAILS           │ │      │
│  │ → handleToolDetails    │ │      │
│  │   • Find tool          │ │      │
│  │   • Show full info     │ │      │
│  └────────────────────────┘ │      │
│                              │      │
│  ┌────────────────────────┐ │      │
│  │ GREETING               │ │      │
│  │ → handleGreeting       │ │      │
│  │   • Random greeting    │ │      │
│  └────────────────────────┘ │      │
│                              │      │
│  ┌────────────────────────┐ │      │
│  │ GENERAL_QUESTION       │ │      │
│  │ → handleGeneralQuestion│ │      │
│  │   • AI knowledge       │ │      │
│  │   • Sanofi info        │ │      │
│  └────────────────────────┘ │      │
└──────────────────────────────┘      │
                                      │
                ┌─────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│  3. ANALYTICS QUERY SERVICE          │
│                                      │
│  Processes natural language queries │
│  about tool statistics:              │
│                                      │
│  • Count queries                     │
│    "how many tools?"                 │
│    → getInternalToolCount()          │
│                                      │
│  • Capability queries                │
│    "tools with code generation"      │
│    → getCapabilityStats()            │
│                                      │
│  • Technology queries                │
│    "technology breakdown"            │
│    → getTechnologyBreakdown()        │
│                                      │
│  • Comparison queries                │
│    "internal vs external"            │
│    → getInternalVsExternal()         │
│                                      │
│  • Summary queries                   │
│    "platform overview"               │
│    → getSummaryStats()               │
│                                      │
│  Data Source: Tool Catalog (43+)    │
└──────────────────────────────────────┘
```

## 🔄 Data Flow Example

### Example 1: Tool Recommendation

```
User: "recommend a tool for data analysis"
  │
  ▼
┌─────────────────────────────────────┐
│ ChatWidget.handleSend()             │
│ • Create user message               │
│ • Update user profile               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ EnhancedAgent.shouldUseEnhancedAgent│
│ • Classify: TOOL_RECOMMENDATION     │
│ • Confidence: 0.9                   │
│ • Decision: YES (use enhanced)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ EnhancedAgent.processMessage()      │
│ • Intent: TOOL_RECOMMENDATION       │
│ • Entities: { useCase: "data        │
│             analysis" }             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ ResponseGenerator.generateResponse()│
│ • Route to: handleRecommendation()  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ handleRecommendation()              │
│ 1. Filter tools by use case:        │
│    - Search in name                 │
│    - Search in primaryPurpose       │
│    - Search in description          │
│    - Search in tags                 │
│    - Search in bestUseCase          │
│                                     │
│ 2. Rank by relevance:               │
│    - top30 tag: +2 points           │
│    - internal type: +1 point        │
│                                     │
│ 3. Return top 5 tools               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Generate formatted response:        │
│                                     │
│ 🎯 Recommended Tools for data       │
│    analysis:                        │
│                                     │
│ 1. 🏢 Power BI | Data, Code         │
│    Create interactive data          │
│    visualizations...                │
│                                     │
│ 2. 🌐 Tableau | Data, Image         │
│    Advanced analytics platform...   │
│                                     │
│ [+ 3 more tools]                    │
│                                     │
│ 💡 Want to compare these tools?     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ ChatWidget streaming                │
│ • Split response into words         │
│ • Stream word by word (20ms delay)  │
│ • Update UI progressively           │
└─────────────────────────────────────┘
```

### Example 2: Analytics Query

```
User: "how many internal tools?"
  │
  ▼
┌─────────────────────────────────────┐
│ IntentClassifier.classify()         │
│ • Matches: "how many" + "internal"  │
│ • Intent: ANALYTICS_QUERY           │
│ • Confidence: 0.9                   │
│ • Entities: { type: "internal" }    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ ResponseGenerator                   │
│ → handleAnalyticsQuery()            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ AnalyticsQueryService               │
│ .processAnalyticsQuestion()         │
│                                     │
│ 1. Detect "how many" + "internal"   │
│ 2. Call getInternalToolCount()      │
│ 3. Count: tools.filter(type===      │
│    'internal')                      │
│ 4. Calculate percentages            │
│ 5. Format with emojis               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Response:                           │
│                                     │
│ 📊 **Internal Tools Statistics:**   │
│                                     │
│ • **15** internal tools (35%)       │
│ • **28** external tools (65%)       │
│ • **Total**: 43 tools               │
│                                     │
│ Internal tools are Sanofi-specific  │
│ solutions built for our unique      │
│ needs.                              │
└─────────────────────────────────────┘
```

## 🧩 Component Relationships

```
┌────────────────────────────────────────────────────────────────┐
│                        CHAT WIDGET                             │
│  (UI Component - React)                                        │
│                                                                │
│  • Manages conversation state                                  │
│  • Handles user input                                          │
│  • Displays messages                                           │
│  • Streams responses                                           │
│  • Collects feedback                                           │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         │ creates & uses
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    ENHANCED SONA AGENT                         │
│  (Orchestration Layer - TypeScript Class)                     │
│                                                                │
│  • Decides which logic to use                                  │
│  • Coordinates services                                        │
│  • Provides debugging interface                                │
└────────┬───────────────────────────────┬───────────────────────┘
         │                               │
         │ uses                          │ uses
         │                               │
         ▼                               ▼
┌──────────────────────┐      ┌──────────────────────────────────┐
│  INTENT CLASSIFIER   │      │    RESPONSE GENERATOR            │
│  (Service)           │      │    (Service)                     │
│                      │      │                                  │
│  • Pattern matching  │      │  • Routes to handlers            │
│  • Entity extraction │      │  • Generates responses           │
│  • Confidence calc   │      │  • Formats with markdown         │
└──────────────────────┘      └───────────┬──────────────────────┘
                                          │
                                          │ uses
                                          │
                                          ▼
                              ┌─────────────────────────────────┐
                              │  ANALYTICS QUERY SERVICE        │
                              │  (Service)                      │
                              │                                 │
                              │  • Processes analytics queries  │
                              │  • Calculates statistics        │
                              │  • Formats results              │
                              └─────────────────────────────────┘
```

## 📊 Intent Classification Decision Tree

```
User Message
    │
    ▼
Does it match recommendation patterns?
  ("recommend", "suggest", "find", "tool for")
    │
    ├─ YES → TOOL_RECOMMENDATION (confidence: 0.8-0.95)
    │        Extract: useCase, capability, type
    │
    ▼
Does it match comparison patterns?
  ("compare", "difference", "vs", "versus")
    │
    ├─ YES → TOOL_COMPARISON (confidence: 0.85-0.95)
    │        Extract: toolNames[]
    │
    ▼
Does it match analytics patterns?
  ("how many", "show me", "statistics", "count")
    │
    ├─ YES → ANALYTICS_QUERY (confidence: 0.75-0.9)
    │        Extract: metric type, filters
    │
    ▼
Does it match help patterns?
  ("how do", "how to", "explain", "help with")
    │
    ├─ YES → PLATFORM_HELP (confidence: 0.7-0.85)
    │        Extract: feature/topic
    │
    ▼
Does it match tool detail patterns?
  ("tell me about", "what is", "describe")
    │
    ├─ YES → TOOL_DETAILS (confidence: 0.75-0.9)
    │        Extract: toolName
    │
    ▼
Does it match greeting patterns?
  ("hi", "hello", "hey")
    │
    ├─ YES → GREETING (confidence: 0.9-0.95)
    │
    ▼
Does it match suggestion patterns?
  ("suggest", "feedback", "idea", "feature request")
    │
    ├─ YES → SUGGESTION (confidence: 0.7-0.85)
    │
    ▼
Default → GENERAL_QUESTION (confidence: 0.5-0.7)
```

## 🎨 Response Generation Flow

```
Intent + Entities
    │
    ▼
Switch on Intent Type
    │
    ├─ TOOL_RECOMMENDATION
    │    │
    │    ├─ 1. Filter Tools
    │    │    • By type (internal/external)
    │    │    • By capability (code/image/search/data)
    │    │    • By use case (text search)
    │    │
    │    ├─ 2. Rank Tools
    │    │    • top30 tag: +2
    │    │    • internal type: +1
    │    │
    │    ├─ 3. Select Top 5
    │    │
    │    └─ 4. Format Response
    │         • List with emojis
    │         • Show capabilities
    │         • Offer comparison
    │
    ├─ TOOL_COMPARISON
    │    │
    │    ├─ 1. Find Tools
    │    │    • Match by name (fuzzy)
    │    │
    │    ├─ 2. Extract Details
    │    │    • Capabilities
    │    │    • Cost
    │    │    • Access
    │    │    • Best use case
    │    │
    │    └─ 3. Format Table
    │         • Side-by-side
    │         • Highlight differences
    │
    ├─ ANALYTICS_QUERY
    │    │
    │    ├─ 1. Detect Query Type
    │    │    • Count
    │    │    • Capability
    │    │    • Technology
    │    │    • Summary
    │    │
    │    ├─ 2. Calculate Stats
    │    │    • Filter tools
    │    │    • Count/group/aggregate
    │    │    • Calculate percentages
    │    │
    │    └─ 3. Format Results
    │         • With emojis
    │         • With breakdowns
    │         • Suggest Analytics page
    │
    ├─ PLATFORM_HELP
    │    │
    │    ├─ 1. Detect Topic
    │    │    • search
    │    │    • compare
    │    │    • analytics
    │    │    • suggest
    │    │    • language
    │    │
    │    └─ 2. Return Guide
    │         • Step-by-step
    │         • Examples
    │         • Tips
    │
    ├─ TOOL_DETAILS
    │    │
    │    ├─ 1. Find Tool
    │    │    • Match by name
    │    │
    │    ├─ 2. Extract All Info
    │    │    • Description
    │    │    • Capabilities
    │    │    • Access/Cost
    │    │    • Links
    │    │
    │    └─ 3. Format Detailed View
    │         • Comprehensive info
    │         • All capabilities
    │         • Quick links
    │
    ├─ GREETING
    │    │
    │    └─ Random Greeting
    │         • 3 variations
    │         • List capabilities
    │         • Ask how to help
    │
    └─ GENERAL_QUESTION
         │
         ├─ Detect Topic
         │    • AI basics
         │    • ML concepts
         │    • Sanofi strategy
         │
         └─ Educational Response
              • Explain concept
              • Sanofi context
              • Encourage exploration
```

---

**Architecture built for:**
- ✅ Scalability (easy to add new intents/handlers)
- ✅ Maintainability (single responsibility services)
- ✅ Testability (pure functions, dependency injection)
- ✅ Performance (<200ms total processing)
- ✅ Extensibility (Phase 2 & 3 ready)
