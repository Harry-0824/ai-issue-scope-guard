import { checkerExamples } from '@/data/checkerExamples'

import { analyzeScope } from './ruleBasedAnalyzer'

describe('analyzeScope', () => {
  it('returns low risk for the Good PR example', () => {
    const result = analyzeScope(checkerExamples.good)

    expect(result.score).toBeGreaterThanOrEqual(90)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.riskLevel).toBe('low')
    expect(result.riskLabel).toBe('Low Risk')
    expect(result.riskTone).toBe('success')
    expect(result.suggestedAction).toBe('Ready to Review')
    expect(result.checkResults.map((item) => item.title)).toEqual([
      'Scope Alignment',
      'Changed Files',
      'Dependency Risk',
      'Secret Risk',
      'Test Coverage Signal',
    ])
    expect(result.reviewSummary).toContain('Low Risk')
    expect(result.prComment).toContain('Ready to Review')
  })

  it('returns high risk for the Risky PR example', () => {
    const result = analyzeScope(checkerExamples.risky)

    expect(result.score).toBeLessThanOrEqual(69)
    expect(result.riskLevel).toBe('high')
    expect(result.riskLabel).toBe('High Risk')
    expect(result.riskTone).toBe('danger')
    expect(result.suggestedAction).toBe('Request Changes')
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
