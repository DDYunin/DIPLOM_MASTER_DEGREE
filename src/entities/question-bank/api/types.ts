import type { QuestionType } from '../model/types'

export type BackendQuestionType = QuestionType

export interface BankDto {
  id: number
  title: string
  description: string
  userId: number
  questionsCount: number
  createdAt: string
  updatedAt: string
}

export interface BankAnswerDto {
  id: number
  questionId: number
  text: string
  isCorrect: boolean
}

export interface BankQuestionDto {
  id: number
  bankId: number
  text: string
  type: BackendQuestionType
  points: number
  createdAt: string
  answers: BankAnswerDto[]
}

export interface BankQuestionsListMetaDto {
  total: number
  limit: number
  offset: number
}

export interface BankQuestionsListResponseDto {
  data: BankQuestionDto[]
  meta: BankQuestionsListMetaDto
}

export interface BankAnswerRequest {
  text: string
  isCorrect: boolean
}

export interface CreateBankRequest {
  title: string
  description?: string
  userId: number
}

export interface UpdateBankRequest {
  title: string
  description?: string
  userId: number
}

export interface CreateBankQuestionRequest {
  bankId: number
  text: string
  type: QuestionType
  points: number
  answers: BankAnswerRequest[]
}

export interface UpdateBankQuestionRequest {
  bankId: number
  text: string
  type: QuestionType
  points: number
  answers: BankAnswerRequest[]
}

export interface FetchBankQuestionsParams {
  bankId: string
  limit: number
  offset: number
  questionType?: QuestionType
  filter?: string
}
