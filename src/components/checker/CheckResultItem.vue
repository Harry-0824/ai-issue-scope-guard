<template>
  <article class="check-result-item">
    <div class="check-result-item__title-row">
      <h4>{{ result.title }}</h4>
      <AppBadge :tone="badgeTone">{{ badgeText }}</AppBadge>
    </div>
    <p>{{ result.detail }}</p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import AppBadge from '@/components/ui/AppBadge.vue'
import type { AnalysisCheckResult } from '@/types/analysis'

const props = defineProps<{
  result: AnalysisCheckResult
}>()

// computed 讓 badge 顯示文字由 result.status 衍生而來；狀態改變時 template 會自動更新。
const badgeText = computed(() => {
  if (props.result.status === 'pass') return 'Pass'
  if (props.result.status === 'warning') return 'Review'
  return 'Risk'
})

const badgeTone = computed(() => {
  if (props.result.status === 'pass') return 'success'
  if (props.result.status === 'warning') return 'warning'
  return 'danger'
})
</script>

<style scoped>
.check-result-item {
  display: grid;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  background: rgba(5, 10, 22, 0.48);
}

.check-result-item__title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.check-result-item__title-row h4 {
  flex: 1;
  margin: 0;
  color: var(--color-text);
  font-size: 0.98rem;
}

.check-result-item p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.58;
}
</style>
