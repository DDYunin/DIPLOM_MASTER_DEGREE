<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const { t } = useI18n()

const searchQuery = defineModel<string>({ default: '' })
</script>

<template>
  <IconField iconPosition="left">
    <InputIcon class="pi pi-search" />
    <InputText
      v-model="searchQuery"
      :placeholder="t('searchUser.placeholder')"
      class="search-input"
    />
  </IconField>
</template>

<style scoped>
.search-input {
  width: 280px;
  border-radius: 8px;
}
</style>
