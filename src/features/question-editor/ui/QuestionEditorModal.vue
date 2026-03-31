<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'

const visible = defineModel<boolean>('visible', { default: false })

const props = defineProps<{
  bankName?: string
}>()

const emit = defineEmits<{
  (e: 'save', questionData: any): void
}>()

// --- ОПЦИИ ДЛЯ СЕЛЕКТОВ ---
const questionTypes = [
  { label: 'Multiple Choice (Single Answer)', value: 'single' },
  { label: 'Multiple Correct Answers', value: 'multi' },
  { label: 'Short Answer', value: 'short' },
  { label: 'Essay / Long Answer', value: 'essay' }
]

const difficulties = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' }
]

// --- СОСТОЯНИЕ ФОРМЫ ---
const type = ref('single')
const points = ref('5')
const difficulty = ref('medium')
const prompt = ref('')

// Для Multiple Choice
const options = ref([
  { id: 1, text: 'x = 8', isCorrect: true },
  { id: 2, text: 'x = 5', isCorrect: false },
  { id: 3, text: 'x = 13', isCorrect: false }
])

// Для Short Answer
const shortAnswerText = ref('x = 5')
const answerExplanation = ref('')

// Для Essay
const essaySettings = ref({
  textEntry: true,
  minWords: 0,
  maxWords: null,
  fileUploads: false,
  maxFiles: 1,
  fileTypes: '.pdf, .docx'
})

// --- ЛОГИКА ОПЦИЙ ---
const addOption = () => {
  options.value.push({ id: Date.now(), text: '', isCorrect: false })
}

const removeOption = (id: number) => {
  options.value = options.value.filter((o) => o.id !== id)
}

const setSingleCorrectOption = (id: number) => {
  options.value.forEach((o) => {
    o.isCorrect = o.id === id
  })
}

// --- СОХРАНЕНИЕ И ЗАКРЫТИЕ ---
const handleSave = () => {
  // В реальности здесь мы собираем данные в зависимости от type.value
  emit('save', {
    type: type.value,
    prompt: prompt.value,
    points: points.value,
    difficulty: difficulty.value
  })
  visible.value = false
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
    <!-- КАСТОМНЫЙ HEADER -->
    <template #header>
      <div class="editor-header">
        <div class="header-titles">
          <h2 class="editor-title">Edit Question</h2>
          <span class="editor-subtitle">{{ bankName || 'Question Bank' }}</span>
        </div>
        <Button
          label="Close"
          severity="secondary"
          text
          class="bg-surface-100"
          @click="handleClose"
        />
      </div>
    </template>

    <div class="editor-body">
      <!-- TOP ROW: Type, Points, Difficulty -->
      <div class="top-row">
        <div class="field-group flex-2">
          <label>Question Type</label>
          <Select
            v-model="type"
            :options="questionTypes"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        <div class="field-group flex-1">
          <label>Points</label>
          <InputText v-model="points" class="w-full text-center" />
        </div>
        <div class="field-group flex-2">
          <label>Difficulty</label>
          <Select
            v-model="difficulty"
            :options="difficulties"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
      </div>

      <!-- PROMPT (Rich Text Editor Mock) -->
      <div class="field-group">
        <div class="field-header">
          <label>Question Prompt</label>
          <a href="#" class="preview-link">Preview</a>
        </div>
        <div class="fake-editor">
          <div class="editor-toolbar">
            <i class="pi pi-bold"></i>
            <i class="pi pi-italic"></i>
            <i class="pi pi-underline"></i>
            <span class="divider"></span>
            <i class="pi pi-list"></i>
            <i class="pi pi-link"></i>
            <i class="pi pi-image"></i>
          </div>
          <Textarea
            v-model="prompt"
            rows="5"
            class="editor-textarea"
            placeholder="Type your question here..."
          />
        </div>
      </div>

      <!-- ДИНАМИЧЕСКАЯ СЕКЦИЯ: В зависимости от типа вопроса -->

      <!-- 1. MULTIPLE CHOICE (Single / Multi) -->
      <div v-if="type === 'single' || type === 'multi'" class="dynamic-section">
        <div class="section-header">
          <label>Answer Options</label>
          <span class="section-hint">
            {{
              type === 'single'
                ? 'Select the radio button next to the correct answer. Only one option can be correct.'
                : 'Select the checkboxes to mark all correct answers'
            }}
          </span>
        </div>

        <div class="options-list">
          <div
            v-for="opt in options"
            :key="opt.id"
            class="option-row"
            :class="{ 'is-correct': opt.isCorrect }"
          >
            <div class="option-control">
              <RadioButton
                v-if="type === 'single'"
                :value="true"
                :modelValue="opt.isCorrect"
                @update:modelValue="setSingleCorrectOption(opt.id)"
              />
              <Checkbox v-else v-model="opt.isCorrect" binary />
            </div>
            <InputText v-model="opt.text" class="w-full option-input" />
            <Button
              icon="pi pi-trash"
              text
              severity="secondary"
              @click="removeOption(opt.id)"
              aria-label="Delete option"
            />
          </div>
          <Button
            label="Add Option"
            icon="pi pi-plus"
            text
            severity="secondary"
            size="small"
            @click="addOption"
            class="add-option-btn"
          />
        </div>
      </div>

      <!-- 2. SHORT ANSWER -->
      <div v-if="type === 'short'" class="dynamic-section">
        <div class="field-group">
          <div class="section-header">
            <label>Correct Answer</label>
            <span class="section-hint">Students must match this answer exactly</span>
          </div>
          <InputText v-model="shortAnswerText" class="w-full" />
        </div>

        <div class="field-group mt-4">
          <div class="section-header">
            <label>Answer Explanation (Optional)</label>
            <i class="pi pi-angle-down"></i>
          </div>
          <Textarea
            v-model="answerExplanation"
            rows="3"
            class="w-full textarea-field"
            placeholder="Provide feedback for students explaining the correct answer..."
          />
        </div>
      </div>

      <!-- 3. ESSAY / LONG ANSWER -->
      <div v-if="type === 'essay'" class="dynamic-section">
        <div class="section-header">
          <label>Submission Settings</label>
          <span class="section-hint">Configure how students should submit their answer</span>
        </div>

        <div class="settings-cards">
          <!-- Text Entry Card -->
          <div class="setting-card" :class="{ 'card-active': essaySettings.textEntry }">
            <div class="card-header">
              <Checkbox v-model="essaySettings.textEntry" binary inputId="textEntry" />
              <div class="card-title-block">
                <label for="textEntry" class="card-title">Text Entry</label>
                <p class="card-desc">
                  Allow students to type their answer directly into a rich text editor.
                </p>
              </div>
            </div>
            <div class="card-body" v-if="essaySettings.textEntry">
              <div class="setting-row">
                <span>Minimum word count</span>
                <InputText v-model="essaySettings.minWords" class="setting-input text-center" />
              </div>
              <div class="setting-row">
                <span>Maximum word count</span>
                <InputText placeholder="No limit" class="setting-input text-center" />
              </div>
            </div>
          </div>

          <!-- File Uploads Card -->
          <div class="setting-card" :class="{ 'card-active': essaySettings.fileUploads }">
            <div class="card-header">
              <Checkbox v-model="essaySettings.fileUploads" binary inputId="fileUploads" />
              <div class="card-title-block">
                <label for="fileUploads" class="card-title">File Uploads</label>
                <p class="card-desc">
                  Allow students to attach files (PDF, DOCX, etc.) as their answer.
                </p>
              </div>
            </div>
            <div class="card-body" v-if="essaySettings.fileUploads">
              <div class="setting-row">
                <span>Max files allowed</span>
                <Select
                  v-model="essaySettings.maxFiles"
                  :options="[1, 2, 3, 5]"
                  class="setting-input"
                />
              </div>
              <div class="setting-row">
                <span>Accepted file types</span>
                <InputText v-model="essaySettings.fileTypes" class="setting-input" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ФУТЕР -->
    <template #footer>
      <div class="editor-footer">
        <Button label="Cancel" severity="secondary" outlined @click="handleClose" />
        <Button label="Save Changes" @click="handleSave" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
/* --- HEADER --- */
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
  color: var(--p-text-color);
}

.editor-subtitle {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.bg-surface-100 {
  background-color: var(--p-surface-100);
  color: var(--p-text-color);
}

/* --- BODY & COMMON --- */
.editor-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 1rem;
}

.top-row {
  display: flex;
  gap: 1.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
.text-center :deep(input) {
  text-align: center;
}

label {
  font-weight: 700;
  color: var(--p-text-color);
  font-size: 0.875rem;
}

/* --- FAKE RICH TEXT EDITOR --- */
.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-link {
  font-size: 0.875rem;
  color: var(--p-primary-500);
  text-decoration: none;
  font-weight: 600;
}

.fake-editor {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius);
  overflow: hidden;
}

.editor-toolbar {
  background-color: var(--p-surface-50);
  border-bottom: 1px solid var(--p-surface-300);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--p-text-muted-color);
}

.editor-toolbar i {
  cursor: pointer;
  transition: color 0.2s;
}

.editor-toolbar i:hover {
  color: var(--p-text-color);
}

.divider {
  width: 1px;
  height: 1rem;
  background-color: var(--p-surface-300);
}

.editor-textarea {
  border: none;
  border-radius: 0;
  resize: vertical;
}
.editor-textarea:focus {
  box-shadow: none;
}

/* --- DYNAMIC SECTIONS --- */
.dynamic-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-hint {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}

/* Options List (Multiple Choice) */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  padding: 0.75rem 1rem;
  background-color: var(--p-surface-0);
  transition: border-color 0.2s;
}

.option-row.is-correct {
  border-color: var(--p-primary-300);
  background-color: var(--p-primary-50); /* Легкая подсветка правильного ответа */
}

.option-control {
  display: flex;
  align-items: center;
}

.option-input {
  border: none;
  background: transparent;
  padding: 0;
  font-weight: 500;
}
.option-input:focus {
  box-shadow: none;
}

.add-option-btn {
  align-self: flex-start;
  margin-top: 0.5rem;
}

/* Essay Settings Cards */
.settings-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.setting-card {
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  background-color: var(--p-surface-0);
  transition: border-color 0.2s;
}

.card-active {
  border-color: var(--p-primary-300);
}

.card-header {
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.card-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-title {
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
}

.card-desc {
  margin: 0;
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  line-height: 1.4;
}

.card-body {
  padding: 0 1.25rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.setting-input {
  width: 100px;
}

.mt-4 {
  margin-top: 1rem;
}

.border-top {
  border-top: 1px solid var(--p-surface-200);
}

/* --- FOOTER --- */
.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--p-surface-200);
  width: 100%;
}

/* Кастомизация самого диалога для сходства с макетом */
:global(.question-editor-dialog .p-dialog-header) {
  border-bottom: 1px solid var(--p-surface-200);
  padding: 1.5rem;
}
:global(.question-editor-dialog .p-dialog-content) {
  padding: 1.5rem;
}
:global(.question-editor-dialog .p-dialog-footer) {
  background-color: var(--p-surface-50);
  padding: 1rem 1.5rem;
  border-top: none;
}
</style>
