import { createRouter, createWebHistory } from 'vue-router'
import { LoginPage } from '@/pages/login'
import { UsersPage } from '@/pages/users'
import { AdminRoot } from '@/pages/admin-root'
import { StudentProfilePage } from '@/pages/student-profile'
import { TeacherProfilePage } from '@/pages/teacher-profile'
import { AdminProfilePage } from '@/pages/admin-profile'
import { OrganizationPage } from '@/pages/organization'

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
      path: '/admin',
      component: AdminRoot,
      children: [
        {
          path: '',
          redirect: { name: 'admin-users' }
        },
        {
          path: 'users',
          name: 'admin-users',
          component: UsersPage
        },
        {
          path: 'users/student/:id',
          name: 'admin-student-profile',
          component: StudentProfilePage
        },
        {
          path: 'users/teacher/:id',
          name: 'admin-teacher-profile',
          component: TeacherProfilePage
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: AdminProfilePage
        },
        {
          path: 'organization',
          name: 'admin-organization',
          component: OrganizationPage
        }
      ]
    }
  ]
})
