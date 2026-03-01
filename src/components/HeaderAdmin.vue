<script setup>
import Avatar from "primevue/avatar";
import Button from "primevue/button";

const emit = defineEmits(["logout"]);

const handleLogout = () => {
  emit("logout");
};
</script>

<template>
  <header class="header-container">
    <div class="header-content">
      <!-- Круглая иконка слева -->
      <div class="header-icon">
        <Avatar
          icon="pi pi-user"
          shape="circle"
          size="large"
          aria-label="User icon"
        />
      </div>

      <!-- Кнопка Выйти справа -->
      <div class="header-actions">
        <Button
          label="Выйти"
          icon="pi pi-sign-out"
          severity="danger"
          @click="handleLogout"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  width: 100%;
  background-color: lightblue;
  padding: 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-icon {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 1rem;
}
</style>
