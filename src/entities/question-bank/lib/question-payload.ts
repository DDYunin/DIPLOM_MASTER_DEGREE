import type { CreateBankQuestionRequest, UpdateBankQuestionRequest } from '../api/types'
import type { QuestionFormValues } from '../model/types'

const normalizeAnswers = (values: QuestionFormValues) => {
  if (values.type === 'TEXT') {
    return values.answers
      .map((answer) => answer.text.trim())
      .filter(Boolean)
      .map((text) => ({ text, isCorrect: true }))
  }

  return values.answers
    .filter((answer) => answer.text.trim())
    .map((answer) => ({
      text: answer.text.trim(),
      isCorrect: answer.isCorrect
    }))
}

export const buildCreateQuestionPayload = (
  bankId: string,
  values: QuestionFormValues
): CreateBankQuestionRequest => ({
  bankId: Number(bankId),
  text: values.text.trim(),
  type: values.type,
  points: values.points,
  answers: normalizeAnswers(values)
})

export const buildUpdateQuestionPayload = (
  bankId: string,
  values: QuestionFormValues
): UpdateBankQuestionRequest => ({
  bankId: Number(bankId),
  text: values.text.trim(),
  type: values.type,
  points: values.points,
  answers: normalizeAnswers(values)
})
