<template>
  <AppCard class="check-results-panel">
    <div class="check-results-panel__header">
      <SectionHeader
        eyebrow="分析結果"
        title="分析結果"
        description="依照目前貼上的 Issue / PR 資訊，顯示 rule-based analyzer 的檢查結果。"
      />
      <AppBadge v-if="result" :tone="result.riskTone">{{
        result.riskLabel
      }}</AppBadge>
    </div>

    <AnalysisSummaryCards :result="result" />

    <div
      v-if="result"
      class="check-results-panel__groups"
      data-testid="check-results-groups"
    >
      <section
        v-for="group in groupedCheckResults"
        :key="group.status"
        class="check-results-panel__group"
      >
        <h3 class="check-results-panel__group-title">
          {{ group.label }} {{ group.items.length }}
        </h3>
        <div class="check-results-panel__list">
          <CheckResultItem
            v-for="item in group.items"
            :key="item.id"
            :result="item"
          />
        </div>
      </section>
    </div>

    <p v-else class="check-results-panel__empty">
      載入「良好 PR 範例」或「高風險 PR 範例」後，點擊「開始分析」查看結果。
    </p>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { AnalysisResult } from '@/types/analysis'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

import AnalysisSummaryCards from './AnalysisSummaryCards.vue'
import CheckResultItem from './CheckResultItem.vue'

const props = defineProps<{
  result: AnalysisResult | null
}>()

const groupDefinitions = [
  { status: 'danger', label: '高風險' },
  { status: 'warning', label: '需人工確認' },
  { status: 'pass', label: '已通過' },
] as const

// computed 會從目前分析結果即時衍生顯示分組；維持 presentation-only，不改 analyzer 輸出內容。
const groupedCheckResults = computed(() => {
  const result = props.result
  if (!result) {
    return []
  }

  return groupDefinitions
    .map((group) => ({
      ...group,
      items: result.checkResults.filter((item) => item.status === group.status),
    }))
    .filter((group) => group.items.length > 0)
})
</script>

<style scoped>
.check-results-panel {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.check-results-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.check-results-panel__groups {
  display: grid;
  gap: 20px;
}

.check-results-panel__group {
  display: grid;
  gap: 12px;
}

.check-results-panel__group-title {
  margin: 0;
  color: var(--color-text);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.check-results-panel__list {
  display: grid;
  gap: 16px;
  padding: 0;
}

.check-results-panel__empty {
  margin: 0;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: 18px;
  color: var(--color-text-muted);
  line-height: 1.65;
}

@media (max-width: 640px) {
  .check-results-panel__header {
    display: grid;
  }
}
</style>
