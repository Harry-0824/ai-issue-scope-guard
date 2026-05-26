<template>
  <section class="landing-page">
    <section class="landing-page__hero" aria-labelledby="landing-title">
      <div class="landing-page__hero-copy">
        <h1 id="landing-title">AI Issue Scope Guard</h1>
        <p>
          檢查 AI 產生的 PR 是否守住 GitHub Issue 任務範圍，讓 Codex / AI Agent
          的實作可以被快速、 清楚、可重複地審查。
        </p>
        <div class="landing-page__hero-actions">
          <AppButton to="/checker">開始範圍檢查</AppButton>
          <AppButton to="/rules" variant="secondary">查看檢查規則</AppButton>
        </div>
      </div>

      <AppCard class="landing-page__preview" aria-label="Scope Guard 產品預覽">
        <div class="landing-page__preview-header">
          <span>範圍符合度分數</span>
          <strong>96</strong>
        </div>
        <div class="landing-page__preview-row">
          <AppBadge tone="success">低風險</AppBadge>
          <span>可進入審查</span>
        </div>
        <div class="landing-page__preview-list">
          <p>Issue 任務範圍對齊：通過</p>
          <p>變更檔案範圍：通過</p>
          <p>build / test 驗證訊號：通過</p>
        </div>
        <pre>Scope Guard 結果：低風險 / 可進入審查。</pre>
      </AppCard>
    </section>

    <AppCard class="landing-page__positioning">
      <SectionHeader
        eyebrow="產品定位"
        title="給 AI 輔助開發者的 PR 範圍審查工作台"
        description="AI Issue Scope Guard 聚焦在人工貼上 Issue / PR 資訊後，用 local rule-based analyzer 產生分數、風險、建議處理方式與可複製的 PR 評語。"
      />
      <div class="landing-page__positioning-points">
        <span>手動貼上優先</span>
        <span>Rule-based MVP</span>
        <span>最新分析本機保存</span>
      </div>
    </AppCard>

    <section class="landing-page__section" aria-labelledby="features-title">
      <SectionHeader
        eyebrow="功能重點"
        title="範圍審查重點"
        description="先把 AI PR 審查最容易漏掉的任務範圍訊號做成可掃描的結果。"
      />
      <div class="landing-page__features">
        <AppCard
          v-for="feature in features"
          :key="feature.title"
          class="landing-page__card"
        >
          <AppBadge :tone="feature.tone">{{ feature.badge }}</AppBadge>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </AppCard>
      </div>
    </section>

    <section class="landing-page__section" aria-labelledby="workflow-title">
      <SectionHeader
        eyebrow="流程"
        title="AI 輔助開發流程"
        description="這個工具放在 Issue-driven development 的審查階段，不取代審查者，也不自動抓 GitHub diff。"
      />
      <div class="landing-page__workflow">
        <article
          v-for="(step, index) in workflowSteps"
          :key="step.title"
          class="landing-page__step"
        >
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </article>
      </div>
    </section>

    <section class="landing-page__section" aria-labelledby="future-title">
      <SectionHeader
        eyebrow="規劃"
        title="未來擴充方向"
        description="以下是未來可擴充方向，不代表 MVP 已經連接外部 provider、GitHub API 或 database。"
      />
      <div class="landing-page__roadmap">
        <AppCard
          v-for="item in roadmap"
          :key="item.title"
          class="landing-page__roadmap-item"
        >
          <AppBadge>未來</AppBadge>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </AppCard>
      </div>
    </section>

    <footer class="landing-page__footer">
      <p>
        AI Issue Scope Guard 是 Vue 3 portfolio project，展示 Issue-scoped
        implementation、rule-based analysis 與適合審查者回貼的 PR 評語流程。
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
    title: '範圍檢查',
    badge: 'Scope',
    tone: 'success',
    description:
      '對照 Issue 任務範圍、PR 摘要與變更檔案，找出可能超出任務範圍的訊號。',
  },
  {
    title: '風險等級',
    badge: 'Risk',
    tone: 'warning',
    description:
      '把分數映射成低 / 中 / 高風險，讓審查者先判斷要進入審查或要求修改。',
  },
  {
    title: '可複製的 PR 評語',
    badge: 'Comment',
    tone: 'success',
    description:
      '產生簡短 PR 評語，方便回貼到 GitHub review thread，保留人工判斷的上下文。',
  },
  {
    title: 'localStorage 本機保存',
    badge: 'Local',
    tone: 'success',
    description:
      '只保存最後一次分析在瀏覽器 localStorage，不建立歷史紀錄、帳號或資料庫同步。',
  },
]

const workflowSteps = [
  {
    title: 'Issue 任務範圍',
    description:
      '先由 GitHub Issue 定義 task source of truth、驗收條件與不包含項目。',
  },
  {
    title: 'Codex / AI Agent 實作',
    description:
      'AI coding agent 按 Issue scope 實作，避免順手重構或加上未要求的功能。',
  },
  {
    title: 'PR 審查',
    description:
      '審查者檢查變更檔案、摘要、tests 與 dependency changes 是否符合 Issue。',
  },
  {
    title: 'Scope Guard 範圍檢查',
    description:
      '把手動貼上的資訊轉成分數、風險、建議處理方式、規則細節與可複製的 PR 評語。',
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
    description:
      '若未來接 AI API，需另開 Issue 並使用安全的 backend/proxy 設計。',
  },
  {
    title: 'Gemini',
    description: '未來可能支援多 provider 比較，但目前不在 MVP 實作範圍。',
  },
  {
    title: '資料庫同步準備',
    description:
      '目前只保存 local latest analysis；database sync 需要獨立 Issue。',
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
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
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
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
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
