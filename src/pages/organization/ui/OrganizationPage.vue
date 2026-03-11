<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { OrgTreeBuilder } from '@/widgets/org-tree-builder'
import { OrgUnitDetails } from '@/widgets/org-unit-details'
import type { OrgTreeNode } from '@/entities/organization'

// Состояние выбранного узла
const selectedNode = ref<OrgTreeNode | null>(null)

const handleNodeSelect = (node: OrgTreeNode) => {
  selectedNode.value = node
}

const handleSaveChanges = () => {
  alert('Hierarchy saved!')
}
</script>

<template>
  <div class="organization-page">
    <!-- Шапка страницы -->


    <!-- Layout с двумя колонками (Grid) -->
    <div class="builder-layout">
      <!-- Левая часть (Дерево) -->
      <div class="left-panel">
        <OrgTreeBuilder @select-node="handleNodeSelect" />
      </div>

      <!-- Правая часть (Детали) -->
      <div class="right-panel">
        <OrgUnitDetails :selectedNode="selectedNode" @close="selectedNode = null" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.organization-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px); /* Вычитаем высоту глобального хедера, если он есть */
  overflow: hidden;
  margin: -2rem; /* Компенсируем padding из AdminLayout для полноэкранного вида */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  flex-shrink: 0;
}
.page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.icon-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
  position: relative;
}
.badge {
  position: absolute;
  top: 0;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
}
.btn-save {
  background: #3b82f6;
  border: none;
}

.builder-layout {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  background: #f8fafc;
}

.left-panel {
  flex-grow: 1;
  overflow: hidden;
}
.right-panel {
  width: 350px;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.3s;
}

/* Адаптив: Скрываем правую панель на планшетах, если ничего не выбрано */
@media (max-width: 1024px) {
  .right-panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    max-width: 350px;
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.05);
    transform: translateX(100%);
    transition: transform 0.3s;
  }
  /* Если нужно показывать на мобилках по клику, тут потребуется добавить класс .is-open */
}
</style>
