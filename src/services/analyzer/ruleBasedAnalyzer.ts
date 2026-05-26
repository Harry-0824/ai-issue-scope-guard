import { analyzerConfig, type AnalyzerRuleId } from './analyzerConfig'
import type {
  AnalyzerInput,
  AnalysisCheckResult,
  AnalysisResult,
  AnalysisRuleDetail,
} from './analyzer.types'

type RuleEvaluation = {
  checkResult: AnalysisCheckResult
  ruleDetail: AnalysisRuleDetail
}

const ruleLabels: Record<AnalyzerRuleId, string> = {
  'scope-alignment': 'Issue 任務範圍對齊',
  'changed-files': '變更檔案範圍',
  'dependency-risk': 'Dependency 變更風險',
  'secret-risk': 'Secret / 本機設定風險',
  'test-coverage': 'build / test 驗證訊號',
}

export function analyzeScope(input: AnalyzerInput): AnalysisResult {
  const normalized = normalizeInput(input)
  const rules = [
    evaluateScopeAlignment(normalized),
    evaluateChangedFiles(normalized),
    evaluateDependencyRisk(normalized),
    evaluateSecretRisk(normalized),
    evaluateTestCoverage(normalized),
  ]

  // Analyzer 採用「100 分起扣」的 deterministic rule flow，讓每個扣分原因都能對應到 ruleDetails。
  const score = clampScore(
    analyzerConfig.baseScore +
      rules.reduce((total, rule) => total + rule.ruleDetail.impact, 0),
  )
  const risk = mapScoreToRisk(score)

  return {
    score,
    ...risk,
    checkResults: rules.map((rule) => rule.checkResult),
    reviewSummary: buildReviewSummary(
      score,
      risk.riskLabel,
      risk.suggestedAction,
      rules,
    ),
    prComment: buildPrComment(
      score,
      risk.riskLabel,
      risk.suggestedAction,
      rules,
    ),
    ruleDetails: rules.map((rule) => rule.ruleDetail),
  }
}

function normalizeInput(input: AnalyzerInput) {
  const changedFileList = input.changedFiles
    .split(/\r?\n|,/)
    .map((file) => file.trim())
    .filter(Boolean)

  return {
    issueSpec: input.issueSpec.trim(),
    prSummary: input.prSummary.trim(),
    changedFiles: input.changedFiles.trim(),
    changedFileList,
    testResult: input.testResult.trim(),
    dependencyChanges: input.dependencyChanges.trim(),
    prText: [
      input.prSummary,
      input.changedFiles,
      input.testResult,
      input.dependencyChanges,
    ]
      .join('\n')
      .toLowerCase(),
  }
}

function evaluateScopeAlignment(
  input: ReturnType<typeof normalizeInput>,
): RuleEvaluation {
  const forbiddenMatches = findForbiddenMatches(
    input.issueSpec,
    `${input.prSummary}\n${input.changedFiles}`,
  )
  const broadMatches = findMatches(
    input.prSummary,
    analyzerConfig.broadChangeTerms,
  )

  if (!input.issueSpec || !input.prSummary) {
    return createRule(
      'scope-alignment',
      'warning',
      -analyzerConfig.deductions.missingScopeInput,
      false,
      '缺少 Issue 任務範圍或 PR 摘要，因此無法確認變更是否對齊任務範圍。',
    )
  }

  if (forbiddenMatches.length > 0) {
    return createRule(
      'scope-alignment',
      'danger',
      -analyzerConfig.deductions.scopeConflict,
      false,
      `PR 內容疑似碰到 Issue 明確排除的範圍：${formatList(forbiddenMatches)}。`,
    )
  }

  if (broadMatches.length > 0) {
    return createRule(
      'scope-alignment',
      'warning',
      -10,
      false,
      `PR 摘要包含需要人工確認的廣泛變更訊號：${formatList(broadMatches)}。`,
    )
  }

  return createRule(
    'scope-alignment',
    'pass',
    0,
    true,
    'PR 摘要看起來符合 Issue 任務範圍。',
  )
}

function evaluateChangedFiles(
  input: ReturnType<typeof normalizeInput>,
): RuleEvaluation {
  const riskyFiles = input.changedFileList.filter((file) =>
    includesAny(file, [
      'package.json',
      'package-lock.json',
      'netlify.toml',
      '.env',
      'auth',
      'service',
    ]),
  )
  const forbiddenMatches = findForbiddenMatches(
    input.issueSpec,
    input.changedFiles,
  )

  if (input.changedFileList.length === 0) {
    return createRule(
      'changed-files',
      'warning',
      -analyzerConfig.deductions.missingChangedFiles,
      false,
      '變更檔案清單為空，因此無法確認檔案範圍。',
    )
  }

  if (riskyFiles.length > 0 || forbiddenMatches.length > 0) {
    return createRule(
      'changed-files',
      'danger',
      -analyzerConfig.deductions.riskyChangedFiles,
      false,
      `變更檔案包含高風險或超出範圍的路徑：${formatList([
        ...riskyFiles,
        ...forbiddenMatches,
      ])}。`,
    )
  }

  return createRule(
    'changed-files',
    'pass',
    0,
    true,
    '變更檔案未出現明顯的 package、deployment、auth、service 或本機設定路徑。',
  )
}

function evaluateDependencyRisk(
  input: ReturnType<typeof normalizeInput>,
): RuleEvaluation {
  const dependencyText = `${input.dependencyChanges}\n${input.changedFiles}`
  const hasPackageFile = includesAny(input.changedFiles, [
    'package.json',
    'package-lock.json',
  ])
  const saysNoDependencies =
    /\b(no|none|not)\b.+\b(dependency|dependencies|package|packages)\b/i.test(
      input.dependencyChanges,
    )
  const dependencyMatches = findMatches(
    dependencyText,
    analyzerConfig.dependencyTerms,
  )

  if (hasPackageFile) {
    return createRule(
      'dependency-risk',
      'danger',
      -analyzerConfig.deductions.dependencyWarning,
      false,
      '變更檔案包含 package.json 或 package-lock.json。',
    )
  }

  if (!saysNoDependencies && dependencyMatches.length > 0) {
    return createRule(
      'dependency-risk',
      'warning',
      -analyzerConfig.deductions.dependencyWarning,
      false,
      `Dependency 變更說明包含 package 相關訊號：${formatList(dependencyMatches)}。`,
    )
  }

  return createRule(
    'dependency-risk',
    'pass',
    0,
    true,
    '未回報 dependency 或 package 檔案變更。',
  )
}

function evaluateSecretRisk(
  input: ReturnType<typeof normalizeInput>,
): RuleEvaluation {
  const secretMatches = findMatches(input.prText, analyzerConfig.secretTerms)

  if (secretMatches.length > 0) {
    return createRule(
      'secret-risk',
      'danger',
      -analyzerConfig.deductions.secretRisk,
      false,
      `偵測到疑似 secret 或本機設定訊號：${formatList(secretMatches)}。`,
    )
  }

  return createRule(
    'secret-risk',
    'pass',
    0,
    true,
    '未偵測到 .env、token、credential、password 或 API key 類型訊號。',
  )
}

function evaluateTestCoverage(
  input: ReturnType<typeof normalizeInput>,
): RuleEvaluation {
  const hasFailedTests = includesAny(
    input.testResult,
    analyzerConfig.failedTestTerms,
  )
  const hasMissingTests = includesAny(
    input.testResult,
    analyzerConfig.missingTestTerms,
  )
  const hasPassingSignal = includesAny(
    input.testResult,
    analyzerConfig.passTestTerms,
  )

  if (!input.testResult || hasMissingTests) {
    return createRule(
      'test-coverage',
      'warning',
      -analyzerConfig.deductions.missingTests,
      false,
      'build / test 結果顯示尚未執行或尚未驗證。',
    )
  }

  if (hasFailedTests) {
    return createRule(
      'test-coverage',
      'danger',
      -analyzerConfig.deductions.failedTests,
      false,
      'build / test 結果包含 failed 或 error 訊號。',
    )
  }

  if (hasPassingSignal) {
    return createRule(
      'test-coverage',
      'pass',
      0,
      true,
      'build / test 結果包含通過或已驗證訊號。',
    )
  }

  return createRule(
    'test-coverage',
    'warning',
    -analyzerConfig.deductions.missingTests,
    false,
    'build / test 結果已提供，但沒有清楚顯示通過驗證。',
  )
}

function createRule(
  id: AnalyzerRuleId,
  status: AnalysisCheckResult['status'],
  impact: number,
  matched: boolean,
  reason: string,
): RuleEvaluation {
  return {
    checkResult: {
      id,
      title: ruleLabels[id],
      status,
      detail: reason,
    },
    ruleDetail: {
      id,
      label: ruleLabels[id],
      matched,
      impact,
      reason,
    },
  }
}

function mapScoreToRisk(score: number) {
  const fallbackThreshold =
    analyzerConfig.riskThresholds[analyzerConfig.riskThresholds.length - 1]
  if (!fallbackThreshold) {
    throw new Error('Analyzer risk thresholds must include at least one item.')
  }

  const threshold =
    analyzerConfig.riskThresholds.find((item) => score >= item.minScore) ??
    fallbackThreshold

  return {
    riskLevel: threshold.riskLevel,
    riskLabel: threshold.riskLabel,
    riskTone: threshold.riskTone,
    suggestedActionKey: threshold.suggestedActionKey,
    suggestedAction: threshold.suggestedAction,
  }
}

function buildReviewSummary(
  score: number,
  riskLabel: string,
  suggestedAction: string,
  rules: RuleEvaluation[],
) {
  const riskyRules = rules.filter((rule) => rule.checkResult.status !== 'pass')
  if (riskyRules.length === 0) {
    return `${riskLabel}：分數 ${score}。這個 PR 看起來緊扣 Issue 任務範圍，未出現 dependency / 本機設定風險，且包含驗證結果。建議處理方式：${suggestedAction}。`
  }

  return `${riskLabel}：分數 ${score}。需要人工確認的項目：${formatList(
    riskyRules.map((rule) => rule.checkResult.title),
  )}。建議處理方式：${suggestedAction}。`
}

function buildPrComment(
  score: number,
  riskLabel: string,
  suggestedAction: string,
  rules: RuleEvaluation[],
) {
  const riskyRules = rules.filter((rule) => rule.checkResult.status !== 'pass')
  const riskText =
    riskyRules.length > 0
      ? `需要確認的訊號：${formatList(riskyRules.map((rule) => rule.checkResult.title))}。`
      : '未偵測到明顯的任務範圍、dependency、secret 或 build / test 風險。'

  return `Scope Guard 結果：${riskLabel} / ${suggestedAction}。分數：${score}。${riskText}`
}

function findForbiddenMatches(issueSpec: string, targetText: string) {
  const issueLower = issueSpec.toLowerCase()
  const targetLower = targetText.toLowerCase()

  // 只把 Issue 明確寫成 do not / 不要 的項目當成禁止範圍，避免 analyzer 猜測過度。
  return analyzerConfig.forbiddenIssueTerms.filter(
    (term) =>
      (issueLower.includes(`do not change ${term}`) ||
        issueLower.includes(`do not ${term}`) ||
        issueLower.includes(`不要${term}`) ||
        issueLower.includes(`不要 ${term}`)) &&
      targetLower.includes(term),
  )
}

function findMatches(text: string, terms: readonly string[]) {
  const lowerText = text.toLowerCase()
  return terms.filter((term) => lowerText.includes(term.toLowerCase()))
}

function includesAny(text: string, terms: readonly string[]) {
  return findMatches(text, terms).length > 0
}

function clampScore(score: number) {
  return Math.min(
    analyzerConfig.scoreBounds.max,
    Math.max(analyzerConfig.scoreBounds.min, score),
  )
}

function formatList(items: string[]) {
  return [...new Set(items)].join(', ')
}
