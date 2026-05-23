<template>
  <div class="checker-input-field">
    <label :for="id">{{ label }}</label>
    <AppTextarea
      :id="id"
      :model-value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import AppTextarea from '@/components/ui/AppTextarea.vue'

withDefaults(
  defineProps<{
    id: string
    label: string
    modelValue: string
    placeholder?: string
    rows?: number
  }>(),
  {
    placeholder: '',
    rows: 5,
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.checker-input-field {
  display: grid;
  gap: 10px;
}

.checker-input-field label {
  color: var(--color-text);
  font-size: 0.92rem;
  font-weight: 800;
}
</style>
