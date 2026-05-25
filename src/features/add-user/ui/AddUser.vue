<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

import type { User } from '@/entities/user/model/types'

const { t } = useI18n()

const isVisible = ref(false)

const roles = ['Admin', 'Teacher', 'Student', 'Moderator']
const statuses = ['Active', 'Offline', 'Blocked']

const initialFormState = {
  name: '',
  email: '',
  role: 'Student',
  department: '',
  subDepartment: '',
  status: 'Active'
}

const formData = reactive({ ...initialFormState })

const openModal = () => {
  Object.assign(formData, initialFormState)
  isVisible.value = true
}

const handleSave = () => {
  if (!formData.name || !formData.email) return

  const newUser: User = {
    id: Date.now().toString(),
    name: formData.name,
    email: formData.email,
    avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    role: formData.role as User['role'],
    department: formData.department || 'General',
    subDepartment: formData.subDepartment || 'Main',
    status: formData.status as User['status']
  }

  isVisible.value = false
}
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
    :style="{ width: '450px' }"
    class="add-user-dialog"
  >
    <div class="form-container">
      <div class="field">
        <label for="name">{{ t('addUser.fullName') }}</label>
        <InputText
          id="name"
          v-model="formData.name"
          :placeholder="t('addUser.namePlaceholder')"
        />
      </div>

      <div class="field">
        <label for="email">{{ t('addUser.email') }}</label>
        <InputText
          id="email"
          type="email"
          v-model="formData.email"
          :placeholder="t('addUser.emailPlaceholder')"
        />
      </div>

      <div class="field-row">
        <div class="field w-half">
          <label for="role">{{ t('common.role') }}</label>
          <Select
            id="role"
            v-model="formData.role"
            :options="roles"
            :placeholder="t('addUser.selectRole')"
          />
        </div>
        <div class="field w-half">
          <label for="status">{{ t('common.status') }}</label>
          <Select
            id="status"
            v-model="formData.status"
            :options="statuses"
            :placeholder="t('addUser.selectStatus')"
          />
        </div>
      </div>

      <div class="field-row">
        <div class="field w-half">
          <label for="department">{{ t('addUser.department') }}</label>
          <InputText
            id="department"
            v-model="formData.department"
            :placeholder="t('addUser.deptPlaceholder')"
          />
        </div>
        <div class="field w-half">
          <label for="subDepartment">{{ t('addUser.subDepartment') }}</label>
          <InputText
            id="subDepartment"
            v-model="formData.subDepartment"
            :placeholder="t('addUser.deptPlaceholder')"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="t('common.cancel')"
        icon="pi pi-times"
        text
        class="cancel-btn"
        @click="isVisible = false"
      />
      <Button :label="t('addUser.saveUser')" icon="pi pi-check" @click="handleSave" />
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

.cancel-btn {
  color: var(--text-color-secondary);
}

:deep(.p-inputtext),
:deep(.p-select) {
  width: 100%;
}
</style>
