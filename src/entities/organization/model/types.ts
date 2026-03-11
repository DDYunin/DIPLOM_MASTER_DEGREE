export type OrgUnitType = 'university' | 'institute' | 'department' | 'group'

export interface OrgUnitData {
  code?: string
  status?: string
  students?: number
  teachers?: number
  parentDept?: string
  createdDate?: string
  head?: {
    name: string
    avatarInitials: string
  }
  description?: string
  groupId?: string
}

// Формат, требуемый компонентом Tree из PrimeVue
export interface OrgTreeNode {
  key: string
  label: string
  type: OrgUnitType // Используем type для определения иконки и стиля
  data?: OrgUnitData
  children?: OrgTreeNode[]
}
