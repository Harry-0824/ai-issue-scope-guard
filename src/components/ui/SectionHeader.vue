<template>
  <div class="section-header">
    <p v-if="eyebrow" class="section-header__eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>

<style scoped>
.section-header {
  display: grid;
  gap: 8px;
}

.section-header__eyebrow {
  margin: 0;
  color: var(--color-accent-strong);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.section-header h2 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(1.35rem, 3vw, 2rem);
  line-height: 1.16;
}

.section-header p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
}
</style>
