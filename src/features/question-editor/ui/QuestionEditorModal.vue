<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

import type { Question, QuestionFormValues, QuestionType } from '@/entities/question-bank'
import { mapQuestionToFormValues } from '@/entities/question-bank'

const { t } = useI18n()

const visible = defineModel<boolean>('visible', { default: false })

const props = defineProps<{
  bankName?: string
  initialData?: Question | null
}>()

const emit = defineEmits<{
  save: [values: QuestionFormValues]
}>()

const questionTypes = [
  { label: t('bankQuestions.types.single'), value: 'SINGLE' as QuestionType },
  { label: t('bankQuestions.types.multiple'), value: 'MULTIPLE' as QuestionType },
  { label: t('bankQuestions.types.text'), value: 'TEXT' as QuestionType }
]

const type = ref<QuestionType>('SINGLE')
const points = ref(1)
const prompt = ref('')
const questionId = ref<string | null>(null)
const options = ref<{ id: number; text: string; isCorrect: boolean }[]>([])
const textAnswers = ref<{ id: number; text: string }[]>([])

const createDefaultOptions = () => [
  { id: 1, text: '', isCorrect: true },
  { id: 2, text: '', isCorrect: false }
]

const createDefaultTextAnswers = () => [{ id: 1, text: '' }]

const initForm = () => {
  if (props.initialData) {
    const formValues = mapQuestionToFormValues(props.initialData)
    questionId.value = formValues.id ?? null
    type.value = formValues.type
    points.value = formValues.points
    prompt.value = formValues.text

    if (formValues.type === 'TEXT') {
      textAnswers.value =
        formValues.answers.length > 0
          ? formValues.answers.map((answer, index) => ({
              id: answer.id ?? index + 1,
              text: answer.text
            }))
          : createDefaultTextAnswers()
      options.value = createDefaultOptions()
    } else {
      options.value =
        formValues.answers.length > 0
          ? formValues.answers.map((answer, index) => ({
              id: answer.id ?? index + 1,
              text: answer.text,
              isCorrect: answer.isCorrect
            }))
          : createDefaultOptions()
      textAnswers.value = createDefaultTextAnswers()
    }

    return
  }

  questionId.value = null
  type.value = 'SINGLE'
  points.value = 1
  prompt.value = ''
  options.value = createDefaultOptions()
  textAnswers.value = createDefaultTextAnswers()
}

watch(visible, (isVisible) => {
  if (isVisible) {
    initForm()
  }
})

watch(type, (nextType) => {
  if (nextType === 'TEXT' && textAnswers.value.length === 0) {
    textAnswers.value = createDefaultTextAnswers()
  }

  if (nextType !== 'TEXT' && options.value.length === 0) {
    options.value = createDefaultOptions()
  }
})

const addOption = () => {
  options.value.push({ id: Date.now(), text: '', isCorrect: false })
}

const removeOption = (id: number) => {
  options.value = options.value.filter((option) => option.id !== id)
}

const setSingleCorrectOption = (id: number) => {
  options.value.forEach((option) => {
    option.isCorrect = option.id === id
  })
}

const addTextAnswer = () => {
  textAnswers.value.push({ id: Date.now(), text: '' })
}

const removeTextAnswer = (id: number) => {
  textAnswers.value = textAnswers.value.filter((answer) => answer.id !== id)
}

const handleSave = () => {
  const answers =
    type.value === 'TEXT'
      ? textAnswers.value.map((answer) => ({
          text: answer.text,
          isCorrect: true
        }))
      : options.value.map((option) => ({
          text: option.text,
          isCorrect: option.isCorrect
        }))

  emit('save', {
    id: questionId.value ?? undefined,
    type: type.value,
    text: prompt.value,
    points: points.value,
    answers
  })
}

const handleClose = () => {
  visible.value = false
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :style="{ width: '800px' }"
    :closable="false"
    class="question-editor-dialog"
  >
    <template #header>
      <div class="editor-header">
        <div class="header-titles">
          <h2 class="editor-title">{{ t('modals.questionEditor.title') }}</h2>
          <span class="editor-subtitle">{{ bankName || 'Question Bank' }}</span>
        </div>
        <Button
          :label="t('common.close')"
          severity="secondary"
          text
          class="bg-surface-100"
          @click="handleClose"
        />
      </div>
    </template>

    <div class="editor-body">
      <div class="top-row">
        <div class="field-group flex-2">
          <label>{{ t('modals.questionEditor.type') }}</label>
          <Select
            v-model="type"
            :options="questionTypes"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        <div class="field-group flex-1">
          <label>{{ t('modals.questionEditor.points') }}</label>
          <InputNumber v-model="points" :min="1" class="w-full" inputClass="w-full" />
        </div>
      </div>

      <div class="field-group">
        <label>{{ t('modals.questionEditor.prompt') }}</label>
        <Textarea
          v-model="prompt"
          rows="5"
          class="w-full"
          :placeholder="t('modals.questionEditor.promptPlaceholder')"
        />
      </div>

      <div v-if="type === 'SINGLE' || type === 'MULTIPLE'" class="dynamic-section">
        <div class="section-header">
          <label>{{ t('modals.questionEditor.answerOptions') }}</label>
          <span class="section-hint">
            {{
              type === 'SINGLE'
                ? t('modals.questionEditor.singleHint')
                : t('modals.questionEditor.multipleHint')
            }}
          </span>
        </div>

        <div class="options-list">
          <div
            v-for="option in options"
            :key="option.id"
            class="option-row"
            :class="{ 'is-correct': option.isCorrect }"
          >
            <div class="option-control">
              <RadioButton
                v-if="type === 'SINGLE'"
                :value="true"
                :modelValue="option.isCorrect"
                @update:modelValue="setSingleCorrectOption(option.id)"
              />
              <Checkbox v-else v-model="option.isCorrect" binary />
            </div>
            <InputText v-model="option.text" class="w-full option-input" />
            <Button
              icon="pi pi-trash"
              text
              severity="secondary"
              :disabled="options.length <= 2"
              @click="removeOption(option.id)"
            />
          </div>
          <Button
            :label="t('modals.questionEditor.addOption')"
            icon="pi pi-plus"
            text
            severity="secondary"
            size="small"
            @click="addOption"
            class="add-option-btn"
          />
        </div>
      </div>

      <div v-if="type === 'TEXT'" class="dynamic-section">
        <div class="section-header">
          <label>{{ t('modals.questionEditor.textAnswers') }}</label>
          <span class="section-hint">{{ t('modals.questionEditor.textHint') }}</span>
        </div>

        <div class="options-list">
          <div v-for="answer in textAnswers" :key="answer.id" class="option-row">
            <InputText v-model="answer.text" class="w-full option-input" />
            <Button
              icon="pi pi-trash"
              text
              severity="secondary"
              :disabled="textAnswers.length <= 1"
              @click="removeTextAnswer(answer.id)"
            />
          </div>
          <Button
            :label="t('modals.questionEditor.addTextAnswer')"
            icon="pi pi-plus"
            text
            severity="secondary"
            size="small"
            @click="addTextAnswer"
            class="add-option-btn"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="editor-footer">
        <Button :label="t('common.cancel')" severity="secondary" outlined @click="handleClose" />
        <Button :label="t('common.saveChanges')" @click="handleSave" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.editor-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.editor-subtitle {
  color: var(--text-color-muted);
  font-size: 0.875rem;
}

.editor-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.top-row {
  display: flex;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
}

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.w-full {
  width: 100%;
}

.dynamic-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-hint {
  font-size: 0.8125rem;
  color: var(--text-color-muted);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.option-row.is-correct {
  border-color: var(--color-primary-border);
  background: var(--color-primary-subtle);
}

.option-control {
  flex-shrink: 0;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
