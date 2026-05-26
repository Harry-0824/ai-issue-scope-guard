<template>
  <AppCard class="copyable-pr-comment">
    <div class="copyable-pr-comment__header">
      <SectionHeader eyebrow="PR 評語" title="可複製的 PR 評語" />
      <AppButton variant="secondary" @click="$emit('copy-comment')">
        複製 PR 評語
      </AppButton>
    </div>
    <pre>{{ comment || '尚未產生可複製的 PR 評語。' }}</pre>
    <p v-if="copyStatus" class="copyable-pr-comment__status">{{ copyStatus }}</p>
  </AppCard>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

defineProps<{
  comment: string
  copyStatus: string
}>()

defineEmits<{
  'copy-comment': []
}>()
</script>

<style scoped>
.copyable-pr-comment {
  display: grid;
  gap: 16px;
  padding: 24px;
}

.copyable-pr-comment__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.copyable-pr-comment pre {
  min-height: 120px;
  overflow: auto;
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  color: var(--color-text);
  background: rgba(5, 10, 22, 0.58);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.86rem;
  line-height: 1.55;
  white-space: pre-wrap;
}

.copyable-pr-comment__status {
  margin: 0;
  color: var(--color-accent-strong);
  font-size: 0.9rem;
  font-weight: 700;
}

@media (max-width: 640px) {
  .copyable-pr-comment__header {
    display: grid;
  }
}
</style>
