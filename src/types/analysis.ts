export type RiskLevel = 'low' | 'medium' | 'high'

export type SuggestedActionKey = 'ready-to-review' | 'needs-manual-review' | 'request-changes'

export type AnalysisTone = 'success' | 'warning' | 'danger'

export type CheckResultStatus = 'pass' | 'warning' | 'danger'

export type AnalysisCheckResult = {
  id: string
  title: string
  status: CheckResultStatus
  detail: string
}

export type AnalysisRuleDetail = {
  id: string
  label: string
  matched: boolean
  impact: number
  reason: string
}

export type AnalysisResult = {
  score: number
  riskLevel: RiskLevel
  riskLabel: string
  riskTone: AnalysisTone
  suggestedActionKey: SuggestedActionKey
  suggestedAction: string
  checkResults: AnalysisCheckResult[]
  reviewSummary: string
  prComment: string
  ruleDetails: AnalysisRuleDetail[]
}
