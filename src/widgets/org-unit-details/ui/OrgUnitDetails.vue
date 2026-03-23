<script setup lang="ts">
import { ref, watch } from 'vue'

import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useConfirm } from 'primevue/useconfirm'

import type { OrgTreeNode } from '@/entities/organization'

const props = defineProps<{
  selectedNode: OrgTreeNode | null
  isEditing: boolean
}>()

const emit = defineEmits(['close', 'update:isEditing', 'save', 'delete'])

const confirm = useConfirm() // Инициализация

// Локальный черновик (только те поля, которые поддерживает наш бэкенд)
const draft = ref({
  label: '',
  shortName: '',
  code: ''
})

// Заполняем черновик при входе в режим редактирования
watch(
  () => props.isEditing,
  (newVal) => {
    if (newVal && props.selectedNode) {
      draft.value = {
        label: props.selectedNode.label,
        shortName: props.selectedNode.data?.shortName || '',
        code: props.selectedNode.data?.code || ''
      }
    }
  }
)

const startEditing = () => emit('update:isEditing', true)
const cancelEditing = () => emit('update:isEditing', false)

const saveChanges = () => {
  // Отправляем обновленный узел
  emit('save', {
    ...props.selectedNode,
    label: draft.value.label,
    data: {
      ...props.selectedNode?.data,
      shortName: draft.value.shortName,
      code: draft.value.code
    }
  })
}

const confirmDelete = () => {
  if (!props.selectedNode) {
    return
  }

  confirm.require({
    header: 'Delete Confirmation',
    message: `Are you sure you want to delete "${props.selectedNode.label}"? All nested units will also be removed.`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      // Отправляем событие наверх в страницу
      emit('delete', props.selectedNode)
    }
  })
}

// Утилиты для UI
const getIconData = (type?: string) => {
  if (type === 'faculty') {
    return {
      icon: 'pi-building',
      bgClass: 'bg-info'
    }
  }
  if (type === 'department') {
    return {
      icon: 'pi-folder',
      bgClass: 'bg-warning'
    }
  }
  if (type === 'fieldOfStudy') {
    return {
      icon: 'pi-compass',
      bgClass: 'bg-purple'
    }
  }
  // Student group
  return {
    icon: 'pi-users',
    bgClass: 'bg-primary'
  }
}

const formatType = (type?: string) => {
  if (!type) {
    return ''
  }
  if (type === 'fieldOfStudy') {
    return 'Field of Study'
  }
  return type.charAt(0).toUpperCase() + type.slice(1)
}
</script>

<template>
  <div v-if="selectedNode && selectedNode.data" class="details-panel">
    <!-- ШАПКА -->
    <div class="panel-header">
      <div class="icon-box" :class="getIconData(selectedNode.type).bgClass">
        <i class="pi" :class="getIconData(selectedNode.type).icon"></i>
      </div>
      <button class="close-btn" @click="$emit('close')"><i class="pi pi-times"></i></button>
    </div>

    <!-- ========================================== -->
    <!-- РЕЖИМ ПРОСМОТРА (View Mode)                -->
    <!-- ========================================== -->
    <template v-if="!isEditing">
      <div class="node-title-section">
        <h2 class="node-title">{{ selectedNode.label }}</h2>
        <!-- Выводим тип узла вместо фейкового статуса -->
        <Tag severity="info" :value="formatType(selectedNode.type)" rounded class="type-tag" />
      </div>

      <!-- Статистика (Пока заглушки 0, ждем агрегации от бэкенда) -->
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-value">0</span>
          <span class="stat-label">Students</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">0</span>
          <span class="stat-label">Teachers</span>
        </div>
      </div>

      <!-- Метаданные (Только то, что реально есть в БД) -->
      <div class="meta-list">
        <!-- Настоящий ID из базы данных (Очень полезно для админов) -->
        <div class="meta-item">
          <span class="meta-label">DATABASE ID</span>
          <span class="meta-value font-mono">#{{ selectedNode.data.originalId }}</span>
        </div>

        <div v-if="selectedNode.data.shortName" class="meta-item">
          <span class="meta-label">SHORT NAME</span>
          <span class="meta-value">{{ selectedNode.data.shortName }}</span>
        </div>

        <div v-if="selectedNode.data.code" class="meta-item">
          <span class="meta-label">PROGRAM CODE</span>
          <span class="meta-value">{{ selectedNode.data.code }}</span>
        </div>
      </div>

      <div class="actions-section">
        <span class="actions-title">Quick Actions</span>
        <Button
          label="Edit Details"
          icon="pi pi-pencil"
          outlined
          class="action-btn"
          @click="startEditing"
        />
        <!-- TODO: мне кажется лишней -->
        <Button
          v-if="selectedNode.type === 'group'"
          label="Assign Students"
          icon="pi pi-user-plus"
          class="action-btn btn-primary"
        />
        <Button
          label="Delete Unit"
          icon="pi pi-trash"
          severity="danger"
          outlined
          class="action-btn mt-2"
          @click="confirmDelete"
        />
      </div>
    </template>

    <!-- ========================================== -->
    <!-- РЕЖИМ РЕДАКТИРОВАНИЯ (Edit Mode)           -->
    <!-- ========================================== -->
    <template v-else>
      <div class="edit-form">
        <!-- Общее поле -->
        <div class="form-field">
          <label>{{ formatType(selectedNode.type).toUpperCase() }} NAME</label>
          <InputText v-model="draft.label" autofocus />
        </div>

        <!-- Поле только для факультета -->
        <div v-if="selectedNode.type === 'faculty'" class="form-field mt-3">
          <label>SHORT NAME</label>
          <InputText v-model="draft.shortName" placeholder="e.g. ENG" />
        </div>

        <!-- Поле только для направления -->
        <div v-if="selectedNode.type === 'fieldOfStudy'" class="form-field mt-3">
          <label>PROGRAM CODE</label>
          <InputText v-model="draft.code" placeholder="e.g. SE-09" />
        </div>
      </div>

      <div class="edit-actions-section">
        <span class="actions-title">Save Changes?</span>
        <Button
          label="Save Changes"
          icon="pi pi-check"
          class="action-btn btn-success"
          @click="saveChanges"
        />
        <button class="cancel-link" @click="cancelEditing">Cancel</button>
      </div>
    </template>
  </div>

  <div v-else class="empty-panel">
    <i class="pi pi-sitemap empty-icon"></i>
    <p>Select an organization unit to view details.</p>
  </div>
</template>

<style scoped>
/* ОСНОВНЫЕ СТИЛИ */
.details-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface-card, #ffffff);
  border-left: 1px solid var(--surface-border, #e2e8f0);
  padding: 1.5rem;
  overflow-y: auto;
}
.empty-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--surface-card, #ffffff);
  border-left: 1px solid var(--surface-border, #e2e8f0);
  color: var(--text-color-secondary, #64748b);
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--surface-border, #e2e8f0);
}

/* ИКОНКА ШАПКИ */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.bg-primary {
  background: var(--p-primary-50);
  color: var(--p-primary-500);
}
.bg-info {
  background: var(--p-blue-50);
  color: var(--p-blue-500);
}
.bg-warning {
  background: var(--p-orange-50);
  color: var(--p-orange-500);
}
.bg-purple {
  background: var(--p-purple-50);
  color: var(--p-purple-500);
}

:root[class*='my-app-dark'] .bg-primary {
  background: rgba(var(--p-primary-500), 0.16);
}
:root[class*='my-app-dark'] .bg-info {
  background: rgba(var(--p-blue-500), 0.16);
}
:root[class*='my-app-dark'] .bg-warning {
  background: rgba(var(--p-orange-500), 0.16);
}
:root[class*='my-app-dark'] .bg-purple {
  background: rgba(var(--p-purple-500), 0.16);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-color-secondary, #64748b);
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover {
  color: var(--text-color, #0f172a);
}

/* РЕЖИМ ПРОСМОТРА */
.node-title-section {
  margin-bottom: 2rem;
}
.node-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color, #0f172a);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-box {
  background: var(--surface-ground, #f8fafc);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--surface-border, #e2e8f0);
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color, #0f172a);
}
.stat-label {
  font-size: 0.75rem;
  color: var(--text-color-secondary, #64748b);
  margin-top: 0.25rem;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.meta-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-color-secondary, #64748b);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.meta-value {
  font-size: 0.875rem;
  color: var(--text-color, #0f172a);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.font-mono {
  font-family: monospace;
  color: var(--p-primary-500);
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
}
.actions-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color, #0f172a);
  margin-bottom: 0.25rem;
}
.action-btn {
  width: 100%;
}
.btn-primary {
  background: var(--p-primary-500);
  border: none;
  color: white;
}

/* РЕЖИМ РЕДАКТИРОВАНИЯ */
.edit-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-color-secondary, #64748b);
  letter-spacing: 0.05em;
}
.mt-3 {
  margin-top: 1rem;
}

.edit-actions-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
}
.btn-success {
  background: var(--p-green-500);
  border: none;
  color: white;
}
.btn-success:hover {
  background: var(--p-green-600);
}
.cancel-link {
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--text-color-secondary, #64748b);
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}
.cancel-link:hover {
  color: var(--text-color, #0f172a);
}

:deep(.p-inputtext) {
  width: 100%;
}
</style>
