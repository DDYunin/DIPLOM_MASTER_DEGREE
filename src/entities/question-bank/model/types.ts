export type QuestionType = 'SINGLE' | 'MULTIPLE' | 'TEXT'

export interface QuestionAnswer {
  id?: number
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  points: number
  answers: QuestionAnswer[]
  answerText: string
  order: number
}

export interface QuestionBank {
  id: string
  title: string
  description: string
  questionsCount: number
  lastUpdated: string
  questions: Question[]
}

export interface QuestionFormValues {
  id?: string
  type: QuestionType
  text: string
  points: number
  answers: QuestionAnswer[]
}
