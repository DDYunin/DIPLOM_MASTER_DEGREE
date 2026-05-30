<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Select from 'primevue/select'

import { WidgetCard } from '@/shared/ui'
import type { User } from '@/entities/user'

const { t } = useI18n()

export type ProfileInfoFieldErrors = Partial<
  Record<'email' | 'firstName' | 'lastName' | 'middleName' | 'departmentId' | 'groupId', string>
>

const props = withDefaults(
  defineProps<{
    modelValue: User
    variant?: 'default' | 'own-profile'
    emailError?: string
    emailInputAttrs?: Record<string, unknown>
    fieldErrors?: ProfileInfoFieldErrors
    departmentOptions?: { id: number; name: string }[]
    groupOptions?: { id: number; name: string }[]
  }>(),
  {
    variant: 'default',
    emailError: undefined,
    emailInputAttrs: undefined,
    fieldErrors: undefined,
    departmentOptions: () => [],
    groupOptions: () => []
  }
)
const emit = defineEmits(['update:modelValue'])

const profile = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const initials = computed(() => {
  if (profile.value.avatarInitials) return profile.value.avatarInitials
  if (!profile.value.fullName) return 'U'
  return profile.value.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
})

const getRoleSeverity = (role: string) => {
  if (role === 'Super Admin') return 'danger'
  if (role === 'Teacher') return 'warn'
  if (role === 'Moderator') return 'info'
  return 'success'
}

const isStudentOrTeacher = computed(() => ['Student', 'Teacher'].includes(profile.value.role))
</script>

<template>
  <WidgetCard :title="t('profileCard.title')" icon="pi-user" iconColorClass="text-blue-500">
    <div class="profile-content">
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <Avatar :label="initials" size="xlarge" shape="circle" class="custom-avatar" />
          <button type="button" class="camera-btn" :title="t('profileCard.changeAvatar')">
            <i class="pi pi-camera"></i>
          </button>
        </div>
      </div>

      <div class="form-grid">
        <template v-if="variant === 'default' && isStudentOrTeacher">
          <div class="form-field">
            <label>{{ t('teacherProfile.lastName') }}</label>
            <InputText
              v-model="profile.lastName"
              :invalid="!!fieldErrors?.lastName"
              class="w-full"
            />
            <small v-if="fieldErrors?.lastName" class="field-error">{{ fieldErrors.lastName }}</small>
          </div>

          <div class="form-field">
            <label>{{ t('teacherProfile.firstName') }}</label>
            <InputText
              v-model="profile.firstName"
              :invalid="!!fieldErrors?.firstName"
              class="w-full"
            />
            <small v-if="fieldErrors?.firstName" class="field-error">{{ fieldErrors.firstName }}</small>
          </div>

          <div class="form-field">
            <label>{{ t('teacherProfile.patronymic') }}</label>
            <InputText
              v-model="profile.patronymic"
              :invalid="!!fieldErrors?.middleName"
              class="w-full"
            />
            <small v-if="fieldErrors?.middleName" class="field-error">{{ fieldErrors.middleName }}</small>
          </div>
        </template>

        <div v-else class="form-field">
          <label>{{ t('profileCard.fullName') }}</label>
          <InputText v-model="profile.fullName" :disabled="variant === 'own-profile'" />
        </div>

        <div v-if="variant === 'own-profile'" class="form-field">
          <label>{{ t('profileCard.username') }}</label>
          <InputText v-model="profile.identifier" disabled class="w-full" />
        </div>

        <div class="form-field">
          <label>{{ t('common.role') }}</label>
          <div class="role-display">
            <Tag :severity="getRoleSeverity(profile.role)" :value="profile.role" rounded />
          </div>
        </div>

        <div class="form-field">
          <label>{{ t('profileCard.email') }}</label>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-envelope" />
            <InputText
              v-model="profile.email"
              v-bind="variant === 'own-profile' ? emailInputAttrs : undefined"
              :invalid="variant === 'own-profile' ? !!emailError : !!fieldErrors?.email"
              class="w-full"
            />
          </IconField>
          <small
            v-if="variant === 'own-profile' ? emailError : fieldErrors?.email"
            class="field-error"
          >
            {{ variant === 'own-profile' ? emailError : fieldErrors?.email }}
          </small>
        </div>

        <div
          v-if="
            variant === 'default' &&
            (['Super Admin', 'Moderator'].includes(profile.role) || profile.phone !== undefined)
          "
          class="form-field"
        >
          <label>{{ t('profileCard.phone') }}</label>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-phone" />
            <InputText v-model="profile.phone" class="w-full" />
          </IconField>
        </div>

        <div v-if="variant === 'default' && isStudentOrTeacher" class="form-field">
          <label>{{ profile.role === 'Student' ? t('teacherProfile.studentId') : t('profileCard.employeeId') }}</label>
          <InputText
            :value="profile.identifier ?? profile.studentId ?? ''"
            disabled
            class="w-full"
          />
        </div>

        <div v-if="variant === 'default' && profile.role === 'Student'" class="form-field">
          <label>{{ t('teacherProfile.institute') }}</label>
          <InputText :value="profile.institute ?? ''" disabled class="w-full" />
        </div>

        <div v-if="variant === 'default' && profile.role === 'Student'" class="form-field">
          <label>{{ t('teacherProfile.major') }}</label>
          <InputText :value="profile.major ?? ''" disabled class="w-full" />
        </div>

        <div v-if="variant === 'default' && profile.role === 'Teacher'" class="form-field">
          <label>{{ t('profileCard.department') }}</label>
          <Select
            v-model="profile.departmentId"
            :options="departmentOptions"
            option-label="name"
            option-value="id"
            :placeholder="t('addUser.selectDepartment')"
            :invalid="!!fieldErrors?.departmentId"
            class="w-full"
          />
          <small v-if="fieldErrors?.departmentId" class="field-error">{{ fieldErrors.departmentId }}</small>
        </div>

        <div v-if="variant === 'default' && profile.role === 'Student'" class="form-field">
          <label>{{ t('teacherProfile.group') }}</label>
          <Select
            v-model="profile.groupId"
            :options="groupOptions"
            option-label="name"
            option-value="id"
            :placeholder="t('addUser.selectGroup')"
            :invalid="!!fieldErrors?.groupId"
            class="w-full"
          />
          <small v-if="fieldErrors?.groupId" class="field-error">{{ fieldErrors.groupId }}</small>
        </div>
      </div>
    </div>
  </WidgetCard>
</template>

<style scoped>
.profile-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.avatar-section {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  width: 100px;
}
.avatar-wrapper {
  position: relative;
}
.custom-avatar {
  background-color: var(--color-warning-muted);
  color: var(--color-warning-text);
  font-weight: 700;
  width: 80px;
  height: 80px;
  font-size: 2rem;
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: -5px;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-color-secondary);
  transition: all 0.2s;
}
.camera-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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

.field-error {
  color: var(--color-danger, #ef4444);
  font-size: 0.75rem;
}

.full-width {
  grid-column: span 2;
}
.w-full {
  width: 100%;
}

.role-display {
  height: 2.5rem;
  display: flex;
  align-items: center;
}

@media (max-width: 640px) {
  .profile-content {
    flex-direction: column;
    align-items: center;
  }
  .form-grid {
    grid-template-columns: 1fr;
    width: 100%;
  }
  .full-width {
    grid-column: span 1;
  }
}
</style>
