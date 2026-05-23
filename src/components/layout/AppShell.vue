<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-shell__main">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-shell__main {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  flex: 1;
  padding: 56px 0;
}
</style>
