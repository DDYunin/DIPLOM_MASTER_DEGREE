import type {
  DepartmentDto,
  FacultyDto,
  FieldOfStudyDto,
  StudentGroupDto
} from '../api/types'
import type { OrgTreeNode } from '../model/types'

export const mapFacultyToNode = (dto: FacultyDto): OrgTreeNode => ({
  key: `faculty-${dto.id}`,
  label: dto.name,
  type: 'faculty',
  leaf: false,
  data: { originalId: dto.id, shortName: dto.shortName }
})

export const mapDepartmentToNode = (dto: DepartmentDto): OrgTreeNode => ({
  key: `dept-${dto.id}`,
  label: dto.name,
  type: 'department',
  leaf: true,
  data: { originalId: dto.id, parentId: dto.facultyId, facultyId: dto.facultyId }
})

export const mapFieldOfStudyToNode = (dto: FieldOfStudyDto): OrgTreeNode => ({
  key: `field-${dto.id}`,
  label: dto.name,
  type: 'fieldOfStudy',
  leaf: false,
  data: { originalId: dto.id, parentId: dto.facultyId, facultyId: dto.facultyId }
})

export const mapStudentGroupToNode = (dto: StudentGroupDto): OrgTreeNode => ({
  key: `group-${dto.id}`,
  label: dto.name,
  type: 'group',
  leaf: true,
  data: {
    originalId: dto.id,
    parentId: dto.fieldOfStudyId,
    facultyId: dto.facultyId,
    fieldOfStudyId: dto.fieldOfStudyId
  }
})

export const mapFacultyDtoToNode = mapFacultyToNode
export const mapDepartmentDtoToNode = mapDepartmentToNode
export const mapFieldOfStudyDtoToNode = mapFieldOfStudyToNode
export const mapStudentGroupDtoToNode = mapStudentGroupToNode
