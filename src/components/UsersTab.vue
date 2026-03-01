<script setup>
import { ref, computed, onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Select from "primevue/select";

const confirm = useConfirm();

// Состояние компонента
const users = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const userDialogVisible = ref(false);
const editMode = ref(false);
const userForm = ref({
  id: null,
  name: "",
  email: "",
  role: { name: "", value: ""},
});

const roles = ref([
  { name: "Администратор", value: "admin" },
  { name: "Менеджер", value: "manager" },
  { name: "Пользователь", value: "user" },
]);

// Загрузка данных
const loadUsers = async() => {
  try {
    loading.value = true;
    /*
     * Здесь должна быть реальная загрузка данных с API
     * Это временные данные для демонстрации
     */
    users.value = Array.from({ length: 50 }, (_, i) => ({id: i + 1,
      name: `Пользователь ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: {
        value: [
          "admin",
          "manager",
          "user",
        ][i % 3],
        name: [
          "Администратор",
          "Менеджер",
          "Пользователь",
        ][i % 3],
      }}));
  } finally {
    loading.value = false;
  }
};

// Фильтрация пользователей
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value;
  }

  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.name.toLowerCase().includes(query));
});

// Работа с пользователями
const showAddUserDialog = () => {
  editMode.value = false;
  userForm.value = {
    id: null,
    name: "",
    email: "",
    role: { name: "", value: ""},
  };
  userDialogVisible.value = true;
};

const editUser = (user) => {
  editMode.value = true;
  userForm.value = { ...user };
  userDialogVisible.value = true;
};

const saveUser = () => {
  if (editMode.value) {
    // Обновление существующего пользователя
    const index = users.value.findIndex(u => u.id === userForm.value.id);
    if (index !== -1) {
      users.value[index] = { ...userForm.value };
    }
  } else {
    // Добавление нового пользователя
    const newUser = {
      ...userForm.value,
      id: users.value.length + 1,
    };
    users.value = [newUser, ...users.value];
  }

  userDialogVisible.value = false;
};

const getRoleName = (roleValue) => roleValue.name;


const confirmDelete = (user) => {
  confirm.require({
    message: `Вы уверены, что хотите удалить пользователя ${user.name}?`,
    header: "Подтверждение удаления",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      users.value = users.value.filter(u => u.id !== user.id);
    },
  });
};

// Инициализация
onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="users-container">
    <div class="users-header">
      <h2>Управление пользователями</h2>
      <div class="search-add-container">
        <InputText
          v-model="searchQuery"
          placeholder="Поиск пользователей..."
          class="search-input"
        />
        <Button
          label="Добавить пользователя"
          icon="pi pi-plus"
          class="add-button"
          @click="showAddUserDialog"
        />
      </div>
    </div>

    <div class="table-wrapper">
      <DataTable
        :value="filteredUsers"
        :scrollable="true"
        scroll-height="500px"
        :virtual-scroller-options="{ itemSize: 50 }"
        class="fixed-height-table"
      >
        <Column
          field="id"
          header="ID"
        />
        <Column
          field="name"
          header="Имя"
        />
        <Column
          field="email"
          header="Email"
        />
        <Column
          field="role"
          header="Роль"
        >
          <template #body="{data}">
            {{ getRoleName(data.role) }}
          </template>
        </Column>
        <Column header="Действия">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-text mr-2"
              @click="editUser(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-text p-button-danger"
              @click="confirmDelete(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Диалог добавления/редактирования пользователя -->
    <Dialog
      v-model:visible="userDialogVisible"
      :header="editMode ? 'Редактирование пользователя' : 'Новый пользователь'"
      :modal="true"
      class="user-dialog"
    >
      <div class="user-form">
        <div class="form-field">
          <label for="name">Имя</label>
          <InputText
            id="name"
            v-model="userForm.name"
          />
        </div>
        <div class="form-field">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="userForm.email"
          />
        </div>
        <div class="form-field">
          <label for="role">Роль</label>
          <Select
            id="role"
            v-model="userForm.role"
            :options="roles"
            option-label="name"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Отмена"
          icon="pi pi-times"
          class="p-button-text"
          @click="userDialogVisible = false"
        />
        <Button
          :label="editMode ? 'Обновить' : 'Создать'"
          icon="pi pi-check"
          autofocus
          @click="saveUser"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.users-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-add-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  width: 300px;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .users-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-add-container {
    width: 100%;
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .add-button {
    width: 100%;
  }
}

.table-wrapper {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
}

.fixed-height-table {
  height: 500px; /* Фиксированная высота */
  display: flex;
  flex-direction: column;
}
</style>
