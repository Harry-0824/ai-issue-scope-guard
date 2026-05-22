<template>
  <header class="app-header">
    <RouterLink class="app-header__brand" to="/" aria-label="AI Issue Scope Guard 首頁">
      AI Issue Scope Guard
    </RouterLink>

    <nav class="app-header__nav" aria-label="主要導覽">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        class="app-header__link"
        :to="item.to"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

// RouterLink 會攔截點擊並更新 Vue Router 狀態，不會像一般 <a> 造成整頁重新載入。
// 導覽資料集中在陣列中，未來新增頁面時可以避免複製三段相同的 markup。
const navItems = [
  { to: '/', label: '首頁' },
  { to: '/checker', label: 'Scope Checker' },
  { to: '/rules', label: '規則說明' },
]
</script>

<style scoped>
.app-header {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 0;
}

.app-header__brand {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
}

.app-header__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.app-header__link {
  color: var(--color-text-muted);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  padding: 8px 12px;
  font-size: 0.92rem;
  text-decoration: none;
}

.app-header__link:hover,
.app-header__link.router-link-active {
  color: var(--color-text);
  border-color: var(--color-border);
  background: var(--color-surface);
}

@media (max-width: 640px) {
  .app-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .app-header__nav {
    justify-content: flex-start;
  }
}
</style>
