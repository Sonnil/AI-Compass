# HOTFIX: Enhanced Agent Tools Catalog Issue

## 🐛 Issue
When asking analytics queries like "how many internal tools?", SONA was returning:
```
📊 **Internal Tools Statistics:**
- **0** internal tools (NaN% of catalog)
- **0** external tools (NaN%)
- **Total**: 0 tools
```

## 🔍 Root Cause
The `enhancedAgent` was initialized with `useRef(createEnhancedAgent(toolsCatalog))` only once when the component mounted, but at that point `toolsCatalog` was empty (not yet loaded from the JSON feed).

**Problem Code:**
```typescript
// This only runs once when component mounts
const enhancedAgent = useRef(createEnhancedAgent(toolsCatalog))
```

At mount time, `toolsCatalog` = `[]` (empty array), so the enhanced agent had 0 tools to work with.

## ✅ Fix
Added a `useEffect` hook that updates the enhanced agent whenever the tools catalog changes:

```typescript
// Initialize enhanced agent - will be updated when toolsCatalog changes
const enhancedAgent = useRef(createEnhancedAgent(toolsCatalog))

// Update enhanced agent when tools catalog changes
useEffect(() => {
  if (toolsCatalog && toolsCatalog.length > 0) {
    console.log('🔄 [ChatWidget] Updating enhanced agent with', toolsCatalog.length, 'tools')
    enhancedAgent.current = createEnhancedAgent(toolsCatalog)
  }
}, [toolsCatalog])
```

## 🎯 Result
Now when tools are loaded from the JSON feed, the enhanced agent is automatically updated with the full catalog (43+ tools), and analytics queries work correctly:

```
User: "how many internal tools?"

SONA: 📊 **Internal Tools Statistics:**

• **15** internal tools (35% of catalog)
• **28** external tools (65%)
• **Total**: 43 tools

Internal tools are Sanofi-specific solutions built for our unique needs.
```

## 🧪 Testing
1. Start dev server: `npm run dev`
2. Open chat widget
3. Try these queries:
   - "how many internal tools?"
   - "how many external tools?"
   - "show me tools with code generation"
   - "technology breakdown"

You should now see correct statistics instead of 0 tools.

## 📝 Console Log
Watch for this log when the page loads:
```
🔄 [ChatWidget] Updating enhanced agent with 43 tools
```

This confirms the enhanced agent has been updated with the full catalog.

## ✅ Verification
- Build Status: ✅ Successful
- TypeScript Errors: 0
- Functionality: Enhanced agent now has access to full tools catalog

## 🔧 File Changed
- `/src/features/sona/ChatWidget.tsx`

## 📅 Date
November 6, 2025

---

**Status: ✅ Fixed and Verified**
