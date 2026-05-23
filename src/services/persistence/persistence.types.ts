import type { AnalysisResult } from '@/types/analysis'
import type { CheckerExampleKey, CheckerInput } from '@/types/checker'

export type LastAnalysisSnapshot = {
  input: CheckerInput
  result: AnalysisResult
  selectedExample: CheckerExampleKey | null
}
