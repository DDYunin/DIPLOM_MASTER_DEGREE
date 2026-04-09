import { createRouter, createWebHistory } from 'vue-router'
import { LoginPage } from '@/pages/login'

// Страницы, относящиеся к админу
import { AdminRoot } from '@/pages/admin-root'
import { UsersPage } from '@/pages/users'
import { StudentProfilePage } from '@/pages/student-profile'
import { TeacherProfilePage } from '@/pages/teacher-profile'
import { AdminProfilePage } from '@/pages/admin-profile'
import { OrganizationPage } from '@/pages/organization'

// Страницы, относящиеся к преподавателю
import { TeacherRoot } from '@/pages/teacher-root'
import { TeacherCoursesPage } from '@/pages/teacher-courses'
import { TeacherAddCoursePage } from '@/pages/teacher-add-course'
import {
  TeacherCourseDetailsPage,
  CourseMainInfoTab,
  CourseContentTab,
  CourseParticipantsTab,
  CourseGradesTab
} from '@/pages/teacher-course-details'
import { TeacherQuestionBanksPage } from '@/pages/teacher-question-banks'
import { TeacherBankQuestionsPage } from '@/pages/teacher-bank-questions'
import { TeacherProfilePage as TeacherPersonalProfilePage } from '@/pages/teacher-personal-profile'

// Страницы, относящиеся к студенту
import { StudentRoot } from '@/pages/student-root'
import { StudentCoursesPage } from '@/pages/student-courses'
import { StudentPersonalProfile } from '@/pages/student-personal-profile'

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
          component: () => import('@/shared/ui').then((m) => m.EmptyLayout),
          children: [
            {
              path: '',
              name: 'admin-users',
              component: UsersPage
            },
            {
              path: 'student/:id',
              name: 'admin-student-profile',
              component: StudentProfilePage
            },
            {
              path: 'teacher/:id',
              name: 'admin-teacher-profile',
              component: TeacherProfilePage
            }
          ]
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
    },
    {
      path: '/teacher',
      component: TeacherRoot,
      children: [
        {
          path: '',
          redirect: { name: 'teacher-courses' }
        },
        {
          path: 'courses',
          component: () => import('@/shared/ui').then((m) => m.EmptyLayout),
          children: [
            {
              path: '',
              name: 'teacher-courses',
              component: TeacherCoursesPage
            },
            {
              path: 'new',
              name: 'teacher-add-course',
              component: TeacherAddCoursePage
            },
            {
              path: ':id',
              name: 'teacher-course-details',
              component: TeacherCourseDetailsPage,
              children: [
                {
                  path: '',
                  redirect: { name: 'course-main-info' } // По умолчанию кидаем на первую вкладку
                },
                {
                  path: 'info',
                  name: 'course-main-info',
                  component: CourseMainInfoTab
                },
                {
                  path: 'content',
                  name: 'course-content',
                  component: CourseContentTab
                },
                {
                  path: 'participants',
                  name: 'course-participants',
                  component: CourseParticipantsTab
                },
                {
                  path: 'grades',
                  name: 'course-grades',
                  component: CourseGradesTab
                }
              ]
            }
          ]
        },
        {
          path: 'question-banks',
          component: () => import('@/shared/ui').then((m) => m.EmptyLayout),
          children: [
            {
              path: '',
              name: 'teacher-question-banks',
              component: TeacherQuestionBanksPage
            },
            {
              path: ':bankId',
              name: 'teacher-bank-questions',
              component: TeacherBankQuestionsPage
            }
          ]
        },
        {
          path: 'profile',
          name: 'teacher-profile',
          component: TeacherPersonalProfilePage
        }
      ]
    },
    {
      path: '/student',
      component: StudentRoot,
      children: [
        {
          path: '',
          redirect: { name: 'student-courses' }
        },
        {
          path: 'courses',
          component: () => import('@/shared/ui').then((m) => m.EmptyLayout),
          children:[
            {
              path: '',
              name: 'student-courses',
              component: StudentCoursesPage
            },
            // В будущем здесь будет страница конкретного курса:
            // {
            //   path: ':id',
            //   name: 'student-course-details',
            //   component: StudentCourseDetailsPage
            // }
          ]
        },
        {
          path: 'profile',
          name: 'student-personal-profile',
          component: StudentPersonalProfile
        }
      ]
    }
  ]
})
