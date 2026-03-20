<script setup lang="ts">
import Button from 'primevue/button'

import { LanguageSwitcher } from '@/features/change-language'
import { ThemeToggler } from '@/features/toggle-theme'
</script>

<template>
  <div class="header-content">
    <div class="header-actions">
      <LanguageSwitcher />
      <ThemeToggler />
      <Button icon="pi pi-bell" text rounded class="icon-btn" />
    </div>
  </div>
</template>

<style scoped>
.header-content {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  color: #64748b;
}
</style>
