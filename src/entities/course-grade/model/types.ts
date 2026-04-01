export interface AssignmentGrade {
  score: number | string // число или статус "Late", "--"
  maxScore: number
}

export interface StudentGradeRow {
  id: string
  student: {
    name: string
    email: string
    avatarInitials: string
    avatarColor: string
  }
  group: string
  grades: {
    quiz1: AssignmentGrade
    midterm: AssignmentGrade
    essay: AssignmentGrade
    final: AssignmentGrade
  }
  totalPercent: number
}
