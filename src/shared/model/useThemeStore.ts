import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { THEME_DARK_CLASS, THEME_STORAGE_KEY } from '@/shared/config/theme'

// Задаем строгие типы. В будущем сюда можно добавить 'system' (системная тема)
export type ThemeMode = 'light' | 'dark'

// В будущем здесь можно будет добавить:
// export type ThemeColor = 'blue' | 'emerald' | 'amber' | 'purple';

export const useThemeStore = defineStore('theme', () => {
  // Читаем сохраненную тему или ставим светлую по умолчанию
  const mode = ref<ThemeMode>((localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'light')

  // Будущий задел под цвета
  // const primaryColor = ref<ThemeColor>('blue');

  // Функция применения темы к DOM
  const applyTheme = (currentMode: ThemeMode) => {
    const html = document.documentElement
    if (currentMode === 'dark') {
      html.classList.add(THEME_DARK_CLASS)
    } else {
      html.classList.remove(THEME_DARK_CLASS)
    }

    // В будущем здесь будет логика применения primaryColor (через updatePreset в PrimeVue 4)
  }

  // Экшен для переключения
  const toggleMode = () => {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  }

  // Реактивно следим за mode.
  // { immediate: true } гарантирует, что тема применится сразу при загрузке приложения!
  watch(
    mode,
    (newMode) => {
      localStorage.setItem(THEME_STORAGE_KEY, newMode)
      applyTheme(newMode)
    },
    { immediate: true }
  )

  return { mode, toggleMode }
})
