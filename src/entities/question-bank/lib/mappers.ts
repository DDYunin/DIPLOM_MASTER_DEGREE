import type { BankDto, BankQuestionDto, BackendQuestionType } from '../api/types'
import type { Difficulty, Question, QuestionBank, QuestionType } from '../model/types'

const QUESTION_TYPE_MAP: Record<BackendQuestionType, QuestionType> = {
  SINGLE: 'multiple-choice',
  MULTIPLE: 'multiple-choice',
  TEXT: 'short-answer'
}

const DEFAULT_DIFFICULTY: Difficulty = 'medium'

export const formatBankUpdatedAt = (isoDate: string, locale = 'en'): string => {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return isoDate
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const buildAnswerText = (question: BankQuestionDto): string => {
  const correctAnswers = question.answers.filter((answer) => answer.isCorrect)

  if (question.type === 'TEXT') {
    if (correctAnswers.length === 0) {
      return 'Keywords: —'
    }

    return `Keywords: ${correctAnswers.map((answer) => answer.text).join(', ')}`
  }

  if (correctAnswers.length === 0) {
    return 'Correct Answer: —'
  }

  return `Correct Answer: ${correctAnswers.map((answer) => answer.text).join(', ')}`
}

export const mapBankQuestionToQuestion = (
  question: BankQuestionDto,
  order: number
): Question => ({
  id: String(question.id),
  type: QUESTION_TYPE_MAP[question.type],
  difficulty: DEFAULT_DIFFICULTY,
  text: question.text,
  answerText: buildAnswerText(question),
  order
})

export const mapBankToQuestionBank = (
  bank: BankDto,
  questions: Question[] = [],
  locale = 'en'
): QuestionBank => ({
  id: String(bank.id),
  title: bank.title,
  description: bank.description ?? '',
  questionsCount: bank.questionsCount,
  lastUpdated: formatBankUpdatedAt(bank.updatedAt, locale),
  questions
})

export const mapBanksToQuestionBanks = (banks: BankDto[], locale = 'en'): QuestionBank[] =>
  banks.map((bank) => mapBankToQuestionBank(bank, [], locale))
