# AI Issue Scope Guard

AI Issue Scope Guard 是一個 Vue 3 開發者工具，用來協助檢查 AI-generated pull request 是否仍然符合原本的 GitHub Issue scope。

這個 MVP 採用 local-only、rule-based 的設計。使用者手動貼上 Issue 與 PR 資訊，在瀏覽器中執行 analyzer，查看 scope score、risk level、suggested action，最後把產生的 PR comment 複製回 GitHub review 流程。

## 專案介紹

AI Issue Scope Guard 面向使用 Codex、Claude Code、Copilot Agent、OpenCode 或其他 AI coding agent 的開發者。

核心目標是讓 AI-assisted development 的 review 流程更穩定：先以 GitHub Issue 定義任務範圍，再把 PR summary、changed files、test result 與 dependency changes 貼到工具中，透過 deterministic rules 產生可讀的 scope review 結果。

## 核心功能

- `/` Landing Page：介紹產品定位、AI-assisted development workflow、核心功能與未來擴充方向。
- `/checker` Scope Checker：手動貼上 Issue / PR 資訊並執行分析。
- Good PR / Risky PR 範例：快速驗證 analyzer 與 checker workflow。
- Rule-based analyzer：產生 Scope Match Score、Risk Level、Suggested Action、Check Results、Review Summary、Copyable PR Comment 與 Rule Details。
- Pinia state：管理 checker input state 與目前 analysis result。
- Latest-only localStorage persistence：只保存最後一次分析，不建立多筆 history。
- `/rules` 規則說明頁：說明 score logic、risk mapping、目前檢查項目、MVP 限制與 future roadmap。

## 技術棧

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Vitest
- Testing Library
- Scoped CSS
- npm
- Netlify

## 本機啟動

```bash
npm install
npm run dev
```

啟動後，請開啟 terminal 顯示的本機 Vite URL。

## 可用指令

```bash
npm run dev
npm run build
npm run preview
npm run test
```

- `npm run dev`：啟動本機開發伺服器。
- `npm run build`：執行 TypeScript build checks，並產生 production `dist` output。
- `npm run preview`：在本機預覽 production build。請先執行 `npm run build`。
- `npm run test`：執行 Vitest test suite。

## 部署說明

本專案已準備好部署到 Netlify static hosting。

- Build command：`npm run build`
- Publish directory：`dist`
- SPA fallback：透過 `netlify.toml` 將所有 routes redirect 到 `/index.html`

Netlify 部署應在 Codex 外手動操作。請不要提交 Netlify tokens、API keys、`.env`、`.env.local` 或任何 local account config。

## Live Demo

Live demo：https://monumental-fudge-3c2f38.netlify.app/

## 架構說明

MVP 將 page composition、checker UI、state、analyzer logic 與 persistence logic 分開管理：

```txt
src/pages/                route-level pages
src/components/ui/        reusable UI components
src/components/checker/   checker workspace components
src/stores/               Pinia state
src/services/analyzer/    rule-based analyzer
src/services/persistence/ localStorage repository
src/data/                 demo examples
src/types/                shared app types
```

Analyzer logic 不寫在 Vue page component 裡；localStorage logic 也集中在 persistence service 中，避免頁面元件混入資料保存細節。

## MVP 限制

- 只支援 manual paste。
- 沒有 AI API integration。
- 沒有 OpenAI、OpenRouter、Gemini 或 OpenCode provider 連線。
- 沒有 GitHub API integration。
- 沒有 GitHub Issue / PR URL import。
- 沒有 database integration。
- 沒有 auth / login。
- 沒有 user account 或 team workspace。
- 沒有 multi-analysis history。
- 沒有 full diff parser。
- 沒有從 repo 內自動執行 Netlify deployment。

未來若要加入 AI provider、GitHub API、database sync、auth/login 或完整 diff parser，應透過新的 GitHub Issue 分開實作。
