import { api } from '@/shared/api'
import { courseApiPath } from '@/shared/config/api-routes'

import type {
  BankDto,
  BankQuestionsListResponseDto,
  CreateBankRequest,
  FetchBankQuestionsParams,
  UpdateBankRequest
} from './types'

export const fetchBanks = (userId: number) =>
  api<BankDto[]>(courseApiPath('/banks'), {
    queryParams: { user_id: userId }
  })

export const createBank = (payload: CreateBankRequest) =>
  api<BankDto>(courseApiPath('/banks'), {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateBank = (bankId: string, payload: UpdateBankRequest) =>
  api<BankDto>(courseApiPath(`/banks/${bankId}`), {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

export const deleteBank = (bankId: string) =>
  api<void>(courseApiPath(`/banks/${bankId}`), {
    method: 'DELETE'
  })

export const fetchBankQuestions = ({
  bankId,
  limit,
  offset,
  questionType,
  filter
}: FetchBankQuestionsParams) =>
  api<BankQuestionsListResponseDto>(courseApiPath('/bank_questions'), {
    queryParams: {
      bank_id: bankId,
      limit,
      offset,
      question_type: questionType,
      filter
    }
  })
