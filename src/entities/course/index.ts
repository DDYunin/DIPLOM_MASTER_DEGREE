import { useCourseStore } from './model/store'
import { useStudentCourseStore } from './model/student-course.store'
import CourseCard from './ui/CourseCard.vue'
import StudentCourseCard from './ui/StudentCourseCard.vue'

import type { StudentCourse, Instructor } from './model/types'

export {
  useCourseStore,
  useStudentCourseStore,
  CourseCard,
  StudentCourseCard,
  type StudentCourse,
  type Instructor
}
