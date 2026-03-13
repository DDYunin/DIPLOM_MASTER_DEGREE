<script setup lang="ts">
import { ref } from 'vue'
import Password from 'primevue/password'
import Message from 'primevue/message'

import { WidgetCard } from '@/shared/ui/'

// Локальное состояние для паролей
const passwords = ref({
  current: '',
  new: '',
  confirm: ''
})

// Экспортируем данные наверх (для валидации перед отправкой на странице)
defineExpose({ passwords })
</script>

<template>
  <WidgetCard icon="pi-loc" title="Security & Password" iconColorToken="#3b82f6">
    <template #default>
      <div class="form-layout">
        <div class="field full-width">
          <label>CURRENT PASSWORD</label>
          <Password
            v-model="passwords.current"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full"
          />
        </div>

        <div class="password-row">
          <div class="field">
            <label>NEW PASSWORD</label>
            <Password
              v-model="passwords.new"
              :feedback="true"
              toggleMask
              class="w-full"
              inputClass="w-full"
            />
          </div>
          <div class="field">
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

        <!-- Информационное сообщение как на макете -->
        <Message severity="info" :closable="false" class="custom-message">
          Password must be at least 8 characters long and contain one special character.
        </Message>
      </div>
    </template>
  </WidgetCard>
</template>

<style scoped>
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.password-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.w-full {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100%;
} /* Фикс для инпутов PrimeVue */

.custom-message {
  margin-top: 0.5rem;
}
/* Делаем Message светло-синим, как на макете */
:deep(.p-message-info) {
  background-color: #eff6ff;
  color: #1e3a8a;
  border: none;
}
:deep(.p-message-icon) {
  color: #3b82f6;
}

@media (max-width: 640px) {
  .password-row {
    grid-template-columns: 1fr;
  }
}
</style>
