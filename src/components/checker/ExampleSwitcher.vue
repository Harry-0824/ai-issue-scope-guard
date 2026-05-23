<template>
  <div class="example-switcher" aria-label="Demo examples">
    <AppButton
      :variant="selectedExample === 'good' ? 'primary' : 'secondary'"
      @click="$emit('load-example', 'good')"
    >
      Good PR
    </AppButton>
    <AppButton
      :variant="selectedExample === 'risky' ? 'primary' : 'secondary'"
      @click="$emit('load-example', 'risky')"
    >
      Risky PR
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
