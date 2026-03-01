<script setup lang="ts">
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter();

const goToHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="not-found-container">
    <div class="card p-4 text-center">
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>К сожалению, запрашиваемая страница не существует.</p>
      <Button
        label="На главную"
        icon="pi pi-home"
        class="mt-3"
        @click="goToHome"
      />
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.card {
  text-align: center;
}
h1 {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}
h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
p {
  margin-bottom: 1.5rem;
}
</style>
