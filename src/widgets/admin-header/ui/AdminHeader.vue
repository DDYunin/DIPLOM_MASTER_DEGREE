<script setup lang="ts">
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
</script>

<template>
  <div class="header-content">
    <h2 class="header-title">User Management</h2>
    <div class="header-actions">
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search" />
        <InputText placeholder="Search everywhere..." class="global-search" />
      </IconField>
      <Button icon="pi pi-bell" text rounded class="icon-btn" />
      <Button icon="pi pi-question-circle" text rounded class="icon-btn" />
    </div>
  </div>
</template>

<style scoped>
.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.global-search {
  width: 300px;
  border-radius: 20px;
  background: #f8fafc;
  border: none;
}
.icon-btn {
  color: #64748b;
}
</style>
