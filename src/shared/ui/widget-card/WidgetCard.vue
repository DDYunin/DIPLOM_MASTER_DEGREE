<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  icon?: string
  // css токен
  iconColorToken?: string
}>()

defineSlots<{
  'header-actions': () => unknown
  default: () => unknown
}>()
</script>

<template>
  <div class="widget-card">
    <!-- Рендерим шапку, только если передан заголовок или есть контент в слоте header-actions -->
    <div v-if="title || $slots['header-actions']" class="card-header">
      <div class="title-block">
        <h3 v-if="title" class="card-title">
          <i v-if="icon" :class="['pi', icon]" class="icon-color"></i>
          {{ title }}
        </h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </div>

      <!-- Слот для кнопок справа в шапке (например "Edit Profile", "Add Permission") -->
      <div v-if="$slots['header-actions']" class="header-actions">
        <slot name="header-actions" />
      </div>
    </div>

    <!-- Основной контент карточки -->
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.widget-card {
  background: var(--surface-card, #ffffff);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--surface-border, #e2e8f0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--surface-border, #f1f5f9);
  padding-bottom: 1rem;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color, #0f172a);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary, #64748b);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-color {
  color: v-bind(iconColorToken);
}

/* На случай отсутствия PrimeVue переменных заданы fallback-значения (#HEX) */
</style>
