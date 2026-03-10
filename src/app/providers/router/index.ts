import { createRouter, createWebHistory } from 'vue-router'
import { LoginPage } from '@/pages/login'
import { UsersPage } from '@/pages/users'
import { AdminRoot } from '@/pages/admin-root'
import { StudentProfilePage } from '@/pages/student-profile'
import { TeacherProfilePage } from '@/pages/teacher-profile'

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
          path: 'users', // Роут (/admin/users)
          name: 'admin-users',
          component: UsersPage
        },
        {
          path: 'users/student/:id', // Динамический параметр :id
          name: 'admin-student-profile',
          component: StudentProfilePage
        },
        {
          path: 'users/teacher/:id',
          name: 'admin-teacher-profile',
          component: TeacherProfilePage
        }
      ]
    }
  ]
})
