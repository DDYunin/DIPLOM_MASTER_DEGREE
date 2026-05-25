<script setup lang="ts">
import { ref, reactive } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select' // В PrimeVue v4 Dropdown переименован в Select

// Импортируем нашу сущность и мок-данные
import type { User } from '@/entities/user/model/types'

// Состояние модального окна
const isVisible = ref(false)

// Справочники для селектов
const roles = ['Admin', 'Teacher', 'Student', 'Moderator']
const statuses = ['Active', 'Offline', 'Blocked']

// Состояние формы
const initialFormState = {
  name: '',
  email: '',
  role: 'Student',
  department: '',
  subDepartment: '',
  status: 'Active'
}

// TODO: Видимо сделано просто для удобства, так как не нужно будет везде писать value, хотя, можно же лишь однажды написать value и всё
// TODO: переписать на value
const formData = reactive({ ...initialFormState })

// Методы
const openModal = () => {
  Object.assign(formData, initialFormState) // Сбрасываем форму при открытии
  isVisible.value = true
}

const handleSave = () => {
  // Базовая валидация (можно расширить)
  if (!formData.name || !formData.email) return

  // Создаем нового пользователя
  const newUser: User = {
    id: Date.now().toString(), // Генерируем фейковый ID
    name: formData.name,
    email: formData.email,
    avatar: `https://i.pravatar.cc/150?u=${Date.now()}`, // Случайная аватарка
    role: formData.role as User['role'],
    department: formData.department || 'General',
    subDepartment: formData.subDepartment || 'Main',
    status: formData.status as User['status']
  }

  // Добавляем в начало списка моковых данных
  // mockUsers.value.unshift(newUser)

  // Закрываем модалку
  isVisible.value = false
}
</script>

<template>
  <!-- Кнопка, которая снаружи выглядит как часть страницы -->
  <Button label="Add User" icon="pi pi-plus" class="btn-add" @click="openModal" />

  <!-- Модальное окно -->
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Add New User"
    :style="{ width: '450px' }"
    class="add-user-dialog"
  >
    <div class="form-container">
      <div class="field">
        <label for="name">Full Name</label>
        <InputText id="name" v-model="formData.name" placeholder="e.g. John Doe" />
      </div>

      <div class="field">
        <label for="email">Email Address</label>
        <InputText
          id="email"
          type="email"
          v-model="formData.email"
          placeholder="john.doe@university.edu"
        />
      </div>

      <div class="field-row">
        <div class="field w-half">
          <label for="role">Role</label>
          <Select id="role" v-model="formData.role" :options="roles" placeholder="Select a Role" />
        </div>
        <div class="field w-half">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="formData.status"
            :options="statuses"
            placeholder="Select Status"
          />
        </div>
      </div>

      <div class="field-row">
        <div class="field w-half">
          <label for="department">Department</label>
          <InputText
            id="department"
            v-model="formData.department"
            placeholder="e.g. Computer Science"
          />
        </div>
        <div class="field w-half">
          <label for="subDepartment">Sub-department</label>
          <InputText
            id="subDepartment"
            v-model="formData.subDepartment"
            placeholder="e.g. Engineering"
          />
        </div>
      </div>
    </div>

    <!-- Футер модалки -->
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        class="cancel-btn"
        @click="isVisible = false"
      />
      <Button label="Save User" icon="pi pi-check" @click="handleSave" />
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

/* Фикс ширины для PrimeVue компонентов внутри флекс-контейнеров */
:deep(.p-inputtext),
:deep(.p-select) {
  width: 100%;
}
</style>
