<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { OrgTreeBuilder } from '@/widgets/org-tree-builder'
import { OrgUnitDetails } from '@/widgets/org-unit-details'

import { useOrgStore, type TreeHierarchyType } from '@/entities/organization'
import { useNotifications } from '@/shared/model'
import type { OrgTreeNode } from '@/entities/organization'

const { t } = useI18n()
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
      t('adminOrg.toastUpdated'),
      t('adminOrg.toastUpdatedDetail', { name: updatedNode.label })
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
      t('adminOrg.toastDeleted'),
      t('adminOrg.toastDeletedDetail', { name: nodeToDelete.label })
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
        <h1 class="page-title">{{ t('adminOrg.title') }}</h1>
        <p class="page-subtitle">{{ t('adminOrg.subtitle') }}</p>
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
  flex-shrink: 0;
  margin-bottom: 2rem;
}
.page-title {
  font-size: 1.75rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  color: var(--text-color);
}

.page-subtitle {
  color: var(--text-color-secondary);
  margin: 0;
}

.builder-layout {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  background: var(--surface-ground);
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
    box-shadow: var(--shadow-panel);
    transform: translateX(100%);
    transition: transform 0.3s;
  }
}
</style>
