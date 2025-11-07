// Resolve asset URLs so they work with Vite's BASE_URL (important for GitHub Pages)
export function resolveLogoUrl(url?: string): string | undefined {
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
