<script setup lang="ts">
import { ref } from 'vue'

import AddUserButton from './AddUserButton.vue'
import AddUserModal from './AddUserModal.vue'

const isModalVisible = ref(false)
</script>

<template>
  <AddUserButton @click="isModalVisible = true" />
  <AddUserModal v-model:visible="isModalVisible" />
</template>
