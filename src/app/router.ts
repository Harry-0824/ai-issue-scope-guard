import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import CheckerPage from '@/pages/CheckerPage.vue'
import LandingPage from '@/pages/LandingPage.vue'
import RulesPage from '@/pages/RulesPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
  },
  {
    path: '/checker',
    name: 'checker',
    component: CheckerPage,
  },
  {
    path: '/rules',
    name: 'rules',
    component: RulesPage,
  },
]

// createWebHistory 讓網址維持乾淨路徑，例如 /checker，而不是 hash route。
// 這符合未來 Netlify SPA fallback 的方向，但本 Issue 不新增部署設定。
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
