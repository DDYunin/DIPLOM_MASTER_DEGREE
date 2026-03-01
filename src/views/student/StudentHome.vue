<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ProgressBar from "primevue/progressbar";
import Button from "primevue/button";

const router = useRouter();

const courses = ref([
  { id: 1, title: "Основы программирования", progress: 65 },
  { id: 2, title: "Веб-разработка", progress: 30 },
  { id: 3, title: "Базы данных", progress: 10 },
]);

const goToCourse = (courseId) => {
  router.push({ name: "StudentCourse", params: { id: courseId } });
};
</script>

<template>
  <div class="student-home">
    <Card>
      <template #title>
        Мои курсы
      </template>
      <template #content>
        <DataTable
          :value="courses"
          class="p-datatable-sm"
        >
          <Column
            field="title"
            header="Название"
          />
          <Column
            field="progress"
            header="Прогресс"
          >
            <template #body="{data}">
              <ProgressBar :value="data.progress" />
            </template>
          </Column>
          <Column header="Действия">
            <template #body="{data}">
              <Button
                icon="pi pi-play"
                label="Продолжить"
                class="p-button-sm"
                @click="goToCourse(data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>
