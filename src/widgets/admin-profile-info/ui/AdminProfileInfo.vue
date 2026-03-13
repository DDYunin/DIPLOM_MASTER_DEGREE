<script setup lang="ts">
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import type { AdminProfile } from '@/entities/admin'

import { WidgetCard } from '@/shared/ui/'

// TODO: Достаточно DefineModel
const props = defineProps<{ modelValue: AdminProfile }>()
const emit = defineEmits(['update:modelValue'])

// Двухстороннее связывание через computed
const profile = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
</script>

<template>
  <WidgetCard icon="pi-user" title="Profile Information" iconColorToken="#3b82f6">
    <template #header-actions>
      <a href="#" class="edit-link">Edit Profile</a>
    </template>
    <template #default>
      <div class="profile-content">
        <!-- Блок с аватаркой -->
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <Avatar
              :label="getInitials(profile.fullName)"
              size="xlarge"
              shape="circle"
              class="custom-avatar"
            />
            <!-- Иконка камеры поверх аватарки -->
            <button class="camera-btn" title="Change Avatar">
              <i class="pi pi-camera"></i>
            </button>
          </div>
        </div>

        <!-- Сетка инпутов -->
        <div class="form-grid">
          <div class="field">
            <label>FULL NAME</label>
            <InputText v-model="profile.fullName" />
          </div>

          <div class="field">
            <label>ROLE</label>
            <!-- Роль обычно нельзя поменять самому себе, делаем её в виде Tag -->
            <div class="role-display">
              <Tag severity="info" :value="profile.role" rounded class="role-tag" />
            </div>
          </div>

          <div class="field">
            <label>EMAIL ADDRESS</label>
            <IconField iconPosition="left">
              <InputIcon class="pi pi-envelope" />
              <InputText v-model="profile.email" class="w-full" />
            </IconField>
          </div>

          <div class="field">
            <label>PHONE NUMBER</label>
            <IconField iconPosition="left">
              <InputIcon class="pi pi-phone" />
              <InputText v-model="profile.phone" class="w-full" />
            </IconField>
          </div>
        </div>
      </div>
    </template>
  </WidgetCard>
</template>

<style scoped>
.edit-link {
  color: #3b82f6;
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
}

.profile-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Стили аватара с камерой */
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
  background-color: #fed7aa;
  color: #9a3412;
  font-weight: 700;
  width: 80px;
  height: 80px;
  font-size: 2rem;
}
.camera-btn {
  position: absolute;
  bottom: 0;
  right: -5px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}
.camera-btn:hover {
  color: #3b82f6;
  border-color: #3b82f6;
}

/* Сетка инпутов */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex-grow: 1;
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
.role-display {
  height: 2.5rem;
  display: flex;
  align-items: center;
}
.role-tag {
  background: #eff6ff;
  color: #3b82f6;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
}

/* Адаптив: на мобилках аватарка сверху */
@media (max-width: 640px) {
  .profile-content {
    flex-direction: column;
    align-items: center;
  }
  .form-grid {
    grid-template-columns: 1fr;
    width: 100%;
  }
}
</style>
