<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/store/auth";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async() => {
  try {
    loading.value = true;
    error.value = "";

    const role = await fakeApiLogin(username.value, password.value);

    if (role) {
      authStore.login(role);
      router.push({name: `${role}Dashboard`});
    } else {
      error.value = "Неверное имя пользователя или пароль";
    }
  } catch (err) {
    error.value = "Ошибка при авторизации";
    console.error("Login error:", err);
  } finally {
    loading.value = false;
  }
};

const fakeApiLogin = (username, password) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        resolve("Admin");
      } else if (username === "student" && password === "student") {
        resolve("Student");
      } else if (username === "teacher" && password === "teacher") {
        resolve("Teacher");
      } else {
        resolve(null);
      }
    }, 500);
  });
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-header">
        <div class="user-icon">
          <i
            class="pi pi-user"
            style="font-size: 3rem"
          />
        </div>
        <h1>Авторизация</h1>
      </div>

      <form
        class="auth-form"
        @submit.prevent="handleLogin"
      >
        <div
          v-if="error"
          class="error-message"
        >
          <Message severity="error">
            {{ error }}
          </Message>
        </div>

        <div class="input-field">
          <label for="username">Имя пользователя</label>
          <InputText
            id="username"
            v-model="username"
            placeholder="Введите имя пользователя"
            :disabled="loading"
            autocomplete="username"
          />
        </div>

        <div class="input-field">
          <label for="password">Пароль</label>
          <Password
            id="password"
            v-model="password"
            placeholder="Введите пароль"
            toggle-mask
            :disabled="loading"
          />
        </div>

        <Button
          type="submit"
          label="Войти"
          class="login-button"
          :loading="loading"
          :disabled="!username || !password"
        >
          <template #loading>
            <ProgressSpinner style="width: 20px; height: 20px" />
          </template>
        </Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;
}

.auth-box {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.auth-box:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1rem;
}

.auth-header h1 {
  margin: 1rem 0 0;
  color: black;
  font-size: 1.8rem;
}

.user-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: black;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-field label {
  font-weight: 500;
  color: #495057;
}

.login-button {
  margin-top: 1rem;
}

.error-message {
  margin-bottom: 1rem;
}

.divider {
  height: 1px;
  background-color: #dee2e6;
  margin: 1rem 0;
}

/* Адаптивность */
@media (max-width: 480px) {
  .auth-box {
    border-radius: 0;
    box-shadow: none;
  }

  .auth-container {
    padding: 0;
    align-items: flex-start;
    background: white;
  }
}
</style>
