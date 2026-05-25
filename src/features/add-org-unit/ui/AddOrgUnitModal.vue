<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import type { OrgTreeNode, OrgUnitType, TreeHierarchyType } from '@/entities/organization'

// TODO: добавить переводы
const { t } = useI18n()

const props = defineProps<{
  parentNode: OrgTreeNode | null
  hierarchyType: TreeHierarchyType
}>()

const emit = defineEmits<{
  (e: 'add', newNode: OrgTreeNode): void
}>()

const isVisible = ref(false)

const formData = ref({
  name: '',
  shortName: '',
  code: ''
})

const childType = computed<OrgUnitType>(() => {
  if (!props.parentNode) {
    return 'faculty'
  }

  if (props.hierarchyType === 'administrative') {
    if (props.parentNode.type === 'faculty') {
      return 'department'
    }
  } else {
    if (props.parentNode.type === 'faculty') {
      return 'fieldOfStudy'
    }
    if (props.parentNode.type === 'fieldOfStudy') {
      return 'group'
    }
  }

  return 'group'
})

const labels = computed(() => {
  // Маппинг внутренних типов в красивые названия для UI
  const typeNames: Record<OrgUnitType, string> = {
    faculty: 'Faculty / Institute',
    department: 'Department',
    fieldOfStudy: 'Field of Study',
    group: 'Student Group'
  }

  const cType = typeNames[childType.value]
  const pType = props.parentNode ? typeNames[props.parentNode.type] : 'Root Organization'

  return {
    modalTitle: `Add New ${cType}`,
    parentLabel: `Parent ${pType}`,
    nameLabel: `${cType} Name`,
    btnLabel: `Create ${cType}`
  }
})

const parentIcon = computed(() => {
  if (!props.parentNode) {
    return 'pi-building text-blue-500'
  }
  const icons: Record<string, string> = {
    faculty: 'pi-building text-blue-500',
    institute: 'pi-home text-orange-500',
    department: 'pi-folder text-blue-400',
    fieldOfStudy: 'pi-compass text-purple-500'
  }
  return icons[props.parentNode.type] || 'pi-folder'
})

// Открытие модалки (метод дергается из виджета OrgTreeBuilder)
const openModal = () => {
  formData.value = { name: '', shortName: '', code: '' } // Сброс формы
  isVisible.value = true
}

defineExpose({ openModal })

const handleCreate = () => {
  if (!formData.value.name.trim()) {
    return
  }

  const newNode: OrgTreeNode = {
    key: `temp-${Date.now()}`, // Временный ключ, бэкенд (store) его заменит на настоящий ID
    label: formData.value.name,
    type: childType.value,
    leaf: childType.value === 'department' || childType.value === 'group', // Кафедры и группы не имеют детей
    data: {
      // Передаем специфичные поля. Стор сам решит, какие из них отправить в DTO
      shortName: formData.value.shortName,
      code: formData.value.code
    }
  }

  emit('add', newNode)
  isVisible.value = false
}
</script>

<template>
  <Dialog v-model:visible="isVisible" modal :style="{ width: '450px' }" class="add-unit-dialog">
    <template #header>
      <h2 class="dialog-title">{{ labels.modalTitle }}</h2>
    </template>

    <div class="form-layout">
      <!-- Родительский узел (Read-only) -->
      <div class="form-field">
        <label>{{ labels.parentLabel }}</label>
        <div class="disabled-input">
          <i class="pi" :class="parentIcon"></i>
          <span>{{ parentNode ? parentNode.label : 'Root Organization' }}</span>
        </div>
      </div>

      <!-- Общее поле: Имя -->
      <div class="form-field mt-3">
        <label>{{ labels.nameLabel }}</label>
        <InputText v-model="formData.name" placeholder="Enter name..." autofocus />
      </div>

      <!-- Специфичное поле: Short Name (Только для Факультетов) -->
      <div v-if="childType === 'faculty'" class="form-field mt-3">
        <label>SHORT NAME / ABBREVIATION</label>
        <InputText v-model="formData.shortName" placeholder="e.g. ENG" />
      </div>

      <!-- Специфичное поле: Code (Только для Направлений) -->
      <div v-if="childType === 'fieldOfStudy'" class="form-field mt-3">
        <label>PROGRAM CODE</label>
        <InputText v-model="formData.code" placeholder="e.g. SE-09" />
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
  color: var(--text-color);
}

.form-layout {
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
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

.mt-3 {
  margin-top: 1rem;
}

/* Имитация заблокированного инпута с иконкой */
.disabled-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--surface-ground);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-color-muted);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: not-allowed;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border-subtle);
  width: 100%;
}
.cancel-btn {
  color: var(--text-color-muted);
}
.submit-btn {
  background: var(--color-primary);
  border: none;
  color: var(--color-on-primary);
}

/* Фикс ширины для PrimeVue */
:deep(.p-inputtext) {
  width: 100%;
}
</style>
