import { fireEvent, render, screen } from '@testing-library/vue'

import App from './App.vue'
import { router } from './router'

async function renderAppAt(path = '/') {
  router.push(path)
  await router.isReady()

  return render(App, {
    global: {
      plugins: [router],
    },
  })
}

describe('App routing', () => {
  it('renders the landing placeholder route', async () => {
    await renderAppAt('/')

    expect(screen.getByRole('heading', { name: 'AI Issue Scope Guard' })).toBeInTheDocument()
  })

  it('navigates between placeholder pages from the header', async () => {
    await renderAppAt('/')

    // Vue Router 會在同一個 SPA shell 內切換 RouterView，這裡測的是導覽資料流而不是完整 UI。
    await fireEvent.click(screen.getByRole('link', { name: 'Scope Checker' }))
    expect(
      await screen.findByRole('heading', { name: 'Scope 分析工作區' }),
    ).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '規則說明' }))
    expect(
      await screen.findByRole('heading', { name: 'Rule-based Analyzer 規則說明' }),
    ).toBeInTheDocument()
  })
})
