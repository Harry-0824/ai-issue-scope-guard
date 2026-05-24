<template>
  <section class="landing-page">
    <section class="landing-page__hero" aria-labelledby="landing-title">
      <div class="landing-page__hero-copy">
        <h1 id="landing-title">AI Issue Scope Guard</h1>
        <p>
          檢查 AI-generated PR 是否守住 GitHub Issue scope，讓 Codex / AI Agent 的實作可以被快速、
          清楚、可重複地 review。
        </p>
        <div class="landing-page__hero-actions">
          <AppButton to="/checker">開始 Scope 檢查</AppButton>
          <AppButton to="/rules" variant="secondary">查看規則說明</AppButton>
        </div>
      </div>

      <AppCard class="landing-page__preview" aria-label="Scope Guard product preview">
        <div class="landing-page__preview-header">
          <span>Scope Match Score</span>
          <strong>96</strong>
        </div>
        <div class="landing-page__preview-row">
          <AppBadge tone="success">Low Risk</AppBadge>
          <span>Ready to Review</span>
        </div>
        <div class="landing-page__preview-list">
          <p>Scope Alignment: Pass</p>
          <p>Changed Files: Pass</p>
          <p>Test Coverage Signal: Pass</p>
        </div>
        <pre>Scope Guard result: Low Risk / Ready to Review.</pre>
      </AppCard>
    </section>

    <AppCard class="landing-page__positioning">
      <SectionHeader
        eyebrow="Product positioning"
        title="給 AI-assisted developer 的 PR scope review 工作台"
        description="AI Issue Scope Guard 聚焦在人工貼上 Issue / PR 資訊後，用 local rule-based analyzer 產生 score、risk、action 與可複製 PR 評語。"
      />
      <div class="landing-page__positioning-points">
        <span>Manual paste first</span>
        <span>Rule-based MVP</span>
        <span>Local latest save</span>
      </div>
    </AppCard>

    <section class="landing-page__section" aria-labelledby="features-title">
      <SectionHeader
        eyebrow="Features"
        title="Feature cards"
        description="先把 AI PR review 最容易漏掉的 scope signal 做成可掃描的結果。"
      />
      <div class="landing-page__features">
        <AppCard v-for="feature in features" :key="feature.title" class="landing-page__card">
          <AppBadge :tone="feature.tone">{{ feature.badge }}</AppBadge>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </AppCard>
      </div>
    </section>

    <section class="landing-page__section" aria-labelledby="workflow-title">
      <SectionHeader
        eyebrow="Workflow"
        title="AI-assisted development workflow"
        description="這個工具放在 Issue-driven development 的 review 階段，不取代 reviewer，也不自動抓 GitHub diff。"
      />
      <div class="landing-page__workflow">
        <article v-for="(step, index) in workflowSteps" :key="step.title" class="landing-page__step">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </article>
      </div>
    </section>

    <section class="landing-page__section" aria-labelledby="future-title">
      <SectionHeader
        eyebrow="Roadmap"
        title="Future extension"
        description="以下是未來可擴充方向，不代表 MVP 已經連接外部 provider、GitHub API 或 database。"
      />
      <div class="landing-page__roadmap">
        <AppCard v-for="item in roadmap" :key="item.title" class="landing-page__roadmap-item">
          <AppBadge>Future</AppBadge>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </AppCard>
      </div>
    </section>

    <footer class="landing-page__footer">
      <p>
        Footer: AI Issue Scope Guard 是 Vue 3 portfolio project，展示 issue-scoped implementation、rule-based
        analysis 與 reviewer-friendly PR comment workflow。
      </p>
    </footer>
  </section>
</template>

<script setup lang="ts">
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type { AnalysisTone } from '@/types/analysis'

type FeatureCard = {
  title: string
  badge: string
  tone: AnalysisTone
  description: string
}

const features: FeatureCard[] = [
  {
    title: 'Scope 檢查',
    badge: 'Scope',
    tone: 'success',
    description: '對照 Issue Spec、PR Summary 與 Changed Files，找出可能超出任務範圍的 signal。',
  },
  {
    title: 'Risk Level',
    badge: 'Risk',
    tone: 'warning',
    description: '把 score 映射成 Low / Medium / High Risk，讓 reviewer 先判斷要 review 或 request changes。',
  },
  {
    title: '可複製 PR 評語',
    badge: 'Comment',
    tone: 'success',
    description: '產生簡短 PR comment，方便回貼到 GitHub review thread，保留人工判斷的上下文。',
  },
  {
    title: 'Local save / 最後一次分析保存',
    badge: 'Local',
    tone: 'success',
    description: '只保存最後一次分析在瀏覽器 localStorage，不建立 history、帳號或資料庫同步。',
  },
]

const workflowSteps = [
  {
    title: 'Issue spec',
    description: '先由 GitHub Issue 定義 task source of truth、acceptance criteria 與 out-of-scope。',
  },
  {
    title: 'Codex / AI Agent 實作',
    description: 'AI coding agent 按 Issue scope 實作，避免順手重構或加上未要求的功能。',
  },
  {
    title: 'PR review',
    description: 'Reviewer 檢查 changed files、summary、tests 與 dependency changes 是否符合 Issue。',
  },
  {
    title: 'Scope Guard 分析',
    description: '把手動貼上的資訊轉成 score、risk、action、rule details 與可複製 PR 評語。',
  },
]

const roadmap = [
  {
    title: 'OpenRouter',
    description: '未來可作為外部 model provider adapter，但目前 MVP 沒有連線。',
  },
  {
    title: 'OpenCode',
    description: '未來可探索 AI agent workflow 整合，目前只保留 roadmap 說明。',
  },
  {
    title: 'OpenAI',
    description: '若未來接 AI API，需另開 Issue 並使用安全的 backend/proxy 設計。',
  },
  {
    title: 'Gemini',
    description: '未來可能支援多 provider 比較，但目前不在 MVP 實作範圍。',
  },
  {
    title: 'database-ready architecture',
    description: '目前只保存 local latest analysis；database sync 需要獨立 Issue。',
  },
]
</script>

<style scoped>
.landing-page {
  display: grid;
  gap: 28px;
}

.landing-page__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.78fr);
  align-items: center;
  gap: 28px;
  min-height: min(660px, calc(100vh - 180px));
}

.landing-page__hero-copy {
  display: grid;
  gap: 22px;
}

.landing-page__hero h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 6.4rem;
  line-height: 0.95;
}

.landing-page__hero p,
.landing-page__positioning p,
.landing-page__card p,
.landing-page__step p,
.landing-page__roadmap-item p,
.landing-page__footer p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.landing-page__hero-copy > p {
  max-width: 720px;
  font-size: 1.12rem;
}

.landing-page__hero-actions,
.landing-page__positioning-points {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.landing-page__preview {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.landing-page__preview-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.landing-page__preview-header span,
.landing-page__preview-row span {
  color: var(--color-text-muted);
  font-weight: 800;
}

.landing-page__preview-header strong {
  color: var(--color-text);
  font-size: 6rem;
  line-height: 0.9;
}

.landing-page__preview-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.landing-page__preview-list {
  display: grid;
  gap: 10px;
}

.landing-page__preview-list p,
.landing-page__preview pre {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  background: rgba(5, 10, 22, 0.42);
}

.landing-page__preview pre {
  overflow: auto;
  margin: 0;
  color: var(--color-text);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.84rem;
  white-space: pre-wrap;
}

.landing-page__positioning {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.landing-page__positioning-points span {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  padding: 8px 12px;
  color: var(--color-text);
  background: rgba(131, 154, 196, 0.1);
  font-size: 0.86rem;
  font-weight: 800;
}

.landing-page__section {
  display: grid;
  gap: 18px;
}

.landing-page__features {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.landing-page__card,
.landing-page__roadmap-item {
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 20px;
}

.landing-page__card h3,
.landing-page__step h3,
.landing-page__roadmap-item h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.05rem;
}

.landing-page__workflow {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.landing-page__step {
  display: grid;
  gap: 12px;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}

.landing-page__step span {
  color: var(--color-accent-strong);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.84rem;
  font-weight: 800;
}

.landing-page__roadmap {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.landing-page__footer {
  border-top: 1px solid var(--color-border);
  padding-top: 18px;
}

@media (max-width: 1100px) {
  .landing-page__hero,
  .landing-page__features,
  .landing-page__workflow,
  .landing-page__roadmap {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .landing-page__hero h1 {
    font-size: 4.75rem;
  }

  .landing-page__preview-header strong {
    font-size: 4.5rem;
  }
}

@media (max-width: 720px) {
  .landing-page__hero,
  .landing-page__features,
  .landing-page__workflow,
  .landing-page__roadmap {
    grid-template-columns: 1fr;
  }

  .landing-page__hero {
    min-height: auto;
  }

  .landing-page__hero h1 {
    font-size: 3rem;
  }

  .landing-page__preview-header strong {
    font-size: 3.5rem;
  }
}
</style>
