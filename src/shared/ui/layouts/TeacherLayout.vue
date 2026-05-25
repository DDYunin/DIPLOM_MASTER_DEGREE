<script setup lang="ts">
defineProps<{
  isCollapsed?: boolean
}>()

defineSlots<{
  default(): unknown
  header(): unknown
  sidebar(): unknown
}>()
</script>

<template>
  <div class="teacher-layout">
    <!-- Левая колонка (Sidebar) реагирует на isCollapsed -->
    <aside class="sidebar-container" :class="{ 'sidebar-collapsed': isCollapsed }">
      <slot name="sidebar" />
    </aside>

    <main class="main-wrapper">
      <header class="header-container">
        <slot name="header" />
      </header>

      <div class="content-container">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.teacher-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--surface-ground);
  overflow: hidden;
  font-family: var(--font-family);
}

.sidebar-container {
  width: 260px;
  background-color: var(--surface-elevated);
  border-right: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease; /* Плавное сворачивание */
}

.sidebar-collapsed {
  width: 80px; /* Ширина свернутого сайдбара */
}

.main-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-container {
  height: 72px;
  background-color: var(--surface-elevated);
  border-bottom: 1px solid var(--surface-border);
  display: flex;
  align-items: center;
  padding: 0 2rem;
  flex-shrink: 0;
}

.content-container {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
