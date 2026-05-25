<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const visible = defineModel<boolean>('visible', { default: false })

const emit = defineEmits<{
  (e: 'create', data: { title: string; description: string }): void
}>()

const title = ref('')
const description = ref('')
const submitted = ref(false)

const handleCreate = () => {
  submitted.value = true

  // Простая валидация: title обязателен
  if (!title.value.trim()) return

  emit('create', {
    title: title.value.trim(),
    description: description.value.trim()
  })

  close()
}

const close = () => {
  visible.value = false
}

// Очищаем форму при каждом закрытии модалки
watch(visible, (newVal) => {
  if (!newVal) {
    title.value = ''
    description.value = ''
    submitted.value = false
  }
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Create New Question Bank"
    :style="{ width: '450px' }"
  >
    <div class="form-content">
      <p class="form-desc">Define a new category to organize your questions.</p>

      <div class="field-group">
        <label for="bankTitle" class="field-label"
          >Bank Title <span class="required">*</span></label
        >
        <InputText
          id="bankTitle"
          v-model="title"
          placeholder="e.g. Advanced Mathematics"
          class="w-full"
          :invalid="submitted && !title.trim()"
          autofocus
        />
        <small v-if="submitted && !title.trim()" class="error-text">Title is required.</small>
      </div>

      <div class="field-group">
        <label for="bankDesc" class="field-label">Description</label>
        <Textarea
          id="bankDesc"
          v-model="description"
          rows="3"
          placeholder="Short overview of the topics covered..."
          class="w-full"
          style="resize: vertical"
        />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="close" />
      <Button label="Create Bank" icon="pi pi-check" @click="handleCreate" />
    </template>
  </Dialog>
</template>

<style scoped>
.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

.form-desc {
  margin: 0;
  color: var(--text-color-muted);
  font-size: 0.875rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.875rem;
}

.required {
  color: var(--color-danger);
}

.w-full {
  width: 100%;
}

.error-text {
  color: var(--color-danger);
  font-size: 0.75rem;
}
</style>
