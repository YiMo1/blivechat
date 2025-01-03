import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/room',
    component: () => import('../view/room/Index.vue'),
    children: [
      { path: 'chat', component: () => import('../view/room/chat/Index.vue') },
      { path: 'guard', component: () => import('../view/room/guard/Index.vue') },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
