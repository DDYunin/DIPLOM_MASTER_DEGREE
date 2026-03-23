import type {
  FacultyDTO,
  DepartmentDTO,
  FieldOfStudyDTO,
  StudentGroupDTO,
  OrgTreeNode
} from '../model/types'

export const mapFacultyToNode = (dto: FacultyDTO): OrgTreeNode => ({
  key: `faculty-${dto.id}`,
  label: dto.name,
  type: 'faculty',
  leaf: false, // Факультет всегда можно развернуть (внутри кафедры или направления)
  data: { originalId: dto.id, shortName: dto.shortName }
})

export const mapDepartmentToNode = (dto: DepartmentDTO): OrgTreeNode => ({
  key: `dept-${dto.id}`,
  label: dto.name,
  type: 'department',
  leaf: true, // Кафедра — конечный узел
  data: { originalId: dto.id, parentId: dto.facultyId }
})

export const mapFieldOfStudyToNode = (dto: FieldOfStudyDTO): OrgTreeNode => ({
  key: `field-${dto.id}`,
  label: dto.name,
  type: 'fieldOfStudy',
  leaf: false, // Внутри направления лежат группы
  data: { originalId: dto.id, code: dto.code, parentId: dto.facultyId }
})

export const mapStudentGroupToNode = (dto: StudentGroupDTO): OrgTreeNode => ({
  key: `group-${dto.id}`,
  label: dto.name,
  type: 'group',
  leaf: true, // Группа — конечный узел
  data: { originalId: dto.id, parentId: dto.fieldOfStudyId }
})
