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
  <div class="student-layout">
    <!-- Левая колонка (Sidebar) -->
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
.student-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--p-surface-50);
  overflow: hidden;
  font-family: var(--font-family);
}

.sidebar-container {
  width: 260px;
  background-color: var(--p-surface-0);
  border-right: 1px solid var(--p-surface-200);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
}

.sidebar-collapsed {
  width: 80px;
}

.main-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-container {
  height: 72px;
  background-color: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
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
