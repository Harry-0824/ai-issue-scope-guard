<template>
  <section class="rules-page">
    <div class="rules-page__hero">
      <p class="rules-page__eyebrow">規則</p>
      <h1>Rule-based Analyzer 檢查規則</h1>
      <p>
        MVP 是 rule-based 且 local-only。它只分析使用者手動貼上的 Issue / PR 資訊，不會呼叫 AI API、
        GitHub API 或資料庫。
      </p>
      <div class="rules-page__badges" aria-label="MVP analyzer 狀態">
        <AppBadge tone="success">僅本機分析</AppBadge>
        <AppBadge>手動貼上</AppBadge>
        <AppBadge>不呼叫外部 API</AppBadge>
      </div>
    </div>

    <div class="rules-page__grid rules-page__grid--intro">
      <AppCard class="rules-page__card">
        <SectionHeader
          eyebrow="說明"
          title="Rule-based Analyzer 說明"
          description="Scope Guard 目前使用 deterministic rules，把 Issue 任務範圍、PR 摘要、變更檔案、build / test 結果與 dependency changes 轉成可讀的審查訊號。"
        />
        <p>
          這不是 AI 判斷，也不是 GitHub diff parser。它的定位是幫審查者快速發現明顯超出 Issue 任務範圍的變更，
          並產生可複製回 PR 的審查評語。
        </p>
      </AppCard>

      <AppCard class="rules-page__card rules-page__score-card">
        <SectionHeader
          eyebrow="分數"
          title="範圍符合度分數邏輯"
          description="Base score 從 100 分開始，再根據每個風險訊號扣分。"
        />
        <strong>{{ analyzerConfig.baseScore }}</strong>
        <p>Final score 會 clamp 在 0 到 100 之間，避免多個風險訊號讓分數超出可讀範圍。</p>
      </AppCard>
    </div>

    <AppCard class="rules-page__card">
      <SectionHeader
        eyebrow="扣分"
        title="扣分規則"
        description="目前扣分只反映 MVP rule signals，不代表完整 code review 結論。"
      />
      <div class="rules-page__deductions">
        <article v-for="rule in deductionRules" :key="rule.label" class="rules-page__deduction">
          <span>{{ rule.label }}</span>
          <strong>-{{ rule.points }}</strong>
          <p>{{ rule.description }}</p>
        </article>
      </div>
    </AppCard>

    <AppCard class="rules-page__card">
      <SectionHeader
        eyebrow="對應"
        title="風險等級與建議處理方式對應"
        description="Score 會映射到審查者可以直接採取的建議動作。"
      />
      <div class="rules-page__mapping">
        <article v-for="item in riskMapping" :key="item.range" class="rules-page__mapping-item">
          <AppBadge :tone="item.tone">{{ item.risk }}</AppBadge>
          <strong>{{ item.range }} = {{ item.risk }} / {{ item.action }}</strong>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </AppCard>

    <div class="rules-page__grid">
      <AppCard class="rules-page__card">
        <SectionHeader
          eyebrow="檢查項目"
          title="目前檢查項目"
          description="這些是目前 analyzer 會回傳在檢查結果與規則細節的項目。"
        />
        <div class="rules-page__check-list">
          <article v-for="check in checkItems" :key="check.title" class="rules-page__check-item">
            <h3>{{ check.title }}</h3>
            <p>{{ check.description }}</p>
          </article>
        </div>
      </AppCard>

      <AppCard class="rules-page__card">
        <SectionHeader
          eyebrow="限制"
          title="MVP 限制"
          description="這些限制是刻意保留的 MVP 邊界，避免把工具誤解成完整自動化審查系統。"
        />
        <ul class="rules-page__plain-list">
          <li v-for="limitation in limitations" :key="limitation">{{ limitation }}</li>
        </ul>
      </AppCard>
    </div>

    <AppCard class="rules-page__card">
      <SectionHeader
        eyebrow="規劃"
        title="未來 Roadmap"
        description="以下項目只是後續方向，尚未在 MVP 中實作。"
      />
      <div class="rules-page__roadmap">
        <article v-for="item in roadmap" :key="item.title" class="rules-page__roadmap-item">
          <AppBadge>{{ item.status }}</AppBadge>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </AppCard>

    <footer class="rules-page__footer">
      <p>
        `/rules` 的責任是說明目前 rule-based analyzer 的行為與限制；實際 PR 判斷仍應由審查者
        對照 Issue 任務範圍與完整 diff。
      </p>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { analyzerConfig } from '@/services/analyzer'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type { AnalysisTone } from '@/types/analysis'

// 這些 page data 只用來呈現現有 analyzer 規則，不在這裡新增或改變 analyzer behavior。
const deductionRules = [
  {
    label: '缺少任務範圍輸入',
    points: analyzerConfig.deductions.missingScopeInput,
    description: 'Issue 任務範圍或 PR 摘要缺失時，無法確認任務範圍是否對齊。',
  },
  {
    label: '任務範圍衝突',
    points: analyzerConfig.deductions.scopeConflict,
    description: 'PR 內容碰到 Issue 明確禁止的範圍，例如 auth、deployment、database 或 package 變更。',
  },
  {
    label: '缺少變更檔案',
    points: analyzerConfig.deductions.missingChangedFiles,
    description: '變更檔案清單空白時，審查者無法確認檔案範圍。',
  },
  {
    label: '高風險變更檔案',
    points: analyzerConfig.deductions.riskyChangedFiles,
    description: '偵測到 package、deployment、auth、service 或 local config 類型檔案。',
  },
  {
    label: 'Dependency 變更風險',
    points: analyzerConfig.deductions.dependencyWarning,
    description: 'Dependency 變更或 package files 顯示可能新增或改動 dependency。',
  },
  {
    label: 'Secret / 本機設定風險',
    points: analyzerConfig.deductions.secretRisk,
    description: 'PR 提供的資訊包含 .env、token、credential、password 或 API key 類型訊號。',
  },
  {
    label: '缺少 build / test 訊號',
    points: analyzerConfig.deductions.missingTests,
    description: 'build / test 結果顯示 tests/build 未執行或未驗證。',
  },
  {
    label: '失敗的 build / test 訊號',
    points: analyzerConfig.deductions.failedTests,
    description: 'build / test 結果包含 failed、failure 或 error 訊號。',
  },
]

const riskMapping: Array<{
  range: string
  risk: string
  action: string
  tone: AnalysisTone
  description: string
}> = [
  {
    range: '90-100',
    risk: '低風險',
    action: '可進入審查',
    tone: 'success',
    description: 'PR 看起來和 Issue 任務範圍對齊，仍需審查者做最後確認。',
  },
  {
    range: '70-89',
    risk: '中風險',
    action: '需要人工確認',
    tone: 'warning',
    description: '有部分訊號需要人工檢查，例如測試不足或 dependency 變更。',
  },
  {
    range: '0-69',
    risk: '高風險',
    action: '建議要求修改',
    tone: 'danger',
    description: '可能超出 Issue 任務範圍，或碰到 secrets/local config、deployment、package 等高風險變更。',
  },
]

const checkItems = [
  {
    title: 'Issue 任務範圍對齊',
    description: '檢查 PR 摘要與變更檔案是否碰到 Issue 明確禁止的範圍。',
  },
  {
    title: '變更檔案範圍',
    description: '檢查檔案清單是否包含 package、deployment、auth、service 或 local config 類型路徑。',
  },
  {
    title: 'Dependency 變更風險',
    description: '檢查是否有 package files 或 dependency changes，避免小 Issue 偷渡 dependency work。',
  },
  {
    title: 'Secret / 本機設定風險',
    description: '檢查 PR 資訊是否出現 .env、token、credential、password 或 API-key-like 訊號。',
  },
  {
    title: 'build / test 驗證訊號',
    description: '檢查 build / test 結果是否提供 pass/build verified 訊號，或是否明確說 tests 未執行。',
  },
]

const limitations = ['僅支援手動貼上', 'no GitHub API', 'no AI API', 'no database', '僅保存最新本機分析']

const roadmap = [
  {
    title: 'OpenRouter',
    status: '未來',
    description: '未來可作為 AI provider adapter 之一，但目前沒有連線。',
  },
  {
    title: 'OpenCode',
    status: '未來',
    description: '未來可探索 agent workflow 整合，目前不在 MVP 範圍。',
  },
  {
    title: 'OpenAI',
    status: '未來',
    description: '未來若加入 AI API，需透過獨立 Issue 與安全的 backend/proxy 設計。',
  },
  {
    title: 'Gemini',
    status: '未來',
    description: '未來可能作為外部模型選項，目前頁面只說明 rule-based MVP。',
  },
  {
    title: '資料庫同步準備',
    status: '未來',
    description: '目前只存 latest local snapshot；資料庫同步需要另一張 Issue。',
  },
]
</script>

<style scoped>
.rules-page {
  display: grid;
  gap: 24px;
}

.rules-page__hero {
  display: grid;
  gap: 16px;
  max-width: 920px;
}

.rules-page__eyebrow {
  margin: 0;
  color: var(--color-accent-strong);
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
}

.rules-page__hero h1 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(2.15rem, 5vw, 4.2rem);
  line-height: 1.04;
}

.rules-page__hero p,
.rules-page__card p,
.rules-page__footer p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.rules-page__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.rules-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.rules-page__grid--intro {
  align-items: stretch;
}

.rules-page__card {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.rules-page__score-card strong {
  color: var(--color-text);
  font-size: clamp(3rem, 8vw, 5.5rem);
  line-height: 0.95;
}

.rules-page__deductions,
.rules-page__mapping,
.rules-page__check-list,
.rules-page__roadmap {
  display: grid;
  gap: 12px;
}

.rules-page__deductions {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.rules-page__deduction,
.rules-page__mapping-item,
.rules-page__check-item,
.rules-page__roadmap-item {
  display: grid;
  gap: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  background: rgba(5, 10, 22, 0.42);
}

.rules-page__deduction span,
.rules-page__mapping-item strong,
.rules-page__check-item h3,
.rules-page__roadmap-item h3 {
  margin: 0;
  color: var(--color-text);
}

.rules-page__deduction span {
  font-size: 0.9rem;
  font-weight: 800;
}

.rules-page__deduction strong {
  color: #ffc2c2;
  font-size: 1.4rem;
}

.rules-page__plain-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rules-page__plain-list li {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  color: var(--color-text);
  background: rgba(5, 10, 22, 0.42);
  font-weight: 700;
}

.rules-page__roadmap {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.rules-page__footer {
  border-top: 1px solid var(--color-border);
  padding-top: 18px;
}

@media (max-width: 1100px) {
  .rules-page__deductions,
  .rules-page__roadmap {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .rules-page__grid,
  .rules-page__deductions,
  .rules-page__roadmap {
    grid-template-columns: 1fr;
  }
}
</style>
