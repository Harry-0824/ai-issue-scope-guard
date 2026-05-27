# AGENTS.md

Codex must read and follow this file before making changes in this repository.

## Project Overview

- Product name: `AI Issue Scope Guard`
- Repo name: `ai-issue-scope-guard`
- Product type: Vue 3 developer productivity tool
- Primary user: AI-assisted developers using Codex / Claude Code / Copilot Agent / OpenCode / other AI coding agents
- UI language: Traditional Chinese
- Necessary technical terms may remain in English
- Design direction: dark, premium AI tool, developer-focused, blue / purple accent, desktop first
- Main goal: help users manually paste Issue / PR information and check whether AI-generated PR changes stay within the original Issue scope

## Stable Maintenance Mode

This repository is currently in stable maintenance mode.

- Preserve current stable behavior by default.
- Only change behavior when the current Issue explicitly requests it.
- Treat normal work as small maintenance updates, docs updates, UX polish, or bug fixes.
- Do not add new features, broad redesigns, or project-wide restructuring unless a specific Issue explicitly asks for it.

## Core Workflow

The intended user flow is:

```txt
Issue spec
→ AI Agent implementation
→ PR summary / changed files / test result
→ user pastes data into Scope Guard
→ rule-based analyzer checks the scope
→ user gets score / risk / suggested action
→ user copies PR comment back to GitHub
```

## Tech Stack

Use the following stack:

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Vitest
- Testing Library
- Scoped CSS / CSS Modules
- npm
- Netlify deployment

Do not make these technology changes unless a future GitHub Issue explicitly requests them:

- Do not migrate to React or Next.js.
- Do not add Tailwind CSS.
- Do not add Element Plus.
- Do not add Vuetify.
- Do not add Naive UI.
- Do not add Ant Design Vue.
- Do not add any UI framework.
- Do not add unnecessary dependencies.
- Do not add GitHub API integration unless explicitly requested.
- Do not add AI API integration unless explicitly requested.
- Do not add database integration unless explicitly requested.
- Do not add login / auth unless explicitly requested.

## Development Rules

- Follow the current GitHub Issue only.
- Start from the Issue `Suggested Files`.
- One Issue should solve one task only.
- One Issue = one branch = one PR.
- Keep diffs minimal and reviewable.
- Preserve existing behavior unless the current Issue explicitly requests a behavior change.
- Do not perform broad refactors unless explicitly requested.
- Do not perform broad redesigns or project restructuring unless explicitly requested.
- Do not modify unrelated files.
- Do not introduce unnecessary dependencies.
- Do not modify `package.json` or lockfiles unless the current Issue explicitly requires dependency or script changes.
- Do not commit `.env`, API keys, secrets, tokens, or local config.
- Do not update portfolio repo from this repo.
- Do not update Obsidian from this repo.
- Do not create extra markdown files unless explicitly requested.
- Keep documentation limited to:
  - `README.md`
  - `AGENTS.md`
  - `DESIGN.md`
  - GitHub Issues

## Modularity Rules

This project must be designed with modular architecture from the beginning.

- UI, page composition, state, data, analysis logic, and persistence logic must be separated.
- Vue page components should not contain complex business logic.
- Analyzer logic must not be written directly inside Vue components.
- localStorage logic must not be written directly inside Vue components.
- Example data must not be hardcoded inside page components.
- Shared TypeScript types should be centralized when used across modules.
- Keep modules small and purpose-specific.
- Avoid premature abstraction.
- Do not create plugin systems, dependency injection containers, or enterprise architecture layers unless explicitly requested.

Recommended structure:

```txt
src/
  app/
    App.vue
    router.ts

  pages/
    LandingPage.vue
    CheckerPage.vue
    RulesPage.vue

  components/
    layout/
      AppHeader.vue
      AppFooter.vue
      AppShell.vue

    ui/
      AppButton.vue
      AppCard.vue
      AppBadge.vue
      AppTextarea.vue
      SectionHeader.vue

    checker/
      ExampleSwitcher.vue
      CheckerInputPanel.vue
      CheckerInputField.vue
      AnalysisSummaryCards.vue
      CheckResultsPanel.vue
      CheckResultItem.vue
      ReviewSummaryCard.vue
      CopyablePrComment.vue
      RuleDetailsPanel.vue

  stores/
    analysisStore.ts

  services/
    analyzer/
      analyzer.types.ts
      analyzerConfig.ts
      ruleBasedAnalyzer.ts
      index.ts

    persistence/
      persistence.types.ts
      localAnalysisRepository.ts
      index.ts

  data/
    checkerExamples.ts

  types/
    checker.ts
    analysis.ts

  styles/
    tokens.css
    global.css
```

## Vue Learning Comment Rules

The repo owner is new to Vue 3. Write useful Traditional Chinese comments for Vue-specific logic.

Add comments for:

- Vue Composition API usage
- `ref`
- `computed`
- `watch`
- `props`
- `emit`
- Pinia store actions
- Vue Router setup
- analyzer rule decisions
- localStorage read/write timing
- data flow that differs from React mental models

Commenting principles:

- Explain why the code is written this way.
- Explain Vue data flow where helpful.
- Do not merely translate the code.
- Do not over-comment simple HTML or CSS class names.
- Use Traditional Chinese comments.
- Technical terms may remain in English.

Good example:

```ts
// Vue 的 ref 用來建立可響應狀態；當 inputValue 改變時，template 會自動重新渲染。
const inputValue = ref('')

// computed 適合放衍生狀態，避免在 template 裡重複寫判斷邏輯。
const hasInput = computed(() => inputValue.value.trim().length > 0)
```

Bad example:

```ts
// 建立一個字串
const title = 'Scope 分析工作區'
```

## UI Rules

- Follow the Figma design direction when an Issue references a Figma design.
- Do not aim for pixel-perfect implementation unless explicitly requested.
- Preserve:
  - dark theme
  - two-column checker workspace
  - left input panel
  - right analysis result panel
  - card hierarchy
  - blue / purple accent
  - thin borders
  - subtle glow
  - rounded corners
  - desktop-first layout
- Mobile only needs basic non-breaking support.
- On small screens, the checker workspace may stack vertically.
- Do not turn the design into a generic admin dashboard.

## State Management Rules

Use Pinia only when shared or persistent state is needed.

For MVP:

- `analysisStore.ts` should manage checker input state.
- It should manage current analysis result.
- It should load Good PR / Risky PR example data.
- It should call analyzer service.
- It should call persistence service when localStorage is introduced.

Do not use Pinia for purely local UI state that only belongs to a small component.

## Analyzer Rules

Analyzer logic belongs under:

```txt
src/services/analyzer/
```

MVP analyzer is rule-based.

It should eventually produce:

- Scope Match Score
- Risk Level
- Suggested Action
- Check Results
- Review Summary
- Copyable PR Comment
- Rule Details

MVP must not call:

- OpenAI
- OpenRouter
- Gemini
- OpenCode
- any external AI provider

Future AI provider support may be considered later, but only through a separate GitHub Issue.

## Persistence Rules

Persistence logic belongs under:

```txt
src/services/persistence/
```

MVP persistence strategy:

- Save only the latest analysis.
- Use localStorage only.
- Do not implement multiple history records.
- Do not implement database storage.
- Do not implement login or user account.

Recommended localStorage key:

```txt
ai-issue-scope-guard:last-analysis
```

## Data Rules

Example data belongs under:

```txt
src/data/checkerExamples.ts
```

MVP should include:

- Good PR example
- Risky PR example

Do not hardcode large example payloads directly inside Vue components.

## Testing Rules

Validation should match Issue scope and change type.

- For docs-only changes, do docs-only validation:
  - confirm final diff only includes intended docs files
  - no build/test command is required unless the Issue explicitly asks
- For code changes, run only the narrowest relevant checks requested by the Issue or needed for safety

Use:

- Vitest
- Testing Library

Expected MVP test coverage:

- analyzer rule tests
- Good PR example loading
- Risky PR example loading
- Analyze button displays score / risk / action
- Copy PR comment button exists and can trigger copy behavior

Do not add:

- Playwright
- Cypress
- large e2e test suite
- accessibility audit automation

unless explicitly requested by a future GitHub Issue.

## Deployment Rules

Deployment target:

- Netlify

Codex may:

- ensure `npm run build` passes
- add `netlify.toml` if needed
- add Vue Router fallback if needed
- update README deployment instructions

Codex must not:

- log into Netlify
- operate the user’s Netlify account
- set custom domains
- use tokens or secrets

## Security Rules

- Never commit `.env`.
- Never commit API keys.
- Never commit tokens.
- Never commit credentials.
- Never place provider keys in frontend code.
- Do not add secret-like example values.
- If future AI API integration is requested, it must use a backend/proxy design and a separate Issue.

## Documentation Rules

Required docs:

- `README.md`
- `AGENTS.md`
- `DESIGN.md`

Avoid extra docs unless explicitly requested.

Do not create:

- `ARCHITECTURE.md`
- `ROADMAP.md`
- `TODO.md`
- handoff files
- weekly summaries

unless explicitly requested.

## PR Scope Checklist

Before opening a PR, Codex should verify:

- The PR follows the current Issue.
- The implementation started from the Issue `Suggested Files`.
- The diff is minimal for the task.
- Existing behavior is preserved unless explicitly changed by the Issue.
- No unrelated files were modified.
- No broad refactor was performed.
- No unnecessary dependency was added.
- No `package.json` or lockfile changes were made unless explicitly required by the Issue.
- No secrets or local config were touched.
- Build/test commands were run or clearly reported.
- Any incomplete work is clearly stated in the PR summary.
- If a new task is discovered, propose a new Issue instead of implementing it in the same PR.

## Roadmap Status

The previous MVP roadmap is historical context only.

- Do not use historical roadmap phases as implicit implementation scope.
- Use only the current GitHub Issue as the source of truth for new work.
