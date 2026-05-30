import type { CourseSectionItemDto, CourseSectionWithItemsDto } from '@/entities/course/api/types'

import type { ContentElement, ElementType } from '../model/types'

const mapItemTypeToUi = (itemType: CourseSectionItemDto['itemType']): ElementType => {
  switch (itemType) {
    case 'assignment':
      return 'assignment'
    case 'test':
      return 'quiz'
    case 'lecture':
    default:
      return 'file'
  }
}

export const mapUiElementTypeToApi = (
  type: ElementType
): CourseSectionItemDto['itemType'] => {
  switch (type) {
    case 'assignment':
      return 'assignment'
    case 'quiz':
      return 'test'
    case 'video':
    case 'file':
    default:
      return 'lecture'
  }
}

export const mapSectionItemToElement = (item: CourseSectionItemDto): ContentElement => ({
  id: String(item.id),
  type: mapItemTypeToUi(item.itemType),
  title: item.title,
  meta: item.isPublished ? 'Published' : 'Draft',
  itemId: item.itemId,
  isPublished: item.isPublished ?? false,
  sortOrder: item.sortOrder
})

export const mapSectionsToTopics = (sections: CourseSectionWithItemsDto[]) =>
  [...sections]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((section) => {
      const elements = [...(section.items ?? [])]
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map(mapSectionItemToElement)

      return {
        id: String(section.id),
        title: section.title,
        meta: `${elements.length} items`,
        elements,
        isExpanded: true,
        sortOrder: section.sortOrder
      }
    })

export const mapCourseWithItemsToTopics = (sections: CourseSectionWithItemsDto[]) =>
  mapSectionsToTopics(sections)
