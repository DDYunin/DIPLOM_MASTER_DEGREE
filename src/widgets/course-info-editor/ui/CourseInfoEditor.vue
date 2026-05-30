<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'

import { CourseCard } from '@/entities/course'
import type { Course, CourseFormValues } from '@/entities/course'

const { t } = useI18n()

const props = defineProps<{
  initialData?: Partial<Course>
  isEditMode?: boolean
  isSaving?: boolean
}>()

const emit = defineEmits<{
  save: [data: CourseFormValues]
  cancel: []
}>()

const statusOptions = [
  { label: 'Draft', value: 'Draft' as const },
  { label: 'Active', value: 'Active' as const }
]

const formData = ref({
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
  status: (props.initialData?.status === 'Active' ? 'Active' : 'Draft') as Course['status']
})

watch(
  () => props.initialData,
  (value) => {
    if (!value) {
      return
    }

    formData.value = {
      title: value.title || '',
      description: value.description || '',
      status: value.status === 'Active' ? 'Active' : 'Draft'
    }
  },
  { deep: true }
)

const previewCourse = computed<Course>(() => ({
  id: props.initialData?.id || 'preview-id',
  title: formData.value.title || 'New Course Title',
  code: props.initialData?.code || 'CRS-NEW',
  description:
    formData.value.description ||
    'Course description will appear here. It gives students a quick overview...',
  status: formData.value.status,
  term: props.initialData?.term || new Date().getFullYear().toString(),
  studentsCount: props.initialData?.studentsCount || 0,
  nextDueLabel: 'Status',
  nextDueDate: formData.value.status
}))

const handleSave = () => {
  if (!formData.value.title.trim()) {
    return
  }

  emit('save', {
    title: formData.value.title,
    description: formData.value.description,
    status: props.isEditMode ? formData.value.status : undefined
  })
}
</script>

<template>
  <div class="course-info-editor">
    <div class="editor-main">
      <div class="form-card">
        <div class="field-group">
          <label for="title" class="field-label">
            {{ t('courseEditor.courseTitle') }} <span class="required">*</span>
          </label>
          <InputText
            id="title"
            v-model="formData.title"
            :placeholder="t('courseEditor.titlePlaceholder')"
            class="w-full"
          />
        </div>

        <div v-if="isEditMode" class="field-group">
          <label for="status" class="field-label">{{ t('courseEditor.status') }}</label>
          <Select
            id="status"
            v-model="formData.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <div class="field-group">
          <label for="description" class="field-label">{{ t('courseEditor.description') }}</label>
          <Textarea
            id="description"
            v-model="formData.description"
            rows="6"
            :placeholder="t('courseEditor.descPlaceholder')"
            class="w-full textarea-field"
          />
          <div class="field-hint">
            <span>{{ formData.description.length }}/500 characters</span>
          </div>
        </div>

        <div class="form-actions">
          <Button :label="t('common.cancel')" severity="secondary" outlined @click="emit('cancel')" />
          <Button
            :label="isEditMode ? t('common.saveChanges') : t('courseEditor.createCourse')"
            :loading="isSaving"
            @click="handleSave"
          />
        </div>
      </div>
    </div>

    <aside class="editor-sidebar">
      <div class="sidebar-section">
        <h4 class="sidebar-title">{{ t('courseEditor.cardPreview') }}</h4>
        <CourseCard :course="previewCourse" class="preview-card" />
      </div>

      <div class="tips-card">
        <div class="tips-header">
          <i class="pi pi-lightbulb tips-icon"></i>
          <span class="tips-title">{{ t('courseEditor.instructorTips') }}</span>
        </div>
        <ul class="tips-list">
          <li>Keep titles concise and descriptive.</li>
          <li>Use the description to outline learning objectives.</li>
          <li>Add course content after creation on the Content tab.</li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.course-info-editor {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .course-info-editor {
    grid-template-columns: 1fr;
  }
}

.form-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.w-full {
  width: 100%;
}

.field-label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.875rem;
}

.required {
  color: var(--color-danger);
}

.textarea-field {
  resize: vertical;
}

.field-hint {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  color: var(--text-color-muted);
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.editor-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-color-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 1rem 0;
}

.preview-card {
  pointer-events: none;
}

.tips-card {
  background-color: var(--color-primary-subtle);
  border: 1px solid var(--color-primary-muted);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tips-icon {
  color: var(--color-primary);
  font-size: 1.25rem;
}

.tips-title {
  font-weight: 700;
  color: var(--color-primary-text-on-subtle);
}

.tips-list {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--color-primary-text-on-subtle);
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
