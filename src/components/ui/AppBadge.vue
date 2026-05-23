<template>
  <span class="app-badge" :class="`app-badge--${tone}`">
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'neutral' | 'success' | 'warning' | 'danger'
  }>(),
  {
    tone: 'neutral',
  },
)
</script>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  width: max-content;
  min-height: 26px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  padding: 0 10px;
  color: var(--color-text-muted);
  background: rgba(131, 154, 196, 0.1);
  font-size: 0.78rem;
  font-weight: 700;
}

.app-badge--success {
  color: #b9f7d0;
  border-color: rgba(62, 207, 142, 0.34);
  background: rgba(62, 207, 142, 0.12);
}

.app-badge--warning {
  color: #ffe6a8;
  border-color: rgba(245, 184, 74, 0.36);
  background: rgba(245, 184, 74, 0.12);
}

.app-badge--danger {
  color: #ffc2c2;
  border-color: rgba(255, 91, 110, 0.38);
  background: rgba(255, 91, 110, 0.13);
}
</style>
