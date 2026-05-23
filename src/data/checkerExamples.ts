export type CheckerExampleKey = 'good' | 'risky'

export type CheckerInput = {
  issueSpec: string
  prSummary: string
  changedFiles: string
  testResult: string
  dependencyChanges: string
}

export type DemoCheckResult = {
  id: string
  title: string
  status: 'pass' | 'warning' | 'danger'
  detail: string
}

export type DemoRuleDetail = {
  id: string
  label: string
  matched: boolean
  reason: string
}

export type DemoAnalysisResult = {
  score: number
  riskLabel: string
  riskTone: 'success' | 'warning' | 'danger'
  suggestedAction: string
  checkResults: DemoCheckResult[]
  reviewSummary: string
  prComment: string
  ruleDetails: DemoRuleDetail[]
}

export const emptyCheckerInput: CheckerInput = {
  issueSpec: '',
  prSummary: '',
  changedFiles: '',
  testResult: '',
  dependencyChanges: '',
}

export const checkerExamples: Record<CheckerExampleKey, CheckerInput> = {
  good: {
    issueSpec:
      'Issue #12: Update dashboard empty-state copy only. Scope: edit DashboardEmptyState.vue and update the related component test. Do not change routing, API calls, or package files.',
    prSummary:
      'Updated the dashboard empty-state title and description to match the Issue copy. Added a focused test for the new copy.',
    changedFiles: 'src/features/dashboard/DashboardEmptyState.vue\nsrc/features/dashboard/DashboardEmptyState.test.ts',
    testResult: 'npm run test -- DashboardEmptyState.test.ts passed. npm run build passed.',
    dependencyChanges: 'No dependency changes.',
  },
  risky: {
    issueSpec:
      'Issue #18: Add a small CTA button to the pricing page hero. Scope: pricing hero UI only. Do not change auth, data fetching, dependencies, or deployment settings.',
    prSummary:
      'Added CTA button, refactored auth setup, added a new analytics package, changed deployment env handling, and rewired pricing data loading.',
    changedFiles:
      'src/pages/PricingPage.vue\nsrc/lib/authClient.ts\nsrc/services/pricingApi.ts\nnetlify.toml\npackage.json\npackage-lock.json\n.env.local',
    testResult: 'Tests were not run. Build not verified.',
    dependencyChanges: 'Added analytics-sdk and changed auth-related config.',
  },
}

export const demoAnalysisResults: Record<CheckerExampleKey, DemoAnalysisResult> = {
  good: {
    score: 96,
    riskLabel: 'Low Risk',
    riskTone: 'success',
    suggestedAction: 'Ready to Review',
    checkResults: [
      {
        id: 'scope',
        title: 'Scope Alignment',
        status: 'pass',
        detail: 'PR summary and changed files stay inside the copy-only dashboard empty-state request.',
      },
      {
        id: 'files',
        title: 'Changed Files',
        status: 'pass',
        detail: 'Only the target component and focused test file changed.',
      },
      {
        id: 'tests',
        title: 'Test Coverage Signal',
        status: 'pass',
        detail: 'Focused test and build were both reported as passing.',
      },
    ],
    reviewSummary:
      'This PR appears tightly scoped. The changed files match the Issue, dependency risk is low, and verification is present.',
    prComment:
      'Scope Guard result: Low Risk / Ready to Review. The PR appears limited to the requested dashboard empty-state copy and includes focused verification.',
    ruleDetails: [
      {
        id: 'no-deps',
        label: 'No dependency changes',
        matched: true,
        reason: 'Dependency Changes explicitly reports no package changes.',
      },
      {
        id: 'no-secrets',
        label: 'No secret-like files',
        matched: true,
        reason: 'Changed files do not include .env or credential-like files.',
      },
    ],
  },
  risky: {
    score: 42,
    riskLabel: 'High Risk',
    riskTone: 'danger',
    suggestedAction: 'Request Changes',
    checkResults: [
      {
        id: 'scope',
        title: 'Scope Alignment',
        status: 'danger',
        detail: 'PR summary includes auth, analytics, deployment, and data-loading work outside the CTA-only Issue.',
      },
      {
        id: 'files',
        title: 'Changed Files',
        status: 'danger',
        detail: 'Changed files include package files, deployment config, auth code, service code, and .env.local.',
      },
      {
        id: 'tests',
        title: 'Test Coverage Signal',
        status: 'warning',
        detail: 'Tests and build were not run, so reviewers have no basic verification signal.',
      },
    ],
    reviewSummary:
      'This PR likely exceeds the Issue scope. It touches auth, deployment, dependencies, and local config while the Issue only asked for a pricing hero CTA.',
    prComment:
      'Scope Guard result: High Risk / Request Changes. The PR appears to exceed the CTA-only Issue by changing auth, deployment config, dependencies, and .env.local.',
    ruleDetails: [
      {
        id: 'deps-changed',
        label: 'Dependency risk detected',
        matched: false,
        reason: 'package.json and package-lock.json changed without being requested by the Issue.',
      },
      {
        id: 'secret-file',
        label: 'Secret/local config risk',
        matched: false,
        reason: '.env.local appears in the changed files list and should not be committed.',
      },
    ],
  },
}
