export type ElementType = 'video' | 'file' | 'quiz' | 'assignment'

export interface ContentElement {
  id: string
  type: ElementType
  title: string
  meta: string // например, "10:00 mins", "5 pages", "Due: Oct 12"
}

export interface Topic {
  id: string
  title: string
  meta: string // например, "3 items • 45 mins"
  elements: ContentElement[]
  isExpanded?: boolean // Состояние UI (развернут/свернут)
}
