import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: readonly RouteRecordRaw[] = [{ path: '/guard', component: () => import('../view/guard/Index.vue') }]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
