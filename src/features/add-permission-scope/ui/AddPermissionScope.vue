<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Tree from 'primevue/tree'

// Мок-данные для дерева иерархии (в реальном приложении придут с бэкенда)
import { rawTreeData } from '../api/mock'

const emit = defineEmits<{
  (e: 'add', groups: string[]): void
}>()

const isVisible = ref(false)
const searchQuery = ref('')
const selectedKeys = ref<Record<string, any>>({})

// Плоский справочник для быстрого поиска узлов по их key
const flatNodeMap: Record<string, any> = {}
const buildFlatMap = (nodes: any[]) => {
  nodes.forEach((node) => {
    flatNodeMap[node.key] = node
    if (node.children) buildFlatMap(node.children)
  })
}
buildFlatMap(rawTreeData)

// Рекурсивный фильтр для поиска
const filteredTreeData = computed(() => {
  if (!searchQuery.value) return rawTreeData
  const lowerQuery = searchQuery.value.toLowerCase()

  const filterNodes = (nodes: any[]): any[] => {
    return nodes.reduce((acc, node) => {
      const isMatch = node.label.toLowerCase().includes(lowerQuery)
      const filteredChildren = node.children ? filterNodes(node.children) : []

      if (isMatch || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children
        })
      }
      return acc
    }, [])
  }
  return filterNodes(rawTreeData)
})

// Вычисляем количество выбранных ИМЕННО КОНЕЧНЫХ ГРУПП (не считая родительские папки)
const selectedGroupsCount = computed(() => {
  return Object.entries(selectedKeys.value).filter(([key, val]) => {
    return val.checked && flatNodeMap[key]?.data?.type === 'group'
  }).length
})

const openModal = () => {
  searchQuery.value = ''
  selectedKeys.value = {}
  isVisible.value = true
}

const handleSave = () => {
  // Собираем названия выбранных групп
  const newGroups = Object.entries(selectedKeys.value)
    .filter(([key, val]) => val.checked && flatNodeMap[key]?.data?.type === 'group')
    .map(([key]) => flatNodeMap[key].label)

  if (newGroups.length > 0) {
    emit('add', newGroups)
  }
  isVisible.value = false
}
</script>

<template>
  <Button label="Add Permission" icon="pi pi-plus" text class="add-btn" @click="openModal" />
  <!-- TODO: лишнее дерево, поменять на другой вариант -->
  <Dialog
    v-model:visible="isVisible"
    modal
    :style="{ width: '600px' }"
    class="permission-dialog"
    :pt="{
      header: { class: 'dialog-header' },
      content: { class: 'dialog-content' }
    }"
  >
    <template #header>
      <div class="header-container">
        <h2 class="dialog-title">Add Permission Scope</h2>
        <p class="dialog-subtitle">Select organizations to grant access.</p>
      </div>
    </template>

    <div class="search-container">
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search search-icon" />
        <InputText
          v-model="searchQuery"
          placeholder="Search institutes, departments, or groups..."
          class="search-input"
        />
      </IconField>
    </div>

    <div class="tree-container">
      <Tree
        :value="filteredTreeData"
        selectionMode="checkbox"
        v-model:selectionKeys="selectedKeys"
        class="custom-tree"
        :expandedKeys="{ 'uni-1': true, 'inst-1': true, 'dept-1': true }"
      >
        <template #default="slotProps">
          <div class="custom-node">
            <div class="node-left">
              <i :class="slotProps.node.data.icon" class="node-icon"></i>
              <span class="node-label">{{ slotProps.node.label }}</span>
            </div>

            <!-- Показываем бейджик "Selected" только для полностью выбранных узлов -->
            <div v-if="selectedKeys[slotProps.node.key]?.checked" class="selected-badge">
              <i class="pi pi-check badge-icon"></i>
              Selected
            </div>
          </div>
        </template>
      </Tree>
    </div>

    <template #footer>
      <div class="footer-container">
        <span class="selected-count">{{ selectedGroupsCount }} groups selected</span>
        <div class="footer-actions">
          <Button label="Cancel" text class="cancel-btn" @click="isVisible = false" />
          <Button label="Add Selected" class="save-btn" icon="pi pi-check" @click="handleSave" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.add-btn {
  background: #eff6ff;
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
}

/* Кастомизация шапки модального окна */
.header-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}
.dialog-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.search-container {
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}
.search-input {
  width: 100%;
  border-radius: 8px;
  border-color: #cbd5e1;
}
.search-icon {
  color: #94a3b8;
}

/* Кастомизация Tree */
.tree-container {
  height: 350px;
  overflow-y: auto;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 0.5rem;
}

.custom-tree {
  border: none;
  padding: 0;
}

/* "Пробиваем" стили PrimeVue для растягивания узла на всю ширину */
:deep(.p-tree-node-content) {
  border-radius: 8px;
  padding: 0.5rem;
  transition: background-color 0.2s;
}
:deep(.p-tree-node-label) {
  width: 100%;
}

.custom-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.node-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.node-icon {
  color: #64748b;
  font-size: 1.1rem;
}
.node-label {
  font-size: 0.875rem;
  color: #334155;
  font-weight: 500;
}

.selected-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
}
.badge-icon {
  font-size: 0.7rem;
  font-weight: bold;
}

/* Кастомизация Футера */
.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}
.selected-count {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}
.footer-actions {
  display: flex;
  gap: 0.75rem;
}
.cancel-btn {
  color: #475569;
}
.save-btn {
  background: #2563eb;
  border: none;
}
</style>
