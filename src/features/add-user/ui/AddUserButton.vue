<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const { t } = useI18n()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <Button
    :label="t('addUser.addUser')"
    icon="pi pi-plus"
    class="btn-add"
    @click="emit('click')"
  />
</template>

<style scoped>
.btn-add {
  background: var(--color-primary-strong);
  border: none;
}
</style>
