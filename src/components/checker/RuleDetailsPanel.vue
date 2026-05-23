<template>
  <AppCard class="rule-details-panel">
    <SectionHeader eyebrow="Rule Details" title="規則細節" />
    <div v-if="rules.length" class="rule-details-panel__list">
      <article v-for="rule in rules" :key="rule.id" class="rule-details-panel__item">
        <div>
          <h4>{{ rule.label }}</h4>
          <p>{{ rule.reason }}</p>
        </div>
        <AppBadge :tone="rule.matched ? 'success' : 'danger'">
          {{ rule.matched ? 'Matched' : 'Needs Review' }}
        </AppBadge>
      </article>
    </div>
    <p v-else class="rule-details-panel__empty">尚未產生 rule details。</p>
  </AppCard>
</template>

<script setup lang="ts">
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type { AnalysisRuleDetail } from '@/types/analysis'

defineProps<{
  rules: AnalysisRuleDetail[]
}>()
</script>

<style scoped>
.rule-details-panel {
  display: grid;
  gap: 16px;
  padding: 24px;
}

.rule-details-panel__list {
  display: grid;
  gap: 12px;
}

.rule-details-panel__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  background: rgba(5, 10, 22, 0.42);
}

.rule-details-panel__item h4,
.rule-details-panel__item p,
.rule-details-panel__empty {
  margin: 0;
}

.rule-details-panel__item h4 {
  color: var(--color-text);
  font-size: 0.95rem;
}

.rule-details-panel__item p,
.rule-details-panel__empty {
  margin-top: 6px;
  color: var(--color-text-muted);
  line-height: 1.55;
}

@media (max-width: 640px) {
  .rule-details-panel__item {
    display: grid;
  }
}
</style>
