<script setup lang="ts">
defineSlots<{
  'header-left'(): unknown
  'header-center'(): unknown
  'header-right'(): unknown
  default(): unknown
}>()
</script>

<template>
  <div class="focus-layout">
    <!-- Header -->
    <header class="focus-header">
      <div class="header-section left">
        <slot name="header-left" />
      </div>
      <div class="header-section center">
        <slot name="header-center" />
      </div>
      <div class="header-section right">
        <slot name="header-right" />
      </div>
    </header>

    <!-- Main Content Workspace -->
    <main class="focus-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.focus-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--p-surface-50);
  overflow: hidden; /* Скролл будет внутри рабочей области, если нужно */
}

.focus-header {
  height: 72px;
  background-color: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  flex-shrink: 0;
  z-index: 10;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.header-section.center {
  justify-content: center;
}

.header-section.right {
  justify-content: flex-end;
}

.focus-main {
  flex-grow: 1;
  overflow-y: auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .focus-header {
    padding: 0 1rem;
  }
  .focus-main {
    padding: 1rem;
  }
  .header-section.center {
    display: none; /* Прячем название курса на мобилках */
  }
}
</style>
