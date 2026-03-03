<script setup lang="ts">
// Макет отвечает только за расположение блоков (центрирование, подвал, фон)
</script>

<template>
  <div class="auth-layout">
    <div class="auth-container">
      <!-- Место для карточки формы -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc; /* Светло-серый фон из макета */
  font-family: var(--font-family); /* Из PrimeVue */
}

.auth-container {
  width: 100%;
  max-width: 420px;
  padding: 1rem;
}
</style>
