<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'

import { useOwnProfile } from '@/features/own-profile'
import { useNotifications } from '@/shared/model'

const { t } = useI18n()
const notifications = useNotifications()

const { userId, profileQuery, updateEmailMutation, changePasswordMutation } = useOwnProfile()

const emailForm = ref({
  newEmail: '',
  confirmNewEmail: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const profile = computed(() => profileQuery.data.value ?? null)
const isLoading = computed(() => profileQuery.isPending.value)
const isSaving = computed(
  () => updateEmailMutation.isPending.value || changePasswordMutation.isPending.value
)

const avatarInitials = computed(() => {
  if (!profile.value) {
    return ''
  }

  if (profile.value.avatarInitials) {
    return profile.value.avatarInitials
  }

  return `${profile.value.firstName.charAt(0)}${profile.value.lastName.charAt(0)}`.toUpperCase()
})

const hasEmailChanges = computed(() => emailForm.value.newEmail.trim().length > 0)

const hasPasswordChanges = computed(
  () =>
    passwordForm.value.currentPassword.length > 0 ||
    passwordForm.value.newPassword.length > 0 ||
    passwordForm.value.confirmNewPassword.length > 0
)

const hasChanges = computed(() => hasEmailChanges.value || hasPasswordChanges.value)

const resetForms = () => {
  emailForm.value = { newEmail: '', confirmNewEmail: '' }
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }
}

watch(
  () => profileQuery.data.value?.email,
  () => {
    emailForm.value.newEmail = ''
    emailForm.value.confirmNewEmail = ''
  }
)

const validateEmailForm = (): boolean => {
  const newEmail = emailForm.value.newEmail.trim()
  const confirmEmail = emailForm.value.confirmNewEmail.trim()

  if (!newEmail && !confirmEmail) {
    return true
  }

  if (!newEmail || !confirmEmail) {
    notifications.showToast('warn', t('common.error'), t('teacherProfile.emailRequired'))
    return false
  }

  if (newEmail !== confirmEmail) {
    notifications.showToast('warn', t('common.error'), t('teacherProfile.emailMismatch'))
    return false
  }

  if (profile.value && newEmail === profile.value.email) {
    notifications.showToast('warn', t('common.error'), t('teacherProfile.emailSameAsCurrent'))
    return false
  }

  return true
}

const validatePasswordForm = (): boolean => {
  const { currentPassword, newPassword, confirmNewPassword } = passwordForm.value

  if (!currentPassword && !newPassword && !confirmNewPassword) {
    return true
  }

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    notifications.showToast('warn', t('common.error'), t('teacherProfile.passwordRequired'))
    return false
  }

  if (newPassword !== confirmNewPassword) {
    notifications.showToast('warn', t('common.error'), t('teacherProfile.passwordMismatch'))
    return false
  }

  return true
}

const handleSave = async () => {
  if (!hasChanges.value) {
    return
  }

  if (!validateEmailForm() || !validatePasswordForm()) {
    return
  }

  try {
    if (hasEmailChanges.value) {
      await updateEmailMutation.mutateAsync(emailForm.value.newEmail.trim())
      notifications.showToast('success', t('common.save'), t('teacherProfile.saved'))
      emailForm.value = { newEmail: '', confirmNewEmail: '' }
    }

    if (hasPasswordChanges.value) {
      await changePasswordMutation.mutateAsync({
        oldPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      })
      notifications.showToast('success', t('common.success'), t('teacherProfile.passwordUpdated'))
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    }
  } catch {
    // Ошибка уже обработана глобальным API-клиентом
  }
}

const handleCancel = () => {
  resetForms()
}
</script>

<template>
  <div class="profile-settings-widget">
    <Message v-if="!userId" severity="error" :closable="false">
      {{ t('teacherProfile.noUserId') }}
    </Message>

    <Message v-else-if="profileQuery.isError.value" severity="error" :closable="false">
      {{ t('teacherProfile.loadError') }}
    </Message>

    <template v-else-if="isLoading || !profile">
      <Skeleton width="100%" height="280px" borderRadius="12px" />
      <Skeleton width="100%" height="180px" borderRadius="12px" />
      <Skeleton width="100%" height="220px" borderRadius="12px" />
    </template>

    <template v-else>
      <div class="settings-card">
        <div class="card-header">
          <div class="header-title">
            <i class="pi pi-user"></i>
            <span>{{ t('teacherProfile.profileInfo') }}</span>
          </div>
        </div>

        <div class="card-body info-layout">
          <div class="avatar-section">
            <div class="avatar-circle">
              {{ avatarInitials }}
              <button class="avatar-edit-btn" :aria-label="t('teacherProfile.editAvatar')">
                <i class="pi pi-camera"></i>
              </button>
            </div>
          </div>

          <div class="fields-grid">
            <div class="field-group">
              <label>{{ t('teacherProfile.lastName') }}</label>
              <InputText :value="profile.lastName" disabled class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.firstName') }}</label>
              <InputText :value="profile.firstName" disabled class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.patronymic') }}</label>
              <InputText :value="profile.patronymic ?? ''" disabled class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.institute') }}</label>
              <InputText :value="profile.institute ?? ''" disabled class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.department') }}</label>
              <InputText :value="profile.department ?? ''" disabled class="w-full" />
            </div>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <div class="header-title">
            <i class="pi pi-envelope"></i>
            <span>{{ t('teacherProfile.emailConfig') }}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="field-group w-half mb-4">
            <label>{{ t('teacherProfile.currentEmail') }}</label>
            <div class="p-input-icon-left w-full">
              <i class="pi pi-envelope text-muted"></i>
              <InputText :value="profile.email" disabled class="w-full pl-5" />
            </div>
          </div>

          <div class="fields-grid-2">
            <div class="field-group">
              <label>{{ t('teacherProfile.newEmailLabel') }}</label>
              <InputText
                v-model="emailForm.newEmail"
                :placeholder="t('teacherProfile.newEmail')"
                class="w-full"
              />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.confirmNewEmailLabel') }}</label>
              <InputText
                v-model="emailForm.confirmNewEmail"
                :placeholder="t('teacherProfile.confirmEmail')"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <div class="header-title">
            <i class="pi pi-lock"></i>
            <span>{{ t('teacherProfile.security') }}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="field-group w-full mb-4">
            <label>{{ t('teacherProfile.currentPassword') }}</label>
            <Password
              v-model="passwordForm.currentPassword"
              toggleMask
              :feedback="false"
              inputClass="w-full"
              class="w-full"
            />
          </div>

          <div class="fields-grid-2 mb-4">
            <div class="field-group">
              <label>{{ t('teacherProfile.newPassword') }}</label>
              <Password
                v-model="passwordForm.newPassword"
                toggleMask
                :feedback="true"
                inputClass="w-full"
                class="w-full"
              />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.confirmPassword') }}</label>
              <Password
                v-model="passwordForm.confirmNewPassword"
                toggleMask
                :feedback="false"
                inputClass="w-full"
                class="w-full"
              />
            </div>
          </div>

          <div class="hint-box">
            {{ t('teacherProfile.passwordHint') }}
          </div>
        </div>
      </div>

      <div class="actions-footer">
        <Button
          :label="t('common.cancel')"
          severity="secondary"
          outlined
          :disabled="isSaving || !hasChanges"
          @click="handleCancel"
        />
        <Button
          :label="t('common.saveChanges')"
          icon="pi pi-check"
          severity="success"
          :loading="isSaving"
          :disabled="!hasChanges"
          @click="handleSave"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-settings-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--surface-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.header-title i {
  color: var(--text-color-muted);
  font-size: 1.25rem;
}

.card-body {
  padding: 1.5rem;
}

.info-layout {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
}

.avatar-section {
  flex-shrink: 0;
  padding-top: 0.5rem;
}

.avatar-circle {
  position: relative;
  width: 90px;
  height: 90px;
  background-color: var(--color-warning-muted);
  color: var(--color-warning-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-color-muted);
  transition: all 0.2s;
  box-shadow: var(--shadow-profile);
}

.avatar-edit-btn:hover {
  background-color: var(--surface-ground);
  color: var(--color-primary);
}

.fields-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  flex-grow: 1;
}

.fields-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.w-full {
  width: 100%;
}
.w-half {
  width: 50%;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
.pl-5 {
  padding-left: 2.5rem;
}

.p-input-icon-left {
  position: relative;
  display: flex;
  align-items: center;
}
.p-input-icon-left i {
  position: absolute;
  left: 0.75rem;
  z-index: 1;
}

:deep(.p-inputtext:disabled) {
  opacity: 0.7;
  background-color: var(--surface-ground);
}

.hint-box {
  background-color: var(--color-primary-subtle);
  color: var(--color-primary-text-on-subtle);
  border: 1px solid var(--color-primary-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.actions-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 0.5rem;
}

@media (max-width: 768px) {
  .info-layout {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .fields-grid,
  .fields-grid-2 {
    grid-template-columns: 1fr;
  }
  .w-half {
    width: 100%;
  }
}

:deep(.p-password-input) {
  width: 100%;
}
</style>
