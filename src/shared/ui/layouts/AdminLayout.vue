<script setup lang="ts">
defineSlots<{
  default(): unknown
  header(): unknown
  sidebar(): unknown
}>()
</script>

<template>
  <div class="admin-layout">
    <!-- Левая колонка (Sidebar) -->
    <aside class="sidebar-container">
      <slot name="sidebar" />
    </aside>

    <!-- Правая колонка -->
    <main class="main-wrapper">
      <!-- Верхняя панель (Header) -->
      <header class="header-container">
        <slot name="header" />
      </header>

      <!-- Контент страницы -->
      <div class="content-container">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f8fafc;
  overflow: hidden;
  font-family: var(--font-family);
}

.sidebar-container {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.main-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-container {
  height: 72px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
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
