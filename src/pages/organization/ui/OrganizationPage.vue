<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { OrgTreeBuilder } from '@/widgets/org-tree-builder'
import { OrgUnitDetails } from '@/widgets/org-unit-details'
import { useOrgStore } from '@/entities/organization'
import { useNotifications } from '@/shared/model/useNotifications'
import type { OrgTreeNode } from '@/entities/organization'

const orgStore = useOrgStore()
const notifications = useNotifications()

const selectedNode = ref<OrgTreeNode | null>(null)
const isEditing = ref(false) // Глобальное состояние редактирования

const handleNodeSelect = (node: OrgTreeNode) => {
  selectedNode.value = node
  isEditing.value = false // Сбрасываем режим редактирования при смене узла
}

// Обработчик сохранения изменений из правой панели (Деталей)
const handleSaveDetails = async (updatedNode: OrgTreeNode) => {
  try {
    // 1. Отправляем в стор. Стор сам обновит локальное дерево и отправит PUT-запрос
    await orgStore.updateNode(updatedNode.key, updatedNode);
    
    // 2. Обновляем локально выбранный узел, чтобы правая панель сразу показала новые данные
    selectedNode.value = updatedNode; 
    
    // 3. Выходим из режима редактирования
    isEditing.value = false;
    
    // 4. Показываем красивый Toast
    notifications.showToast('success', 'Hierarchy Updated', `${updatedNode.label} has been updated successfully.`);
  } catch (error) {
    // Если произошла сетевая ошибка, наш apiClient сам покажет Toast 'error'.
    // Здесь мы просто не закрываем режим редактирования (остаемся в форме).
    console.error('Failed to save details:', error);
  }
};

const closePanel = () => {
  selectedNode.value = null
  isEditing.value = false
}
</script>

<template>
  <div class="organization-page">
    <!-- TODO: лишнее -->
    <div class="page-header">
      <h1 class="page-title">Hierarchy Builder</h1>
      <div class="header-actions">
        <button class="icon-btn"><i class="pi pi-moon"></i></button>
        <button class="icon-btn"><i class="pi pi-bell"></i><span class="badge"></span></button>
        <!-- Кнопка изменена на View Logs по новому макету -->
        <Button label="View Logs" icon="pi pi-history" outlined class="btn-logs" />
      </div>
    </div>

    <div class="builder-layout">
      <div class="left-panel">
        <OrgTreeBuilder :isEditing="isEditing" @select-node="handleNodeSelect" />
      </div>

      <div class="right-panel">
        <OrgUnitDetails
          :selectedNode="selectedNode"
          v-model:isEditing="isEditing"
          @save="handleSaveDetails"
          @close="closePanel"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Стили страницы остались теми же... */
.organization-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px);
  overflow: hidden;
  margin: -2rem;
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
.btn-logs {
  color: #475569;
  border-color: #cbd5e1;
} /* Стиль кнопки логов */

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
}
</style>
