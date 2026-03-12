<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePrimeVue } from 'primevue/config'
import Select from 'primevue/select'

const { locale, getLocaleMessage } = useI18n()
const primevue = usePrimeVue()

const languages = ref([
  { label: 'EN', code: 'en' },
  { label: 'RU', code: 'ru' }
])

// Функция для синхронизации локали PrimeVue
const syncPrimeVueLocale = (langCode: string) => {
  // Получаем весь объект переводов для выбранного языка (ru или en)
  const messages = getLocaleMessage(langCode) as any

  // Если внутри есть ключ primevue, применяем его к конфигурации библиотеки
  if (messages && messages.primevue) {
    primevue.config.locale = messages.primevue
  }
}

// При инициализации компонента сразу задаем правильную локаль PrimeVue
onMounted(() => {
  syncPrimeVueLocale(locale.value)
})

const selectedLang = ref(languages.value.find((l) => l.code === locale.value) || languages.value[0])

// Слушаем изменения селекта
watch(selectedLang, (newVal) => {
  // 1. Меняем язык для наших текстов (vue-i18n)
  if (!newVal) {
    return
  }

  locale.value = newVal.code

  // 2. Сохраняем в localStorage
  localStorage.setItem('app-locale', newVal.code)

  // 3. Синхронизируем язык внутри компонентов PrimeVue (календари, фильтры и т.д.)
  syncPrimeVueLocale(newVal.code)
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
