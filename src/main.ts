import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './app/App.vue'
import { router } from './app/router'
import './styles/tokens.css'
import './styles/global.css'

const app = createApp(App)

// Pinia 在這裡只先註冊成 Vue plugin，讓未來需要跨頁共享狀態時有一致入口。
// 本 Issue 不建立 business store，避免把 analyzer 或 persistence 提早塞進全域狀態。
app.use(createPinia())

// Vue Router 也是 plugin；註冊後，App 內的 <RouterView> 與 <RouterLink> 才會取得目前路由狀態。
app.use(router)

app.mount('#app')
