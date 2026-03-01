import { defineStore } from "pinia";
import {computed, ref} from "vue";

export const useAuthStore = defineStore("auth", () => {
  const authenticated = ref(false);
  const userRole = ref(null);

  const isAuthenticated = computed(() => authenticated.value);
  const getUserRole = computed(() => userRole.value);

  function login(role) {
    isAuthenticated.value = true;
    userRole.value = role;
  }

  function logout() {
    isAuthenticated.value = false;
    userRole.value = null;
  }

  return {
    isAuthenticated,
    getUserRole,
    login,
    logout,
  };
});
