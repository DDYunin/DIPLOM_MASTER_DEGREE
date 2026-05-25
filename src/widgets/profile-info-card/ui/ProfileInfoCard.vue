<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'

// Импортируем нашу обертку и тип пользователя
import { WidgetCard } from '@/shared/ui'
import type { User } from '@/entities/user'

// Используем v-model для удобного связывания с черновиком на странице
const { t } = useI18n()

const props = defineProps<{ modelValue: User }>()
const emit = defineEmits(['update:modelValue'])

// Создаем двусторонне-связанный computed
const profile = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Генерируем инициалы, если они не заданы в базе
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

// Утилита для цвета бейджа роли
const getRoleSeverity = (role: string) => {
  if (role === 'Super Admin') return 'danger'
  if (role === 'Teacher') return 'warn'
  if (role === 'Moderator') return 'info'
  return 'success' // Student
}

// Моковые справочники (в реальности придут с сервера)
const cohortOptions = ['CS-2024', 'ENG-2023', 'IT-2025', 'BIO-2024', 'ART-2023']
const deptOptions = [
  'Computer Science',
  'Engineering',
  'Information Technology',
  'Physics',
  'Mathematics'
]
</script>

<template>
  <!-- Используем нашу универсальную обертку -->
  <WidgetCard :title="t('profileCard.title')" icon="pi-user" iconColorClass="text-blue-500">
    <template #header-actions>
      <a href="#" class="edit-link">{{ t('profileCard.editDetails') }}</a>
    </template>

    <div class="profile-content">
      <!-- ========================================== -->
      <!-- ЛЕВАЯ ЧАСТЬ: АВАТАРКА (Общая для всех)     -->
      <!-- ========================================== -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <Avatar :label="initials" size="xlarge" shape="circle" class="custom-avatar" />
          <button class="camera-btn" :title="t('profileCard.changeAvatar')">
            <i class="pi pi-camera"></i>
          </button>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- ПРАВАЯ ЧАСТЬ: ФОРМА                        -->
      <!-- ========================================== -->
      <div class="form-grid">
        <!-- 1. ОБЩИЕ ПОЛЯ -->
        <div class="form-field">
          <label>{{ t('profileCard.fullName') }}</label>
          <InputText v-model="profile.fullName" />
        </div>

        <div class="form-field">
          <label>{{ t('common.role') }}</label>
          <div class="role-display">
            <!-- Роль нельзя менять текстом, выводим как Tag -->
            <Tag :severity="getRoleSeverity(profile.role)" :value="profile.role" rounded />
          </div>
        </div>

        <div class="form-field">
          <label>{{ t('profileCard.email') }}</label>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-envelope" />
            <InputText v-model="profile.email" class="w-full" />
          </IconField>
        </div>

        <!-- 2. СПЕЦИФИЧНЫЕ ПОЛЯ: АДМИН ИЛИ МОДЕРАТОР -->
        <div
          v-if="['Super Admin', 'Moderator'].includes(profile.role) || profile.phone !== undefined"
          class="form-field"
        >
          <label>{{ t('profileCard.phone') }}</label>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-phone" />
            <InputText v-model="profile.phone" class="w-full" />
          </IconField>
        </div>

        <!-- 3. СПЕЦИФИЧНЫЕ ПОЛЯ: СТУДЕНТ И УЧИТЕЛЬ -->
        <div v-if="['Student', 'Teacher'].includes(profile.role)" class="form-field">
          <!-- Динамический лейбл в зависимости от роли -->
          <label>{{ profile.role === 'Student' ? 'STUDENT ID' : 'EMPLOYEE ID' }}</label>
          <InputText v-model="profile.identifier" disabled class="w-full" />
        </div>

        <div v-if="['Student', 'Teacher'].includes(profile.role)" class="form-field">
          <label>{{ t('profileCard.department') }}</label>
          <Select v-model="profile.department" :options="deptOptions" class="w-full" />
        </div>

        <!-- 4. СПЕЦИФИЧНЫЕ ПОЛЯ: ТОЛЬКО СТУДЕНТ -->
        <div v-if="profile.role === 'Student'" class="form-field">
          <label>{{ t('profileCard.cohort') }}</label>
          <Select v-model="profile.cohort" :options="cohortOptions" class="w-full" />
        </div>

        <!-- 5. ДОПОЛНИТЕЛЬНЫЕ ЗАМЕТКИ (на всю ширину) -->
        <div
          v-if="profile.role === 'Student' || profile.notes !== undefined"
          class="form-field full-width mt-2"
        >
          <label>{{ t('profileCard.notes') }}</label>
          <Textarea
            v-model="profile.notes"
            rows="3"
            autoResize
            :placeholder="t('profileCard.notesPlaceholder')"
          />
        </div>
      </div>
    </div>
  </WidgetCard>
</template>

<style scoped>
.edit-link {
  color: var(--color-primary);
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
}

.profile-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Аватарка */
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

/* Сетка формы */
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

.full-width {
  grid-column: span 2;
}
.w-full {
  width: 100%;
}
.mt-2 {
  margin-top: 0.5rem;
}

.role-display {
  height: 2.5rem;
  display: flex;
  align-items: center;
}

/* Адаптив */
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
