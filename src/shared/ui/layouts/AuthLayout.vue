<script setup lang="ts">
</script>

<template>
  <div class="auth-layout">
    <div class="auth-container">
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
  background-color: var(--surface-ground);
  font-family: var(--font-family);
}

.auth-container {
  width: 100%;
  max-width: 420px;
  padding: 1rem;
}
</style>
