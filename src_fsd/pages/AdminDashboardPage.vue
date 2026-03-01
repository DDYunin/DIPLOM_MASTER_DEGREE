<script setup lang="ts">
import { useAuthStore } from "@features/auth/model/authStore";
import Button from "primevue/button";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="dashboard-container">
    <div class="card p-4">
      <h1>Админ-панель</h1>
      <p>Добро пожаловать, {{ authStore.user?.name || 'Администратор' }}!</p>
      <p>Ваша роль: <span class="font-bold">{{ authStore.role }}</span></p>
      <Button
        label="Выйти"
        icon="pi pi-sign-out"
        class="mt-3"
        @click="handleLogout"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.card {
  text-align: center;
}
h1 {
  margin-bottom: 1rem;
}
p {
  margin-bottom: 0.5rem;
}
</style>
