import type { Course } from '../model/types'
import type { CourseDto, CourseStatusDto } from '../api/types'

export const mapStatusDtoToUi = (status: CourseStatusDto): Course['status'] =>
  status === 1 ? 'Active' : 'Draft'

export const mapStatusUiToDto = (status: Course['status']): CourseStatusDto =>
  status === 'Active' ? 1 : 0

export const mapCourseDtoToCourse = (dto: CourseDto): Course => ({
  id: String(dto.id),
  title: dto.title,
  description: dto.description ?? '',
  status: mapStatusDtoToUi(dto.status),
  ownerUserId: dto.ownerUserId,
  coverImageId: dto.coverImageId,
  studentsCount: dto.stats?.totalStudents ?? 0,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
  code: `CRS-${dto.id}`,
  term: dto.updatedAt ? String(new Date(dto.updatedAt).getFullYear()) : '—',
  nextDueLabel: 'Status',
  nextDueDate: mapStatusDtoToUi(dto.status)
})
