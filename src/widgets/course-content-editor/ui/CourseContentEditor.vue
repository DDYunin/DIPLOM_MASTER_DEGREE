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
  isElementModalVisible.value = true
}

const handleElementCreate = (data: any) => {
  // Добавляем элемент в локальный стор (можешь добавить этот экшен в useCourseContentStore)
  const topic = contentStore.topics.find((t) => t.id === data.topicId)
  if (topic) {
    topic.elements.push({
      id: `el-${Date.now()}`,
      type: data.type,
      title: data.title,
      meta: data.meta
    })
  }
}

const handleGoToQuizBuilder = (topicId: string) => {
  // Перенаправляем на страницу Quiz Builder, передавая ID курса из URL
  const courseId = route.params.id as string
  router.push({
    name: 'teacher-quiz-builder',
    params: { id: courseId },
    query: { topicId } // Передаем topicId через query, чтобы строитель знал, куда прикрепить тест
  })
}

// Хелперы для рендера иконок и цветов в зависимости от типа элемента
const getElementConfig = (type: ElementType) => {
  switch (type) {
    case 'video':
      return {
        icon: 'pi-play-circle',
        color: 'var(--p-blue-500)',
        bg: 'var(--p-blue-50)',
        badge: 'VIDEO'
      }
    case 'file':
      return {
        icon: 'pi-file',
        color: 'var(--p-orange-500)',
        bg: 'var(--p-orange-50)',
        badge: 'PDF'
      }
    case 'quiz':
      return {
        icon: 'pi-question-circle',
        color: 'var(--p-purple-500)',
        bg: 'var(--p-purple-50)',
        badge: 'QUIZ'
      }
    case 'assignment':
      return {
        icon: 'pi-clipboard',
        color: 'var(--p-green-500)',
        bg: 'var(--p-green-50)',
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
          <Button label="Add New Topic" icon="pi pi-plus" @click="isTopicModalVisible = true" />
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
            </div>

            <!-- Кнопка добавления элемента внутрь темы -->
            <button class="add-element-btn" @click="openAddElement(topic.id)">
              <i class="pi pi-plus"></i> Add Element to {{ topic.title }}
            </button>
          </div>
        </div>

        <!-- Зона добавления новой темы -->
        <div class="add-topic-zone" @click="isTopicModalVisible = true">
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
            <i class="pi pi-play-circle" style="color: var(--p-blue-500)"></i>
            <span>Video</span>
          </div>
          <div class="quick-add-item">
            <i class="pi pi-question-circle" style="color: var(--p-purple-500)"></i>
            <span>Quiz</span>
          </div>
          <div class="quick-add-item">
            <i class="pi pi-file" style="color: var(--p-orange-500)"></i>
            <span>File/Reading</span>
          </div>
          <div class="quick-add-item">
            <i class="pi pi-clipboard" style="color: var(--p-green-500)"></i>
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
      @create="handleElementCreate"
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
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
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
  border-left: 1px solid var(--p-surface-200);
  padding-left: 1rem;
}

.last-saved {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

/* --- СПИСОК ТЕМ --- */
.topics-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.topic-card {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  overflow: hidden;
}

.topic-header {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  background-color: var(--p-surface-0);
  transition: background-color 0.2s;
}

.topic-header:hover {
  background-color: var(--p-surface-50);
}

.drag-handle {
  color: var(--p-text-muted-color);
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
  color: var(--p-text-color);
}

.topic-meta {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.chevron-icon {
  color: var(--p-text-muted-color);
  font-size: 1.25rem;
}

/* --- ЭЛЕМЕНТЫ ТЕМЫ --- */
.topic-body {
  border-top: 1px solid var(--p-surface-200);
  background-color: var(--p-surface-0);
}

.element-row {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--p-surface-100);
  gap: 1rem;
}

.element-drag {
  color: var(--p-surface-300);
  cursor: grab;
}

.element-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--p-border-radius);
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
  color: var(--p-text-color);
  font-size: 0.95rem;
}

.element-meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.element-meta {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.add-element-btn {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: none;
  color: var(--p-text-muted-color);
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
  background-color: var(--p-surface-50);
  color: var(--p-primary-500);
}

/* --- ADD TOPIC ZONE --- */
.add-topic-zone {
  border: 2px dashed var(--p-surface-200);
  border-radius: var(--p-border-radius);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: var(--p-surface-0);
  transition:
    border-color 0.2s,
    background-color 0.2s;
  cursor: pointer;
}

.add-topic-zone:hover {
  border-color: var(--p-primary-300);
  background-color: var(--p-primary-50);
}

.add-topic-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.add-title {
  font-weight: 600;
  color: var(--p-text-color);
}

.add-desc {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

/* --- САЙДБАР --- */
.editor-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  padding: 1.5rem;
}

.card-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.card-subtitle {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
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
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
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
  border-color: var(--p-primary-300);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.quick-add-item i {
  font-size: 1.5rem;
}

.quick-add-item span {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--p-text-color);
}

/* Summary List */
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.bg-green-100 {
  background-color: var(--p-green-100) !important;
}
.text-green-700 {
  color: var(--p-green-700) !important;
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
  color: var(--p-text-muted-color);
}

.summary-row strong {
  color: var(--p-text-color);
  font-size: 1rem;
}

.progress-section {
  border-top: 1px solid var(--p-surface-200);
  padding-top: 1.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: var(--p-text-color);
  font-weight: 500;
}

.progress-percent {
  color: var(--p-primary-500);
  font-weight: 700;
}

.progress-hint {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  margin: 0.75rem 0 0 0;
  line-height: 1.4;
}

/* Help Banner */
.help-banner {
  background: linear-gradient(135deg, var(--p-blue-600) 0%, var(--p-indigo-700) 100%);
  border-radius: var(--p-border-radius);
  padding: 1.5rem;
  color: white;
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
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.help-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
  color: white;
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
