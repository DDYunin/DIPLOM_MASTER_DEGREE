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
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--surface-border-subtle);
  background-color: var(--surface-ground);
}

.header-icon {
  font-size: 1.25rem;
  color: var(--text-color-muted);
}

.header-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--surface-border-subtle);
  display: flex;
  justify-content: flex-end;
}
</style>
