export type ElementType = 'video' | 'file' | 'quiz' | 'assignment'

export interface ContentElement {
  id: string
  type: ElementType
  title: string
  meta: string
  itemId?: number
  isPublished?: boolean
  sortOrder?: number
}

export interface Topic {
  id: string
  title: string
  meta: string
  elements: ContentElement[]
  isExpanded?: boolean
  sortOrder?: number
}
