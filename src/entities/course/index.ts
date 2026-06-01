import { useCourseStore } from './model/store'
import { useStudentCourseStore } from './model/student-course.store'
import CourseCard from './ui/CourseCard.vue'
import StudentCourseCard from './ui/StudentCourseCard.vue'
import * as courseApi from './api'

import type { Course } from './model/types'
import type { CourseFormValues } from './lib/buildPayload'

export {
  useCourseStore,
  useStudentCourseStore,
  courseApi,
  CourseCard,
  StudentCourseCard,
  type Course,
  type StudentCourse,
  type Instructor,
  type StudentCourseDetails,
  type CourseElement,
  type CourseFormValues
}
