import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Topic, ContentElement } from './types'

export const useCourseContentStore = defineStore('course-content', () => {
  // Мок-данные строго по твоему макету
  const topics = ref<Topic[]>([
    {
      id: 'topic-1',
      title: 'Topic 1: Principles of Design',
      meta: '3 items • 45 mins',
      isExpanded: true,
      elements: [
        { id: 'el-1', type: 'video', title: '1.1 Contrast and Balance', meta: '10:00 mins' },
        { id: 'el-2', type: 'file', title: '1.2 The History of Bauhaus', meta: '5 pages' },
        { id: 'el-3', type: 'quiz', title: 'Unit 1 Assessment', meta: '15 questions • 50 pts' }
      ]
    },
    {
      id: 'topic-2',
      title: 'Topic 2: Color Theory',
      meta: '2 items • 25 mins',
      isExpanded: true,
      elements: [
        { id: 'el-4', type: 'video', title: '2.1 Understanding Hex Codes', meta: '12:30 mins' },
        { id: 'el-5', type: 'assignment', title: 'Create your palette', meta: 'Due: Oct 12' }
      ]
    }
  ])

  // --- Геттеры для правой панели (Content Summary) ---
  const totalTopics = computed(() => topics.value.length)
  const totalElements = computed(() =>
    topics.value.reduce((sum, topic) => sum + topic.elements.length, 0)
  )

  // --- Экшены ---
  const toggleTopic = (topicId: string) => {
    const topic = topics.value.find((t) => t.id === topicId)
    if (topic) {
      topic.isExpanded = !topic.isExpanded
    }
  }

  const expandAll = () => topics.value.forEach((t) => (t.isExpanded = true))
  const collapseAll = () => topics.value.forEach((t) => (t.isExpanded = false))

  const createTopic = (data: { title: string; meta?: string }) => {
    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      title: data.title,
      meta: data.meta || '0 items • 0 mins',
      elements: [],
      isExpanded: true
    }
    topics.value.push(newTopic)
  }

  const updateTopic = (id: string, data: { title: string; meta: string }) => {
    const topic = topics.value.find((t) => t.id === id)
    if (topic) {
      topic.title = data.title
      topic.meta = data.meta
    }
  }

  const deleteTopic = (id: string) => {
    topics.value = topics.value.filter((t) => t.id !== id)
  }

  const createElement = (data: any) => {
    const topic = topics.value.find((t) => t.id === data.topicId)
    if (topic) {
      topic.elements.push({
        id: `el-${Date.now()}`,
        type: data.type,
        title: data.title,
        meta: data.meta
      })
    }
  }

  const updateElement = (topicId: string, elementId: string, data: ContentElement) => {
    const topic = topics.value.find((t) => t.id === topicId)
    if (topic) {
      const elIndex = topic.elements.findIndex((e) => e.id === elementId)
      if (elIndex > -1) {
        topic.elements[elIndex] = { ...topic.elements[elIndex], ...data }
      }
    }
  }

  const deleteElement = (topicId: string, elementId: string) => {
    const topic = topics.value.find((t) => t.id === topicId)
    if (topic) {
      topic.elements = topic.elements.filter((e) => e.id !== elementId)
    }
  }

  return {
    topics,
    totalTopics,
    totalElements,
    toggleTopic,
    expandAll,
    collapseAll,
    createTopic,
    updateTopic,
    deleteTopic,
    /** Создание элемента топика */
    createElement,
    /** Обновление элемента топика */
    updateElement,
    /** Удаление элемента топика */
    deleteElement
  }
})
