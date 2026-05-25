<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Tree from 'primevue/tree'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

import { useOrgStore, type OrgTreeNode, type TreeHierarchyType } from '@/entities/organization'
import { AddOrgUnitModal } from '@/features/add-org-unit'
import { useNotifications } from '@/shared/model/useNotifications'

const props = defineProps<{ isEditing: boolean }>()

const emit = defineEmits<{
  (e: 'select-node', node: OrgTreeNode): void
  (e: 'tab-change', tab: TreeHierarchyType): void
}>()

const orgStore = useOrgStore()
const notifications = useNotifications()
const addModalRef = ref<InstanceType<typeof AddOrgUnitModal> | null>(null)

// --- СОСТОЯНИЕ ДЕРЕВА И ВКЛАДОК ---
const activeTab = ref<TreeHierarchyType>('academic')
const expandedKeys = ref<Record<string, boolean>>({})
const selectedKey = ref<Record<string, boolean>>({})

// --- ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ---
// Определяем, какое дерево сейчас показывать
const currentTreeData = computed(() => {
  return activeTab.value === 'academic' ? orgStore.academicTree : orgStore.administrativeTree
})

// Находим полный объект выделенного узла для передачи в модалку добавления
const currentNode = computed<OrgTreeNode | null>(() => {
  const key = Object.keys(selectedKey.value)[0]
  if (!key) return null

  let found: OrgTreeNode | null = null
  const findNode = (nodes: OrgTreeNode[]) => {
    for (const node of nodes) {
      if (node.key === key) found = node
      if (node.children && !found) findNode(node.children)
    }
  }
  findNode(currentTreeData.value)
  return found
})

// --- МЕТОДЫ ЖИЗНЕННОГО ЦИКЛА И ЗАГРУЗКИ ---
const loadTreeData = async (tab: TreeHierarchyType) => {
  const tree = tab === 'academic' ? orgStore.academicTree : orgStore.administrativeTree
  // Если корень дерева еще не загружен — грузим
  if (tree.length === 0) {
    await orgStore.loadRootNodes(tab)
  }
}

onMounted(async () => {
  await loadTreeData(activeTab.value)
})

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---
const handleTabChange = async (tab: TreeHierarchyType) => {
  if (props.isEditing) return // Блокируем смену вкладок при редактировании

  activeTab.value = tab
  selectedKey.value = {}
  expandedKeys.value = {} // Сворачиваем всё при смене вкладки

  emit('select-node', null as any) // Очищаем правую панель
  emit('tab-change', tab)

  await loadTreeData(tab)
}

// Событие PrimeVue: Клик по узлу
const onNodeSelect = (eventOrNode: any) => {
  if (props.isEditing) return

  // Универсальный перехват (на случай разных версий PrimeVue)
  const targetNode = eventOrNode.node || eventOrNode

  emit('select-node', targetNode)
}

// Событие PrimeVue: Клик по стрелочке (Lazy Loading)
const onNodeExpand = async (eventOrNode: any) => {
  const targetNode = eventOrNode.node || eventOrNode

  // Вызываем экшен стора, передавая правильный узел
  await orgStore.loadChildren(targetNode, activeTab.value)
}

// Событие Фичи: Сохранение нового узла
const handleAddNewNode = async (newNode: OrgTreeNode) => {
  const parentId = currentNode.value ? currentNode.value.key : null

  try {
    await orgStore.addNode(activeTab.value, parentId, newNode)
    // Принудительно раскрываем родительскую папку после добавления элемента
    if (parentId) {
      expandedKeys.value[parentId] = true
    }

    notifications.showToast(
      'success',
      'Hierarchy Updated',
      `${newNode.label} has been updated successfully.`
    )
  } catch (error) {
    console.error('Failed to add node', error)
  }
}

// --- УТИЛИТЫ ---
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
    <!-- ВКЛАДКИ -->
    <div class="tabs-container">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'academic' }"
        @click="handleTabChange('academic')"
      >
        <i class="pi pi-book"></i> Academic Structure
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'administrative' }"
        @click="handleTabChange('administrative')"
      >
        <i class="pi pi-sitemap"></i> Administrative Structure
      </button>
    </div>

    <!-- ТУЛБАР (Информационный) -->
    <div class="toolbar">
      <span class="toolbar-info">
        <i class="pi pi-info-circle"></i> Select a unit to view details or add new ones.
      </span>
      <div class="toolbar-actions">
        <!-- Кнопка обновления дерева (полезно при ленивой загрузке) -->
        <Button
          icon="pi pi-refresh"
          text
          rounded
          size="small"
          @click="loadTreeData(activeTab)"
          :disabled="isEditing"
          title="Refresh Tree"
        />
      </div>
    </div>

    <!-- SKELETON (Загрузка корня) -->
    <div v-if="orgStore.isLoading" class="skeleton-container">
      <Skeleton width="100%" height="3rem" borderRadius="8px" class="mb-3" />
      <Skeleton width="100%" height="3rem" borderRadius="8px" class="mb-3" />
      <Skeleton width="100%" height="3rem" borderRadius="8px" />
    </div>

    <!-- ДЕРЕВО (С включенным Lazy Loading) -->
    <div v-else class="tree-container" :class="{ 'disabled-overlay': isEditing }">
      <Tree
        :value="currentTreeData"
        selectionMode="single"
        loadingMode="icon"
        v-model:selectionKeys="selectedKey"
        v-model:expandedKeys="expandedKeys"
        @node-select="onNodeSelect"
        @node-expand="onNodeExpand"
        class="custom-tree"
      >
        <!-- Кастомный рендер карточки узла -->
        <template #default="slotProps">
          <div class="node-card" :class="{ 'is-selected': selectedKey[slotProps.node.key] }">
            <i :class="[getIcon(slotProps.node.type ?? ''), 'node-icon']"></i>
            <div class="node-content">
              <span class="node-label">
                {{ slotProps.node.label }}
                <!-- Надпись (Selected) или (Editing) -->
                <span
                  v-if="selectedKey[slotProps.node.key]"
                  :class="['selected-text', isEditing ? 'text-editing' : 'text-selected']"
                >
                  ({{ isEditing ? 'Editing' : 'Selected' }})
                </span>
              </span>

              <!-- Подпись типа узла и кода/шортнейма -->
              <span class="node-sub">
                <span class="text-capitalize">{{
                  slotProps.node.type === 'fieldOfStudy' ? 'Field of Study' : slotProps.node.type
                }}</span>
                <template v-if="slotProps.node.data?.shortName || slotProps.node.data?.code">
                  • {{ slotProps.node.data.shortName || slotProps.node.data.code }}
                </template>
              </span>
            </div>
          </div>
        </template>
      </Tree>

      <!-- Кнопка вызова модалки добавления -->
      <button class="add-unit-btn" :disabled="isEditing" @click="addModalRef?.openModal()">
        <i class="pi pi-plus-circle"></i>
        {{ 'Add Unit' }}
      </button>
    </div>

    <!-- ФИЧА: Модальное окно добавления -->
    <!-- Передаем hierarchyType, чтобы фича понимала логику добавляемых типов -->
    <AddOrgUnitModal
      ref="addModalRef"
      :parentNode="currentNode"
      :hierarchyType="activeTab"
      @add="handleAddNewNode"
    />
  </div>
</template>

<style scoped>
/* ОСНОВНОЙ ЛЕЙАУТ */
.tree-builder {
  padding-right: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ВКЛАДКИ */
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
.tab-btn:hover {
  color: var(--text-color);
}
.tab-btn.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

/* ТУЛБАР */
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

/* КОНТЕЙНЕРЫ ДЕРЕВА */
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

/* ПЕРЕОПРЕДЕЛЕНИЕ СТИЛЕЙ PRIMEVUE TREE */
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

/* КАРТОЧКА УЗЛА */
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

/* Поддержка темной темы для выделения */
.my-app-dark .node-card.is-selected {
  background: var(--accent-blue-bg);
  border-color: var(--color-primary-text-on-subtle);
}

/* ТЕКСТА И ИКОНКИ УЗЛА */
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

/* СОСТОЯНИЯ И КНОПКИ */
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
</style>
