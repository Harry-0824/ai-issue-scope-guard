export type CheckerExampleKey = 'good' | 'risky'

export type CheckerInput = {
  issueSpec: string
  prSummary: string
  changedFiles: string
  testResult: string
  dependencyChanges: string
}
