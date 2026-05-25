<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()
const confirm = useConfirm()

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
    header: t('common.confirm'),
    message: `${t('adminOrg.deleteUnit')}: "${props.selectedNode.label}"`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: t('common.cancel'),
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: t('common.delete'),
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
  if (!type) return ''
  if (type === 'faculty' || type === 'department' || type === 'fieldOfStudy' || type === 'group') {
    return t(`adminOrgUnitModal.${type}`)
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
          <span class="stat-label">{{ t('adminOrg.students') }}</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">0</span>
          <span class="stat-label">{{ t('adminOrg.teachers') }}</span>
        </div>
      </div>

      <!-- Метаданные (Только то, что реально есть в БД) -->
      <div class="meta-list">
        <!-- Настоящий ID из базы данных (Очень полезно для админов) -->
        <div class="meta-item">
          <span class="meta-label">{{ t('adminOrg.databaseId') }}</span>
          <span class="meta-value font-mono">#{{ selectedNode.data.originalId }}</span>
        </div>

        <div v-if="selectedNode.data.shortName" class="meta-item">
          <span class="meta-label">{{ t('adminOrg.shortName') }}</span>
          <span class="meta-value">{{ selectedNode.data.shortName }}</span>
        </div>

        <div v-if="selectedNode.data.code" class="meta-item">
          <span class="meta-label">{{ t('adminOrg.programCode') }}</span>
          <span class="meta-value">{{ selectedNode.data.code }}</span>
        </div>
      </div>

      <div class="actions-section">
        <span class="actions-title">{{ t('adminOrg.quickActions') }}</span>
        <Button
          :label="t('adminOrg.editDetails')"
          icon="pi pi-pencil"
          outlined
          class="action-btn"
          @click="startEditing"
        />
        <!-- TODO: мне кажется лишней -->
        <Button
          v-if="selectedNode.type === 'group'"
          :label="t('adminOrg.assignStudents')"
          icon="pi pi-user-plus"
          class="action-btn btn-primary"
        />
        <Button
          :label="t('adminOrg.deleteUnit')"
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
          <label>{{ t('adminOrg.shortName') }}</label>
          <InputText v-model="draft.shortName" :placeholder="t('adminOrg.codePlaceholder')" />
        </div>

        <!-- Поле только для направления -->
        <div v-if="selectedNode.type === 'fieldOfStudy'" class="form-field mt-3">
          <label>{{ t('adminOrg.programCode') }}</label>
          <InputText v-model="draft.code" :placeholder="t('adminOrg.codePlaceholder')" />
        </div>
      </div>

      <div class="edit-actions-section">
        <span class="actions-title">{{ t('common.saveChanges') }}</span>
        <Button
          :label="t('common.saveChanges')"
          icon="pi pi-check"
          class="action-btn btn-success"
          @click="saveChanges"
        />
        <button class="cancel-link" @click="cancelEditing">{{ t('common.cancel') }}</button>
      </div>
    </template>
  </div>

  <div v-else class="empty-panel">
    <i class="pi pi-sitemap empty-icon"></i>
    <p>{{ t('adminOrg.selectUnitHint') }}</p>
  </div>
</template>

<style scoped>
/* ОСНОВНЫЕ СТИЛИ */
.details-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  border-left: 1px solid var(--surface-border);
  padding: 1.5rem;
  overflow-y: auto;
}
.empty-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--surface-card);
  border-left: 1px solid var(--surface-border);
  color: var(--text-color-secondary);
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--surface-border);
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
  background: var(--color-primary-subtle);
  color: var(--color-primary);
}
.bg-info {
  background: var(--color-primary-subtle);
  color: var(--color-primary);
}
.bg-warning {
  background: var(--color-warning-subtle);
  color: var(--color-warning);
}
.bg-purple {
  background: var(--color-accent-purple-subtle);
  color: var(--color-accent-purple);
}

.my-app-dark .bg-primary {
  background: var(--accent-primary-bg);
}
.my-app-dark .bg-info {
  background: var(--accent-blue-bg);
}
.my-app-dark .bg-warning {
  background: var(--accent-orange-bg);
}
.my-app-dark .bg-purple {
  background: var(--accent-purple-bg);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-color-secondary);
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover {
  color: var(--text-color);
}

/* РЕЖИМ ПРОСМОТРА */
.node-title-section {
  margin-bottom: 2rem;
}
.node-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-box {
  background: var(--surface-ground);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--surface-border);
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}
.stat-label {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
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
  color: var(--text-color-secondary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.meta-value {
  font-size: 0.875rem;
  color: var(--text-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.font-mono {
  font-family: monospace;
  color: var(--color-primary);
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
  color: var(--text-color);
  margin-bottom: 0.25rem;
}
.action-btn {
  width: 100%;
}
.btn-primary {
  background: var(--color-primary);
  border: none;
  color: var(--color-on-primary);
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
  color: var(--text-color-secondary);
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
  background: var(--color-success);
  border: none;
  color: var(--color-on-primary);
}
.btn-success:hover {
  background: var(--color-success-strong);
}
.cancel-link {
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}
.cancel-link:hover {
  color: var(--text-color);
}

:deep(.p-inputtext) {
  width: 100%;
}
</style>
