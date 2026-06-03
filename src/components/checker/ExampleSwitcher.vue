<template>
  <div class="example-switcher" aria-label="PR 範例">
    <AppButton
      :variant="selectedExample === 'good' ? 'primary' : 'secondary'"
      @click="$emit('load-example', 'good')"
    >
      良好 PR 範例
    </AppButton>
    <AppButton
      :variant="selectedExample === 'medium' ? 'primary' : 'secondary'"
      @click="$emit('load-example', 'medium')"
    >
      中等風險 PR 範例
    </AppButton>
    <AppButton
      :variant="selectedExample === 'risky' ? 'primary' : 'secondary'"
      @click="$emit('load-example', 'risky')"
    >
      高風險 PR 範例
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import type { CheckerExampleKey } from '@/data/checkerExamples'
import AppButton from '@/components/ui/AppButton.vue'

defineProps<{
  selectedExample: CheckerExampleKey | null
}>()

defineEmits<{
  'load-example': [example: CheckerExampleKey]
}>()
</script>

<style scoped>
.example-switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
