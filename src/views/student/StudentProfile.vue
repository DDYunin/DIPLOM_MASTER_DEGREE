<script setup>
import { ref } from "vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Select from "primevue/select";
import ToggleButton from "primevue/togglebutton";
import Dialog from "primevue/dialog";
import FileUpload from "primevue/fileupload";
import Password from "primevue/password";
import { useToast } from "primevue/usetoast";

const toast = useToast();

// Данные пользователя
const user = ref({
  avatar: "",
  lastName: "Иванов",
  firstName: "Иван",
  middleName: "Иванович",
  email: "student@university.ru",
  group: "ИТ-101",
});

// Настройки
const selectedLanguage = ref({ name: "Русский", code: "ru" });
const languages = ref([
  { name: "Русский", code: "ru" },
  { name: "Английский", code: "en" },
  { name: "Немецкий", code: "de" },
]);

const notificationsEnabled = ref(true);
const darkThemeEnabled = ref(false);

// Диалоги
const avatarDialogVisible = ref(false);
const passwordDialogVisible = ref(false);
const selectedFile = ref(null);

// Пароли
const currentPassword = ref("");
const newPassword = ref("");
const repeatPassword = ref("");

// Методы
const showAvatarDialog = () => {
  avatarDialogVisible.value = true;
};

const showPasswordDialog = () => {
  passwordDialogVisible.value = true;
};

const onAvatarSelect = (event) => {
  selectedFile.value = event.files[0];
};

const uploadAvatar = () => {
  if (selectedFile.value) {
    // Здесь должна быть логика загрузки на сервер
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.avatar = e.target.result;
      toast.add({
        severity: "success",
        summary: "Аватар обновлен",
        life: 3000,
      });
    };
    reader.readAsDataURL(selectedFile.value);
  }
  avatarDialogVisible.value = false;
};

const changePassword = () => {
  if (newPassword.value !== repeatPassword.value) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пароли не совпадают",
      life: 3000,
    });
    return;
  }

  // Здесь должна быть логика смены пароля
  toast.add({
    severity: "success",
    summary: "Пароль изменен",
    life: 3000,
  });
  passwordDialogVisible.value = false;
};

const saveProfile = () => {
  // Логика сохранения профиля
  toast.add({
    severity: "success",
    summary: "Профиль сохранен",
    life: 3000,
  });
};

const toggleTheme = () => {
  document.body.classList.toggle("dark-theme", darkThemeEnabled.value);
};
</script>


<template>
  <div class="student-profile">
    <Card>
      <template #title>
        Профиль студента
      </template>
      <template #content>
        <div class="profile-container">
          <!-- Блок с основной информацией -->
          <div class="profile-info">
            <div class="avatar-container">
              <img
                :src="user.avatar || 'https://via.placeholder.com/150'"
                alt="Фото студента"
                class="avatar"
              >
              <Button
                icon="pi pi-camera"
                class="p-button-rounded p-button-text avatar-edit-btn"
                @click="showAvatarDialog"
              />
            </div>

            <div class="fields">
              <div class="field">
                <label>Фамилия</label>
                <InputText v-model="user.lastName" />
              </div>

              <div class="field">
                <label>Имя</label>
                <InputText v-model="user.firstName" />
              </div>

              <div class="field">
                <label>Отчество</label>
                <InputText v-model="user.middleName" />
              </div>

              <div class="field">
                <label>Почта</label>
                <InputText
                  v-model="user.email"
                  disabled
                />
              </div>

              <div class="field">
                <label>Номер группы</label>
                <InputText v-model="user.group" />
              </div>

              <Button
                label="Сменить пароль"
                icon="pi pi-key"
                class="p-button-text"
                @click="showPasswordDialog"
              />
            </div>
          </div>

          <!-- Блок с настройками -->
          <Divider>
            <span class="p-tag">Настройки</span>
          </Divider>

          <div class="settings">
            <div class="setting-item">
              <label>Язык интерфейса</label>
              <Select
                v-model="selectedLanguage"
                :options="languages"
                option-label="name"
                class="setting-control"
              />
            </div>

            <div class="setting-item">
              <label>Уведомления</label>
              <ToggleButton
                v-model="notificationsEnabled"
                on-label="Вкл"
                off-label="Выкл"
                on-icon="pi pi-check"
                off-icon="pi pi-times"
                class="setting-control"
              />
            </div>

            <div class="setting-item">
              <label>Темная тема</label>
              <ToggleButton
                v-model="darkThemeEnabled"
                on-label="Вкл"
                off-label="Выкл"
                on-icon="pi pi-moon"
                off-icon="pi pi-sun"
                class="setting-control"
                @change="toggleTheme"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <Button
          label="Сохранить изменения"
          icon="pi pi-save"
          @click="saveProfile"
        />
      </template>
    </Card>

    <!-- Диалог смены аватара -->
    <Dialog
      v-model:visible="avatarDialogVisible"
      header="Смена аватара"
      :modal="true"
    >
      <FileUpload
        mode="basic"
        accept="image/*"
        :max-file-size="2000000"
        choose-label="Выбрать фото"
        @select="onAvatarSelect"
      />
      <template #footer>
        <Button
          label="Отмена"
          @click="avatarDialogVisible = false"
        />
        <Button
          label="Сохранить"
          @click="uploadAvatar"
        />
      </template>
    </Dialog>

    <!-- Диалог смены пароля -->
    <Dialog
      v-model:visible="passwordDialogVisible"
      header="Смена пароля"
      :modal="true"
    >
      <div class="password-fields">
        <div class="field">
          <label>Текущий пароль</label>
          <Password
            v-model="currentPassword"
            toggle-mask
          />
        </div>
        <div class="field">
          <label>Новый пароль</label>
          <Password
            v-model="newPassword"
            toggle-mask
          />
        </div>
        <div class="field">
          <label>Повторите пароль</label>
          <Password
            v-model="repeatPassword"
            toggle-mask
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Отмена"
          @click="passwordDialogVisible = false"
        />
        <Button
          label="Изменить"
          @click="changePassword"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.student-profile {
  max-width: 800px;
  margin: 0 auto;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-info {
  display: flex;
  gap: 2rem;
}

.avatar-container {
  position: relative;
  width: 150px;
  height: 200px;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8) !important;
}

.fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-control {
  width: auto;
}

.password-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 600px) {
  .profile-info {
    flex-direction: column;
  }

  .avatar-container {
    align-self: center;
  }
}
</style>
