import type { CheckerExampleKey, CheckerInput } from '@/types/checker'

export type { CheckerExampleKey, CheckerInput } from '@/types/checker'

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
