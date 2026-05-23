<template>
  <textarea
    class="app-textarea"
    :id="id"
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder"
    @input="emitInput"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string
    modelValue: string
    placeholder?: string
    rows?: number
  }>(),
  {
    placeholder: '',
    rows: 5,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function emitInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<style scoped>
.app-textarea {
  width: 100%;
  min-height: 118px;
  resize: vertical;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 13px 14px;
  color: var(--color-text);
  background: rgba(5, 10, 22, 0.64);
  line-height: 1.55;
  outline: none;
}

.app-textarea:focus {
  border-color: rgba(57, 167, 255, 0.72);
  box-shadow: 0 0 0 3px rgba(57, 167, 255, 0.12);
}

.app-textarea::placeholder {
  color: rgba(158, 174, 202, 0.62);
}
</style>
