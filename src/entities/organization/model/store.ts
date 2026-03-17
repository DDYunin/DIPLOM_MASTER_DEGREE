import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { OrgTreeNode } from './types'
import * as orgApi from '../api'

export const useOrgStore = defineStore('organization', () => {
  const treeData = ref<OrgTreeNode[]>([])
  const isLoading = ref(false)

  // 1. Загрузка дерева
  const loadTree = async () => {
    isLoading.value = true
    try {
      treeData.value = await orgApi.fetchOrgTree()
    } finally {
      isLoading.value = false
    }
  }

  // Внутренний метод: Сохраняет текущее локальное состояние на сервер
  const syncTreeWithServer = async () => {
    // Ждем выполнения API вызова
    const updatedTree = await orgApi.updateOrgTree(treeData.value)
    treeData.value = updatedTree
  }

  // 2. Добавление нового узла
  const addNode = async (parentId: string | null, newNode: OrgTreeNode) => {
    // Если корень, кладем прямо в универ
    if (!parentId && treeData.value.length > 0) {
      if (!treeData.value[0].children) treeData.value[0].children = []
      treeData.value[0].children.push(newNode)
    } else {
      // Рекурсивная функция для поиска нужного родителя
      const insertToParent = (nodes: OrgTreeNode[]): boolean => {
        for (const node of nodes) {
          if (node.key === parentId) {
            if (!node.children) node.children = []
            node.children.push(newNode)
            return true
          }
          if (node.children && insertToParent(node.children)) return true
        }
        return false
      }
      insertToParent(treeData.value)
    }

    // Сохраняем изменения
    await syncTreeWithServer()
  }

  // 3. Обновление существующего узла
  const updateNode = async (id: string, updatedNode: OrgTreeNode) => {
    const replaceNode = (nodes: OrgTreeNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].key === id) {
          // Заменяем старые данные новыми
          nodes[i] = { ...nodes[i], ...updatedNode }
          return true
        }
        if (nodes[i].children && replaceNode(nodes[i].children)) return true
      }
      return false
    }

    replaceNode(treeData.value)
    await syncTreeWithServer()
  }

  return {
    treeData,
    isLoading,
    loadTree,
    addNode,
    updateNode
  }
})
