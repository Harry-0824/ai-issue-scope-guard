<template>
  <AppCard class="checker-input-panel">
    <div class="checker-input-panel__header">
      <SectionHeader
        eyebrow="手動輸入"
        title="貼上 Issue / PR 資訊"
        description="使用 PR 範例或手動輸入，透過 analyzer 檢查任務範圍，並保存最後一次分析。"
      />
      <ExampleSwitcher
        :selected-example="selectedExample"
        @load-example="$emit('load-example', $event)"
      />
    </div>

    <div class="checker-input-panel__fields">
      <CheckerInputField
        v-for="field in fields"
        :id="field.id"
        :key="field.key"
        :label="field.label"
        :model-value="input[field.key]"
        :helper="field.helper"
        :placeholder="field.placeholder"
        :rows="field.rows"
        @update:model-value="$emit('update-field', field.key, $event)"
      />
    </div>

    <div class="checker-input-panel__actions">
      <AppButton class="checker-input-panel__action" @click="$emit('analyze')">
        開始分析
      </AppButton>
      <AppButton
        variant="secondary"
        class="checker-input-panel__action"
        @click="$emit('clear')"
      >
        清除
      </AppButton>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { CheckerExampleKey, CheckerInput } from '@/data/checkerExamples'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

import CheckerInputField from './CheckerInputField.vue'
import ExampleSwitcher from './ExampleSwitcher.vue'

type FieldConfig = {
  key: keyof CheckerInput
  id: string
  label: string
  placeholder: string
  helper: string
  rows: number
}

defineProps<{
  input: CheckerInput
  selectedExample: CheckerExampleKey | null
}>()

defineEmits<{
  'load-example': [example: CheckerExampleKey]
  'update-field': [field: keyof CheckerInput, value: string]
  analyze: []
  clear: []
}>()

const fields: FieldConfig[] = [
  {
    key: 'issueSpec',
    id: 'issue-spec',
    label: 'Issue 任務範圍',
    placeholder:
      '貼上 GitHub Issue 內容，例如 Goal、Scope、Out of Scope、Acceptance Criteria。',
    helper:
      '建議包含原始 Issue 的 Goal、Scope、Out of Scope 與 Acceptance Criteria。',
    rows: 6,
  },
  {
    key: 'prSummary',
    id: 'pr-summary',
    label: 'PR 摘要',
    placeholder: '貼上 PR Summary，例如實作內容、修改原因、驗證方式。',
    helper: '可從 PR description、Codex 完成摘要或 review notes 貼上。',
    rows: 5,
  },
  {
    key: 'changedFiles',
    id: 'changed-files',
    label: '變更檔案',
    placeholder:
      '每行貼上一個 changed file，例如：\nsrc/pages/CheckerPage.vue\nsrc/components/checker/ReviewVerdictCard.vue',
    helper: '建議每行貼上一個 changed file，讓檔案範圍更容易檢查。',
    rows: 5,
  },
  {
    key: 'testResult',
    id: 'test-result',
    label: 'build / test 結果',
    placeholder:
      '貼上驗證結果，例如：npm run test passed、npm run build passed，或說明未執行原因。',
    helper: '請貼上實際指令結果；如果沒有執行，請明確寫出原因。',
    rows: 4,
  },
  {
    key: 'dependencyChanges',
    id: 'dependency-changes',
    label: 'dependency 變更',
    placeholder:
      '若無變更請填：No dependency changes。若有變更，請列出 package 與原因。',
    helper: '請明確寫出是否有 dependency 變更，避免 reviewer 需要猜測。',
    rows: 4,
  },
]
</script>

<style scoped>
.checker-input-panel {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.checker-input-panel__header {
  display: grid;
  gap: 18px;
}

.checker-input-panel__fields {
  display: grid;
  gap: 18px;
}

.checker-input-panel__actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
}

.checker-input-panel__action {
  width: 100%;
}

@media (max-width: 520px) {
  .checker-input-panel__actions {
    grid-template-columns: 1fr;
  }
}
</style>
