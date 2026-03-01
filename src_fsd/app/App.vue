<script setup lang="ts">
/*
 * Здесь можно было бы инициализировать AuthStore, если бы не было immediate: true в watch в LoginPage
 * import { useAuthStore } from 'features/user-auth/model/authStore';
 * const authStore = useAuthStore();
 * authStore.initializeAuth(); // Если бы была такая функция для восстановления сессии
 */

// Если нужен какой-то глобальный UI, то его можно разместить здесь
</script>

<template>
  <div id="app">
    <!-- Здесь будет отображаться текущая страница, соответствующая маршруту -->
    <RouterView />
  </div>
</template>

<style>
/* Здесь могут быть глобальные стили, которые применяются ко всему приложению */
/* Например, сброс стилей, базовые шрифты, цвета */

/* Пример базовых стилей для всего приложения */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
