export type QuestionType = 'single-choice' | 'multiple-choice' | 'short-text' | 'long-text'

export interface QuestionOption {
  id: string
  text: string
  description?: string // Для пояснений к ответу, как в макете 1
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  imageUrl?: string // Для картинки с мозгом из макета 1
  options?: QuestionOption[]
  points?: number // "Point Value: 15 pts" из макета 2
}

// Ответ может быть строкой (ID выбранной радио-кнопки или текст эссе) 
// либо массивом строк (для чекбоксов).
export type AnswerValue = string | string[] | null

export interface Answer {
  questionId: string
  value: AnswerValue
  isFlagged: boolean // Для кнопки "Review Later" / "Flag for Review"
}

export interface AssessmentSession {
  id: string
  assessmentId: string
  courseTitle: string // "Advanced Cognitive Psychology"
  title: string // "Quiz Module"
  timeRemaining: number // в секундах
  questions: Question[]
  answers: Record<string, Answer> // Объект для быстрого поиска ответа по questionId
}