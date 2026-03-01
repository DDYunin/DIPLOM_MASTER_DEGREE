<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Card from "primevue/card";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

// Данные теста
const testTitle = ref("Тест по программированию");
const questions = ref([]);
const currentQuestionIndex = ref(0);
const timeLeft = ref(45 * 60); // 45 минут в секундах
const timer = ref(null);
const exitDialogVisible = ref(false);
const submitDialogVisible = ref(false);

// Инициализация теста
onMounted(() => {
  loadTestQuestions(route.params.testId);
  startTimer();
});

onBeforeUnmount(() => {
  stopTimer();
});

const loadTestQuestions = (testId) => {
  // Имитация загрузки вопросов с API
  setTimeout(() => {
    questions.value = [
      {
        id: 1,
        text: "Что такое переменная в программировании?",
        options: [
          "Именованная область памяти",
          "Тип данных",
          "Функция",
          "Оператор",
        ],
        answer: null,
        marked: false,
      },
      {
        id: 2,
        text: "Какой оператор используется для сравнения на равенство в JavaScript?",
        options: [
          "=",
          "==",
          "===",
          "Все перечисленные",
        ],
        answer: null,
        marked: false,
      },
      {
        id: 3,
        text: "Что выведет console.log(typeof null) в JavaScript?",
        options: [
          "null",
          "undefined",
          "object",
          "string",
        ],
        answer: null,
        marked: false,
      },
      {
        id: 4,
        text: "Какой метод массива добавляет элементы в конец?",
        options: [
          "push()",
          "pop()",
          "shift()",
          "unshift()",
        ],
        answer: null,
        marked: false,
      },
      {
        id: 5,
        text: "Что такое замыкание (closure) в JavaScript?",
        options: [
          "Функция внутри другой функции",
          "Объект с методами",
          "Способность функции запоминать лексическое окружение",
          "Синтаксическая конструкция",
        ],
        answer: null,
        marked: false,
      },
    ];
  }, 300);
};

// Таймер
const startTimer = () => {
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      stopTimer();
      submitTest();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
});

// Текущий вопрос
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {});

// Навигация по вопросам
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const goToQuestion = (index) => {
  currentQuestionIndex.value = index;
};

// Работа с ответами
const selectAnswer = (optionIndex) => {
  questions.value[currentQuestionIndex.value].answer = optionIndex;
};

const isOptionSelected = (optionIndex) => questions.value[currentQuestionIndex.value].answer === optionIndex;

const toggleMark = () => {
  questions.value[currentQuestionIndex.value].marked =
    !questions.value[currentQuestionIndex.value].marked;
};

// Статистика
const answeredCount = computed(() => questions.value.filter(q => q.answer !== null).length);

// Завершение теста
const confirmExit = () => {
  exitDialogVisible.value = true;
};

const exitTest = () => {
  // Здесь можно сохранить прогресс
  router.push({ name: "StudentCourse", params: { id: route.params.courseId } });
};

const confirmSubmit = () => {
  submitDialogVisible.value = true;
};

const submitTest = () => {
  stopTimer();

  localStorage.setItem(
    "testResult",
    JSON.stringify({
      answered: answeredCount.value,
      total: questions.value.length,
      title: testTitle.value,
    })
  );
  toast.add({
    severity: "success",
    summary: "Тест завершен",
    detail: `Вы ответили на ${answeredCount.value} из ${questions.value.length} вопросов`,
    life: 5000,
  });
  router.push({
    name: "TestResults",
    params: {
      courseId: route.params.courseId,
      testId: route.params.testId,
    },
  });
};
</script>

<template>
  <div class="test-execution">
    <!-- Шапка теста -->
    <div class="test-header">
      <div class="header-left">
        <Button
          icon="pi pi-arrow-left"
          label="Выйти из теста"
          class="p-button-text"
          @click="confirmExit"
        />
        <h2>{{ testTitle }}</h2>
      </div>
      <div class="timer">
        <i class="pi pi-clock" />
        <span>{{ formattedTime }}</span>
      </div>
    </div>

    <div class="test-content">
      <!-- Боковая панель с вопросами -->
      <div class="questions-sidebar">
        <div class="questions-list">
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            class="question-circle"
            :class="{
              'current': currentQuestionIndex === index,
              'answered': question.answer !== null,
              'marked': question.marked
            }"
            @click="goToQuestion(index)"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>

      <!-- Основное содержимое вопроса -->
      <div class="question-content">
        <Card>
          <template #title>
            Вопрос {{ currentQuestionIndex + 1 }} из {{ questions.length }}
          </template>
          <template #content>
            <div class="question-text">
              {{ currentQuestion.text }}
            </div>

            <!-- Варианты ответов -->
            <div class="answer-options">
              <div
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="option"
                :class="{ 'selected': isOptionSelected(index) }"
                @click="selectAnswer(index)"
              >
                <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
                <span class="option-text">{{ option }}</span>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="question-navigation">
              <Button
                label="Предыдущий"
                icon="pi pi-chevron-left"
                :disabled="currentQuestionIndex === 0"
                @click="prevQuestion"
              />
              <Button
                label="Следующий"
                icon="pi pi-chevron-right"
                icon-pos="right"
                :disabled="currentQuestionIndex === questions.length - 1"
                @click="nextQuestion"
              />
              <Button
                label="Отметить вопрос"
                icon="pi pi-bookmark"
                class="p-button-text"
                @click="toggleMark"
              />
              <Button
                label="Завершить тест"
                icon="pi pi-check"
                class="p-button-sm"
                @click="confirmSubmit"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Диалог подтверждения выхода -->
    <Dialog
      v-model:visible="exitDialogVisible"
      header="Подтверждение выхода"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle mr-3"
          style="font-size: 2rem"
        />
        <span>Вы уверены, что хотите выйти? Прогресс будет сохранен.</span>
      </div>
      <template #footer>
        <Button
          label="Нет"
          icon="pi pi-times"
          class="p-button-text"
          @click="exitDialogVisible = false"
        />
        <Button
          label="Да"
          icon="pi pi-check"
          autofocus
          @click="exitTest"
        />
      </template>
    </Dialog>

    <!-- Диалог подтверждения завершения -->
    <Dialog
      v-model:visible="submitDialogVisible"
      header="Завершение теста"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-info-circle mr-3"
          style="font-size: 2rem"
        />
        <span>Вы ответили на {{ answeredCount }} из {{ questions.length }} вопросов. Завершить тест?</span>
      </div>
      <template #footer>
        <Button
          label="Нет"
          icon="pi pi-times"
          class="p-button-text"
          @click="submitDialogVisible = false"
        />
        <Button
          label="Завершить"
          icon="pi pi-check"
          autofocus
          @click="submitTest"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.test-execution {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
}

.test-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.questions-sidebar {
  width: 80px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #dee2e6;
  background: #f8f9fa;
}

.questions-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  overflow-y: auto;
}

.question-circle {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1f1f1;
  border: 2px solid transparent;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.question-circle:hover {
  background: #e0e0e0;
}

.question-circle.current {
  background: black;
  color: white;
}

.question-circle.answered {
  background: #d0f0d0;
  border-color: #2e7d32;
}

.question-circle.marked {
  border: 2px solid #ff9800;
}

.sidebar-actions {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}

.question-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.question-text {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  cursor: pointer;
  transition: all 0.2s;
}

.option:hover {
  background: #f8f9fa;
}

.option.selected {
  background: #e3f2fd;
  border-color: #90caf9;
}

.option-letter {
  font-weight: bold;
  color: black;
}

.question-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.confirmation-content {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .questions-sidebar {
    width: 60px;
  }

  .questions-list {
    grid-template-columns: repeat(2, 1fr);
    padding: 0.5rem;
  }

  .question-number {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }

  .question-navigation {
    flex-direction: column;
    gap: 0.5rem;
  }

  .question-navigation button {
    width: 100%;
  }
}
</style>
