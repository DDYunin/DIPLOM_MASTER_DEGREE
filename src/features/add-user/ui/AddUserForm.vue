<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useQuery } from '@tanstack/vue-query'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

import { organizationApi } from '@/entities/organization'
import { ROLES } from '@/shared/config/roles'
import {
  createAddUserFormSchema,
  getAddUserInitialValues,
  type AddUserFormValues
} from '../lib/schema'

const props = defineProps<{
  active: boolean
}>()

const emit = defineEmits<{
  submit: [values: AddUserFormValues]
}>()

const { t } = useI18n()

const validationSchema = computed(() => toTypedSchema(createAddUserFormSchema(t)))

const { defineField, errors, handleSubmit, resetForm, values, setFieldValue } = useForm({
  validationSchema,
  initialValues: getAddUserInitialValues()
})

const [username, usernameAttrs] = defineField('username')
const [email, emailAttrs] = defineField('email')
const [lastName, lastNameAttrs] = defineField('lastName')
const [firstName, firstNameAttrs] = defineField('firstName')
const [middleName, middleNameAttrs] = defineField('middleName')
const [role, roleAttrs] = defineField('role')
const [departmentId, departmentIdAttrs] = defineField('departmentId')
const [groupId, groupIdAttrs] = defineField('groupId')

const roleOptions = computed(() => [
  { label: t('roles.admin'), value: ROLES.ADMIN },
  { label: t('roles.teacher'), value: ROLES.TEACHER },
  { label: t('roles.student'), value: ROLES.STUDENT }
])

const showDepartmentField = computed(
  () => values.role === ROLES.TEACHER || values.role === ROLES.STUDENT
)
const showGroupField = computed(() => values.role === ROLES.STUDENT)
const isDepartmentRequired = computed(() => values.role === ROLES.TEACHER)

const departmentsQuery = useQuery({
  queryKey: ['hierarchy-departments-list'],
  queryFn: () =>
    organizationApi.fetchDepartmentsList({ page: 0, size: 500, sort: 'name,ASC' }),
  enabled: computed(() => props.active && showDepartmentField.value)
})

const groupsQuery = useQuery({
  queryKey: ['hierarchy-student-groups-list'],
  queryFn: () =>
    organizationApi.fetchStudentGroupsList({ page: 0, size: 500, sort: 'name,ASC' }),
  enabled: computed(() => props.active && showGroupField.value)
})

const departmentOptions = computed(() => departmentsQuery.data.value?.items ?? [])
const groupOptions = computed(() => groupsQuery.data.value?.items ?? [])

watch(
  () => values.role,
  () => {
    setFieldValue('departmentId', null)
    setFieldValue('groupId', null)
  }
)

const onSubmit = handleSubmit((formValues) => {
  emit('submit', formValues)
})

const reset = () => {
  resetForm({ values: getAddUserInitialValues() })
}

defineExpose({ submit: onSubmit, reset })
</script>

<template>
  <form class="form-container" @submit.prevent="onSubmit">
    <div class="field">
      <label for="username">{{ t('addUser.username') }}</label>
      <InputText
        id="username"
        v-model="username"
        v-bind="usernameAttrs"
        :placeholder="t('addUser.usernamePlaceholder')"
        :invalid="!!errors.username"
      />
      <small v-if="errors.username" class="field-error">{{ errors.username }}</small>
    </div>

    <div class="field">
      <label for="email">{{ t('addUser.email') }}</label>
      <InputText
        id="email"
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        :placeholder="t('addUser.emailPlaceholder')"
        :invalid="!!errors.email"
      />
      <small v-if="errors.email" class="field-error">{{ errors.email }}</small>
    </div>

    <div class="field-row">
      <div class="field w-half">
        <label for="lastName">{{ t('addUser.lastName') }}</label>
        <InputText
          id="lastName"
          v-model="lastName"
          v-bind="lastNameAttrs"
          :placeholder="t('addUser.lastNamePlaceholder')"
          :invalid="!!errors.lastName"
        />
        <small v-if="errors.lastName" class="field-error">{{ errors.lastName }}</small>
      </div>
      <div class="field w-half">
        <label for="firstName">{{ t('addUser.firstName') }}</label>
        <InputText
          id="firstName"
          v-model="firstName"
          v-bind="firstNameAttrs"
          :placeholder="t('addUser.firstNamePlaceholder')"
          :invalid="!!errors.firstName"
        />
        <small v-if="errors.firstName" class="field-error">{{ errors.firstName }}</small>
      </div>
    </div>

    <div class="field">
      <label for="middleName">{{ t('addUser.middleName') }}</label>
      <InputText
        id="middleName"
        v-model="middleName"
        v-bind="middleNameAttrs"
        :placeholder="t('addUser.middleNamePlaceholder')"
      />
    </div>

    <div class="field">
      <label for="role">{{ t('common.role') }}</label>
      <Select
        id="role"
        v-model="role"
        v-bind="roleAttrs"
        :options="roleOptions"
        option-label="label"
        option-value="value"
        :placeholder="t('addUser.selectRole')"
        :invalid="!!errors.role"
      />
      <small v-if="errors.role" class="field-error">{{ errors.role }}</small>
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
        v-model="departmentId"
        v-bind="departmentIdAttrs"
        :options="departmentOptions"
        option-label="name"
        option-value="id"
        :placeholder="t('addUser.selectDepartment')"
        :loading="departmentsQuery.isFetching.value"
        :invalid="!!errors.departmentId"
        :show-clear="!isDepartmentRequired"
      />
      <small v-if="errors.departmentId" class="field-error">{{ errors.departmentId }}</small>
    </div>

    <div v-if="showGroupField" class="field">
      <label for="group">{{ t('addUser.group') }}</label>
      <Select
        id="group"
        v-model="groupId"
        v-bind="groupIdAttrs"
        :options="groupOptions"
        option-label="name"
        option-value="id"
        :placeholder="t('addUser.selectGroup')"
        :loading="groupsQuery.isFetching.value"
        :invalid="!!errors.groupId"
      />
      <small v-if="errors.groupId" class="field-error">{{ errors.groupId }}</small>
    </div>
  </form>
</template>

<style scoped>
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

.field-error {
  color: var(--color-danger, #ef4444);
  font-size: 0.75rem;
}

:deep(.p-inputtext),
:deep(.p-select) {
  width: 100%;
}
</style>
