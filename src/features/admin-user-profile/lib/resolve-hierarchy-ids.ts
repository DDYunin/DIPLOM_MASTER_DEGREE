import { organizationApi } from '@/entities/organization'
import type { User } from '@/entities/user'

export const resolveHierarchyIds = async (user: User): Promise<User> => {
  const nextUser = { ...user }

  if (user.role === 'Teacher' && user.department) {
    const response = await organizationApi.fetchDepartmentsList({ page: 0, size: 500, sort: 'name,ASC' })
    const department = response.items.find((item) => item.name === user.department)
    if (department) {
      nextUser.departmentId = department.id
    }
  }

  if (user.role === 'Student' && user.group) {
    const response = await organizationApi.fetchStudentGroupsList({ page: 0, size: 500, sort: 'name,ASC' })
    const group = response.items.find((item) => item.name === user.group)
    if (group) {
      nextUser.groupId = group.id
    }
  }

  return nextUser
}
