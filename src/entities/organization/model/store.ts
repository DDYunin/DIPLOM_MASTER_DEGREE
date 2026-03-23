import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { OrgTreeNode, TreeHierarchyType } from './types'
import * as orgApi from '../api'
import {
  mapFacultyToNode,
  mapDepartmentToNode,
  mapFieldOfStudyToNode,
  mapStudentGroupToNode
} from '../lib/mappers'

export const useOrgStore = defineStore('organization', () => {
  const academicTree = ref<OrgTreeNode[]>([])
  const administrativeTree = ref<OrgTreeNode[]>([])
  const isLoading = ref(false)

  const getTreeByType = (type: TreeHierarchyType) => {
    return type === 'academic' ? academicTree : administrativeTree
  }

  // 1. Загрузка корня (Факультетов)
  const loadRootNodes = async (treeType: TreeHierarchyType) => {
    isLoading.value = true
    try {
      const faculties = await orgApi.fetchFaculties()
      getTreeByType(treeType).value = faculties.map(mapFacultyToNode)
    } finally {
      isLoading.value = false
    }
  }

  // 2. Ленивая загрузка дочерних элементов (Lazy Loading)
  const loadChildren = async (node: OrgTreeNode, treeType: TreeHierarchyType) => {
    // Если дети уже загружены, не делаем запрос повторно
    if (!node || !node.data || !node.data.originalId) {
      return
    }
    if (node.children && node.children.length > 0) {
      return
    }

    node.loading = true
    const parentId = node.data.originalId
    let newChildren: OrgTreeNode[] = []

    try {
      if (treeType === 'administrative' && node.type === 'faculty') {
        const depts = await orgApi.fetchDepartments(parentId)
        newChildren = depts.map(mapDepartmentToNode)
      } else if (treeType === 'academic') {
        if (node.type === 'faculty') {
          const fields = await orgApi.fetchFieldsOfStudy(parentId)
          newChildren = fields.map(mapFieldOfStudyToNode)
        } else if (node.type === 'fieldOfStudy') {
          const groups = await orgApi.fetchStudentGroups(parentId)
          newChildren = groups.map(mapStudentGroupToNode)
        }
      }
      // Присваиваем загруженных детей узлу
      node.children = newChildren

      // Если бэкенд ничего не вернул, убираем стрелочку "развернуть"
      if (newChildren.length === 0) {
        node.leaf = true
      }
    } catch (e) {
      console.error('Failed to load children', e)
      // В случае ошибки оставляем пустой массив, чтобы не сломать UI
      node.children = []
      node.leaf = true // Убираем стрелочку, раз загрузить не удалось
    } finally {
      node.loading = false // Выключаем спиннер
    }
  }

  const addNode = async (
    treeType: TreeHierarchyType,
    parentId: string | null,
    newNode: OrgTreeNode
  ) => {
    let serverNode: OrgTreeNode | null = null
    const parentDbId = parentId ? Number(parentId.split('-')[1]) : null

    // 1. Отправляем запрос на бэкенд в зависимости от типа нового узла
    // 1. Отправляем DTO на бэкенд и СРАЗУ мапим ответ в OrgTreeNode
    if (newNode.type === 'faculty') {
      const dto = await orgApi.createFaculty({
        name: newNode.label,
        shortName: newNode.data?.shortName || ''
      })
      serverNode = mapFacultyToNode(dto)
    } else if (newNode.type === 'department' && parentDbId) {
      const dto = await orgApi.createDepartment({ name: newNode.label, facultyId: parentDbId })
      serverNode = mapDepartmentToNode(dto)
    } else if (newNode.type === 'fieldOfStudy' && parentDbId) {
      const dto = await orgApi.createFieldOfStudy({
        name: newNode.label,
        code: newNode.data?.code || '',
        facultyId: parentDbId
      })
      serverNode = mapFieldOfStudyToNode(dto)
    } else if (newNode.type === 'group' && parentDbId) {
      const dto = await orgApi.createStudentGroup({
        name: newNode.label,
        fieldOfStudyId: parentDbId
      })
      serverNode = mapStudentGroupToNode(dto)
    }

    if (!serverNode) {
      return
    }

    // 2. Вставляем готовый и отформатированный узел в локальное дерево
    const targetTree = getTreeByType(treeType)

    if (!parentId) {
      targetTree.value.push(serverNode)
    } else {
      const insertToParent = (nodes: OrgTreeNode[]): boolean => {
        for (const n of nodes) {
          if (n.key === parentId) {
            if (!n.children) {
              n.children = []
            }
            n.children.push(serverNode!)
            n.leaf = false // У родителя появились дети, значит он больше не "лист"
            return true
          }
          if (n.children && insertToParent(n.children)) {
            return true
          }
        }
        return false
      }
      insertToParent(targetTree.value)
    }
  }

  // ОБНОВЛЕНИЕ УЗЛА
  const updateNode = async (treeType: TreeHierarchyType, id: string, updatedNode: OrgTreeNode) => {
    const dbId = Number(id.split('-')[1])

    // Отправляем PATCH-запросы на основе типа
    if (updatedNode.type === 'faculty') {
      await orgApi.updateFaculty(dbId, {
        name: updatedNode.label,
        shortName: updatedNode.data?.shortName
      })
    } else if (updatedNode.type === 'department') {
      await orgApi.updateDepartment(dbId, { name: updatedNode.label })
    } else if (updatedNode.type === 'fieldOfStudy') {
      await orgApi.updateFieldOfStudy(dbId, {
        name: updatedNode.label,
        code: updatedNode.data?.code
      })
    } else if (updatedNode.type === 'group') {
      await orgApi.updateStudentGroup(dbId, { name: updatedNode.label })
    }

    // Рекурсивно находим и обновляем узел в UI-дереве
    const targetTree = getTreeByType(treeType)
    const replaceNode = (nodes: OrgTreeNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].key === id) {
          nodes[i] = { ...nodes[i], ...updatedNode }
          return true
        }
        if (nodes[i].children && replaceNode(nodes[i].children)) return true
      }
      return false
    }

    replaceNode(targetTree.value)
  }

  const deleteNode = async (treeType: TreeHierarchyType, id: string, nodeType: string) => {
    const dbId = Number(id.split('-')[1])

    // 1. Отправляем DELETE-запрос на бэкенд
    if (nodeType === 'faculty') {
      await orgApi.deleteFaculty(dbId)
    } else if (nodeType === 'department') {
      await orgApi.deleteDepartment(dbId)
    } else if (nodeType === 'fieldOfStudy') {
      await orgApi.deleteFieldOfStudy(dbId)
    } else if (nodeType === 'group') {
      await orgApi.deleteStudentGroup(dbId)
    }

    // 2. Рекурсивно находим и удаляем узел из локального дерева
    const targetTree = getTreeByType(treeType)

    const removeRecursively = (nodes: OrgTreeNode[]): boolean => {
      const index = nodes.findIndex((n) => n.key === id)

      // Если нашли узел на текущем уровне — удаляем
      if (index !== -1) {
        nodes.splice(index, 1)
        return true
      }

      // Иначе ищем в детях
      for (const node of nodes) {
        if (node.children && removeRecursively(node.children)) {
          // Если после удаления ребенка массив детей стал пустым — убираем стрелочку
          if (node.children.length === 0) {
            node.leaf = true
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
    loadChildren,
    loadRootNodes,
    addNode,
    updateNode,
    deleteNode
  }
})
