<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@features/auth/model/authStore";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Message from "primevue/message";

const authStore = useAuthStore();

const username = ref("");
const password = ref("");

const handleSubmit = async() => {
  const success = await authStore.login({ username: username.value, password: password.value });
  if (success) {
    // Авторизация успешна, страница LoginPage.vue сама перенаправит
  } else {
    // Ошибка будет отображена через authStore.error в LoginPage или здесь через Message
  }
};
</script>

<template>
  <!-- p-card, p-4, p-fluid, mt-3, mt-4, text-center, text-color-secondary, list-none, p-0, m-0, font-bold - это классы PrimeFlex -->
  <div class="card p-4 login-form-container">
    <!-- card - это просто стилизованный div в PrimeVue/PrimeFlex -->
    <div class="p-fluid">
      <div class="field">
        <label for="username">Имя пользователя</label>
        <InputText
          id="username"
          v-model="username"
          type="text"
          aria-describedby="username-help"
          :class="{ 'p-invalid': authStore.error }"
        />
      </div>

      <div class="field">
        <label for="password">Пароль</label>
        <Password
          id="password"
          v-model="password"
          toggle-mask
          :feedback="false"
          :class="{ 'p-invalid': authStore.error }"
        />
      </div>

      <Message
        v-if="authStore.error"
        severity="error"
      >
        {{ authStore.error }}
      </Message>

      <Button
        label="Войти"
        icon="pi pi-sign-in"
        :loading="authStore.isLoading"
        :disabled="authStore.isLoading"
        class="mt-3"
        @click="handleSubmit"
      />
    </div>

    <div class="mt-4 text-center">
      <p class="text-color-secondary">
        Используйте для теста:
      </p>
      <ul class="list-none p-0 m-0">
        <li>
          <span class="font-bold">admin</span> / password (роль: администратор)
        </li>
        <li>
          <span class="font-bold">student</span> / password (роль: студент)
        </li>
        <li>
          <span class="font-bold">teacher</span> / password (роль: преподаватель)
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Стиль для контейнера формы, чтобы ограничить ширину и центрировать */
.login-form-container {
  max-width: 400px;
  width: 100%;
  /* PrimeFlex классы p-card и p-4 уже добавят стили PrimeVue:
     background-color, border-radius, box-shadow и padding.
     Мы просто задаем max-width. */
}

/* Стандартные PrimeVue классы для полей формы */
.field {
  margin-bottom: 1.5rem; /* Отступ между полями */
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
</style>
