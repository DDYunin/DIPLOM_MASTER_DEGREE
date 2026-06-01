<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@tanstack/vue-query'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Message from 'primevue/message'

import { organizationApi } from '@/entities/organization'
import { grantTeacherGroupAccess, type TeacherScopeType } from '@/entities/teacher-access'
import { useNotifications } from '@/shared/model'

const props = defineProps<{
  teacherId: string
}>()

const emit = defineEmits<{
  granted: []
}>()

const { t } = useI18n()
const notifications = useNotifications()

const isVisible = ref(false)
const scopeType = ref<TeacherScopeType | null>(null)
const facultyId = ref<number | null>(null)
const fieldOfStudyId = ref<number | null>(null)
const studentGroupId = ref<number | null>(null)

const faculties = ref<{ id: number; name: string }[]>([])
const fieldsOfStudy = ref<{ id: number; name: string }[]>([])
const studentGroups = ref<{ id: number; name: string }[]>([])

const isLoadingFaculties = ref(false)
const isLoadingFields = ref(false)
const isLoadingGroups = ref(false)
const loadError = ref<string | null>(null)

const scopeTypeOptions = computed(() => [
  { label: t('addPermission.scopeTypes.faculty'), value: 'FACULTY' as const },
  { label: t('addPermission.scopeTypes.fieldOfStudy'), value: 'FIELD_OF_STUDY' as const },
  { label: t('addPermission.scopeTypes.studentGroup'), value: 'STUDENT_GROUP' as const }
])

const showFacultySelect = computed(() => scopeType.value !== null)
const showFieldSelect = computed(
  () => scopeType.value === 'FIELD_OF_STUDY' || scopeType.value === 'STUDENT_GROUP'
)
const showGroupSelect = computed(() => scopeType.value === 'STUDENT_GROUP')

const scopeId = computed<number | null>(() => {
  if (scopeType.value === 'FACULTY') return facultyId.value
  if (scopeType.value === 'FIELD_OF_STUDY') return fieldOfStudyId.value
  if (scopeType.value === 'STUDENT_GROUP') return studentGroupId.value
  return null
})

const canSubmit = computed(() => scopeType.value !== null && scopeId.value !== null)

const resetForm = () => {
  scopeType.value = null
  facultyId.value = null
  fieldOfStudyId.value = null
  studentGroupId.value = null
  fieldsOfStudy.value = []
  studentGroups.value = []
  loadError.value = null
}

const loadFaculties = async () => {
  isLoadingFaculties.value = true
  loadError.value = null
  try {
    const response = await organizationApi.fetchFacultiesList()
    faculties.value = response.items
  } catch {
    loadError.value = t('addPermission.loadError')
  } finally {
    isLoadingFaculties.value = false
  }
}

const loadFieldsOfStudy = async (selectedFacultyId: number) => {
  isLoadingFields.value = true
  loadError.value = null
  try {
    const response = await organizationApi.fetchFieldsOfStudyByFaculty(selectedFacultyId)
    fieldsOfStudy.value = response.items
  } catch {
    loadError.value = t('addPermission.loadError')
  } finally {
    isLoadingFields.value = false
  }
}

const loadStudentGroups = async (selectedFieldId: number) => {
  isLoadingGroups.value = true
  loadError.value = null
  try {
    const response = await organizationApi.fetchStudentGroupsByFieldOfStudy(selectedFieldId)
    studentGroups.value = response.items
  } catch {
    loadError.value = t('addPermission.loadError')
  } finally {
    isLoadingGroups.value = false
  }
}

watch(scopeType, () => {
  facultyId.value = null
  fieldOfStudyId.value = null
  studentGroupId.value = null
  fieldsOfStudy.value = []
  studentGroups.value = []
})

watch(facultyId, (value) => {
  fieldOfStudyId.value = null
  studentGroupId.value = null
  studentGroups.value = []
  if (value && showFieldSelect.value) {
    loadFieldsOfStudy(value)
  }
})

watch(fieldOfStudyId, (value) => {
  studentGroupId.value = null
  if (value && showGroupSelect.value) {
    loadStudentGroups(value)
  }
})

const grantMutation = useMutation({
  mutationFn: () =>
    grantTeacherGroupAccess(props.teacherId, {
      scopeType: scopeType.value!,
      scopeId: scopeId.value!
    }),
  onSuccess: () => {
    notifications.showToast('success', t('common.success'), t('addPermission.grantSuccess'))
    isVisible.value = false
    resetForm()
    emit('granted')
  }
})

const openModal = async () => {
  resetForm()
  isVisible.value = true
  if (faculties.value.length === 0) {
    await loadFaculties()
  }
}

const handleSave = () => {
  if (!canSubmit.value || grantMutation.isPending.value) return
  grantMutation.mutate()
}
</script>

<template>
  <Button
    :label="t('addPermission.addPermission')"
    icon="pi pi-plus"
    text
    class="add-btn"
    @click="openModal"
  />

  <Dialog
    v-model:visible="isVisible"
    modal
    :style="{ width: '520px' }"
    class="permission-dialog"
    :pt="{
      header: { class: 'dialog-header' },
      content: { class: 'dialog-content' }
    }"
  >
    <template #header>
      <div class="header-container">
        <h2 class="dialog-title">{{ t('addPermission.modalTitle') }}</h2>
        <p class="dialog-subtitle">{{ t('addPermission.subtitle') }}</p>
      </div>
    </template>

    <Message v-if="loadError" severity="error" :closable="false" class="load-error">
      {{ loadError }}
    </Message>

    <div class="form-fields">
      <div class="form-field">
        <label>{{ t('addPermission.scopeType') }}</label>
        <Select
          v-model="scopeType"
          :options="scopeTypeOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('addPermission.scopeTypePlaceholder')"
          class="w-full"
        />
      </div>

      <div v-if="showFacultySelect" class="form-field">
        <label>{{ t('addPermission.faculty') }}</label>
        <Select
          v-model="facultyId"
          :options="faculties"
          optionLabel="name"
          optionValue="id"
          :placeholder="t('addPermission.facultyPlaceholder')"
          :loading="isLoadingFaculties"
          class="w-full"
        />
      </div>

      <div v-if="showFieldSelect" class="form-field">
        <label>{{ t('addPermission.fieldOfStudy') }}</label>
        <Select
          v-model="fieldOfStudyId"
          :options="fieldsOfStudy"
          optionLabel="name"
          optionValue="id"
          :placeholder="t('addPermission.fieldOfStudyPlaceholder')"
          :loading="isLoadingFields"
          :disabled="!facultyId"
          class="w-full"
        />
      </div>

      <div v-if="showGroupSelect" class="form-field">
        <label>{{ t('addPermission.studentGroup') }}</label>
        <Select
          v-model="studentGroupId"
          :options="studentGroups"
          optionLabel="name"
          optionValue="id"
          :placeholder="t('addPermission.studentGroupPlaceholder')"
          :loading="isLoadingGroups"
          :disabled="!fieldOfStudyId"
          class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <div class="footer-actions">
        <Button :label="t('common.cancel')" text class="cancel-btn" @click="isVisible = false" />
        <Button
          :label="t('addPermission.addSelected')"
          class="save-btn"
          icon="pi pi-check"
          :loading="grantMutation.isPending.value"
          :disabled="!canSubmit"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.add-btn {
  background: var(--color-primary-subtle);
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
}

.header-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

.dialog-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.load-error {
  margin-bottom: 1rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.w-full {
  width: 100%;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  width: 100%;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border-subtle);
}

.cancel-btn {
  color: var(--text-color-muted);
}

.save-btn {
  background: var(--color-primary-strong);
  border: none;
}
</style>
