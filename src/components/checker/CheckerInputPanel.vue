<template>
  <AppCard class="checker-input-panel">
    <div class="checker-input-panel__header">
      <SectionHeader
        eyebrow="手動輸入"
        title="貼上 Issue / PR 資訊"
        description="使用 PR 範例或手動輸入，透過 analyzer 檢查任務範圍，並保存最後一次分析。"
      />
      <ExampleSwitcher :selected-example="selectedExample" @load-example="$emit('load-example', $event)" />
    </div>

    <div class="checker-input-panel__fields">
      <CheckerInputField
        v-for="field in fields"
        :id="field.id"
        :key="field.key"
        :label="field.label"
        :model-value="input[field.key]"
        :placeholder="field.placeholder"
        :rows="field.rows"
        @update:model-value="$emit('update-field', field.key, $event)"
      />
    </div>

    <div class="checker-input-panel__actions">
      <AppButton class="checker-input-panel__action" @click="$emit('analyze')">
        開始分析
      </AppButton>
      <AppButton variant="secondary" class="checker-input-panel__action" @click="$emit('clear')">
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
    placeholder: '貼上 GitHub Issue 的任務範圍、驗收條件與不包含項目...',
    rows: 6,
  },
  {
    key: 'prSummary',
    id: 'pr-summary',
    label: 'PR 摘要',
    placeholder: '貼上 PR 摘要或實作說明...',
    rows: 5,
  },
  {
    key: 'changedFiles',
    id: 'changed-files',
    label: '變更檔案',
    placeholder: '貼上 changed files 清單...',
    rows: 5,
  },
  {
    key: 'testResult',
    id: 'test-result',
    label: 'build / test 結果',
    placeholder: '貼上 build/test 結果...',
    rows: 4,
  },
  {
    key: 'dependencyChanges',
    id: 'dependency-changes',
    label: 'dependency 變更',
    placeholder: '貼上 dependency/package 變更說明...',
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
