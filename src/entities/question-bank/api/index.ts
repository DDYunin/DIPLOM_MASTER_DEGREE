import { api } from '@/shared/api'
import type { QuestionBank, Question } from '../model/types'

export const fetchBanks = () => api<QuestionBank[]>('/teacher/question-banks')

export const createBank = (data: Partial<QuestionBank>) => 
  api<QuestionBank>('/teacher/question-banks', { method: 'POST', body: JSON.stringify(data) })

export const saveQuestion = (bankId: string, questionData: Partial<Question>) => 
  api<QuestionBank>(`/teacher/question-banks/${bankId}`, { 
    method: 'PATCH', 
    body: JSON.stringify({ question: questionData }) 
  })