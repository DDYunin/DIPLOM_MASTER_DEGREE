<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'

const visible = defineModel<boolean>('visible', { default: false })

const props = defineProps<{
  topicId: string | null // Чтобы знать, куда добавляем
}>()

const emit = defineEmits<{
  (e: 'create', data: any): void
  (e: 'go-to-quiz-builder', topicId: string): void // Специальный эмит для Квиза
}>()

const elementTypes = [
  { label: 'Video Lecture', value: 'video', icon: 'pi-play-circle' },
  { label: 'File / Reading', value: 'file', icon: 'pi-file' },
  { label: 'Assignment', value: 'assignment', icon: 'pi-clipboard' },
  { label: 'Quiz / Test', value: 'quiz', icon: 'pi-question-circle' }
]

const selectedType = ref('video')
const title = ref('')
const meta = ref('') // URL для видео, или Due Date для Assignment
const submitted = ref(false)

const handlePrimaryAction = () => {
  if (selectedType.value === 'quiz') {
    // УМНЫЙ РОУТИНГ: Отправляем эмит на переход в конструктор тестов
    if (props.topicId) emit('go-to-quiz-builder', props.topicId)
    close()
    return
  }

  // ОБЫЧНОЕ СОХРАНЕНИЕ: для простых материалов
  submitted.value = true
  if (!title.value.trim()) return

  emit('create', {
    topicId: props.topicId,
    type: selectedType.value,
    title: title.value.trim(),
    meta: meta.value.trim() || 'Added just now'
  })

  close()
}

const close = () => {
  visible.value = false
}

watch(visible, (newVal) => {
  if (!newVal) {
    selectedType.value = 'video'
    title.value = ''
    meta.value = ''
    submitted.value = false
  }
})
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Add New Material" :style="{ width: '450px' }">
    <div class="form-content">
      <div class="field-group">
        <label class="field-label">Content Type</label>
        <Select
          v-model="selectedType"
          :options="elementTypes"
          optionLabel="label"
          optionValue="value"
          class="w-full"
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

      <!-- ЕСЛИ ЭТО QUIZ: Показываем инфо-панель -->
      <div v-if="selectedType === 'quiz'" class="quiz-info-box mt-3">
        <i class="pi pi-info-circle info-icon"></i>
        <div class="info-text">
          <strong>Advanced Configuration Required</strong>
          <p>
            Quizzes require setting up questions, grading rules, and time limits. You will be
            redirected to the Quiz Builder.
          </p>
        </div>
      </div>

      <!-- ЕСЛИ ЭТО ОБЫЧНЫЙ МАТЕРИАЛ: Показываем форму -->
      <template v-else>
        <div class="field-group mt-3">
          <label class="field-label">Title <span class="required">*</span></label>
          <InputText
            v-model="title"
            placeholder="e.g. 1.1 Contrast and Balance"
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

      <!-- Кнопка меняется в зависимости от типа -->
      <Button
        v-if="selectedType === 'quiz'"
        label="Go to Quiz Builder"
        icon="pi pi-arrow-right"
        iconPos="right"
        @click="handlePrimaryAction"
      />
      <Button v-else label="Add Material" icon="pi pi-check" @click="handlePrimaryAction" />
    </template>
  </Dialog>
</template>

<style scoped>
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
.flex-align-center {
  display: flex;
  align-items: center;
}

/* Quiz Info Box */
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
