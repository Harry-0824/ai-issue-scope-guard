<template>
  <div class="checker-input-field">
    <label :for="id">{{ label }}</label>
    <AppTextarea
      :id="id"
      :model-value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :aria-describedby="helper ? `${id}-helper` : undefined"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <p v-if="helper" :id="`${id}-helper`" class="checker-input-field__helper">
      {{ helper }}
    </p>
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
    helper?: string
    rows?: number
  }>(),
  {
    placeholder: '',
    helper: '',
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

.checker-input-field__helper {
  margin: -2px 0 0;
  color: var(--color-text-muted);
  font-size: 0.84rem;
  line-height: 1.55;
}
</style>
