// Google Analytics 4 Utility Functions
// Tracking ID: G-ZDNB0ZPCBZ

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Track page views
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href
    });
  }
};

/**
 * Track custom events
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...eventParams,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Track tool interactions
 */
export const trackToolClick = (toolName: string, toolType: 'internal' | 'external') => {
  trackEvent('tool_click', {
    tool_name: toolName,
    tool_type: toolType,
    event_category: 'Tool Interaction'
  });
};

/**
 * Track tool access link clicks
 */
export const trackToolAccess = (toolName: string, accessUrl: string) => {
  trackEvent('tool_access', {
    tool_name: toolName,
    access_url: accessUrl,
    event_category: 'Tool Access'
  });
};

/**
 * Track search queries
 */
export const trackSearch = (searchQuery: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchQuery,
    results_count: resultsCount,
    event_category: 'Search'
  });
};

/**
 * Track filter usage
 */
export const trackFilter = (filterType: string, filterValue: string) => {
  trackEvent('filter_used', {
    filter_type: filterType,
    filter_value: filterValue,
    event_category: 'Filter'
  });
};

/**
 * Track chat interactions with SONA
 */
export const trackChatMessage = (messageType: 'user' | 'bot', intent?: string) => {
  trackEvent('chat_message', {
    message_type: messageType,
    intent: intent || 'unknown',
    event_category: 'Chat'
  });
};

/**
 * Track chat opened/closed
 */
export const trackChatToggle = (action: 'open' | 'close') => {
  trackEvent('chat_toggle', {
    action: action,
    event_category: 'Chat'
  });
};

/**
 * Track tool comparison
 */
export const trackComparison = (toolNames: string[]) => {
  trackEvent('tool_comparison', {
    tools_compared: toolNames.join(' vs '),
    comparison_count: toolNames.length,
    event_category: 'Comparison'
  });
};

/**
 * Track view changes (grid/list)
 */
export const trackViewChange = (viewType: 'grid' | 'list') => {
  trackEvent('view_change', {
    view_type: viewType,
    event_category: 'UI Interaction'
  });
};

/**
 * Track theme changes
 */
export const trackThemeChange = (theme: 'light' | 'dark') => {
  trackEvent('theme_change', {
    theme: theme,
    event_category: 'UI Interaction'
  });
};

/**
 * Track language changes
 */
export const trackLanguageChange = (language: string) => {
  trackEvent('language_change', {
    language: language,
    event_category: 'UI Interaction'
  });
};

/**
 * Track About section views
 */
export const trackAboutView = (section: 'users' | 'stakeholders') => {
  trackEvent('about_view', {
    section: section,
    event_category: 'Navigation'
  });
};

/**
 * Track welcome popup interactions
 */
export const trackWelcomePopup = (action: 'shown' | 'closed' | 'action_clicked', contentType?: string) => {
  trackEvent('welcome_popup', {
    action: action,
    content_type: contentType,
    event_category: 'Welcome'
  });
};

/**
 * Track navigation between views
 */
export const trackNavigation = (fromView: string, toView: string) => {
  trackEvent('navigation', {
    from_view: fromView,
    to_view: toView,
    event_category: 'Navigation'
  });
};

/**
 * Track tool suggestion clicks
 */
export const trackSuggestionClick = (toolName: string, suggestionType: string) => {
  trackEvent('suggestion_click', {
    tool_name: toolName,
    suggestion_type: suggestionType,
    event_category: 'Suggestion'
  });
};

/**
 * Track errors
 */
export const trackError = (errorMessage: string, errorLocation: string) => {
  trackEvent('error', {
    error_message: errorMessage,
    error_location: errorLocation,
    event_category: 'Error'
  });
};

/**
 * Track user engagement time
 */
export const trackEngagement = (timeSpent: number, pageSection: string) => {
  trackEvent('user_engagement', {
    engagement_time_msec: timeSpent,
    page_section: pageSection,
    event_category: 'Engagement'
  });
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (url: string, linkText: string) => {
  trackEvent('external_link', {
    link_url: url,
    link_text: linkText,
    event_category: 'External Link'
  });
};

/**
 * Track feature usage
 */
export const trackFeatureUse = (featureName: string, featureDetails?: Record<string, any>) => {
  trackEvent('feature_use', {
    feature_name: featureName,
    ...featureDetails,
    event_category: 'Feature'
  });
};

export default {
  trackPageView,
  trackEvent,
  trackToolClick,
  trackToolAccess,
  trackSearch,
  trackFilter,
  trackChatMessage,
  trackChatToggle,
  trackComparison,
  trackViewChange,
  trackThemeChange,
  trackLanguageChange,
  trackAboutView,
  trackWelcomePopup,
  trackNavigation,
  trackSuggestionClick,
  trackError,
  trackEngagement,
  trackExternalLink,
  trackFeatureUse
};
