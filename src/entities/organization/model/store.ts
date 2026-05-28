import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as orgApi from '../api'
import {
  buildUpdateDepartmentPayload,
  buildUpdateFacultyPayload,
  buildUpdateFieldOfStudyPayload,
  buildUpdateStudentGroupPayload
} from '../lib/buildPayload'
import {
  mapDepartmentToNode,
  mapFacultyToNode,
  mapFieldOfStudyToNode,
  mapStudentGroupToNode
} from '../lib/mappers'
import { parseOrgNodeDbId, type OrgTreeNode, type TreeHierarchyType } from './types'

export const useOrgStore = defineStore('organization', () => {
  const academicTree = ref<OrgTreeNode[]>([])
  const administrativeTree = ref<OrgTreeNode[]>([])
  const isLoading = ref(false)

  const getTreeByType = (type: TreeHierarchyType) =>
    type === 'academic' ? academicTree : administrativeTree

  const loadRootNodes = async (treeType: TreeHierarchyType) => {
    isLoading.value = true
    try {
      const response = await orgApi.fetchFaculties()
      getTreeByType(treeType).value = response.items.map(mapFacultyToNode)
    } finally {
      isLoading.value = false
    }
  }

  const reloadRootNodes = async (treeType: TreeHierarchyType) => {
    getTreeByType(treeType).value = []
    await loadRootNodes(treeType)
  }

  const loadChildren = async (node: OrgTreeNode, treeType: TreeHierarchyType) => {
    if (!node.data?.originalId) {
      return
    }

    if (node.children && node.children.length > 0) {
      return
    }

    node.loading = true
    const parentId = node.data.originalId

    try {
      let newChildren: OrgTreeNode[] = []

      if (treeType === 'administrative' && node.type === 'faculty') {
        const response = await orgApi.fetchDepartmentsByFaculty(parentId)
        newChildren = response.items.map(mapDepartmentToNode)
      } else if (treeType === 'academic') {
        if (node.type === 'faculty') {
          const response = await orgApi.fetchFieldsOfStudyByFaculty(parentId)
          newChildren = response.items.map(mapFieldOfStudyToNode)
        } else if (node.type === 'fieldOfStudy') {
          const response = await orgApi.fetchStudentGroupsByFieldOfStudy(parentId)
          newChildren = response.items.map(mapStudentGroupToNode)
        }
      }

      node.children = newChildren
      node.leaf = newChildren.length === 0
    } catch (error) {
      console.error('Failed to load children', error)
      node.children = []
      node.leaf = true
      throw error
    } finally {
      node.loading = false
    }
  }

  const insertNode = (treeType: TreeHierarchyType, parentKey: string | null, newNode: OrgTreeNode) => {
    const targetTree = getTreeByType(treeType)

    if (!parentKey) {
      targetTree.value.push(newNode)
      return
    }

    const insertToParent = (nodes: OrgTreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.key === parentKey) {
          node.children = [...(node.children ?? []), newNode]
          node.leaf = false
          return true
        }
        if (node.children && insertToParent(node.children)) {
          return true
        }
      }
      return false
    }

    insertToParent(targetTree.value)
  }

  const updateNode = async (treeType: TreeHierarchyType, node: OrgTreeNode) => {
    const dbId = parseOrgNodeDbId(node.key)
    let updatedNode = node

    if (node.type === 'faculty') {
      const dto = await orgApi.updateFaculty(dbId, buildUpdateFacultyPayload(node))
      updatedNode = mapFacultyToNode(dto)
    } else if (node.type === 'department') {
      const dto = await orgApi.updateDepartment(dbId, buildUpdateDepartmentPayload(node))
      updatedNode = mapDepartmentToNode(dto)
    } else if (node.type === 'fieldOfStudy') {
      const dto = await orgApi.updateFieldOfStudy(dbId, buildUpdateFieldOfStudyPayload(node))
      updatedNode = mapFieldOfStudyToNode(dto)
    } else if (node.type === 'group') {
      const dto = await orgApi.updateStudentGroup(dbId, buildUpdateStudentGroupPayload(node))
      updatedNode = mapStudentGroupToNode(dto)
    }

    const targetTree = getTreeByType(treeType)
    const replaceNode = (nodes: OrgTreeNode[]): boolean => {
      for (let index = 0; index < nodes.length; index += 1) {
        if (nodes[index].key === node.key) {
          nodes[index] = {
            ...updatedNode,
            children: nodes[index].children,
            leaf: nodes[index].children?.length ? false : updatedNode.leaf
          }
          return true
        }
        if (nodes[index].children && replaceNode(nodes[index].children!)) {
          return true
        }
      }
      return false
    }

    replaceNode(targetTree.value)
    return updatedNode
  }

  const deleteNode = async (treeType: TreeHierarchyType, node: OrgTreeNode) => {
    const dbId = parseOrgNodeDbId(node.key)

    if (node.type === 'faculty') {
      await orgApi.deleteFaculty(dbId)
    } else if (node.type === 'department') {
      await orgApi.deleteDepartment(dbId)
    } else if (node.type === 'fieldOfStudy') {
      await orgApi.deleteFieldOfStudy(dbId)
    } else if (node.type === 'group') {
      await orgApi.deleteStudentGroup(dbId)
    }

    const targetTree = getTreeByType(treeType)

    const removeRecursively = (nodes: OrgTreeNode[]): boolean => {
      const index = nodes.findIndex((item) => item.key === node.key)
      if (index !== -1) {
        nodes.splice(index, 1)
        return true
      }

      for (const treeNode of nodes) {
        if (treeNode.children && removeRecursively(treeNode.children)) {
          if (treeNode.children.length === 0) {
            treeNode.leaf = true
            treeNode.children = undefined
          }
          return true
        }
      }

      return false
    }

    removeRecursively(targetTree.value)
  }

  return {
    academicTree,
    administrativeTree,
    isLoading,
    loadRootNodes,
    reloadRootNodes,
    loadChildren,
    insertNode,
    updateNode,
    deleteNode
  }
})
