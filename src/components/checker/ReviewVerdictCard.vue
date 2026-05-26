<template>
  <AppCard class="review-verdict-card">
    <div class="review-verdict-card__header">
      <SectionHeader
        eyebrow="審查結論"
        :title="verdict.title"
        description="根據目前 analyzer 結果整理出的審查判斷。"
      />
      <AppBadge :tone="result.riskTone">{{ result.riskLabel }}</AppBadge>
    </div>

    <dl class="review-verdict-card__list">
      <div>
        <dt>主要原因</dt>
        <dd>{{ verdict.reason }}</dd>
      </div>
      <div>
        <dt>建議下一步</dt>
        <dd>{{ verdict.nextStep }}</dd>
      </div>
    </dl>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type { AnalysisResult, SuggestedActionKey } from '@/types/analysis'

const props = defineProps<{
  result: AnalysisResult
}>()

const verdictCopy: Record<SuggestedActionKey, { reason: string; nextStep: string }> = {
  'ready-to-review': {
    reason: '目前未偵測到明顯的任務範圍、dependency、secret 或 build / test 風險。',
    nextStep: '進行人工確認後即可考慮 merge。',
  },
  'needs-manual-review': {
    reason: '部分檢查項目需要進一步確認。',
    nextStep: '先檢查變更檔案、dependency 變更與 build / test 結果，再決定是否 merge。',
  },
  'request-changes': {
    reason: '分析結果顯示可能有高風險或超出 Issue 任務範圍的變更。',
    nextStep: '要求 Codex 移除 out-of-scope changes，或拆成新的 Issue / PR。',
  },
}

// computed 讓 verdict 文案只依賴現有 AnalysisResult，不新增 analyzer 規則或 score mapping。
const verdict = computed(() => ({
  title: props.result.suggestedAction,
  ...verdictCopy[props.result.suggestedActionKey],
}))
</script>

<style scoped>
.review-verdict-card {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.review-verdict-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.review-verdict-card__list {
  display: grid;
  gap: 12px;
  margin: 0;
}

.review-verdict-card__list div {
  display: grid;
  gap: 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  background: rgba(5, 10, 22, 0.42);
}

.review-verdict-card__list dt,
.review-verdict-card__list dd {
  margin: 0;
}

.review-verdict-card__list dt {
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 800;
}

.review-verdict-card__list dd {
  color: var(--color-text-muted);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .review-verdict-card__header {
    display: grid;
  }
}
</style>
