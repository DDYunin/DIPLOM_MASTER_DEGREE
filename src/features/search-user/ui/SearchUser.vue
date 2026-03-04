<script setup lang="ts">
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

// Двухстороннее связывание строки поиска
const searchQuery = defineModel<string>({ default: '' })
</script>

<template>
  <IconField iconPosition="left">
    <InputIcon class="pi pi-search" />
    <InputText v-model="searchQuery" placeholder="Search by name, email..." class="search-input" />
  </IconField>
</template>

<style scoped>
.search-input {
  width: 280px;
  border-radius: 8px;
}
</style>
