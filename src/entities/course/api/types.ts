export type CourseStatusDto = 0 | 1

export interface CourseStatsDto {
  totalStudents?: number
}

export interface CourseDto {
  id: number
  title: string
  description?: string
  status: CourseStatusDto
  ownerUserId: number
  coverImageId?: string
  createdAt?: string
  updatedAt?: string
  stats?: CourseStatsDto
}

export interface CoursesStatsResponseDto {
  activeCoursesCount: number
  totalStudents: number
}

export interface CreateCourseRequest {
  title: string
  description?: string
  ownerUserId: number
  coverImageId?: string
}

export interface UpdateCourseRequest {
  title?: string
  description?: string
  ownerUserId?: number
  coverImageId?: string
  status?: CourseStatusDto
}

export interface FetchCoursesQueryParams {
  user_id: number
  role?: string
  filter?: string
}

export interface FetchCourseStatsQueryParams {
  user_id: number
  role?: string
}

export interface CourseSectionItemDto {
  id: number
  sectionId: number
  title: string
  itemType: 'lecture' | 'assignment' | 'test'
  itemId?: number
  sortOrder?: number
  isPublished?: boolean
}

export interface CourseSectionDto {
  id: number
  courseId: number
  title: string
  parentId?: number
  sortOrder?: number
}

export interface CourseSectionWithItemsDto extends CourseSectionDto {
  items: CourseSectionItemDto[]
}

export interface CourseWithItemsDto extends CourseDto {
  sections: CourseSectionWithItemsDto[]
}

export interface CreateCourseSectionRequest {
  courseId: number
  title: string
  parentId?: number
  sortOrder?: number
}

export interface UpdateCourseSectionRequest {
  courseId?: number
  title?: string
  parentId?: number
  sortOrder?: number
}

export interface CreateCourseSectionItemRequest {
  sectionId: number
  title: string
  itemType: 'lecture' | 'assignment' | 'test'
  sortOrder?: number
  isPublished?: boolean
}

export interface UpdateCourseSectionItemRequest {
  sectionId?: number
  title?: string
  itemType?: 'lecture' | 'assignment' | 'test'
  sortOrder?: number
  isPublished?: boolean
}

export interface CreateAssignmentRequest {
  itemId: number
  description?: string
  deadlineDays?: number
  maxScore?: number
}
