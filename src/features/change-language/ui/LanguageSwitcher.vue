<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'

const { locale } = useI18n()

const languages = ref([
  { label: 'EN', code: 'en' },
  { label: 'RU', code: 'ru' }
])

const selectedLang = ref(languages.value.find((l) => l.code === locale.value) || languages.value[0])

// При изменении селекта меняем локаль и сохраняем в localStorage
watch(selectedLang, (newVal) => {
  if (!newVal) {
    return
  }
  locale.value = newVal.code
  localStorage.setItem('app-locale', newVal.code)
  // Здесь позже добавим смену локали и для PrimeVue компонентов (календари и т.д.)
})
</script>

<template>
  <Select v-model="selectedLang" :options="languages" optionLabel="label" class="lang-switcher">
    <!-- Кастомное отображение выбранного значения (чтобы было компактно) -->
    <template #value="slotProps">
      <div v-if="slotProps.value" class="lang-value">
        <i class="pi pi-globe"></i>
        <span>{{ slotProps.value.label }}</span>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.lang-switcher {
  width: auto;
  min-width: 80px;
  background: transparent;
  border: none;
  box-shadow: none;
}
.lang-switcher:hover {
  background: #f8fafc;
  border-radius: 8px;
}
:deep(.p-select-label) {
  padding: 0.5rem;
}
.lang-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
}
</style>
