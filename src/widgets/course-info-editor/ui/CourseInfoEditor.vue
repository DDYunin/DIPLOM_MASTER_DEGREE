<script setup lang="ts">
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select' // В PrimeVue v4 Dropdown переименован в Select
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

import { CourseCard } from '@/entities/course'
import type { Course } from '@/entities/course'

const props = defineProps<{
  initialData?: Partial<Course>
  isEditMode?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', data: Partial<Course>): void
  (e: 'cancel'): void
}>()

// Заглушка для списка кафедр/департаментов
const departments = [
  { label: 'Computer Science', value: 'CS' },
  { label: 'Mathematics', value: 'MATH' },
  { label: 'Information Technology', value: 'IT' }
]

// Реактивное состояние формы
const formData = ref({
  title: props.initialData?.title || '',
  code: props.initialData?.code || '',
  department: props.initialData?.code ? 'CS' : null, // Упрощенный маппинг
  description: props.initialData?.description || '',
  isPrivate: false
})

// Вычисляемое свойство для Live Preview карточки курса
const previewCourse = computed<Course>(() => ({
  id: props.initialData?.id || 'preview-id',
  title: formData.value.title || 'New Course Title',
  code: formData.value.code || 'CODE-101',
  description:
    formData.value.description ||
    'Course description will appear here. It gives students a quick overview...',
  status: props.initialData?.status || 'Draft',
  term: props.initialData?.term || 'Fall 2024',
  studentsCount: props.initialData?.studentsCount || 0,
  nextDueLabel: 'Status',
  nextDueDate: props.initialData?.status === 'Active' ? 'Configured' : 'Unpublished'
}))

const handleSave = () => {
  emit('save', {
    title: formData.value.title,
    code: formData.value.code,
    description: formData.value.description
    // ... остальные поля
  })
}
</script>

<template>
  <div class="course-info-editor">
    <!-- ЛЕВАЯ КОЛОНКА: Форма -->
    <div class="editor-main">
      <div class="form-card">
        <div class="field-group">
          <label for="title" class="field-label"
            >Course Title <span class="required">*</span></label
          >
          <InputText
            id="title"
            v-model="formData.title"
            placeholder="e.g. Advanced Data Structures"
            class="w-full"
          />
        </div>

        <div class="field-row">
          <div class="field-group flex-1">
            <label for="code" class="field-label"
              >Course Code <span class="required">*</span></label
            >
            <InputText id="code" v-model="formData.code" placeholder="e.g. CS-301" class="w-full" />
          </div>
          <div class="field-group flex-1">
            <label for="department" class="field-label">Department / Category</label>
            <Select
              id="department"
              v-model="formData.department"
              :options="departments"
              optionLabel="label"
              optionValue="value"
              placeholder="Select Department"
              class="w-full"
            />
          </div>
        </div>

        <div class="field-group">
          <label for="description" class="field-label">Course Description</label>
          <Textarea
            id="description"
            v-model="formData.description"
            rows="6"
            placeholder="Provide a detailed overview of what students will learn in this course..."
            class="w-full textarea-field"
          />
          <div class="field-hint">
            <span>Markdown supported</span>
            <span>{{ formData.description.length }}/500 characters</span>
          </div>
        </div>

        <div class="field-group checkbox-group">
          <Checkbox v-model="formData.isPrivate" inputId="isPrivate" binary />
          <div class="checkbox-label-wrapper">
            <label for="isPrivate" class="checkbox-title">Make this course private</label>
            <span class="checkbox-desc">Only enrolled students can view course materials.</span>
          </div>
        </div>

        <div class="form-actions">
          <Button label="Cancel" severity="secondary" outlined @click="emit('cancel')" />
          <Button :label="isEditMode ? 'Save Changes' : 'Create Course'" @click="handleSave" />
        </div>
      </div>
    </div>

    <!-- ПРАВАЯ КОЛОНКА: Сайдбар -->
    <aside class="editor-sidebar">
      <div class="sidebar-section">
        <h4 class="sidebar-title">COURSE CARD PREVIEW</h4>
        <!-- Используем готовую карточку из entities -->
        <CourseCard :course="previewCourse" class="preview-card" />

        <Button
          icon="pi pi-image"
          label="Upload Cover Image"
          outlined
          severity="secondary"
          class="upload-btn w-full mt-3"
        />
      </div>

      <div class="tips-card">
        <div class="tips-header">
          <i class="pi pi-lightbulb tips-icon"></i>
          <span class="tips-title">Instructor Tips</span>
        </div>
        <ul class="tips-list">
          <li>Keep titles concise and descriptive.</li>
          <li>Use the description to outline learning objectives.</li>
          <li>You can import content from previous semesters after creation.</li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.course-info-editor {
  display: grid;
  grid-template-columns: 1fr 350px; /* 2 колонки: форма и сайдбар */
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .course-info-editor {
    grid-template-columns: 1fr; /* На планшетах одна колонка */
  }
}

/* --- MAIN FORM --- */
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

.field-row {
  display: flex;
  gap: 1.5rem;
}

.flex-1 {
  flex: 1;
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
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-color-muted);
  margin-top: 0.25rem;
}

.checkbox-group {
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--surface-subtle);
  border-bottom: 1px solid var(--surface-subtle);
}

.checkbox-label-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.checkbox-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
}

.checkbox-desc {
  font-size: 0.875rem;
  color: var(--text-color-muted);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* --- SIDEBAR --- */
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
  pointer-events: none; /* Запрещаем клики на карточке превью */
}

.upload-btn {
  border-style: dashed;
  border-width: 2px;
}

.upload-btn:hover {
  background-color: var(--surface-ground);
}

.mt-3 {
  margin-top: 1rem;
}

/* --- TIPS CARD --- */
.tips-card {
  background-color: var(--color-primary-subtle); /* Светло-синий фон */
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
