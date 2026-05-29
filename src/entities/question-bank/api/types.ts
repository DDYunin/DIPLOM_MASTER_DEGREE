export type BackendQuestionType = 'SINGLE' | 'MULTIPLE' | 'TEXT'

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

export interface FetchBankQuestionsParams {
  bankId: string
  limit: number
  offset: number
  questionType?: BackendQuestionType
  filter?: string
}
