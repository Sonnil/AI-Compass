
import type { FeedbackEntry } from './types';

export function extractQueryPatterns(query: string): string[] {
  const patterns: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  if (/recommend|suggest|find|need|want/i.test(query)) patterns.push('intent:recommendation');
  if (/compare|vs|versus|difference/i.test(query)) patterns.push('intent:comparison');
  if (/how|what|why|when|where/i.test(query)) patterns.push('intent:question');
  
  const domains = ['productivity', 'writing', 'data', 'collaboration', 'analysis', 'creative'];
  domains.forEach(domain => {
    if (lowerQuery.includes(domain)) patterns.push(`domain:${domain}`);
  });
  
  return patterns;
}

export function storeFeedback(query: string, response: string, feedback: 'positive' | 'negative', toolUsed?: string): FeedbackEntry {
  const feedbackEntry: FeedbackEntry = {
    query,
    response,
    feedback,
    timestamp: new Date().toISOString(),
    toolUsed,
    context: extractQueryPatterns(query).join(', ')
  };
  
  const existingFeedback = JSON.parse(localStorage.getItem('sona_feedback_history') || '[]') as FeedbackEntry[];
  existingFeedback.push(feedbackEntry);
  
  if (existingFeedback.length > 100) {
    existingFeedback.shift();
  }
  
  localStorage.setItem('sona_feedback_history', JSON.stringify(existingFeedback));
  updateLearningModel(feedbackEntry);
  return feedbackEntry;
}

function updateLearningModel(feedback: FeedbackEntry): void {
  const model = getLearningModel();
  const patterns = extractQueryPatterns(feedback.query);
  
  patterns.forEach(pattern => {
    if (feedback.feedback === 'positive') {
      model.successfulPatterns.set(pattern, (model.successfulPatterns.get(pattern) || 0) + 1);
    } else {
      model.failedPatterns.set(pattern, (model.failedPatterns.get(pattern) || 0) + 1);
    }
  });
  
  model.totalFeedback++;
  if (feedback.feedback === 'positive') {
    model.positiveCount++;
  }
  
  saveLearningModel(model);
}

function getLearningModel(): { successfulPatterns: Map<string, number>, failedPatterns: Map<string, number>, totalFeedback: number, positiveCount: number } {
  const stored = localStorage.getItem('sona_learning_model');
  if (stored) {
    const parsed = JSON.parse(stored);
    return {
      successfulPatterns: new Map(Object.entries(parsed.successfulPatterns || {})),
      failedPatterns: new Map(Object.entries(parsed.failedPatterns || {})),
      totalFeedback: parsed.totalFeedback || 0,
      positiveCount: parsed.positiveCount || 0,
    };
  }
  return {
    successfulPatterns: new Map(),
    failedPatterns: new Map(),
    totalFeedback: 0,
    positiveCount: 0,
  };
}

function saveLearningModel(model: { successfulPatterns: Map<string, number>, failedPatterns: Map<string, number>, totalFeedback: number, positiveCount: number }): void {
  const toSave = {
    successfulPatterns: Object.fromEntries(model.successfulPatterns),
    failedPatterns: Object.fromEntries(model.failedPatterns),
    totalFeedback: model.totalFeedback,
    positiveCount: model.positiveCount,
  };
  localStorage.setItem('sona_learning_model', JSON.stringify(toSave));
}

export function getLearningInsights(): { accuracy: number, totalFeedback: number, topSuccessPatterns: string[], topFailPatterns: string[] } {
  const model = getLearningModel();
  const accuracy = model.totalFeedback > 0 ? model.positiveCount / model.totalFeedback : 0;
  
  const sortedSuccess = Array.from(model.successfulPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([pattern]) => pattern);
  
  const sortedFail = Array.from(model.failedPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([pattern]) => pattern);
  
  return {
    accuracy,
    totalFeedback: model.totalFeedback,
    topSuccessPatterns: sortedSuccess,
    topFailPatterns: sortedFail
  };
}
