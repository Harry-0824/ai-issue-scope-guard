import { createPinia, setActivePinia } from 'pinia'

import { checkerExamples } from '@/data/checkerExamples'
import { LAST_ANALYSIS_STORAGE_KEY } from '@/services/persistence'

import { useAnalysisStore } from './analysisStore'

describe('analysisStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('loads examples, updates input fields, and runs analyzer', () => {
    const store = useAnalysisStore()

    store.loadExample('good')
    expect(store.selectedExample).toBe('good')
    expect(store.input.issueSpec).toContain('Issue #12')

    store.updateField('prSummary', 'Manual PR summary update.')
    expect(store.input.prSummary).toBe('Manual PR summary update.')

    store.runAnalyzer()
    expect(store.activeResult?.riskLevel).toBe('low')
    expect(localStorage.getItem(LAST_ANALYSIS_STORAGE_KEY)).toContain(
      'Manual PR summary update.',
    )
  })

  it('restores the latest saved analysis into store state', () => {
    const firstStore = useAnalysisStore()
    firstStore.loadExample('risky')
    firstStore.runAnalyzer()

    setActivePinia(createPinia())
    const restoredStore = useAnalysisStore()
    restoredStore.loadLastAnalysis()

    expect(restoredStore.selectedExample).toBe('risky')
    expect(restoredStore.input.changedFiles).toContain('.env.local')
    expect(restoredStore.activeResult?.riskLevel).toBe('high')
  })

  it('clears current state and removes persisted latest analysis', () => {
    const store = useAnalysisStore()
    store.loadExample('good')
    store.runAnalyzer()

    store.clearCurrentState()

    expect(store.input.issueSpec).toBe('')
    expect(store.activeResult).toBeNull()
    expect(store.selectedExample).toBeNull()
    expect(localStorage.getItem(LAST_ANALYSIS_STORAGE_KEY)).toBeNull()
  })
})
