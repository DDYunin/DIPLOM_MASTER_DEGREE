<script setup>
import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import Button from "primevue/button";

const route = useRoute();
const router = useRouter();

const testTitle = ref("Тест");
const totalQuestions = ref(0);
const answeredCount = ref(0);

onMounted(() => {
  const storedResult = JSON.parse(localStorage.getItem("testResult"));
  if (storedResult) {
    testTitle.value = storedResult.title || testTitle.value;
    totalQuestions.value = storedResult.total || 0;
    answeredCount.value = storedResult.answered || 0;
  }
});

const goToCourse = () => {
  router.push({name: "StudentCourse", params: {id: route.params.courseId}});
};
</script>

<template>
  <div class="test-results">
    <div class="results-container">
      <h1 class="results-title">
        Результаты теста
      </h1>
      <h2 class="test-title">
        {{ testTitle }}
      </h2>
      <p class="results-summary">
        Вы ответили на <strong>{{ answeredCount }}</strong> из <strong>{{ totalQuestions }}</strong> вопросов.
      </p>

      <Button
        label="Вернуться к курсу"
        icon="pi pi-arrow-left"
        class="return-button"
        @click="goToCourse"
      />
    </div>
  </div>
</template>

<style scoped>
.test-results {
  background: white;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.results-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.results-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.test-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #666;
}

.results-summary {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.return-button {
  font-size: 1rem;
}
</style>
