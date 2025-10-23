# Google Analytics 4 Implementation for AI Compass

## Overview
AI Compass now includes comprehensive Google Analytics 4 (GA4) tracking to monitor user behavior, engagement, and tool usage patterns.

**Tracking ID:** `G-ZDNB0ZPCBZ`

## What's Being Tracked

### 1. **Page Views**
- Initial page load
- Navigation between Main, Analytics, and About views
- Automatic path and title tracking

### 2. **Tool Interactions**
- **Tool Access**: When users click access/documentation/training/support links
- **Tool Comparison**: Adding/removing tools from comparison list
- **Tool Clicks**: Any interaction with tool cards

### 3. **Search & Filtering**
- **Search Queries**: User search terms and result counts
- **Filter Usage**: Scope changes (all/internal/external)
- **Result Counts**: Number of matching tools

### 4. **UI Interactions**
- **Theme Changes**: Light/dark mode toggles
- **Language Selection**: Language preference changes
- **Welcome Popup**: Shown, closed, or action button clicked
- **Navigation**: Movement between different sections

### 5. **Feature Usage**
- **Analytics Dashboard**: Opens
- **About Section**: Views
- **Suggestion Box**: Opens
- **Chat Widget**: Interactions (tracked in ChatWidget.tsx if needed)

### 6. **External Links**
- All external link clicks with URL and link text
- Tool access URLs

## Analytics Dashboard Access

View your analytics at:
**https://analytics.google.com/analytics/web/#/p475959467**

(Replace with your actual GA4 property ID once you access Google Analytics)

## Key Metrics Available

### User Demographics
- **Geographic Location**: Country, region, city
- **Device Type**: Desktop, mobile, tablet
- **Browser**: Chrome, Firefox, Safari, Edge, etc.
- **Operating System**: Windows, macOS, iOS, Android, Linux

### Engagement Metrics
- **Page Views**: Total and unique
- **Session Duration**: Average time on site
- **Bounce Rate**: Single-page sessions
- **User Flow**: Path through the application

### Tool Insights
- **Most Accessed Tools**: Which tools get the most clicks
- **Internal vs External**: Usage patterns
- **Search Patterns**: Common search queries
- **Comparison Behavior**: Which tools are compared together

### Feature Adoption
- **Search Usage**: How often users search
- **Filter Usage**: Preference for internal/external
- **Theme Preference**: Light vs dark mode
- **Language Distribution**: Which languages are used

## Custom Events Reference

| Event Name | Parameters | Description |
|------------|------------|-------------|
| `page_view` | `page_path`, `page_title` | Page navigation |
| `tool_click` | `tool_name`, `tool_type` | Tool card interaction |
| `tool_access` | `tool_name`, `access_url` | Access link clicked |
| `search` | `search_term`, `results_count` | User search |
| `filter_used` | `filter_type`, `filter_value` | Filter application |
| `tool_added_to_compare` | `tool_name`, `tool_type` | Add to comparison |
| `tool_removed_from_compare` | `tool_name`, `tool_type` | Remove from comparison |
| `theme_change` | `theme` | Theme toggle |
| `language_change` | `language` | Language selection |
| `welcome_popup` | `action`, `content_type` | Popup interactions |
| `feature_use` | `feature_name` | Feature engagement |
| `external_link` | `link_url`, `link_text` | External navigation |

## Implementation Files

### Core Files
- **`index.html`**: GA4 script tag and initialization
- **`src/utils/analytics.ts`**: Analytics utility functions
- **`src/App.tsx`**: Tracking integration throughout UI

### Usage Example

```typescript
import * as analytics from './utils/analytics'

// Track a custom event
analytics.trackEvent('custom_event_name', {
  custom_param: 'value',
  event_category: 'Category'
})

// Track tool interaction
analytics.trackToolClick('Concierge', 'internal')

// Track search
analytics.trackSearch('productivity tools', 5)
```

## Privacy & Compliance

### Data Collection
- **Anonymous by default**: No personally identifiable information (PII) is collected
- **Geographic data**: Country/region level only (not street-level)
- **Cookie usage**: Standard GA4 cookies for session tracking

### Compliance
- GDPR compliant with proper configuration
- No sensitive Sanofi data is sent to Google Analytics
- Tool names and search queries are anonymized aggregates

### Best Practices
✅ Only track user interactions, not content
✅ Don't send authentication tokens or session IDs
✅ Use generic event names for internal tools
✅ Regularly review data retention settings in GA4

## Accessing Analytics Data

### Real-Time Reports
1. Log in to [Google Analytics](https://analytics.google.com)
2. Select AI Compass property (`G-ZDNB0ZPCBZ`)
3. Navigate to **Reports** > **Realtime**
4. See live user activity, page views, and events

### Custom Reports
Create custom reports for:
- **Tool Popularity**: Most accessed tools by type
- **Search Behavior**: Top search queries and patterns
- **User Journey**: Path from landing to tool access
- **Geographic Distribution**: Users by location
- **Device Breakdown**: Desktop vs mobile usage

### Recommended Dashboards
1. **Overview Dashboard**
   - Total visitors
   - Page views
   - Top tools
   - Geographic map

2. **Tool Analytics**
   - Tool access frequency
   - Comparison patterns
   - Internal vs external usage
   - Access link click-through rates

3. **User Engagement**
   - Average session duration
   - Pages per session
   - Feature adoption rates
   - Search usage patterns

## Troubleshooting

### Not Seeing Data?
1. **Check GA4 Property**: Ensure `G-ZDNB0ZPCBZ` is your property ID
2. **Allow 24-48 hours**: Initial data collection takes time
3. **Browser Extensions**: Ad blockers may prevent tracking
4. **Console Errors**: Check browser console for `gtag` errors

### Testing Analytics Locally
1. Open browser DevTools > Console
2. Type `window.gtag` - should return function
3. Check Network tab for requests to `google-analytics.com`
4. Use **GA Debugger** Chrome extension

### Verify Tracking
```javascript
// Open browser console and run:
window.dataLayer
// Should show array of events
```

## Future Enhancements

### Potential Additions
- [ ] Chat interaction tracking (SONA conversations)
- [ ] Heatmap integration (Microsoft Clarity)
- [ ] A/B testing for UI improvements
- [ ] Conversion funnels (landing → search → tool access)
- [ ] User segmentation (department, role, frequency)

### Advanced Analytics
- **Cohort Analysis**: User retention over time
- **Funnel Visualization**: Drop-off points in user journey
- **Event Tracking**: Detailed interaction patterns
- **Custom Dimensions**: Department, role-based tracking (if available)

## Support & Questions

For analytics-related questions:
- **Google Analytics Help**: https://support.google.com/analytics
- **GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
- **AI Compass Team**: Contact Sonnil Le (Sonnil.le@Sanofi.com)

---

**Last Updated**: October 2025
**Analytics Version**: GA4 (Google Analytics 4)
**Implementation Status**: ✅ Active
