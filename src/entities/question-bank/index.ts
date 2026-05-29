import { useQuestionBankEntityStore } from './model/store'
import type { QuestionBank, Question, QuestionType, Difficulty } from './model/types'
import * as questionBankApi from './api'
import {
  mapBankQuestionToQuestion,
  mapBankToQuestionBank,
  mapBanksToQuestionBanks
} from './lib/mappers'

export {
  useQuestionBankEntityStore,
  type QuestionBank,
  type Question,
  type QuestionType,
  type Difficulty,
  questionBankApi,
  mapBankQuestionToQuestion,
  mapBankToQuestionBank,
  mapBanksToQuestionBanks
}

export type {
  BankDto,
  CreateBankRequest,
  UpdateBankRequest,
  FetchBankQuestionsParams
} from './api/types'
