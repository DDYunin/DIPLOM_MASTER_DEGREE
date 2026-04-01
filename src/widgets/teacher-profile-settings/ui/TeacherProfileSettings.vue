<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

// Мок-данные текущего пользователя (преподавателя)
const personalInfo = ref({
  firstName: 'John',
  lastName: 'Smith',
  patronymic: 'Robertovich',
  institute: 'Faculty of Computer Science',
  department: 'Software Engineering',
  avatarInitials: 'JS'
})

// Состояние формы для Email
const emailForm = ref({
  currentEmail: 'john.smith@university.edu',
  newEmail: '',
  confirmNewEmail: ''
})

// Состояние формы для Пароля
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const handleSave = () => {
  console.log('Saving changes...', {
    email: emailForm.value.newEmail,
    password: passwordForm.value.newPassword
  })
  // Здесь будет логика отправки на бэкенд
}

const handleCancel = () => {
  // Сброс форм
  emailForm.value.newEmail = ''
  emailForm.value.confirmNewEmail = ''
  passwordForm.value.currentPassword = ''
  passwordForm.value.newPassword = ''
  passwordForm.value.confirmNewPassword = ''
}
</script>

<template>
  <div class="profile-settings-widget">
    <!-- КАРТОЧКА 1: Personal Information (Только чтение) -->
    <div class="settings-card">
      <div class="card-header">
        <div class="header-title">
          <i class="pi pi-user"></i>
          <span>Profile Information</span>
        </div>
      </div>

      <div class="card-body info-layout">
        <!-- Аватарка (как на макете) -->
        <div class="avatar-section">
          <div class="avatar-circle">
            {{ personalInfo.avatarInitials }}
            <button class="avatar-edit-btn" aria-label="Edit Avatar">
              <i class="pi pi-camera"></i>
            </button>
          </div>
        </div>

        <!-- Сетка полей (Disabled) -->
        <div class="fields-grid">
          <div class="field-group">
            <label>LAST NAME</label>
            <InputText :value="personalInfo.lastName" disabled class="w-full" />
          </div>
          <div class="field-group">
            <label>FIRST NAME</label>
            <InputText :value="personalInfo.firstName" disabled class="w-full" />
          </div>
          <div class="field-group">
            <label>PATRONYMIC</label>
            <InputText :value="personalInfo.patronymic" disabled class="w-full" />
          </div>
          <div class="field-group">
            <label>INSTITUTE</label>
            <InputText :value="personalInfo.institute" disabled class="w-full" />
          </div>
          <div class="field-group">
            <label>DEPARTMENT</label>
            <InputText :value="personalInfo.department" disabled class="w-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- КАРТОЧКА 2: Email Configuration (Смена почты) -->
    <div class="settings-card">
      <div class="card-header">
        <div class="header-title">
          <i class="pi pi-envelope"></i>
          <span>Email Configuration</span>
        </div>
      </div>
      <div class="card-body">
        <div class="field-group w-half mb-4">
          <label>CURRENT EMAIL</label>
          <div class="p-input-icon-left w-full">
            <i class="pi pi-envelope text-muted"></i>
            <InputText :value="emailForm.currentEmail" disabled class="w-full pl-5" />
          </div>
        </div>

        <div class="fields-grid-2">
          <div class="field-group">
            <label>NEW EMAIL</label>
            <InputText
              v-model="emailForm.newEmail"
              placeholder="Enter new email address"
              class="w-full"
            />
          </div>
          <div class="field-group">
            <label>CONFIRM NEW EMAIL</label>
            <InputText
              v-model="emailForm.confirmNewEmail"
              placeholder="Confirm new email address"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- КАРТОЧКА 3: Security & Password (Смена пароля) -->
    <div class="settings-card">
      <div class="card-header">
        <div class="header-title">
          <i class="pi pi-lock"></i>
          <span>Security & Password</span>
        </div>
      </div>
      <div class="card-body">
        <div class="field-group w-full mb-4">
          <label>CURRENT PASSWORD</label>
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
            <label>NEW PASSWORD</label>
            <Password
              v-model="passwordForm.newPassword"
              toggleMask
              :feedback="true"
              inputClass="w-full"
              class="w-full"
            />
          </div>
          <div class="field-group">
            <label>CONFIRM NEW PASSWORD</label>
            <Password
              v-model="passwordForm.confirmNewPassword"
              toggleMask
              :feedback="false"
              inputClass="w-full"
              class="w-full"
            />
          </div>
        </div>

        <!-- Подсказка (Hint) как на макете -->
        <div class="hint-box">
          Password must be at least 8 characters long and contain one special character.
        </div>
      </div>
    </div>

    <!-- FOOTER: Кнопки действий -->
    <div class="actions-footer">
      <Button label="Cancel" severity="secondary" outlined @click="handleCancel" />
      <Button label="Save Changes" icon="pi pi-check" severity="success" @click="handleSave" />
    </div>
  </div>
</template>

<style scoped>
.profile-settings-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* --- КАРТОЧКА --- */
.settings-card {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--p-surface-100);
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
  color: var(--p-text-color);
}

.header-title i {
  color: var(--p-text-muted-color);
  font-size: 1.25rem;
}

.card-body {
  padding: 1.5rem;
}

/* --- ВНЕШНИЙ ВИД АВАТАРА --- */
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
  background-color: var(--p-orange-100);
  color: var(--p-orange-700);
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
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--p-text-muted-color);
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.avatar-edit-btn:hover {
  background-color: var(--p-surface-50);
  color: var(--p-primary-500);
}

/* --- ПОЛЯ ВВОДА --- */
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
  color: var(--p-text-muted-color);
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

/* Приглушаем текст в disabled инпутах, чтобы было понятнее */
:deep(.p-inputtext:disabled) {
  opacity: 0.7;
  background-color: var(--p-surface-50);
}

/* --- ПОДСКАЗКА (HINT) --- */
.hint-box {
  background-color: var(--p-blue-50);
  color: var(--p-blue-700);
  border: 1px solid var(--p-blue-200);
  border-radius: var(--p-border-radius);
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

/* --- ФУТЕР --- */
.actions-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 0.5rem;
}

/* Адаптив */
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
