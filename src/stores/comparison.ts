import { create } from 'zustand'
import { Tool } from '@/types'

interface ComparisonState {
  items: Tool[]
  isOpen: boolean
  add: (tool: Tool) => void
  remove: (toolId: string) => void
  toggle: () => void
  clear: () => void
}

export const useComparisonStore = create<ComparisonState>((set) => ({
  items: [],
  isOpen: false,
  add: (tool) =>
    set((state) => {
      if (state.items.length >= 4) return state // Limit to 4 items
      const toolIdentifier = tool.id || tool.name;
      if (state.items.some((item) => (item.id || item.name) === toolIdentifier)) return state // Avoid duplicates
      return { items: [...state.items, tool] }
    }),
  remove: (toolId) =>
    set((state) => ({
      items: state.items.filter((item) => (item.id || item.name) !== toolId),
    })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  clear: () => set({ items: [] }),
}))
