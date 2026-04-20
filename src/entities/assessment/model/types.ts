export interface AssessmentInfo {
  id: string
  courseId: string
  courseCode: string
  title: string
  type: 'Quiz' | 'Exam' | 'Assignment'
  description: string
  timeLimit: number // в минутах
  totalQuestions: number
  dueDate: string // 'Oct 24, 23:59'
  instructions: string[]
}
