import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  OrgTreeNode,
  FacultyDTO,
  DepartmentDTO,
  FieldOfStudyDTO,
  StudentGroupDTO,
  TreeHierarchyType
} from './types'
import * as orgApi from '../api'

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
      const nodes: OrgTreeNode[] = faculties.map((f: FacultyDTO) => ({
        key: `faculty-${f.id}`,
        label: f.name,
        type: 'faculty',
        leaf: false, // Факультет всегда можно развернуть
        data: { originalId: f.id, shortName: f.shortName }
      }))

      getTreeByType(treeType).value = nodes
    } finally {
      isLoading.value = false
    }
  }

  // 2. Ленивая загрузка дочерних элементов (Lazy Loading)
  const loadChildren = async (node: OrgTreeNode, treeType: TreeHierarchyType) => {
    // Если дети уже загружены, не делаем запрос повторно
    if (node.children && node.children.length > 0) return

    node.loading = true // Включаем спиннер на конкретном узле
    node.children = [] // Инициализируем массив

    try {
      const parentId = node.data.originalId

      if (treeType === 'administrative') {
        // АДМИНИСТРАТИВНАЯ ВЕТКА: Факультет -> Кафедры
        if (node.type === 'faculty') {
          const depts = await orgApi.fetchDepartments(parentId)
          node.children = depts.map((d: DepartmentDTO) => ({
            key: `dept-${d.id}`,
            label: d.name,
            type: 'department',
            leaf: true, // Кафедра — конечный узел
            data: { originalId: d.id, parentId: d.facultyId }
          }))
        }
      } else if (treeType === 'academic') {
        // АКАДЕМИЧЕСКАЯ ВЕТКА: Факультет -> Направления -> Группы
        if (node.type === 'faculty') {
          const fields = await orgApi.fetchFieldsOfStudy(parentId)
          node.children = fields.map((f: FieldOfStudyDTO) => ({
            key: `field-${f.id}`,
            label: f.name,
            type: 'fieldOfStudy',
            leaf: false, // Направление можно развернуть (там группы)
            data: { originalId: f.id, code: f.code }
          }))
        } else if (node.type === 'fieldOfStudy') {
          const groups = await orgApi.fetchStudentGroups(parentId)
          node.children = groups.map((g: StudentGroupDTO) => ({
            key: `group-${g.id}`,
            label: g.name,
            type: 'group',
            leaf: true, // Группа — конечный узел
            data: { originalId: g.id }
          }))
        }
      }
    } catch (e) {
      console.error('Failed to load children', e)
    } finally {
      node.loading = false // Выключаем спиннер
    }
  }

  // Вспомогательная функция: вытаскиваем числовой ID из ключа (например, "faculty-1" -> 1)
  const extractId = (key: string): number => Number(key.split('-')[1])

  const addNode = async (
    treeType: TreeHierarchyType,
    parentId: string | null,
    newNode: OrgTreeNode
  ) => {
    let createdDto: any
    const parentDbId = parentId ? extractId(parentId) : null

    // 1. Отправляем запрос на бэкенд в зависимости от типа нового узла
    if (newNode.type === 'faculty') {
      createdDto = await orgApi.createFaculty({
        name: newNode.label,
        shortName: newNode.data?.code || ''
      })
    } else if (newNode.type === 'department' && parentDbId) {
      createdDto = await orgApi.createDepartment({ name: newNode.label, facultyId: parentDbId })
    } else if (newNode.type === 'fieldOfStudy' && parentDbId) {
      createdDto = await orgApi.createFieldOfStudy({
        name: newNode.label,
        code: newNode.data?.code || '',
        facultyId: parentDbId
      })
    } else if (newNode.type === 'group' && parentDbId) {
      createdDto = await orgApi.createStudentGroup({
        name: newNode.label,
        fieldOfStudyId: parentDbId
      })
    }

    // 2. Формируем правильный OrgTreeNode из ответа бэкенда
    const serverNode: OrgTreeNode = {
      key: `${newNode.type}-${createdDto.id}`, // Используем настоящий ID от БД!
      label: createdDto.name,
      type: newNode.type,
      leaf: newNode.type === 'department' || newNode.type === 'group', // Конечные узлы
      data: { originalId: createdDto.id, ...newNode.data }
    }

    // 3. Вставляем новый узел в наше локальное дерево (UI обновится реактивно)
    const targetTree = getTreeByType(treeType)

    if (!parentId) {
      targetTree.value.push(serverNode)
    } else {
      const insertToParent = (nodes: OrgTreeNode[]): boolean => {
        for (const node of nodes) {
          if (node.key === parentId) {
            if (!node.children) node.children = []
            node.children.push(serverNode)
            return true
          }
          if (node.children && insertToParent(node.children)) return true
        }
        return false
      }
      insertToParent(targetTree.value)
    }
  }

  // ОБНОВЛЕНИЕ УЗЛА
  const updateNode = async (treeType: TreeHierarchyType, id: string, updatedNode: OrgTreeNode) => {
    const dbId = extractId(id)

    // 1. Отправляем PATCH-запрос
    if (updatedNode.type === 'faculty') {
      await orgApi.updateFaculty(dbId, {
        name: updatedNode.label,
        shortName: updatedNode.data?.code
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

    // 2. Рекурсивно находим и обновляем узел в локальном дереве
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

  return { academicTree, administrativeTree, isLoading, loadChildren, loadRootNodes, addNode, updateNode }
})
