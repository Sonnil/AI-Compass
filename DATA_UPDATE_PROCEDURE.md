# AI-COMPASS Data Update Procedure

## Overview
This document provides a step-by-step procedure for updating the AI tools catalog in AI-COMPASS. Follow these instructions to ensure consistent data updates and maintain data integrity.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Access to the AI-COMPASS repository
- ✅ Node.js installed (for running the generation script)
- ✅ A code editor (VS Code recommended)
- ✅ The new tool data prepared in the correct format

---

## 🎯 Data Format Requirements

Each tool entry must include the following fields:

```json
{
  "name": "Tool Name",
  "type": "internal" | "external",
  "primaryPurpose": "Short one-line description (shown on card front)",
  "targetUsers": "Who should use this tool",
  "technology": "Underlying technology or platform",
  "bestUseCase": "When to use this tool",
  "cost": "Pricing or access information",
  "realTimeWebSearch": true | false,
  "codeGeneration": true | false,
  "imageGeneration": true | false,
  "accessLink": "https://tool-url.com",
  "salesDescription": "Longer marketing description highlighting value proposition and benefits (shown on card front below primaryPurpose)",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `name` | string | ✅ Yes | Tool name | "Concierge" |
| `type` | string | ✅ Yes | `"internal"` or `"external"` | "internal" |
| `primaryPurpose` | string | ✅ Yes | Short description (1 sentence) | "AI-powered employee assistant" |
| `targetUsers` | string | ✅ Yes | Target audience | "All Sanofi employees" |
| `technology` | string | ✅ Yes | Tech stack or platform | "GenAI Platform" |
| `bestUseCase` | string | ✅ Yes | Ideal use case | "Employee support, HR queries" |
| `cost` | string | ✅ Yes | Pricing info | "Free for all employees" |
| `realTimeWebSearch` | boolean | ✅ Yes | Web search capability | true |
| `codeGeneration` | boolean | ✅ Yes | Code generation capability | false |
| `imageGeneration` | boolean | ✅ Yes | Image generation capability | false |
| `accessLink` | string | ✅ Yes | Tool URL or access point | "https://tool.com" |
| `salesDescription` | string | ✅ Yes | Marketing pitch (2-3 sentences) | "Concierge transforms employee productivity..." |
| `tags` | array | ✅ Yes | Categories/keywords | ["internal", "genai", "top30"] |

---

## 🔄 Update Procedure

### Step 1: Prepare Your Data

1. **Collect tool information** from stakeholders or data sources
2. **Format the data** according to the JSON structure above
3. **Validate required fields** - ensure all required fields are present
4. **Check for consistency** - verify naming conventions and formats

### Step 2: Update the Master Script

1. **Open** `/Users/leso01/Documents/AI-COMPASS/scripts/generate-feed.mjs`

2. **Locate** the `curated` array (around line 80)

3. **Important Rules:**
   - **AI-COMPASS tool**: Always keep as the first entry - DO NOT remove or modify unless specifically updating AI-COMPASS itself
   - **Add new tools**: Insert after AI-COMPASS entry
   - **Update existing tools**: Find by name and replace the entire entry
   - **Remove tools**: Delete the entire tool object

4. **Example: Adding a New Tool**

```javascript
const curated = [
  // AI-COMPASS - always first
  {
    name: 'AI-COMPASS',
    // ... existing AI-COMPASS data
  },
  // Add new tool here
  {
    name: 'New Tool Name',
    type: 'internal',
    primaryPurpose: 'Tool description',
    targetUsers: 'Target users',
    technology: 'Technology',
    bestUseCase: 'Best use case',
    cost: 'Cost info',
    realTimeWebSearch: false,
    codeGeneration: false,
    imageGeneration: false,
    accessLink: 'https://tool-url.com',
    salesDescription: 'Marketing description highlighting value and benefits.',
    tags: ['internal', 'category1', 'category2']
  },
  // Existing tools follow...
  {
    name: 'Concierge',
    // ...
  }
]
```

5. **Example: Updating an Existing Tool**

Find the tool by name and replace its entire entry:

```javascript
// Before
{
  name: 'Concierge',
  primaryPurpose: 'Old description',
  // ... old fields
}

// After
{
  name: 'Concierge',
  primaryPurpose: 'Updated description',
  salesDescription: 'New marketing pitch',
  // ... updated fields
}
```

6. **Example: Removing a Tool**

Simply delete the entire tool object from the array:

```javascript
// Delete this entire block
{
  name: 'Tool to Remove',
  type: 'internal',
  // ... all fields
},
```

### Step 3: Regenerate the Feed

1. **Open terminal** in the project directory:
   ```bash
   cd /Users/leso01/Documents/AI-COMPASS
   ```

2. **Run the generation script**:
   ```bash
   node scripts/generate-feed.mjs
   ```

3. **Verify success** - you should see:
   ```
   Wrote XX tools → public/ai-tools-feed.json
   ```

### Step 4: Verify the Output

1. **Open** `public/ai-tools-feed.json`

2. **Check**:
   - ✅ Tool count is correct (`"totalTools": XX`)
   - ✅ AI-COMPASS is the first tool
   - ✅ All new/updated tools are present
   - ✅ `salesDescription` field exists for tools that need it
   - ✅ All required fields are present
   - ✅ No JSON syntax errors

3. **Optional: View in browser**
   - If dev server is running, refresh the page
   - New tools should appear in the catalog
   - Card fronts should show both `primaryPurpose` and `salesDescription`

### Step 5: Test the Application

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Test in browser**:
   - ✅ Verify tool cards display correctly
   - ✅ Check that `primaryPurpose` appears (bold)
   - ✅ Check that `salesDescription` appears (regular text)
   - ✅ Verify tags are visible
   - ✅ Test search functionality
   - ✅ Test filtering by type/tags
   - ✅ Test comparison feature

---

## 🎨 Card Display Format

The tool cards display information in this order:

### Front of Card:
```
┌─────────────────────────────┐
│ [Logo]  Tool Name    [Type] │
├─────────────────────────────┤
│ primaryPurpose (bold)       │
│                             │
│ salesDescription (regular)  │
│                             │
│ #tag1 #tag2 #tag3          │
└─────────────────────────────┘
```

### Back of Card:
```
┌─────────────────────────────┐
│ Target Users: value         │
│ Best Use Case: value        │
│ Technology: value           │
│ Cost: value                 │
│ Web Search: ✓/✗            │
│ Code Gen: ✓/✗              │
│ Image Gen: ✓/✗             │
└─────────────────────────────┘
```

---

## 🔍 Common Scenarios

### Scenario 1: Bulk Update (Multiple Tools)

1. Prepare all tool data in a single JSON array
2. Copy the entire array
3. In `generate-feed.mjs`, replace all entries after AI-COMPASS
4. Run generation script
5. Verify output

### Scenario 2: Single Tool Update

1. Find the specific tool in `generate-feed.mjs`
2. Update only the changed fields
3. Keep all other fields unchanged
4. Run generation script
5. Verify output

### Scenario 3: Adding External Tools

1. Set `"type": "external"`
2. Use full public URLs for `accessLink`
3. Include appropriate tags: `["external", "category", ...]`
4. Add to curated array in appropriate position
5. Run generation script

### Scenario 4: Updating AI-COMPASS

1. **Special care required** - this is the platform's own entry
2. Update the hardcoded entry at the top of `curated` array
3. Do NOT use the spread operator `...(aiCompass ? [aiCompass] : [])`
4. Ensure all required fields are present
5. Run generation script
6. Thoroughly test the application

---

## ⚠️ Important Notes

### Critical Rules:
- 🚨 **ALWAYS** keep AI-COMPASS as the first entry
- 🚨 **NEVER** delete the AI-COMPASS entry
- 🚨 **ALWAYS** regenerate the feed after editing the script
- 🚨 **ALWAYS** verify the output JSON file after generation

### Data Integrity:
- Use consistent naming conventions
- Maintain tag consistency across similar tools
- Keep `primaryPurpose` concise (1 sentence max)
- Make `salesDescription` compelling (2-3 sentences)
- Ensure URLs are valid and accessible
- Use proper boolean values (not strings)

### Performance Considerations:
- Keep the total number of tools reasonable (< 100 recommended)
- Use descriptive but concise tags
- Avoid very long descriptions that could affect card layout

---

## 🐛 Troubleshooting

### Issue: Script fails to run
**Solution:**
```bash
# Check Node.js is installed
node --version

# Reinstall dependencies
npm install
```

### Issue: JSON syntax errors
**Solution:**
- Check for missing commas between objects
- Verify all strings use double quotes
- Ensure no trailing commas in arrays/objects
- Use a JSON validator: https://jsonlint.com/

### Issue: Tool not appearing in UI
**Solution:**
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Check browser console for errors
4. Verify tool exists in `public/ai-tools-feed.json`
5. Ensure required fields are present

### Issue: Card layout broken
**Solution:**
- Check that `salesDescription` isn't too long
- Verify all fields use correct data types
- Ensure tags array isn't empty
- Check for special characters that need escaping

---

## 📝 Checklist Template

Use this checklist when updating data:

```markdown
- [ ] Data collected and formatted
- [ ] AI-COMPASS entry preserved as first item
- [ ] All required fields present for each tool
- [ ] Boolean fields use true/false (not strings)
- [ ] URLs are valid and accessible
- [ ] Tags are consistent and descriptive
- [ ] Opened generate-feed.mjs
- [ ] Made changes to curated array
- [ ] Saved changes
- [ ] Ran: node scripts/generate-feed.mjs
- [ ] Verified success message
- [ ] Checked public/ai-tools-feed.json
- [ ] Verified tool count is correct
- [ ] Started dev server
- [ ] Tested in browser
- [ ] Verified card display (front & back)
- [ ] Tested search functionality
- [ ] Tested filtering
- [ ] Tested comparison
- [ ] Committed changes to git (if applicable)
```

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `scripts/generate-feed.mjs` | Master data source - edit this file |
| `public/ai-tools-feed.json` | Generated output - DO NOT edit directly |
| `src/types.ts` | TypeScript type definitions |
| `src/components/ToolCard.tsx` | Card display component |
| `src/services/toolsService.ts` | Data loading service |

---

## 📞 Support

If you encounter issues:
1. Check this procedure document
2. Review the troubleshooting section
3. Check the browser console for errors
4. Contact the AI-COMPASS team: Sonnil.le@Sanofi.com

---

## 📚 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-06 | Initial procedure created |

---

**Last Updated:** November 6, 2025  
**Maintained By:** AI-COMPASS Team  
**Contact:** Sonnil Le (Sonnil.le@Sanofi.com)
