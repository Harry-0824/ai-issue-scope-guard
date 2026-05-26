<template>
  <AppCard class="check-results-panel">
    <div class="check-results-panel__header">
      <SectionHeader
        eyebrow="分析結果"
        title="分析結果"
        description="依照目前貼上的 Issue / PR 資訊，顯示 rule-based analyzer 的檢查結果。"
      />
      <AppBadge v-if="result" :tone="result.riskTone">{{ result.riskLabel }}</AppBadge>
    </div>

    <AnalysisSummaryCards :result="result" />

    <div v-if="result" class="check-results-panel__list">
      <CheckResultItem v-for="item in result.checkResults" :key="item.id" :result="item" />
    </div>

    <p v-else class="check-results-panel__empty">
      載入「良好 PR 範例」或「高風險 PR 範例」後，點擊「開始分析」查看結果。
    </p>
  </AppCard>
</template>

<script setup lang="ts">
import type { AnalysisResult } from '@/types/analysis'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

import AnalysisSummaryCards from './AnalysisSummaryCards.vue'
import CheckResultItem from './CheckResultItem.vue'

defineProps<{
  result: AnalysisResult | null
}>()
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
