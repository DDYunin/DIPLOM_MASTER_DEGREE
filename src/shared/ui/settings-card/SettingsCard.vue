<script setup lang="ts">
defineProps<{
  title: string
  icon: string
}>()

defineSlots<{
  default(): unknown
  footer(): unknown
}>()
</script>

<template>
  <section class="settings-card">
    <header class="card-header">
      <i :class="['header-icon', icon]"></i>
      <h2 class="header-title">{{ title }}</h2>
    </header>

    <div class="card-body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<style scoped>
.settings-card {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius-xl);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--p-surface-100);
  background-color: var(--p-surface-50);
}

.header-icon {
  font-size: 1.25rem;
  color: var(--p-text-muted-color);
}

.header-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--p-surface-100);
  display: flex;
  justify-content: flex-end;
}
</style>
