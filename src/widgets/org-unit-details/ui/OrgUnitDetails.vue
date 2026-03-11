<script setup lang="ts">
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import type { OrgTreeNode } from '@/entities/organization/model/types'

defineProps<{ selectedNode: OrgTreeNode | null }>()
defineEmits(['close'])
</script>

<template>
  <div v-if="selectedNode && selectedNode.data" class="details-panel">
    <!-- Шапка панели -->
    <div class="panel-header">
      <div class="icon-box bg-blue"><i class="pi pi-users"></i></div>
      <button class="close-btn" @click="$emit('close')"><i class="pi pi-times"></i></button>
    </div>

    <!-- Заголовок -->
    <div class="node-title-section">
      <h2 class="node-title">{{ selectedNode.label }}</h2>
      <Tag
        v-if="selectedNode.data.status"
        severity="success"
        :value="selectedNode.data.status"
        rounded
        class="status-tag"
      />
    </div>

    <!-- Статистика -->
    <div class="stats-grid">
      <div class="stat-box">
        <span class="stat-value">{{ selectedNode.data.students || 0 }}</span>
        <span class="stat-label">Students</span>
      </div>
      <div class="stat-box">
        <span class="stat-value">{{ selectedNode.data.teachers || 0 }}</span>
        <span class="stat-label">Teachers</span>
      </div>
    </div>

    <!-- Метаданные -->
    <div class="meta-list">
      <div class="meta-item">
        <span class="meta-label">PARENT DEPT</span>
        <span class="meta-value"
          ><i class="pi pi-folder text-gray"></i> {{ selectedNode.data.parentDept }}</span
        >
      </div>

      <div class="meta-item">
        <span class="meta-label">CREATED DATE</span>
        <span class="meta-value">{{ selectedNode.data.createdDate }}</span>
      </div>

      <div class="meta-item" v-if="selectedNode.data.head">
        <span class="meta-label">HEAD OF GROUP</span>
        <span class="meta-value head-value">
          <Avatar
            :label="selectedNode.data.head.avatarInitials"
            shape="circle"
            class="head-avatar"
          />
          {{ selectedNode.data.head.name }}
        </span>
      </div>

      <div class="meta-item">
        <span class="meta-label">DESCRIPTION</span>
        <div class="desc-box">
          {{ selectedNode.data.description }}
        </div>
      </div>
    </div>

    <!-- Действия -->
    <div class="actions-section">
      <span class="actions-title">Quick Actions</span>
      <Button label="Edit Details" icon="pi pi-pencil" outlined class="action-btn" />
      <Button label="Assign Members" icon="pi pi-user-plus" class="action-btn btn-primary" />
    </div>

    <!-- ID в самом низу -->
    <div class="panel-footer" v-if="selectedNode.data.groupId">
      {{ selectedNode.data.groupId }}
    </div>
  </div>

  <div v-else class="empty-panel">
    <i class="pi pi-sitemap empty-icon"></i>
    <p>Select an organization unit to view details.</p>
  </div>
</template>

<style scoped>
.details-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-left: 1px solid #e2e8f0;
  padding: 1.5rem;
  overflow-y: auto;
}
.empty-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-left: 1px solid #e2e8f0;
  color: #94a3b8;
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}
.bg-blue {
  background: #eff6ff;
  color: #3b82f6;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #94a3b8;
  cursor: pointer;
}
.close-btn:hover {
  color: #0f172a;
}

.node-title-section {
  margin-bottom: 2rem;
}
.node-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}
.status-tag {
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-box {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}
.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.meta-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.05em;
}
.meta-value {
  font-size: 0.875rem;
  color: #0f172a;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.text-gray {
  color: #94a3b8;
}
.head-avatar {
  width: 24px;
  height: 24px;
  background: #fed7aa;
  color: #9a3412;
  font-size: 0.75rem;
  font-weight: 700;
}
.desc-box {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
}
.actions-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
}
.action-btn {
  width: 100%;
}
.btn-primary {
  background: #3b82f6;
  border: none;
}

.panel-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
}
</style>
