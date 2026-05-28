<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Tree from 'primevue/tree'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

import { useOrgStore, type OrgTreeNode, type TreeHierarchyType } from '@/entities/organization'
import { AddOrgUnitModal } from '@/features/add-org-unit'
import { canAddOrgUnit } from '@/features/add-org-unit/lib/resolveChildType'

const props = defineProps<{
  isEditing: boolean
  activeTab: TreeHierarchyType
}>()

const emit = defineEmits<{
  (e: 'select-node', node: OrgTreeNode | null): void
}>()

const { t } = useI18n()
const orgStore = useOrgStore()
const addModalRef = ref<InstanceType<typeof AddOrgUnitModal> | null>(null)

const expandedKeys = ref<Record<string, boolean>>({})
const selectedKey = ref<Record<string, boolean>>({})

const currentTreeData = computed(() =>
  props.activeTab === 'academic' ? orgStore.academicTree : orgStore.administrativeTree
)

const currentNode = computed<OrgTreeNode | null>(() => {
  const key = Object.keys(selectedKey.value)[0]
  if (!key) {
    return null
  }

  let found: OrgTreeNode | null = null
  const findNode = (nodes: OrgTreeNode[]) => {
    for (const node of nodes) {
      if (node.key === key) {
        found = node
      }
      if (node.children && !found) {
        findNode(node.children)
      }
    }
  }

  findNode(currentTreeData.value)
  return found
})

const canCreateUnit = computed(() => canAddOrgUnit(currentNode.value, props.activeTab))

const loadTreeData = async () => {
  const tree = currentTreeData.value
  if (tree.length === 0) {
    await orgStore.loadRootNodes(props.activeTab)
  }
}

const reloadTreeData = async () => {
  selectedKey.value = {}
  expandedKeys.value = {}
  emit('select-node', null)
  await orgStore.reloadRootNodes(props.activeTab)
}

onMounted(async () => {
  await loadTreeData()
})

watch(
  () => props.activeTab,
  async () => {
    selectedKey.value = {}
    expandedKeys.value = {}
    emit('select-node', null)
    await loadTreeData()
  }
)

const onNodeSelect = (eventOrNode: { node?: OrgTreeNode } | OrgTreeNode) => {
  if (props.isEditing) {
    return
  }

  const targetNode = 'node' in eventOrNode && eventOrNode.node ? eventOrNode.node : eventOrNode
  emit('select-node', targetNode as OrgTreeNode)
}

const onNodeExpand = async (eventOrNode: { node?: OrgTreeNode } | OrgTreeNode) => {
  const targetNode = 'node' in eventOrNode && eventOrNode.node ? eventOrNode.node : eventOrNode

  try {
    await orgStore.loadChildren(targetNode as OrgTreeNode, props.activeTab)
  } catch {
    // error toast is handled by api client
  }
}

const handleCreatedNode = (createdNode: OrgTreeNode) => {
  const parentKey = currentNode.value?.key ?? null
  orgStore.insertNode(props.activeTab, parentKey, createdNode)

  if (parentKey) {
    expandedKeys.value[parentKey] = true
  }
}

const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    faculty: 'pi pi-building text-blue-500',
    fieldOfStudy: 'pi pi-compass text-purple-500',
    department: 'pi pi-folder text-orange-500',
    group: 'pi pi-users text-gray-500'
  }
  return icons[type] || 'pi pi-circle'
}
</script>

<template>
  <div class="tree-builder">
    <div class="toolbar">
      <span class="toolbar-info">
        <i class="pi pi-info-circle"></i> {{ t('adminOrg.selectUnitHint') }}
      </span>
      <div class="toolbar-actions">
        <Button
          icon="pi pi-refresh"
          text
          rounded
          size="small"
          :disabled="isEditing || orgStore.isLoading"
          :title="t('adminOrg.refreshTree')"
          @click="reloadTreeData"
        />
      </div>
    </div>

    <div v-if="orgStore.isLoading" class="skeleton-container">
      <Skeleton width="100%" height="3rem" borderRadius="8px" class="mb-3" />
      <Skeleton width="100%" height="3rem" borderRadius="8px" class="mb-3" />
      <Skeleton width="100%" height="3rem" borderRadius="8px" />
    </div>

    <div v-else class="tree-container" :class="{ 'disabled-overlay': isEditing }">
      <Tree
        :value="currentTreeData"
        selectionMode="single"
        loadingMode="icon"
        v-model:selectionKeys="selectedKey"
        v-model:expandedKeys="expandedKeys"
        class="custom-tree"
        @node-select="onNodeSelect"
        @node-expand="onNodeExpand"
      >
        <template #default="slotProps">
          <div class="node-card" :class="{ 'is-selected': selectedKey[slotProps.node.key] }">
            <i :class="[getIcon(slotProps.node.type ?? ''), 'node-icon']"></i>
            <div class="node-content">
              <span class="node-label">
                {{ slotProps.node.label }}
                <span
                  v-if="selectedKey[slotProps.node.key]"
                  :class="['selected-text', isEditing ? 'text-editing' : 'text-selected']"
                >
                  ({{ isEditing ? t('common.edit') : t('common.selected', { count: 1 }) }})
                </span>
              </span>

              <span class="node-sub">
                <span class="text-capitalize">{{
                  slotProps.node.type === 'fieldOfStudy'
                    ? t('adminOrgUnitModal.fieldOfStudy')
                    : slotProps.node.type
                }}</span>
                <template v-if="slotProps.node.data?.shortName">
                  • {{ slotProps.node.data.shortName }}
                </template>
              </span>
            </div>
          </div>
        </template>
      </Tree>

      <button
        class="add-unit-btn"
        :disabled="isEditing || !canCreateUnit"
        :title="!canCreateUnit ? t('adminOrg.cannotAddHere') : undefined"
        @click="addModalRef?.openModal()"
      >
        <i class="pi pi-plus-circle"></i>
        {{ t('common.create') }}
      </button>
    </div>

    <AddOrgUnitModal
      ref="addModalRef"
      :parentNode="currentNode"
      :hierarchyType="activeTab"
      @created="handleCreatedNode"
    />
  </div>
</template>

<style scoped>
.tree-builder {
  padding-right: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.toolbar-info {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skeleton-container {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 1.5rem;
  flex-grow: 1;
  border: 1px solid var(--surface-border);
}

.tree-container {
  flex-grow: 1;
  overflow-y: auto;
  background: var(--surface-card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--surface-border);
  position: relative;
}

.custom-tree {
  border: none;
  padding: 0;
  background: transparent;
}

:deep(.p-tree-node-content) {
  padding: 0 !important;
  border-radius: 8px;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
}

:deep(.p-treenode-children) {
  padding-left: 1.5rem;
  border-left: 1px dashed var(--surface-border);
  margin-left: 1rem;
}

:deep(.p-tree-node-label) {
  width: 100%;
}

.node-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  background: var(--surface-card);
  transition: all 0.2s;
}

.node-card:hover {
  border-color: var(--surface-border);
  background: var(--surface-hover);
}

.node-card.is-selected {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary-border);
}

.my-app-dark .node-card.is-selected {
  background: var(--accent-blue-bg);
  border-color: var(--color-primary-text-on-subtle);
}

.node-icon {
  font-size: 1.25rem;
}

.text-blue-500 {
  color: var(--color-primary);
}

.text-orange-500 {
  color: var(--color-warning);
}

.text-purple-500 {
  color: var(--color-accent-purple);
}

.text-gray-500 {
  color: var(--text-color-secondary);
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.node-label {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.node-sub {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.text-capitalize {
  text-transform: capitalize;
}

.text-selected {
  color: var(--color-primary);
  font-weight: 400;
  margin-left: 0.25rem;
}

.text-editing {
  color: var(--color-accent-purple);
  font-weight: 500;
  margin-left: 0.25rem;
}

.disabled-overlay {
  opacity: 0.6;
  pointer-events: none;
}

.mb-3 {
  margin-bottom: 1rem;
}

.add-unit-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  background: transparent;
  border: 1px dashed var(--surface-border);
  border-radius: 8px;
  color: var(--text-color-secondary);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.add-unit-btn:hover:not(:disabled) {
  background: var(--surface-hover);
  border-color: var(--text-color-secondary);
  color: var(--text-color);
}

.add-unit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
