<template>
  <section class="checker-page">
    <div class="checker-page__header">
      <p class="checker-page__eyebrow">AI-assisted PR Scope Review</p>
      <div>
        <h1>Scope 分析工作區</h1>
        <p>
          貼上 Issue 與 PR 資訊，使用 Good PR / Risky PR demo 驗證 analyzer、Pinia state 與 latest-only persistence。
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
        @clear="clearCurrentState"
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
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import CheckerInputPanel from '@/components/checker/CheckerInputPanel.vue'
import CheckResultsPanel from '@/components/checker/CheckResultsPanel.vue'
import CopyablePrComment from '@/components/checker/CopyablePrComment.vue'
import ReviewSummaryCard from '@/components/checker/ReviewSummaryCard.vue'
import RuleDetailsPanel from '@/components/checker/RuleDetailsPanel.vue'
import { useAnalysisStore } from '@/stores/analysisStore'
import type { CheckerExampleKey, CheckerInput } from '@/data/checkerExamples'

const analysisStore = useAnalysisStore()
const { input, selectedExample, activeResult } = storeToRefs(analysisStore)
const copyStatus = ref('')

onMounted(() => {
  // 頁面載入時才 restore latest analysis，避免 component 直接碰 localStorage。
  analysisStore.loadLastAnalysis()
})

function loadExample(example: CheckerExampleKey) {
  analysisStore.loadExample(example)
  copyStatus.value = ''
}

function updateField(field: keyof CheckerInput, value: string) {
  analysisStore.updateField(field, value)
  copyStatus.value = ''
}

function analyze() {
  analysisStore.runAnalyzer()
  copyStatus.value = ''
}

function clearCurrentState() {
  analysisStore.clearCurrentState()
  copyStatus.value = ''
}

async function copyPrComment() {
  if (!activeResult.value?.prComment) {
    copyStatus.value = '請先產生分析結果。'
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
