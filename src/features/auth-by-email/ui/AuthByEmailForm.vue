<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useSessionStore } from '@/entities/session/model/store'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)

const sessionStore = useSessionStore()

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    return
  }
  
  try {
    isLoading.value = true
    await sessionStore.login(email.value, password.value, rememberMe.value)
    // Успех! Здесь обычно делается router.push('/dashboard')
    alert('Успешная авторизация!')
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <div class="header">
      <div class="logo-box">
        <!-- Иконка шапочки выпускника (нужен пакет primeicons) -->
        <i class="pi pi-graduation-cap logo-icon"></i>
      </div>
      <h1 class="title">Sign in to your account</h1>
      <a href="#" class="subtitle-link">Access the student & faculty portal</a>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="field">
        <label for="email">Email Address</label>
        <InputText 
          id="email" 
          v-model="email" 
          placeholder="student@university.edu" 
          class="w-full"
        />
      </div>

      <div class="field">
        <div class="password-header">
          <label for="password">Password</label>
          <a href="#" class="forgot-link">Forgot password?</a>
        </div>
        <!-- :feedback="false" убирает индикатор сложности пароля -->
        <!-- toggleMask добавляет иконку глазика -->
        <Password 
          id="password" 
          v-model="password" 
          :feedback="false" 
          toggleMask 
          placeholder="••••••••"
          inputClass="w-full"
          class="w-full"
        />
      </div>

      <div class="field-checkbox">
        <Checkbox v-model="rememberMe" inputId="remember" binary />
        <label for="remember" class="remember-label">Remember me for 30 days</label>
      </div>

      <Button 
        type="submit" 
        label="Sign In" 
        class="submit-btn" 
        :loading="isLoading"
      />
    </form>
  </div>
</template>

<style scoped>
.auth-card {
  background: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  /* Синяя полоска снизу, как на макете */
  border-bottom: 4px solid var(--p-primary-color);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-box {
  background-color: #e0e7ff; /* Светло-синий фон */
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
}

.logo-icon {
  font-size: 1.5rem;
  color: var(--p-primary-color);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.subtitle-link {
  font-size: 0.875rem;
  color: var(--p-primary-color);
  text-decoration: none;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 0.875rem;
  color: var(--p-primary-color);
  text-decoration: none;
  font-weight: 500;
}

.field-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.remember-label {
  font-size: 0.875rem;
  font-weight: 400;
  color: #475569;
  cursor: pointer;
}

.submit-btn {
  margin-top: 0.5rem;
  width: 100%;
  font-weight: 600;
}

/* Утилиты PrimeVue, если не подключен PrimeFlex/Tailwind */
.w-full {
  width: 100%;
}

/* Глобальный фикс для компонента Password, чтобы input занимал всю ширину */
:deep(.p-password-input) {
  width: 100%;
}
</style>