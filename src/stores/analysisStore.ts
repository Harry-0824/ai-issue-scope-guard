import { defineStore } from 'pinia'

import { checkerExamples, emptyCheckerInput } from '@/data/checkerExamples'
import { analyzeScope } from '@/services/analyzer'
import {
  clearLastAnalysis,
  getLastAnalysis,
  saveLastAnalysis,
} from '@/services/persistence'
import type { AnalysisResult } from '@/types/analysis'
import type { CheckerExampleKey, CheckerInput } from '@/types/checker'

type AnalysisStoreState = {
  input: CheckerInput
  activeResult: AnalysisResult | null
  selectedExample: CheckerExampleKey | null
  hasLoadedLastAnalysis: boolean
}

function createEmptyInput(): CheckerInput {
  return { ...emptyCheckerInput }
}

export const useAnalysisStore = defineStore('analysis', {
  state: (): AnalysisStoreState => ({
    input: createEmptyInput(),
    activeResult: null,
    selectedExample: null,
    hasLoadedLastAnalysis: false,
  }),
  actions: {
    loadExample(example: CheckerExampleKey) {
      this.selectedExample = example
      this.activeResult = null
      // Pinia state 是可響應物件；用整包替換可以讓表單欄位跟著 example 一次更新。
      this.input = { ...checkerExamples[example] }
    },
    updateField(field: keyof CheckerInput, value: string) {
      this.input[field] = value
      this.activeResult = null
    },
    runAnalyzer() {
      // Store action 統一負責呼叫 analyzer，讓 Vue component 只處理畫面與事件轉接。
      const result = analyzeScope({ ...this.input })
      this.activeResult = result
      saveLastAnalysis({
        input: { ...this.input },
        result,
        selectedExample: this.selectedExample,
      })
    },
    clearCurrentState() {
      this.input = createEmptyInput()
      this.activeResult = null
      this.selectedExample = null
      clearLastAnalysis()
    },
    loadLastAnalysis() {
      if (this.hasLoadedLastAnalysis) return
      this.hasLoadedLastAnalysis = true

      // localStorage restore 只在初始化時做一次，避免覆蓋使用者已經開始編輯的表單。
      const snapshot = getLastAnalysis()
      if (!snapshot) return

      this.input = { ...snapshot.input }
      this.activeResult = snapshot.result
      this.selectedExample = snapshot.selectedExample
    },
  },
})
