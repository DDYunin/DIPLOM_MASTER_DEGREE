<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@features/auth/model/authStore";
import LoginForm from "@features/auth/ui/LoginForm.vue";

const authStore = useAuthStore();
const router = useRouter();

// Watcher для отслеживания изменений состояния аутентификации и роли
watch(() => [authStore.isAuthenticated, authStore.role], ([isAuthenticated, role]) => {
  if (isAuthenticated && role) {
    // В зависимости от роли перенаправляем на нужный маршрут
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "student") {
      router.push("/student/dashboard");
    } else if (role === "teacher") {
      router.push("/teacher/dashboard");
    }
  }
}, { immediate: true }); // immediate: true - чтобы проверить состояние сразу при загрузке страницы
</script>

<template>
  <div class="login-page-container">
    <LoginForm />
  </div>
</template>

<style scoped>
.login-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
