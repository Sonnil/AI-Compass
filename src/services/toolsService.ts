import type { Tool } from '../types';

interface ToolsFeed {
  lastUpdated: string;
  totalTools: number;
  tools: Tool[];
}

export async function loadToolsFeed(): Promise<Tool[]> {
  const startTime = performance.now();
  
  try {
    console.log('[ToolsService] Fetching tools feed...');
    
    // In development, this path works because the public folder is served at the root.
    // For production with a base path like /AI-Compass/, we might need to adjust this path
    // or use an absolute path if the base path is configured in vite.config.ts.
    const response = await fetch('/AI-Compass/ai-tools-feed.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const feed: ToolsFeed = await response.json();
    
    const duration = performance.now() - startTime;
    console.log(`[ToolsService] Loaded ${feed.totalTools} tools in ${duration.toFixed(0)}ms`);
    console.log(`[ToolsService] Last updated: ${feed.lastUpdated}`);
    
    return feed.tools;
    
  } catch (error) {
    console.error('[ToolsService] Failed to load tools feed:', error);
    
    // Fallback to empty array or show error
    throw error;
  }
}
