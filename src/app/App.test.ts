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

  it('renders the landing placeholder route', async () => {
    await renderAppAt('/')

    expect(screen.getByRole('heading', { name: 'AI Issue Scope Guard' })).toBeInTheDocument()
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
