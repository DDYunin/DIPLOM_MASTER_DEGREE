import type { OrgTreeNode, OrgUnitType, TreeHierarchyType } from '@/entities/organization'

export const resolveChildType = (
  parentNode: OrgTreeNode | null,
  hierarchyType: TreeHierarchyType
): OrgUnitType => {
  if (!parentNode) {
    return 'faculty'
  }

  if (hierarchyType === 'administrative') {
    return parentNode.type === 'faculty' ? 'department' : 'department'
  }

  if (parentNode.type === 'faculty') {
    return 'fieldOfStudy'
  }

  if (parentNode.type === 'fieldOfStudy') {
    return 'group'
  }

  return 'group'
}

export const canAddOrgUnit = (
  parentNode: OrgTreeNode | null,
  hierarchyType: TreeHierarchyType
): boolean => {
  if (!parentNode) {
    return true
  }

  if (hierarchyType === 'administrative') {
    return parentNode.type === 'faculty'
  }

  return parentNode.type === 'faculty' || parentNode.type === 'fieldOfStudy'
}
