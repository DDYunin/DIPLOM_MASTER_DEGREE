<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { OrgTreeBuilder } from '@/widgets/org-tree-builder'
import { OrgUnitDetails } from '@/widgets/org-unit-details'

import { useOrgStore, type OrgTreeNode, type TreeHierarchyType } from '@/entities/organization'
import { useNotifications } from '@/shared/model'

const { t } = useI18n()
const orgStore = useOrgStore()
const notifications = useNotifications()

const selectedNode = ref<OrgTreeNode | null>(null)
const isEditing = ref(false)
const activeTab = ref<TreeHierarchyType>('academic')

const handleTabChange = (tab: TreeHierarchyType) => {
  activeTab.value = tab
  selectedNode.value = null
  isEditing.value = false
}

const handleNodeSelect = (node: OrgTreeNode | null) => {
  selectedNode.value = node
  isEditing.value = false
}

const handleSaveDetails = async (updatedNode: OrgTreeNode) => {
  try {
    const savedNode = await orgStore.updateNode(activeTab.value, updatedNode)
    selectedNode.value = savedNode
    isEditing.value = false

    notifications.showToast(
      'success',
      t('adminOrg.toastUpdated'),
      t('adminOrg.toastUpdatedDetail', { name: savedNode.label })
    )
  } catch (error) {
    console.error('Failed to save details:', error)
  }
}

const handleDeleteDetails = async (nodeToDelete: OrgTreeNode) => {
  try {
    await orgStore.deleteNode(activeTab.value, nodeToDelete)
    selectedNode.value = null
    isEditing.value = false

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
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('adminOrg.title') }}</h1>
        <p class="page-subtitle">{{ t('adminOrg.subtitle') }}</p>
      </div>
    </div>

    <div class="tabs-container">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'academic' }"
        :disabled="isEditing"
        @click="handleTabChange('academic')"
      >
        <i class="pi pi-book"></i> {{ t('adminOrg.academicStructure') }}
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'administrative' }"
        :disabled="isEditing"
        @click="handleTabChange('administrative')"
      >
        <i class="pi pi-sitemap"></i> {{ t('adminOrg.administrativeStructure') }}
      </button>
    </div>

    <div class="builder-layout">
      <div class="left-panel">
        <OrgTreeBuilder
          :is-editing="isEditing"
          :active-tab="activeTab"
          @select-node="handleNodeSelect"
        />
      </div>

      <div class="right-panel">
        <OrgUnitDetails
          :selected-node="selectedNode"
          v-model:is-editing="isEditing"
          @save="handleSaveDetails"
          @delete="handleDeleteDetails"
          @close="closePanel"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  margin-bottom: 1.5rem;
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

.tabs-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 0.5rem;
}

.tab-btn {
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 0.5rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover:not(:disabled) {
  color: var(--text-color);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

.tab-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  }
}
</style>
