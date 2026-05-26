<template>
  <AppCard class="copyable-pr-comment">
    <div class="copyable-pr-comment__header">
      <SectionHeader eyebrow="PR 評語" title="可複製的 PR 評語" />
      <AppButton variant="secondary" @click="copySelectedComment">
        複製 PR 評語
      </AppButton>
    </div>

    <div
      class="copyable-pr-comment__mode-switch"
      role="group"
      aria-label="PR 評語版本"
    >
      <AppButton
        v-for="mode in commentModes"
        :key="mode.value"
        :variant="selectedMode === mode.value ? 'primary' : 'secondary'"
        :aria-pressed="selectedMode === mode.value"
        @click="selectedMode = mode.value"
      >
        {{ mode.label }}
      </AppButton>
    </div>

    <pre>{{ activeComment || '尚未產生可複製的 PR 評語。' }}</pre>
    <p v-if="copyStatus" class="copyable-pr-comment__status">
      {{ copyStatus }}
    </p>
  </AppCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type {
  AnalysisResult,
  CheckResultStatus,
  SuggestedActionKey,
} from '@/types/analysis'

type CommentMode = 'short' | 'detailed'

const commentModes: { value: CommentMode; label: string }[] = [
  { value: 'short', label: '簡短版' },
  { value: 'detailed', label: '詳細版' },
]

const props = defineProps<{
  comment: string
  result: AnalysisResult | null
  copyStatus: string
}>()

const emit = defineEmits<{
  'copy-comment': [comment: string]
}>()

// Vue 的 ref 適合保存只屬於這個元件的 UI 狀態；選擇的複製模式不需要進 Pinia 或 persistence。
const selectedMode = ref<CommentMode>('short')

// computed 讓 template 與複製按鈕共用同一份目前選取的 comment，避免顯示內容和複製內容不同步。
const detailedComment = computed(() => buildDetailedPrComment(props.result))
const activeComment = computed(() => {
  return selectedMode.value === 'short' ? props.comment : detailedComment.value
})

watch(
  () => props.result,
  () => {
    selectedMode.value = 'short'
  },
)

function copySelectedComment() {
  emit('copy-comment', activeComment.value)
}

function buildDetailedPrComment(result: AnalysisResult | null) {
  if (!result) {
    return ''
  }

  const checkLines = result.checkResults
    .map((check) => `- ${check.title}：${formatCheckStatus(check.status)}`)
    .join('\n')

  return [
    '## Scope Guard Review',
    '',
    `結論：${result.riskLabel} / ${result.suggestedAction}`,
    `分數：${result.score}`,
    '',
    '主要檢查結果：',
    checkLines,
    '',
    `審查摘要：${result.reviewSummary}`,
    '',
    `建議下一步：${formatNextStep(result.suggestedActionKey)}`,
  ].join('\n')
}

function formatCheckStatus(status: CheckResultStatus) {
  if (status === 'pass') {
    return '通過'
  }

  if (status === 'warning') {
    return '需人工確認'
  }

  return '高風險'
}

function formatNextStep(action: SuggestedActionKey) {
  if (action === 'ready-to-review') {
    return '進行人工確認後即可考慮 merge。'
  }

  if (action === 'needs-manual-review') {
    return '請針對警示項目進行人工 review，再決定是否 merge。'
  }

  return '建議先要求修正 out-of-scope 或高風險項目，再重新檢查。'
}
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

.copyable-pr-comment__mode-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
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
