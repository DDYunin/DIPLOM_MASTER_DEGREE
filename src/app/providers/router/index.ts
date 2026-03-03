import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/login/ui/LoginPage.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // TODO: заменил на /login
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/',
      name: 'admin',
      component: LoginPage
    }
  ]
})
