import { checkerExamples } from '@/data/checkerExamples'

import { analyzeScope } from './ruleBasedAnalyzer'

describe('analyzeScope', () => {
  it('returns low risk for the good PR example', () => {
    const result = analyzeScope(checkerExamples.good)

    expect(result.score).toBeGreaterThanOrEqual(90)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.riskLevel).toBe('low')
    expect(result.riskLabel).toBe('低風險')
    expect(result.riskTone).toBe('success')
    expect(result.suggestedAction).toBe('可進入審查')
    expect(result.checkResults.map((item) => item.title)).toEqual([
      'Issue 任務範圍對齊',
      '變更檔案範圍',
      'Dependency 變更風險',
      'Secret / 本機設定風險',
      'build / test 驗證訊號',
    ])
    expect(result.reviewSummary).toContain('低風險')
    expect(result.prComment).toContain('可進入審查')
  })

  it('returns high risk for the risky PR example', () => {
    const result = analyzeScope(checkerExamples.risky)

    expect(result.score).toBeLessThanOrEqual(69)
    expect(result.riskLevel).toBe('high')
    expect(result.riskLabel).toBe('高風險')
    expect(result.riskTone).toBe('danger')
    expect(result.suggestedAction).toBe('建議要求修改')
    expect(result.checkResults.find((item) => item.id === 'secret-risk')?.status).toBe('danger')
    expect(result.checkResults.find((item) => item.id === 'dependency-risk')?.status).toBe('danger')
  })

  it('deducts score when tests are missing', () => {
    const result = analyzeScope({
      ...checkerExamples.good,
      testResult: 'Tests were not run.',
    })

    expect(result.score).toBeLessThan(90)
    expect(result.checkResults.find((item) => item.id === 'test-coverage')?.status).toBe('warning')
  })

  it('deducts score when dependency changes are present', () => {
    const result = analyzeScope({
      ...checkerExamples.good,
      dependencyChanges: 'Added analytics-sdk.',
    })

    expect(result.score).toBeLessThan(90)
    expect(result.checkResults.find((item) => item.id === 'dependency-risk')?.status).toBe(
      'warning',
    )
  })

  it('does not treat secret guidance in the Issue as a committed secret', () => {
    const result = analyzeScope({
      ...checkerExamples.good,
      issueSpec: `${checkerExamples.good.issueSpec} Do not commit .env.local or token files.`,
    })

    expect(result.checkResults.find((item) => item.id === 'secret-risk')?.status).toBe('pass')
  })

  it('clamps the final score between 0 and 100 when many high-risk signals exist', () => {
    const result = analyzeScope({
      issueSpec: 'Change one CTA label only. Do not change dependencies or deployment.',
      prSummary:
        'Refactored auth, rewired database access, changed deployment config, added package updates, and committed token handling.',
      changedFiles:
        '.env\n.env.local\npackage.json\npackage-lock.json\nnetlify.toml\nsrc/auth/tokenClient.ts\nsrc/services/database.ts',
      testResult: 'Tests failed. Build failed.',
      dependencyChanges: 'Added auth-sdk, analytics-sdk, and database-client.',
    })

    expect(result.score).toBe(0)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
  })
})
