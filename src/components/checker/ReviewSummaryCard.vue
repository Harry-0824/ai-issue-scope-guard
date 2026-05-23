<template>
  <AppCard class="review-summary-card">
    <SectionHeader eyebrow="Review Summary" title="審查摘要" />
    <p>{{ summary || '尚未產生 demo review summary。' }}</p>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

defineProps<{
  summary: string
}>()
</script>

<style scoped>
.review-summary-card {
  display: grid;
  gap: 16px;
  padding: 24px;
}

.review-summary-card p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
}
</style>
