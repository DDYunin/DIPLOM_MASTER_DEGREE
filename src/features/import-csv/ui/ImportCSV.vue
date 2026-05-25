<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const { t } = useI18n()

const handleImport = () => {
  alert('Открытие диалога импорта CSV...')
}
</script>

<template>
  <Button
    :label="t('importCsv.label')"
    icon="pi pi-file-excel"
    outlined
    class="btn-import"
    @click="handleImport"
  />
</template>

<style scoped>
.btn-import {
  border-color: var(--surface-border);
  color: var(--text-color-muted);
}
</style>
