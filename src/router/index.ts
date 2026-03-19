import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/Home.vue'),
          meta: { hideNav: true },
        },
        {
          path: 'divination',
          name: 'divination',
          component: () => import('@/pages/Divination.vue'),
        },
        {
          path: 'spreads',
          name: 'spreads',
          component: () => import('@/pages/Spreads.vue'),
        },
        {
          path: 'reading',
          name: 'reading',
          component: () => import('@/pages/Reading.vue'),
        },
        {
          path: 'library',
          name: 'library',
          component: () => import('@/pages/Library.vue'),
        },
        {
          path: 'library/:deckId',
          name: 'library-deck',
          component: () => import('@/pages/Library.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/Settings.vue'),
        },
      ],
    },
  ],
})

export default router
