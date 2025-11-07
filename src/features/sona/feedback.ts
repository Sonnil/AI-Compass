import { storeFeedback } from './learning.js'
import type { FeedbackEntry } from './types'

// Lightweight client-side feedback helper module.
// Uses the existing storeFeedback(...) function (which persists to localStorage)
// and adds convenience helpers: recordThumbsDown, listFeedback, exportFeedback.

export async function recordThumbsDown(options: {
  query: string
  response: string
  reason?: string
  toolUsed?: string
  userId?: string
  messageId?: string
}) {
  const { query, response, reason, toolUsed, userId, messageId } = options

  // Use existing storeFeedback to persist basic entry
  const entry = storeFeedback(query, response, 'negative', toolUsed)

  // Now enrich the stored entry with optional metadata (reason, userId, messageId)
  try {
    const raw = localStorage.getItem('sona_feedback_history') || '[]'
    const arr: FeedbackEntry[] = JSON.parse(raw)

    // Find the feedback entry we just pushed (match by timestamp)
    const idx = arr.findIndex(e => e.timestamp === entry.timestamp && e.query === entry.query && e.response === entry.response)
    if (idx !== -1) {
      const updated: FeedbackEntry = { ...arr[idx], reason, messageId, userId }
      arr[idx] = updated
      // Save back
      localStorage.setItem('sona_feedback_history', JSON.stringify(arr))
      return updated
    }

    // If not found (unexpected), append a richer entry and save
    const fallback: FeedbackEntry = { ...entry, reason, messageId, userId }
    arr.push(fallback)
    localStorage.setItem('sona_feedback_history', JSON.stringify(arr))
    return fallback
  } catch (err) {
    // In case of JSON parse errors, return the original entry
    return entry
  }
}

export function listFeedback(): FeedbackEntry[] {
  try {
    return JSON.parse(localStorage.getItem('sona_feedback_history') || '[]') as FeedbackEntry[]
  } catch (err) {
    return []
  }
}

// Trigger a client-side download of the stored feedback as JSON. Meant for admin review.
export function exportFeedback(filename = 'sona_feedback_export.json') {
  const data = listFeedback()
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    return false
  }
}

export default { recordThumbsDown, listFeedback, exportFeedback }
