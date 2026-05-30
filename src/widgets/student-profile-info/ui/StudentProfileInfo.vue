<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'

import { useOwnProfile, useOwnProfileSettingsForm } from '@/features/own-profile'
import { SettingsCard } from '@/shared/ui'
import { useNotifications } from '@/shared/model'

const { t } = useI18n()
const notifications = useNotifications()

const { userId, profileQuery, updateEmailMutation, changePasswordMutation } = useOwnProfile()

const profile = computed(() => profileQuery.data.value ?? null)
const currentEmail = computed(() => profile.value?.email)

const {
  errors,
  handleSubmit,
  hasChanges,
  hasEmailChanges,
  hasPasswordChanges,
  resetSettingsForm,
  newEmail,
  newEmailAttrs,
  confirmNewEmail,
  confirmNewEmailAttrs,
  currentPassword,
  currentPasswordAttrs,
  newPassword,
  newPasswordAttrs,
  confirmNewPassword,
  confirmNewPasswordAttrs
} = useOwnProfileSettingsForm(currentEmail)

const isLoading = computed(() => profileQuery.isPending.value)
const isSaving = computed(
  () => updateEmailMutation.isPending.value || changePasswordMutation.isPending.value
)

const userInitials = computed(() => {
  if (!profile.value) {
    return 'ST'
  }

  if (profile.value.avatarInitials) {
    return profile.value.avatarInitials
  }

  return `${profile.value.firstName.charAt(0)}${profile.value.lastName.charAt(0)}`.toUpperCase()
})

const handleSave = handleSubmit(async (formValues) => {
  try {
    if (hasEmailChanges.value) {
      await updateEmailMutation.mutateAsync(formValues.newEmail.trim())
      notifications.showToast('success', t('common.save'), t('teacherProfile.saved'))
    }

    if (hasPasswordChanges.value) {
      await changePasswordMutation.mutateAsync({
        oldPassword: formValues.currentPassword,
        newPassword: formValues.newPassword
      })
      notifications.showToast('success', t('common.success'), t('teacherProfile.passwordUpdated'))
    }

    resetSettingsForm()
  } catch {
    // Ошибка уже обработана глобальным API-клиентом
  }
})
</script>

<template>
  <div class="profile-widget">
    <Message v-if="!userId" severity="error" :closable="false">
      {{ t('teacherProfile.noUserId') }}
    </Message>

    <Message v-else-if="profileQuery.isError.value" severity="error" :closable="false">
      {{ t('teacherProfile.loadError') }}
    </Message>

    <div v-else-if="isLoading || !profile" class="loading-state">
      <Skeleton height="300px" borderRadius="var(--radius-md)" />
      <Skeleton height="200px" borderRadius="var(--radius-md)" />
      <Skeleton height="200px" borderRadius="var(--radius-md)" />
    </div>

    <form v-else class="profile-form" @submit.prevent="handleSave">
      <SettingsCard :title="t('teacherProfile.profileInfo')" icon="pi pi-user">
        <div class="profile-info-body">
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <Avatar :label="userInitials" size="xlarge" shape="circle" class="profile-avatar" />
              <button type="button" class="avatar-edit-btn" :aria-label="t('teacherProfile.editAvatar')">
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
              <label>{{ t('teacherProfile.major') }}</label>
              <InputText :value="profile.major ?? ''" disabled class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.department') }}</label>
              <InputText :value="profile.department ?? ''" disabled class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.group') }}</label>
              <InputText :value="profile.group ?? ''" disabled class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.studentId') }}</label>
              <InputText
                :value="profile.studentId ?? profile.identifier ?? ''"
                disabled
                class="w-full"
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard :title="t('teacherProfile.emailConfig')" icon="pi pi-envelope">
        <div class="email-body">
          <div class="field-group full-width">
            <label>{{ t('teacherProfile.currentEmail') }}</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon"><i class="pi pi-envelope"></i></span>
              <InputText :value="profile.email" readonly />
            </div>
          </div>
          <div class="field-group">
            <label>{{ t('teacherProfile.newEmailLabel') }}</label>
            <InputText
              v-model="newEmail"
              v-bind="newEmailAttrs"
              :placeholder="t('teacherProfile.newEmail')"
              :invalid="!!errors.newEmail"
              class="w-full"
            />
            <small v-if="errors.newEmail" class="field-error">{{ errors.newEmail }}</small>
          </div>
          <div class="field-group">
            <label>{{ t('teacherProfile.confirmNewEmailLabel') }}</label>
            <InputText
              v-model="confirmNewEmail"
              v-bind="confirmNewEmailAttrs"
              :placeholder="t('teacherProfile.confirmEmail')"
              :invalid="!!errors.confirmNewEmail"
              class="w-full"
            />
            <small v-if="errors.confirmNewEmail" class="field-error">{{ errors.confirmNewEmail }}</small>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard :title="t('teacherProfile.security')" icon="pi pi-lock">
        <div class="security-body">
          <div class="field-group full-width">
            <label>{{ t('teacherProfile.currentPassword') }}</label>
            <Password
              v-model="currentPassword"
              v-bind="currentPasswordAttrs"
              toggleMask
              :feedback="false"
              :invalid="!!errors.currentPassword"
              fluid
            />
            <small v-if="errors.currentPassword" class="field-error">{{ errors.currentPassword }}</small>
          </div>
          <div class="field-group">
            <label>{{ t('teacherProfile.newPassword') }}</label>
            <Password
              v-model="newPassword"
              v-bind="newPasswordAttrs"
              toggleMask
              :invalid="!!errors.newPassword"
              fluid
            />
            <small v-if="errors.newPassword" class="field-error">{{ errors.newPassword }}</small>
          </div>
          <div class="field-group">
            <label>{{ t('teacherProfile.confirmPassword') }}</label>
            <Password
              v-model="confirmNewPassword"
              v-bind="confirmNewPasswordAttrs"
              toggleMask
              :feedback="false"
              :invalid="!!errors.confirmNewPassword"
              fluid
            />
            <small v-if="errors.confirmNewPassword" class="field-error">{{ errors.confirmNewPassword }}</small>
          </div>

          <div class="hint-box full-width">
            {{ t('teacherProfile.passwordHint') }}
          </div>
        </div>
      </SettingsCard>

      <div class="actions-footer">
        <Button
          type="button"
          :label="t('common.cancel')"
          severity="secondary"
          outlined
          :disabled="isSaving || !hasChanges"
          @click="resetSettingsForm"
        />
        <Button
          type="submit"
          :label="t('common.saveChanges')"
          icon="pi pi-check"
          severity="success"
          :loading="isSaving"
          :disabled="!hasChanges"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.profile-widget {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

.field-error {
  color: var(--color-danger, #ef4444);
  font-size: 0.75rem;
}

.w-full {
  width: 100%;
}
.full-width {
  grid-column: 1 / -1;
}

.profile-info-body {
  display: flex;
  gap: 2.5rem;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  font-size: 2rem;
  background-color: var(--color-primary-soft);
  color: var(--color-primary-strong);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  color: var(--text-color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-edit-btn:hover {
  background-color: var(--surface-subtle);
  color: var(--color-primary);
}

.fields-grid {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.email-body,
.security-body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
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
}

:deep(.p-inputtext:disabled) {
  opacity: 0.7;
  background-color: var(--surface-ground);
}

@media (max-width: 768px) {
  .profile-info-body {
    flex-direction: column;
    align-items: center;
  }
  .fields-grid,
  .email-body,
  .security-body {
    grid-template-columns: 1fr;
    width: 100%;
  }
}
</style>
