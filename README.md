# AI Issue Scope Guard

AI Issue Scope Guard is a Vue 3 developer productivity tool for checking whether an AI-generated pull request stays within the original GitHub Issue scope.

The MVP is intentionally local and rule-based. Users manually paste Issue and PR information, run the analyzer in the browser, review the scope score and risk level, then copy a PR comment back to GitHub.

## Core Features

- `/` landing page with product positioning, workflow, feature cards, and roadmap notes.
- `/checker` workspace for manual Issue / PR input.
- Good PR and Risky PR examples for quick validation.
- Rule-based analyzer with Scope Match Score, Risk Level, Suggested Action, Check Results, Review Summary, Copyable PR Comment, and Rule Details.
- Pinia store for checker input state and current analysis result.
- Latest-only localStorage persistence for the last analysis.
- `/rules` page documenting scoring logic, risk mapping, MVP limitations, and future extension ideas.

## Tech Stack

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

## Local Setup

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test
```

- `npm run dev`: start the local development server.
- `npm run build`: run TypeScript build checks and create the production `dist` output.
- `npm run preview`: preview the production build locally after `npm run build`.
- `npm run test`: run the Vitest test suite.

## Deployment Notes

This project is prepared for Netlify static hosting.

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback: all routes redirect to `/index.html` through `netlify.toml`

Netlify deployment should be done manually outside Codex. Do not commit Netlify tokens, API keys, `.env`, `.env.local`, or local account config.

## Live Demo

Live demo: TBD after manual Netlify deployment.

## Architecture Note

The MVP keeps page composition, checker UI, state, analyzer logic, and persistence logic separated:

```txt
src/pages/              route-level pages
src/components/ui/      reusable UI components
src/components/checker/ checker workspace components
src/stores/             Pinia state
src/services/analyzer/  rule-based analyzer
src/services/persistence/ localStorage repository
src/data/               demo examples
src/types/              shared app types
```

Analyzer and localStorage logic are not implemented inside Vue page components.

## MVP Limitations

- Manual paste only.
- No GitHub API integration.
- No AI API integration.
- No OpenAI, OpenRouter, Gemini, or OpenCode connection.
- No database integration.
- No login or user accounts.
- No multi-analysis history.
- No full diff parser.
- No automated Netlify deployment from this repository.

Future provider or database support should be implemented through separate GitHub Issues.
