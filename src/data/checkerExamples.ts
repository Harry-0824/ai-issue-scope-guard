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
      'Issue #12：只更新 dashboard empty-state 文案。Scope：編輯 DashboardEmptyState.vue 並更新相關 component test。Do not change routing, API calls, or package files.',
    prSummary:
      '已更新 dashboard empty-state 標題與描述，使其符合 Issue 文案，並新增針對新文案的 focused test。',
    changedFiles:
      'src/features/dashboard/DashboardEmptyState.vue\nsrc/features/dashboard/DashboardEmptyState.test.ts',
    testResult:
      'npm run test -- DashboardEmptyState.test.ts passed. npm run build passed.',
    dependencyChanges: 'No dependency changes（無 dependency 變更）。',
  },
  medium: {
    issueSpec:
      'Issue #24: 在 dashboard card 新增空狀態提示文字。Scope：只限 dashboard card empty state UI 與文案。Do not change routing, auth, data fetching, dependencies, or deployment settings.',
    prSummary:
      '已新增 dashboard card 空狀態提示文字，並調整 card spacing 與 empty state icon size。另順手 refactor dashboard card 的部分樣式命名，但未修改資料流或部署設定。',
    changedFiles:
      'src/components/dashboard/DashboardCard.vue\nsrc/components/dashboard/DashboardCard.module.css',
    testResult:
      'npm run build passed. Component tests were not run after the spacing and style naming cleanup.',
    dependencyChanges: 'No dependency changes（無 dependency 變更）。',
  },
  risky: {
    issueSpec:
      'Issue #18：在 pricing page hero 新增一個小型 CTA button。Scope：只限 pricing hero UI。Do not change auth, data fetching, dependencies, or deployment settings.',
    prSummary:
      '已新增 CTA button，同時 refactored auth setup、added analytics package、changed deployment env handling，並 rewired pricing data loading。',
    changedFiles:
      'src/pages/PricingPage.vue\nsrc/lib/authClient.ts\nsrc/services/pricingApi.ts\nnetlify.toml\npackage.json\npackage-lock.json\n.env.local',
    testResult:
      'Tests were not run. Build not verified（尚未執行 build / test 驗證）。',
    dependencyChanges:
      'Added analytics-sdk and changed auth-related config（新增 dependency 並改動 auth 設定）。',
  },
}
