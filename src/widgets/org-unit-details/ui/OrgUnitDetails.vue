<script setup lang="ts">
import { ref, watch } from 'vue'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import type { OrgTreeNode } from '@/entities/organization'

const props = defineProps<{
  selectedNode: OrgTreeNode | null
  isEditing: boolean
}>()

const emit = defineEmits(['close', 'update:isEditing', 'save'])

const draft = ref<any>({})

const statusOptions = ['Active', 'Inactive', 'Archived']
const deptOptions = ['Computer Science Dept.', 'Electrical Engineering', 'Mathematics']
const headOptions = ['Dr. Sarah Smith', 'Prof. John Doe', 'Dr. Emily Chen']

watch(
  () => props.isEditing,
  (newVal) => {
    if (newVal && props.selectedNode) {
      draft.value = {
        label: props.selectedNode.label,
        ...props.selectedNode.data
      }

      if (draft.value.createdDate) {
        draft.value.createdDateObj = new Date(draft.value.createdDate)
      }
    }
  }
)

const startEditing = () => emit('update:isEditing', true)
const cancelEditing = () => emit('update:isEditing', false)

const saveChanges = () => {
  if (draft.value.createdDateObj) {
    const d = draft.value.createdDateObj as Date
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    draft.value.createdDate = `${month}/${day}/${d.getFullYear()}`
    delete draft.value.createdDateObj
  }

  emit('save', {
    ...props.selectedNode,
    label: draft.value.label,
    data: { ...props.selectedNode?.data, ...draft.value }
  })
}

// Вспомогательная функция, которая возвращает иконку и нужный CSS-класс для фона
const getIconData = (type?: string) => {
  if (type === 'university') return { icon: 'pi-building', bgClass: 'bg-info' }
  if (type === 'institute') return { icon: 'pi-home', bgClass: 'bg-warning' }
  if (type === 'department') return { icon: 'pi-folder', bgClass: 'bg-info' }
  return { icon: 'pi-users', bgClass: 'bg-primary' } // Для group
}
</script>

<template>
  <div v-if="selectedNode && selectedNode.data" class="details-panel">
    <!-- ШАПКА -->
    <div class="panel-header">
      <!-- Иконка генерируется на месте без внешнего компонента -->
      <div class="icon-box" :class="getIconData(selectedNode.type).bgClass">
        <i class="pi" :class="getIconData(selectedNode.type).icon"></i>
      </div>
      <button class="close-btn" @click="$emit('close')"><i class="pi pi-times"></i></button>
    </div>

    <!-- РЕЖИМ ПРОСМОТРА -->
    <template v-if="!isEditing">
      <div class="node-title-section">
        <h2 class="node-title">{{ selectedNode.label }}</h2>
        <Tag
          v-if="selectedNode.data.status"
          severity="success"
          :value="selectedNode.data.status"
          rounded
          class="status-tag"
        />
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-value">{{ selectedNode.data.students || 0 }}</span>
          <span class="stat-label">Students</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ selectedNode.data.teachers || 0 }}</span>
          <span class="stat-label">Teachers</span>
        </div>
      </div>

      <div class="meta-list">
        <div v-if="selectedNode.data.parentDept" class="meta-item">
          <span class="meta-label">PARENT DEPT</span>
          <span class="meta-value">
            <i class="pi pi-folder text-gray"></i> {{ selectedNode.data.parentDept }}
          </span>
        </div>

        <div v-if="selectedNode.data.createdDate" class="meta-item">
          <span class="meta-label">CREATED DATE</span>
          <span class="meta-value">{{ selectedNode.data.createdDate }}</span>
        </div>

        <div v-if="selectedNode.data.head" class="meta-item">
          <span class="meta-label">HEAD OF UNIT</span>
          <span class="meta-value head-value">
            <Avatar
              :label="selectedNode.data.head.avatarInitials"
              shape="circle"
              class="head-avatar"
            />
            {{ selectedNode.data.head.name }}
          </span>
        </div>

        <div v-if="selectedNode.data.description" class="meta-item">
          <span class="meta-label">DESCRIPTION</span>
          <div class="desc-box">{{ selectedNode.data.description }}</div>
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
        <Button label="Assign Members" icon="pi pi-user-plus" class="action-btn btn-primary" />
      </div>
    </template>

    <!-- РЕЖИМ РЕДАКТИРОВАНИЯ -->
    <template v-else>
      <div class="edit-form">
        <div class="form-field">
          <label>UNIT NAME</label>
          <InputText v-model="draft.label" />
        </div>

        <div class="form-field">
          <label>STATUS</label>
          <Select v-model="draft.status" :options="statusOptions" class="w-full" />
        </div>

        <div class="stats-grid mt-4">
          <div class="stat-box">
            <span class="stat-value">{{ selectedNode.data.students || 0 }}</span
            ><span class="stat-label">Students</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">{{ selectedNode.data.teachers || 0 }}</span
            ><span class="stat-label">Teachers</span>
          </div>
        </div>

        <div class="form-field mt-4">
          <label>PARENT DEPT</label>
          <Select v-model="draft.parentDept" :options="deptOptions" class="w-full">
            <template #value="slotProps">
              <div v-if="slotProps.value" style="display: flex; align-items: center; gap: 0.5rem">
                <i class="pi pi-folder text-gray-500"></i> {{ slotProps.value }}
              </div>
            </template>
          </Select>
        </div>

        <div class="form-field">
          <label>CREATED DATE</label>
          <DatePicker
            v-model="draft.createdDateObj"
            dateFormat="mm/dd/yy"
            showIcon
            class="w-full"
          />
        </div>

        <div class="form-field">
          <label>HEAD OF UNIT</label>
          <Select v-model="draft.head.name" :options="headOptions" class="w-full" />
        </div>

        <div class="form-field">
          <label>DESCRIPTION</label>
          <Textarea v-model="draft.description" rows="4" autoResize />
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

    <div class="panel-footer" v-if="selectedNode.data.groupId || selectedNode.data.code">
      ID: {{ selectedNode.data.groupId || selectedNode.data.code }}
      <span v-if="isEditing" class="text-editing">(Editing)</span>
    </div>
  </div>

  <div v-else class="empty-panel">
    <i class="pi pi-sitemap empty-icon"></i>
    <p>Select an organization unit to view details.</p>
  </div>
</template>

<style scoped>
/* =====================================
   ОСНОВНЫЕ СТИЛИ ПАНЕЛИ
===================================== */
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

/* --- СТИЛИ ДЛЯ ВСТРОЕННОЙ ИКОНКИ --- */
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
/* Цветовые модификаторы на основе токенов PrimeVue */
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

/* Поддержка тёмной темы для фонов иконок */
:root[class*='my-app-dark'] .bg-primary {
  background: rgba(var(--p-primary-500), 0.16);
}
:root[class*='my-app-dark'] .bg-info {
  background: rgba(var(--p-blue-500), 0.16);
}
:root[class*='my-app-dark'] .bg-warning {
  background: rgba(var(--p-orange-500), 0.16);
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
.status-tag {
  background: var(--p-green-50);
  color: var(--p-green-600);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
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
.text-gray {
  color: var(--text-color-secondary);
}
.head-avatar {
  width: 24px;
  height: 24px;
  background: var(--p-orange-100);
  color: var(--p-orange-700);
  font-size: 0.75rem;
  font-weight: 700;
}
.desc-box {
  background: var(--surface-ground);
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-color);
  line-height: 1.5;
  border: 1px solid var(--surface-border);
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
  background: var(--p-primary-500);
  border: none;
  color: white;
}

/* РЕЖИМ РЕДАКТИРОВАНИЯ */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.w-full {
  width: 100%;
}
.mt-4 {
  margin-top: 1rem;
}
.text-gray-500 {
  color: var(--text-color-secondary);
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
  color: var(--text-color-secondary);
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}
.cancel-link:hover {
  color: var(--text-color);
}

.panel-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}
.text-editing {
  color: var(--p-purple-500);
  font-weight: 500;
}

:deep(.p-datepicker) {
  width: 100%;
}
</style>
