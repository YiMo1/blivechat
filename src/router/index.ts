import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/room',
      component: () => import('../view/room/Index.vue'),
      children: [
        { path: 'chat', component: () => import('../view/room/chat/Index.vue') },
        { path: 'guard', component: () => import('../view/room/guard/Index.vue') },
      ],
    },
  ],
})
