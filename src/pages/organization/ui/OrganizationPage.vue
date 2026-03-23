<script setup lang="ts">
import { ref } from 'vue'

import { OrgTreeBuilder } from '@/widgets/org-tree-builder'
import { OrgUnitDetails } from '@/widgets/org-unit-details'

import { useOrgStore, type TreeHierarchyType } from '@/entities/organization'
import { useNotifications } from '@/shared/model'
import type { OrgTreeNode } from '@/entities/organization'

const orgStore = useOrgStore()
const notifications = useNotifications()

const selectedNode = ref<OrgTreeNode | null>(null)
const isEditing = ref(false) // Глобальное состояние редактирования

const activeTab = ref<TreeHierarchyType>('academic')

// Обработчик смены вкладки из левой панели
const handleTabChange = (tab: TreeHierarchyType) => {
  activeTab.value = tab
  // Сбрасываем выбранный узел при переходе на другую вкладку
  selectedNode.value = null
  isEditing.value = false
}

const handleNodeSelect = (node: OrgTreeNode) => {
  selectedNode.value = node
  // Сбрасываем режим редактирования при смене узла
  isEditing.value = false
}

// Обработчик сохранения изменений из правой панели (Деталей)
const handleSaveDetails = async (updatedNode: OrgTreeNode) => {
  try {
    await orgStore.updateNode(activeTab.value, updatedNode.key, updatedNode)

    selectedNode.value = updatedNode
    isEditing.value = false

    // 4. Показываем красивый Toast
    notifications.showToast(
      'success',
      'Hierarchy Updated',
      `${updatedNode.label} has been updated successfully.`
    )
  } catch (error) {
    // Если произошла сетевая ошибка, наш apiClient сам покажет Toast 'error'.
    // Здесь мы просто не закрываем режим редактирования (остаемся в форме).
    console.error('Failed to save details:', error)
  }
}

const handleDeleteDetails = async (nodeToDelete: OrgTreeNode) => {
  try {
    // Вызываем удаление из стора (передаем вкладку, ID и тип узла)
    await orgStore.deleteNode(activeTab.value, nodeToDelete.key, nodeToDelete.type)

    // Очищаем правую панель, так как узла больше нет
    selectedNode.value = null
    isEditing.value = false

    // Уведомление об успехе
    notifications.showToast(
      'success',
      'Deleted',
      `${nodeToDelete.label} has been deleted successfully.`
    )
  } catch (error) {
    console.error('Failed to delete node:', error)
  }
}

const closePanel = () => {
  selectedNode.value = null
  isEditing.value = false
}
</script>

<template>
  <div class="organization-page">
    <!-- TODO: лишнее -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Hierarchy</h1>
        <p class="page-subtitle"></p>
      </div>
    </div>

    <div class="builder-layout">
      <div class="left-panel">
        <OrgTreeBuilder
          :isEditing="isEditing"
          @select-node="handleNodeSelect"
          @tab-change="handleTabChange"
        />
      </div>

      <div class="right-panel">
        <OrgUnitDetails
          :selectedNode="selectedNode"
          v-model:isEditing="isEditing"
          @save="handleSaveDetails"
          @delete="handleDeleteDetails"
          @close="closePanel"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Стили страницы остались теми же... */
.organization-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  flex-shrink: 0;
}
.page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color, #0f172a);
}

.builder-layout {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  background: var(--surface-ground, #f8fafc);
}

.left-panel {
  flex-grow: 1;
  overflow: hidden;
}
.right-panel {
  width: 350px;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.3s;
}

@media (max-width: 1024px) {
  .right-panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    max-width: 350px;
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.05);
    transform: translateX(100%);
    transition: transform 0.3s;
  }
}
</style>
