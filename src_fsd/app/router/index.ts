import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router';
import { useAuthStore } from '@features/auth/model/authStore';

// Определяем расширение для мета-полей маршрутов
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: ('admin' | 'student' | 'teacher')[];
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@pages/LoginPage.vue'), // Динамический импорт
    meta: { requiresAuth: false },
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@pages/AdminDashboardPage.vue'), // Динамический импорт
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/student/dashboard',
    name: 'student-dashboard',
    component: () => import('@pages/StudentDashboardPage.vue'), // Динамический импорт
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/teacher/dashboard',
    name: 'teacher-dashboard',
    component: () => import('@pages/TeacherDashboardPage.vue'), // Динамический импорт
    meta: { requiresAuth: true, roles: ['teacher'] },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@pages/NotFoundPage.vue'), // Динамический импорт
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Глобальный защитник маршрутов
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Если токен есть, но данные пользователя еще не загружены (например, после обновления страницы)
  // В реальном приложении здесь был бы запрос на /api/me
  // Для нашей заглушки, Pinia стор инициализируется из localStorage при создании,
  // поэтому authStore.isAuthenticated уже будет корректным.
  // Но если бы мы не кэшировали user/role, то здесь нужна была бы логика восстановления сессии.

  const requiresAuth = to.meta.requiresAuth;
  const authorizedRoles = to.meta.roles;

  if (requiresAuth && !authStore.isAuthenticated) {
    // Если маршрут требует авторизации, а пользователь не авторизован, перенаправляем на страницу входа
    next('/login');
  } else if (authStore.isAuthenticated && to.path === '/login') {
    // Если пользователь авторизован и пытается зайти на страницу входа, перенаправляем его на соответствующий дашборд
    if (authStore.role === 'admin') {
      next('/admin/dashboard');
    } else if (authStore.role === 'student') {
      next('/student/dashboard');
    } else if (authStore.role === 'teacher') {
      next('/teacher/dashboard');
    } else {
      // На случай неопределенной роли, можно перенаправить на дефолтную страницу или logout
      next('/');
    }
  } else if (requiresAuth && authorizedRoles && authStore.role && !authorizedRoles.includes(authStore.role)) {
    // Если маршрут требует определенной роли, а у пользователя другая роль,
    // можно перенаправить на страницу "нет доступа" или на его домашнюю страницу
    console.warn(`Пользователь с ролью ${authStore.role} пытается получить доступ к странице для ролей ${authorizedRoles.join(', ')}`);
    // Например, перенаправим на главную страницу, или страницу "доступа нет"
    next('/'); // Или на /access-denied
  } else {
    // Все в порядке, разрешаем переход
    next();
  }
});

export default router;
