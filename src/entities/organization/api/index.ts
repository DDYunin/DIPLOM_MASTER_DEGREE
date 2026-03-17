import { api } from '@/shared/api'
import type { OrgTreeNode } from '../model/types'

// Получить всё дерево
export const fetchOrgTree = () => api<OrgTreeNode[]>('/organization/tree')

// Сохранить всё дерево
export const updateOrgTree = (fullTree: OrgTreeNode[]) =>
  api<OrgTreeNode[]>('/organization/tree', {
    method: 'PUT',
    body: JSON.stringify(fullTree)
  })
