<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type { OrgTreeNode, OrgUnitType } from '@/entities/organization'
import type { TreeHierarchyType } from '@/entities/organization'

const props = defineProps<{
  parentNode: OrgTreeNode | null
  hierarchyType: TreeHierarchyType // <-- Новый пропс
}>()

const emit = defineEmits<{
  (e: 'add', newNode: OrgTreeNode): void
}>()

const isVisible = ref(false)

// Форма
const formData = ref({
  name: '',
  code: '',
  status: 'Active',
  head: ''
})

const statusOptions = ['Active', 'Inactive', 'Planning']
const headOptions = ['Dr. Sarah Smith', 'Prof. John Doe', 'Dr. Emily Chen']

// Логика определения типа добавляемого узла
const childType = computed<OrgUnitType>(() => {
  if (!props.parentNode || props.parentNode.type === 'university') return 'institute'

  if (props.hierarchyType === 'academic') {
    if (props.parentNode.type === 'institute') return 'fieldOfStudy'
    if (props.parentNode.type === 'fieldOfStudy') return 'group'
  } else {
    if (props.parentNode.type === 'institute') return 'department'
  }
  return 'group'
})

// Динамические тексты интерфейса
const labels = computed(() => {
  // Форматируем CamelCase (fieldOfStudy -> Field Of Study)
  const formatType = (type: string) =>
    type === 'fieldOfStudy' ? 'Field of Study' : type.charAt(0).toUpperCase() + type.slice(1)
  const cType = formatType(childType.value)
  const pType = props.parentNode ? formatType(props.parentNode.type) : 'Organization'

  return {
    modalTitle: `Add New ${cType}`,
    parentLabel: `Parent ${pType}`,
    nameLabel: `${cType} Name`,
    codeLabel: `${cType} Code`,
    btnLabel: `Create ${cType}`
  }
})
// Иконка родителя (для disabled поля)
const parentIcon = computed(() => {
  if (!props.parentNode) return 'pi-building'
  const icons: Record<string, string> = {
    university: 'pi-building text-blue-500',
    institute: 'pi-home text-orange-500',
    department: 'pi-folder text-blue-400'
  }
  return icons[props.parentNode.type] || 'pi-folder'
})

// Открытие модалки (экспортируем метод для вызова из родителя)
const openModal = () => {
  formData.value = { name: '', code: '', status: 'Active', head: '' }
  isVisible.value = true
}
defineExpose({ openModal })

const handleCreate = () => {
  if (!formData.value.name) return // Простая валидация

  // Создаем объект нового узла
  const newNode: OrgTreeNode = {
    key: `new-${Date.now()}`,
    label: formData.value.name,
    type: childType.value,
    data: {
      code: formData.value.code,
      status: formData.value.status,
      head: formData.value.head
        ? { name: formData.value.head, avatarInitials: formData.value.head.charAt(0) }
        : undefined,
      createdDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    },
    children: []
  }

  emit('add', newNode)
  isVisible.value = false
}
</script>

<template>
  <Dialog v-model:visible="isVisible" modal :style="{ width: '500px' }" class="add-unit-dialog">
    <template #header>
      <h2 class="dialog-title">{{ labels.modalTitle }}</h2>
    </template>

    <div class="form-layout">
      <!-- Parent Node (Disabled look) -->
      <div class="field">
        <label>{{ labels.parentLabel }}</label>
        <div class="disabled-input">
          <i class="pi" :class="parentIcon"></i>
          <span>{{ parentNode ? parentNode.label : 'Root Organization' }}</span>
        </div>
      </div>

      <!-- Name -->
      <div class="field">
        <label>{{ labels.nameLabel }}</label>
        <InputText v-model="formData.name" placeholder="e.g. Civil Engineering" />
      </div>

      <!-- Code & Status (2 columns) -->
      <div class="grid-row">
        <div class="field w-half">
          <label>{{ labels.codeLabel }}</label>
          <InputText v-model="formData.code" placeholder="E.G. CIV-02" />
        </div>
        <div class="field w-half">
          <label>Status</label>
          <Select v-model="formData.status" :options="statusOptions" />
        </div>
      </div>

      <!-- Head of Department -->
      <div class="field">
        <label>{{ labels.headLabel }}</label>
        <Select v-model="formData.head" :options="headOptions" placeholder="Select a user..." />
        <span class="hint-text">Optional. Can be assigned later.</span>
      </div>
    </div>

    <template #footer>
      <div class="footer-actions">
        <Button label="Cancel" text class="cancel-btn" @click="isVisible = false" />
        <Button :label="labels.btnLabel" class="submit-btn" @click="handleCreate" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.5rem;
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

/* Имитация выключенного инпута с иконкой, как на макете */
.disabled-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: not-allowed;
}

.grid-row {
  display: flex;
  gap: 1rem;
}
.w-half {
  flex: 1;
}
.hint-text {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  width: 100%;
}
.cancel-btn {
  color: #475569;
}
.submit-btn {
  background: #3b82f6;
  border: none;
}

/* Фикс ширины для PrimeVue */
:deep(.p-inputtext),
:deep(.p-select) {
  width: 100%;
}
</style>
