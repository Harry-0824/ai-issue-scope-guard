import { fireEvent, render, screen } from '@testing-library/vue'
import { createPinia } from 'pinia'
import { beforeEach, vi } from 'vitest'

import App from './App.vue'
import { router } from './router'

async function renderAppAt(path = '/') {
  router.push(path)
  await router.isReady()

  return render(App, {
    global: {
      plugins: [createPinia(), router],
    },
  })
}

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders the landing page content and navigates through landing CTAs', async () => {
    await renderAppAt('/')

    expect(screen.getByRole('heading', { name: 'AI Issue Scope Guard' })).toBeInTheDocument()
    expect(screen.getByText(/檢查 AI-generated PR 是否守住 GitHub Issue scope/)).toBeInTheDocument()
    expect(screen.getByText('Scope 檢查')).toBeInTheDocument()
    expect(screen.getByText('Risk Level')).toBeInTheDocument()
    expect(screen.getByText('可複製 PR 評語')).toBeInTheDocument()
    expect(screen.getByText('Local save / 最後一次分析保存')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI-assisted development workflow' })).toBeInTheDocument()
    expect(screen.getByText('Codex / AI Agent 實作')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Future extension' })).toBeInTheDocument()
    expect(screen.getByText('database-ready architecture')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '開始 Scope 檢查' }))
    expect(await screen.findByRole('heading', { name: 'Scope 分析工作區' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '首頁' }))
    expect(await screen.findByRole('heading', { name: 'AI Issue Scope Guard' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '查看規則說明' }))
    expect(
      await screen.findByRole('heading', { name: 'Rule-based Analyzer 規則說明' }),
    ).toBeInTheDocument()
  })

  it('navigates between placeholder pages from the header', async () => {
    await renderAppAt('/')

    // Vue Router 讓 SPA shell 保持不變，只替換 RouterView 對應的頁面內容。
    await fireEvent.click(screen.getByRole('link', { name: 'Scope Checker' }))
    expect(await screen.findByRole('heading', { name: 'Scope 分析工作區' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '規則說明' }))
    expect(
      await screen.findByRole('heading', { name: 'Rule-based Analyzer 規則說明' }),
    ).toBeInTheDocument()
  })

  it('renders the rule explanation page content', async () => {
    await renderAppAt('/rules')

    expect(screen.getByRole('heading', { name: 'Rule-based Analyzer 規則說明' })).toBeInTheDocument()
    expect(screen.getByText(/MVP 是 rule-based 且 local-only/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Scope Match Score logic' })).toBeInTheDocument()
    expect(screen.getByText(/Base score 從 100 分開始/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Score deduction rules' })).toBeInTheDocument()
    expect(screen.getByText('90-100 = Low Risk / Ready to Review')).toBeInTheDocument()
    expect(screen.getByText('Scope Alignment')).toBeInTheDocument()
    expect(screen.getByText('manual paste only')).toBeInTheDocument()
    expect(screen.getByText('no GitHub API')).toBeInTheDocument()
    expect(screen.getByText('OpenRouter')).toBeInTheDocument()
    expect(screen.getByText('database-ready architecture')).toBeInTheDocument()
  })

  it('loads demo data, displays analysis results, copies the PR comment, and clears state', async () => {
    await renderAppAt('/checker')

    await fireEvent.click(screen.getByRole('button', { name: 'Good PR' }))
    expect((screen.getByLabelText('Issue Spec') as HTMLTextAreaElement).value).toContain('Issue #12')

    await fireEvent.click(screen.getByRole('button', { name: '開始分析' }))
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getAllByText('Low Risk').length).toBeGreaterThan(0)
    expect(screen.getByText('Ready to Review')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '複製 PR 評語' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('Low Risk / Ready to Review'),
    )
    expect(screen.getByText('已複製 PR 評語。')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: 'Risky PR' }))
    expect((screen.getByLabelText('Changed Files') as HTMLTextAreaElement).value).toContain(
      '.env.local',
    )

    await fireEvent.click(screen.getByRole('button', { name: '開始分析' }))
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getAllByText('High Risk').length).toBeGreaterThan(0)
    expect(screen.getByText('Request Changes')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect((screen.getByLabelText('Issue Spec') as HTMLTextAreaElement).value).toBe('')
    expect(screen.getByText('Load example')).toBeInTheDocument()
  })
})
