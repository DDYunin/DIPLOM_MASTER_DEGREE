import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QuestionBank } from './types'

export const useQuestionBankStore = defineStore('question-bank', () => {
  // Мок-данные по макету
  const banks = ref<QuestionBank[]>([
    {
      id: 'bank-1',
      title: 'Biology Basics',
      description: 'Intro to cell structure and function',
      questionsCount: 12,
      lastUpdated: 'Oct 24',
      questions: [
        {
          id: 'q-1',
          type: 'multiple-choice',
          difficulty: 'easy',
          text: 'Which organelle is responsible for cellular respiration?',
          answerText: 'Correct Answer: Mitochondria',
          order: 1
        },
        {
          id: 'q-2',
          type: 'true-false',
          difficulty: 'medium',
          text: 'Plant cells do not have a cell wall.',
          answerText: 'Correct Answer: False',
          order: 2
        },
        {
          id: 'q-3',
          type: 'short-answer',
          difficulty: 'hard',
          text: 'Describe the process of photosynthesis in one sentence.',
          answerText: 'Keywords: sunlight, energy, sugar, chlorophyll',
          order: 3
        }
      ]
    },
    {
      id: 'bank-2',
      title: 'Chemistry 101',
      description: 'Periodic table and bonding concepts',
      questionsCount: 25,
      lastUpdated: 'Oct 20',
      questions: []
    },
    {
      id: 'bank-3',
      title: 'Physics: Motion',
      description: "Newton's laws and kinematics",
      questionsCount: 8,
      lastUpdated: 'Oct 15',
      questions: []
    },
    {
      id: 'bank-4',
      title: 'General Science',
      description: 'Mixed topics for final review',
      questionsCount: 30,
      lastUpdated: 'Sep 30',
      questions: []
    },
    {
      id: 'bank-5',
      title: 'Biology Basics',
      description: 'Intro to cell structure and function',
      questionsCount: 12,
      lastUpdated: 'Oct 24',
      questions: [
        {
          id: 'q-11',
          type: 'multiple-choice',
          difficulty: 'easy',
          text: 'Which organelle is responsible for cellular respiration?',
          answerText: 'Correct Answer: Mitochondria',
          order: 1
        },
        {
          id: 'q-22',
          type: 'true-false',
          difficulty: 'medium',
          text: 'Plant cells do not have a cell wall.',
          answerText: 'Correct Answer: False',
          order: 2
        },
        {
          id: 'q-33',
          type: 'short-answer',
          difficulty: 'hard',
          text: 'Describe the process of photosynthesis in one sentence.',
          answerText: 'Keywords: sunlight, energy, sugar, chlorophyll',
          order: 3
        }
      ]
    },
    {
      id: 'bank-6',
      title: 'Chemistry 101',
      description: 'Periodic table and bonding concepts',
      questionsCount: 25,
      lastUpdated: 'Oct 20',
      questions: []
    },
    {
      id: 'bank-7',
      title: 'Physics: Motion',
      description: "Newton's laws and kinematics",
      questionsCount: 8,
      lastUpdated: 'Oct 15',
      questions: []
    },
    {
      id: 'bank-8',
      title: 'General Science',
      description: 'Mixed topics for final review',
      questionsCount: 30,
      lastUpdated: 'Sep 30',
      questions: []
    }
  ])

  const selectedBankId = ref<string | null>(null)

  const selectedBank = computed(
    () => banks.value.find((b) => b.id === selectedBankId.value) || null
  )

  const selectBank = (id: string) => {
    selectedBankId.value = id
  }

  const clearSelection = () => {
    selectedBankId.value = null
  }

  const totalBanks = computed(() => banks.value.length)

  return { banks, selectedBankId, selectedBank, totalBanks, selectBank, clearSelection }
})
