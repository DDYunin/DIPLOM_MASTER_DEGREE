<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Skeleton from 'primevue/skeleton'

import { useUserStore } from '@/entities/user'
import { SettingsCard } from '@/shared/ui'

const { t } = useI18n()
const store = useUserStore()

const formData = ref({
  firstName: '',
  lastName: '',
  patronymic: '',
  email: '',
  studentId: '',
  institute: '',
  major: '',
  group: '',
  department: ''
})

const emailConfig = ref({ current: '', new: '', confirm: '' })
const securityConfig = ref({ current: '', new: '', confirm: '' })

onMounted(async () => {
  await store.loadCurrentUser()
  const user = store.currentUser
  if (user) {
    formData.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      patronymic: user.patronymic || '',
      email: user.email || '',
      studentId: user.studentId || '',
      institute: user.institute || '',
      major: user.major || '',
      group: user.group || '',
      department: user.department || ''
    }
    emailConfig.value.current = user.email
  }
})

const userInitials = computed(() => {
  if (!formData.value.firstName && !formData.value.lastName) return 'ST'
  return `${formData.value.firstName.charAt(0)}${formData.value.lastName.charAt(0)}`.toUpperCase()
})

const handleSaveProfile = async () => {
  // Только редактируемые поля
  await store.updateProfile({
    firstName: formData.value.firstName,
    lastName: formData.value.lastName,
    patronymic: formData.value.patronymic
  })
}
</script>

<template>
  <div class="profile-widget">
    <div v-if="store.isLoading" class="loading-state">
      <Skeleton height="300px" borderRadius="var(--radius-md)" />
      <Skeleton height="200px" borderRadius="var(--radius-md)" />
    </div>

    <template v-else>
      <!-- Block 1: Profile Information -->
      <SettingsCard :title="t('teacherProfile.profileInfo')" icon="pi pi-user">
        <div class="profile-info-body">
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <Avatar :label="userInitials" size="xlarge" shape="circle" class="profile-avatar" />
              <button class="avatar-edit-btn" :aria-label="t('aria.editAvatar')">
                <i class="pi pi-camera"></i>
              </button>
            </div>
          </div>

          <div class="fields-grid">
            <div class="field-group">
              <label>{{ t('teacherProfile.lastName') }}</label>
              <InputText v-model="formData.lastName" class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.firstName') }}</label>
              <InputText v-model="formData.firstName" class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.patronymic') }}</label>
              <InputText v-model="formData.patronymic" class="w-full" />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.institute') }}</label>
              <InputText v-model="formData.institute" class="w-full" readonly />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.major') }}</label>
              <InputText v-model="formData.major" class="w-full" readonly />
            </div>
            <div class="field-group">
              <label>{{ t('profileCard.department') }}</label>
              <InputText v-model="formData.department" class="w-full" readonly />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.group') }}</label>
              <InputText v-model="formData.group" class="w-full" readonly />
            </div>
            <div class="field-group">
              <label>{{ t('teacherProfile.studentId') }}</label>
              <InputText v-model="formData.studentId" class="w-full" readonly />
            </div>
          </div>
        </div>

        <template #footer>
          <Button
            :label="t('common.saveChanges')"
            severity="primary"
            size="small"
            @click="handleSaveProfile"
          />
        </template>
      </SettingsCard>

      <!-- Block 2: Email Configuration -->
      <SettingsCard :title="t('teacherProfile.emailConfig')" icon="pi pi-envelope">
        <div class="email-body">
          <div class="field-group full-width">
            <label>{{ t('teacherProfile.currentEmail') }}</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon"><i class="pi pi-envelope"></i></span>
              <InputText v-model="emailConfig.current" readonly />
            </div>
          </div>
          <div class="field-group">
            <label>{{ t('teacherProfile.newEmail') }}</label>
            <InputText
              v-model="emailConfig.new"
              :placeholder="t('teacherProfile.newEmail')"
              class="w-full"
            />
          </div>
          <div class="field-group">
            <label>{{ t('teacherProfile.confirmEmail') }}</label>
            <InputText
              v-model="emailConfig.confirm"
              :placeholder="t('teacherProfile.confirmEmail')"
              class="w-full"
            />
          </div>
        </div>
      </SettingsCard>

      <!-- Block 3: Security & Password -->
      <SettingsCard :title="t('teacherProfile.security')" icon="pi pi-lock">
        <div class="security-body">
          <div class="field-group full-width">
            <label>CURRENT PASSWORD</label>
            <Password v-model="securityConfig.current" toggleMask :feedback="false" fluid />
          </div>
          <div class="field-group">
            <label>NEW PASSWORD</label>
            <Password v-model="securityConfig.new" toggleMask fluid />
          </div>
          <div class="field-group">
            <label>CONFIRM NEW PASSWORD</label>
            <Password v-model="securityConfig.confirm" toggleMask :feedback="false" fluid />
          </div>
        </div>
      </SettingsCard>
    </template>
  </div>
</template>

<style scoped>
/* Стили стали в 2 раза меньше, так как каркас ушел в SettingsCard! */
.profile-widget {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
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
