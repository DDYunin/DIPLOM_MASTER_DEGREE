import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import * as courseApi from '@/entities/course/api'
import { mapCourseWithItemsToTopics, mapUiElementTypeToApi } from '../lib/mappers'
import type { ContentElement, ElementType, Topic } from './types'

export interface CreateElementInput {
  topicId: string
  type: ElementType
  title: string
  meta?: string
}

export interface UpdateElementInput {
  topicId: string
  id: string
  title: string
  meta?: string
  type?: ElementType
}

export const useCourseContentStore = defineStore('course-content', () => {
  const courseId = ref<string | null>(null)
  const topics = ref<Topic[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)

  const totalTopics = computed(() => topics.value.length)
  const totalElements = computed(() =>
    topics.value.reduce((sum, topic) => sum + topic.elements.length, 0)
  )

  const setTopics = (nextTopics: Topic[]) => {
    topics.value = nextTopics
  }

  const loadCourseContent = async (nextCourseId: string) => {
    courseId.value = nextCourseId
    isLoading.value = true

    try {
      const response = await courseApi.fetchCourseWithItems(Number(nextCourseId))
      topics.value = mapCourseWithItemsToTopics(response.sections ?? [])
    } finally {
      isLoading.value = false
    }
  }

  const toggleTopic = (topicId: string) => {
    const topic = topics.value.find((item) => item.id === topicId)
    if (topic) {
      topic.isExpanded = !topic.isExpanded
    }
  }

  const expandAll = () => topics.value.forEach((topic) => (topic.isExpanded = true))
  const collapseAll = () => topics.value.forEach((topic) => (topic.isExpanded = false))

  const createTopic = async (data: { title: string }) => {
    if (!courseId.value) {
      throw new Error('Course id is not set')
    }

    isSaving.value = true
    try {
      const dto = await courseApi.createCourseSection({
        courseId: Number(courseId.value),
        title: data.title,
        sortOrder: topics.value.length
      })

      topics.value.push({
        id: String(dto.id),
        title: dto.title,
        meta: '0 items',
        elements: [],
        isExpanded: true,
        sortOrder: dto.sortOrder
      })
    } finally {
      isSaving.value = false
    }
  }

  const updateTopic = async (id: string, data: { title: string }) => {
    isSaving.value = true
    try {
      const dto = await courseApi.updateCourseSection(Number(id), {
        title: data.title
      })

      const topic = topics.value.find((item) => item.id === id)
      if (topic) {
        topic.title = dto.title
      }
    } finally {
      isSaving.value = false
    }
  }

  const deleteTopic = async (id: string) => {
    isSaving.value = true
    try {
      await courseApi.deleteCourseSection(Number(id))
      topics.value = topics.value.filter((topic) => topic.id !== id)
    } finally {
      isSaving.value = false
    }
  }

  const createElement = async (data: CreateElementInput) => {
    const topic = topics.value.find((item) => item.id === data.topicId)
    if (!topic) {
      throw new Error('Topic not found')
    }

    isSaving.value = true
    try {
      const dto = await courseApi.createCourseSectionItem({
        sectionId: Number(data.topicId),
        title: data.title,
        itemType: mapUiElementTypeToApi(data.type),
        sortOrder: topic.elements.length,
        isPublished: false
      })

      if (data.type === 'assignment') {
        await courseApi.createAssignment({
          itemId: dto.id,
          description: data.meta
        })
      }

      topic.elements.push({
        id: String(dto.id),
        type: data.type,
        title: dto.title,
        meta: data.meta || 'Draft',
        itemId: dto.itemId,
        isPublished: dto.isPublished ?? false,
        sortOrder: dto.sortOrder
      })
      topic.meta = `${topic.elements.length} items`

      return String(dto.id)
    } finally {
      isSaving.value = false
    }
  }

  const updateElement = async (topicId: string, elementId: string, data: UpdateElementInput) => {
    isSaving.value = true
    try {
      const dto = await courseApi.updateCourseSectionItem(Number(elementId), {
        title: data.title,
        itemType: data.type ? mapUiElementTypeToApi(data.type) : undefined
      })

      const topic = topics.value.find((item) => item.id === topicId)
      const element = topic?.elements.find((item) => item.id === elementId)
      if (element) {
        element.title = dto.title
        element.meta = data.meta || element.meta
        if (data.type) {
          element.type = data.type
        }
      }
    } finally {
      isSaving.value = false
    }
  }

  const deleteElement = async (topicId: string, elementId: string) => {
    isSaving.value = true
    try {
      await courseApi.deleteCourseSectionItem(Number(elementId))

      const topic = topics.value.find((item) => item.id === topicId)
      if (topic) {
        topic.elements = topic.elements.filter((element) => element.id !== elementId)
        topic.meta = `${topic.elements.length} items`
      }
    } finally {
      isSaving.value = false
    }
  }

  const reset = () => {
    courseId.value = null
    topics.value = []
  }

  return {
    courseId,
    topics,
    isLoading,
    isSaving,
    totalTopics,
    totalElements,
    loadCourseContent,
    toggleTopic,
    expandAll,
    collapseAll,
    createTopic,
    updateTopic,
    deleteTopic,
    createElement,
    updateElement,
    deleteElement,
    reset,
    setTopics
  }
})
