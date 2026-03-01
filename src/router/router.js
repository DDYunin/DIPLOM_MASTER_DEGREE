import { createRouter, createWebHistory } from "vue-router";

// Общие страницы
import AuthPage from "@/views/auth/AuthPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";

// Страницы для администратора
import AdminDashboard from "@/views/admin/AdminDashboard.vue";

// Страницы для студента
import StudentDashboard from "@/views/student/StudentDashboard.vue";
// Подстраницы для студента
import StudentHome from "@/views/student/StudentHome.vue";
import StudentProfile from "@/views/student/StudentProfile.vue";
import StudentCourse from "@/views/student/StudentCourse.vue";
import CourseStats from "@/views/student/CourseStats.vue";
import CourseTest from "@/views/student/CourseTest.vue";
import TestExecution from "@/views/student/TestExecution.vue";
import TestResults from "@/views/student/TestResults.vue";


// Страницы для преподавателя
import TeacherDashboard from "@/views/teacher/TeacherDashboard.vue";


const routes = [
  {
    path: "/",
    redirect: "/auth",
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthPage,
    // Только для неавторизованных пользователей
    meta: { requiresGuest: true },
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
    // Только для администраторов
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/student",
    name: "StudentDashboard",
    component: StudentDashboard,
    // Только для студентов
    meta: { requiresAuth: true, role: "student" },
    children: [
      {
        path: "",
        name: "StudentHome",
        component: StudentHome,
        meta: { title: "Главная" },
      },
      {
        path: "course/:id",
        name: "StudentCourse",
        component: StudentCourse,
        meta: { title: "Курс" },
        props: true,
      },
      {
        path: "profile",
        name: "StudentProfile",
        component: StudentProfile,
        meta: { title: "Профиль" },
      },
      {
        path: "course/:id/stats",
        name: "CourseStats",
        component: CourseStats,
        meta: { title: "Статистика курса" },
        props: true,
      },
      {
        path: "course/:courseId/test/:testId",
        name: "CourseTest",
        component: CourseTest,
        meta: {title: "Тест"},
        props: true,
      },
      {
        path: "course/:courseId/test/:testId/execute",
        name: "TestExecution",
        component: TestExecution,
        meta: { title: "Прохождение теста" },
        props: true,
      },
      {
        path: "/course/:courseId/tests/:testId/results",
        name: "TestResults",
        component: TestResults,
        meta: { title: "Результаты теста" },
        props: true,
      },
    ],
  },
  {
    path: "/teacher",
    name: "TeacherDashboard",
    component: TeacherDashboard,
    // Только для преподавателей
    meta: { requiresAuth: true, role: "teacher" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
