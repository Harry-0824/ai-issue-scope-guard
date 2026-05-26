import type { RiskLevel, SuggestedActionKey } from '@/types/analysis'

export type AnalyzerRuleId =
  | 'scope-alignment'
  | 'changed-files'
  | 'dependency-risk'
  | 'secret-risk'
  | 'test-coverage'

export const analyzerConfig = {
  baseScore: 100,
  scoreBounds: {
    min: 0,
    max: 100,
  },
  riskThresholds: [
    {
      minScore: 90,
      riskLevel: 'low',
      riskLabel: '低風險',
      riskTone: 'success',
      suggestedActionKey: 'ready-to-review',
      suggestedAction: '可進入審查',
    },
    {
      minScore: 70,
      riskLevel: 'medium',
      riskLabel: '中風險',
      riskTone: 'warning',
      suggestedActionKey: 'needs-manual-review',
      suggestedAction: '需要人工確認',
    },
    {
      minScore: 0,
      riskLevel: 'high',
      riskLabel: '高風險',
      riskTone: 'danger',
      suggestedActionKey: 'request-changes',
      suggestedAction: '建議要求修改',
    },
  ] satisfies Array<{
    minScore: number
    riskLevel: RiskLevel
    riskLabel: string
    riskTone: 'success' | 'warning' | 'danger'
    suggestedActionKey: SuggestedActionKey
    suggestedAction: string
  }>,
  deductions: {
    missingScopeInput: 15,
    scopeConflict: 25,
    missingChangedFiles: 10,
    riskyChangedFiles: 25,
    dependencyWarning: 18,
    secretRisk: 35,
    missingTests: 12,
    failedTests: 25,
  },
  forbiddenIssueTerms: [
    'auth',
    'api',
    'routing',
    'route',
    'dependency',
    'dependencies',
    'package',
    'deployment',
    'deploy',
    'database',
    'data fetching',
    'localStorage',
    'persistence',
  ],
  broadChangeTerms: [
    'refactor',
    'rewire',
    'rewired',
    'auth',
    'analytics',
    'deployment',
    'database',
    'data loading',
    'data fetching',
    'migration',
    'package',
  ],
  dependencyTerms: ['package.json', 'package-lock.json', 'dependency', 'dependencies', 'added', 'installed', 'sdk'],
  secretTerms: ['.env', 'env.local', 'secret', 'token', 'credential', 'password', 'api_key', 'apikey'],
  passTestTerms: ['passed', 'pass', 'build passed', 'verified'],
  missingTestTerms: ['not run', 'not verified', 'no tests', 'skipped'],
  failedTestTerms: ['failed', 'failure', 'error'],
} as const
