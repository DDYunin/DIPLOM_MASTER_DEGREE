<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import type { StudentProfile } from '@/entities/user'

import { WidgetCard } from '@/shared/ui/'

const props = defineProps<{ profile: StudentProfile }>()

// Локальная копия для редактирования
const form = ref({
  fullName: props.profile.name,
  username: props.profile.username,
  email: props.profile.email,
  cohort: props.profile.cohort,
  notes: props.profile.notes
})

const cohorts = ['CS-2024 (Computer Science)', 'ENG-2023 (Engineering)', 'ART-2025 (Arts)']
</script>

<template>
  <WidgetCard icon="pi-id-card" title="Account Information" iconColorToken="#3b82f6">
    <template #header-actions>
      <a href="#" class="edit-link">Edit Details</a>
    </template>
    <template #default>
      <div class="form-grid">
        <div class="field">
          <label>FULL NAME</label>
          <InputText v-model="form.fullName" />
        </div>
        <div class="field">
          <label>LOGIN USERNAME</label>
          <InputText v-model="form.username" />
        </div>
        <div class="field">
          <label>EMAIL ADDRESS</label>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-envelope" />
            <InputText v-model="form.email" class="w-full" />
          </IconField>
        </div>
        <div class="field">
          <label>ASSIGNED GROUP / COHORT</label>
          <Select v-model="form.cohort" :options="cohorts" class="w-full" />
        </div>
        <div class="field full-width">
          <label>ADMINISTRATIVE NOTES</label>
          <Textarea v-model="form.notes" rows="3" autoResize />
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
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.full-width {
  grid-column: span 2;
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
</style>
