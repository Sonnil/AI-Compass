/**
 * Feedback Panel Component
 * 
 * Allows users to provide feedback on SONA responses to improve learning
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, ThumbsDown, MessageSquare, X, Check } from 'lucide-react'

export interface FeedbackData {
  helpful: boolean
  satisfaction: number // 1-5
  comment?: string
  toolsUsed?: string[]
}

interface FeedbackPanelProps {
  messageId: string
  onFeedbackSubmit: (feedback: FeedbackData) => void
  className?: string
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  messageId,
  onFeedbackSubmit,
  className = ''
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const [helpful, setHelpful] = useState<boolean | null>(null)
  const [satisfaction, setSatisfaction] = useState<number>(0)
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleQuickFeedback = (isHelpful: boolean) => {
    setHelpful(isHelpful)
    setFeedbackGiven(true)
    
    // If negative feedback, show detailed form
    if (!isHelpful) {
      setShowDetailedFeedback(true)
    } else {
      // For positive feedback, submit immediately with default satisfaction
      const feedback: FeedbackData = {
        helpful: true,
        satisfaction: 4, // Default good rating
      }
      onFeedbackSubmit(feedback)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 2000)
    }
  }

  const handleDetailedSubmit = () => {
    const feedback: FeedbackData = {
      helpful: helpful || false,
      satisfaction: satisfaction || 3,
      comment: comment.trim() || undefined,
    }
    onFeedbackSubmit(feedback)
    setSubmitted(true)
    setShowDetailedFeedback(false)
    setTimeout(() => {
      setSubmitted(false)
      setComment('')
      setSatisfaction(0)
    }, 2000)
  }

  const handleCancel = () => {
    setShowDetailedFeedback(false)
    setComment('')
    setSatisfaction(0)
    setFeedbackGiven(false)
    setHelpful(null)
  }

  return (
    <div className={`feedback-panel ${className}`}>
      {!feedbackGiven && !submitted && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
        >
          <span>Was this helpful?</span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickFeedback(true)}
              className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              title="Helpful"
            >
              <ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickFeedback(false)}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Not helpful"
            >
              <ThumbsDown className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
        >
          <Check className="w-4 h-4" />
          <span>Thank you for your feedback!</span>
        </motion.div>
      )}

      <AnimatePresence>
        {showDetailedFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <MessageSquare className="w-4 h-4" />
                <span>Help us improve</span>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Satisfaction Rating */}
            <div className="mb-3">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                How would you rate this response?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSatisfaction(rating)}
                    className={`w-10 h-10 rounded-full border-2 transition-colors ${
                      satisfaction >= rating
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                    }`}
                  >
                    {rating}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                <span>Not good</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-3">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                What could be better? (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what went wrong or how we can improve..."
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDetailedSubmit}
                disabled={satisfaction === 0}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
