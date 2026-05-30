import { useQuestionBankEntityStore } from './model/store'
import type {
  QuestionBank,
  Question,
  QuestionAnswer,
  QuestionFormValues,
  QuestionType
} from './model/types'
import * as questionBankApi from './api'
import {
  mapBankQuestionToQuestion,
  mapBankToQuestionBank,
  mapBanksToQuestionBanks,
  mapQuestionToFormValues
} from './lib/mappers'
import { buildCreateQuestionPayload, buildUpdateQuestionPayload } from './lib/question-payload'

export {
  type QuestionBank,
  type Question,
  type QuestionAnswer,
  type QuestionFormValues,
  type QuestionType,
  useQuestionBankEntityStore,
  questionBankApi,
  mapBankQuestionToQuestion,
  mapBankToQuestionBank,
  mapBanksToQuestionBanks,
  mapQuestionToFormValues,
  buildCreateQuestionPayload,
  buildUpdateQuestionPayload
}

export type {
  BankDto,
  CreateBankRequest,
  UpdateBankRequest,
  FetchBankQuestionsParams
} from './api/types'
