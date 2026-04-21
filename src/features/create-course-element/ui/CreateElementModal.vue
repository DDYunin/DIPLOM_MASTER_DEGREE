<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'

const visible = defineModel<boolean>('visible', { default: false })

const props = defineProps<{
  topicId: string | null
  initialData?: any // Режим редактирования
}>()

const emit = defineEmits<{
  (e: 'save', data: any): void
  (e: 'go-to-quiz-builder', topicId: string): void
}>()

const elementTypes = [
  { label: 'Video Lecture', value: 'video', icon: 'pi-play-circle' },
  { label: 'File / Reading', value: 'file', icon: 'pi-file' },
  { label: 'Assignment', value: 'assignment', icon: 'pi-clipboard' },
  { label: 'Quiz / Test', value: 'quiz', icon: 'pi-question-circle' }
]

const selectedType = ref('video')
const title = ref('')
const meta = ref('')
const submitted = ref(false)

// Состояние загруженного файла
const uploadedFile = ref<File | null>(null)

// Хелпер: нужен ли загрузчик файлов для выбранного типа?
const requiresUpload = computed(
  () => selectedType.value === 'file' || selectedType.value === 'video'
)

// Обработчик PrimeVue FileUpload
const onFileSelect = (event: any) => {
  uploadedFile.value = event.files[0]

  // Умная подстановка названия и меты, если поля пустые
  if (uploadedFile.value && !title.value) {
    title.value = uploadedFile.value.name.split('.')[0] // Убираем расширение

    // Если видео, пишем заглушку времени, если файл - размер
    meta.value =
      selectedType.value === 'video'
        ? 'Processing length...'
        : `${(uploadedFile.value.size / 1024 / 1024).toFixed(2)} MB`
  }
}

const handlePrimaryAction = () => {
  if (selectedType.value === 'quiz') {
    if (props.topicId) {
      emit('go-to-quiz-builder', props.topicId)
    }
    close()
    return
  }

  submitted.value = true

  // Валидация
  if (!title.value.trim()) return
  if (requiresUpload.value && !uploadedFile.value && !props.initialData) {
    return // Ошибка: Файл обязателен при создании File/Video
  }

  emit('save', {
    id: props.initialData?.id, // Пробрасываем ID, если редактируем
    topicId: props.topicId,
    type: selectedType.value,
    title: title.value.trim(),
    meta: meta.value.trim() || 'Updated just now'
  })

  close()
}

const close = () => {
  visible.value = false
}

watch(visible, (newVal) => {
  if (newVal) {
    if (props.initialData) {
      selectedType.value = props.initialData.type
      title.value = props.initialData.title
      meta.value = props.initialData.meta
    } else {
      selectedType.value = 'video'
      title.value = ''
      meta.value = ''
    }
    uploadedFile.value = null
    submitted.value = false
  }
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="initialData ? 'Edit Material' : 'Add New Material'"
    :style="{ width: '450px' }"
  >
    <div class="form-content">
      <div class="field-group">
        <label class="field-label">Content Type</label>
        <Select
          v-model="selectedType"
          :options="elementTypes"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          :disabled="!!initialData"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex-align-center">
              <i
                class="pi mr-2"
                :class="elementTypes.find((t) => t.value === slotProps.value)?.icon"
              ></i>
              {{ elementTypes.find((t) => t.value === slotProps.value)?.label }}
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex-align-center">
              <i class="pi mr-2" :class="slotProps.option.icon"></i>
              {{ slotProps.option.label }}
            </div>
          </template>
        </Select>
      </div>

      <!-- ИНФО ДЛЯ QUIZ -->
      <div v-if="selectedType === 'quiz' && !initialData" class="quiz-info-box mt-3">
        <i class="pi pi-info-circle info-icon"></i>
        <div class="info-text">
          <strong>Advanced Configuration Required</strong>
          <p>
            Quizzes require setting up questions, grading rules, and time limits. You will be
            redirected to the Quiz Builder.
          </p>
        </div>
      </div>

      <!-- ФОРМА ОБЫЧНОГО МАТЕРИАЛА -->
      <template v-else>
        <!-- ЗАГРУЗКА ФАЙЛА / ВИДЕО -->
        <div v-if="requiresUpload" class="field-group mt-3">
          <label class="field-label">
            Upload {{ selectedType === 'video' ? 'Video' : 'File' }}
            <span v-if="!initialData" class="required">*</span>
          </label>

          <FileUpload
            mode="basic"
            name="mediaFile"
            :accept="selectedType === 'video' ? 'video/*, .mp4, .mkv' : '*/*'"
            :maxFileSize="500000000"
            @select="onFileSelect"
            :chooseLabel="uploadedFile ? uploadedFile.name : 'Choose File...'"
            class="w-full custom-fileupload"
          />
          <small v-if="submitted && !uploadedFile && !initialData" class="error-text">
            File upload is required.
          </small>
        </div>

        <div class="field-group mt-3">
          <label class="field-label">Title <span class="required">*</span></label>
          <InputText
            v-model="title"
            placeholder="e.g. Introduction to Topic"
            class="w-full"
            :invalid="submitted && !title.trim()"
          />
        </div>

        <div class="field-group mt-3">
          <label class="field-label">Additional Info (Duration, Due Date, etc.)</label>
          <InputText v-model="meta" placeholder="e.g. 10:00 mins" class="w-full" />
        </div>
      </template>
    </div>

    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="close" />
      <Button
        v-if="selectedType === 'quiz' && !initialData"
        label="Go to Quiz Builder"
        icon="pi pi-arrow-right"
        iconPos="right"
        @click="handlePrimaryAction"
      />
      <Button
        v-else
        :label="initialData ? 'Save Changes' : 'Add Material'"
        icon="pi pi-check"
        @click="handlePrimaryAction"
      />
    </template>
  </Dialog>
</template>

<style scoped>
/* Стили из предыдущего шага + пара новых */
.form-content {
  padding-top: 0.5rem;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field-label {
  font-weight: 600;
  color: var(--p-text-color);
  font-size: 0.875rem;
}
.w-full {
  width: 100%;
}
.mt-3 {
  margin-top: 1rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.required {
  color: var(--p-red-500);
}
.error-text {
  color: var(--p-red-500);
  font-size: 0.75rem;
}
.flex-align-center {
  display: flex;
  align-items: center;
}

/* Кастомизация FileUpload (чтобы кнопка была на всю ширину) */
.custom-fileupload :deep(.p-button) {
  width: 100%;
  justify-content: center;
  background-color: var(--p-surface-50);
  color: var(--p-text-color);
  border: 1px solid var(--p-surface-300);
}
.custom-fileupload :deep(.p-button:hover) {
  background-color: var(--p-surface-100);
  border-color: var(--p-primary-400);
}

.quiz-info-box {
  background-color: var(--p-blue-50);
  border: 1px solid var(--p-blue-200);
  border-radius: var(--p-border-radius);
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  color: var(--p-blue-800);
}
.info-icon {
  font-size: 1.5rem;
  color: var(--p-blue-600);
}
.info-text strong {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}
.info-text p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--p-blue-700);
}
</style>
