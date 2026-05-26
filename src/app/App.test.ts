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
    expect(screen.getByText(/檢查 AI 產生的 PR 是否守住 GitHub Issue 任務範圍/)).toBeInTheDocument()
    expect(screen.getAllByText('範圍檢查').length).toBeGreaterThan(0)
    expect(screen.getByText('風險等級')).toBeInTheDocument()
    expect(screen.getByText('可複製的 PR 評語')).toBeInTheDocument()
    expect(screen.getByText('localStorage 本機保存')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI 輔助開發流程' })).toBeInTheDocument()
    expect(screen.getByText('Codex / AI Agent 實作')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '未來擴充方向' })).toBeInTheDocument()
    expect(screen.getByText('資料庫同步準備')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '開始範圍檢查' }))
    expect(await screen.findByRole('heading', { name: '範圍檢查工作區' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '首頁' }))
    expect(await screen.findByRole('heading', { name: 'AI Issue Scope Guard' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '查看檢查規則' }))
    expect(
      await screen.findByRole('heading', { name: 'Rule-based Analyzer 檢查規則' }),
    ).toBeInTheDocument()
  })

  it('navigates between placeholder pages from the header', async () => {
    await renderAppAt('/')

    // Vue Router 讓 SPA shell 保持不變，只替換 RouterView 對應的頁面內容。
    await fireEvent.click(screen.getByRole('link', { name: '範圍檢查' }))
    expect(await screen.findByRole('heading', { name: '範圍檢查工作區' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '規則說明' }))
    expect(
      await screen.findByRole('heading', { name: 'Rule-based Analyzer 檢查規則' }),
    ).toBeInTheDocument()
  })

  it('renders the rule explanation page content', async () => {
    await renderAppAt('/rules')

    expect(screen.getByRole('heading', { name: 'Rule-based Analyzer 檢查規則' })).toBeInTheDocument()
    expect(screen.getByText(/MVP 是 rule-based 且 local-only/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '範圍符合度分數邏輯' })).toBeInTheDocument()
    expect(screen.getByText(/Base score 從 100 分開始/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '扣分規則' })).toBeInTheDocument()
    expect(screen.getByText('90-100 = 低風險 / 可進入審查')).toBeInTheDocument()
    expect(screen.getByText('Issue 任務範圍對齊')).toBeInTheDocument()
    expect(screen.getByText('僅支援手動貼上')).toBeInTheDocument()
    expect(screen.getByText('no GitHub API')).toBeInTheDocument()
    expect(screen.getByText('OpenRouter')).toBeInTheDocument()
    expect(screen.getByText('資料庫同步準備')).toBeInTheDocument()
  })

  it('loads demo data, displays analysis results, copies the PR comment, and clears state', async () => {
    await renderAppAt('/checker')

    expect(screen.getByRole('button', { name: '複製 PR 評語' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '良好 PR 範例' }))
    expect((screen.getByLabelText('Issue 任務範圍') as HTMLTextAreaElement).value).toContain('Issue #12')

    await fireEvent.click(screen.getByRole('button', { name: '開始分析' }))
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getAllByText('低風險').length).toBeGreaterThan(0)
    expect(screen.getByText('可進入審查')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '複製 PR 評語' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('低風險 / 可進入審查'),
    )
    expect(screen.getByText('已複製 PR 評語。')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '高風險 PR 範例' }))
    expect((screen.getByLabelText('變更檔案') as HTMLTextAreaElement).value).toContain(
      '.env.local',
    )

    await fireEvent.click(screen.getByRole('button', { name: '開始分析' }))
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getAllByText('高風險').length).toBeGreaterThan(0)
    expect(screen.getByText('建議要求修改')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '清除' }))
    expect((screen.getByLabelText('Issue 任務範圍') as HTMLTextAreaElement).value).toBe('')
    expect(screen.getByText('請先載入範例或開始分析')).toBeInTheDocument()
  })
})
