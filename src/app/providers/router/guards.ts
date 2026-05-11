import type { Router } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { ROLES, type AppRole } from '@/shared/config/roles'

// Экспортируем функцию, которая принимает экземпляр роутера
export function setupRouterGuards(router: Router) {
  // Глобальный guard
  router.beforeEach((to, from, next) => {
    // ВАЖНО: Вызываем useSessionStore() ИМЕННО ВНУТРИ beforeEach.
    // Если вызвать снаружи, Pinia выдаст ошибку, так как стор еще не инициализирован.
    const sessionStore = useSessionStore()
    const isAuthenticated = sessionStore.isAuth
    const userRole = sessionStore.userRole

    // 1. Требуется авторизация, но пользователь гость
    if (to.meta.requiresAuth && !isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // 2. Страница только для гостей (login), но пользователь авторизован
    if (to.meta.requiresGuest && isAuthenticated) {
      if (userRole === ROLES.ADMIN) {
        return next({ name: 'admin-empty-page' })
      }
      if (userRole === ROLES.TEACHER) {
        return next({ name: 'teacher-empty-page' })
      }
      if (userRole === ROLES.STUDENT) {
        return next({ name: 'student-empty-page' })
      }
      return next('/') // Фоллбэк
    }

    // 3. Проверка ролей (RBAC - Role-Based Access Control)
    if (to.meta.allowedRoles) {
      const allowed = to.meta.allowedRoles as AppRole[]

      // Если у пользователя нет нужной роли для этого маршрута
      if (userRole && !allowed.includes(userRole)) {
        // Возвращаем его на его "домашний" портал
        if (userRole === ROLES.ADMIN) {
          return next({ name: 'admin-empty-page' })
        }
        if (userRole === ROLES.TEACHER) {
          return next({ name: 'teacher-empty-page' })
        }
        if (userRole === ROLES.STUDENT) {
          return next({ name: 'student-empty-page' })
        }
        return next('/login')
      }
    }

    // 4. Если все проверки пройдены, пускаем на страницу
    next()
  })
}
