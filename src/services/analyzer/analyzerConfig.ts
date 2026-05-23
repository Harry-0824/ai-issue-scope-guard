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
      riskLabel: 'Low Risk',
      riskTone: 'success',
      suggestedActionKey: 'ready-to-review',
      suggestedAction: 'Ready to Review',
    },
    {
      minScore: 70,
      riskLevel: 'medium',
      riskLabel: 'Medium Risk',
      riskTone: 'warning',
      suggestedActionKey: 'needs-manual-review',
      suggestedAction: 'Needs Manual Review',
    },
    {
      minScore: 0,
      riskLevel: 'high',
      riskLabel: 'High Risk',
      riskTone: 'danger',
      suggestedActionKey: 'request-changes',
      suggestedAction: 'Request Changes',
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
