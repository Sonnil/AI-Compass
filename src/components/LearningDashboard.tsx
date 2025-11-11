/**
 * Learning Dashboard Component
 * 
 * Displays SONA's learning analytics and personalization insights
 */

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Target,
  Award,
  Download,
  X
} from 'lucide-react'
import type { UserInteraction, UserPreference, LearningModel } from '../services/learning/learningService'

interface LearningDashboardProps {
  interactions: UserInteraction[]
  preferences: UserPreference
  model: LearningModel
  onClose: () => void
  onExportData: () => void
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  interactions,
  preferences,
  model,
  onClose,
  onExportData
}) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalInteractions = interactions.length
    const withFeedback = interactions.filter(i => i.feedback).length
    const avgSatisfaction = interactions
      .filter(i => i.userSatisfaction !== undefined)
      .reduce((sum, i) => sum + (i.userSatisfaction || 0), 0) / Math.max(1, withFeedback)
    
    const intentAccuracy = Object.values(model.intentAccuracy)
      .reduce((sum, val) => sum + val, 0) / Math.max(1, Object.keys(model.intentAccuracy).length)
    
    const toolSuccessRate = Object.values(model.toolRecommendationSuccess)
      .reduce((sum, val) => sum + val, 0) / Math.max(1, Object.keys(model.toolRecommendationSuccess).length)

    return {
      totalInteractions,
      withFeedback,
      feedbackRate: totalInteractions > 0 ? (withFeedback / totalInteractions * 100) : 0,
      avgSatisfaction,
      intentAccuracy: intentAccuracy * 100,
      toolSuccessRate: toolSuccessRate * 100
    }
  }, [interactions, model])

  // Top intents
  const topIntents = useMemo(() => {
    const intentCounts: Record<string, number> = {}
    interactions.forEach(i => {
      intentCounts[i.intent] = (intentCounts[i.intent] || 0) + 1
    })
    return Object.entries(intentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([intent, count]) => ({
        intent,
        count,
        percentage: (count / interactions.length * 100).toFixed(1)
      }))
  }, [interactions])

  // Top tools
  const topTools = useMemo(() => {
    const toolCounts: Record<string, number> = {}
    interactions.forEach(i => {
      const tools = i.toolsRecommended || []
      tools.forEach(tool => {
        toolCounts[tool] = (toolCounts[tool] || 0) + 1
      })
    })
    return Object.entries(toolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tool, count]) => ({
        tool,
        count
      }))
  }, [interactions])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Learning Dashboard
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SONA's learning insights and personalization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportData}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Export learning data"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <MetricCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="Total Interactions"
              value={stats.totalInteractions}
              subtitle={`${stats.feedbackRate.toFixed(0)}% with feedback`}
              color="blue"
            />
            <MetricCard
              icon={<ThumbsUp className="w-5 h-5" />}
              title="Avg Satisfaction"
              value={stats.avgSatisfaction.toFixed(1)}
              subtitle="out of 5.0"
              color="green"
            />
            <MetricCard
              icon={<Target className="w-5 h-5" />}
              title="Intent Accuracy"
              value={`${stats.intentAccuracy.toFixed(0)}%`}
              subtitle="classification accuracy"
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Preferences */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                User Preferences
              </h3>
              <div className="space-y-3">
                <PreferenceItem
                  label="Preferred Tool Types"
                  value={preferences.preferredToolTypes.join(', ') || 'Not set'}
                />
                <PreferenceItem
                  label="Favorite Features"
                  value={preferences.preferredFeatures.join(', ') || 'Not set'}
                />
                <PreferenceItem
                  label="Learning Style"
                  value={preferences.learningStyle || 'Not set'}
                />
                <PreferenceItem
                  label="Expertise Level"
                  value={preferences.expertiseLevel || 'intermediate'}
                />
              </div>
            </div>

            {/* Top Intents */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Top Intents
              </h3>
              <div className="space-y-2">
                {topIntents.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {item.intent.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
                {topIntents.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    No interaction data yet
                  </p>
                )}
              </div>
            </div>

            {/* Top Recommended Tools */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-500" />
                Top Recommendations
              </h3>
              <div className="space-y-2">
                {topTools.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.tool}
                    </span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {item.count}x
                    </span>
                  </div>
                ))}
                {topTools.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    No recommendations yet
                  </p>
                )}
              </div>
            </div>

            {/* Model Performance */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Model Performance
              </h3>
              <div className="space-y-3">
                <PerformanceBar
                  label="Tool Success Rate"
                  value={stats.toolSuccessRate}
                  color="bg-green-500"
                />
                <PerformanceBar
                  label="Intent Accuracy"
                  value={stats.intentAccuracy}
                  color="bg-blue-500"
                />
                <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Misclassifications: {model.commonMisclassifications.length}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Total interactions tracked: {stats.totalInteractions}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Misclassifications */}
          {model.commonMisclassifications.length > 0 && (
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Recent Misclassifications (for improvement)
              </h3>
              <div className="space-y-2">
                {model.commonMisclassifications.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Query:</strong> "{item.query}"
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Expected: <span className="font-medium">{item.expectedIntent}</span> | 
                      Actual: <span className="font-medium">{item.actualIntent}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Helper Components
interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  subtitle: string
  color: 'blue' | 'green' | 'purple'
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-2`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
    </div>
  )
}

interface PreferenceItemProps {
  label: string
  value: string
}

const PreferenceItem: React.FC<PreferenceItemProps> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
    <p className="text-sm text-gray-900 dark:text-white capitalize">{value}</p>
  </div>
)

interface PerformanceBarProps {
  label: string
  value: number
  color: string
}

const PerformanceBar: React.FC<PerformanceBarProps> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {value.toFixed(0)}%
      </span>
    </div>
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
)

export default LearningDashboard
