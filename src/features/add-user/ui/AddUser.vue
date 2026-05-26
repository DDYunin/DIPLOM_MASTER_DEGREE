<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

import { organizationApi } from '@/entities/organization'
import { ROLES } from '@/shared/config/roles'
import { buildCreateAdminUserPayload } from '../lib/buildPayload'
import { createInitialFormState } from '../lib/form'
import { hasFormErrors, validateAddUserForm } from '../lib/validation'
import { useAddAdminUser } from '../model/useAddAdminUser'

const { t } = useI18n()

const isVisible = ref(false)
const submitted = ref(false)
const formData = reactive(createInitialFormState())

const addUserMutation = useAddAdminUser()

const roleOptions = computed(() => [
  { label: t('roles.admin'), value: ROLES.ADMIN },
  { label: t('roles.teacher'), value: ROLES.TEACHER },
  { label: t('roles.student'), value: ROLES.STUDENT }
])

const showDepartmentField = computed(
  () => formData.role === ROLES.TEACHER || formData.role === ROLES.STUDENT
)
const showGroupField = computed(() => formData.role === ROLES.STUDENT)
const isDepartmentRequired = computed(() => formData.role === ROLES.TEACHER)

const fieldErrors = computed(() => (submitted.value ? validateAddUserForm(formData) : {}))

const departmentsQuery = useQuery({
  queryKey: ['hierarchy-departments-list'],
  queryFn: () =>
    organizationApi.fetchDepartmentsList({ page: 0, size: 500, sort: 'name,ASC' }),
  enabled: computed(() => isVisible.value && showDepartmentField.value)
})

const groupsQuery = useQuery({
  queryKey: ['hierarchy-student-groups-list'],
  queryFn: () =>
    organizationApi.fetchStudentGroupsList({ page: 0, size: 500, sort: 'name,ASC' }),
  enabled: computed(() => isVisible.value && showGroupField.value)
})

const departmentOptions = computed(() => departmentsQuery.data.value?.items ?? [])
const groupOptions = computed(() => groupsQuery.data.value?.items ?? [])

const resetForm = () => {
  Object.assign(formData, createInitialFormState())
  submitted.value = false
}

const openModal = () => {
  resetForm()
  isVisible.value = true
}

const closeModal = () => {
  isVisible.value = false
}

watch(
  () => formData.role,
  () => {
    formData.departmentId = null
    formData.groupId = null
  }
)

watch(isVisible, (visible) => {
  if (!visible) {
    resetForm()
  }
})

const handleSave = async () => {
  submitted.value = true

  const errors = validateAddUserForm(formData)
  if (hasFormErrors(errors)) {
    return
  }

  try {
    await addUserMutation.mutateAsync(buildCreateAdminUserPayload(formData))
    closeModal()
  } catch {
    // Ошибка уже обработана в api client / mutation onError
  }
}

const isFieldInvalid = (field: keyof typeof formData) => Boolean(fieldErrors.value[field])
</script>

<template>
  <Button
    :label="t('addUser.addUser')"
    icon="pi pi-plus"
    class="btn-add"
    @click="openModal"
  />

  <Dialog
    v-model:visible="isVisible"
    modal
    :header="t('addUser.modalTitle')"
    :style="{ width: '520px' }"
    class="add-user-dialog"
  >
    <div class="form-container">
      <div class="field">
        <label for="username">{{ t('addUser.username') }}</label>
        <InputText
          id="username"
          v-model="formData.username"
          :placeholder="t('addUser.usernamePlaceholder')"
          :invalid="isFieldInvalid('username')"
        />
      </div>

      <div class="field">
        <label for="email">{{ t('addUser.email') }}</label>
        <InputText
          id="email"
          v-model="formData.email"
          type="email"
          :placeholder="t('addUser.emailPlaceholder')"
          :invalid="isFieldInvalid('email')"
        />
      </div>

      <div class="field-row">
        <div class="field w-half">
          <label for="lastName">{{ t('addUser.lastName') }}</label>
          <InputText
            id="lastName"
            v-model="formData.lastName"
            :placeholder="t('addUser.lastNamePlaceholder')"
            :invalid="isFieldInvalid('lastName')"
          />
        </div>
        <div class="field w-half">
          <label for="firstName">{{ t('addUser.firstName') }}</label>
          <InputText
            id="firstName"
            v-model="formData.firstName"
            :placeholder="t('addUser.firstNamePlaceholder')"
            :invalid="isFieldInvalid('firstName')"
          />
        </div>
      </div>

      <div class="field">
        <label for="middleName">{{ t('addUser.middleName') }}</label>
        <InputText
          id="middleName"
          v-model="formData.middleName"
          :placeholder="t('addUser.middleNamePlaceholder')"
        />
      </div>

      <div class="field">
        <label for="role">{{ t('common.role') }}</label>
        <Select
          id="role"
          v-model="formData.role"
          :options="roleOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('addUser.selectRole')"
          :invalid="isFieldInvalid('role')"
        />
      </div>

      <div v-if="showDepartmentField" class="field">
        <label for="department">
          {{ t('addUser.department') }}
          <span v-if="!isDepartmentRequired" class="optional-label">
            ({{ t('addUser.optional') }})
          </span>
        </label>
        <Select
          id="department"
          v-model="formData.departmentId"
          :options="departmentOptions"
          option-label="name"
          option-value="id"
          :placeholder="t('addUser.selectDepartment')"
          :loading="departmentsQuery.isFetching.value"
          :invalid="isFieldInvalid('departmentId')"
          :show-clear="!isDepartmentRequired"
        />
      </div>

      <div v-if="showGroupField" class="field">
        <label for="group">{{ t('addUser.group') }}</label>
        <Select
          id="group"
          v-model="formData.groupId"
          :options="groupOptions"
          option-label="name"
          option-value="id"
          :placeholder="t('addUser.selectGroup')"
          :loading="groupsQuery.isFetching.value"
          :invalid="isFieldInvalid('groupId')"
        />
      </div>
    </div>

    <template #footer>
      <Button
        :label="t('common.cancel')"
        icon="pi pi-times"
        text
        class="cancel-btn"
        :disabled="addUserMutation.isPending.value"
        @click="closeModal"
      />
      <Button
        :label="t('addUser.saveUser')"
        icon="pi pi-check"
        :loading="addUserMutation.isPending.value"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.btn-add {
  background: var(--color-primary-strong);
  border: none;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-row {
  display: flex;
  gap: 1rem;
}

.w-half {
  flex: 1;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color-emphasis);
}

.optional-label {
  font-weight: 400;
  color: var(--text-color-secondary);
}

.cancel-btn {
  color: var(--text-color-secondary);
}

:deep(.p-inputtext),
:deep(.p-select) {
  width: 100%;
}
</style>
