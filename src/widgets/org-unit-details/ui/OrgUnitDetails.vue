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

const emit = defineEmits<{
  close: []
  'update:isEditing': [value: boolean]
  save: [node: OrgTreeNode]
  delete: [node: OrgTreeNode]
}>()

const { t } = useI18n()
const confirm = useConfirm()

const draft = ref({
  label: '',
  shortName: ''
})

watch(
  () => props.isEditing,
  (isEditing) => {
    if (isEditing && props.selectedNode) {
      draft.value = {
        label: props.selectedNode.label,
        shortName: props.selectedNode.data?.shortName || ''
      }
    }
  }
)

const startEditing = () => emit('update:isEditing', true)
const cancelEditing = () => emit('update:isEditing', false)

const saveChanges = () => {
  if (!props.selectedNode) {
    return
  }

  emit('save', {
    ...props.selectedNode,
    label: draft.value.label.trim(),
    data: {
      ...props.selectedNode.data,
      originalId: props.selectedNode.data!.originalId,
      shortName: draft.value.shortName.trim() || undefined
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
      emit('delete', props.selectedNode!)
    }
  })
}

const getIconData = (type?: string) => {
  if (type === 'faculty') {
    return { icon: 'pi-building', bgClass: 'bg-info' }
  }
  if (type === 'department') {
    return { icon: 'pi-folder', bgClass: 'bg-warning' }
  }
  if (type === 'fieldOfStudy') {
    return { icon: 'pi-compass', bgClass: 'bg-purple' }
  }
  return { icon: 'pi-users', bgClass: 'bg-primary' }
}

const formatType = (type?: string) => {
  if (!type) {
    return ''
  }
  if (type === 'faculty' || type === 'department' || type === 'fieldOfStudy' || type === 'group') {
    return t(`adminOrgUnitModal.${type}`)
  }
  return type.charAt(0).toUpperCase() + type.slice(1)
}
</script>

<template>
  <div v-if="selectedNode && selectedNode.data" class="details-panel">
    <div class="panel-header">
      <div class="icon-box" :class="getIconData(selectedNode.type).bgClass">
        <i class="pi" :class="getIconData(selectedNode.type).icon"></i>
      </div>
      <button class="close-btn" @click="emit('close')"><i class="pi pi-times"></i></button>
    </div>

    <template v-if="!isEditing">
      <div class="node-title-section">
        <h2 class="node-title">{{ selectedNode.label }}</h2>
        <Tag severity="info" :value="formatType(selectedNode.type)" rounded class="type-tag" />
      </div>

      <div class="meta-list">
        <div class="meta-item">
          <span class="meta-label">{{ t('adminOrg.databaseId') }}</span>
          <span class="meta-value font-mono">#{{ selectedNode.data.originalId }}</span>
        </div>

        <div v-if="selectedNode.data.shortName" class="meta-item">
          <span class="meta-label">{{ t('adminOrg.shortName') }}</span>
          <span class="meta-value">{{ selectedNode.data.shortName }}</span>
        </div>

        <div v-if="selectedNode.data.facultyId" class="meta-item">
          <span class="meta-label">{{ t('adminOrg.facultyId') }}</span>
          <span class="meta-value font-mono">#{{ selectedNode.data.facultyId }}</span>
        </div>

        <div v-if="selectedNode.data.fieldOfStudyId" class="meta-item">
          <span class="meta-label">{{ t('adminOrg.fieldOfStudyId') }}</span>
          <span class="meta-value font-mono">#{{ selectedNode.data.fieldOfStudyId }}</span>
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

    <template v-else>
      <div class="edit-form">
        <div class="form-field">
          <label>{{ formatType(selectedNode.type).toUpperCase() }} {{ t('adminOrg.nameField') }}</label>
          <InputText v-model="draft.label" autofocus />
        </div>

        <div v-if="selectedNode.type === 'faculty'" class="form-field mt-3">
          <label>{{ t('adminOrg.shortName') }}</label>
          <InputText v-model="draft.shortName" :placeholder="t('adminOrg.codePlaceholder')" />
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

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-color-secondary);
  cursor: pointer;
}

.node-title-section {
  margin-bottom: 2rem;
}

.node-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
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
}

.action-btn {
  width: 100%;
}

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

.cancel-link {
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  text-decoration: underline;
  cursor: pointer;
}

:deep(.p-inputtext) {
  width: 100%;
}
</style>
