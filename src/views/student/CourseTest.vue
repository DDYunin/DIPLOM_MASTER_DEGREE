<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "primevue/breadcrumb";
import Card from "primevue/card";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Навигационные элементы
const breadcrumbHome = ref({
  icon: "pi pi-home",
  to: "/student",
});

const breadcrumbItems = ref([
  { label: "Курсы", to: "/student" }, { label: "Тест", to: "" },
]);

// Данные теста
const test = ref({
  id: null,
  title: "Загрузка...",
  description: "",
  startDate: null,
  endDate: null,
  duration: 0,
  maxAttempts: 0,
  attemptsUsed: 0,
  status: "Доступен",
});

const instructionVisible = ref(false);

// Загрузка данных теста
onMounted(() => {
  loadTestData(route.params.testId);
});

const loadTestData = (testId) => {
  // Имитация загрузки данных с API
  setTimeout(() => {
    test.value = {
      id: testId,
      title: "Тест по основам программирования",
      description: "Этот тест проверяет ваши знания основных концепций программирования, включая переменные, условные операторы и циклы.",
      startDate: new Date(2025, 4, 15),
      endDate: new Date(2025, 5, 15),
      duration: 45,
      maxAttempts: 3,
      attemptsUsed: 1,
      status: "Доступен",
    };

    // Обновляем хлебные крошки
    breadcrumbItems.value = [
      { label: "Курсы", to: "/student" },
      { label: `Курс ${route.params.courseId}`, to: `/student/course/${route.params.courseId}` },
      { label: test.value.title, to: "" },
    ];
  }, 300);
};

// Проверка возможности начать тест
const canStartTest = computed(() => {
  const now = new Date();
  return (
    test.value.status === "Доступен" &&
    now >= new Date(test.value.startDate) &&
    now <= new Date(test.value.endDate) &&
    test.value.attemptsUsed < test.value.maxAttempts
  );
});

// Форматирование даты
const formatDate = (date) => {
  if (!date) {
    return "Не указано";
  }
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Определение цвета статуса
const getStatusSeverity = (status) => {
  switch (status) {
    case "Доступен": return "success";
    case "Завершен": return "info";
    case "Недоступен": return "warning";
    default: return "danger";
  }
};

// Навигация
const navigateToCourse = () => {
  router.push({ name: "StudentCourse", params: { id: route.params.courseId } });
};

const startTest = () => {
  toast.add({
    severity: "info",
    summary: "Тест начат",
    detail: "Удачи в прохождении теста!",
    life: 3000,
  });
  router.push({ name: "TestExecution", params: { testId: test.value.id } });
};

const openInstruction = () => {
  instructionVisible.value = true;
};
</script>

<template>
  <div class="course-test">
    <!-- Хлебные крошки -->
    <Breadcrumb
      :home="breadcrumbHome"
      :model="breadcrumbItems"
    />

    <!-- Основная информация о тесте -->
    <Card class="test-card">
      <template #title>
        <div class="test-header">
          <h1>{{ test.title }}</h1>
          <Tag
            :value="test.status"
            :severity="getStatusSeverity(test.status)"
          />
        </div>
      </template>

      <template #content>
        <div class="test-info">
          <!-- Описание теста -->
          <div class="info-section">
            <h3><i class="pi pi-info-circle" /> Описание</h3>
            <p>{{ test.description }}</p>
          </div>

          <!-- Даты доступности -->
          <div class="info-section">
            <h3><i class="pi pi-calendar" /> Доступность</h3>
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label">Начало:</span>
                <span class="info-value">{{ formatDate(test.startDate) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Окончание:</span>
                <span class="info-value">{{ formatDate(test.endDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Условия прохождения -->
          <div class="info-section">
            <h3><i class="pi pi-clock" /> Условия прохождения</h3>
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label">Время на выполнение:</span>
                <span class="info-value">{{ test.duration }} минут</span>
              </div>
              <div class="info-row">
                <span class="info-label">Попытки:</span>
                <span class="info-value">
                  {{ test.attemptsUsed }} из {{ test.maxAttempts }} использовано
                </span>
              </div>
            </div>
          </div>

          <!-- Инструкция -->
          <div class="info-section">
            <h3><i class="pi pi-book" /> Инструкция</h3>
            <p>
              Перед началом теста рекомендуем ознакомиться с
              <a
                href="#"
                @click.prevent="openInstruction"
              >инструкцией по прохождению тестов</a>.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="test-actions">
          <Button
            label="Назад к курсу"
            icon="pi pi-arrow-left"
            class="p-button-text"
            @click="navigateToCourse"
          />
          <Button
            label="Начать тест"
            icon="pi pi-play"
            :disabled="!canStartTest"
            @click="startTest"
          />
        </div>
      </template>
    </Card>

    <!-- Диалог с инструкцией -->
    <Dialog
      v-model:visible="instructionVisible"
      header="Инструкция по прохождению тестов"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <div class="instruction-content">
        <h3>Как проходить тесты в системе:</h3>
        <ol>
          <li>Убедитесь, что у вас стабильное интернет-соединение</li>
          <li>Время будет отсчитываться сразу после нажатия "Начать тест"</li>
          <li>По истечении времени тест автоматически завершится</li>
          <li>Результаты будут доступны сразу после завершения теста</li>
        </ol>
      </div>
      <template #footer>
        <Button
          label="Закрыть"
          @click="instructionVisible = false"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.course-test {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

.test-card {
  margin-top: 1rem;
}

.test-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.test-header h1 {
  margin: 0;
}

.test-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  padding: 1rem;
  border-radius: 6px;
  background: #f8f9fa;
}

.info-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0;
  color: black;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.info-label {
  font-weight: 500;
}

.info-value {
  font-weight: 600;
}

.test-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.instruction-content {
  line-height: 1.6;
}

.instruction-content ol {
  padding-left: 1.5rem;
}

.instruction-content li {
  margin-bottom: 0.5rem;
}

@media (max-width: 600px) {
  .test-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .test-actions {
    flex-direction: column-reverse;
    gap: 1rem;
  }
}
</style>
