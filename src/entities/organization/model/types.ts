// Факультеты
export interface FacultyDTO {
  id: number
  name: string
  shortName: string
}

// Кафедры
export interface DepartmentDTO {
  id: number
  name: string
  facultyId: number
}

// Направления подготовки
export interface FieldOfStudyDTO {
  id: number
  code: string
  name: string
  facultyId: number
}

// Группы студентов
export interface StudentGroupDTO {
  id: number
  name: string
  facultyId: number
  fieldOfStudyId: number
}

export type OrgUnitType = 'faculty' | 'department' | 'fieldOfStudy' | 'group'

export interface OrgTreeNode {
  key: string
  label: string
  type: OrgUnitType
  leaf: boolean // Обязательное поле для Lazy Loading (если true — стрелочки "развернуть" не будет)
  loading?: boolean // Показывает спиннер при загрузке детей
  data?: any // Сюда будем складывать оригинальный DTO
  children?: OrgTreeNode[]
}

export type TreeHierarchyType = 'academic' | 'administrative'
