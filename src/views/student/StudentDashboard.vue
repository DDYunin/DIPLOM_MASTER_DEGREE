<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Avatar from "primevue/avatar";
import Button from "primevue/button";

const route = useRoute();

const currentRouteTitle = computed(() => route.meta.title || "Студенческий портал");
</script>

<template>
  <div class="student-dashboard">
    <!-- Боковое меню -->
    <div class="sidebar">
      <div class="logo">
        Учебный портал
      </div>
      <nav>
        <router-link
          :to="{ name: 'StudentHome' }"
          active-class="active"
          exact
        >
          <i class="pi pi-home" /> Главная
        </router-link>
        <router-link
          :to="{ name: 'StudentProfile' }"
          active-class="active"
        >
          <i class="pi pi-user" /> Профиль
        </router-link>
      </nav>
    </div>

    <!-- Основное содержимое -->
    <div class="main-content">
      <header class="header">
        <h2>{{ currentRouteTitle }}</h2>
        <div class="user-controls">
          <Button
            icon="pi pi-bell"
            class="p-button-text"
          />
          <Avatar
            icon="pi pi-user"
            shape="circle"
          />
        </div>
      </header>

      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.student-dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 1rem;
}

.sidebar .logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  padding: 0.5rem;
}

.sidebar nav a {
  display: block;
  color: #ecf0f1;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s;
}

.sidebar nav a:hover {
  background: #34495e;
}

.sidebar nav a.active {
  background: #3498db;
  color: white;
}

.sidebar nav i {
  margin-right: 0.5rem;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content {
  flex: 1;
  padding: 2rem;
  background: #f8f9fa;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
