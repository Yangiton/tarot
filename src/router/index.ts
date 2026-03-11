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
          component: () => import('@/pages/Home.vue')
        },
        {
          path: 'reading',
          name: 'reading',
          component: () => import('@/pages/Reading.vue')
        },
        {
          path: 'library',
          name: 'library',
          component: () => import('@/pages/Library.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/Settings.vue')
        }
      ]
    }
  ]
})

export default router
