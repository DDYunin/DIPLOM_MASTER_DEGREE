<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/entities/assessment'
import { AssessmentInfo } from '@/widgets/assessment-info'

const route = useRoute()
const store = useAssessmentStore()

onMounted(() => {
  const assessmentId = route.params.assessmentId as string
  if (assessmentId) {
    store.loadAssessment(assessmentId)
  }
})
</script>

<template>
  <div class="assessment-page">
    <AssessmentInfo />
  </div>
</template>
