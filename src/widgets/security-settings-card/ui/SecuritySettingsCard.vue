<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import Password from 'primevue/password'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import Message from 'primevue/message'

import { WidgetCard } from '@/shared/ui'
import { useNotifications } from '@/shared/model'
import type { User } from '@/entities/user'
import { createChangePasswordSchema, getChangePasswordInitialValues } from '@/features/own-profile'

const props = withDefaults(
  defineProps<{
    modelValue: User
    mode?: 'self' | 'manage'
    passwordLoading?: boolean
  }>(),
  {
    mode: 'manage',
    passwordLoading: false
  }
)

const { t } = useI18n()

const emit = defineEmits<{
  'update:modelValue': [value: User]
  'update-password': [payload: { oldPassword: string; newPassword: string }]
}>()
const notifications = useNotifications()

// Двухстороннее связывание профиля
const profile = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const validationSchema = computed(() => toTypedSchema(createChangePasswordSchema(t)))

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema,
  initialValues: getChangePasswordInitialValues()
})

const [currentPassword, currentPasswordAttrs] = defineField('currentPassword')
const [newPassword, newPasswordAttrs] = defineField('newPassword')
const [confirmNewPassword, confirmNewPasswordAttrs] = defineField('confirmNewPassword')

// Экшены для режима 'manage'
const handleSendResetLink = () => {
  // В реальности здесь вызов API: await authApi.sendResetLink(profile.value.email)
  notifications.showToast(
    'success',
    'Email Sent',
    `Password reset link sent to ${profile.value.email}`
  )
}

const handleGeneratePassword = () => {
  notifications.showToast(
    'info',
    'Password Generated',
    'New temporary password generated and sent to user.'
  )
}

const handleUpdatePassword = handleSubmit((formValues) => {
  emit('update-password', {
    oldPassword: formValues.currentPassword,
    newPassword: formValues.newPassword
  })
})

const clearPasswordFields = () => {
  resetForm({ values: getChangePasswordInitialValues() })
}

defineExpose({ clearPasswordFields })
</script>

<template>
  <WidgetCard
    :title="mode === 'self' ? t('securityCard.title') : t('securityCard.titleAccess')"
    :icon="mode === 'self' ? 'pi-lock' : 'pi-shield'"
    iconColorClass="text-blue-500"
  >
    <!-- ================================================== -->
    <!-- РЕЖИМ 'SELF': Смена собственного пароля (Админ)    -->
    <!-- ================================================== -->
    <div v-if="mode === 'self'" class="security-layout">
      <div class="password-grid">
        <div class="form-field full-width">
          <label>{{ t('securityCard.currentPassword') }}</label>
          <Password
            v-model="currentPassword"
            v-bind="currentPasswordAttrs"
            :feedback="false"
            toggleMask
            :invalid="!!errors.currentPassword"
            class="w-full"
            inputClass="w-full"
          />
          <small v-if="errors.currentPassword" class="field-error">{{ errors.currentPassword }}</small>
        </div>

        <div class="form-field">
          <label>{{ t('securityCard.newPassword') }}</label>
          <Password
            v-model="newPassword"
            v-bind="newPasswordAttrs"
            :feedback="true"
            toggleMask
            :invalid="!!errors.newPassword"
            class="w-full"
            inputClass="w-full"
          />
          <small v-if="errors.newPassword" class="field-error">{{ errors.newPassword }}</small>
        </div>

        <div class="form-field">
          <label>{{ t('securityCard.confirmPassword') }}</label>
          <Password
            v-model="confirmNewPassword"
            v-bind="confirmNewPasswordAttrs"
            :feedback="false"
            toggleMask
            :invalid="!!errors.confirmNewPassword"
            class="w-full"
            inputClass="w-full"
          />
          <small v-if="errors.confirmNewPassword" class="field-error">{{ errors.confirmNewPassword }}</small>
        </div>
      </div>

      <Message severity="info" :closable="false" class="custom-message">
        {{ t('securityCard.passwordHint') }}
      </Message>

      <div class="password-actions">
        <Button
          :label="t('securityCard.updatePassword')"
          icon="pi pi-lock"
          :loading="passwordLoading"
          @click="handleUpdatePassword"
        />
      </div>
    </div>

    <!-- ================================================== -->
    <!-- РЕЖИМ 'MANAGE': Управление чужим доступом          -->
    <!-- ================================================== -->
    <div v-else class="security-layout">
      <!-- Блок с карточками действий -->
      <div class="advanced-security-grid">
        <!-- Карточка 1: Сброс пароля -->
        <div class="security-box">
          <div class="box-icon bg-blue"><i class="pi pi-key"></i></div>
          <div class="box-content">
            <span class="box-title">{{ t('securityCard.passwordReset') }}</span>
            <div class="actions-row mt-3">
              <Button
                :label="t('securityCard.generateNew')"
                icon="pi pi-refresh"
                severity="secondary"
                size="small"
                @click="handleGeneratePassword"
              />
              <Button
                :label="t('securityCard.sendLink')"
                icon="pi pi-envelope"
                outlined
                size="small"
                @click="handleSendResetLink"
              />
            </div>
          </div>
        </div>

        <!-- Карточка 2: Двухфакторная аутентификация -->
        <div class="security-box">
          <div class="box-icon bg-blue"><i class="pi pi-mobile"></i></div>
          <div class="box-content">
            <span class="box-title">{{ t('securityCard.mfa') }}</span>
            <div class="toggle-row mt-3">
              <ToggleSwitch v-model="profile.twoFactorEnabled" />
              <span class="toggle-label">{{
                profile.twoFactorEnabled ? t('securityCard.enabled') : t('securityCard.disabled')
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WidgetCard>
</template>

<style scoped>
.security-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Стили для формы смены пароля (Режим Self) */
.password-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.full-width {
  grid-column: span 2;
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
.w-full {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100%;
}
.custom-message {
  margin-top: 0.5rem;
}
.password-actions {
  display: flex;
  justify-content: flex-end;
}

/* Стили для управления доступом (Режим Manage) */
.advanced-security-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.security-box {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: var(--surface-card);
}
.box-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}
.bg-blue {
  background: var(--color-primary-subtle);
  color: var(--color-primary);
}
.my-app-dark .bg-blue {
  background: var(--accent-blue-bg);
}

.box-content {
  display: flex;
  flex-direction: column;
}
.box-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}
.box-desc {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  line-height: 1.4;
}
.mt-3 {
  margin-top: 0.75rem;
}

.actions-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.toggle-label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  font-weight: 500;
}

@media (max-width: 640px) {
  .password-grid,
  .advanced-security-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
}
</style>
