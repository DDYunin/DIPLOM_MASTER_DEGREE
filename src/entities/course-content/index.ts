import { useCourseContentStore } from './model/store'
import { mapSectionsToTopics, mapUiElementTypeToApi } from './lib/mappers'
import type { ElementType, ContentElement, Topic } from './model/types'

export {
  useCourseContentStore,
  mapSectionsToTopics,
  mapUiElementTypeToApi,
  type ElementType,
  type ContentElement,
  type Topic
}