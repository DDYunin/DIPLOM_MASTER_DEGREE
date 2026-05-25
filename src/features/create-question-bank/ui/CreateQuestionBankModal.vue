<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const { t } = useI18n()

const visible = defineModel<boolean>('visible', { default: false })

const emit = defineEmits<{
  (e: 'create', data: { title: string; description: string }): void
}>()

const title = ref('')
const description = ref('')
const submitted = ref(false)

const handleCreate = () => {
  submitted.value = true

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
    :header="t('modals.questionBank.create')"
    :style="{ width: '450px' }"
  >
    <div class="form-content">
      <div class="field-group">
        <label for="bankTitle" class="field-label">{{ t('teacherQuestionBanks.bankTitle') }}</label>
        <InputText
          id="bankTitle"
          v-model="title"
          :placeholder="t('modals.questionBank.titlePlaceholder')"
          class="w-full"
          :invalid="submitted && !title.trim()"
          autofocus
        />
      </div>

      <div class="field-group mt-3">
        <label for="bankDesc" class="field-label">{{ t('teacherQuestionBanks.description') }}</label>
        <Textarea
          id="bankDesc"
          v-model="description"
          rows="4"
          :placeholder="t('modals.questionBank.descPlaceholder')"
          class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <Button :label="t('common.cancel')" text severity="secondary" @click="close" />
      <Button :label="t('modals.questionBank.createBtn')" icon="pi pi-check" @click="handleCreate" />
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

.w-full {
  width: 100%;
}
.mt-3 {
  margin-top: 1rem;
}
</style>
