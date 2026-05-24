<template>
  <RouterLink v-if="to" class="app-button" :class="`app-button--${variant}`" :to="to">
    <slot />
  </RouterLink>
  <button v-else class="app-button" :class="`app-button--${variant}`" :type="type">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
    to?: string
  }>(),
  {
    variant: 'primary',
    type: 'button',
  },
)
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: 0 16px;
  color: var(--color-text);
  background: transparent;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    transform 160ms ease;
}

.app-button:hover {
  transform: translateY(-1px);
}

.app-button--primary {
  border-color: rgba(92, 163, 255, 0.42);
  background: linear-gradient(135deg, var(--color-accent-strong), var(--color-accent));
  box-shadow: 0 16px 34px rgba(73, 116, 255, 0.28);
}

.app-button--secondary {
  border-color: var(--color-border);
  background: rgba(16, 26, 48, 0.86);
}

.app-button--ghost {
  color: var(--color-text-muted);
  border-color: transparent;
}
</style>
