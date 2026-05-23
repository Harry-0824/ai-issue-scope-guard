<template>
  <section class="checker-page">
    <div class="checker-page__header">
      <p class="checker-page__eyebrow">AI-assisted PR Scope Review</p>
      <div>
        <h1>Scope 分析工作區</h1>
        <p>
          貼上 Issue 與 PR 資訊，使用 Good PR / Risky PR demo 驗證基本互動與結果呈現。
        </p>
      </div>
    </div>

    <div class="checker-page__workspace">
      <CheckerInputPanel
        :input="input"
        :selected-example="selectedExample"
        @load-example="loadExample"
        @update-field="updateField"
        @analyze="analyze"
      />

      <div class="checker-page__results">
        <CheckResultsPanel :result="activeResult" />
        <ReviewSummaryCard :summary="activeResult?.reviewSummary ?? ''" />
        <CopyablePrComment
          :comment="activeResult?.prComment ?? ''"
          :copy-status="copyStatus"
          @copy-comment="copyPrComment"
        />
        <RuleDetailsPanel :rules="activeResult?.ruleDetails ?? []" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import CheckerInputPanel from '@/components/checker/CheckerInputPanel.vue'
import CheckResultsPanel from '@/components/checker/CheckResultsPanel.vue'
import CopyablePrComment from '@/components/checker/CopyablePrComment.vue'
import ReviewSummaryCard from '@/components/checker/ReviewSummaryCard.vue'
import RuleDetailsPanel from '@/components/checker/RuleDetailsPanel.vue'
import {
  checkerExamples,
  demoAnalysisResults,
  emptyCheckerInput,
  type CheckerExampleKey,
  type CheckerInput,
  type DemoAnalysisResult,
} from '@/data/checkerExamples'

const input = reactive<CheckerInput>({ ...emptyCheckerInput })
const selectedExample = ref<CheckerExampleKey | null>(null)
const activeResult = ref<DemoAnalysisResult | null>(null)
const copyStatus = ref('')

function loadExample(example: CheckerExampleKey) {
  selectedExample.value = example
  activeResult.value = null
  copyStatus.value = ''

  // reactive 物件不能直接整個換掉，否則 template 既有引用會斷開；逐欄位賦值能保留 Vue 的 reactivity。
  Object.assign(input, checkerExamples[example])
}

function updateField(field: keyof CheckerInput, value: string) {
  // 子元件用 emit 把欄位變更交回頁面，讓資料來源維持單向：page state -> props -> child UI。
  input[field] = value
  copyStatus.value = ''
}

function analyze() {
  const example = selectedExample.value ?? 'good'
  activeResult.value = demoAnalysisResults[example]
  copyStatus.value = ''
}

async function copyPrComment() {
  if (!activeResult.value?.prComment) {
    copyStatus.value = '請先產生 demo 分析結果。'
    return
  }

  await navigator.clipboard.writeText(activeResult.value.prComment)
  copyStatus.value = '已複製 PR 評語。'
}
</script>

<style scoped>
.checker-page {
  display: grid;
  gap: 32px;
}

.checker-page__header {
  display: grid;
  gap: 12px;
  max-width: 820px;
}

.checker-page__eyebrow {
  margin: 0;
  color: var(--color-accent-strong);
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
}

.checker-page__header h1 {
  margin: 0 0 14px;
  color: var(--color-text);
  font-size: clamp(2.15rem, 5vw, 4.4rem);
  line-height: 1.02;
}

.checker-page__header p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 1.08rem;
  line-height: 1.7;
}

.checker-page__workspace {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  align-items: start;
  gap: 24px;
}

.checker-page__results {
  display: grid;
  gap: 18px;
}

@media (max-width: 980px) {
  .checker-page__workspace {
    grid-template-columns: 1fr;
  }
}
</style>
