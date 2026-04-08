<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import Select from 'primevue/select'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Skeleton from 'primevue/skeleton'

// ✅ Импорт только через Public API сущности
import { useStudentCourseStore, StudentCourseCard } from '@/entities/course'

const store = useStudentCourseStore()

const searchQuery = ref('')
const statusFilter = ref<'Active' | 'Completed'>('Active')
const statusOptions = [
  { label: 'Current Courses', value: 'Active' },
  { label: 'Past Courses', value: 'Completed' }
]

const sortOption = ref('title')
const sortOptions = [
  { label: 'Title (A-Z)', value: 'title' },
  { label: 'Code', value: 'code' }
]

onMounted(() => {
  store.loadCourses()
})

const filteredCourses = computed(() => {
  // Фильтруем по статусу напрямую через стор
  let result =
    statusFilter.value === 'Active' ? [...store.activeCourses] : [...store.completedCourses]

  // Фильтр по поиску
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (c) => c.title.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
    )
  }

  // Сортировка
  result.sort((a, b) => {
    if (sortOption.value === 'title') return a.title.localeCompare(b.title)
    if (sortOption.value === 'code') return a.code.localeCompare(b.code)
    return 0
  })

  return result
})

const handleResume = (id: string) => {
  console.log('Navigate to course:', id)
}

const handleSyllabus = (id: string) => {
  console.log('Open syllabus:', id)
}
</script>

<template>
  <div class="student-courses">
    <!-- Controls (Search & Filters) -->
    <div class="controls-wrapper">
      <div class="search-area">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Search courses by name or code..."
            class="search-input"
          />
        </IconField>
      </div>

      <div class="filters-area">
        <Select
          v-model="sortOption"
          :options="sortOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Sort By"
          class="sort-select"
        />
        <SelectButton
          v-model="statusFilter"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          :allowEmpty="false"
        />
      </div>
    </div>

    <!-- Grid -->
    <div v-if="store.isLoading" class="courses-grid">
      <Skeleton v-for="i in 3" :key="i" height="320px" borderRadius="var(--p-border-radius)" />
    </div>

    <div v-else-if="filteredCourses.length > 0" class="courses-grid">
      <StudentCourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :course="course"
        @resume="handleResume"
        @syllabus="handleSyllabus"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="pi pi-book empty-icon"></i>
      <p class="empty-text">No courses found matching your criteria.</p>
    </div>
  </div>
</template>

<style scoped>
.student-courses {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.controls-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-area {
  flex-grow: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
}

.filters-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-select {
  min-width: 160px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: var(--p-surface-0);
  border: 1px dashed var(--p-surface-300);
  border-radius: var(--p-border-radius);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--p-surface-400);
}

.empty-text {
  color: var(--p-text-muted-color);
  font-weight: 500;
}
</style>
