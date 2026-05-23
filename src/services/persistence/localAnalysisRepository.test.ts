import { checkerExamples } from '@/data/checkerExamples'
import { analyzeScope } from '@/services/analyzer'

import {
  LAST_ANALYSIS_STORAGE_KEY,
  clearLastAnalysis,
  getLastAnalysis,
  saveLastAnalysis,
} from './localAnalysisRepository'

describe('localAnalysisRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and restores only the latest analysis snapshot', () => {
    const goodResult = analyzeScope(checkerExamples.good)
    const riskyResult = analyzeScope(checkerExamples.risky)

    saveLastAnalysis({
      input: checkerExamples.good,
      result: goodResult,
      selectedExample: 'good',
    })
    saveLastAnalysis({
      input: checkerExamples.risky,
      result: riskyResult,
      selectedExample: 'risky',
    })

    expect(getLastAnalysis()).toMatchObject({
      input: checkerExamples.risky,
      result: {
        riskLevel: 'high',
      },
      selectedExample: 'risky',
    })
  })

  it('returns null for malformed persisted data', () => {
    localStorage.setItem(LAST_ANALYSIS_STORAGE_KEY, 'not-json')

    expect(getLastAnalysis()).toBeNull()
  })

  it('clears the latest analysis snapshot', () => {
    saveLastAnalysis({
      input: checkerExamples.good,
      result: analyzeScope(checkerExamples.good),
      selectedExample: 'good',
    })

    clearLastAnalysis()

    expect(localStorage.getItem(LAST_ANALYSIS_STORAGE_KEY)).toBeNull()
    expect(getLastAnalysis()).toBeNull()
  })
})
