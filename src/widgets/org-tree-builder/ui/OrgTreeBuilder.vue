<script setup lang="ts">
import { ref, computed } from 'vue'
import Tree from 'primevue/tree'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
import { mockOrgTree } from '@/entities/organization'
import type { OrgTreeNode } from '@/entities/organization'
import { AddOrgUnitModal } from '@/features/add-org-unit'

// ДОБАВИЛИ ПРОПС isEditing
const props = defineProps<{ isEditing: boolean }>()
const emit = defineEmits<{ (e: 'select-node', node: OrgTreeNode): void }>()

// Ссылка на модальное окно (чтобы вызвать метод openModal)
const addModalRef = ref<InstanceType<typeof AddOrgUnitModal> | null>(null)

const searchQuery = ref('')
const expandedKeys = ref<Record<string, boolean>>({ 'uni-1': true, 'inst-1': true, 'dept-1': true })
const selectedKey = ref<Record<string, boolean>>({})

// Вычисляем ТЕКУЩИЙ выделенный узел
const currentNode = computed<OrgTreeNode | null>(() => {
  const key = Object.keys(selectedKey.value)[0]
  if (!key) return null

  // Простая рекурсивная функция поиска узла по ключу
  let found: OrgTreeNode | null = null
  const findNode = (nodes: OrgTreeNode[]) => {
    for (const node of nodes) {
      if (node.key === key) found = node
      if (node.children && !found) findNode(node.children)
    }
  }
  findNode(mockOrgTree.value)
  return found
})

const filteredTree = computed(() => mockOrgTree.value)

const expandAll = () => {
  expandedKeys.value = { 'uni-1': true, 'inst-1': true, 'dept-1': true }
}
const collapseAll = () => {
  expandedKeys.value = {}
}

const onNodeSelect = (node: any) => {
  // Блокируем смену узла, если идет редактирование
  if (props.isEditing) return
  emit('select-node', node)
}

// Открытие модалки
const handleOpenAddModal = () => {
  addModalRef.value?.openModal()
}

// Добавление узла в дерево
const handleAddNewNode = (newNode: OrgTreeNode) => {
  if (currentNode.value) {
    if (!currentNode.value.children) {
      currentNode.value.children = []
    }
    // Добавляем к выбранному узлу
    currentNode.value.children.push(newNode)
    // Раскрываем родительскую папку, чтобы увидеть результат
    expandedKeys.value[currentNode.value.key] = true
  } else {
    // Если ничего не выделено, добавляем в корень
    mockOrgTree.value[0].children?.push(newNode)
    expandedKeys.value[mockOrgTree.value[0].key] = true
  }
}

const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    university: 'pi pi-building text-blue-500',
    institute: 'pi pi-home text-orange-500',
    department: 'pi pi-folder text-blue-400',
    group: 'pi pi-users text-gray-500'
  }
  return icons[type] || 'pi pi-circle'
}
</script>

<template>
  <div class="tree-builder">
    <div class="toolbar">
      <IconField iconPosition="left" class="search-field">
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          placeholder="Search departments..."
          class="w-full"
          :disabled="isEditing"
        />
      </IconField>
      <div class="toolbar-actions">
        <Button
          label="Expand All"
          outlined
          class="tool-btn"
          @click="expandAll"
          :disabled="isEditing"
        />
        <Button
          label="Collapse All"
          outlined
          class="tool-btn"
          @click="collapseAll"
          :disabled="isEditing"
        />
      </div>
    </div>

    <div class="tree-container" :class="{ 'disabled-overlay': isEditing }">
      <Tree
        :value="filteredTree"
        selectionMode="single"
        v-model:selectionKeys="selectedKey"
        v-model:expandedKeys="expandedKeys"
        @nodeSelect="onNodeSelect"
        class="custom-tree"
      >
        <template #default="slotProps">
          <div class="node-card" :class="{ 'is-selected': selectedKey[slotProps.node.key] }">
            <i :class="[getIcon(slotProps.node.type), 'node-icon']"></i>
            <div class="node-content">
              <span class="node-label">
                {{ slotProps.node.label }}
                <!-- ДИНАМИЧЕСКАЯ ПОДПИСЬ -->
                <span
                  v-if="selectedKey[slotProps.node.key]"
                  :class="['selected-text', isEditing ? 'text-editing' : 'text-selected']"
                >
                  ({{ isEditing ? 'Editing' : 'Selected' }})
                </span>
              </span>
              <span v-if="slotProps.node.type === 'university'" class="node-sub"
                >Root Organization</span
              >
              <span v-if="slotProps.node.data?.code" class="node-sub"
                >Code: {{ slotProps.node.data.code }}</span
              >
            </div>
          </div>
        </template>
      </Tree>
      <!-- ОБНОВЛЕННАЯ КНОПКА -->
      <button class="add-institute-btn" :disabled="isEditing" @click="handleOpenAddModal">
        <i class="pi pi-plus-circle"></i>
        {{ currentNode ? 'Add Child Unit' : 'Add Institute' }}
      </button>
    </div>
    <!-- ПОДКЛЮЧЕННАЯ ФИЧА -->
    <AddOrgUnitModal ref="addModalRef" :parentNode="currentNode" @add="handleAddNewNode" />
  </div>
</template>

<style scoped>
/* Старые стили остаются... */
.tree-builder {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.search-field {
  flex-grow: 1;
  max-width: 300px;
}
.w-full {
  width: 100%;
  border-radius: 8px;
}
.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}
.tool-btn {
  color: #475569;
  border-color: #cbd5e1;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
.tree-container {
  flex-grow: 1;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
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
  border-left: 1px dashed #cbd5e1;
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
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
}
.node-card:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}
.node-card.is-selected {
  background: #eff6ff;
  border-color: #bfdbfe;
}
.node-icon {
  font-size: 1.25rem;
}
.text-blue-500 {
  color: #3b82f6;
}
.text-orange-500 {
  color: #f97316;
}
.text-blue-400 {
  color: #60a5fa;
}
.text-gray-500 {
  color: #64748b;
}
.node-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.node-label {
  font-weight: 500;
  color: #0f172a;
  font-size: 0.9rem;
}
.node-sub {
  font-size: 0.75rem;
  color: #64748b;
}
.add-institute-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  background: transparent;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}
.add-institute-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

/* НОВЫЕ СТИЛИ ДЛЯ РЕЖИМА РЕДАКТИРОВАНИЯ */
.text-selected {
  color: #3b82f6;
  font-weight: 400;
}
.text-editing {
  color: #8b5cf6;
  font-weight: 500;
} /* Фиолетовый оттенок для Editing */
.disabled-overlay {
  opacity: 0.6;
  pointer-events: none;
} /* Визуально блокируем дерево */
</style>
