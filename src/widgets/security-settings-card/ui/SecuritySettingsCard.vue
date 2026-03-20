<script setup lang="ts">
import { ref, computed } from 'vue'

import Password from 'primevue/password'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import Message from 'primevue/message'

import { WidgetCard } from '@/shared/ui'
import { useNotifications } from '@/shared/model'
import type { User } from '@/entities/user'

const props = withDefaults(
  defineProps<{
    modelValue: User
    mode?: 'self' | 'manage' // Режим отображения: 'self' (свой пароль) или 'manage' (управление чужим)
  }>(),
  {
    mode: 'manage' // По умолчанию считаем, что мы управляем кем-то
  }
)

const emit = defineEmits(['update:modelValue'])
const notifications = useNotifications()

// Двухстороннее связывание профиля
const profile = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Локальное состояние для формы смены пароля (используется только в режиме 'self')
const passwords = ref({
  current: '',
  new: '',
  confirm: ''
})

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
</script>

<template>
  <WidgetCard
    :title="mode === 'self' ? 'Security & Password' : 'Security & Access'"
    :icon="mode === 'self' ? 'pi-lock' : 'pi-shield'"
    iconColorClass="text-blue-500"
  >
    <!-- ================================================== -->
    <!-- РЕЖИМ 'SELF': Смена собственного пароля (Админ)    -->
    <!-- ================================================== -->
    <div v-if="mode === 'self'" class="security-layout">
      <div class="password-grid">
        <div class="form-field full-width">
          <label>CURRENT PASSWORD</label>
          <Password
            v-model="passwords.current"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full"
          />
        </div>

        <div class="form-field">
          <label>NEW PASSWORD</label>
          <Password
            v-model="passwords.new"
            :feedback="true"
            toggleMask
            class="w-full"
            inputClass="w-full"
          />
        </div>

        <div class="form-field">
          <label>CONFIRM NEW PASSWORD</label>
          <Password
            v-model="passwords.confirm"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full"
          />
        </div>
      </div>

      <Message severity="info" :closable="false" class="custom-message">
        Password must be at least 8 characters long and contain one special character.
      </Message>
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
            <span class="box-title">Password Reset</span>
            <span class="box-desc">Send a password reset link to the user's email address.</span>
            <div class="actions-row mt-3">
              <Button
                label="Generate New"
                icon="pi pi-refresh"
                severity="secondary"
                size="small"
                @click="handleGeneratePassword"
              />
              <Button
                label="Send Link"
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
            <span class="box-title">Multi-Factor Auth</span>
            <span class="box-desc">Enforce 2FA on next login.</span>
            <div class="toggle-row mt-3">
              <!-- Тумблер напрямую мутирует profile.twoFactorEnabled -->
              <ToggleSwitch v-model="profile.twoFactorEnabled" />
              <span class="toggle-label">{{
                profile.twoFactorEnabled ? 'Enabled' : 'Disabled'
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
  color: var(--text-color-secondary, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

/* Стили для управления доступом (Режим Manage) */
.advanced-security-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.security-box {
  border: 1px solid var(--surface-border, #e2e8f0);
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
  background: var(--p-blue-50);
  color: var(--p-blue-500);
}
:root[class*='my-app-dark'] .bg-blue {
  background: rgba(var(--p-blue-500), 0.16);
}

.box-content {
  display: flex;
  flex-direction: column;
}
.box-title {
  font-weight: 600;
  color: var(--text-color, #0f172a);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}
.box-desc {
  font-size: 0.75rem;
  color: var(--text-color-secondary, #64748b);
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
  color: var(--text-color-secondary, #64748b);
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
