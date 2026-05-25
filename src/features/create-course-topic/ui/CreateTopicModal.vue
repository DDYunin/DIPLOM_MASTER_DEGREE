<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const { t } = useI18n()

const visible = defineModel<boolean>('visible', { default: false })

const props = defineProps<{
  initialData?: { id: string; title: string; meta: string } | null
}>()

const emit = defineEmits<{
  (e: 'save', data: { id?: string; title: string; meta: string }): void
}>()

const title = ref('')
const meta = ref('')
const submitted = ref(false)

const handleSave = () => {
  submitted.value = true

  if (!title.value.trim()) {
    return
  }

  emit('save', {
    id: props.initialData?.id, // Передаем ID, если это редактирование
    title: title.value.trim(),
    meta: meta.value.trim() || '0 items • 0 mins'
  })

  close()
}

const close = () => {
  visible.value = false
}

// Очистка при закрытии
watch(visible, (newVal) => {
  if (newVal) {
    title.value = props.initialData?.title || ''
    meta.value = props.initialData?.meta || ''
    submitted.value = false
  }
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="initialData ? t('modals.topic.edit') : t('modals.topic.add')"
    :style="{ width: '400px' }"
  >
    <div class="form-content">
      <p class="form-desc">Organize your course content into logical sections.</p>

      <div class="field-group">
        <label for="topicTitle" class="field-label"
          >Topic Title <span class="required">*</span></label
        >
        <InputText
          id="topicTitle"
          v-model="title"
          :placeholder="t('modals.topic.namePlaceholder')"
          class="w-full"
          :invalid="submitted && !title.trim()"
          autofocus
        />
        <small v-if="submitted && !title.trim()" class="error-text">Title is required.</small>
      </div>

      <div class="field-group mt-3">
        <label for="topicMeta" class="field-label">Estimated Time / Meta (Optional)</label>
        <InputText
          id="topicMeta"
          v-model="meta"
          placeholder="e.g. 2 items • 45 mins"
          class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <Button :label="t('common.cancel')" text severity="secondary" @click="close" />
      <Button
        :label="initialData ? t('common.saveChanges') : t('modals.topic.create')"
        icon="pi pi-check"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
.error-text {
  color: var(--color-danger);
  font-size: 0.75rem;
}
.w-full {
  width: 100%;
}
.mt-3 {
  margin-top: 1rem;
}
</style>
