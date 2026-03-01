<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ProgressBar from "primevue/progressbar";
import Tag from "primevue/tag";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Данные курса
const courseTitle = ref("Загрузка...");
const testResults = ref([]);
const controlWorks = ref([]);
const otherWorks = ref([]);

// Загрузка данных
onMounted(() => {
  loadCourseStats(route.params.id);
});

const loadCourseStats = (courseId) => {
  // Имитация загрузки данных с API
  setTimeout(() => {
    courseTitle.value = `Основы программирования (Группа ${courseId})`;

    testResults.value = [
      { id: 1, title: "Тест по основам программирования", date: "15.10.2023", score: 85, maxScore: 100, status: "Завершено" },
      { id: 2, title: "Тест по условным операторам", date: "22.10.2023", score: 72, maxScore: 100, status: "Завершено" },
      { id: 3, title: "Итоговый тест", date: "05.11.2023", score: 0, maxScore: 100, status: "Не начато" },
    ];

    controlWorks.value = [
      { id: 1, title: "Контрольная работа 1", date: "18.10.2023", score: 18, maxScore: 20, grade: "5" }, { id: 2, title: "Контрольная работа 2", date: "25.10.2023", score: 15, maxScore: 20, grade: "4" },
    ];

    otherWorks.value = [
      { id: 1, title: "Практическая работа 1", type: "Практика", date: "20.10.2023", status: "Принято" },
      { id: 2, title: "Индивидуальный проект", type: "Проект", date: "30.10.2023", status: "На проверке" },
      { id: 3, title: "Лабораторная работа 3", type: "Лабораторная", date: "", status: "Не сдано" },
    ];
  }, 300);
};

// Навигация
const navigateToCourse = () => {
  router.push({ name: "StudentCourse", params: { id: route.params.id } });
};

const viewWorkDetails = (work) => {
  toast.add({
    severity: "info",
    summary: "Просмотр работы",
    detail: `Открыты детали работы: ${work.title}`,
    life: 3000,
  });
};

// Вспомогательные функции
const getStatusSeverity = (status) => {
  switch (status) {
    case "Завершено":
    case "Принято":
      return "success";
    case "На проверке":
      return "warning";
    default:
      return "danger";
  }
};

const getGradeSeverity = (grade) => {
  switch (grade) {
    case "5": return "success";
    case "4": return "info";
    case "3": return "warning";
    default: return "danger";
  }
};
</script>

<template>
  <div class="course-stats">
    <!-- Шапка с навигацией -->
    <div class="stats-header">
      <Button
        icon="pi pi-arrow-left"
        label="Назад к курсу"
        class="p-button-text"
        @click="navigateToCourse"
      />
      <h1>Статистика по курсу: {{ courseTitle }}</h1>
    </div>

    <!-- Основная статистика -->
    <div class="stats-content">
      <!-- Результаты тестов -->
      <Card class="stats-card">
        <template #title>
          <i class="pi pi-question-circle" /> Результаты тестов
        </template>
        <template #content>
          <DataTable
            :value="testResults"
            class="p-datatable-sm"
          >
            <Column
              field="title"
              header="Тест"
            />
            <Column
              field="date"
              header="Дата"
            />
            <Column
              field="score"
              header="Баллы"
            >
              <template #body="{data}">
                <ProgressBar
                  :value="data.score"
                  :show-value="true"
                />
              </template>
            </Column>
            <Column header="Статус">
              <template #body="{data}">
                <Tag
                  :value="data.status"
                  :severity="getStatusSeverity(data.status)"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Результаты контрольных -->
      <Card class="stats-card">
        <template #title>
          <i class="pi pi-file-edit" /> Результаты контрольных
        </template>
        <template #content>
          <DataTable
            :value="controlWorks"
            class="p-datatable-sm"
          >
            <Column
              field="title"
              header="Работа"
            />
            <Column
              field="date"
              header="Дата"
            />
            <Column
              field="score"
              header="Баллы"
            />
            <Column
              field="maxScore"
              header="Макс. балл"
            />
            <Column header="Оценка">
              <template #body="{data}">
                <Tag
                  :value="data.grade"
                  :severity="getGradeSeverity(data.grade)"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Другие работы -->
      <Card class="stats-card">
        <template #title>
          <i class="pi pi-file" /> Другие работы
        </template>
        <template #content>
          <DataTable
            :value="otherWorks"
            class="p-datatable-sm"
          >
            <Column
              field="title"
              header="Работа"
            />
            <Column
              field="type"
              header="Тип"
            />
            <Column
              field="date"
              header="Дата сдачи"
            />
            <Column
              field="status"
              header="Статус"
            >
              <template #body="{data}">
                <Tag
                  :value="data.status"
                  :severity="getStatusSeverity(data.status)"
                />
              </template>
            </Column>
            <Column header="Действия">
              <template #body="{data}">
                <Button
                  icon="pi pi-eye"
                  class="p-button-sm p-button-text"
                  @click="viewWorkDetails(data)"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.course-stats {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.stats-header h1 {
  margin: 0;
  flex-grow: 1;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-card {
  margin-bottom: 1.5rem;
}

/* Стили для таблиц */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-datatable .p-column-header-content) {
  font-weight: 600;
}

/* Адаптивность */
@media (max-width: 768px) {
  .stats-header {
    flex-direction: column;
    align-items: flex-start;
  }

  :deep(.p-datatable) {
    font-size: 0.8rem;
  }
}
</style>
