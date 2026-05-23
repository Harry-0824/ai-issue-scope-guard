import { analyzerConfig, type AnalyzerRuleId } from './analyzerConfig'
import type { AnalyzerInput, AnalysisCheckResult, AnalysisResult, AnalysisRuleDetail } from './analyzer.types'

type RuleEvaluation = {
  checkResult: AnalysisCheckResult
  ruleDetail: AnalysisRuleDetail
}

const ruleLabels: Record<AnalyzerRuleId, string> = {
  'scope-alignment': 'Scope Alignment',
  'changed-files': 'Changed Files',
  'dependency-risk': 'Dependency Risk',
  'secret-risk': 'Secret Risk',
  'test-coverage': 'Test Coverage Signal',
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
    analyzerConfig.baseScore + rules.reduce((total, rule) => total + rule.ruleDetail.impact, 0),
  )
  const risk = mapScoreToRisk(score)

  return {
    score,
    ...risk,
    checkResults: rules.map((rule) => rule.checkResult),
    reviewSummary: buildReviewSummary(score, risk.riskLabel, risk.suggestedAction, rules),
    prComment: buildPrComment(score, risk.riskLabel, risk.suggestedAction, rules),
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

function evaluateScopeAlignment(input: ReturnType<typeof normalizeInput>): RuleEvaluation {
  const forbiddenMatches = findForbiddenMatches(input.issueSpec, `${input.prSummary}\n${input.changedFiles}`)
  const broadMatches = findMatches(input.prSummary, analyzerConfig.broadChangeTerms)

  if (!input.issueSpec || !input.prSummary) {
    return createRule(
      'scope-alignment',
      'warning',
      -analyzerConfig.deductions.missingScopeInput,
      false,
      'Issue Spec or PR Summary is missing, so scope alignment cannot be confirmed.',
    )
  }

  if (forbiddenMatches.length > 0) {
    return createRule(
      'scope-alignment',
      'danger',
      -analyzerConfig.deductions.scopeConflict,
      false,
      `PR content appears to touch out-of-scope areas from the Issue: ${formatList(forbiddenMatches)}.`,
    )
  }

  if (broadMatches.length > 0) {
    return createRule(
      'scope-alignment',
      'warning',
      -10,
      false,
      `PR Summary includes broad-change signals that may need review: ${formatList(broadMatches)}.`,
    )
  }

  return createRule(
    'scope-alignment',
    'pass',
    0,
    true,
    'PR Summary appears aligned with the Issue scope.',
  )
}

function evaluateChangedFiles(input: ReturnType<typeof normalizeInput>): RuleEvaluation {
  const riskyFiles = input.changedFileList.filter((file) =>
    includesAny(file, ['package.json', 'package-lock.json', 'netlify.toml', '.env', 'auth', 'service']),
  )
  const forbiddenMatches = findForbiddenMatches(input.issueSpec, input.changedFiles)

  if (input.changedFileList.length === 0) {
    return createRule(
      'changed-files',
      'warning',
      -analyzerConfig.deductions.missingChangedFiles,
      false,
      'Changed Files is empty, so file scope cannot be verified.',
    )
  }

  if (riskyFiles.length > 0 || forbiddenMatches.length > 0) {
    return createRule(
      'changed-files',
      'danger',
      -analyzerConfig.deductions.riskyChangedFiles,
      false,
      `Changed files include risky or out-of-scope paths: ${formatList([
        ...riskyFiles,
        ...forbiddenMatches,
      ])}.`,
    )
  }

  return createRule(
    'changed-files',
    'pass',
    0,
    true,
    'Changed files do not include obvious package, deployment, auth, service, or local config paths.',
  )
}

function evaluateDependencyRisk(input: ReturnType<typeof normalizeInput>): RuleEvaluation {
  const dependencyText = `${input.dependencyChanges}\n${input.changedFiles}`
  const hasPackageFile = includesAny(input.changedFiles, ['package.json', 'package-lock.json'])
  const saysNoDependencies = /\b(no|none|not)\b.+\b(dependency|dependencies|package|packages)\b/i.test(
    input.dependencyChanges,
  )
  const dependencyMatches = findMatches(dependencyText, analyzerConfig.dependencyTerms)

  if (hasPackageFile) {
    return createRule(
      'dependency-risk',
      'danger',
      -analyzerConfig.deductions.dependencyWarning,
      false,
      'package.json or package-lock.json appears in Changed Files.',
    )
  }

  if (!saysNoDependencies && dependencyMatches.length > 0) {
    return createRule(
      'dependency-risk',
      'warning',
      -analyzerConfig.deductions.dependencyWarning,
      false,
      `Dependency Changes includes package-related signals: ${formatList(dependencyMatches)}.`,
    )
  }

  return createRule(
    'dependency-risk',
    'pass',
    0,
    true,
    'No dependency or package-file change is reported.',
  )
}

function evaluateSecretRisk(input: ReturnType<typeof normalizeInput>): RuleEvaluation {
  const secretMatches = findMatches(input.prText, analyzerConfig.secretTerms)

  if (secretMatches.length > 0) {
    return createRule(
      'secret-risk',
      'danger',
      -analyzerConfig.deductions.secretRisk,
      false,
      `Secret-like or local config signals were detected: ${formatList(secretMatches)}.`,
    )
  }

  return createRule(
    'secret-risk',
    'pass',
    0,
    true,
    'No .env, token, credential, password, or API-key-like signal was detected.',
  )
}

function evaluateTestCoverage(input: ReturnType<typeof normalizeInput>): RuleEvaluation {
  const hasFailedTests = includesAny(input.testResult, analyzerConfig.failedTestTerms)
  const hasMissingTests = includesAny(input.testResult, analyzerConfig.missingTestTerms)
  const hasPassingSignal = includesAny(input.testResult, analyzerConfig.passTestTerms)

  if (!input.testResult || hasMissingTests) {
    return createRule(
      'test-coverage',
      'warning',
      -analyzerConfig.deductions.missingTests,
      false,
      'Test Result says tests/build were not run or not verified.',
    )
  }

  if (hasFailedTests) {
    return createRule(
      'test-coverage',
      'danger',
      -analyzerConfig.deductions.failedTests,
      false,
      'Test Result includes failed/error signals.',
    )
  }

  if (hasPassingSignal) {
    return createRule(
      'test-coverage',
      'pass',
      0,
      true,
      'Test Result includes passing or verified build/test signals.',
    )
  }

  return createRule(
    'test-coverage',
    'warning',
    -analyzerConfig.deductions.missingTests,
    false,
    'Test Result is present but does not clearly show passing verification.',
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
  const fallbackThreshold = analyzerConfig.riskThresholds[analyzerConfig.riskThresholds.length - 1]
  if (!fallbackThreshold) {
    throw new Error('Analyzer risk thresholds must include at least one item.')
  }

  const threshold =
    analyzerConfig.riskThresholds.find((item) => score >= item.minScore) ?? fallbackThreshold

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
    return `${riskLabel}: score ${score}. The PR appears tightly scoped, avoids dependency/local config risk, and includes verification. Suggested action: ${suggestedAction}.`
  }

  return `${riskLabel}: score ${score}. Review needed for ${formatList(
    riskyRules.map((rule) => rule.checkResult.title),
  )}. Suggested action: ${suggestedAction}.`
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
      ? `Review signals: ${formatList(riskyRules.map((rule) => rule.checkResult.title))}.`
      : 'No major scope, dependency, secret, or test coverage risk was detected.'

  return `Scope Guard result: ${riskLabel} / ${suggestedAction}. Score: ${score}. ${riskText}`
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
  return Math.min(analyzerConfig.scoreBounds.max, Math.max(analyzerConfig.scoreBounds.min, score))
}

function formatList(items: string[]) {
  return [...new Set(items)].join(', ')
}
