export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  type: QuestionType
  difficulty: Difficulty
  text: string
  answerText: string // "Correct Answer: ..." или "Keywords: ..."
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
