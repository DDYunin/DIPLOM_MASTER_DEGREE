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

// Локальный черновик для редактирования
const draft = ref<any>({})

// Справочники для селектов
const statusOptions = ['Active', 'Inactive', 'Archived']
const deptOptions = ['Computer Science', 'Electrical Engineering', 'Mathematics']
const headOptions = ['Dr. Sarah Smith', 'Prof. John Doe', 'Dr. Emily Chen']

// При входе в режим редактирования клонируем данные узла
watch(
  () => props.isEditing,
  (newVal) => {
    if (newVal && props.selectedNode) {
      draft.value = {
        label: props.selectedNode.label,
        ...props.selectedNode.data
      }
      // Преобразуем строку даты в объект Date для DatePicker
      if (draft.value.createdDate) {
        draft.value.createdDateObj = new Date(draft.value.createdDate)
      }
    }
  }
)

const startEditing = () => {
  emit('update:isEditing', true)
}

const cancelEditing = () => {
  emit('update:isEditing', false)
}

const saveChanges = () => {
  // Форматируем обратно дату
  // if (draft.value.createdDateObj) {
  //   const d = draft.value.createdDateObj
  //   draft.value.createdDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
  // }
  if (draft.value.createdDateObj) {
    const d = draft.value.createdDateObj as Date
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    draft.value.createdDate = `${month}/${day}/${d.getFullYear()}`
    delete draft.value.createdDateObj // Убираем временный объект
  }

  // Отправляем сохраненные данные наверх
  emit('save', {
    ...props.selectedNode,
    label: draft.value.label,
    data: { ...props.selectedNode?.data, ...draft.value }
  })

  emit('update:isEditing', false)
}
</script>

<template>
  <div v-if="selectedNode && selectedNode.data" class="details-panel">
    <!-- ШАПКА -->
    <div class="panel-header">
      <div class="icon-box bg-blue"><i class="pi pi-users"></i></div>
      <button class="close-btn" @click="$emit('close')"><i class="pi pi-times"></i></button>
    </div>

    <!-- === РЕЖИМ ПРОСМОТРА === -->
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
          <span class="meta-value"
            ><i class="pi pi-folder text-gray"></i> {{ selectedNode.data.parentDept }}</span
          >
        </div>
        <div v-if="selectedNode.data.createdDate" class="meta-item">
          <span class="meta-label">CREATED DATE</span>
          <span class="meta-value">{{ selectedNode.data.createdDate }}</span>
        </div>
        <div v-if="selectedNode.data.head" class="meta-item">
          <span class="meta-label">HEAD OF Unit</span>
          <span class="meta-value head-value">
            <Avatar
              :label="selectedNode.data.head.avatarInitials"
              shape="circle"
              class="head-avatar"
            />
            {{ selectedNode.data.head.name }}
          </span>
        </div>
        <div class="meta-item">
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

    <!-- === РЕЖИМ РЕДАКТИРОВАНИЯ === -->
    <template v-else>
      <div class="edit-form">
        <div class="field">
          <label>GROUP NAME</label>
          <InputText v-model="draft.label" />
        </div>

        <div class="field">
          <label>STATUS</label>
          <Select v-model="draft.status" :options="statusOptions" class="w-full" />
        </div>

        <!-- Статистика остается Read-only в режиме редактирования -->
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

        <div class="field mt-4">
          <label>PARENT DEPT</label>
          <Select v-model="draft.parentDept" :options="deptOptions" class="w-full">
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex align-center gap-2">
                <i class="pi pi-folder text-gray-500"></i> {{ slotProps.value }}
              </div>
            </template>
          </Select>
        </div>

        <div class="field">
          <label>CREATED DATE</label>
          <DatePicker
            v-model="draft.createdDateObj"
            dateFormat="mm/dd/yy"
            showIcon
            class="w-full"
          />
        </div>

        <div class="field">
          <label>HEAD OF Unit</label>
          <Select v-model="draft.head.name" :options="headOptions" class="w-full" />
        </div>

        <div class="field">
          <label>DESCRIPTION</label>
          <Textarea v-model="draft.description" rows="4" autoResize />
        </div>
      </div>

      <!-- Кнопки сохранения как на макете -->
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

    <!-- ID в самом низу (показывается и там и там) -->
    <div class="panel-footer" v-if="selectedNode.data.groupId || selectedNode.data.code">
      {{ selectedNode.data.groupId || selectedNode.data.code }} <span v-if="isEditing">(Editing)</span>
    </div>
  </div>

  <div v-else class="empty-panel">
    <i class="pi pi-sitemap empty-icon"></i>
    <p>Select an organization unit to view details.</p>
  </div>
</template>

<style scoped>
/* Старые стили просмотра */
.details-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-left: 1px solid #e2e8f0;
  padding: 1.5rem;
  overflow-y: auto;
}
.empty-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-left: 1px solid #e2e8f0;
  color: #94a3b8;
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
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
}
.bg-blue {
  background: #eff6ff;
  color: #3b82f6;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #94a3b8;
  cursor: pointer;
}

.node-title-section {
  margin-bottom: 2rem;
}
.node-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}
.status-tag {
  background: #dcfce7;
  color: #16a34a;
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
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}
.stat-label {
  font-size: 0.75rem;
  color: #64748b;
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
  color: #94a3b8;
  letter-spacing: 0.05em;
}
.meta-value {
  font-size: 0.875rem;
  color: #0f172a;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.text-gray {
  color: #94a3b8;
}
.head-avatar {
  width: 24px;
  height: 24px;
  background: #fed7aa;
  color: #9a3412;
  font-size: 0.75rem;
  font-weight: 700;
}
.desc-box {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
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
  color: #0f172a;
  margin-bottom: 0.25rem;
}
.action-btn {
  width: 100%;
}
.btn-primary {
  background: #3b82f6;
  border: none;
}

.panel-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* === СТИЛИ ФОРМЫ РЕДАКТИРОВАНИЯ === */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex-grow: 1;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.w-full {
  width: 100%;
}
.mt-4 {
  margin-top: 1rem;
}
.flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.gap-2 {
  gap: 0.5rem;
}
.text-gray-500 {
  color: #64748b;
}

.edit-actions-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
}
.btn-success {
  background: #10b981;
  border: none;
  color: white;
} /* Зеленая кнопка как на макете */
.btn-success:hover {
  background: #059669;
}
.cancel-link {
  background: none;
  border: none;
  font-size: 0.875rem;
  color: #64748b;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}
.cancel-link:hover {
  color: #0f172a;
}

/* Фикс для DatePicker */
:deep(.p-datepicker) {
  width: 100%;
}
</style>
