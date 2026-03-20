<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'

import { LanguageSwitcher } from '@/features/change-language'
import { ThemeToggler } from '@/features/toggle-theme';

const { t } = useI18n()
</script>

<template>
  <div class="header-content">
    <div class="header-actions">
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search" />
        <InputText :placeholder="t('common.search')" class="global-search" />
      </IconField>
      <LanguageSwitcher />
      <ThemeToggler />
      <Button icon="pi pi-bell" text rounded class="icon-btn" />
      <Button icon="pi pi-question-circle" text rounded class="icon-btn" />
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
.global-search {
  width: 300px;
  border-radius: 20px;
  background: #f8fafc;
  border: none;
}
.icon-btn {
  color: #64748b;
}

@media (max-width: 768px) {
  .global-search {
    width: 200px;
  }
}
</style>
