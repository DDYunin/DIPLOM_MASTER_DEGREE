<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import Panel from "primevue/panel";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Данные курса
const course = ref({
  id: null,
  title: "",
  progress: 0,
  blocks: [],
});

// Инициализация collapsed состояния для каждого блока
const initializeBlocks = (blocks) => blocks.map(block => ({
  ...block,
  collapsed: false,
}));

// Загрузка данных курса
onMounted(() => {
  loadCourseData(route.params.id);
});

const loadCourseData = (courseId) => {
  // Имитация загрузки данных с API
  setTimeout(() => {
    const mockData = {
      id: courseId,
      title: `Основы программирования (Группа ${courseId})`,
      progress: 65,
      blocks: [
        {
          id: 1,
          title: "Блок 1: Введение в программирование",
          lectures: [
            {
              id: 1,
              title: "Лекция 1.1: Основные понятия",
              fileUrl: "/files/lecture1.pdf",
            },
            {
              id: 2,
              title: "Лекция 1.2: Переменные и типы данных",
              fileUrl: "/files/lecture2.pdf",
            },
          ],
          practices: [
            {
              id: 1,
              title: "Практика 1.1: Установка среды разработки",
              fileUrl: "/files/practice1.docx",
            },
          ],
          test: {
            id: 1,
            title: "Тест по основам программирования",
          },
        },
        {
          id: 2,
          title: "Блок 2: Условные операторы и циклы",
          lectures: [
            {
              id: 3,
              title: "Лекция 2.1: Условные операторы",
              fileUrl: "/files/lecture3.pdf",
            },
          ],
          practices: [
            {
              id: 2,
              title: "Практика 2.1: Решение задач с условиями",
              fileUrl: "/files/practice2.docx",
            },
            {
              id: 3,
              title: "Практика 2.2: Решение задач с циклами",
              fileUrl: "/files/practice3.docx",
            },
          ],
          test: {
            id: 2,
            title: "Тест по условным операторам и циклам",
          },
        },
      ],
    };

    course.value = {
      ...mockData,
      blocks: initializeBlocks(mockData.blocks),
    };
  }, 300);
};

// Прогресс курса
const courseProgress = computed(() => course.value.progress);

// Навигация
const navigateToStats = () => {
  router.push({ name: "CourseStats", params: { id: route.params.id } });
};

const navigateToTest = (testId) => {
  router.push({
    name: "CourseTest",
    params: {
      courseId: route.params.id,
      testId: testId,
    },
  });
};

// Загрузка файлов
const downloadFile = (url) => {
  toast.add({
    severity: "info",
    summary: "Загрузка файла",
    detail: `Скачивание файла по адресу: ${url}`,
    life: 3000,
  });

  // Эмуляция загрузки
  const link = document.createElement("a");
  link.href = url;
  link.download = url.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="student-course">
    <!-- Шапка курса -->
    <div class="course-header">
      <div class="header-content">
        <h1>{{ course.title }}</h1>
        <Button
          label="Статистика курса"
          icon="pi pi-chart-bar"
          @click="navigateToStats"
        />
      </div>
      <ProgressBar
        :value="courseProgress"
        :show-value="false"
      />
    </div>

    <!-- Список блоков курса -->
    <div class="course-blocks">
      <Panel
        v-for="block in course.blocks"
        :key="block.id"
        :header="block.title"
        toggleable
      >
        <!-- Лекции -->
        <div
          v-show="!block.collapsed"
          class="materials-section"
        >
          <h3><i class="pi pi-book" /> Лекции</h3>
          <div class="materials-list">
            <div
              v-for="lecture in block.lectures"
              :key="lecture.id"
              class="material-item"
            >
              <div class="material-info">
                <i class="pi pi-file-pdf" />
                <span>{{ lecture.title }}</span>
              </div>
              <Button
                icon="pi pi-download"
                label="Скачать"
                class="p-button-sm p-button-outlined"
                @click="downloadFile(lecture.fileUrl)"
              />
            </div>
          </div>
        </div>

        <!-- Практики -->
        <div
          v-show="!block.collapsed"
          class="materials-section"
        >
          <h3><i class="pi pi-pencil" /> Практические задания</h3>
          <div class="materials-list">
            <div
              v-for="practice in block.practices"
              :key="practice.id"
              class="material-item"
            >
              <div class="material-info">
                <i class="pi pi-file-word" />
                <span>{{ practice.title }}</span>
              </div>
              <Button
                icon="pi pi-download"
                label="Скачать"
                class="p-button-sm p-button-outlined"
                @click="downloadFile(practice.fileUrl)"
              />
            </div>
          </div>
        </div>

        <!-- Тесты -->
        <div
          v-if="block.test"
          v-show="!block.collapsed"
          class="materials-section"
        >
          <h3><i class="pi pi-question-circle" /> Тест</h3>
          <div class="materials-list">
            <div class="material-item">
              <div class="material-info">
                <i class="pi pi-check-square" />
                <span>{{ block.test.title }}</span>
              </div>
              <Button
                icon="pi pi-external-link"
                label="Пройти тест"
                class="p-button-sm"
                @click="navigateToTest(block.test.id)"
              />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  </div>
</template>

<style scoped>
.student-course {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.course-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.course-blocks {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.materials-section {
  margin-bottom: 1.5rem;
}

.materials-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: black;
  margin-bottom: 1rem;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.material-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.material-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.material-info i {
  font-size: 1.25rem;
  color: black;
}

/* Стили для Panel */
:deep(.p-panel-header) {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

:deep(.p-panel-content) {
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-top: none;
}

/* Адаптивность */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .material-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
