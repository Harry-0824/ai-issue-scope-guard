<template>
  <section class="app-card">
    <slot />
  </section>
</template>

<style scoped>
.app-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, rgba(18, 27, 48, 0.94), rgba(10, 16, 31, 0.92));
  box-shadow: var(--shadow-soft);
}
</style>
