<script setup lang="ts">
import Button from 'primevue/button'

const handleImport = () => {
  // Здесь будет логика загрузки файла
  alert('Открытие диалога импорта CSV...')
}
</script>

<template>
  <Button
    label="Import CSV"
    icon="pi pi-file-excel"
    outlined
    class="btn-import"
    @click="handleImport"
  />
</template>

<style scoped>
.btn-import {
  border-color: #cbd5e1;
  color: #475569;
}
</style>
