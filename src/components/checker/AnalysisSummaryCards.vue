<template>
  <div class="analysis-summary-cards">
    <div class="analysis-summary-cards__card">
      <span>Scope Match Score</span>
      <strong>{{ result?.score ?? '--' }}</strong>
    </div>
    <div class="analysis-summary-cards__card">
      <span>Risk Level</span>
      <strong>{{ result?.riskLabel ?? 'Not analyzed' }}</strong>
    </div>
    <div class="analysis-summary-cards__card">
      <span>Suggested Action</span>
      <strong>{{ result?.suggestedAction ?? 'Load example' }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DemoAnalysisResult } from '@/data/checkerExamples'

defineProps<{
  result: DemoAnalysisResult | null
}>()
</script>

<style scoped>
.analysis-summary-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.analysis-summary-cards__card {
  display: grid;
  gap: 8px;
  min-height: 112px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  background: rgba(5, 10, 22, 0.5);
}

.analysis-summary-cards__card span {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.analysis-summary-cards__card strong {
  color: var(--color-text);
  font-size: 1.4rem;
  line-height: 1.15;
}

@media (max-width: 820px) {
  .analysis-summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
