<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseContentStore, type ElementType } from '@/entities/course-content'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import { useNotifications } from '@/shared/model/useNotifications'

import { CreateTopicModal } from '@/features/create-course-topic'
import { CreateElementModal } from '@/features/create-course-element'

const router = useRouter()
const route = useRoute()

const contentStore = useCourseContentStore()
const notifications = useNotifications()

const editingTopic = ref<any>(null)
const targetTopicId = ref<string | null>(null)
const editingElement = ref<any>(null)

const isElementModalVisible = ref(false)
const isTopicModalVisible = ref(false)

const openCreateTopic = () => {
  editingTopic.value = null
  isTopicModalVisible.value = true
}

const openEditTopic = (topic: any) => {
  editingTopic.value = topic
  isTopicModalVisible.value = true
}

const handleTopicSave = (data: any) => {
  if (data.id) {
    contentStore.updateTopic(data.id, data)
    notifications.showToast('success', 'Success', 'Topic have been updated.')
  } else {
    contentStore.createTopic(data)
    notifications.showToast('success', 'Success', 'Topic have been created.')
  }
}

const openAddElement = (topicId: string) => {
  targetTopicId.value = topicId
  editingElement.value = null
  isElementModalVisible.value = true
}

const openEditElement = (topicId: string, element: any) => {
  // ЕСЛИ ТИП КВИЗ - УВОДИМ НА СТРАНИЦУ
  if (element.type === 'quiz') {
    router.push({
      name: 'teacher-quiz-builder',
      params: { id: route.params.id as string },
      query: { editId: element.id }
    })
    return
  }

  targetTopicId.value = topicId
  editingElement.value = element
  isElementModalVisible.value = true
}

const handleElementSave = (data: any) => {
  // Добавляем элемент в локальный стор (можешь добавить этот экшен в useCourseContentStore)
  if (data.id) {
    contentStore.updateElement(data.topicId, data.id, data)
  } else {
    contentStore.createElement(data)
  }
}

const handleGoToQuizBuilder = (topicId: string) => {
  router.push({
    name: 'teacher-quiz-builder',
    params: { id: route.params.id as string },
    query: { topicId }
  })
}

// Хелперы для рендера иконок и цветов в зависимости от типа элемента
const getElementConfig = (type: ElementType) => {
  switch (type) {
    case 'video':
      return {
        icon: 'pi-play-circle',
        color: 'var(--color-primary)',
        bg: 'var(--color-primary-subtle)',
        badge: 'VIDEO'
      }
    case 'file':
      return {
        icon: 'pi-file',
        color: 'var(--color-warning)',
        bg: 'var(--color-warning-subtle)',
        badge: 'PDF'
      }
    case 'quiz':
      return {
        icon: 'pi-question-circle',
        color: 'var(--color-accent-purple)',
        bg: 'var(--color-accent-purple-subtle)',
        badge: 'QUIZ'
      }
    case 'assignment':
      return {
        icon: 'pi-clipboard',
        color: 'var(--color-success)',
        bg: 'var(--color-success-subtle)',
        badge: 'ASSIGNMENT'
      }
  }
}
</script>

<template>
  <div class="content-editor-layout">
    <!-- ЛЕВАЯ КОЛОНКА: Основной контент -->
    <div class="editor-main">
      <!-- Тулбар -->
      <div class="toolbar">
        <div class="toolbar-left">
          <Button label="Add New Topic" icon="pi pi-plus" @click="openCreateTopic" />
          <div class="toolbar-actions">
            <Button
              icon="pi pi-angle-up"
              text
              rounded
              severity="secondary"
              @click="contentStore.collapseAll"
              aria-label="Collapse All"
            />
            <Button
              icon="pi pi-angle-down"
              text
              rounded
              severity="secondary"
              @click="contentStore.expandAll"
              aria-label="Expand All"
            />
          </div>
        </div>
        <div class="toolbar-right">
          <span class="last-saved">Last saved: 2 mins ago</span>
          <Button label="Save" icon="pi pi-save" outlined severity="secondary" />
        </div>
      </div>

      <!-- Список тем -->
      <div class="topics-list">
        <div v-for="topic in contentStore.topics" :key="topic.id" class="topic-card">
          <!-- Шапка темы -->
          <div class="topic-header" @click="contentStore.toggleTopic(topic.id)">
            <i class="pi pi-ellipsis-v drag-handle"></i>
            <i class="pi pi-ellipsis-v drag-handle second-handle"></i>

            <div class="topic-header-info">
              <h3 class="topic-title">{{ topic.title }}</h3>
              <span class="topic-meta">{{ topic.meta }}</span>
            </div>

            <!-- НОВЫЕ КНОПКИ ДЕЙСТВИЙ -->
            <div class="topic-actions">
              <Button
                icon="pi pi-pencil"
                text
                rounded
                severity="secondary"
                @click.stop="openEditTopic(topic)"
                aria-label="Edit Topic"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                @click.stop="contentStore.deleteTopic(topic.id)"
                aria-label="Delete Topic"
              />
              <i
                class="pi chevron-icon ml-2"
                :class="topic.isExpanded ? 'pi-angle-up' : 'pi-angle-down'"
              ></i>
            </div>
          </div>

          <!-- Список элементов (виден только если развернуто) -->
          <div v-show="topic.isExpanded" class="topic-body">
            <div v-for="element in topic.elements" :key="element.id" class="element-row">
              <i class="pi pi-bars element-drag"></i>

              <!-- Иконка элемента -->
              <div
                class="element-icon"
                :style="{
                  backgroundColor: getElementConfig(element.type).bg,
                  color: getElementConfig(element.type).color
                }"
              >
                <i class="pi" :class="getElementConfig(element.type).icon"></i>
              </div>

              <div class="element-info">
                <span class="element-title">{{ element.title }}</span>
                <div class="element-meta-row">
                  <Tag
                    :value="getElementConfig(element.type).badge"
                    :style="{
                      backgroundColor: getElementConfig(element.type).bg,
                      color: getElementConfig(element.type).color,
                      fontWeight: 700
                    }"
                  />
                  <span class="element-meta">{{ element.meta }}</span>
                </div>
              </div>

              <div class="element-actions">
                <Button
                  icon="pi pi-pencil"
                  text
                  rounded
                  severity="secondary"
                  @click="openEditElement(topic.id, element)"
                  aria-label="Edit Material"
                />
                <Button
                  icon="pi pi-trash"
                  text
                  rounded
                  severity="danger"
                  @click="contentStore.deleteElement(topic.id, element.id)"
                  aria-label="Delete Material"
                />
              </div>
            </div>

            <!-- Кнопка добавления элемента внутрь темы -->
            <button class="add-element-btn" @click="openAddElement(topic.id)">
              <i class="pi pi-plus"></i> Add Element to {{ topic.title }}
            </button>
          </div>
        </div>

        <!-- Зона добавления новой темы -->
        <div class="add-topic-zone" @click="openCreateTopic">
          <Button
            icon="pi pi-plus"
            rounded
            severity="secondary"
            outlined
            class="add-topic-icon-btn"
          />
          <div class="add-topic-text">
            <span class="add-title">Add New Topic</span>
            <span class="add-desc">or drag elements here to create one automatically</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ПРАВАЯ КОЛОНКА: Сайдбар -->
    <aside class="editor-sidebar">
      <!-- Quick Add -->
      <div class="sidebar-card">
        <h4 class="card-title">Quick Add</h4>
        <p class="card-subtitle">Drag these items into your topics to create new content.</p>

        <div class="quick-add-grid">
          <div class="quick-add-item">
            <i class="pi pi-play-circle" style="color: var(--color-primary)"></i>
            <span>Video</span>
          </div>
          <div class="quick-add-item">
            <i class="pi pi-question-circle" style="color: var(--color-accent-purple)"></i>
            <span>Quiz</span>
          </div>
          <div class="quick-add-item">
            <i class="pi pi-file" style="color: var(--color-warning)"></i>
            <span>File/Reading</span>
          </div>
          <div class="quick-add-item">
            <i class="pi pi-clipboard" style="color: var(--color-success)"></i>
            <span>Assignment</span>
          </div>
        </div>
      </div>

      <!-- Content Summary -->
      <div class="sidebar-card">
        <div class="summary-header">
          <h4 class="card-title mb-0">Content Summary</h4>
          <Tag value="Draft" severity="success" class="bg-green-100 text-green-700" />
        </div>

        <div class="summary-list">
          <div class="summary-row">
            <span>Total Topics</span>
            <strong>{{ contentStore.totalTopics }}</strong>
          </div>
          <div class="summary-row">
            <span>Total Elements</span>
            <strong>{{ contentStore.totalElements }}</strong>
          </div>
          <div class="summary-row">
            <span>Estimated Duration</span>
            <strong>1h 10m</strong>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span>Content Completion</span>
            <span class="progress-percent">40%</span>
          </div>
          <ProgressBar :value="40" :showValue="false" style="height: 6px" />
          <p class="progress-hint">
            Recommended: Add at least 3 more quizzes to meet course standards.
          </p>
        </div>
      </div>

      <!-- Help Banner -->
      <div class="help-banner">
        <div class="help-content">
          <h4 class="help-title">Need help?</h4>
          <p class="help-desc">Check our guide on how to structure an effective course.</p>
          <Button label="View Guide" outlined class="help-btn" />
        </div>
        <i class="pi pi-graduation-cap help-bg-icon"></i>
      </div>
    </aside>

    <CreateTopicModal
      v-model:visible="isTopicModalVisible"
      :initial-data="editingTopic"
      @save="handleTopicSave"
    />
    <CreateElementModal
      v-model:visible="isElementModalVisible"
      :topic-id="targetTopicId"
      :initial-data="editingElement"
      @save="handleElementSave"
      @go-to-quiz-builder="handleGoToQuizBuilder"
    />
  </div>
</template>

<style scoped>
.content-editor-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .content-editor-layout {
    grid-template-columns: 1fr;
  }
}

/* --- ТУЛБАР --- */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
  margin-bottom: 1.5rem;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toolbar-actions {
  display: flex;
  gap: 0.25rem;
  border-left: 1px solid var(--surface-border);
  padding-left: 1rem;
}

.last-saved {
  color: var(--text-color-muted);
  font-size: 0.875rem;
}

/* --- СПИСОК ТЕМ --- */
.topics-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.topic-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.topic-header {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  background-color: var(--surface-card);
  transition: background-color 0.2s;
}

.topic-header:hover {
  background-color: var(--surface-ground);
}

.drag-handle {
  color: var(--text-color-muted);
  font-size: 1rem;
  cursor: grab;
}

.second-handle {
  margin-left: -8px;
  margin-right: 1rem;
}

.topic-header-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.topic-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
}

.topic-meta {
  font-size: 0.875rem;
  color: var(--text-color-muted);
}

.chevron-icon {
  color: var(--text-color-muted);
  font-size: 1.25rem;
}

/* --- ЭЛЕМЕНТЫ ТЕМЫ --- */
.topic-body {
  border-top: 1px solid var(--surface-border);
  background-color: var(--surface-card);
}

.element-row {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--surface-subtle);
  gap: 1rem;
  position: relative;
}

.element-drag {
  color: var(--surface-border-strong);
  cursor: grab;
}

.element-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.element-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.element-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.95rem;
}

.element-meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.element-meta {
  font-size: 0.875rem;
  color: var(--text-color-muted);
}

.element-actions {
  margin-left: auto;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.element-row:hover .element-actions {
  opacity: 1;
}

.add-element-btn {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: none;
  color: var(--text-color-muted);
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-element-btn:hover {
  background-color: var(--surface-ground);
  color: var(--color-primary);
}

/* --- ADD TOPIC ZONE --- */
.add-topic-zone {
  border: 2px dashed var(--surface-border);
  border-radius: var(--radius-md);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: var(--surface-card);
  transition:
    border-color 0.2s,
    background-color 0.2s;
  cursor: pointer;
}

.add-topic-zone:hover {
  border-color: var(--color-primary-border);
  background-color: var(--color-primary-subtle);
}

.add-topic-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.add-title {
  font-weight: 600;
  color: var(--text-color);
}

.add-desc {
  font-size: 0.875rem;
  color: var(--text-color-muted);
}

/* --- САЙДБАР --- */
.editor-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.card-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
}

.card-subtitle {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--text-color-muted);
  line-height: 1.4;
}

.mb-0 {
  margin-bottom: 0;
}

.quick-add-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.quick-add-item {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: grab;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.quick-add-item:hover {
  border-color: var(--color-primary-border);
  box-shadow: var(--shadow-editor);
}

.quick-add-item i {
  font-size: 1.5rem;
}

.quick-add-item span {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
}

/* Summary List */
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.bg-green-100 {
  background-color: var(--color-success-muted) !important;
}
.text-green-700 {
  color: var(--color-success-text) !important;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-color-muted);
}

.summary-row strong {
  color: var(--text-color);
  font-size: 1rem;
}

.progress-section {
  border-top: 1px solid var(--surface-border);
  padding-top: 1.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

.progress-percent {
  color: var(--color-primary);
  font-weight: 700;
}

.progress-hint {
  font-size: 0.75rem;
  color: var(--text-color-muted);
  margin: 0.75rem 0 0 0;
  line-height: 1.4;
}

/* Help Banner */
.help-banner {
  background: var(--gradient-hero);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  color: var(--color-on-primary);
  position: relative;
  overflow: hidden;
}

.help-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.help-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.help-desc {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.9;
}

.help-btn {
  color: var(--color-on-primary);
  border-color: var(--overlay-on-contrast);
  background: var(--overlay-on-contrast-soft);
}

.help-btn:hover {
  background: var(--overlay-on-contrast-hover);
  border-color: var(--overlay-on-contrast-border);
  color: var(--color-on-primary);
}

.help-bg-icon {
  position: absolute;
  right: -20px;
  bottom: -20px;
  font-size: 8rem;
  opacity: 0.1;
  transform: rotate(-15deg);
  z-index: 1;
}

.topic-actions {
  display: flex;
  align-items: center;
}
.ml-2 {
  margin-left: 0.5rem;
}
</style>
