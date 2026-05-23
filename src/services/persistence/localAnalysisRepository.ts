import type { LastAnalysisSnapshot } from './persistence.types'

export const LAST_ANALYSIS_STORAGE_KEY = 'ai-issue-scope-guard:last-analysis'

export function getLastAnalysis(): LastAnalysisSnapshot | null {
  const rawSnapshot = localStorage.getItem(LAST_ANALYSIS_STORAGE_KEY)
  if (!rawSnapshot) return null

  try {
    const snapshot = JSON.parse(rawSnapshot) as LastAnalysisSnapshot
    if (!isLastAnalysisSnapshot(snapshot)) return null
    return snapshot
  } catch {
    return null
  }
}

export function saveLastAnalysis(snapshot: LastAnalysisSnapshot) {
  // 這裡只存「最後一次分析」，避免把 localStorage 變成多筆 history 或資料庫替代品。
  localStorage.setItem(LAST_ANALYSIS_STORAGE_KEY, JSON.stringify(snapshot))
}

export function clearLastAnalysis() {
  localStorage.removeItem(LAST_ANALYSIS_STORAGE_KEY)
}

function isLastAnalysisSnapshot(value: LastAnalysisSnapshot | null): value is LastAnalysisSnapshot {
  return Boolean(
    value &&
      typeof value === 'object' &&
      value.input &&
      typeof value.input.issueSpec === 'string' &&
      value.result &&
      typeof value.result.score === 'number',
  )
}
